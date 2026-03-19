-- ============================================================
-- 001_initial_schema.sql
-- Angularverse — anonymous progress sync via device_id
-- ============================================================

-- ── user_progress ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_progress (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id        text        UNIQUE NOT NULL,
  name             text,
  level            text        NOT NULL DEFAULT 'beginner',
  xp_total         integer     NOT NULL DEFAULT 0,
  completed_lessons text[]     NOT NULL DEFAULT '{}',
  streak_count     integer     NOT NULL DEFAULT 0,
  streak_last_date text,                        -- ISO date string YYYY-MM-DD
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ── chat_history ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_history (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id  text        NOT NULL REFERENCES user_progress(device_id) ON DELETE CASCADE,
  lesson_id  text        NOT NULL,
  messages   jsonb       NOT NULL DEFAULT '[]',
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (device_id, lesson_id)
);

-- ── updated_at trigger ───────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER chat_history_updated_at
  BEFORE UPDATE ON chat_history
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history  ENABLE ROW LEVEL SECURITY;

-- Allow anon role full access (no auth yet — tighten when auth is added)
CREATE POLICY "anon_all" ON user_progress
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "anon_all" ON chat_history
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);
