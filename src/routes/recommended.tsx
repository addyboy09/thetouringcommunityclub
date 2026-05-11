import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Star } from "lucide-react";

export const Route = createFileRoute("/recommended")({
  component: Recommended,
  head: () => ({ meta: [{ title: "Recommended Sites — The Touring Community Club" }, { name: "description", content: "UK touring sites recommended by our caravan and motorhome community." }] }),
});

const sites = [
  { name: "Glenmore Campsite", location: "Cairngorms, Scotland", rating: 4.9, tag: "Lochside", desc: "Pitch beside Loch Morlich with the Cairngorms as your backdrop. Perfect for hikers and paddlers." },
  { name: "Wooda Farm Holiday Park", location: "Bude, Cornwall", rating: 4.8, tag: "Family", desc: "Family-run park minutes from Bude's beaches. Excellent facilities and friendly farm animals." },
  { name: "Castlerigg Hall", location: "Keswick, Lake District", rating: 4.9, tag: "Views", desc: "Panoramic views over Derwentwater. A favourite Lake District base for our members." },
  { name: "Beadnell Bay C&MC Site", location: "Northumberland Coast", rating: 4.7, tag: "Coastal", desc: "Sand-dune pitches steps from a Blue Flag beach on the stunning Northumberland coast." },
  { name: "Tan-y-Bryn Farm", location: "Snowdonia, Wales", rating: 4.6, tag: "Quiet CL", desc: "Tranquil 5-pitch CL with mountain views — a true off-grid escape." },
  { name: "Tom's Field", location: "Swanage, Dorset", rating: 4.7, tag: "Jurassic Coast", desc: "Walk to Dancing Ledge from this much-loved Purbeck campsite." },
];

function Recommended() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">Member Picks</p>
        <h1 className="mt-2 text-4xl font-bold text-foreground">Recommended Sites</h1>
        <p className="mt-3 text-muted-foreground">Hand-picked campsites loved by our touring community — from coastal hideaways to mountain retreats.</p>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sites.map((s) => (
          <article key={s.name} className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary/50" style={{ boxShadow: "var(--shadow-soft)" }}>
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
          </article>
        ))}
      </div>
    </section>
  );
}
