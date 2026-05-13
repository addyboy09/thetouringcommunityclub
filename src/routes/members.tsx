import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { ShieldCheck, Tag, Users, MapPin } from "lucide-react";

export const Route = createFileRoute("/members")({
  component: MembersPage,
  head: () => ({ meta: [{ title: "Members Area — The Touring Community Club" }] }),
});

function MembersPage() {
  const { session, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate({ to: "/auth", search: { mode: "signup" } });
    }
  }, [session, loading, navigate]);

  if (loading || !session) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-muted-foreground">Loading members area…</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">Members Only</p>
        <h1 className="mt-2 text-4xl font-bold text-foreground">Welcome back{user?.email ? `, ${user.email}` : ""}</h1>
        <p className="mt-3 text-muted-foreground">
          You're signed in to the Touring Community Club members area. Browse exclusive picks, hidden discounts, and upcoming meet ups.
        </p>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <MemberCard to="/recommended" icon={MapPin} title="Recommended Sites" body="Member-favourite campsites across the UK." />
        <MemberCard to="/approved" icon={ShieldCheck} title="Club Approved" body="Sites visited and approved by our team." />
        <MemberCard to="/discounts" icon={Tag} title="Member Discounts" body="Exclusive savings on pitches and gear." />
        <MemberCard to="/meetups" icon={Users} title="Community Meet Ups" body="Find your next rally or weekend gathering." />
      </div>

      <div className="mt-10">
        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/" });
          }}
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          Sign out
        </button>
      </div>
    </section>
  );
}

function MemberCard({
  to,
  icon: Icon,
  title,
  body,
}: {
  to: "/recommended" | "/approved" | "/discounts" | "/meetups";
  icon: typeof MapPin;
  title: string;
  body: string;
}) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary hover:-translate-y-1"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <Icon className="h-6 w-6 text-primary" />
      <h2 className="mt-3 text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </Link>
  );
}
