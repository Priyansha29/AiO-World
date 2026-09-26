-- =============================================================================
-- 001_sidequests.sql
--
-- The Sidequests schema, as PostgreSQL DDL.
--
-- WHY THIS FILE EXISTS BUT IS NOT APPLIED
-- ---------------------------------------
-- AiO World has no database layer today. `backend/src` is five files of
-- Express + TypeScript reading from curated seed modules, and the active
-- repository implementation (`modules/sidequests/repository/
-- sidequests-repository.ts`) serves those seeds while keeping each user's own
-- rows in process. Nothing runs this file.
--
-- It is here so the schema is decided rather than deferred, and so adding a
-- database later is a migration instead of a redesign. The column names, types
-- and constraints are the ones `modules/sidequests/types/sidequests.ts`
-- declares — that TypeScript file stays the canonical contract, and this is its
-- relational projection.
--
-- To adopt a real database:
--   1. Provision PostgreSQL and set DATABASE_URL in backend/.env
--   2. Apply this file (psql -f, or your migration runner)
--   3. Implement `SidequestsRepository` against these tables — the interface
--      is the whole contract, and no service or controller code changes
--   4. Point `createSidequestsRepository()` at the new implementation
--
-- PREREQUISITE: this file cannot run on a truly empty database. It references
-- `college (id)` in two foreign keys, because college-scoped events and circles
-- are the point. The Campus module owns that table and has no migration yet
-- either — its catalogue is currently `backend/src/data/mock-campus.ts`. So
-- before applying this, either:
--   (a) apply the Campus module's own migration first (the one that creates
--       `college`), or
--   (b) for a first database, create the table this module needs:
--         CREATE TABLE college (
--           id         TEXT PRIMARY KEY,
--           name       TEXT NOT NULL,
--           city       TEXT NOT NULL,
--           state      TEXT,
--           university TEXT
--         );
-- Option (b) is the smaller first step and is what the Sidequests repository
-- actually touches. Option (a) is the right end state.
--
-- Design notes that the types do not make obvious:
--   * `user_id` is TEXT, not a users table FK. There is no authentication in
--     AiO World yet, so the browser mints an opaque id and sends it as
--     `x-aioworld-user`. When real auth lands, this becomes a FK to that
--     system's user table and the column type is the only thing that changes.
--   * `circle.member_count` is denormalised on purpose. It is a read-mostly
--     counter, and a COUNT over memberships on a page that renders a dozen
--     circles would be a pointless query. Recompute it from memberships rather
--     than trusting it forever.
--   * Every table carries `is_active` so a future admin can retire a row
--     without deleting it — content and events that disappear silently are
--     indistinguishable from a bug.
--   * Partial indexes assume the service's soft-delete-by-flag convention. The
--     repository filters `is_active = true` on every catalogue read.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- Interest — the atom everything else points at.
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS sidequest_interest (
  id          TEXT PRIMARY KEY,
  name        TEXT        NOT NULL,
  slug        TEXT        NOT NULL UNIQUE,
  description TEXT        NOT NULL,
  -- Names a glyph in the frontend icon set, not an asset. Kept as a key so the
  -- catalogue stays seedable from a text file.
  icon        TEXT        NOT NULL,
  category    TEXT        NOT NULL
              CHECK (category IN ('move', 'create', 'explore', 'unwind', 'discover')),
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- The interest selector filters by shelf, then by name.
CREATE INDEX IF NOT EXISTS idx_interest_category_active
  ON sidequest_interest (category, is_active);

-- -----------------------------------------------------------------------------
-- Content — the curated library.
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS sidequest_content (
  id            TEXT PRIMARY KEY,
  title         TEXT        NOT NULL,
  slug          TEXT        NOT NULL UNIQUE,
  description   TEXT        NOT NULL,
  type          TEXT        NOT NULL
                CHECK (type IN ('article', 'guide', 'workout', 'recipe', 'book',
                                'podcast', 'video', 'challenge', 'fact', 'resource',
                                'event_reference')),
  -- Denormalised from the interest so the shelf can group by shelf without a
  -- join, and so an interest can be re-categorised without rewriting content.
  category      TEXT        NOT NULL
                CHECK (category IN ('move', 'create', 'explore', 'unwind', 'discover')),
  interest_id   TEXT        NOT NULL REFERENCES sidequest_interest (id) ON DELETE RESTRICT,
  -- Nullable throughout, by design: a recipe has ingredients, a workout has
  -- steps, a fact has neither, and forcing every column to be present is how
  -- content tables fill with '' and 'N/A'.
  image_url     TEXT,
  source_name   TEXT,
  source_url    TEXT,
  duration      TEXT,
  difficulty    TEXT        CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'any')),
  tags          TEXT[]      NOT NULL DEFAULT '{}',
  steps         TEXT[]      DEFAULT NULL,
  ingredients   TEXT[]      DEFAULT NULL,
  pitch         TEXT,
  published_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_featured   BOOLEAN     NOT NULL DEFAULT FALSE,
  is_active     BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- "Picked for you" ranks by interest then recency within that interest.
CREATE INDEX IF NOT EXISTS idx_content_interest_active
  ON sidequest_content (interest_id, is_active, published_at DESC);

-- The weekly pick and the discovery featured-preference both filter on this.
CREATE INDEX IF NOT EXISTS idx_content_featured_active
  ON sidequest_content (is_featured, is_active)
  WHERE is_featured AND is_active;

