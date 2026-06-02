CREATE TABLE IF NOT EXISTS public.rsvps (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meetup_id uuid NOT NULL REFERENCES public.meetups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (meetup_id, user_id)
);

GRANT SELECT, INSERT, DELETE ON public.rsvps TO authenticated;
GRANT ALL ON public.rsvps TO service_role;

ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rsvps"
ON public.rsvps FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all rsvps"
ON public.rsvps FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own rsvps"
ON public.rsvps FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel their own rsvps"
ON public.rsvps FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete rsvps"
ON public.rsvps FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_rsvps_meetup ON public.rsvps(meetup_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_user ON public.rsvps(user_id);