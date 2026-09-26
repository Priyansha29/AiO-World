/**
 * Sidequests repository.
 *
 * The interface below is the whole persistence contract for the feature. The
 * active implementation is `SeedSidequestsRepository`, which serves the curated
 * catalogue in `data/*.seed.ts` and holds the current user's own rows in
 * process. A relational implementation (the schema is in
 * `db/migrations/001_sidequests.sql`) satisfies exactly this interface, and
 * because the service layer only ever sees the interface, swapping it is a
 * single line in `createSidequestsRepository()`.
 *
 * Two things are deliberately in memory even though the catalogue is not: user
 * interests, saved sidequests and circle memberships. They are per-user rows
 * with no meaningful seed, and they disappear on restart — which is honest,
 * because there is no database in this project yet and pretending otherwise
 * would be worse than saying so.
 */
import {
  SEED_CIRCLES,
  SEED_CIRCLE_BY_ID,
  SEED_CIRCLE_BY_SLUG,
} from "../data/circles.seed.js";
import { SEED_CONTENT, SEED_CONTENT_BY_ID } from "../data/content.seed.js";
import { SEED_EVENTS, SEED_EVENT_BY_ID } from "../data/events.seed.js";
import {
  SEED_INTERESTS,
  SEED_INTEREST_BY_ID,
  SEED_INTEREST_BY_SLUG,
} from "../data/interests.seed.js";
import {
  SEED_INTEREST_POPULARITY,
  type InterestPopularity,
} from "../data/people.seed.js";import {
  type CircleMembership,
  type Interest,
  type InterestCircle,
  type PersonalisationContext,
  type SavedSidequest,
  type SidequestContent,
  type SidequestEvent,
  type SidequestUserId,
  type UserInterest,
} from "../types/sidequests.js";

export interface EventFilters {
  /** Only events at this college, or city-wide when `includeCityWide`. */
  collegeId?: string | null;
  city?: string | null;
  includeCityWide?: boolean;
  /** Interest slugs; an event matches if it shares at least one. */
  interestSlugs?: string[];
  category?: string;
  freeOnly?: boolean;
  /** Only Saturday and Sunday events, within `withinDays` of now. */
  weekendOnly?: boolean;
  /** Days from now, inclusive of today. */
  withinDays?: number;
  limit?: number;
}

export interface InterestPopularityRow {
  interestSlug: string;
  category: InterestPopularity["category"];
  count: number;
}

export interface SidequestsRepository {
  /* Catalogue — static, read-only. */
  listInterests(): Interest[];
  findInterestBySlug(slug: string): Interest | undefined;
  findInterestById(id: string): Interest | undefined;
  listContent(): SidequestContent[];
  findContentById(id: string): SidequestContent | undefined;
  listEvents(): SidequestEvent[];
  findEventById(id: string): SidequestEvent | undefined;
  listCircles(): InterestCircle[];
  findCircleById(id: string): InterestCircle | undefined;
  findCircleBySlug(slug: string): InterestCircle | undefined;

  /* "People around you" — aggregate counts only. */
  interestPopularity(collegeId: string | null): InterestPopularityRow[];

  /* Per-user rows. */
  listUserInterests(userId: SidequestUserId): UserInterest[];
  addUserInterest(userId: SidequestUserId, interestId: string): UserInterest | null;
  removeUserInterest(userId: SidequestUserId, interestId: string): boolean;

  listSaved(userId: SidequestUserId): SavedSidequest[];
  addSaved(userId: SidequestUserId, contentId: string): SavedSidequest | null;
  removeSaved(userId: SidequestUserId, contentId: string): boolean;

  listCircleMemberships(userId: SidequestUserId): CircleMembership[];
  addCircleMembership(userId: SidequestUserId, circleId: string): CircleMembership | null;
  removeCircleMembership(userId: SidequestUserId, circleId: string): boolean;

  /** Ids the user has already been shown, newest first. Bounded by the impl. */
  recentlySeen(userId: SidequestUserId): string[];

  /* Completed sidequest challenges, for the weekly completion state. */
  listCompleted(userId: SidequestUserId): string[];
  setCompleted(userId: SidequestUserId, contentId: string, completed: boolean): void;
}

/**
 * Cap on remembered discovery history. Bounded on purpose: this is a
 * "don't show me that again" buffer, not an analytics log, and it should not
 * grow without limit in a process that never restarts cleanly.
 */
const RECENT_SEEN_LIMIT = 40;
const COMPLETED_LIMIT = 100;

