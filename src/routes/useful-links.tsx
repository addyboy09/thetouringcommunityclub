import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RequireMember } from "@/components/RequireMember";

export const Route = createFileRoute("/useful-links")({
  component: UsefulLinks,
  head: () => ({
    meta: [
      { title: "Useful Links — The Touring Community Club" },
      { name: "description", content: "A curated set of useful links for Touring Community Club members." },
    ],
  }),
});

type Row = { id: string; title: string; url: string; description: string; category: string };

function UsefulLinks() {
  return <RequireMember><Inner /></RequireMember>;
}

function Inner() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("useful_links")
      .select("id,title,url,description,category")
      .order("sort_order")
      .then(({ data }) => {
        setRows((data ?? []) as Row[]);
        setLoading(false);
      });
  }, []);

  const grouped = rows.reduce<Record<string, Row[]>>((acc, r) => {
    const k = r.category || "Other";
    (acc[k] ??= []).push(r);
    return acc;
  }, {});

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-accent">Members Only</p>
        <h1 className="mt-2 text-4xl font-bold text-foreground">Useful Links</h1>
        <p className="mt-3 text-muted-foreground">Handy resources, tools and websites for your touring adventures.</p>
      </header>

      {loading ? (
        <p className="mt-10 text-muted-foreground">Loading links…</p>
      ) : rows.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No links yet — check back soon.</p>
      ) : (
        <div className="mt-10 space-y-10">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{category}</h2>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {items.map((l) => (
                  <a
                    key={l.id}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/50 transition-colors"
                    style={{ boxShadow: "var(--shadow-soft)" }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-foreground group-hover:text-primary">{l.title}</h3>
                      <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    </div>
                    {l.description && <p className="mt-1.5 text-sm text-muted-foreground">{l.description}</p>}
                    <p className="mt-2 text-xs text-muted-foreground truncate">{l.url}</p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
