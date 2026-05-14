import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Tag, Percent } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RequireMember } from "@/components/RequireMember";

export const Route = createFileRoute("/discounts")({
  component: Discounts,
  head: () => ({ meta: [{ title: "Member Discounts — The Touring Community Club" }, { name: "description", content: "Exclusive discounts on caravan gear, pitches, breakdown cover and more for Touring Community members." }] }),
});

type Row = { id: string; brand: string; category: string; off: string; code: string; description: string };

function Discounts() {
  return <RequireMember><Inner /></RequireMember>;
}

function Inner() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("discounts").select("id,brand,category,off,code,description").order("sort_order").then(({ data }) => {
      setRows((data ?? []) as Row[]);
      setLoading(false);
    });
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-accent">Members Only</p>
        <h1 className="mt-2 text-4xl font-bold text-foreground">Discounts & Offers</h1>
        <p className="mt-3 text-muted-foreground">Use the codes below at checkout. New offers are added every month — bookmark this page!</p>
      </header>

      {loading ? (
        <p className="mt-10 text-muted-foreground">Loading offers…</p>
      ) : rows.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No discounts yet — check back soon.</p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {rows.map((d) => (
            <article key={d.id} className="relative overflow-hidden rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-soft)" }}>
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
              <p className="mt-3 text-sm text-foreground/80">{d.description}</p>
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-2">
                <Tag className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Code:</span>
                <code className="text-sm font-bold tracking-wider text-primary">{d.code}</code>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
