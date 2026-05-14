DROP POLICY IF EXISTS "Anyone can view meetups" ON public.meetups;

CREATE POLICY "Members can view meetups"
  ON public.meetups
  FOR SELECT
  TO authenticated
  USING (true);