-- Tag overlap contributes to ranking, so it needs to be indexable.
CREATE INDEX IF NOT EXISTS idx_content_tags ON sidequest_content USING GIN (tags);

-- -----------------------------------------------------------------------------
-- Events — local discovery. DEMO DATA until a real source exists.
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS sidequest_event (
  id               TEXT PRIMARY KEY,
  title            TEXT        NOT NULL,
  description      TEXT        NOT NULL,
  category         TEXT        NOT NULL
                   CHECK (category IN ('move', 'create', 'explore', 'unwind', 'discover')),
  start_time       TIMESTAMPTZ NOT NULL,
  end_time         TIMESTAMPTZ NOT NULL,
  venue            TEXT        NOT NULL,
  city             TEXT        NOT NULL,
  -- Nullable on purpose: not everything worth doing happens on a campus, and a
  -- NOT NULL column would quietly force city-wide events into a fake college.
  -- See the PREREQUISITE note above — `college` must exist before this applies.
  college_id       TEXT        REFERENCES college (id) ON DELETE SET NULL,
  organizer        TEXT        NOT NULL,
  registration_url TEXT,
  image_url        TEXT,
  is_free          BOOLEAN     NOT NULL DEFAULT FALSE,
  is_active        BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT event_time_order CHECK (end_time >= start_time)
);

-- Every event read sorts by start time within a horizon.
CREATE INDEX IF NOT EXISTS idx_event_start_active
  ON sidequest_event (start_time)
  WHERE is_active;

-- "Near me" and "my campus" filtering.
CREATE INDEX IF NOT EXISTS idx_event_college_start
  ON sidequest_event (college_id, start_time)
  WHERE is_active;

CREATE INDEX IF NOT EXISTS idx_event_city_start
  ON sidequest_event (city, start_time)
  WHERE is_active;

-- An event can belong to several interests, so this is a real join table
-- rather than a column on the event.
CREATE TABLE IF NOT EXISTS sidequest_event_interest (
  event_id   TEXT NOT NULL REFERENCES sidequest_event (id)   ON DELETE CASCADE,
  interest_id TEXT NOT NULL REFERENCES sidequest_interest (id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, interest_id)
);

CREATE INDEX IF NOT EXISTS idx_event_interest_interest
  ON sidequest_event_interest (interest_id, event_id);

-- -----------------------------------------------------------------------------
-- Interest circles — the future social primitive, stubbed.
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS sidequest_circle (
  id           TEXT PRIMARY KEY,
  name         TEXT        NOT NULL,
  slug         TEXT        NOT NULL UNIQUE,
  description  TEXT        NOT NULL,
  interest_id  TEXT        NOT NULL REFERENCES sidequest_interest (id) ON DELETE RESTRICT,
  -- Null means city-wide rather than campus-bound.
  college_id   TEXT        REFERENCES college (id) ON DELETE SET NULL,
  city         TEXT,
  -- Denormalised counter; recompute from memberships rather than trusting it.
  member_count INTEGER     NOT NULL DEFAULT 0 CHECK (member_count >= 0),
  is_active    BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_circle_college_active
  ON sidequest_circle (college_id, is_active);

CREATE TABLE IF NOT EXISTS sidequest_circle_membership (
  user_id    TEXT        NOT NULL,
  circle_id  TEXT        NOT NULL REFERENCES sidequest_circle (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- One membership per user per circle; the repository's "already joined" check
  -- is enforced here rather than in application code.
  PRIMARY KEY (user_id, circle_id)
);

CREATE INDEX IF NOT EXISTS idx_circle_membership_circle
  ON sidequest_circle_membership (circle_id);

-- -----------------------------------------------------------------------------
-- Per-user rows.
--
-- Deliberately no name, email, avatar or location beyond the college already
-- chosen in Campus. These three tables are everything "the student" means to
-- Sidequests today.
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS sidequest_user_interest (
  user_id    TEXT        NOT NULL,
  interest_id TEXT       NOT NULL REFERENCES sidequest_interest (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, interest_id)
);

-- Ranking reads every interest a user has picked.
CREATE INDEX IF NOT EXISTS idx_user_interest_user
  ON sidequest_user_interest (user_id);

CREATE TABLE IF NOT EXISTS sidequest_saved (
  user_id    TEXT        NOT NULL,
  content_id TEXT        NOT NULL REFERENCES sidequest_content (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, content_id)
);

-- "Save for later" lists newest first.
CREATE INDEX IF NOT EXISTS idx_saved_user_created
  ON sidequest_saved (user_id, created_at DESC);

COMMIT;

-- =============================================================================
-- Rollback
--
-- Ordered leaf-first so foreign keys never block a drop. Only for a fresh
-- database where nothing has been migrated in; in any real environment use a
-- proper down-migration rather than dropping tables that hold user rows.
-- =============================================================================
-- BEGIN;
-- DROP TABLE IF EXISTS sidequest_saved;
-- DROP TABLE IF EXISTS sidequest_user_interest;
-- DROP TABLE IF EXISTS sidequest_circle_membership;
-- DROP TABLE IF EXISTS sidequest_circle;
-- DROP TABLE IF EXISTS sidequest_event_interest;
-- DROP TABLE IF EXISTS sidequest_event;
-- DROP TABLE IF EXISTS sidequest_content;
-- DROP TABLE IF EXISTS sidequest_interest;
-- COMMIT;
