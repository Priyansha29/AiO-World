/**
 * Interest catalogue — the atoms Sidequests is built from.
 *
 * Content, events and circles each point at exactly one of these, and a user's
 * Sidequests page is a set of them. Thirty is deliberately more than anyone
 * wants to pick at once, which is why the selector is filtered and searchable
 * rather than a wall of checkboxes.
 *
 * The `icon` values name glyphs in the frontend `InterestIcon` set rather than
 * image files, so the whole catalogue stays a text-only seed that a future
 * admin form can edit without a file upload.
 */
import { type Interest } from "../types/sidequests.js";

export const SEED_INTERESTS: Interest[] = [
  /* ── MOVE ────────────────────────────────────────────────────────────── */
  {
    id: "int-running",
    name: "Running",
    slug: "running",
    description:
      "Jogging, 5Ks, trail routes and the slow build to a distance that felt impossible last month.",
    icon: "run",
    category: "move",
    isActive: true,
  },
  {
    id: "int-gym",
    name: "Gym",
    slug: "gym",
    description:
      "Strength work that fits around a timetable, whether that is a campus gym or a corner of a hostel room.",
    icon: "dumbbell",
    category: "move",
    isActive: true,
  },
  {
    id: "int-mma",
    name: "MMA",
    slug: "mma",
    description:
      "Striking, grappling and footwork drills you can actually practise without a cage or a coach.",
    icon: "fist",
    category: "move",
    isActive: true,
  },
  {
    id: "int-boxing",
    name: "Boxing",
    slug: "boxing",
    description:
      "Shadowboxing, footwork and bag work — the oldest fitness habit there is, and still the best.",
    icon: "glove",
    category: "move",
    isActive: true,
  },
  {
    id: "int-football",
    name: "Football",
    slug: "football",
    description:
      "Five-a-side, watching, arguing about referee decisions, and the local club that always needs a player.",
    icon: "ball",
    category: "move",
    isActive: true,
  },
  {
    id: "int-cycling",
    name: "Cycling",
    slug: "cycling",
    description:
      "Long flat rides, hill repeats, and the discovery that a 20km loop is a completely different city.",
    icon: "bike",
    category: "move",
    isActive: true,
  },
  {
    id: "int-swimming",
    name: "Swimming",
    slug: "swimming",
    description:
      "Lap technique, breath drills, and the one pool on campus with an open lane at 6am.",
    icon: "wave",
    category: "move",
    isActive: true,
  },

  /* ── CREATE ──────────────────────────────────────────────────────────── */
  {
    id: "int-guitar",
    name: "Guitar",
    slug: "guitar",
    description:
      "First chords, songs that sound decent after a week, and the endless business of tuning.",
    icon: "guitar",
    category: "create",
    isActive: true,
  },
  {
    id: "int-photography",
    name: "Photography",
    slug: "photography",
    description:
      "Street photography, portraits, and shooting the same corner every week until it changes.",
    icon: "camera",
    category: "create",
    isActive: true,
  },
  {
    id: "int-art",
    name: "Art",
    slug: "art",
    description:
      "Sketchbooks, colour, and making things with your hands for no reason other than that it is satisfying.",
    icon: "palette",
    category: "create",
    isActive: true,
  },
  {
    id: "int-design",
    name: "Design",
    slug: "design",
    description:
      "Layouts, type, interfaces, posters — noticing what works and being annoyed by what does not.",
    icon: "design",
    category: "create",
    isActive: true,
  },
  {
    id: "int-fashion",
    name: "Fashion",
    slug: "fashion",
    description:
      "Thrifted, tailored, borrowed. How you dress is one of the few things entirely in your control.",
    icon: "hanger",
    category: "create",
    isActive: true,
  },
  {
    id: "int-cooking",
    name: "Cooking",
    slug: "cooking",
    description:
      "Real food from a small kitchen, on a budget, in the time between a lecture and a lab.",
    icon: "pot",
    category: "create",
    isActive: true,
  },
  {
    id: "int-writing",
    name: "Writing",
    slug: "writing",
    description:
      "Essays you actually want to finish, journals nobody reads, and finding the sentence that says it.",
    icon: "pen",
    category: "create",
    isActive: true,
  },
  {
    id: "int-film",
    name: "Film making",
    slug: "film",
    description:
      "Short films, video essays, editing timelines, and shooting whatever is happening near you.",
    icon: "film",
    category: "create",
    isActive: true,
  },

  /* ── EXPLORE ─────────────────────────────────────────────────────────── */
  {
    id: "int-travel",
    name: "Travel",
    slug: "travel",
    description:
      "Weekend trips, train routes, hostels, and planning a whole semester around one cheap flight.",
    icon: "compass",
    category: "explore",
    isActive: true,
  },
  {
    id: "int-hiking",
    name: "Hiking",
    slug: "hiking",
    description:
      "Day trails, overnight treks, and the very specific tiredness that comes with a good view.",
    icon: "mountain",
    category: "explore",
    isActive: true,
  },
  {
    id: "int-astronomy",
    name: "Astronomy",
    slug: "astronomy",
    description:
      "Naked-eye constellations, telescopes, and the fact that the sky is a completely different thing at 2am.",
    icon: "stars",
    category: "explore",
    isActive: true,
  },
  {
    id: "int-languages",
    name: "Languages",
    slug: "languages",
    description:
      "Learning one, maintaining another, and the specific confidence of ordering food in a language you half-know.",
    icon: "globe",
    category: "explore",
    isActive: true,
  },
  {
    id: "int-food",
    name: "Food exploration",
    slug: "food",
    description:
      "Chasing a good dosa, a third-wave coffee, a momo that beats the one near campus. Always worth it.",
    icon: "bowl",
    category: "explore",
    isActive: true,
  },

  /* ── UNWIND ──────────────────────────────────────────────────────────── */
  {
    id: "int-books",
    name: "Books",
    slug: "books",
    description:
      "Fiction, non-fiction, and the pile on your desk that is slowly becoming a structural problem.",
    icon: "book",
    category: "unwind",
    isActive: true,
  },
  {
    id: "int-movies",
    name: "Movies & TV",
    slug: "movies",
    description:
      "What to watch next, rewatches that hold up, and the comfort of a show you have already seen.",
    icon: "screen",
    category: "unwind",
    isActive: true,
  },
  {
    id: "int-anime",
    name: "Anime",
    slug: "anime",
    description:
      "Starting something new, finishing something old, and the genre rabbit holes that swallow a weekend.",
    icon: "sparkle",
    category: "unwind",
    isActive: true,
  },
  {
    id: "int-podcasts",
    name: "Podcasts",
    slug: "podcasts",
    description:
      "Long walks, short episodes, and the one true-crime series you will regret finishing.",
    icon: "headphones",
    category: "unwind",
    isActive: true,
  },
  {
    id: "int-gaming",
    name: "Gaming",
    slug: "gaming",
    description:
      "Co-op campaigns, ranked evenings, and the online friend you have never met in person.",
    icon: "controller",
    category: "unwind",
    isActive: true,
  },

  /* ── DISCOVER ────────────────────────────────────────────────────────── */
  {
    id: "int-f1",
    name: "F1",
    slug: "f1",
    description:
      "Grand Prix weekends, downforce explained properly, and the sport that makes strategy the main event.",
    icon: "flag",
    category: "discover",
    isActive: true,
  },
  {
    id: "int-cars",
    name: "Cars",
    slug: "cars",
    description:
      "Road trips, cheap first cars, and understanding why the thing in the driveway works the way it does.",
    icon: "car",
    category: "discover",
    isActive: true,
  },
  {
    id: "int-chess",
    name: "Chess",
    slug: "chess",
    description:
      "Openings, tactics puzzles, club nights, and the eternal argument about whether the clock ruins it.",
    icon: "knight",
    category: "discover",
    isActive: true,
  },
  {
    id: "int-robotics",
    name: "Robotics",
    slug: "robotics",
    description:
      "Building things that move for no reason, and the patience it takes to make them behave.",
    icon: "chip",
    category: "discover",
    isActive: true,
  },
  {
    id: "int-diy",
    name: "DIY",
    slug: "diy",
    description:
      "Repairing instead of replacing, building furniture badly, and the YouTube tutorial rabbit hole.",
    icon: "wrench",
    category: "discover",
    isActive: true,
  },
  {
    id: "int-finance",
    name: "Personal finance",
    slug: "finance",
    description:
      "Budgets, savings, and the unglamorous stuff that decides how much freedom you have later.",
    icon: "wallet",
    category: "discover",
    isActive: true,
  },
  {
    id: "int-gardening",
    name: "Gardening",
    slug: "gardening",
    description:
      "Balcony herbs, plants that survived, and the patience of growing something at your own pace.",
    icon: "sprout",
    category: "discover",
    isActive: true,
  },
];

export const SEED_INTEREST_BY_SLUG: ReadonlyMap<string, Interest> = new Map(
  SEED_INTERESTS.map((interest) => [interest.slug, interest]),
);

export const SEED_INTEREST_BY_ID: ReadonlyMap<string, Interest> = new Map(
  SEED_INTERESTS.map((interest) => [interest.id, interest]),
);