/** Shared factory for the per-user maps so both implementations agree on shape. */
class UserState {
  readonly interests = new Map<string, UserInterest>();
  readonly saved = new Map<string, SavedSidequest>();
  readonly circles = new Map<string, CircleMembership>();
  readonly seen: string[] = [];
  readonly completed = new Set<string>();
}

export class SeedSidequestsRepository implements SidequestsRepository {
  private readonly users = new Map<SidequestUserId, UserState>();

  private stateFor(userId: SidequestUserId): UserState {
    let state = this.users.get(userId);
    if (!state) {
      state = new UserState();
      this.users.set(userId, state);
    }
    return state;
  }

  listInterests(): Interest[] {
    return SEED_INTERESTS.filter((interest) => interest.isActive);
  }

  findInterestBySlug(slug: string): Interest | undefined {
    const interest = SEED_INTEREST_BY_SLUG.get(slug);
    return interest?.isActive ? interest : undefined;
  }

  findInterestById(id: string): Interest | undefined {
    const interest = SEED_INTEREST_BY_ID.get(id);
    return interest?.isActive ? interest : undefined;
  }

  listContent(): SidequestContent[] {
    return SEED_CONTENT.filter((item) => item.isActive);
  }

  findContentById(id: string): SidequestContent | undefined {
    const item = SEED_CONTENT_BY_ID.get(id);
    return item?.isActive ? item : undefined;
  }

  listEvents(): SidequestEvent[] {
    return SEED_EVENTS.filter((event) => event.isActive);
  }

  findEventById(id: string): SidequestEvent | undefined {
    const event = SEED_EVENT_BY_ID.get(id);
    return event?.isActive ? event : undefined;
  }

  listCircles(): InterestCircle[] {
    return SEED_CIRCLES.filter((circle) => circle.isActive);
  }

  findCircleById(id: string): InterestCircle | undefined {
    const circle = SEED_CIRCLE_BY_ID.get(id);
    return circle?.isActive ? circle : undefined;
  }

  findCircleBySlug(slug: string): InterestCircle | undefined {
    const circle = SEED_CIRCLE_BY_SLUG.get(slug);
    return circle?.isActive ? circle : undefined;
  }

  /**
   * Counts for a college, plus city-wide counts when the caller has no college
   * yet — a student who has not picked a college still deserves to know people
   * are out there doing the same things.
   */
  interestPopularity(collegeId: string | null): InterestPopularityRow[] {
    const totals = new Map<string, InterestPopularityRow>();

    const add = (row: InterestPopularity): void => {
      const existing = totals.get(row.interestSlug);
      if (existing) {
        existing.count += row.count;
        return;
      }
      totals.set(row.interestSlug, {
        interestSlug: row.interestSlug,
        category: row.category,
        count: row.count,
      });
    };

    for (const row of SEED_INTEREST_POPULARITY) {
      if (row.collegeId === null || row.collegeId === collegeId) add(row);
    }

    return [...totals.values()].sort((a, b) => b.count - a.count);
  }

  listUserInterests(userId: SidequestUserId): UserInterest[] {
    return [...this.stateFor(userId).interests.values()];
  }

  /** Returns null when the interest is unknown or already selected. */
  addUserInterest(userId: SidequestUserId, interestId: string): UserInterest | null {
    if (!this.findInterestById(interestId)) return null;
    const state = this.stateFor(userId);
    if (state.interests.has(interestId)) return null;
    const row: UserInterest = {
      userId,
      interestId,
      createdAt: new Date().toISOString(),
    };
    state.interests.set(interestId, row);
    return row;
  }

  removeUserInterest(userId: SidequestUserId, interestId: string): boolean {
    return this.stateFor(userId).interests.delete(interestId);
  }

  listSaved(userId: SidequestUserId): SavedSidequest[] {
    return [...this.stateFor(userId).saved.values()];
  }

  /** Returns null when the content is unknown or already saved. */
  addSaved(userId: SidequestUserId, contentId: string): SavedSidequest | null {
    if (!this.findContentById(contentId)) return null;
    const state = this.stateFor(userId);
    if (state.saved.has(contentId)) return null;
    const row: SavedSidequest = {
      userId,
      contentId,
      createdAt: new Date().toISOString(),
    };
    state.saved.set(contentId, row);
    return row;
  }

  removeSaved(userId: SidequestUserId, contentId: string): boolean {
    return this.stateFor(userId).saved.delete(contentId);
  }

  listCircleMemberships(userId: SidequestUserId): CircleMembership[] {
    return [...this.stateFor(userId).circles.values()];
  }

