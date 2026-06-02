import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroFallback from "@/assets/hero.jpg";
import { MapPin, ShieldCheck, Tag, Users, CalendarDays, Heart, Compass, MessageCircle, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "The Touring Community Club — A friendly UK caravan & motorhome community" },
      { name: "description", content: "Join a welcoming UK community of caravan and motorhome tourers. Trusted sites, member discounts, meet ups and friendly faces — wherever the road takes you." },
    ],
  }),
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
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src={heroImg} alt="Touring caravans pitched in the British countryside" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32 text-primary-foreground">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] ring-1 ring-white/20">
            <Heart className="h-3.5 w-3.5" /> {c.hero_eyebrow || "A friendly UK touring community"}
          </span>
          <h1 className="mt-5 text-4xl sm:text-6xl font-extrabold leading-[1.05] max-w-3xl font-display">
            {c.hero_title || "Find your people on the road."}
          </h1>
          <p className="mt-5 max-w-xl text-lg opacity-95">
            {c.hero_subtitle || "Honest site reviews, member-only discounts, and warm welcomes at every meet up. Whether you're a first-timer or a full-timer — pull up, kettle's on."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/auth" search={{ mode: "signup" }} className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground hover:opacity-95 transition shadow-lg">
              {c.hero_cta_text || "Join the club — it's free"} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/meetups" className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-6 py-3 text-sm font-semibold text-primary-foreground ring-1 ring-white/30 hover:bg-white/20 transition">
              <CalendarDays className="h-4 w-4" /> See upcoming meet ups
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="mx-auto max-w-6xl px-4 -mt-10 sm:-mt-14 relative z-10">
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8" style={{ boxShadow: "var(--shadow-warm)" }}>
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Users, label: "Members", value: c.stat_members || "Growing weekly" },
              { icon: MapPin, label: "Sites Listed", value: c.stat_sites || "100+" },
              { icon: ShieldCheck, label: "Club Approved", value: c.stat_approved || "Hand-picked" },
              { icon: Tag, label: "Member Discounts", value: c.stat_discounts || "Always new" },
            ].map((s) => (
              <div key={s.label} className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground leading-tight font-display">{s.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Why we're here</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground font-display">
              {c.intro_title || "More than a club — it's a community."}
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              {c.intro_body || "We're caravanners and motorhomers who believe the best part of touring isn't the destination — it's the people you meet along the way. Swap site tips, find your next favourite pitch, and roll up to a meet up where you already feel at home."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/recommended" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2 transition-all">
                Browse recommended sites <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-muted-foreground/40">·</span>
              <Link to="/useful-links" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2 transition-all">
                Useful links for tourers <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ValueChip icon={Compass} title="Real reviews" body="Honest write-ups from members who've actually pitched up." />
            <ValueChip icon={Heart} title="Warm welcomes" body="A first-timer-friendly community — no gatekeeping." />
            <ValueChip icon={Tag} title="Exclusive savings" body="Member-only discounts on gear, pitches and days out." />
            <ValueChip icon={MessageCircle} title="Always nearby" body="Find us on Facebook, TikTok and Instagram between trips." />
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex items-end justify-between mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-display">Explore the club</h2>
          <Link to="/auth" search={{ mode: "signup" }} className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2 transition-all">
            Become a member <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            to="/recommended"
            icon={MapPin}
            title={c.feature_recommended_title || "Recommended Sites"}
            body={c.feature_recommended_body || "Member-favourite campsites across the UK, rated by people who've pitched there."}
            accent="primary"
          />
          <FeatureCard
            to="/approved"
            icon={ShieldCheck}
            title={c.feature_approved_title || "Club Approved"}
            body={c.feature_approved_body || "Sites our team has visited, reviewed and given the official thumbs-up."}
            accent="secondary"
          />
          <FeatureCard
            to="/discounts"
            icon={Tag}
            title={c.feature_discounts_title || "Member Discounts"}
            body={c.feature_discounts_body || "Exclusive savings on pitches, accessories and adventure days — members only."}
            accent="accent"
          />
          <FeatureCard
            to="/meetups"
            icon={CalendarDays}
            title="Community Meet Ups"
            body="Rallies, weekenders and casual get-togethers. All welcome — first-timers especially."
            accent="primary"
          />
          <FeatureCard
            to="/useful-links"
            icon={Compass}
            title="Useful Links"
            body="Trusted tools, planning resources and partner sites curated by the community."
            accent="secondary"
          />
          <FeatureCard
            to="/members"
            icon={Users}
            title="Members Area"
            body="Your personal hub — meet ups, discounts and the community at your fingertips."
            accent="accent"
          />
        </div>
      </section>

      {/* CTA banner */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center" style={{ background: "var(--gradient-warm)" }}>
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-foreground font-display">
              Pull up a chair. The community's waiting.
            </h2>
            <p className="mt-3 text-secondary-foreground/80 max-w-2xl mx-auto">
              Joining is free, friendly and takes about a minute. Unlock the members area, RSVP to meet ups, and grab your first discount today.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/auth" search={{ mode: "signup" }} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-95 transition shadow-lg">
                Create your free account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/auth" search={{ mode: "signin" }} className="inline-flex items-center rounded-full bg-white/40 backdrop-blur px-6 py-3 text-sm font-semibold text-secondary-foreground hover:bg-white/60 transition">
                Already a member? Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ValueChip({ icon: Icon, title, body }: { icon: typeof Heart; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-2 font-semibold text-foreground text-sm">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

function FeatureCard({
  to, icon: Icon, title, body, accent,
}: {
  to: "/recommended" | "/approved" | "/discounts" | "/meetups" | "/useful-links" | "/members";
  icon: typeof MapPin;
  title: string;
  body: string;
  accent: "primary" | "secondary" | "accent";
}) {
  const accentMap = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/30 text-secondary-foreground",
    accent: "bg-accent/15 text-accent",
  } as const;
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-border bg-card p-6 transition hover:border-primary hover:-translate-y-1 hover:shadow-lg"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentMap[accent]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-foreground group-hover:text-primary font-display">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
        Explore <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
