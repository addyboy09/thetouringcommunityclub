import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, MapPin } from "lucide-react";

export const Route = createFileRoute("/approved")({
  component: Approved,
  head: () => ({ meta: [{ title: "Approved Sites — The Touring Community Club" }, { name: "description", content: "Campsites independently visited and approved by The Touring Community Club." }] }),
});

const approved = [
  { name: "Riverside Touring Park", location: "Wye Valley, Herefordshire", year: 2024, notes: "Spotless facilities, hardstanding pitches, dog friendly." },
  { name: "Highland Meadows", location: "Inverness-shire, Scotland", year: 2025, notes: "Adult-only, full service pitches and stunning glen views." },
  { name: "Coastal View Caravan Park", location: "Pembrokeshire, Wales", year: 2024, notes: "Family park with direct beach access and heated facilities." },
  { name: "Pine Lakes Retreat", location: "New Forest, Hampshire", year: 2025, notes: "Wooded pitches, quiet location, on-site farm shop." },
  { name: "Moorland Edge Campsite", location: "Yorkshire Dales", year: 2023, notes: "Walker-friendly with excellent drying room and pub next door." },
  { name: "Harbour Lights Touring", location: "Devon, South Coast", year: 2025, notes: "Walk into a working harbour town. Great fish & chips!" },
];

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

      <div className="mt-10 grid gap-4">
        {approved.map((s) => (
          <article key={s.name} className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-soft)" }}>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="text-lg font-bold text-foreground">{s.name}</h2>
                <span className="text-xs font-medium text-muted-foreground">Approved {s.year}</span>
              </div>
              <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" /> {s.location}
              </p>
              <p className="mt-1 text-sm text-foreground/80">{s.notes}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
