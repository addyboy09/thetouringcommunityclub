import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { ShieldCheck, Tag, Users, MapPin, Camera, Link2 } from "lucide-react";

export const Route = createFileRoute("/members")({
  component: MembersPage,
  head: () => ({ meta: [{ title: "Members Area — The Touring Community Club" }] }),
});

function MembersPage() {
  const { session, user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ display_name: string; avatar_url: string }>({ display_name: "", avatar_url: "" });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !session) {
      navigate({ to: "/auth", search: { mode: "signup" } });
    }
  }, [session, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name,avatar_url")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setProfile({ display_name: data.display_name ?? "", avatar_url: data.avatar_url ?? "" });
      });
  }, [user]);

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be 5MB or smaller");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      const { error: dbErr } = await supabase
        .from("profiles")
        .upsert({ user_id: user.id, display_name: profile.display_name, avatar_url: pub.publicUrl }, { onConflict: "user_id" });
      if (dbErr) throw dbErr;
      setProfile((p) => ({ ...p, avatar_url: pub.publicUrl }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading || !session) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-muted-foreground">Loading members area…</p>
      </section>
    );
  }

  const greeting = profile.display_name || user?.email || "";

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <header className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-muted border border-border overflow-hidden flex items-center justify-center">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <Users className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 rounded-full bg-primary p-1.5 text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-60"
            aria-label="Change profile picture"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
        </div>
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">Members Only</p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-bold text-foreground">Welcome back{greeting ? `, ${greeting}` : ""}</h1>
          <p className="mt-2 text-muted-foreground">
            You're signed in to the Touring Community Club members area. Browse exclusive picks, hidden discounts, and upcoming meet ups.
          </p>
          {uploading && <p className="mt-2 text-xs text-muted-foreground">Uploading photo…</p>}
        </div>
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
