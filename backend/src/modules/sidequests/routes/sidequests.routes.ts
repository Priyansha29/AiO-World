/**
 * Sidequests routes.
 *
 * Mounted at `/api` from `src/app.ts`, alongside the existing colleges router,
 * so every Sidequests endpoint lives under `/api/sidequests/…` exactly as the
 * product spec describes. Nothing here owns business logic — it is a URL map
 * onto the controller.
 *
 * Route order matters in one place: `/interests/selected` is registered before
 * `/interests/:slug`, otherwise Express hands the literal segment "selected" to
 * the slug handler and looks up an interest that does not exist.
 */
import { Router, type Request, type Response } from "express";
import {
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
} from "../controllers/sidequests.controller.js";

const router = Router();

/* ── Overview (the first viewport's single request) ──────────────────────── */

router.get("/sidequests/overview", getOverview);

/* ── Interests ───────────────────────────────────────────────────────────── */

router.get("/sidequests/interests", getInterests);
router.post("/sidequests/interests", addInterests);

// Must precede `/interests/:slug`.
router.get("/sidequests/interests/selected", getSelectedInterests);
router.delete("/sidequests/interests/:interestId", removeInterest);
router.get("/sidequests/interests/:slug", getInterestBySlug);

/* ── Content ─────────────────────────────────────────────────────────────── */

router.get("/sidequests/content/:id", getContent);

/* ── Personalised shelves ────────────────────────────────────────────────── */

router.get("/sidequests/for-you", getForYou);
router.get("/sidequests/discover", getDiscover);
router.get("/sidequests/weekly", getWeekly);
router.post("/sidequests/weekly/:contentId/complete", completeWeekly);
router.delete("/sidequests/weekly/:contentId/complete", uncompleteWeekly);

/* ── Local discovery ─────────────────────────────────────────────────────── */

router.get("/sidequests/events", getEvents);
router.get("/sidequests/circles", getCircles);
router.get("/sidequests/people", getPeople);

/* ── Saved ───────────────────────────────────────────────────────────────── */

router.get("/sidequests/saved", getSaved);
router.post("/sidequests/saved/:contentId", saveContent);
router.delete("/sidequests/saved/:contentId", unsaveContent);

/* ── Circle membership ───────────────────────────────────────────────────── */

router.post("/sidequests/circles/:circleId/join", joinCircle);
router.delete("/sidequests/circles/:circleId/leave", leaveCircle);

/* ── Fallback ────────────────────────────────────────────────────────────── */

/**
 * Anything else under `/sidequests/*` is a typo. Answering with the module's
 * own index is more useful than a bare 404, and it keeps the API discoverable
 * without shipping a docs endpoint.
 */
router.use("/sidequests", (req: Request, res: Response) => {
  res.status(404).json({
    error: "unknown_sidequest_route",
    message: `No Sidequests endpoint at ${req.method} ${req.path}.`,
    endpoints: [
      "GET /api/sidequests/overview",
      "GET /api/sidequests/interests",
      "GET /api/sidequests/interests/selected",
      "GET /api/sidequests/interests/:slug",
      "POST /api/sidequests/interests",
      "DELETE /api/sidequests/interests/:interestId",
      "GET /api/sidequests/content/:id",
      "GET /api/sidequests/for-you",
      "GET /api/sidequests/discover",
      "GET /api/sidequests/weekly",
      "POST /api/sidequests/weekly/:contentId/complete",
      "DELETE /api/sidequests/weekly/:contentId/complete",
      "GET /api/sidequests/events",
      "GET /api/sidequests/circles",
      "GET /api/sidequests/people",
      "GET /api/sidequests/saved",
      "POST /api/sidequests/saved/:contentId",
      "DELETE /api/sidequests/saved/:contentId",
      "POST /api/sidequests/circles/:circleId/join",
      "DELETE /api/sidequests/circles/:circleId/leave",
    ],
  });
});

export default router;
