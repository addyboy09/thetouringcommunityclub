
-- Site content key/value store
CREATE TABLE IF NOT EXISTS public.site_content (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site content"
  ON public.site_content FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert site content"
  ON public.site_content FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site content"
  ON public.site_content FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site content"
  ON public.site_content FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER site_content_set_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed defaults
INSERT INTO public.site_content (key, value) VALUES
  ('hero_image_url', ''),
  ('hero_eyebrow', 'Caravan · Motorhome · Tent'),
  ('hero_title', 'Tour together. Stay smarter. Save more.'),
  ('hero_subtitle', 'Join thousands of touring members discovering the UK''s best campsites, hidden gems and exclusive member discounts.'),
  ('hero_cta_text', 'Sign Up — Members Area'),
  ('stat_members', '2600+'),
  ('stat_sites', '0'),
  ('stat_approved', '0'),
  ('stat_discounts', '0'),
  ('intro_title', 'Everything for the open road'),
  ('intro_body', 'From quiet CL pitches to family-friendly holiday parks, our community shares the spots they love and the deals that make touring more affordable.'),
  ('feature_recommended_title', 'Recommended Sites'),
  ('feature_recommended_body', 'Member favourites across the UK — coast, countryside and city stops.'),
  ('feature_approved_title', 'Club Approved'),
  ('feature_approved_body', 'Sites independently visited and approved by the Touring Community team.'),
  ('feature_discounts_title', 'Member Discounts'),
  ('feature_discounts_body', 'Save on pitches, gear, breakdown cover and accessories all year.')
ON CONFLICT (key) DO NOTHING;

-- Public storage bucket for site images
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read site images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-images');

CREATE POLICY "Admins can upload site images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
