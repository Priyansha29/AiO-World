/**
 * Sidequests controller.
 *
 * Thin by design: read and validate the request, call the service, shape the
 * response. No ranking, no filtering and no persistence decisions live here —
 * that is what the service and repository are for.
 *
 * Two conventions inherited from the existing colleges router:
 *   - every successful response carries `meta.demo: true`, because every
 *     catalogue, event and circle in this module is invented sample data;
 *   - errors are `{ error: <code>, message: <sentence a student can read> }`
 *     and never contain a stack trace, a file path or a driver message.
 */
import type { Request, Response } from "express";
import { getCollegeById } from "../../../data/mock-campus.js";
import {
  getSidequestsRepository,
  buildPersonalisationContext,
} from "../repository/sidequests-repository.js";
import {
  discover,
  discoverPreview,
  forYou,
  interestDetail,
  listCircles,
  listEvents,
  listInterests,
  peopleAroundYou,
  sidequestOfTheWeek,
  type ScoredContent,
} from "../services/sidequests.service.js";
import type { SidequestContent } from "../types/sidequests.js";
import {
  parseAddInterestsBody,
  parseBoolean,
  parseCategory,
  parseDays,
  parseId,
  parseLimit,
  parseQuery,
  parseSlugList,
  parseUserId,
  type ValidationResult,
} from "../validation/sidequests.validation.js";

/** Every response in this module is sample data, and says so. */
const DEMO_META = { demo: true } as const;

const DEMO_NOTE =
  "Sidequests catalogue, events and circles are fictional sample data for product development.";

function meta(extra: Record<string, unknown> = {}) {
  return { ...DEMO_META, note: DEMO_NOTE, generatedAt: new Date().toISOString(), ...extra };
}

function fail(res: Response, status: number, error: string, message: string): void {
  res.status(status).json({ error, message });
}

/** Unwrap a validation result, or answer 400 and return null. */
function unwrap<T>(
  result: ValidationResult<T>,
  res: Response,
): T | null {
  if (result.ok) return result.value;
  fail(res, 400, result.error, result.message);
  return null;
}

/** The user's identity and interests, as the ranking engine sees them. */
function contextFor(req: Request) {
  const repository = getSidequestsRepository();
  const userId = parseUserId(req.header("x-aioworld-user"));

  // The college is taken from the header the frontend already has (it lives in
  // the Campus profile store) rather than from a query parameter, so a stale
  // link cannot pin somebody else's campus into a request.
  const collegeId = req.header("x-aioworld-college") ?? null;

  return buildPersonalisationContext(
    repository,
    userId,
    collegeId,
    collegeId ? (getCollegeById(collegeId)?.city ?? null) : null,
  );
}

/**
 * A ranked item as it leaves the API: the content fields, flattened, plus the
 * score and the reasons. Keeping `score` visible is deliberate — it is a plain
 * sum of named weights, and showing it makes the ranking auditable rather than
 * a black box.
 */
type RankedItem = SidequestContent & { reasons: string[]; score: number };

/** Flatten the service's `{ item, score, reasons }` shape into the response. */
function toRankedItems(entries: ScoredContent[]): RankedItem[] {
  return entries.map((entry) => ({
    ...entry.item,
    reasons: entry.reasons,
    score: entry.score,
  }));
}

/* ── Catalogue ───────────────────────────────────────────────────────────── */

/** GET /api/sidequests/interests?category=&q= */
function getInterests(req: Request, res: Response): void {
  const category = unwrap(parseCategory(req.query.category), res);
  if (category === null) return;
  const query = unwrap(parseQuery(req.query.q), res);
  if (query === null) return;

  const interests = listInterests(getSidequestsRepository(), { category, query });

  res.status(200).json({
    interests,
    meta: meta({ count: interests.length, category: category ?? null, q: query ?? null }),
  });
}

/** GET /api/sidequests/interests/:slug */
function getInterestBySlug(req: Request, res: Response): void {
  const slug = req.params.slug;
  if (Array.isArray(slug)) {
    fail(res, 400, "invalid_slug", "Invalid interest slug.");
    return;
  }

  const detail = interestDetail(getSidequestsRepository(), slug);
  if (!detail) {
    fail(res, 404, "interest_not_found", "We don't have that interest.");
    return;
  }

  res.status(200).json({ ...detail, meta: meta({ count: detail.contentCount }) });
}

/** GET /api/sidequests/content/:id */
function getContent(req: Request, res: Response): void {
  const id = unwrap(parseId(req.params.id, "content id"), res);
  if (id === null) return;

  const repository = getSidequestsRepository();
  const content = repository.findContentById(id);
  if (!content) {
    fail(res, 404, "content_not_found", "We couldn't find that one.");
    return;
  }

  // Same shelf, different things — cheap, and it gives the detail view
  // somewhere to go without a second endpoint.
  const related = repository
    .listContent()
    .filter((item) => item.interestSlug === content.interestSlug && item.id !== content.id)
    .slice(0, 3);

  res.status(200).json({ content, related, meta: meta({ relatedCount: related.length }) });
}