  /** Returns null when the circle is unknown or the user has already joined. */
  addCircleMembership(userId: SidequestUserId, circleId: string): CircleMembership | null {
    if (!this.findCircleById(circleId)) return null;
    const state = this.stateFor(userId);
    if (state.circles.has(circleId)) return null;
    const row: CircleMembership = {
      userId,
      circleId,
      createdAt: new Date().toISOString(),
    };
    state.circles.set(circleId, row);
    return row;
  }

  removeCircleMembership(userId: SidequestUserId, circleId: string): boolean {
    return this.stateFor(userId).circles.delete(circleId);
  }

  recentlySeen(userId: SidequestUserId): string[] {
    return [...this.stateFor(userId).seen];
  }

  /** Called by the discovery service after a card is served. */
  noteSeen(userId: SidequestUserId, contentId: string): void {
    const state = this.stateFor(userId);
    const index = state.seen.indexOf(contentId);
    if (index !== -1) state.seen.splice(index, 1);
    state.seen.unshift(contentId);
    if (state.seen.length > RECENT_SEEN_LIMIT) {
      state.seen.length = RECENT_SEEN_LIMIT;
    }
  }

  listCompleted(userId: SidequestUserId): string[] {
    return [...this.stateFor(userId).completed];
  }

  setCompleted(
    userId: SidequestUserId,
    contentId: string,
    completed: boolean,
  ): void {
    const state = this.stateFor(userId);
    if (completed) {
      if (state.completed.size < COMPLETED_LIMIT) state.completed.add(contentId);
      return;
    }
    state.completed.delete(contentId);
  }
}

/**
 * The discovery service needs to record what it served; that is not part of the
 * read/write contract every repository has to satisfy, so it is declared
 * separately and checked for at the call site.
 */
export interface DiscoveryMemory extends SidequestsRepository {
  noteSeen(userId: SidequestUserId, contentId: string): void;
}

/**
 * Fail fast on seed mistakes.
 *
 * Content and events reference interests by slug, and a typo in one of those
 * strings is invisible at runtime: the item still renders, but the "my
 * interests" filter silently never matches it. That is exactly the kind of bug
 * that ships and is never noticed, so the references are checked once at
 * startup instead. Throwing here is correct — a broken catalogue should stop
 * the process, not serve quietly wrong results.
 */
function assertSeedIntegrity(): void {
  const known = new Set(SEED_INTERESTS.map((interest) => interest.slug));
  const problems: string[] = [];

  const check = (owner: string, slugs: readonly string[]): void => {
    for (const slug of slugs) {
      if (!known.has(slug)) problems.push(`${owner} references unknown interest "${slug}"`);
    }
  };

  for (const item of SEED_CONTENT) {
    check(`content "${item.id}"`, [item.interestSlug]);
  }
  for (const event of SEED_EVENTS) {
    check(`event "${event.id}"`, event.interestSlugs);
  }
  for (const circle of SEED_CIRCLES) {
    check(`circle "${circle.id}"`, [circle.interestSlug]);
  }
  for (const row of SEED_INTEREST_POPULARITY) {
    if (!known.has(row.interestSlug)) {
      problems.push(
        `interest popularity (${row.collegeId ?? "city"}) references unknown interest "${row.interestSlug}"`,
      );
    }
  }

  if (problems.length > 0) {
    throw new Error(
      `Sidequests seed integrity check failed:\n  - ${problems.join("\n  - ")}`,
    );
  }
}

let active: DiscoveryMemory = new SeedSidequestsRepository();

export function getSidequestsRepository(): DiscoveryMemory {
  return active;
}

/** The one line that swaps in a real database implementation. */
export function createSidequestsRepository(): DiscoveryMemory {
  active = new SeedSidequestsRepository();
  return active;
}

// Verified at module load, not on first request, so a broken seed fails at
// startup rather than the first time somebody filters by interest.
assertSeedIntegrity();

/** Test seam: drop all per-user state without touching the catalogue. */
export function resetUserState(): void {
  if (active instanceof SeedSidequestsRepository) {
    (active as unknown as { users: Map<string, unknown> }).users.clear();
  }
}

/** Assemble the ranking inputs for a user from their own rows. */
export function buildPersonalisationContext(
  repository: SidequestsRepository,
  userId: SidequestUserId,
  collegeId: string | null,
  city: string | null,
): PersonalisationContext {
  const interestRows = repository.listUserInterests(userId);
  const interests = interestRows
    .map((row) => repository.findInterestById(row.interestId))
    .filter((interest): interest is Interest => Boolean(interest));

  return {
    userId,
    interestSlugs: interests.map((interest) => interest.slug),
    interestCategories: [...new Set(interests.map((interest) => interest.category))],
    collegeId,
    city,
    recentlySeen: repository.recentlySeen(userId),
  };
}
