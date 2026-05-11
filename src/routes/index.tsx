import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { MapPin, ShieldCheck, Tag, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({ meta: [{ title: "The Touring Community Club — Caravan & Motorhome Community" }] }),
});

function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <img src={hero} alt="Caravan parked in a Scottish glen at sunset" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32 text-primary-foreground">
          <p className="text-sm uppercase tracking-[0.2em] opacity-90">Caravan · Motorhome · Tent</p>
          <h1 className="mt-3 text-4xl sm:text-6xl font-extrabold leading-tight max-w-3xl">
            Tour together. Stay smarter. Save more.
          </h1>
          <p className="mt-5 max-w-xl text-lg opacity-95">
            Join thousands of touring members discovering the UK's best campsites, hidden gems and exclusive member discounts.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/recommended" className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground hover:opacity-95 transition">
              Explore Recommended Sites
            </Link>
            <Link to="/discounts" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold hover:bg-white/10 transition">
              View Member Discounts
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, label: "Members", value: "2600+" },
            { icon: MapPin, label: "Sites Listed", value: "0" },
            { icon: ShieldCheck, label: "Club Approved", value: "0" },
            { icon: Tag, label: "Active Discounts", value: "0" },
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
        <h2 className="text-3xl font-bold text-foreground">Everything for the open road</h2>
        <p className="mt-2 text-muted-foreground max-w-2xl">From quiet CL pitches to family-friendly holiday parks, our community shares the spots they love and the deals that make touring more affordable.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <FeatureCard to="/recommended" title="Recommended Sites" body="Member favourites across the UK — coast, countryside and city stops." />
          <FeatureCard to="/approved" title="Club Approved" body="Sites independently visited and approved by the Touring Community team." />
          <FeatureCard to="/discounts" title="Member Discounts" body="Save on pitches, gear, breakdown cover and accessories all year." />
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
