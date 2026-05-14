import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RequireMember } from "@/components/RequireMember";

export const Route = createFileRoute("/recommended")({
  component: Recommended,
  head: () => ({ meta: [{ title: "Recommended Sites — The Touring Community Club" }, { name: "description", content: "UK touring sites recommended by our caravan and motorhome community." }] }),
});

type Row = {
  slug: string; name: string; location: string; rating: number;
  tag: string; description: string; photos: string[];
};

function Recommended() {
  return (
    <RequireMember>
      <Inner />
    </RequireMember>
  );
}

function Inner() {
  const [sites, setSites] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("recommended_sites").select("slug,name,location,rating,tag,description,photos").order("sort_order").then(({ data }) => {
      setSites((data ?? []) as Row[]);
      setLoading(false);
    });
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">Member Picks</p>
        <h1 className="mt-2 text-4xl font-bold text-foreground">Recommended Sites</h1>
        <p className="mt-3 text-muted-foreground">Hand-picked campsites loved by our touring community — from coastal hideaways to mountain retreats.</p>
      </header>

      {loading ? (
        <p className="mt-10 text-muted-foreground">Loading sites…</p>
      ) : sites.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No recommended sites yet.</p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sites.map((s) => (
            <Link
              key={s.slug}
              to="/recommended/$slug"
              params={{ slug: s.slug }}
              className="group rounded-2xl border border-border bg-card overflow-hidden transition hover:border-primary/50"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                {s.photos?.[0] && <img src={s.photos[0]} alt={s.name} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />}
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
                <p className="mt-3 text-sm text-foreground/80">{s.description}</p>
                <p className="mt-4 text-sm font-semibold text-primary">View site details →</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
