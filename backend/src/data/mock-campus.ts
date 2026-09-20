/**
 * DEMO DATA — fictional campuses and sample campus information.
 *
 * Everything below is invented for development. No real institution is
 * represented. This dataset is swapped for real college data via the data
 * layer; the API contract (see `domain/campus.ts`) stays unchanged.
 */

import {
  PRIORITY_RANK,
  type CampusCategory,
  type CampusInformation,
  type CampusPriority,
  type College,
  type InformationSource,
  type InformationStatus,
  type SourceType,
} from "../domain/campus.js";

const minutesAgo = (m: number): string =>
  new Date(Date.now() - m * 60_000).toISOString();
const hoursAgo = (h: number): string => minutesAgo(h * 60);
const daysAgo = (d: number): string => hoursAgo(d * 24);

export const MOCK_COLLEGES: College[] = [
  {
    id: "col-ait",
    name: "Amberfield Institute of Technology",
    abbreviation: "AIT",
    city: "Bengaluru",
    state: "Karnataka",
    university: "Crestline University",
    established: 2009,
    website: "https://ait.example.edu",
  },
  {
    id: "col-nce",
    name: "Northgate College of Engineering",
    abbreviation: "NCE",
    city: "Pune",
    state: "Maharashtra",
    university: "Vihaan University",
    established: 2012,
    website: "https://nce.example.edu",
  },
  {
    id: "col-ced",
    name: "Cedarwood University",
    city: "Chennai",
    state: "Tamil Nadu",
    established: 2004,
  },
  {
    id: "col-smc",
    name: "Sunrise Medical College",
    abbreviation: "SMC",
    city: "Kochi",
    state: "Kerala",
    established: 2015,
  },
  {
    id: "col-kid",
    name: "Kalinga Design Institute",
    abbreviation: "KID",
    city: "Bhubaneswar",
    state: "Odisha",
    established: 2018,
  },
  {
    id: "col-rsc",
    name: "Riverside School of Commerce",
    abbreviation: "RSC",
    city: "Hyderabad",
    state: "Telangana",
    established: 2010,
  },
];

const src = (
  id: string,
  name: string,
  type: SourceType,
  url?: string,
): InformationSource => ({ id, name, type, url });

interface InfoSeed {
  id: string;
  collegeId: string;
  title: string;
  description: string;
  category: CampusCategory;
  priority: CampusPriority;
  status?: InformationStatus;
  source: InformationSource;
  publishedAt: string;
  updatedAt: string;
  supersedesId?: string;
  supersededById?: string;
  link?: string;
  metadata?: Record<string, string>;
}

const info = (seed: InfoSeed): CampusInformation => ({
  status: "active",
  ...seed,
});

