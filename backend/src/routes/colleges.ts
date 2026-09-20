import { Router, type Request, type Response } from "express";
import {
  CAMPUS_CATEGORIES,
  INFORMATION_STATUSES,
  type CampusCategory,
  type InformationStatus,
} from "../domain/campus.js";
import {
  getCampusInformation,
  getCollegeById,
  searchColleges,
} from "../data/mock-campus.js";

const router = Router();

const DEMO_META = { demo: true } as const;

function listColleges(req: Request, res: Response): void {
  const query = typeof req.query.q === "string" ? req.query.q : "";
  res.status(200).json({ colleges: searchColleges(query), meta: DEMO_META });
}

/**
 * GET /api/colleges
 * GET /api/colleges/search?q=
 *
 * Search by name, abbreviation, city, state or university.
 * Empty `q` returns the full (demo) catalogue.
 */
router.get("/colleges", listColleges);
router.get("/colleges/search", listColleges);

/**
 * GET /api/colleges/:id
 */
router.get("/colleges/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  if (Array.isArray(id)) {
    res.status(400).json({ error: "invalid_id", message: "Invalid college id." });
    return;
  }
  const college = getCollegeById(id);
  if (!college) {
    res.status(404).json({
      error: "college_not_found",
      message: "College not found.",
    });
    return;
  }
  res.status(200).json(college);
});

/**
 * GET /api/colleges/:id/campus-information
 *   ?category=academic
 *   &q=exam
 *   &status=active|all
 *
 * Non-active (superseded / expired / draft) items are excluded unless
 * `status=all` is requested. Responses are labelled as demo data.
 */
router.get(
  "/colleges/:id/campus-information",
  (req: Request, res: Response) => {
    const id = req.params.id;
    if (Array.isArray(id)) {
      res.status(400).json({ error: "invalid_id", message: "Invalid college id." });
      return;
    }
    const college = getCollegeById(id);
    if (!college) {
      res.status(404).json({
        error: "college_not_found",
        message: "College not found.",
      });
      return;
    }

    const { category, q, status } = req.query;

    if (
      category !== undefined &&
      (typeof category !== "string" ||
        !CAMPUS_CATEGORIES.includes(category as CampusCategory))
    ) {
      res.status(400).json({
        error: "invalid_category",
        message: `category must be one of: ${CAMPUS_CATEGORIES.join(", ")}.`,
      });
      return;
    }

    if (
      status !== undefined &&
      (typeof status !== "string" ||
        (status !== "all" &&
          !INFORMATION_STATUSES.includes(status as InformationStatus)))
    ) {
      res.status(400).json({
        error: "invalid_status",
        message: `status must be one of: all, ${INFORMATION_STATUSES.join(", ")}.`,
      });
      return;
    }

    const items = getCampusInformation(college.id, {
      category: category as CampusCategory | undefined,
      query: typeof q === "string" ? q : undefined,
      status: (status as InformationStatus | "all" | undefined) ?? "active",
    });

    res.status(200).json({
      college,
      items,
      meta: {
        ...DEMO_META,
        category: category ?? null,
        query: typeof q === "string" ? q : null,
        status: status ?? "active",
        count: items.length,
        generatedAt: new Date().toISOString(),
      },
    });
  },
);

export default router;