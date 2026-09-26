/**
 * Sidequests domain model — the canonical contract for AiO World's
 * "Sidequests" system: the part of student life that happens outside
 * academics and career.
 *
 * This file is the single source of truth for the backend. The frontend
 * mirrors these shapes in `frontend/src/features/sidequests/domain`.
 *
 * Everything here is storage-agnostic on purpose. The active repository is
 * seed-backed (see `repository/sidequests-repository.ts`), but the shapes are
 * the ones a relational store should use, and `db/migrations/001_sidequests.sql`
 * spells out the same schema in SQL. Nothing in the service or route layer
 * knows which one it is talking to.
 */

/* ── Enumerations ─────────────────────────────────────────────────────────── */

/**
 * Interest categories are the top-level shelves of the interest selector.
 * They are deliberately about *moods* rather than topics: a student looking
 * for something to do at 11pm and one looking for something to do on Saturday
 * morning are in the same category, which is exactly the point.
 */
export const INTEREST_CATEGORIES = [
  "move",
  "create",
  "explore",
  "unwind",
  "discover",
] as const;
export type InterestCategory = (typeof INTEREST_CATEGORIES)[number];

export const CONTENT_TYPES = [
  "article",
  "guide",
  "workout",
  "recipe",
  "book",
  "podcast",
  "video",
  "challenge",
  "fact",
  "resource",
  "event_reference",
] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

/** Types that are a single sitting rather than a course of anything. */
export const INSTANT_CONTENT_TYPES = ["fact", "challenge"] as const;
export type InstantContentType = (typeof INSTANT_CONTENT_TYPES)[number];

export const DIFFICULTIES = ["beginner", "intermediate", "advanced", "any"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

/* ── Interest ─────────────────────────────────────────────────────────────── */

/**
 * An interest is the atom of the whole feature: content, events and circles all
 * point at one, and a user's selection is a set of them. `icon` names a glyph
 * in the frontend icon set rather than embedding an asset, so the catalogue
 * stays text-only and seedable.
 */
export interface Interest {
  id: string;
  name: string;
  slug: string;
  description: string;
  /** Key into the frontend `InterestIcon` glyph set. */
  icon: string;
  category: InterestCategory;
  isActive: boolean;
}

/* ── SidequestContent ─────────────────────────────────────────────────────── */

/**
 * A single piece of curated Sidequests content.
 *
 * Only `id`/`title`/`slug`/`description`/`type`/`category`/`interestSlug` are
 * required. Everything else is optional because the honest answer differs per
 * type: a recipe has `steps` and `ingredients`, a workout has `steps`, a fact
 * has neither, and an article has a `sourceUrl`. Forcing every field to be
 * present is how content models end up full of `null` and `"N/A"`.
 */
export interface SidequestContent {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: ContentType;
  category: InterestCategory;
  /** The primary interest this belongs to. */
  interestSlug: string;
  imageUrl?: string;
  sourceName?: string;
  sourceUrl?: string;
  /** Human estimate, e.g. "8 min read", "20 min", "5 weeks". */
  duration?: string;
  difficulty?: Difficulty;
  tags: string[];
  /** ISO-8601. */
  publishedAt: string;
  isFeatured: boolean;
  isActive: boolean;
  /** Ordered instructions — workouts, guides, recipes. */
  steps?: string[];
  /** Recipes only. */
  ingredients?: string[];
  /** Optional single-sentence "why this is worth it". */
  pitch?: string;
}

/* ── Event ────────────────────────────────────────────────────────────────── */

export interface SidequestEvent {
  id: string;
  title: string;
  description: string;
  category: InterestCategory;
  /** ISO-8601. */
  startTime: string;
  endTime: string;
  venue: string;
  city: string;
  /** Null for city-wide events — not every event belongs to a college. */
  collegeId: string | null;
  organizer: string;
  registrationUrl?: string;
  imageUrl?: string;
  isFree: boolean;
  isActive: boolean;
  interestSlugs: string[];
}

/* ── InterestCircle ───────────────────────────────────────────────────────── */

/**
 * A circle is the future social primitive, stubbed honestly: a named group
 * around one interest with a member count. No member list is exposed anywhere
 * in this module — there is no auth, and "who is in this circle" is exactly the
 * question a real identity system has to answer first.
 */
export interface InterestCircle {
  id: string;
  name: string;
  slug: string;
  description: string;
  interestSlug: string;
  collegeId: string | null;
  city: string | null;
  memberCount: number;
  isActive: boolean;
}

export interface CircleMembership {
  userId: string;
  circleId: string;
  createdAt: string;
}

/* ── User relationships ───────────────────────────────────────────────────── */

export interface UserInterest {
  userId: string;
  interestId: string;
  createdAt: string;
}

export interface SavedSidequest {
  userId: string;
  contentId: string;
  createdAt: string;
}

/* ── Identity ─────────────────────────────────────────────────────────────── */

/**
 * There is no authentication in AiO World yet, so a "user" is an opaque id the
 * browser mints and sends as `x-aioworld-user`. It is deliberately not a profile:
 * no email, no name, no location beyond the college the student already chose
 * in Campus. When real auth arrives this becomes the session user id and every
 * table above is already keyed for it.
 */
export type SidequestUserId = string;

/* ── Recommendation inputs ────────────────────────────────────────────────── */

/**
 * What the ranking engine knows about the reader. Assembled by the service from
 * the user's own rows plus the college they selected in Campus.
 */
export interface PersonalisationContext {
  userId: SidequestUserId;
  interestSlugs: string[];
  interestCategories: InterestCategory[];
  collegeId: string | null;
  city: string | null;
  /** Content ids already shown, newest first. Used to keep discovery fresh. */
  recentlySeen: string[];
}

/* ── Tuning ───────────────────────────────────────────────────────────────── */

/**
 * The discovery mix. One place, plainly editable, because "how often does
 * Sidequests take me somewhere new" is a product decision and not a constant
 * anyone should have to hunt for.
 */
export const DISCOVERY_MIX = {
  /** Directly matches something the user picked. */
  onInterest: 0.7,
  /** Same shelf, different interest — the adjacent shelf. */
  adjacent: 0.2,
  /** Deliberately off-script. */
  unexpected: 0.1,
} as const;

/** Hard ceiling on how many items one interest may contribute to a single row. */
export const MAX_PER_INTEREST_IN_A_ROW = 2;
