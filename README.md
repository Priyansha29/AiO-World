<div align="center">

# AiO World

**One browser tab for academics, career prep, student tools, and downtime.**

React 19 · Vite 8 · Tailwind CSS v4 · Express 5 · TypeScript

[Platform Lanes](#platform-lanes) · [Toolbox](#toolbox) · [Architecture](#architecture) · [Local Setup](#local-setup) · [Verification](#verification)

</div>

---

## Overview

Student life is scattered across LMS portals, PDFs, spreadsheets, and single-purpose websites. AiO World brings those workflows into one client-first web application backed by a lightweight Express API — no mandatory sign-up wall, zero bloat, and deterministic software wherever math is enough.

---

## Platform Lanes

| Lane | Routes | What it handles |
| :--- | :--- | :--- |
| **Campus** | `#/setup`, `#/campus` | College selection profile and localized campus updates |
| **Learn** | `#/learn`, `#/learn/library`, `#/learn/subjects` | Technical book reader (`pdfjs-dist`), personal shelf, and subject notes |
| **Career** | `#/career/roadmaps`, `/resume`, `/ats-scanner`, `/resume-rooster` | Domain roadmaps, live A4 Resume Builder with PDF export, ATS keyword/heuristic scanner, and honest bullet-point critique |
| **Tools** | `#/tools`, `#/tools/:id` | 17 pure-domain calculators and developer utilities running offline in the browser |
| **Fun & Focus** | `#/fun`, `#/play/guess-who`, `#/focus` | Mood-based discovery catalog, Guess Who mini-game, and ambient day/night focus room (`ElsewhereHero` + Web Audio synthesizer) |
| **Sidequests** | `#/sidequests` | Curated non-academic reads, hobbies, weekend events, and interest circles |

---

## Toolbox

All calculation logic lives in isolated, DOM-free ESM modules under `frontend/src/features/tools/domain/` and `frontend/src/features/career/domain/`:

- **Academic**: Attendance (75% skip/recovery planner), CGPA / SGPA Calculator, Marks & Reverse Percentage, Relative Grading (mean, median, SD, z-score, percentile)
- **Career**: Indian Salary / CTC Breakdown (FY 2024–25 & 2025–26 slabs, §87A rebate, surcharge, cess), Resume Builder, ATS Scanner, Resume Rooster
- **Networking**: IPv4 CIDR Inspector (`/0`–`/32`, RFC 3021 `/31` point-to-point, binary masks), Subnet Planner (by host or subnet count)
- **Developer**: JSON Formatter & Error Locator, Base64 UTF-8 Codec, URL Percent Codec, Regex Tester (global & named groups), Color Space Converter (HEX / RGB / HSL)
- **General**: Unit Converter (length, mass, volume, data, temperature with absolute-zero guards), Unix Timestamp Converter, IANA Time Zone Converter, Live Currency Converter

---

## Architecture

```text
AiO-World/
├── frontend/
│   ├── components.json             # shadcn/ui configuration (@/* alias)
│   ├── tsconfig.json
│   └── src/
│       ├── components/
│       │   ├── ui/elsewhere-hero.tsx   # Day/night hero + live Web Audio engine
│       │   ├── Navbar.jsx / Explore.jsx / Footer.jsx
│       │   └── platform/           # Shared lane shell & catalog explorer
│       ├── features/
│       │   ├── campus/             # College onboarding & Campus Hub
│       │   ├── career/             # Roadmaps, Resume Builder, ATS, Rooster
│       │   ├── learn/              # Library PDF reader & Subjects
│       │   ├── play/               # Fun catalog, Guess Who, Focus soundscape
│       │   ├── sidequests/         # Beyond-campus experiences
│       │   └── tools/              # 17 calculators (pure domain + React UI)
│       ├── lib/utils.ts
│       └── router/hash-router.js
│   └── test/                       # 17 node:test suites (115 tests)
└── backend/
    └── src/
        ├── app.ts                  # Express 5 + CORS + terminal error handler
        ├── routes/colleges.ts
        └── modules/
            ├── currency/           # Keyless open.er-api.com integration
            └── sidequests/
```

---

## Local Setup

Requires **Node.js 22+** and **npm 10+**.

### 1. Install dependencies

```bash
npm --prefix frontend install
npm --prefix backend install
```

### 2. Environment variables (optional)

Both services boot with sensible defaults. Copy `.env.example` if overriding ports or adding optional Supabase bucket credentials:

```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

### 3. Run dev servers

```bash
# Terminal 1 — Express API (http://localhost:5000)
npm --prefix backend run dev

# Terminal 2 — Vite dev server (http://localhost:5173, proxies /api -> :5000)
npm --prefix frontend run dev
```

Useful direct routes in development:
- `#/` — Landing page with `ElsewhereHero` ambient header and platform lanes
- `#/focus` — Full-screen ambient focus & Web Audio soundscape room
- `#/demo` — Standalone `ElsewhereHero` component demo
- `#/tools` — All 17 interactive calculators

---

## Verification

Unit tests use Node.js's built-in `node:test` and `node:assert/strict` with zero third-party test runner dependencies.

```bash
# Run all 115 domain unit tests (academic, career, networking, developer, general)
npm --prefix frontend test

# Watch mode during development
npm --prefix frontend run test:watch

# Lint frontend (oxlint)
npm --prefix frontend run lint

# Production bundle check
npm --prefix frontend run build

# Backend TypeScript check
npm --prefix backend run typecheck
```

---

## License

[MIT](LICENSE) © 2026 Priyansha Gour & Harman

<sub>One day Priyansha will complete this project.</sub>
