import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, MapPin, Users, CheckCircle2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RequireMember } from "@/components/RequireMember";

export const Route = createFileRoute("/meetups")({
  component: Meetups,
  head: () => ({
    meta: [
      { title: "Community Meet Ups — The Touring Community Club" },
      {
        name: "description",
        content:
          "Upcoming caravan and motorhome meet ups across the UK organised by The Touring Community Club.",
      },
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

type Rsvp = {
  meetup_id: string;
};

type User = {
  id: string;
  email: string;
};

function Meetups() {
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<User | null>(null);
  const [myRsvps, setMyRsvps] = useState<Rsvp[]>([]);
  const [rsvpLoadingIds, setRsvpLoadingIds] = useState<string[]>([]);

  // Load meetups
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

  // Load current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email ?? "",
        });
      }
    });
  }, []);

  // Load RSVPs for current user
  useEffect(() => {
    if (!user) return;

    supabase
      .from("rsvps")
      .select("meetup_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setMyRsvps((data as Rsvp[]) ?? []);
      });
  }, [user]);

  const isAttending = useCallback(
    (meetupId: string) => myRsvps.some((r) => r.meetup_id === meetupId),
    [myRsvps]
  );

  const handleRsvp = useCallback(
    async (meetup: Meetup) => {
      if (!user) {
        alert("You need to be logged in to RSVP.");
        return;
      }

      if (isAttending(meetup.id)) {
        return;
      }

      setRsvpLoadingIds((prev) => [...prev, meetup.id]);

      const { error } = await supabase.from("rsvps").insert({
        meetup_id: meetup.id,
        user_id: user.id,
      });

      if (!error) {
        setMyRsvps((prev) => [...prev, { meetup_id: meetup.id }]);

        // Fire-and-forget email confirmation
        try {
          await fetch("/api/send-rsvp-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              meetup,
            }),
          });
        } catch {
          // Silent fail – RSVP still stored
        }
      } else {
        console.error(error);
        alert("Something went wrong saving your RSVP. Please try again.");
      }

      setRsvpLoadingIds((prev) => prev.filter((id) => id !== meetup.id));
    },
    [user, isAttending]
  );

  return (
    <RequireMember>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <header className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-accent">
            Get together
          </p>
          <h1 className="mt-2 text-4xl font-bold text-foreground">
            Community Meet Ups
          </h1>
          <p className="mt-3 text-muted-foreground">
            Pitch up alongside fellow members at our organised rallies and
            weekenders. All abilities, all ages, all welcome — first-timers
            especially.
          </p>
        </header>

        {loading ? (
          <p className="mt-10 text-muted-foreground">Loading meet ups…</p>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {meetups.map((m) => {
              const attending = isAttending(m.id);
              const rsvpBusy = rsvpLoadingIds.includes(m.id);

              return (
                <article
                  key={m.id}
                  className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary"
                  style={{ boxShadow: "var(--shadow-soft)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">
                        {m.title}
                      </h2>
                      {attending && (
                        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-600/10 px-3 py-1 text-xs font-medium text-green-700">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>You’re attending</span>
                        </div>
                      )}
                    </div>

                    {m.tag && (
                      <span className="shrink-0 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                        {m.tag}
                      </span>
                    )}
                  </div>

                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary" />{" "}
                      {m.date_text}
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

                  {m.description && (
                    <p className="mt-4 text-sm text-foreground/80">
                      {m.description}
                    </p>
                  )}

                  <button
                    onClick={() => handleRsvp(m)}
                    disabled={attending || rsvpBusy}
                    className={`mt-5 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition ${
                      attending
                        ? "bg-muted text-muted-foreground cursor-default"
                        : "bg-primary text-white hover:opacity-90"
                    } ${rsvpBusy ? "opacity-70 cursor-wait" : ""}`}
                  >
                    {attending
                      ? "You’re attending"
                      : rsvpBusy
                      ? "Saving RSVP…"
                      : "RSVP"}
                  </button>
                </article>
              );
            })}
          </div>
        )}

        <div
          className="mt-12 rounded-2xl border border-border bg-card p-6 sm:p-8 text-center"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <h3 className="text-2xl font-bold text-foreground">
            Want to host a meet?
          </h3>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            Members can propose their own rallies — whether it's three vans on a
            CL or a 40-pitch holiday park takeover. Drop us a message on
            Facebook to get it added.
          </p>
        </div>
      </section>
    </RequireMember>
  );
}

export default Meetups;
