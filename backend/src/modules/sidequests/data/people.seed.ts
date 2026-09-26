/**
 * "People around you" seed — DEMO DATA.
 *
 * Aggregate interest counts per college, and nothing else. These numbers exist
 * to answer one calm question on the page — "am I the only one?" — and they are
 * deliberately anonymous. There is no name, no avatar, no handle and no id per
 * person anywhere in this file, because there is no identity system to attribute
 * a count to.
 *
 * A city-wide row (`collegeId: null`) covers people who are not at any of the
 * demo colleges.
 */
import { type InterestCategory } from "../types/sidequests.js";

export interface InterestPopularity {
  /** Null = city-wide rather than tied to one college. */
  collegeId: string | null;
  interestSlug: string;
  category: InterestCategory;
  /** How many people, fictional. */
  count: number;
}

export const SEED_INTEREST_POPULARITY: InterestPopularity[] = [
  /* Northgate College of Engineering, Pune */
  { collegeId: "col-nce", interestSlug: "running", category: "move", count: 37 },
  { collegeId: "col-nce", interestSlug: "mma", category: "move", count: 22 },
  { collegeId: "col-nce", interestSlug: "gym", category: "move", count: 29 },
  { collegeId: "col-nce", interestSlug: "football", category: "move", count: 26 },
  { collegeId: "col-nce", interestSlug: "cooking", category: "create", count: 26 },
  { collegeId: "col-nce", interestSlug: "guitar", category: "create", count: 14 },
  { collegeId: "col-nce", interestSlug: "chess", category: "discover", count: 17 },
  { collegeId: "col-nce", interestSlug: "finance", category: "discover", count: 19 },
  { collegeId: "col-nce", interestSlug: "photography", category: "create", count: 11 },
  { collegeId: "col-nce", interestSlug: "gaming", category: "unwind", count: 24 },

  /* Amberfield Institute of Technology, Bengaluru */
  { collegeId: "col-ait", interestSlug: "f1", category: "discover", count: 61 },
  { collegeId: "col-ait", interestSlug: "gaming", category: "unwind", count: 44 },
  { collegeId: "col-ait", interestSlug: "cars", category: "discover", count: 33 },
  { collegeId: "col-ait", interestSlug: "running", category: "move", count: 24 },
  { collegeId: "col-ait", interestSlug: "gym", category: "move", count: 31 },
  { collegeId: "col-ait", interestSlug: "robotics", category: "discover", count: 12 },
  { collegeId: "col-ait", interestSlug: "photography", category: "create", count: 18 },
  { collegeId: "col-ait", interestSlug: "football", category: "move", count: 21 },
  { collegeId: "col-ait", interestSlug: "chess", category: "discover", count: 14 },

  /* Cedarwood University, Chennai */
  { collegeId: "col-ced", interestSlug: "guitar", category: "create", count: 18 },
  { collegeId: "col-ced", interestSlug: "books", category: "unwind", count: 29 },
  { collegeId: "col-ced", interestSlug: "film", category: "create", count: 19 },
  { collegeId: "col-ced", interestSlug: "photography", category: "create", count: 16 },
  { collegeId: "col-ced", interestSlug: "astronomy", category: "explore", count: 14 },
  { collegeId: "col-ced", interestSlug: "movies", category: "unwind", count: 34 },
  { collegeId: "col-ced", interestSlug: "anime", category: "unwind", count: 22 },
  { collegeId: "col-ced", interestSlug: "food", category: "explore", count: 27 },
  { collegeId: "col-ced", interestSlug: "writing", category: "create", count: 13 },

  /* Sunrise Medical College, Kochi */
  { collegeId: "col-smc", interestSlug: "running", category: "move", count: 21 },
  { collegeId: "col-smc", interestSlug: "swimming", category: "move", count: 15 },
  { collegeId: "col-smc", interestSlug: "books", category: "unwind", count: 18 },
  { collegeId: "col-smc", interestSlug: "podcasts", category: "unwind", count: 12 },
  { collegeId: "col-smc", interestSlug: "cooking", category: "create", count: 14 },
  { collegeId: "col-smc", interestSlug: "gym", category: "move", count: 17 },

  /* Kalinga Design Institute, Bhubaneswar */
  { collegeId: "col-kid", interestSlug: "art", category: "create", count: 24 },
  { collegeId: "col-kid", interestSlug: "design", category: "create", count: 21 },
  { collegeId: "col-kid", interestSlug: "photography", category: "create", count: 19 },
  { collegeId: "col-kid", interestSlug: "film", category: "create", count: 15 },
  { collegeId: "col-kid", interestSlug: "writing", category: "create", count: 16 },
  { collegeId: "col-kid", interestSlug: "hiking", category: "explore", count: 12 },

  /* City-wide — not attached to any college */
  { collegeId: null, interestSlug: "photography", category: "create", count: 64 },
  { collegeId: null, interestSlug: "hiking", category: "explore", count: 58 },
  { collegeId: null, interestSlug: "food", category: "explore", count: 91 },
  { collegeId: null, interestSlug: "running", category: "move", count: 112 },
  { collegeId: null, interestSlug: "cycling", category: "move", count: 47 },
  { collegeId: null, interestSlug: "travel", category: "explore", count: 73 },
  { collegeId: null, interestSlug: "chess", category: "discover", count: 39 },
  { collegeId: null, interestSlug: "diy", category: "discover", count: 28 },
  { collegeId: null, interestSlug: "gardening", category: "discover", count: 22 },
];
