# Sidequests (backend module)

The part of AiO World that happens outside academics and career.

`backend/src/modules/sidequests/` — a modular monolith module, mounted from
`src/app.ts` at `/api/sidequests/…`. No new dependencies, no new framework, no
second backend.

## Layer separation

| Layer        | File                                                     | Job                                                                    |
| ------------ | -------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Types**    | `types/sidequests.ts`                                     | Canonical contract. Mirrored by the frontend in `features/sidequests/domain`. |
| **Data**     | `data/*.seed.ts`                                          | Curated seed. No I/O. Add content here, not in a component.             |
| **Repository** | `repository/sidequests-repository.ts`                   | The entire persistence contract + its seed-backed implementation.        |
| **Service**  | `services/sidequests.service.ts`                          | All behaviour: ranking, diversity, discovery, filters.                  |
| **Validation** | `validation/sidequests.validation.ts`                    | Hand-rolled request validation → `{ ok, value }` or `{ ok: false, … }`. |
| **Controller** | `controllers/sidequests.controller.ts`                  | Read request, call service, shape response. No logic.                    |
| **Routes**   | `routes/sidequests.routes.ts`                             | URL map only.                                                           |
| **Migration** | `db/migrations/001_sidequests.sql`                        | PostgreSQL DDL. **Written but not applied** — see below.                 |

Business logic lives in the service. Route handlers contain no ranking, no
filtering and no persistence decisions.

## Two things this project does not have

**There is no database.** Not Prisma, not Postgres, not an ORM. The active
repository serves the curated seed and holds each user's own rows in process.
`db/migrations/001_sidequests.sql` is the real schema, written down so adopting a
database later is a migration rather than a redesign — the repository interface
is the whole contract, and swapping the implementation is one line in
`createSidequestsRepository()`.

Per-user state (interests, saves, circle joins, discovery history) is therefore
**in memory and does not survive a restart**. That is a real limitation, stated
here rather than hidden: restarting the dev server clears your selections.

**There is no authentication.** A "user" is an opaque id the browser mints into
`localStorage` and sends as `x-aioworld-user`. It is not a profile — no email, no
name, no location beyond the college already chosen in Campus. When real auth
lands this becomes the session user id and nothing else changes.

The user's college travels in `x-aioworld-college` (from the Campus
`profile-store`), not a query parameter, so a stale link cannot pin somebody
else's campus into a request.

## Recommendation logic

Deterministic. No AI, no ML, no black box — a named sum of weights:

| Factor                 | Weight | Notes                                              |
| ---------------------- | ------ | -------------------------------------------------- |
| `interestMatch`        | 40     | The item's primary interest is one you picked.      |
| `tagMatch`             | 6 each | A tag naming one of your interests.                  |
| `recency`              | 0–12   | Decays to zero over 60 days.                        |
| `featured`             | 8      | Curatorial boost. Tilts, does not dictate.          |

College and city relevance apply to events and circles, which are the only
records that carry a place. Ties break on an FNV-1a hash of the id, so **the
same interests always produce the same "Picked for you" row** — a shelf that
reshuffles on refresh reads as broken.

### Diversity

Ranking alone gives someone who picked running five running items. So selection
is greedy-with-a-cap, not a sort:

- `MAX_PER_INTEREST_IN_A_ROW = 2` — no interest fills more than two slots.
- One **wildcard** is reserved, so a user who picked four similar things still
  sees something they did not ask for.
- The cap relaxes rather than returning short, so a small catalogue can never
  produce an under-filled row.

Verified: four interests (running, f1, books, cooking) yield five distinct
interests across six slots.

### Discovery mix

"Surprise me" is **not** `Math.random()` over every row — that produces a
uniformly random, mostly irrelevant feed. It rolls a band, then picks inside it:

```ts
DISCOVERY_MIX = { onInterest: 0.7, adjacent: 0.2, unexpected: 0.1 }
```

Recently-shown ids are excluded, a band that has run dry falls through to the
next, and if the catalogue is exhausted the history clears once and the roll
happens again — so the button never dead-ends.

### The preview, and why `/discover` takes `exclude`

`/overview` includes a `discoverySeed` so the discovery section has a card on
arrival instead of a spinner. It is picked with the same band logic but is
**not** recorded as seen: loading a page must not spend a turn, or the first real
"Give me another" would skip a band for a reason nobody can see.

That creates one visible problem. The student is looking at a card, presses the
button, and the same card comes back — technically correct, indistinguishable
from a broken button. So `/discover` accepts `?exclude=<id>`, which the client
fills with whatever is on screen right now. The preview stays out of the history
and still cannot be re-served as the answer to "give me another".

