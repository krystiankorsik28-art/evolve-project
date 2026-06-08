ALTER TABLE public.live_sessions
  ADD COLUMN IF NOT EXISTS time_per_question integer DEFAULT 20,
  ADD COLUMN IF NOT EXISTS time_bonus boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS shuffle_questions boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS question_started_at timestamptz;