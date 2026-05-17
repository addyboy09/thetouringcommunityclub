CREATE TABLE public.useful_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.useful_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view useful links" ON public.useful_links FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert useful links" ON public.useful_links FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update useful links" ON public.useful_links FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete useful links" ON public.useful_links FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER set_useful_links_updated_at BEFORE UPDATE ON public.useful_links FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();