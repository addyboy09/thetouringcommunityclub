-- 1. Recommended sites
CREATE TABLE public.recommended_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  location text NOT NULL DEFAULT '',
  rating numeric(2,1) NOT NULL DEFAULT 0,
  tag text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  amenities text[] NOT NULL DEFAULT '{}',
  photos text[] NOT NULL DEFAULT '{}',
  review_author text NOT NULL DEFAULT '',
  review_text text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.recommended_sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view recommended sites" ON public.recommended_sites
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert recommended sites" ON public.recommended_sites
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update recommended sites" ON public.recommended_sites
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete recommended sites" ON public.recommended_sites
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER recommended_sites_set_updated_at
  BEFORE UPDATE ON public.recommended_sites
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. Approved sites
CREATE TABLE public.approved_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  location text NOT NULL DEFAULT '',
  year integer NOT NULL DEFAULT EXTRACT(year FROM now())::int,
  notes text NOT NULL DEFAULT '',
  amenities text[] NOT NULL DEFAULT '{}',
  photos text[] NOT NULL DEFAULT '{}',
  review_author text NOT NULL DEFAULT '',
  review_text text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.approved_sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view approved sites" ON public.approved_sites
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert approved sites" ON public.approved_sites
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update approved sites" ON public.approved_sites
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete approved sites" ON public.approved_sites
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER approved_sites_set_updated_at
  BEFORE UPDATE ON public.approved_sites
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Discounts
CREATE TABLE public.discounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  category text NOT NULL DEFAULT '',
  off text NOT NULL DEFAULT '',
  code text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view discounts" ON public.discounts
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert discounts" ON public.discounts
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update discounts" ON public.discounts
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete discounts" ON public.discounts
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER discounts_set_updated_at
  BEFORE UPDATE ON public.discounts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. Fix the new-signup trigger so future users default to 'user'
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (new.id, 'user');
  RETURN new;
END;
$$;

-- 5. Make adam.jaye3@outlook.com the sole admin
DELETE FROM public.user_roles WHERE role = 'admin';
INSERT INTO public.user_roles (user_id, role)
VALUES ('1e2db1c0-7100-49dc-b263-a5d5bed0507b', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
DELETE FROM public.user_roles
WHERE user_id = '1e2db1c0-7100-49dc-b263-a5d5bed0507b' AND role = 'user';