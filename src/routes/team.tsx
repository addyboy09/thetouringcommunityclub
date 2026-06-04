import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RequireMember } from "@/components/RequireMember";

export const Route = createFileRoute("/team")({
  component: TeamPage,
  head: () => ({
    meta: [
      { title: "Meet the Team — The Touring Community Club" },
      { name: "description", content: "Meet the people behind The Touring Community Club." },
    ],
  }),
});

type Member = { id: string; name: string; role: string; bio: string; photo_url: string };

function TeamPage() {
  return <RequireMember><Inner /></RequireMember>;
}

function Inner() {
  const [rows, setRows] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("team_members")
      .select("id,name,role,bio,photo_url")
      .order("sort_order")
      .then(({ data }) => {
        setRows((data ?? []) as Member[]);
        setLoading(false);
      });
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-accent">Members Only</p>
        <h1 className="mt-2 text-4xl font-bold text-foreground">Meet the Team</h1>
        <p className="mt-3 text-muted-foreground">The friendly faces behind the Touring Community Club.</p>
      </header>

      {loading ? (
        <p className="mt-10 text-muted-foreground">Loading team…</p>
      ) : rows.length === 0 ? (
        <p className="mt-10 text-muted-foreground">Team profiles coming soon.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((m) => (
            <article
              key={m.id}
              className="rounded-2xl border border-border bg-card p-6 text-center"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="mx-auto h-24 w-24 rounded-full overflow-hidden bg-muted border border-border flex items-center justify-center">
                {m.photo_url ? (
                  <img src={m.photo_url} alt={m.name} className="h-full w-full object-cover" />
                ) : (
                  <Users className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">{m.name}</h3>
              {m.role && <p className="text-sm font-medium text-primary">{m.role}</p>}
              {m.bio && <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{m.bio}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
