import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, MapPin, Users } from "lucide-react";

export const Route = createFileRoute("/meetups")({
  component: Meetups,
  head: () => ({
    meta: [
      { title: "Community Meet Ups — The Touring Community Club" },
      { name: "description", content: "Upcoming caravan and motorhome meet ups across the UK organised by The Touring Community Club." },
    ],
  }),
});

const meetups = [
  {
    title: "Spring Coastal Rally",
    date: "Fri 17 – Sun 19 April 2026",
    location: "Sandy Bay Holiday Park, Northumberland",
    spaces: "32 pitches booked · 8 left",
    desc: "Kick off the season with our biggest coastal meet — group BBQ Saturday night, dog walks along the dunes and a kids' treasure hunt.",
    tag: "Family Friendly",
  },
  {
    title: "Lake District Long Weekend",
    date: "Thu 14 – Mon 18 May 2026",
    location: "Skelwith Fold, Ambleside",
    spaces: "24 pitches booked · 12 left",
    desc: "Guided fell walks, a pub quiz at The Drunken Duck and an optional steam railway day trip.",
    tag: "Walking",
  },
  {
    title: "Summer Solstice Gathering",
    date: "Fri 19 – Sun 21 June 2026",
    location: "Tom's Field, Dorset",
    spaces: "40 pitches booked · waitlist",
    desc: "Our flagship summer meet. Live acoustic music, communal fire pit and a Sunday morning bring-a-dish brunch.",
    tag: "Music & Social",
  },
  {
    title: "Highland Adventure Week",
    date: "Sat 1 – Sat 8 August 2026",
    location: "Glen Nevis Caravan Park, Fort William",
    spaces: "18 pitches booked · 14 left",
    desc: "A full week exploring the Highlands together — Ben Nevis day, Glenfinnan viaduct trip and Loch Ness convoy.",
    tag: "Adventure",
  },
  {
    title: "Autumn Steam & Ales",
    date: "Fri 9 – Sun 11 October 2026",
    location: "Black Horse Farm CL, Kent",
    spaces: "16 pitches booked · 4 left",
    desc: "Heritage railway ride, a guided real-ale walk and a hog roast on Saturday evening.",
    tag: "Food & Drink",
  },
  {
    title: "Winter Wonderland Meet",
    date: "Fri 4 – Sun 6 December 2026",
    location: "Lincoln Farm Park, Oxfordshire",
    spaces: "20 pitches booked · 10 left",
    desc: "Christmas markets coach trip, mulled wine welcome and a Secret Santa around the awning.",
    tag: "Festive",
  },
];

function Meetups() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-accent">Get together</p>
        <h1 className="mt-2 text-4xl font-bold text-foreground">Community Meet Ups</h1>
        <p className="mt-3 text-muted-foreground">
          Pitch up alongside fellow members at our organised rallies and weekenders. All abilities, all ages, all welcome — first-timers especially.
        </p>
      </header>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {meetups.map((m) => (
          <article
            key={m.title}
            className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-semibold text-foreground">{m.title}</h2>
              <span className="shrink-0 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                {m.tag}
              </span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" /> {m.date}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> {m.location}
              </li>
              <li className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> {m.spaces}
              </li>
            </ul>
            <p className="mt-4 text-sm text-foreground/80">{m.desc}</p>
          </article>
        ))}
      </div>

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
  );
}
