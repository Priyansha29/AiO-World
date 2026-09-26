/**
 * Interest circle seed — DEMO DATA.
 *
 * A circle is the future social primitive, stubbed honestly: a named group
 * around one interest with a member count and a place. No member list exists
 * anywhere in this module, because there is no authentication and "who is in
 * this circle" is precisely the question a real identity system has to answer
 * before it can be exposed.
 *
 * `collegeId: null` means the circle is city-wide.
 */
import { type InterestCircle } from "../types/sidequests.js";

export const SEED_CIRCLES: InterestCircle[] = [
  {
    id: "cir-nce-running",
    name: "Running Club",
    slug: "nce-running-club",
    description:
      "Tuesday and Saturday runs along the Mula–Mutha. All paces welcome, nobody finishes alone.",
    interestSlug: "running",
    collegeId: "col-nce",
    city: "Pune",
    memberCount: 37,
    isActive: true,
  },
  {
    id: "cir-ait-f1",
    name: "F1 Fans",
    slug: "ait-f1-fans",
    description:
      "Race watch parties, a predictions league, and an unreasonable amount of opinion about aero.",
    interestSlug: "f1",
    collegeId: "col-ait",
    city: "Bengaluru",
    memberCount: 61,
    isActive: true,
  },
  {
    id: "cir-ced-guitar",
    name: "Guitar Circle",
    slug: "ced-guitar-circle",
    description:
      "Chord charts, a practice room on Wednesdays, and a low-stakes monthly jam. Beginners genuinely welcome.",
    interestSlug: "guitar",
    collegeId: "col-ced",
    city: "Chennai",
    memberCount: 18,
    isActive: true,
  },
  {
    id: "cir-nce-mma",
    name: "MMA & Boxing",
    slug: "nce-mma-boxing",
    description:
      "Footwork, bag work and technique workshops. No experience required to turn up.",
    interestSlug: "mma",
    collegeId: "col-nce",
    city: "Pune",
    memberCount: 22,
    isActive: true,
  },
  {
    id: "cir-ced-film",
    name: "Film Club",
    slug: "ced-film-club",
    description:
      "One film a week, chosen by vote on Monday. Discussion afterwards is optional and usually good.",
    interestSlug: "film",
    collegeId: "col-ced",
    city: "Chennai",
    memberCount: 19,
    isActive: true,
  },
  {
    id: "cir-ced-books",
    name: "Books & Fiction",
    slug: "ced-books-fiction",
    description:
      "One book a month, everybody reads the same thing, first Sunday. No homework, no essays.",
    interestSlug: "books",
    collegeId: "col-ced",
    city: "Chennai",
    memberCount: 31,
    isActive: true,
  },
  {
    id: "cir-nce-cooking",
    name: "Cooking Society",
    slug: "nce-cooking-society",
    description:
      "Cook-alongs in the shared kitchen, plus a recipe swap board nobody has to moderate.",
    interestSlug: "cooking",
    collegeId: "col-nce",
    city: "Pune",
    memberCount: 26,
    isActive: true,
  },
  {
    id: "cir-ait-gaming",
    name: "Gaming Nights",
    slug: "ait-gaming-nights",
    description:
      "Weekly lobby, mostly co-op, occasionally unhinged. Controllers provided, bring headphones.",
    interestSlug: "gaming",
    collegeId: "col-ait",
    city: "Bengaluru",
    memberCount: 44,
    isActive: true,
  },
  {
    id: "cir-city-photography",
    name: "Photography Walkers",
    slug: "city-photography-walkers",
    description:
      "City-wide, not campus-bound. One walk a month, different neighbourhood every time.",
    interestSlug: "photography",
    collegeId: null,
    city: "Chennai",
    memberCount: 12,
    isActive: true,
  },
  {
    id: "cir-nce-chess",
    name: "Chess Club",
    slug: "nce-chess-club",
    description:
      "Weekly rapid nights and a monthly blitz ladder. Bring a board if you are too lazy to share.",
    interestSlug: "chess",
    collegeId: "col-nce",
    city: "Pune",
    memberCount: 17,
    isActive: true,
  },
  {
    id: "cir-ced-astronomy",
    name: "Astronomy Cell",
    slug: "ced-astronomy-cell",
    description:
      "Telescope nights when the sky is clear, and a lot of argument about the maths when it is not.",
    interestSlug: "astronomy",
    collegeId: "col-ced",
    city: "Chennai",
    memberCount: 14,
    isActive: true,
  },
  {
    id: "cir-ait-night-runners",
    name: "Night Runners",
    slug: "ait-night-runners",
    description:
      "Two easy runs a week, entirely uncompetitive. The group chat is friendlier than the runs are fast.",
    interestSlug: "running",
    collegeId: "col-ait",
    city: "Bengaluru",
    memberCount: 24,
    isActive: true,
  },
];

export const SEED_CIRCLE_BY_ID: ReadonlyMap<string, InterestCircle> = new Map(
  SEED_CIRCLES.map((circle) => [circle.id, circle]),
);

export const SEED_CIRCLE_BY_SLUG: ReadonlyMap<string, InterestCircle> = new Map(
  SEED_CIRCLES.map((circle) => [circle.slug, circle]),
);
