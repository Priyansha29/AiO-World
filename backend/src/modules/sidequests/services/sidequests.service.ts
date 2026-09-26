/**
 * Sidequests service — all of the feature's behaviour lives here.
 *
 * Two rules shape this file:
 *
 *  1. **No AI, no black box.** Ranking is an explicit sum of named weights, and
 *     the discovery mix is a plain table at the top of `types/sidequests.ts`.
 *     Anyone can read why an item was chosen, and change it deliberately.
 *  2. **Boring beats clever.** "Picked for you" is *deterministic*: the same
 *     interests produce the same row on every reload. A recommendation shelf
 *     that reshuffles when you refresh reads as broken. Only "surprise me"
 *     varies, and it varies by rolling a band and picking inside it — never by
 *     sampling uniformly across the whole table.
 */
import {
  DISCOVERY_MIX,
  MAX_PER_INTEREST_IN_A_ROW,
  type Interest,
  type InterestCategory,
  type InterestCircle,
  type PersonalisationContext,
  type SidequestContent,
  type SidequestEvent,
  type SidequestUserId,
} from "../types/sidequests.js";
import {
  type EventFilters,
  type InterestPopularityRow,
  type SidequestsRepository,
} from "../repository/sidequests-repository.js";

/* ── Weights ─────────────────────────────────────────────────────────────── */

/**
 * Named, so the trade-off is visible. These are the six factors the product
 * asked for; college and city relevance apply to events and circles, which are
 * the only records that actually carry a place.
 */
const WEIGHT = {
  /** The dominant signal: this is literally something you picked. */
  interestMatch: 40,
  /** A tag that names one of your interests, but is not the primary one. */
  tagMatch: 6,
  /** Recent content first, decaying to zero over `RECENCY_WINDOW_DAYS`. */
  recencyMax: 12,
  recencyWindowDays: 60,
  /** Curatorial boost. Small — it should tilt, not dictate. */
  featured: 8,
} as const;

/* ── Small deterministic helpers ─────────────────────────────────────────── */

/**
 * FNV-1a. Used only to break ties in a way that is stable between requests, so
 * a shelf does not reshuffle on reload. It is a hash, not a random source.
 */