/* ── Personalised shelves ────────────────────────────────────────────────── */

/** GET /api/sidequests/for-you?limit= */
function getForYou(req: Request, res: Response): void {
  const limit = parseLimit(req.query.limit, 6, 12);
  const context = contextFor(req);

  const items = toRankedItems(forYou(getSidequestsRepository(), context, limit));

  res.status(200).json({
    items,
    meta: meta({
      count: items.length,
      basedOnInterests: context.interestSlugs,
      personalised: context.interestSlugs.length > 0,
    }),
  });
}

/** GET /api/sidequests/discover */
function getDiscover(req: Request, res: Response): void {
  const repository = getSidequestsRepository();
  const context = contextFor(req);

  // The card on screen right now. Sent back by the client so "Give me another"
  // cannot hand over the card that is already there — see `discover`.
  const exclude = parseSlugList(req.query.exclude);

  const result = discover(
    repository,
    context,
    (userId, contentId) => {
      repository.noteSeen(userId, contentId);
    },
    exclude,
  );

  if (!result) {
    fail(res, 404, "discovery_empty", "Nothing left to surprise you with.");
    return;
  }

  res.status(200).json({
    item: result.item,
    band: result.band,
    offScript: result.offScript,
    meta: meta({
      remainingInBand: result.remainingInBand,
      basedOnInterests: context.interestSlugs,
    }),
  });
}

/** GET /api/sidequests/weekly */
function getWeekly(req: Request, res: Response): void {
  const repository = getSidequestsRepository();
  const userId = parseUserId(req.header("x-aioworld-user"));
  const sidequest = sidequestOfTheWeek(repository);

  if (!sidequest) {
    fail(res, 404, "weekly_unavailable", "No sidequest of the week right now.");
    return;
  }

  const completed = repository.listCompleted(userId);

  res.status(200).json({
    sidequest,
    completed: completed.includes(sidequest.id),
    meta: meta({ completedCount: completed.length }),
  });
}

/** POST /api/sidequests/weekly/:contentId/complete */
function completeWeekly(req: Request, res: Response): void {
  const contentId = unwrap(parseId(req.params.contentId, "content id"), res);
  if (contentId === null) return;

  const repository = getSidequestsRepository();
  if (!repository.findContentById(contentId)) {
    fail(res, 404, "content_not_found", "We couldn't find that sidequest.");
    return;
  }

  const userId = parseUserId(req.header("x-aioworld-user"));
  repository.setCompleted(userId, contentId, true);

  res.status(200).json({
    contentId,
    completed: true,
    meta: meta({ completedCount: repository.listCompleted(userId).length }),
  });
}

/** DELETE /api/sidequests/weekly/:contentId/complete */
function uncompleteWeekly(req: Request, res: Response): void {
  const contentId = unwrap(parseId(req.params.contentId, "content id"), res);
  if (contentId === null) return;

  const repository = getSidequestsRepository();
  const userId = parseUserId(req.header("x-aioworld-user"));
  repository.setCompleted(userId, contentId, false);

  res.status(200).json({
    contentId,
    completed: false,
    meta: meta({ completedCount: repository.listCompleted(userId).length }),
  });
}

/* ── Local discovery ─────────────────────────────────────────────────────── */

/** GET /api/sidequests/events?interests=&category=&free=&weekend=&within= */
function getEvents(req: Request, res: Response): void {
  const category = unwrap(parseCategory(req.query.category), res);
  if (category === null) return;

  const collegeHeader = req.header("x-aioworld-college") ?? null;
  const cityParam = typeof req.query.city === "string" ? req.query.city : null;
  const interestSlugs = parseSlugList(req.query.interests);
  const weekendOnly = parseBoolean(req.query.weekend);
  const freeOnly = parseBoolean(req.query.free);

  const events = listEvents(getSidequestsRepository(), {
    collegeId: collegeHeader,
    city: cityParam,
    interestSlugs,
    category,
    freeOnly,
    weekendOnly,
    withinDays: parseDays(req.query.within, 60, 180),
    limit: parseLimit(req.query.limit, 12, 40),
  });

  res.status(200).json({
    events,
    meta: meta({
      count: events.length,
      collegeId: collegeHeader,
      city: cityParam,
      interestFiltered: interestSlugs.length > 0,
      weekendOnly,
      freeOnly,
    }),
  });
}

