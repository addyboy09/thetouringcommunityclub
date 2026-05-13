import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Star } from "lucide-react";
import { recommendedSites } from "@/lib/sites-data";
import { RequireMember } from "@/components/RequireMember";

export const Route = createFileRoute("/recommended")({
  component: Recommended,
  head: () => ({ meta: [{ title: "Recommended Sites — The Touring Community Club" }, { name: "description", content: "UK touring sites recommended by our caravan and motorhome community." }] }),
});

function Recommended() {
  return (
    <RequireMember>
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">Member Picks</p>
        <h1 className="mt-2 text-4xl font-bold text-foreground">Recommended Sites</h1>
        <p className="mt-3 text-muted-foreground">Hand-picked campsites loved by our touring community — from coastal hideaways to mountain retreats.</p>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recommendedSites.map((s) => (
          <Link
            key={s.slug}
            to="/recommended/$slug"
            params={{ slug: s.slug }}
            className="group rounded-2xl border border-border bg-card overflow-hidden transition hover:border-primary/50"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <div className="aspect-[16/10] overflow-hidden bg-muted">
              <img src={s.photos[0]} alt={s.name} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex items-center rounded-full bg-secondary/40 px-3 py-1 text-xs font-semibold text-foreground">{s.tag}</span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                  <Star className="h-4 w-4 fill-secondary text-secondary" /> {s.rating}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-bold text-foreground">{s.name}</h2>
              <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" /> {s.location}
              </p>
              <p className="mt-3 text-sm text-foreground/80">{s.desc}</p>
              <p className="mt-4 text-sm font-semibold text-primary">View site details →</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
    </RequireMember>
  );
}