function stableHash(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function daysSince(iso: string, now: number): number {
  return (now - new Date(iso).getTime()) / 86_400_000;
}

function recencyScore(publishedAt: string, now: number): number {
  const age = daysSince(publishedAt, now);
  if (age < 0) return WEIGHT.recencyMax;
  if (age >= WEIGHT.recencyWindowDays) return 0;
  return Math.round(WEIGHT.recencyMax * (1 - age / WEIGHT.recencyWindowDays));
}

/* ── Ranking ─────────────────────────────────────────────────────────────── */

export interface ScoredContent {
  item: SidequestContent;
  score: number;
  /** Why it scored what it did — surfaced so the shelf can explain itself. */
  reasons: string[];
}

function scoreContent(
  item: SidequestContent,
  context: PersonalisationContext,
  now: number,
): ScoredContent {
  const reasons: string[] = [];
  let score = 0;

  if (context.interestSlugs.includes(item.interestSlug)) {
    score += WEIGHT.interestMatch;
    reasons.push("matches an interest you picked");
  }

  // A tag that names one of your interests can pull an item in from a
  // neighbouring interest without pretending it is a direct match.
  const interestNames = new Set(
    context.interestSlugs.map((slug) => slug.replace(/-/g, " ")),
  );
  const tagHits = item.tags.filter((tag) =>
    interestNames.has(tag.toLowerCase().replace(/-/g, " ")),
  ).length;
  if (tagHits > 0) {
    score += WEIGHT.tagMatch * tagHits;
    reasons.push("shares a tag with your interests");
  }

  const recency = recencyScore(item.publishedAt, now);
  if (recency > 0) score += recency;

  if (item.isFeatured) {
    score += WEIGHT.featured;
    reasons.push("picked by our editors");
  }

  return { item, score, reasons };
}

/**
 * "Picked for you".
 *
 * Ranking alone produces a shelf of five running items for someone who picked
 * running, which is the failure mode the product brief calls out explicitly. So
 * selection is greedy-with-a-cap rather than a plain sort: no interest may
 * contribute more than `MAX_PER_INTEREST_IN_A_ROW` items, and at least one
 * wildcard is reserved so the row is never entirely made of things you already
 * told us about.
 *
 * The cap is relaxed rather than returned short, so a small catalogue can never
 * produce an under-filled row.
 */
export function forYou(
  repository: SidequestsRepository,
  context: PersonalisationContext,
  limit = 8,
  now = Date.now(),
): ScoredContent[] {
  const ranked = repository
    .listContent()
    .map((item) => scoreContent(item, context, now))
    .sort(
      (a, b) => b.score - a.score || stableHash(a.item.id) - stableHash(b.item.id),
    );

  if (ranked.length === 0) return [];

  const picked: ScoredContent[] = [];
  const perInterest = new Map<string, number>();

  const tryPick = (cap: number): void => {
    for (const candidate of ranked) {
      if (picked.length >= limit) return;
      if (picked.some((entry) => entry.item.id === candidate.item.id)) continue;
      const used = perInterest.get(candidate.item.interestSlug) ?? 0;
      if (used >= cap) continue;
      perInterest.set(candidate.item.interestSlug, used + 1);
      picked.push(candidate);
    }
  };

  tryPick(MAX_PER_INTEREST_IN_A_ROW);
  // Catalogue smaller than the cap allows — top it up without the ceiling.
  if (picked.length < limit) tryPick(Number.POSITIVE_INFINITY);

  // One deliberate wildcard, so a user who picked four similar things still
  // gets shown something they did not ask for.
  if (context.interestSlugs.length >= 2 && limit >= 4) {
    const wildcard = ranked.find(
      (candidate) => !context.interestSlugs.includes(candidate.item.interestSlug),
    );
    if (wildcard && picked.length >= limit) {
      picked[picked.length - 1] = wildcard;
    } else if (wildcard) {
      picked.push(wildcard);
    }
  }

  return picked.slice(0, limit);
}

/* ── Discovery ───────────────────────────────────────────────────────────── */

type DiscoveryBand = "onInterest" | "adjacent" | "unexpected";

/**
 * Roll the band, then pick inside it.
 *
 * Deliberately *not* `Math.random()` over every row: that produces a uniformly
 * random feed that is mostly irrelevant, which is not what "surprise me" means.
 * The mix is 70% on-interest, 20% adjacent shelf, 10% genuinely unexpected, and
 * the weights live in `DISCOVERY_MIX` so they are a one-line product decision.
 */
function rollBand(): DiscoveryBand {
  const roll = Math.random();
  if (roll < DISCOVERY_MIX.onInterest) return "onInterest";
  if (roll < DISCOVERY_MIX.onInterest + DISCOVERY_MIX.adjacent) return "adjacent";
  return "unexpected";
}

/** Band order used when a band has nothing left to offer. */
const BAND_FALLBACK: Record<DiscoveryBand, DiscoveryBand[]> = {
  onInterest: ["onInterest", "adjacent", "unexpected"],
  adjacent: ["adjacent", "onInterest", "unexpected"],
  unexpected: ["unexpected", "adjacent", "onInterest"],
};

function candidatesForBand(
  band: DiscoveryBand,
  repository: SidequestsRepository,
  context: PersonalisationContext,
): SidequestContent[] {
  const all = repository.listContent();
  switch (band) {
    case "onInterest":
      return context.interestSlugs.length === 0
        ? []
        : all.filter((item) => context.interestSlugs.includes(item.interestSlug));
    case "adjacent":
      return context.interestCategories.length === 0
        ? []
        : all.filter(
            (item) =>
              context.interestCategories.includes(item.category) &&
              !context.interestSlugs.includes(item.interestSlug),
          );
    case "unexpected":
      return all.filter(
        (item) =>
          !context.interestSlugs.includes(item.interestSlug) &&
          !context.interestCategories.includes(item.category),
      );
  }
}

export interface DiscoveryResult {
  item: SidequestContent;
  band: DiscoveryBand;
  /** True when nothing was picked from any interest category at all. */
  offScript: boolean;
  remainingInBand: number;
}

/**
 * Roll once against a given "already seen" set, falling through bands that have
 * run dry. Returns `null` only if the whole catalogue is excluded.
 *
 * Shared by `discover` and `discoverPreview` so the two cannot drift: the same
 * bands, the same featured-first preference, the same fallbacks.
 */
function rollFromBand(
  repository: SidequestsRepository,
  context: PersonalisationContext,
  history: ReadonlySet<string>,
): DiscoveryResult | null {
  const band = rollBand();
  for (const candidate of BAND_FALLBACK[band]) {
    const pool = candidatesForBand(candidate, repository, context).filter(
      (item) => !history.has(item.id),
    );
    if (pool.length === 0) continue;
    // Featured first, so the "surprise" leans towards the good stuff when a band
    // happens to contain several equally valid options.
    const chosen =
      pool.find((item) => item.isFeatured) ??
      pool[Math.floor(Math.random() * pool.length)];
    return {
      item: chosen,
      band: candidate,
      offScript:
        !context.interestSlugs.includes(chosen.interestSlug) &&
        !context.interestCategories.includes(chosen.category),
      remainingInBand: pool.length - 1,
    };
  }
  return null;
}

/**
 * A discovery pick that does *not* count as seen.
 *
 * The overview needs something in the discovery card so the section is never
 * empty on arrival, but a preview must not consume a turn — otherwise simply
 * loading the page advanced the student's discovery history, and the first real
 * "Give me another" would skip a band for a reason nobody could see.
 */
export function discoverPreview(
  repository: SidequestsRepository,
  context: PersonalisationContext,
): DiscoveryResult | null {
  return rollFromBand(repository, context, new Set(context.recentlySeen));
}

/**
 * Serve one surprise, and record it.
 *
 * Recently-shown items are excluded first, and a band that has run dry falls
 * through to the next rather than returning nothing. If the whole catalogue is
 * exhausted (a small library, an enthusiastic clicker) the history is cleared
 * once and the roll happens again, so the button never dead-ends.
 *
 * `exclude` is the caller's one-off list — in practice the card the student is
 * looking at right now. It exists because the preview in the overview is
 * deliberately *not* recorded, so without it the first press of "Give me another"
 * can return the card already on screen. The button would then look broken even
 * though it had done exactly what it was asked. Excluding it here costs one
 * query parameter and does not touch the history.
 */
export function discover(
  repository: SidequestsRepository,
  context: PersonalisationContext,
  remember: (userId: SidequestUserId, contentId: string) => void,
  exclude: readonly string[] = [],
): DiscoveryResult | null {
  const total = repository.listContent().length;
  if (total === 0) return null;

  const seen = new Set<string>([...context.recentlySeen, ...exclude]);
  let result = rollFromBand(repository, context, seen);
  if (!result && seen.size > 0) result = rollFromBand(repository, context, new Set<string>());
  if (!result) return null;

  remember(context.userId, result.item.id);
  return result;
}

/* ── Events ──────────────────────────────────────────────────────────────── */

function isWeekend(iso: string): boolean {
  const day = new Date(iso).getDay();
  return day === 0 || day === 6;
}

/**
 * Events are always filtered to "not already over" — showing a student an event
 * that finished last Tuesday is the fastest way to make a whole section feel
 * broken.
 */
export function listEvents(
  repository: SidequestsRepository,
  filters: EventFilters = {},
  now = Date.now(),
): SidequestEvent[] {
  const limit = filters.limit ?? 12;
  const horizon = now + (filters.withinDays ?? 60) * 86_400_000;

  return repository
    .listEvents()
    .filter((event) => {
      const start = new Date(event.startTime).getTime();
      if (start < now || start > horizon) return false;

      if (filters.collegeId) {
        const sameCollege = event.collegeId === filters.collegeId;
        const cityWide = event.collegeId === null;
        if (!sameCollege && !(filters.includeCityWide !== false && cityWide)) {
          return false;
        }
      }

      if (filters.city) {
        const sameCity = event.city.toLowerCase() === filters.city.toLowerCase();
        const cityWide = event.collegeId === null;
        if (!sameCity && !cityWide) return false;
      }

      if (filters.category && event.category !== filters.category) return false;
      if (filters.freeOnly && !event.isFree) return false;
      if (filters.weekendOnly && !isWeekend(event.startTime)) return false;

      if (filters.interestSlugs && filters.interestSlugs.length > 0) {
        const matches = event.interestSlugs.some((slug) =>
          filters.interestSlugs?.includes(slug),
        );
        if (!matches) return false;
      }

      return true;
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .slice(0, limit);
}

/* ── Circles ─────────────────────────────────────────────────────────────── */

export interface CircleWithMembership extends InterestCircle {
  /** True when the current user has joined. */
  joined: boolean;
  /** Seeded count, incremented locally when the current user joins. */
  memberCount: number;
}

export function listCircles(
  repository: SidequestsRepository,
  options: {
    userId: SidequestUserId;
    collegeId?: string | null;
    city?: string | null;
    interestSlug?: string;
    limit?: number;
  },
): CircleWithMembership[] {
  const joinedIds = new Set(
    repository
      .listCircleMemberships(options.userId)
      .map((membership) => membership.circleId),
  );

  return repository
    .listCircles()
    .filter((circle) => {
      if (options.interestSlug && circle.interestSlug !== options.interestSlug) {
        return false;
      }
      if (options.collegeId) {
        const sameCollege = circle.collegeId === options.collegeId;
        const cityWide = circle.collegeId === null;
        if (!sameCollege && !cityWide) return false;
      }
      if (options.city) {
        const sameCity =
          circle.city?.toLowerCase() === options.city.toLowerCase();
        if (!sameCity && circle.collegeId !== null) return false;
      }
      return true;
    })
    .map((circle) => {
      const joined = joinedIds.has(circle.id);
      return {
        ...circle,
        joined,
        memberCount: circle.memberCount + (joined ? 1 : 0),
      };
    })
    .sort((a, b) => {
      // Circles the user has already joined float up; then the big ones.
      if (a.joined !== b.joined) return a.joined ? -1 : 1;
      return b.memberCount - a.memberCount;
    })
    .slice(0, options.limit ?? 12);
}

/* ── People around you ───────────────────────────────────────────────────── */

export interface InterestWithInterest {
  interest: Interest;
  count: number;
}

/**
 * Anonymous aggregate counts. Two groups, because the useful question is "is
 * anyone at my college into this" and the second-best one is "is anyone at all".
 * There is no name, id or avatar to leak here by construction.
 */
export function peopleAroundYou(
  repository: SidequestsRepository,
  context: PersonalisationContext,
  limit = 6,
): { yours: InterestWithInterest[]; popular: InterestWithInterest[] } {
  const rows: InterestPopularityRow[] = repository.interestPopularity(
    context.collegeId,
  );

  const decorated = rows
    .map((row) => {
      const interest = repository.findInterestBySlug(row.interestSlug);
      return interest ? { interest, count: row.count } : null;
    })
    .filter((entry): entry is InterestWithInterest => entry !== null);

  const yours = decorated
    .filter((entry) => context.interestSlugs.includes(entry.interest.slug))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  const yoursIds = new Set(yours.map((entry) => entry.interest.slug));

  const popular = decorated
    .filter((entry) => !yoursIds.has(entry.interest.slug))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return { yours, popular };
}

/* ── Sidequest of the week ───────────────────────────────────────────────── */

/**
 * One highlighted sidequest, stable for the whole ISO week.
 *
 * Chosen by hashing the week number against the challenge/instant pool, so
 * everyone sees the same one and it changes on Monday. There is no "next"
 * button on purpose: it is a weekly ritual, not a feed.
 */
export function sidequestOfTheWeek(
  repository: SidequestsRepository,
  now = new Date(),
): SidequestContent | null {
  const startOfWeek = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  // ISO week number via the Thursday trick: the week containing the Thursday of
  // this week is the current week regardless of which day it is.
  startOfWeek.setUTCDate(startOfWeek.getUTCDate() + 3 - ((startOfWeek.getUTCDay() + 6) % 7));
  const weekNumber = Math.floor(
    (startOfWeek.getTime() - Date.UTC(startOfWeek.getUTCFullYear(), 0, 1)) /
      (7 * 86_400_000),
  );

  const pool = repository
    .listContent()
    .filter(
      (item) => item.type === "challenge" || item.type === "fact" || item.isFeatured,
    );

  if (pool.length === 0) return null;

  const index = stableHash(`sidequest-of-the-week:${weekNumber}`) % pool.length;
  return pool[index] as SidequestContent;
}

/* ── Catalogue reads ─────────────────────────────────────────────────────── */

export function listInterests(
  repository: SidequestsRepository,
  options: { category?: InterestCategory; query?: string } = {},
): Interest[] {
  const query = (options.query ?? "").trim().toLowerCase();

  return repository.listInterests().filter((interest) => {
    if (options.category && interest.category !== options.category) return false;
    if (query === "") return true;
    return (
      interest.name.toLowerCase().includes(query) ||
      interest.slug.includes(query) ||
      interest.description.toLowerCase().includes(query)
    );
  });
}

/**
 * One interest with the count of things attached to it. This is what the
 * interest selector and the "explore this" panel render, so it is a projection
 * rather than a bare row.
 */
export function interestDetail(
  repository: SidequestsRepository,
  slug: string,
): {
  interest: Interest;
  content: SidequestContent[];
  circles: CircleWithMembership[];
  contentCount: number;
} | null {
  const interest = repository.findInterestBySlug(slug);
  if (!interest) return null;

  const content = repository
    .listContent()
    .filter((item) => item.interestSlug === slug);

  return {
    interest,
    content,
    circles: listCircles(repository, {
      userId: "__interest-detail__",
      interestSlug: slug,
      limit: 6,
    }),
    contentCount: content.length,
  };
}
