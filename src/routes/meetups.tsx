import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RequireMember } from "@/components/RequireMember";

export const Route = createFileRoute("/meetups")({
  component: Meetups,
  head: () => ({
    meta: [
      { title: "Community Meet Ups — The Touring Community Club" },
      { name: "description", content: "Upcoming caravan and motorhome meet ups across the UK organised by The Touring Community Club." },
    ],
  }),
});

type Meetup = {
  id: string;
  title: string;
  date_text: string;
  location: string;
  spaces: string;
  description: string;
  tag: string;
};

function Meetups() {
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("meetups")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        setMeetups(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <RequireMember>
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-accent">Get together</p>
        <h1 className="mt-2 text-4xl font-bold text-foreground">Community Meet Ups</h1>
        <p className="mt-3 text-muted-foreground">
          Pitch up alongside fellow members at our organised rallies and weekenders. All abilities, all ages, all welcome — first-timers especially.
        </p>
      </header>

      {loading ? (
        <p className="mt-10 text-muted-foreground">Loading meet ups…</p>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {meetups.map((m) => (
            <article
              key={m.id}
              className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-semibold text-foreground">{m.title}</h2>
                {m.tag && (
                  <span className="shrink-0 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                    {m.tag}
                  </span>
                )}
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" /> {m.date_text}
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> {m.location}
                </li>
                {m.spaces && (
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" /> {m.spaces}
                  </li>
                )}
              </ul>
              {m.description && <p className="mt-4 text-sm text-foreground/80">{m.description}</p>}
            </article>
          ))}
        </div>
      )}

      <div
        className="mt-12 rounded-2xl border border-border bg-card p-6 sm:p-8 text-center"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <h3 className="text-2xl font-bold text-foreground">Want to host a meet?</h3>
        <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
          Members can propose their own rallies — whether it's three vans on a CL or a 40-pitch holiday park takeover. Drop us a message on Facebook to get it added.
        </p>
      </div>
    </section>
    </RequireMember>
  );
}
