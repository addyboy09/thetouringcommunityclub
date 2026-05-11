import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Trash2, Pencil, Plus, X } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — The Touring Community Club" }] }),
});

type Meetup = {
  id: string;
  title: string;
  date_text: string;
  location: string;
  spaces: string;
  description: string;
  tag: string;
  sort_order: number;
};

const empty: Omit<Meetup, "id"> = {
  title: "", date_text: "", location: "", spaces: "", description: "", tag: "", sort_order: 0,
};

function AdminPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [editing, setEditing] = useState<Meetup | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<Meetup, "id">>(empty);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  const load = async () => {
    const { data } = await supabase.from("meetups").select("*").order("sort_order");
    setMeetups(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const startEdit = (m: Meetup) => {
    setEditing(m);
    setCreating(false);
    setForm({ ...m });
  };

  const startCreate = () => {
    setCreating(true);
    setEditing(null);
    setForm({ ...empty, sort_order: meetups.length + 1 });
  };

  const cancel = () => { setEditing(null); setCreating(false); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (editing) {
        await supabase.from("meetups").update(form).eq("id", editing.id);
      } else {
        await supabase.from("meetups").insert(form);
      }
      await load();
      cancel();
    } finally { setBusy(false); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this meet up?")) return;
    await supabase.from("meetups").delete().eq("id", id);
    await load();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (loading) return <p className="p-8 text-muted-foreground">Loading…</p>;
  if (!user) return null;
  if (!isAdmin) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-2xl font-bold">Not authorised</h1>
        <p className="mt-2 text-muted-foreground">Your account isn't an admin. Ask the site admin to grant you access.</p>
        <button onClick={signOut} className="mt-4 text-sm text-primary hover:underline">Sign out</button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Meet Ups</h1>
          <p className="mt-1 text-sm text-muted-foreground">Signed in as {user.email}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/meetups" className="text-sm text-muted-foreground hover:text-foreground self-center">View page →</Link>
          <button onClick={signOut} className="text-sm rounded-md border border-border px-3 py-1.5 hover:bg-muted">Sign out</button>
        </div>
      </div>

      {!editing && !creating && (
        <button
          onClick={startCreate}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add meet up
        </button>
      )}

      {(editing || creating) && (
        <form onSubmit={save} className="mt-6 rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{editing ? "Edit meet up" : "New meet up"}</h2>
            <button type="button" onClick={cancel} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
          {(["title", "date_text", "location", "spaces", "tag"] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium capitalize">{field.replace("_", " ")}</label>
              <input
                required={field === "title" || field === "date_text" || field === "location"}
                value={form[field] as string}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Sort order</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              className="mt-1 w-32 rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={cancel} className="rounded-md border border-border px-4 py-2 text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 space-y-3">
        {meetups.map((m) => (
          <article key={m.id} className="rounded-xl border border-border bg-card p-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground">{m.title}</h3>
              <p className="text-sm text-muted-foreground">{m.date_text} · {m.location}</p>
              <p className="text-xs text-muted-foreground mt-1">Sort #{m.sort_order} · {m.tag}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => startEdit(m)} className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => remove(m.id)} className="p-2 rounded-md hover:bg-destructive/10 text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
