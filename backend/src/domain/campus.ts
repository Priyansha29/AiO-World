/**
 * Campus domain model — the canonical contract for AiO World's
 * "College Information Archaeology" system.
 *
 * This file is the single source of truth for the backend. The frontend
 * mirrors these shapes in `frontend/src/features/campus/domain`.
 */

export const CAMPUS_CATEGORIES = [
  "notices",
  "academic",
  "transport",
  "mess",
  "events",
  "opportunities",
] as const;
export type CampusCategory = (typeof CAMPUS_CATEGORIES)[number];

export const CAMPUS_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type CampusPriority = (typeof CAMPUS_PRIORITIES)[number];

export const INFORMATION_STATUSES = ["active", "superseded", "expired", "draft"] as const;
export type InformationStatus = (typeof INFORMATION_STATUSES)[number];

export const SOURCE_TYPES = [
  "OFFICIAL_WEBSITE",
  "OFFICIAL_NOTICE",
  "MOODLE",
  "EMAIL",
  "GOOGLE_CLASSROOM",
  "COLLEGE_PORTAL",
  "STUDENT_SUBMISSION",
] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export interface College {
  id: string;
  name: string;
  abbreviation?: string;
  city: string;
  state: string;
  university?: string;
  established?: number;
  website?: string;
}

export interface InformationSource {
  id: string;
  name: string;
  type: SourceType;
  url?: string;
}

/**
 * A single piece of campus information with full provenance.
 *
 * Temporal fields intentionally support the future "information archaeology"
 * engine: a notice can supersede another (supersedesId / supersededById) and
 * carry an effective window (effectiveFrom / effectiveUntil). The UI should
 * only ever present items whose status is "active".
 */
export interface CampusInformation {
  id: string;
  collegeId: string;
  title: string;
  description: string;
  category: CampusCategory;
  priority: CampusPriority;
  status: InformationStatus;
  source: InformationSource;
  /** ISO-8601 — when the information was first published. */
  publishedAt: string;
  /** ISO-8601 — when the information was last modified. */
  updatedAt: string;
  effectiveFrom?: string;
  effectiveUntil?: string;
  supersedesId?: string;
  supersededById?: string;
  link?: string;
  metadata?: Record<string, string>;
}

export const PRIORITY_RANK: Record<CampusPriority, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
};