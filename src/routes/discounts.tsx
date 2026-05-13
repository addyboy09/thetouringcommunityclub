import { createFileRoute } from "@tanstack/react-router";
import { Tag, Percent } from "lucide-react";
import { RequireMember } from "@/components/RequireMember";

export const Route = createFileRoute("/discounts")({
  component: Discounts,
  head: () => ({ meta: [{ title: "Member Discounts — The Touring Community Club" }, { name: "description", content: "Exclusive discounts on caravan gear, pitches, breakdown cover and more for Touring Community members." }] }),
});

const discounts = [
  { brand: "Go Outdoors", category: "Camping Gear", off: "15%", code: "TCC15", desc: "On full-price tents, awnings, cooking and accessories in store and online." },
  { brand: "Caravan Guard Insurance", category: "Insurance", off: "10%", code: "TOURCLUB", desc: "Discount on new caravan or motorhome insurance policies." },
  { brand: "Fanatical Fish & Chips Tour", category: "Eats", off: "Free Side", code: "TCCSIDE", desc: "Free side with any main meal at participating coastal chippies." },
  { brand: "Pitchup.co.uk", category: "Bookings", off: "5%", code: "TOURING5", desc: "On any UK or European campsite booking made through Pitchup." },
  { brand: "Halfords Autocentres", category: "Servicing", off: "20%", code: "TCC20HAL", desc: "MOTs, towbar fitting and habitation service checks." },
  { brand: "Outdoor World Direct", category: "Awnings", off: "12%", code: "AWNTCC", desc: "Air awnings, pole awnings and accessories. Free UK delivery." },
  { brand: "Calor Gas Refills", category: "Fuel & Power", off: "£5 off", code: "CALORTCC", desc: "Fiver off your next bottle exchange at participating stockists." },
  { brand: "Green Flag Breakdown", category: "Breakdown", off: "25%", code: "GFTOUR25", desc: "First-year saving on caravan & motorhome breakdown cover." },
];

function Discounts() {
  return (
    <RequireMember>
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-accent">Members Only</p>
        <h1 className="mt-2 text-4xl font-bold text-foreground">Discounts & Offers</h1>
        <p className="mt-3 text-muted-foreground">Use the codes below at checkout. New offers are added every month — bookmark this page!</p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {discounts.map((d) => (
          <article key={d.brand} className="relative overflow-hidden rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-soft)" }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{d.category}</p>
                <h2 className="mt-1 text-xl font-bold text-foreground">{d.brand}</h2>
              </div>
              <div className="rounded-xl px-3 py-2 text-center text-primary-foreground" style={{ background: "var(--gradient-warm)" }}>
                <Percent className="mx-auto h-4 w-4 opacity-80" />
                <p className="text-base font-extrabold leading-none">{d.off}</p>
                <p className="text-[10px] uppercase tracking-wider opacity-90">off</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-foreground/80">{d.desc}</p>
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-2">
              <Tag className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Code:</span>
              <code className="text-sm font-bold tracking-wider text-primary">{d.code}</code>
            </div>
          </article>
        ))}
      </div>
    </section>
    </RequireMember>
  );
}
