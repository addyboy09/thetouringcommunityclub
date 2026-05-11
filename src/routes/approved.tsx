import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, MapPin } from "lucide-react";
import { approvedSites } from "@/lib/sites-data";

export const Route = createFileRoute("/approved")({
  component: Approved,
  head: () => ({ meta: [{ title: "Approved Sites — The Touring Community Club" }, { name: "description", content: "Campsites independently visited and approved by The Touring Community Club." }] }),
});

function Approved() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <header className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <ShieldCheck className="h-3.5 w-3.5" /> Touring Community Approved
        </div>
        <h1 className="mt-3 text-4xl font-bold text-foreground">Approved Sites</h1>
        <p className="mt-3 text-muted-foreground">Each site below has been independently visited and approved by our team for quality, value and welcome.</p>
      </header>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {approvedSites.map((s) => (
          <Link
            key={s.slug}
            to="/approved/$slug"
            params={{ slug: s.slug }}
            className="group flex gap-4 rounded-2xl border border-border bg-card overflow-hidden transition hover:border-primary/50"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <div className="w-32 sm:w-44 shrink-0 overflow-hidden bg-muted">
              <img src={s.photos[0]} alt={s.name} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
            </div>
            <div className="flex-1 py-4 pr-4">
              <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                <ShieldCheck className="h-3 w-3" /> Approved {s.year}
              </div>
              <h2 className="mt-2 text-lg font-bold text-foreground">{s.name}</h2>
              <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" /> {s.location}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-foreground/80">{s.notes}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
