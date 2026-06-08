-- Ogłoszenia klasowe
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL,
  class_id uuid,
  title text NOT NULL,
  body text NOT NULL,
  priority text NOT NULL DEFAULT 'info',
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
  pinned boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "announcements_select_published_or_owner"
ON public.announcements FOR SELECT TO authenticated
USING (published = true OR created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "announcements_insert_teacher_admin"
ON public.announcements FOR INSERT TO authenticated
WITH CHECK ((public.has_role(auth.uid(), 'teacher'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role)) AND created_by = auth.uid());

CREATE POLICY "announcements_update_owner_admin"
ON public.announcements FOR UPDATE TO authenticated
USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "announcements_delete_owner_admin"
ON public.announcements FOR DELETE TO authenticated
USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_announcements_updated_at
BEFORE UPDATE ON public.announcements
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_announcements_class ON public.announcements(class_id);
CREATE INDEX idx_announcements_created_at ON public.announcements(created_at DESC);

-- Wiadomości bezpośrednie
CREATE TABLE public.direct_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  recipient_id uuid NOT NULL,
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.direct_messages TO authenticated;
GRANT ALL ON public.direct_messages TO service_role;

ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dm_select_participants"
ON public.direct_messages FOR SELECT TO authenticated
USING (sender_id = auth.uid() OR recipient_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "dm_insert_sender"
ON public.direct_messages FOR INSERT TO authenticated
WITH CHECK (sender_id = auth.uid());

CREATE POLICY "dm_update_recipient_read"
ON public.direct_messages FOR UPDATE TO authenticated
USING (recipient_id = auth.uid());

CREATE INDEX idx_dm_recipient ON public.direct_messages(recipient_id, created_at DESC);
CREATE INDEX idx_dm_sender ON public.direct_messages(sender_id, created_at DESC);

-- Historia eksportów ocen do e-dziennika
CREATE TABLE public.grade_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL,
  exam_id uuid,
  class_id uuid,
  format text NOT NULL DEFAULT 'vulcan_csv',
  name text NOT NULL,
  row_count integer NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON public.grade_exports TO authenticated;
GRANT ALL ON public.grade_exports TO service_role;

ALTER TABLE public.grade_exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ge_owner_all"
ON public.grade_exports FOR ALL TO authenticated
USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_grade_exports_owner ON public.grade_exports(created_by, created_at DESC);