import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Trash2, Pencil, Plus, X } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — The Touring Community Club" }] }),
});

type FieldType = "text" | "number" | "textarea" | "list";
type FieldDef = { key: string; label: string; type: FieldType; required?: boolean };

type SectionConfig = {
  key: "meetups" | "recommended" | "approved" | "discounts";
  label: string;
  table: "meetups" | "recommended_sites" | "approved_sites" | "discounts";
  orderBy: string;
  titleKey: string;
  subtitleKeys: string[];
  fields: FieldDef[];
};

const SECTIONS: SectionConfig[] = [
  {
    key: "meetups",
    label: "Meet Ups",
    table: "meetups",
    orderBy: "sort_order",
    titleKey: "title",
    subtitleKeys: ["date_text", "location"],
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "date_text", label: "Date", type: "text", required: true },
      { key: "location", label: "Location", type: "text", required: true },
      { key: "spaces", label: "Spaces", type: "text" },
      { key: "tag", label: "Tag", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  {
    key: "recommended",
    label: "Recommended Sites",
    table: "recommended_sites",
    orderBy: "sort_order",
    titleKey: "name",
    subtitleKeys: ["location", "tag"],
    fields: [
      { key: "slug", label: "Slug (url-id)", type: "text", required: true },
      { key: "name", label: "Name", type: "text", required: true },
      { key: "location", label: "Location", type: "text" },
      { key: "rating", label: "Rating (0–5)", type: "number" },
      { key: "tag", label: "Tag", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "amenities", label: "Amenities (one per line)", type: "list" },
      { key: "photos", label: "Photo URLs (one per line)", type: "list" },
      { key: "review_author", label: "Review author", type: "text" },
      { key: "review_text", label: "Review text", type: "textarea" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  {
    key: "approved",
    label: "Approved Sites",
    table: "approved_sites",
    orderBy: "sort_order",
    titleKey: "name",
    subtitleKeys: ["location", "year"],
    fields: [
      { key: "slug", label: "Slug (url-id)", type: "text", required: true },
      { key: "name", label: "Name", type: "text", required: true },
      { key: "location", label: "Location", type: "text" },
      { key: "year", label: "Year approved", type: "number" },
      { key: "notes", label: "Notes / summary", type: "textarea" },
      { key: "amenities", label: "Amenities (one per line)", type: "list" },
      { key: "photos", label: "Photo URLs (one per line)", type: "list" },
      { key: "review_author", label: "Review author", type: "text" },
      { key: "review_text", label: "Review text", type: "textarea" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  {
    key: "discounts",
    label: "Discounts",
    table: "discounts",
    orderBy: "sort_order",
    titleKey: "brand",
    subtitleKeys: ["category", "code"],
    fields: [
      { key: "brand", label: "Brand", type: "text", required: true },
      { key: "category", label: "Category", type: "text" },
      { key: "off", label: "Off (e.g. 15% or £5 off)", type: "text" },
      { key: "code", label: "Code", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
];

type AnyRow = Record<string, unknown> & { id: string };

function emptyForm(section: SectionConfig): Record<string, unknown> {
  const f: Record<string, unknown> = {};
  for (const fd of section.fields) {
    f[fd.key] = fd.type === "number" ? 0 : fd.type === "list" ? [] : "";
  }
  return f;
}

function AdminPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [active, setActive] = useState<SectionConfig["key"]>("meetups");
  const section = useMemo(() => SECTIONS.find((s) => s.key === active)!, [active]);

  const [rows, setRows] = useState<AnyRow[]>([]);
  const [editing, setEditing] = useState<AnyRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { mode: "signin" } });
  }, [user, loading, navigate]);

  const load = async () => {
    setErr("");
    const { data, error } = await supabase.from(section.table).select("*").order(section.orderBy);
    if (error) setErr(error.message);
    setRows((data ?? []) as AnyRow[]);
  };

  useEffect(() => {
    setEditing(null);
    setCreating(false);
    if (user && isAdmin) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, user, isAdmin]);

  const startEdit = (row: AnyRow) => {
    setEditing(row);
    setCreating(false);
    setForm({ ...row });
  };
  const startCreate = () => {
    setCreating(true);
    setEditing(null);
    setForm({ ...emptyForm(section), sort_order: rows.length + 1 });
  };
  const cancel = () => { setEditing(null); setCreating(false); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const payload: Record<string, unknown> = {};
      for (const fd of section.fields) payload[fd.key] = form[fd.key];

      const table = supabase.from(section.table) as unknown as {
        update: (v: Record<string, unknown>) => { eq: (col: string, val: string) => Promise<{ error: { message: string } | null }> };
        insert: (v: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
      };

      if (editing) {
        const { error } = await table.update(payload).eq("id", editing.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await table.insert(payload);
        if (error) throw new Error(error.message);
      }
      await load();
      cancel();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Save failed";
      setErr(msg);
    } finally { setBusy(false); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    setErr("");
    const { error } = await supabase.from(section.table).delete().eq("id", id);
    if (error) { setErr(error.message); return; }
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Website Content</h1>
          <p className="mt-1 text-sm text-muted-foreground">Signed in as {user.email}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground self-center">View site →</Link>
          <button onClick={signOut} className="text-sm rounded-md border border-border px-3 py-1.5 hover:bg-muted">Sign out</button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-border">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setActive(s.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${
              active === s.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {err && <p className="mt-4 text-sm text-destructive">{err}</p>}

      {!editing && !creating && (
        <button
          onClick={startCreate}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add {section.label.replace(/s$/, "").toLowerCase()}
        </button>
      )}

      {(editing || creating) && (
        <form onSubmit={save} className="mt-6 rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{editing ? `Edit ${section.label}` : `New ${section.label}`}</h2>
            <button type="button" onClick={cancel} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          {section.fields.map((fd) => {
            const value = form[fd.key];
            if (fd.type === "textarea") {
              return (
                <div key={fd.key}>
                  <label className="block text-sm font-medium">{fd.label}</label>
                  <textarea
                    rows={3}
                    required={fd.required}
                    value={(value as string) ?? ""}
                    onChange={(e) => setForm({ ...form, [fd.key]: e.target.value })}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
              );
            }
            if (fd.type === "list") {
              const text = Array.isArray(value) ? (value as string[]).join("\n") : "";
              return (
                <div key={fd.key}>
                  <label className="block text-sm font-medium">{fd.label}</label>
                  <textarea
                    rows={4}
                    value={text}
                    onChange={(e) => setForm({ ...form, [fd.key]: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
                    placeholder="One item per line"
                  />
                </div>
              );
            }
            return (
              <div key={fd.key}>
                <label className="block text-sm font-medium">{fd.label}</label>
                <input
                  required={fd.required}
                  type={fd.type === "number" ? "number" : "text"}
                  step={fd.type === "number" ? "any" : undefined}
                  value={fd.type === "number" ? Number(value ?? 0) : ((value as string) ?? "")}
                  onChange={(e) => setForm({ ...form, [fd.key]: fd.type === "number" ? Number(e.target.value) : e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
            );
          })}

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
        {rows.length === 0 && !creating && (
          <p className="text-sm text-muted-foreground">No items yet — use the button above to add one.</p>
        )}
        {rows.map((r) => (
          <article key={r.id} className="rounded-xl border border-border bg-card p-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground">{String(r[section.titleKey] ?? "(untitled)")}</h3>
              <p className="text-sm text-muted-foreground">
                {section.subtitleKeys.map((k) => String(r[k] ?? "")).filter(Boolean).join(" · ")}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => startEdit(r)} className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground" aria-label="Edit">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => remove(r.id)} className="p-2 rounded-md hover:bg-destructive/10 text-destructive" aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
