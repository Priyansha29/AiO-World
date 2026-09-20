# Campus Hub / College Onboarding

The foundation of AiO World's "College Information Archaeology" system:

**College selection → personalized Campus Hub.**

## How it works

```
College selection (profile-store)
        ↓
Selected college (localStorage, behind an interface)
        ↓
Campus data service (API-shaped)
        ↓
Structured campus information (domain model)
        ↓
Category filter + search
        ↓
Campus UI
```

## Layer separation (data → domain → services → API → UI)

| Layer    | Location                                              | Purpose                                                        |
| -------- | ----------------------------------------------------- | -------------------------------------------------------------- |
| Domain   | `domain/campus-types.js` (frontend mirror) / `backend/src/domain/campus.ts` (canonical) | Types, enums, category metadata                               |
| Data     | `data/mock-colleges.js`, `data/mock-campus-info.js`   | **DEMO** datasets — swapped for real data later, UI unchanged  |
| Services | `services/campuses-service.js`                         | API-shaped async functions (`searchColleges`, `getCampusInformation`, …). **Swap point** for the real backend |
| Persist. | `services/profile-store.js`                            | Selected college in localStorage behind an interface — swap to an authenticated profile later |
| Hooks    | `services/use-campus-data.js`                          | Loading / error / data state — components never fetch directly |
| UI       | `components/*`, `pages/*`                              | Presentational layers                                           |

## API (backend, Express)

- `GET /api/colleges` — full demo catalogue
- `GET /api/colleges/search?q=` — search by name, abbreviation, city, state, university
- `GET /api/colleges/:id`
- `GET /api/colleges/:id/campus-information?category=&q=&status=`

Non-active items (`superseded` / `expired` / `draft`) are excluded by default.
Every response is labelled `meta.demo: true`.

The frontend consumes the **bundled mock** today. To switch to the live API,
re-point `campuses-service.js` at `/api/…` (a Vite proxy to `localhost:5000`
is already configured in `vite.config.js`) — no component changes needed.

## Temporal provenance (information archaeology)

`CampusInformation` carries `status`, `supersedesId`, `supersededById`,
`effectiveFrom`, `effectiveUntil`. The demo includes a superseded → revised
notice pair: the UI only renders `active` items and marks items that revise an
earlier notice with a "Revises earlier notice" chip.

## Routing

Hash-based (matching the existing `#anchor` convention, no new dependency):

- `#/setup` — college selection
- `#/campus` — Campus Hub (redirects to setup if no college is chosen)

## Demo data & honesty

All colleges and information items are fictional and clearly labelled as demo
data in the UI ("Demo data · … Nothing here is live."). Nothing is presented
as a verified source.

## QA helpers

- `?campus_fail=1` in the URL (e.g. `http://localhost:5173/?campus_fail=1#/campus`)
  makes the next campus-information request fail once, so the error state and
  "Try again" recovery can be exercised.