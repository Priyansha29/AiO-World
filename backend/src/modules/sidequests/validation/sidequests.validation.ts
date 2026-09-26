/**
 * Sidequests request validation.
 *
 * Hand-rolled on purpose: the project has no validation library, and adding one
 * for a dozen checks would be a larger architectural statement than the feature
 * warrants. Every validator returns a plain result rather than throwing, so the
 * controller decides the response shape and the client never sees a stack trace
 * or a database message.
 */
import {
  DIFFICULTIES,
  INTEREST_CATEGORIES,
  type Difficulty,
  type InterestCategory,
} from "../types/sidequests.js";

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string; message: string };

const ok = <T>(value: T): ValidationResult<T> => ({ ok: true, value });
const fail = <T>(error: string, message: string): ValidationResult<T> => ({
  ok: false,
  error,
  message,
});

/* ── Primitives ──────────────────────────────────────────────────────────── */

/** Cap on any free-text search term, so a megabyte of query string is rejected early. */
const MAX_QUERY_LENGTH = 80;

export function parseQuery(raw: unknown): ValidationResult<string | undefined> {
  if (raw === undefined) return ok(undefined);
  if (typeof raw !== "string") return fail("invalid_query", "q must be a string.");
  const value = raw.trim();
  if (value.length === 0) return ok(undefined);
  if (value.length > MAX_QUERY_LENGTH) {
    return fail("invalid_query", `q must be ${MAX_QUERY_LENGTH} characters or fewer.`);
  }
  return ok(value);
}

/**
 * Ids and slugs are used to look things up, never to build a query, but they
 * are still constrained: an id that is not `prefix-token` is not one of ours,
 * and rejecting it here gives a clear 400 instead of a confusing 404.
 */
const ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/;

export function parseId(raw: unknown, label = "id"): ValidationResult<string> {
  if (typeof raw !== "string" || !ID_PATTERN.test(raw)) {
    return fail("invalid_id", `Invalid ${label}.`);
  }
  return ok(raw);
}

export function parseCategory(raw: unknown): ValidationResult<InterestCategory | undefined> {
  if (raw === undefined || raw === "") return ok(undefined);
  if (
    typeof raw !== "string" ||
    !INTEREST_CATEGORIES.includes(raw as InterestCategory)
  ) {
    return fail(
      "invalid_category",
      `category must be one of: ${INTEREST_CATEGORIES.join(", ")}.`,
    );
  }
  return ok(raw as InterestCategory);
}

export function parseDifficulty(raw: unknown): ValidationResult<Difficulty | undefined> {
  if (raw === undefined || raw === "") return ok(undefined);
  if (typeof raw !== "string" || !DIFFICULTIES.includes(raw as Difficulty)) {
    return fail(
      "invalid_difficulty",
      `difficulty must be one of: ${DIFFICULTIES.join(", ")}.`,
    );
  }
  return ok(raw as Difficulty);
}

/** A bounded positive integer, for `limit`. Clamped rather than rejected at the edges. */
export function parseLimit(raw: unknown, fallback: number, max: number): number {
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return Math.min(Math.floor(value), max);
}

export function parseBoolean(raw: unknown): boolean {
  return raw === "true" || raw === "1" || raw === true;
}

export function parseDays(raw: unknown, fallback: number, max: number): number {
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return Math.min(Math.floor(value), max);
}

/** Comma-separated slug list, e.g. `?interests=running,f1`. */
export function parseSlugList(raw: unknown): string[] {
  const source = Array.isArray(raw) ? raw.join(",") : typeof raw === "string" ? raw : "";
  return source
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter((value) => value.length > 0)
    .slice(0, 20);
}

/* ── Identity ────────────────────────────────────────────────────────────── */

/**
 * The anonymous device id.
 *
 * There is no authentication, so this is the one input a client can supply that
 * ends up as a storage key. It is therefore validated hard: a fixed shape, a
 * length ceiling, and a conservative character class. Anything that does not
 * look like an id we minted is treated as anonymous rather than trusted.
 */
const USER_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{7,63}$/;

export function parseUserId(raw: unknown): string {
  if (typeof raw !== "string") return "anonymous";
  const value = raw.trim().toLowerCase();
  return USER_ID_PATTERN.test(value) ? value : "anonymous";
}

/* ── Bodies ──────────────────────────────────────────────────────────────── */

export interface AddInterestsBody {
  interestIds: string[];
}

export function parseAddInterestsBody(raw: unknown): ValidationResult<AddInterestsBody> {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return fail("invalid_body", "Expected a JSON object with an interestIds array.");
  }
  const candidate = (raw as Record<string, unknown>).interestIds;
  if (!Array.isArray(candidate)) {
    return fail("invalid_body", "interestIds must be an array.");
  }
  if (candidate.length === 0) {
    return fail("invalid_body", "interestIds must contain at least one id.");
  }
  if (candidate.length > 30) {
    return fail("invalid_body", "interestIds must contain 30 ids or fewer.");
  }

  const interestIds: string[] = [];
  for (const entry of candidate) {
    if (typeof entry !== "string" || !ID_PATTERN.test(entry)) {
      return fail("invalid_body", "Every entry in interestIds must be a valid id.");
    }
    if (!interestIds.includes(entry)) interestIds.push(entry);
  }

  return ok({ interestIds });
}