/** GET /api/sidequests/circles?college=&city=&interest= */
function getCircles(req: Request, res: Response): void {
  const collegeHeader = req.header("x-aioworld-college") ?? null;
  const cityParam = typeof req.query.city === "string" ? req.query.city : null;
  const interestSlug =
    typeof req.query.interest === "string" ? req.query.interest : undefined;

  const circles = listCircles(getSidequestsRepository(), {
    userId: parseUserId(req.header("x-aioworld-user")),
    collegeId: collegeHeader,
    city: cityParam,
    interestSlug,
    limit: parseLimit(req.query.limit, 12, 40),
  });

  res.status(200).json({
    circles,
    meta: meta({ count: circles.length, interest: interestSlug ?? null }),
  });
}

/** GET /api/sidequests/people */
function getPeople(req: Request, res: Response): void {
  const context = contextFor(req);
  const limit = parseLimit(req.query.limit, 6, 12);
  const { yours, popular } = peopleAroundYou(getSidequestsRepository(), context, limit);

  res.status(200).json({
    yours,
    popular,
    meta: meta({
      count: yours.length + popular.length,
      collegeId: context.collegeId,
      personalised: context.interestSlugs.length > 0,
    }),
  });
}

/* ── User selections ─────────────────────────────────────────────────────── */

/** GET /api/sidequests/interests/selected */
function getSelectedInterests(req: Request, res: Response): void {
  const repository = getSidequestsRepository();
  const userId = parseUserId(req.header("x-aioworld-user"));

  const interests = repository
    .listUserInterests(userId)
    .map((row) => repository.findInterestById(row.interestId))
    .filter((interest) => interest !== undefined);

  res.status(200).json({ interests, meta: meta({ count: interests.length }) });
}

/** POST /api/sidequests/interests */
function addInterests(req: Request, res: Response): void {
  const body = unwrap(parseAddInterestsBody(req.body), res);
  if (body === null) return;

  const repository = getSidequestsRepository();
  const userId = parseUserId(req.header("x-aioworld-user"));

  const added: string[] = [];
  const unknown: string[] = [];
  for (const interestId of body.interestIds) {
    const row = repository.addUserInterest(userId, interestId);
    if (row) added.push(interestId);
    else if (!repository.findInterestById(interestId)) unknown.push(interestId);
  }

  if (unknown.length > 0) {
    // All-or-nothing on an unknown id: a partial write would leave the user
    // believing they picked something that does not exist.
    fail(
      res,
      404,
      "interest_not_found",
      unknown.length === 1
        ? "One of those interests doesn't exist."
        : "Some of those interests don't exist.",
    );
    return;
  }

  const interests = repository
    .listUserInterests(userId)
    .map((row) => repository.findInterestById(row.interestId))
    .filter((interest) => interest !== undefined);

  res.status(200).json({
    interests,
    added,
    meta: meta({ count: interests.length, alreadySelected: body.interestIds.length - added.length }),
  });
}

/** DELETE /api/sidequests/interests/:interestId */
function removeInterest(req: Request, res: Response): void {
  const interestId = unwrap(parseId(req.params.interestId, "interest id"), res);
  if (interestId === null) return;

  const repository = getSidequestsRepository();
  const userId = parseUserId(req.header("x-aioworld-user"));

  const removed = repository.removeUserInterest(userId, interestId);
  if (!removed) {
    fail(res, 404, "interest_not_selected", "That wasn't in your sidequests.");
    return;
  }

  const interests = repository
    .listUserInterests(userId)
    .map((row) => repository.findInterestById(row.interestId))
    .filter((interest) => interest !== undefined);

  res.status(200).json({ interests, removed: interestId, meta: meta({ count: interests.length }) });
}

/* ── Saved ───────────────────────────────────────────────────────────────── */

/** GET /api/sidequests/saved */
function getSaved(req: Request, res: Response): void {
  const repository = getSidequestsRepository();
  const userId = parseUserId(req.header("x-aioworld-user"));

  const saved = repository
    .listSaved(userId)
    .map((row) => {
      const content = repository.findContentById(row.contentId);
      return content ? { content, savedAt: row.createdAt } : null;
    })
    .filter((entry): entry is { content: SidequestContent; savedAt: string } => entry !== null)
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt));

  res.status(200).json({ saved, meta: meta({ count: saved.length }) });
}

/** POST /api/sidequests/saved/:contentId */
function saveContent(req: Request, res: Response): void {
  const contentId = unwrap(parseId(req.params.contentId, "content id"), res);
  if (contentId === null) return;

  const repository = getSidequestsRepository();
  const row = repository.addSaved(parseUserId(req.header("x-aioworld-user")), contentId);

  if (!row) {
    const exists = repository.findContentById(contentId) !== undefined;
    fail(
      res,
      exists ? 409 : 404,
      exists ? "already_saved" : "content_not_found",
      exists ? "That's already in your saved list." : "We couldn't find that one.",
    );
    return;
  }

  res.status(201).json({ contentId, saved: true, savedAt: row.createdAt, meta: meta() });
}

