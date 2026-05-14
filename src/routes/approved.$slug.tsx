import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, ShieldCheck, Check, ArrowLeft, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RequireMember } from "@/components/RequireMember";

export const Route = createFileRoute("/approved/$slug")({
  component: () => <RequireMember><SiteDetail /></RequireMember>,
});

type Site = {
  slug: string; name: string; location: string; year: number; notes: string;
  amenities: string[]; photos: string[]; review_author: string; review_text: string;
};

function SiteDetail() {
  const { slug } = Route.useParams();
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("approved_sites").select("*").eq("slug", slug).maybeSingle().then(({ data }) => {
      setSite((data ?? null) as Site | null);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <p className="mx-auto max-w-2xl px-4 py-20 text-center text-muted-foreground">Loading…</p>;
  if (!site) return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Site not found</h1>
      <Link to="/approved" className="mt-4 inline-block text-primary underline">Back to approved sites</Link>
    </div>
  );

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <Link to="/approved" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> All approved sites
      </Link>

      <header className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> Approved {site.year}
          </div>
          <h1 className="mt-3 text-4xl font-bold text-foreground">{site.name}</h1>
          <p className="mt-2 inline-flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" /> {site.location}
          </p>
        </div>
      </header>

      <p className="mt-6 max-w-3xl text-lg text-foreground/85">{site.notes}</p>

      {site.photos?.length > 0 && (
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2 aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
            <img src={site.photos[0]} alt={site.name} className="h-full w-full object-cover" />
          </div>
          <div className="grid gap-3">
            {site.photos.slice(1, 3).map((p, i) => (
              <div key={i} className="aspect-[16/10] sm:aspect-auto sm:h-full overflow-hidden rounded-2xl bg-muted">
                <img src={p} alt={`${site.name} ${i + 2}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="text-xl font-bold text-foreground">Amenities</h2>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {site.amenities?.map((a) => (
              <li key={a} className="flex items-center gap-2 text-sm text-foreground/85">
                <Check className="h-4 w-4 text-primary" /> {a}
              </li>
            ))}
          </ul>
        </section>
        {site.review_text && (
          <section className="rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-soft)" }}>
            <Quote className="h-6 w-6 text-primary" />
            <p className="mt-3 text-foreground/90 italic">"{site.review_text}"</p>
            <p className="mt-4 text-sm font-semibold text-foreground">— {site.review_author}</p>
          </section>
        )}
      </div>
    </article>
  );
}
