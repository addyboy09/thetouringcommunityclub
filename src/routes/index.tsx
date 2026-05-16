import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroFallback from "@/assets/hero.jpg";
import { MapPin, ShieldCheck, Tag, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({ meta: [{ title: "The Touring Community Club — Caravan & Motorhome Community" }] }),
});

type Content = Record<string, string>;

function Home() {
  const [c, setC] = useState<Content>({});

  useEffect(() => {
    supabase.from("site_content").select("key,value").then(({ data }) => {
      const map: Content = {};
      (data ?? []).forEach((r: { key: string; value: string }) => { map[r.key] = r.value; });
      setC(map);
    });
  }, []);

  const heroImg = c.hero_image_url || heroFallback;

  return (
    <>
      <section className="relative overflow-hidden">
        <img src={heroImg} alt="Hero" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32 text-primary-foreground">
          <p className="text-sm uppercase tracking-[0.2em] opacity-90">{c.hero_eyebrow ?? ""}</p>
          <h1 className="mt-3 text-4xl sm:text-6xl font-extrabold leading-tight max-w-3xl">
            {c.hero_title ?? ""}
          </h1>
          <p className="mt-5 max-w-xl text-lg opacity-95">{c.hero_subtitle ?? ""}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/auth" search={{ mode: "signup" }} className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground hover:opacity-95 transition">
              {c.hero_cta_text ?? "Sign Up"}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, label: "Members", value: c.stat_members ?? "" },
            { icon: MapPin, label: "Sites Listed", value: c.stat_sites ?? "" },
            { icon: ShieldCheck, label: "Club Approved", value: c.stat_approved ?? "" },
            { icon: Tag, label: "Active Discounts", value: c.stat_discounts ?? "" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-soft)" }}>
              <s.icon className="h-6 w-6 text-primary" />
              <p className="mt-4 text-3xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="text-3xl font-bold text-foreground">{c.intro_title ?? ""}</h2>
        <p className="mt-2 text-muted-foreground max-w-2xl">{c.intro_body ?? ""}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <FeatureCard to="/recommended" title={c.feature_recommended_title ?? "Recommended Sites"} body={c.feature_recommended_body ?? ""} />
          <FeatureCard to="/approved" title={c.feature_approved_title ?? "Club Approved"} body={c.feature_approved_body ?? ""} />
          <FeatureCard to="/discounts" title={c.feature_discounts_title ?? "Member Discounts"} body={c.feature_discounts_body ?? ""} />
        </div>
      </section>
    </>
  );
}

function FeatureCard({ to, title, body }: { to: "/recommended" | "/approved" | "/discounts"; title: string; body: string }) {
  return (
    <Link to={to} className="group rounded-2xl border border-border bg-card p-6 transition hover:border-primary hover:-translate-y-1" style={{ boxShadow: "var(--shadow-soft)" }}>
      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      <span className="mt-4 inline-block text-sm font-medium text-primary">Browse →</span>
    </Link>
  );
}
