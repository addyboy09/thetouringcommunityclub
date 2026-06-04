import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RequireMember } from "@/components/RequireMember";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
  head: () => ({
    meta: [
      { title: "Photo Gallery — The Touring Community Club" },
      { name: "description", content: "Members-only photo gallery from Touring Community Club trips and meet ups." },
    ],
  }),
});

type Photo = { id: string; image_url: string; caption: string };

function GalleryPage() {
  return <RequireMember><Inner /></RequireMember>;
}

function Inner() {
  const [rows, setRows] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  useEffect(() => {
    supabase
      .from("gallery_photos")
      .select("id,image_url,caption")
      .order("sort_order")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setRows((data ?? []) as Photo[]);
        setLoading(false);
      });
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-accent">Members Only</p>
        <h1 className="mt-2 text-4xl font-bold text-foreground">Photo Gallery</h1>
        <p className="mt-3 text-muted-foreground">Snapshots from our meet ups, tours and community moments.</p>
      </header>

      {loading ? (
        <p className="mt-10 text-muted-foreground">Loading photos…</p>
      ) : rows.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No photos yet — check back soon.</p>
      ) : (
        <div className="mt-10 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {rows.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setLightbox(p)}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
            >
              <img
                src={p.image_url}
                alt={p.caption || "Gallery photo"}
                loading="lazy"
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
              {p.caption && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-left text-xs text-white opacity-0 group-hover:opacity-100 transition">
                  {p.caption}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-white/10 hover:bg-white/20"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <figure className="max-w-5xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.image_url} alt={lightbox.caption || ""} className="max-h-[85vh] w-auto rounded-lg" />
            {lightbox.caption && <figcaption className="mt-3 text-center text-sm text-white/80">{lightbox.caption}</figcaption>}
          </figure>
        </div>
      )}
    </section>
  );
}