export const MOCK_CAMPUS_INFORMATION: CampusInformation[] = [
  // ── Amberfield Institute of Technology ───────────────────────────
  info({
    id: "ait-notice-exam-schedule",
    collegeId: "col-ait",
    title: "Mid-Semester Examination Schedule Released",
    description:
      "The revised mid-semester examination schedule has been published. Check the Academic section for room and time details.",
    category: "notices",
    priority: "high",
    source: src("src-ait-exam-cell", "Examination Cell Notice", "OFFICIAL_NOTICE"),
    publishedAt: daysAgo(1),
    updatedAt: hoursAgo(2),
  }),
  info({
    id: "ait-notice-electives-deadline",
    collegeId: "col-ait",
    title: "Semester VII Elective Registration Deadline Extended",
    description:
      "The deadline to register for Semester VII electives has been extended to September 26. Late fee applies after that date.",
    category: "notices",
    priority: "normal",
    source: src("src-ait-academic-office", "Academic Office Notice", "OFFICIAL_NOTICE"),
    publishedAt: daysAgo(2),
    updatedAt: hoursAgo(5),
  }),
  info({
    id: "ait-notice-campus-closed",
    collegeId: "col-ait",
    title: "Campus Closed on October 2",
    description:
      "The entire campus will remain closed on October 2 for the public holiday. Hostel mess will operate on a reduced schedule.",
    category: "notices",
    priority: "urgent",
    source: src("src-ait-admin", "Administration Office Notice", "OFFICIAL_NOTICE"),
    publishedAt: daysAgo(1),
    updatedAt: daysAgo(1),
  }),
  // Superseded pair — exercises temporal provenance
  info({
    id: "ait-acad-ds-exam-old",
    collegeId: "col-ait",
    title: "Data Structures Mid-Semester Examination — Original Schedule",
    description: "Scheduled for September 20, 09:00–10:00, Room AB-204.",
    category: "academic",
    priority: "high",
    status: "superseded",
    supersededById: "ait-acad-ds-exam-revised",
    source: src("src-ait-exam-cell", "Examination Cell Notice", "OFFICIAL_NOTICE"),
    publishedAt: daysAgo(6),
    updatedAt: daysAgo(5),
  }),
  info({
    id: "ait-acad-ds-exam-revised",
    collegeId: "col-ait",
    title: "Data Structures Mid-Semester Examination (Revised)",
    description:
      "Revised schedule: September 22, 09:00–10:00, Room AB-204. This notice replaces the earlier September 20 schedule.",
    category: "academic",
    priority: "high",
    supersedesId: "ait-acad-ds-exam-old",
    source: src("src-ait-exam-cell", "Examination Cell Revised Notice", "OFFICIAL_NOTICE"),
    publishedAt: hoursAgo(3),
    updatedAt: hoursAgo(3),
  }),
  info({
    id: "ait-acad-os-class-change",
    collegeId: "col-ait",
    title: "Operating Systems Lecture — Timetable Change",
    description: "Wednesday lecture moved to 11:00, Room LB-12.",
    category: "academic",
    priority: "normal",
    source: src("src-ait-moodle-os", "Operating Systems — Faculty Moodle", "MOODLE"),
    publishedAt: daysAgo(3),
    updatedAt: daysAgo(1),
    metadata: { when: "Wed 11:00 · Room LB-12" },
  }),
  info({
    id: "ait-acad-calendar-oct",
    collegeId: "col-ait",
    title: "Academic Calendar — October 2026",
    description:
      "Key dates for October: internal assessment week, mid-semester break, and semester meet.",
    category: "academic",
    priority: "low",
    source: src("src-ait-website", "Amberfield Institute of Technology", "OFFICIAL_WEBSITE", "https://ait.example.edu"),
    publishedAt: daysAgo(4),
    updatedAt: daysAgo(3),
  }),
  info({
    id: "ait-transport-route3",
    collegeId: "col-ait",
    title: "Route 3 — Main Gate to Hostel Block",
    description: "First trip 07:45 AM. Runs every 20 minutes until 11:00 PM.",
    category: "transport",
    priority: "normal",
    source: src("src-ait-transport", "Transport Office", "OFFICIAL_WEBSITE"),
    publishedAt: daysAgo(10),
    updatedAt: hoursAgo(9),
    metadata: { timing: "First trip 07:45 AM · every 20 min" },
  }),
  info({
    id: "ait-transport-route7-detour",
    collegeId: "col-ait",
    title: "Route 7 Temporary Re-Route — East Campus Road Work",
    description:
      "East campus road work begins this week. Route 7 will detour via the service gate until further notice.",
    category: "transport",
    priority: "high",
    source: src("src-ait-transport", "Transport Office Notice", "OFFICIAL_NOTICE"),
    publishedAt: hoursAgo(7),
    updatedAt: hoursAgo(7),
  }),
  info({
    id: "ait-mess-todays-lunch",
    collegeId: "col-ait",
    title: "Today's Lunch",
    description: "Rice · Dal · Paneer · Salad · Curd",
    category: "mess",
    priority: "normal",
    source: src("src-ait-mess", "Mess Committee", "OFFICIAL_NOTICE"),
    publishedAt: hoursAgo(4),
    updatedAt: hoursAgo(4),
  }),
  info({
    id: "ait-mess-special-thali",
    collegeId: "col-ait",
    title: "Tomorrow's Special: Festival Thali",
    description: "Celebrating Navratri — special thali with extra dessert tomorrow at both mess blocks.",
    category: "mess",
    priority: "low",
    source: src("src-ait-mess", "Mess Committee", "OFFICIAL_NOTICE"),
    publishedAt: hoursAgo(4),
    updatedAt: hoursAgo(4),
  }),
  info({
    id: "ait-events-hackathon",
    collegeId: "col-ait",
    title: "24-Hour Hackathon — October 18–19",
    description: "Build something real in 24 hours. Teams of 2–4. Innovation Lab, starting 9 AM.",
    category: "events",
    priority: "normal",
    source: src("src-ait-student-council", "Student Council", "OFFICIAL_WEBSITE"),
    publishedAt: daysAgo(2),
    updatedAt: hoursAgo(11),
    link: "https://ait.example.edu/hackathon",
  }),
  info({
    id: "ait-events-git-workshop",
    collegeId: "col-ait",
    title: "Workshop: Git & Open Source — Friday 4 PM",
    description: "Hands-on intro to version control and your first open-source contribution. Club Room 2.",
    category: "events",
    priority: "normal",
    source: src("src-ait-clubs", "Clubs Portal", "COLLEGE_PORTAL"),
    publishedAt: daysAgo(1),
    updatedAt: daysAgo(1),
  }),
  info({
    id: "ait-opp-summer-research",
    collegeId: "col-ait",
    title: "Summer Research Internship Applications Open",
    description: "Faculty-led research internships across CS, ECE and design. Deadline: October 25.",
    category: "opportunities",
    priority: "high",
    source: src("src-ait-placement", "Placement Cell Notice", "OFFICIAL_NOTICE"),
    publishedAt: daysAgo(1),
    updatedAt: hoursAgo(6),
  }),
  info({
    id: "ait-opp-hackthecampus",
    collegeId: "col-ait",
    title: "HackTheCampus — Coding Competition Registrations",
    description: "Inter-college algorithmic contest. Individual or duo participation.",
    category: "opportunities",
    priority: "normal",
    source: src("src-ait-website", "Amberfield Institute of Technology", "OFFICIAL_WEBSITE"),
    publishedAt: daysAgo(2),
    updatedAt: daysAgo(2),
  }),
  info({
    id: "ait-opp-merit-scholarship",
    collegeId: "col-ait",
    title: "Merit Scholarship — Apply by November 5",
    description: "Merit-cum-means scholarships for continuing students. Apply through the college portal.",
    category: "opportunities",
    priority: "low",
    source: src("src-ait-admin", "Administration Office Notice", "OFFICIAL_NOTICE"),
    publishedAt: daysAgo(4),
    updatedAt: daysAgo(4),
  }),

  // ── Northgate College of Engineering ────────────────────────────
  info({
    id: "nce-notice-freshers",
    collegeId: "col-nce",
    title: "Fresher's Induction Schedule Released",
    description: "Day-wise induction plan for the new batch. Day 1: campus tour and faculty meet.",
    category: "notices",
    priority: "normal",
    source: src("src-nce-academic", "Academic Office Notice", "OFFICIAL_NOTICE"),
    publishedAt: daysAgo(2),
    updatedAt: daysAgo(1),
  }),
  info({
    id: "nce-acad-math-cycle",
    collegeId: "col-nce",
    title: "Mathematics I — Cycle Test Timetable",
    description: "Cycle test on September 28, 10:00–11:30. Hall B. Bring student ID.",
    category: "academic",
    priority: "normal",
    source: src("src-nce-moodle-math", "Mathematics I — Faculty Moodle", "MOODLE"),
    publishedAt: daysAgo(2),
    updatedAt: hoursAgo(8),
    metadata: { when: "Sep 28 · 10:00–11:30 · Hall B" },
  }),
  info({
    id: "nce-acad-physics-lab",
    collegeId: "col-nce",
    title: "Physics Lab Manual Uploaded",
    description: "Lab manual and observation templates are now available for download.",
    category: "academic",
    priority: "low",
    source: src("src-nce-moodle-physics", "Physics — Faculty Moodle", "MOODLE"),
    publishedAt: daysAgo(1),
    updatedAt: daysAgo(1),
  }),
  info({
    id: "nce-transport-shuttle2",
    collegeId: "col-nce",
    title: "Campus Shuttle — Route 2 Timings Updated",
    description: "Evening shuttle now departs at 6:15 PM (was 5:45 PM) to accommodate late labs.",
    category: "transport",
    priority: "high",
    source: src("src-nce-transport", "Transport Office Notice", "OFFICIAL_NOTICE"),
    publishedAt: hoursAgo(6),
    updatedAt: hoursAgo(6),
  }),
  info({
    id: "nce-events-technova",
    collegeId: "col-nce",
    title: "TechNova 2026 — Annual Technical Festival",
    description: "Two days of contests, talks and project showcases. Registrations open on the events portal.",
    category: "events",
    priority: "normal",
    source: src("src-nce-website", "Northgate College of Engineering", "OFFICIAL_WEBSITE"),
    publishedAt: daysAgo(3),
    updatedAt: daysAgo(1),
  }),
  info({
    id: "nce-events-chess",
    collegeId: "col-nce",
    title: "Chess Club Meetup — Every Friday",
    description: "Casual blitz evening, 6 PM, Student Lounge. Beginners welcome.",
    category: "events",
    priority: "low",
    source: src("src-nce-clubs", "Clubs Portal", "COLLEGE_PORTAL"),
    publishedAt: daysAgo(5),
    updatedAt: daysAgo(5),
  }),
  // Draft — must never be presented as active
  info({
    id: "nce-opp-placement-draft",
    collegeId: "col-nce",
    title: "Placement Drive — TechCorp (Draft)",
    description: "Preliminary notice. Not yet confirmed. Do not display as active.",
    category: "opportunities",
    priority: "high",
    status: "draft",
    source: src("src-nce-placement", "Placement Cell", "OFFICIAL_NOTICE"),
    publishedAt: hoursAgo(2),
    updatedAt: hoursAgo(2),
  }),
];