/** DELETE /api/sidequests/saved/:contentId */
function unsaveContent(req: Request, res: Response): void {
  const contentId = unwrap(parseId(req.params.contentId, "content id"), res);
  if (contentId === null) return;

  const removed = getSidequestsRepository().removeSaved(
    parseUserId(req.header("x-aioworld-user")),
    contentId,
  );

  if (!removed) {
    fail(res, 404, "not_saved", "That wasn't in your saved list.");
    return;
  }

  res.status(200).json({ contentId, saved: false, meta: meta() });
}

/* ── Circle membership ───────────────────────────────────────────────────── */

/** POST /api/sidequests/circles/:circleId/join */
function joinCircle(req: Request, res: Response): void {
  const circleId = unwrap(parseId(req.params.circleId, "circle id"), res);
  if (circleId === null) return;

  const repository = getSidequestsRepository();
  const userId = parseUserId(req.header("x-aioworld-user"));
  const row = repository.addCircleMembership(userId, circleId);

  if (!row) {
    const exists = repository.findCircleById(circleId) !== undefined;
    fail(
      res,
      exists ? 409 : 404,
      exists ? "already_joined" : "circle_not_found",
      exists ? "You're already in that circle." : "We couldn't find that circle.",
    );
    return;
  }

  const [circle] = listCircles(repository, { userId, limit: 40 }).filter(
    (entry) => entry.id === circleId,
  );

  res.status(201).json({ circle, joined: true, meta: meta() });
}

/** DELETE /api/sidequests/circles/:circleId/leave */
function leaveCircle(req: Request, res: Response): void {
  const circleId = unwrap(parseId(req.params.circleId, "circle id"), res);
  if (circleId === null) return;

  const repository = getSidequestsRepository();
  const userId = parseUserId(req.header("x-aioworld-user"));

  if (!repository.removeCircleMembership(userId, circleId)) {
    fail(res, 404, "not_joined", "You aren't in that circle.");
    return;
  }

  res.status(200).json({ circleId, joined: false, meta: meta() });
}

/* ── Overview ────────────────────────────────────────────────────────────── */

/**
 * GET /api/sidequests/overview
 *
 * The single request the first viewport needs, composed server-side so the page
 * makes one round trip instead of five on load.
 *
 * It deliberately does *not* return the whole module: no full content library,
 * no events, no circle list, no per-item reasons. Those load when their section
 * is reached, via the endpoints above. Roughly a fifth of the catalogue.
 */
function getOverview(req: Request, res: Response): void {
  const repository = getSidequestsRepository();
  const context = contextFor(req);
  const userId = context.userId;

  const interests = listInterests(repository);
  const shelf = toRankedItems(forYou(repository, context, 6));
  const sidequest = sidequestOfTheWeek(repository);
  const completed = repository.listCompleted(userId);
  const circles = listCircles(repository, { userId, collegeId: context.collegeId, limit: 4 });
  const people = peopleAroundYou(repository, context, 4);

  // One surprise for the discovery card, so that section is never empty on
  // arrival. Deliberately a *preview*: it does not count as seen, so loading the
  // page cannot quietly advance the student's discovery history.
  const preview = discoverPreview(repository, context);

  // The user's actual picks, not a guess derived from what the shelf happened to
  // match. Someone who picked an interest with no content on the shelf would
  // otherwise see it silently missing from "Your sidequests".
  const selectedInterests = repository
    .listUserInterests(userId)
    .map((row) => repository.findInterestById(row.interestId))
    .filter((interest) => interest !== undefined);

  res.status(200).json({
    interests,
    selectedInterests,
    forYou: shelf,
    discoverySeed: preview ? { item: preview.item, band: preview.band } : null,
    weekly: sidequest
      ? { sidequest, completed: completed.includes(sidequest.id) }
      : null,
    circles,
    people,
    meta: meta({
      counts: {
        interests: interests.length,
        selected: selectedInterests.length,
        forYou: shelf.length,
        circles: circles.length,
      },
      collegeId: context.collegeId,
      basedOnInterests: context.interestSlugs,
      personalised: context.interestSlugs.length > 0,
    }),
  });
}

export {
  addInterests,
  completeWeekly,
  getCircles,
  getContent,
  getDiscover,
  getEvents,
  getForYou,
  getInterestBySlug,
  getInterests,
  getOverview,
  getPeople,
  getSaved,
  getSelectedInterests,
  getWeekly,
  joinCircle,
  leaveCircle,
  removeInterest,
  saveContent,
  uncompleteWeekly,
  unsaveContent,
};
