<!-- Project X — monorepo root README -->

<div align="center">

# Project X

**One tab. All of student life.**

Learn a skill. Build a career. Play a quick game with friends. Run a
calc that saves your semester. No downloads, no portals, no friction —
everything the student grind throws at you, from a single URL.

</div>

> If you are a developer working in this repository, the golden rule is:
> **give users the right thing with as little friction as possible.** Every
> feature we ship has to justify itself against real value, real effort, and
> real maintenance cost.

---

## What do you want to do today?

The product is organized around one question. Four answers.

| Mode | What it is | First examples |
| --- | --- | --- |
| **Learn** | Feed your curiosity with structure | DSA roadmaps, Web dev, Cybersecurity |
| **Career** | Go from student to hireable | Resume checker, Internship finder, Skill gap |
| **Play** | Have fun with the people who matter | Guess Who, Trivia, Couple games, F1 & movie packs |
| **Tools** | Delete the boring math | Attendance calculator, CGPA/SGPA calculator |

Four lanes, one homepage. Pick a lane, we handle the rest.

---

## Highlights

- **Browser-first.** Two tabs: one for `Uni Work`, one for `Anything Else`.
  Zero installs, zero sign-ups required to get value.
- **Low friction by design.** Little to nothing sits behind an account — the
  homepage, tools, and most of Play are reachable the second the page loads.
- **Student honest.** No fake testimonials, no fake user counts, no AI smoke.
  If AI is used, it's for a reason (resume analysis, personalization) — never
  for math that plain code does better.
- **Playground, not portal.** Built to feel like a browser playground:
  immediate, discoverable, interactive, low-friction.

---

## The stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Frontend | **React + Vite**, handwritten CSS design system | The homepage ships a full token system (light/dark, reduced-motion, per-mode accents) |
| Backend | **Node.js + Express + TypeScript** | Modular monolith, domain-first folder layout |
| Database | PostgreSQL + Prisma *(planned)* | Introduced only when the first feature genuinely needs persistence |
| Realtime | Socket.IO *(planned)* | Only for multiplayer game rooms, never for CRUD |
| Storage | Cloud object storage *(planned)* | Resumes and uploads never live in the database |
| AI | External API *(planned)* | Only where it earns its place: resume analysis, personalization |

**We deliberately avoid** microservices, Kubernetes, Redis, and any
infrastructure the current scope doesn't require. Simpler is better; we can
say so out loud.

---

## Repository layout

```
Project-X/
├── frontend/            React + Vite homepage
│   └── src/
│       ├── components/  Navbar, Hero, Explore, Footer
│       ├── data/        mode metadata (single source of truth)
│       ├── pages/       Home
│       └── ...
├── backend/             Express + TypeScript API
│   └── src/
│       ├── app.ts       Express app (routes, middleware)
│       └── server.ts    bootstrap / entrypoint
└── ...
```

Frontend work lives on the `frontend` branch, backend on `backend` — a
feature branch per workstream, nothing pushed straight to `main`.

---

## Getting started

### Frontend

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev      # http://localhost:5000, /api/health
npm run build    # tsc → dist/
npm run typecheck
```

---

## Current status

| Area | State |
| --- | --- |
| Homepage | Live on `frontend` — hero, nav, explore, footer |
| MVP scope | Under active definition — we lock feature lists *before* building more |
| Backend | TypeScript foundation, health check only |
| Everything else | Planned on paper only, added only if it earns its place |

We are students and this is a learning-first codebase. The Bar (our name for
the quality bar) asks: **clarity over feature count, polish over complexity,
real implementation over fake functionality.**

---

## Roadmap (loose order)

- **Lock the MVP** — one homepage, one real user journey, one full loop end to end.
- Homepage hardening — accessibility pass, responsive polish, reduced-motion audit.
- Real auth only when a feature genuinely requires an account.
- First tools (attendance / CGPA) as true calculator features.

---

## Contributing

This repository is built with a paired-commit workflow — think of every PR as
two people shipping. Changes land on feature branches and go through pull
requests; commits carry a `Co-authored-by` trailer.

Project maintainers: **Harman** and **Priyansha29**. If you're a student
reading this and want to contribute, open an issue first — tell us what you
want to build and why it earns its place. We'll say yes or tell you you're
overengineering it.

---

<div align="center">
<sub>Made by students — for students. Pick a lane, we'll handle the rest.</sub>
</div>