const COLLEGE_SEARCH_FIELDS: (keyof College)[] = [
  "name",
  "abbreviation",
  "city",
  "state",
  "university",
];

export function searchColleges(query?: string): College[] {
  const q = (query ?? "").trim().toLowerCase();
  if (!q) return MOCK_COLLEGES;
  return MOCK_COLLEGES.filter((college) =>
    COLLEGE_SEARCH_FIELDS.some((field) => {
      const value = college[field];
      return typeof value === "string" && value.toLowerCase().includes(q);
    }),
  );
}

export function getCollegeById(id: string): College | undefined {
  return MOCK_COLLEGES.find((college) => college.id === id);
}

export interface CampusInformationFilter {
  category?: CampusCategory;
  query?: string;
  /** Defaults to "active"; pass "all" to include every status. */
  status?: InformationStatus | "all";
}

export function getCampusInformation(
  collegeId: string,
  filter: CampusInformationFilter = {},
): CampusInformation[] {
  let items = MOCK_CAMPUS_INFORMATION.filter(
    (item) => item.collegeId === collegeId,
  );

  const status = filter.status ?? "active";
  if (status !== "all") {
    items = items.filter((item) => item.status === status);
  }

  if (filter.category) {
    items = items.filter((item) => item.category === filter.category);
  }

  const q = (filter.query ?? "").trim().toLowerCase();
  if (q) {
    items = items.filter((item) =>
      `${item.title} ${item.description}`.toLowerCase().includes(q),
    );
  }

  return [...items].sort((a, b) => {
    const byPriority = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    if (byPriority !== 0) return byPriority;
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}