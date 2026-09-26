/**
 * Sidequests event seed — DEMO DATA.
 *
 * Every event below is invented. No real club, society, organiser or gathering
 * is represented, and nothing here is a real listing. The events are dated
 * relative to "now" so the time filters (this week / weekend) have something
 * true to filter, and the API labels every response `meta.demo: true` with the
 * UI repeating the disclaimer.
 *
 * College ids match the fictional catalogue in `data/mock-campus.ts`. Events
 * with `collegeId: null` are deliberately city-wide — not everything worth
 * doing happens on a campus, and the model allows it.
 */
import { type SidequestEvent } from "../types/sidequests.js";

/** ISO timestamp `days` from now at a given local hour. */
function at(days: number, hour: number, minute = 0): string {
  const date = new Date(Date.now() + days * 86_400_000);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

/**
 * The nth upcoming Saturday (0 = this coming one) at a given hour. Weekend
 * filters need real weekend dates, and rolling them forward keeps the demo
 * meaningful whenever the seed is run rather than rotting on a fixed date.
 */
function saturday(weeksAhead: number, hour: number, minute = 0): string {
  const now = new Date();
  const daysUntilSaturday = ((6 - now.getDay() + 7) % 7) || 7;
  const date = new Date(now.getTime() + (daysUntilSaturday + weeksAhead * 7) * 86_400_000);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

function sunday(weeksAhead: number, hour: number, minute = 0): string {
  const now = new Date();
  const daysUntilSunday = ((0 - now.getDay() + 7) % 7) || 7;
  const date = new Date(now.getTime() + (daysUntilSunday + weeksAhead * 7) * 86_400_000);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export const SEED_EVENTS: SidequestEvent[] = [
  {
    id: "evt-pune-night-run",
    title: "Pune Night Run — 5K",
    description:
      "A flat, lit 5K loop starting at the college gate. No timing, no pressure, coffee after. Pace group for beginners runs at the back.",
    category: "move",
    startTime: saturday(0, 19, 0),
    endTime: saturday(0, 21, 0),
    venue: "Northgate College of Engineering — main gate",
    city: "Pune",
    collegeId: "col-nce",
    organizer: "NCE Running Club (demo)",
    registrationUrl: "https://events.example.edu/nce-night-run",
    isFree: true,
    isActive: true,
    interestSlugs: ["running", "cycling"],
  },
  {
    id: "evt-open-mic-chenai",
    title: "Campus Open Mic — short sets",
    description:
      "Three minutes each, any instrument or voice. Sign-up sheet at the desk from 5pm. First-timers are actively encouraged.",
    category: "create",
    startTime: saturday(0, 18, 30),
    endTime: saturday(0, 21, 30),
    venue: "Cedarwood University — Students' Union Hall",
    city: "Chennai",
    collegeId: "col-ced",
    organizer: "Cedarwood Music Society (demo)",
    registrationUrl: "https://events.example.edu/ced-open-mic",
    isFree: true,
    isActive: true,
    interestSlugs: ["guitar", "writing", "film"],
  },
  {
    id: "evt-photography-walk",
    title: "Photography Walk — Fort to Marina",
    description:
      "A slow 3km walk shooting one frame per street, stopping to look properly at five. Any camera, including a phone.",
    category: "create",
    startTime: sunday(0, 7, 0),
    endTime: sunday(0, 10, 0),
    venue: "Marina Beach entrance, East Gate",
    city: "Chennai",
    collegeId: null,
    organizer: "Wanderframe Collective (demo)",
    registrationUrl: "https://events.example.edu/wanderframe-walk",
    isFree: true,
    isActive: true,
    interestSlugs: ["photography", "hiking", "food"],
  },
  {
    id: "evt-mma-beginner",
    title: "Beginner MMA Workshop — footwork and basics",
    description:
      "Two hours on stance, footwork and safe partner technique. All equipment provided. Bring water and indoor shoes.",
    category: "move",
    startTime: saturday(1, 9, 0),
    endTime: saturday(1, 11, 0),
    venue: "Northgate College of Engineering — sports hall",
    city: "Pune",
    collegeId: "col-nce",
    organizer: "NCE Combat Sports Club (demo)",
    registrationUrl: "https://events.example.edu/nce-mma-intro",
    isFree: false,
    isActive: true,
    interestSlugs: ["mma", "boxing", "gym"],
  },
  {
    id: "evt-watercolour-jam",
    title: "Art Jam — watercolour, three hours",
    description:
      "One subject, everyone, no skill required. Materials supplied. You are allowed to make something bad and keep it.",
    category: "create",
    startTime: saturday(1, 14, 0),
    endTime: saturday(1, 17, 0),
    venue: "Kalinga Design Institute — studio 2",
    city: "Bhubaneswar",
    collegeId: "col-kid",
    organizer: "KID Studio Collective (demo)",
    registrationUrl: "https://events.example.edu/kid-art-jam",
    isFree: true,
    isActive: true,
    interestSlugs: ["art", "design", "photography"],
  },
  {
    id: "evt-f1-watch-party",
    title: "F1 Watch Party — Grand Prix",
    description:
      "Race on the big screen with the sound on, and someone who will explain what is happening for the first twenty minutes.",
    category: "discover",
    startTime: sunday(1, 15, 0),
    endTime: sunday(1, 18, 30),
    venue: "Amberfield Institute of Technology — auditorium",
    city: "Bengaluru",
    collegeId: "col-ait",
    organizer: "AIT Pit Lane Society (demo)",
    registrationUrl: "https://events.example.edu/ait-f1",
    isFree: true,
    isActive: true,
    interestSlugs: ["f1", "cars", "gaming"],
  },
  {
    id: "evt-campus-esports",
    title: "Campus Gaming Tournament — open bracket",
    description:
      "Open to all skill levels, team or solo. Brackets run on the spot; the final is best of three with commentary.",
    category: "unwind",
    startTime: saturday(2, 11, 0),
    endTime: saturday(2, 17, 0),
    venue: "Amberfield Institute of Technology — computer lab block",
    city: "Bengaluru",
    collegeId: "col-ait",
    organizer: "AIT Esports Club (demo)",
    registrationUrl: "https://events.example.edu/ait-esports",
    isFree: true,
    isActive: true,
    interestSlugs: ["gaming", "chess"],
  },
  {
    id: "evt-sunrise-5k-kochi",
    title: "Sunrise 5K — Kochi",
    description:
      "An easy out-and-back along the promenade, starting in the dark. Bags left at the finish table. No medals, genuinely.",
    category: "move",
    startTime: sunday(2, 5, 45),
    endTime: sunday(2, 7, 30),
    venue: "Marine Drive promenade, near the walkway",
    city: "Kochi",
    collegeId: "col-smc",
    organizer: "Coastline Runners (demo)",
    registrationUrl: "https://events.example.edu/coastline-sunrise",
    isFree: true,
    isActive: true,
    interestSlugs: ["running"],
  },
  {
    id: "evt-chess-rapid",
    title: "Chess Club Rapid Tournament",
    description:
      "15+10 rapid, five rounds, Swiss system. New players paired separately for the first two rounds.",
    category: "discover",
    startTime: saturday(2, 15, 0),
    endTime: saturday(2, 19, 0),
    venue: "Northgate College of Engineering — library annexe",
    city: "Pune",
    collegeId: "col-nce",
    organizer: "NCE Chess Club (demo)",
    registrationUrl: "https://events.example.edu/nce-chess",
    isFree: true,
    isActive: true,
    interestSlugs: ["chess", "books"],
  },
  {
    id: "evt-terrace-cooking",
    title: "Terrace Cooking Class — hostel food, done properly",
    description:
      "Three dishes from a single pan and a single ₹300 ingredient list. You eat what you cook. Booking essential, eight seats.",
    category: "create",
    startTime: sunday(3, 17, 0),
    endTime: sunday(3, 20, 0),
    venue: "Kothrud community terrace hall",
    city: "Pune",
    collegeId: null,
    organizer: "Little Kitchen Pune (demo)",
    registrationUrl: "https://events.example.edu/littlekitchen-terrace",
    isFree: false,
    isActive: true,
    interestSlugs: ["cooking", "food"],
  },
  {
    id: "evt-ghats-trek",
    title: "Day Trek — Sinhagad and the old city",
    description:
      "A 9km loop with a fortress at the top and lunch at the bottom. Monsoon trails are slippery; turn-ups are optional.",
    category: "explore",
    startTime: sunday(4, 6, 30),
    endTime: sunday(4, 13, 0),
    venue: "Sinhagad base, Darjeena Road",
    city: "Pune",
    collegeId: null,
    organizer: "Weekend Trails Collective (demo)",
    registrationUrl: "https://events.example.edu/weekend-trails-sinhagad",
    isFree: false,
    isActive: true,
    interestSlugs: ["hiking", "photography", "travel"],
  },
  {
    id: "evt-astronomy-night",
    title: "Astronomy Night — the winter sky",
    description:
      "Two telescopes on the terrace, a short talk on what is actually visible, then an hour of looking. Red torches provided.",
    category: "explore",
    startTime: saturday(3, 19, 30),
    endTime: saturday(3, 22, 0),
    venue: "Cedarwood University — science block terrace",
    city: "Chennai",
    collegeId: "col-ced",
    organizer: "Cedarwood Astronomy Cell (demo)",
    registrationUrl: "https://events.example.edu/ced-astro-night",
    isFree: true,
    isActive: true,
    interestSlugs: ["astronomy", "photography"],
  },
  {
    id: "evt-five-a-side",
    title: "Sunday Five-a-Side",
    description:
      "Rolling teams, everyone plays. Bring dark and light shirts. Pitch booked for two hours, goalmouth chaos guaranteed.",
    category: "move",
    startTime: sunday(5, 7, 0),
    endTime: sunday(5, 9, 0),
    venue: "Balgandharva Sports Complex — pitch 3",
    city: "Bengaluru",
    collegeId: "col-ait",
    organizer: "AIT Sunday XI (demo)",
    registrationUrl: "https://events.example.edu/ait-fiveaside",
    isFree: true,
    isActive: true,
    interestSlugs: ["football", "running", "gym"],
  },

  /* ── Mid-week, so "this week" and "weekend" are genuinely different filters ── */
  {
    id: "evt-lunchtime-chess",
    title: "Lunchtime Blitz Chess",
    description:
      "Three-minute games, Swiss ladder, forty minutes at lunch. Boards provided; there is usually a queue for the good clock.",
    category: "discover",
    startTime: at(2, 13, 0),
    endTime: at(2, 14, 0),
    venue: "Northgate College of Engineering — canteen courtyard",
    city: "Pune",
    collegeId: "col-nce",
    organizer: "NCE Chess Club (demo)",
    registrationUrl: "https://events.example.edu/nce-lunchtime-blitz",
    isFree: true,
    isActive: true,
    interestSlugs: ["chess", "gaming"],
  },
  {
    id: "evt-rooftop-stars",
    title: "Rooftop Star Party",
    description:
      "A short beginner talk, then everyone outside with whatever they can see unaided. Red torches, no white light.",
    category: "explore",
    startTime: at(4, 20, 0),
    endTime: at(4, 22, 0),
    venue: "Cedarwood University — hostel rooftop, block C",
    city: "Chennai",
    collegeId: "col-ced",
    organizer: "Cedarwood Astronomy Cell (demo)",
    registrationUrl: "https://events.example.edu/ced-star-party",
    isFree: true,
    isActive: true,
    interestSlugs: ["astronomy", "photography", "chess"],
  },
];

export const SEED_EVENT_BY_ID: ReadonlyMap<string, SidequestEvent> = new Map(
  SEED_EVENTS.map((event) => [event.id, event]),
);