`exclude` goes through `parseSlugList`, so a malformed value is silently dropped
rather than a 400: it is a hint about what to avoid, and a nonsense hint simply
avoids nothing. Nothing is built from it.

## Seed integrity check

Content, events, circles and interest-popularity rows all reference interests by
slug. A typo there is invisible at runtime: the item renders fine, but the "my
interests" filter silently never matches it. `assertSeedIntegrity()` checks every
reference at module load and throws on a mismatch.

This is not theoretical — it caught a real one (`design` was referenced by an
event and by `people.seed.ts` before the interest existed).

## Seed data

| File                       | Count | Contents                                              |
| -------------------------- | ----- | ----------------------------------------------------- |
| `data/interests.seed.ts`   | 32    | Across 5 moods: move 7, create 8, explore 5, unwind 5, discover 7. |
| `data/content.seed.ts`     | 38    | Guides, workouts, recipes, books, films, podcasts, facts, challenges. |
| `data/events.seed.ts`      | 15    | Fictional. Dated relative to *now* so time filters work. |
| `data/circles.seed.ts`     | 12    | Fictional. No member list exists anywhere.            |
| `data/people.seed.ts`      | 48    | Anonymous counts only. No name, avatar or id per person. |

**All events, circles and counts are invented.** No real club, organiser or
gathering is represented. Every response carries `meta.demo: true` and a
`meta.note` repeating it, and the UI shows the disclaimer.

Numeric claims in content were checked before being written. Nothing here is
generated or scraped.

## Adding content

Edit a `*.seed.ts` file and restart. The integrity check runs at startup, so a
broken reference stops the process instead of serving wrong results. No
component, endpoint or migration needs touching.

## API

All under `/api/sidequests/`. Success responses carry `meta`; errors are
`{ error: <code>, message: <sentence> }` and never contain a stack trace, file
path or driver message.

| Method   | Path                                | Notes                                    |
| -------- | ----------------------------------- | ---------------------------------------- |
| `GET`    | `/overview`                         | One request for the first viewport. ~⅕ of the catalogue. Returns `selectedInterests` and a `discoverySeed` (`{ item, band }`, not counted as seen). |
| `GET`    | `/interests`                        | `?category=` `?q=`                       |
| `GET`    | `/interests/selected`               | The user's picks. Must precede `/:slug`. |
| `GET`    | `/interests/:slug`                  | Plus attached content and circles.       |
| `POST`   | `/interests`                        | `{ interestIds: [...] }`, all-or-nothing.|
| `DELETE` | `/interests/:interestId`            |                                            |
| `GET`    | `/content/:id`                      | Plus 3 related items.                    |
| `GET`    | `/for-you`                          | `?limit=` (max 12)                       |
| `GET`    | `/discover`                         | One surprise. Records it as seen. `?exclude=` skips ids for this request only. |
| `GET`    | `/weekly`                           | Stable for the whole ISO week.           |
| `POST`   | `/weekly/:contentId/complete`       |                                            |
| `DELETE` | `/weekly/:contentId/complete`       |                                            |
| `GET`    | `/events`                           | `?interests=` `?category=` `?free=` `?weekend=` `?within=` `?city=` |
| `GET`    | `/circles`                          | `?interest=` `?city=`                    |
| `GET`    | `/people`                           | `{ yours, popular }` — counts only.      |
| `GET`    | `/saved`                            |                                            |
| `POST`   | `/saved/:contentId`                 | `201`; `409` if already saved.           |
| `DELETE` | `/saved/:contentId`                 | `404` if not saved.                      |
| `POST`   | `/circles/:circleId/join`           | `201`; `409` if already joined.          |
| `DELETE` | `/circles/:circleId/leave`          | `404` if not joined.                     |

Unknown `/api/sidequests/*` returns `404` with the endpoint list, so the API is
discoverable without a docs service.

## Deliberately not built

- **Chat, DMs, followers, social feed.** A circle is a name, a description, an
  interest, a count and a join button. Membership is stored; there is no channel
  to post in. There is no auth to attribute a message to, and a member list
  without identity would be exactly the sensitive-information leak the model
  comment warns about.
- **Real event ingestion.** The event table has a place for a source, but nothing
  scrapes or syncs. Invented demo rows only.
- **An admin dashboard.** The schema is clean and seeded from text files so a
  future admin can be added without a redesign. Building the dashboard now would
  mean building an auth system first.
- **Any AI.** `README.md` principle 06: every AI component must have a
  defensible reason to exist. Nothing here does.
