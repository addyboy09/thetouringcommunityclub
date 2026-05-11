import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MapPin, Star, Check, ArrowLeft, Quote } from "lucide-react";
import { recommendedSites } from "@/lib/sites-data";

export const Route = createFileRoute("/recommended/$slug")({
  component: SiteDetail,
  loader: ({ params }) => {
    const site = recommendedSites.find((s) => s.slug === params.slug);
    if (!site) throw notFound();
    return site;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Recommended Site` },
          { name: "description", content: loaderData.desc },
          { property: "og:image", content: loaderData.photos[0] },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Site not found</h1>
      <Link to="/recommended" className="mt-4 inline-block text-primary underline">Back to recommended sites</Link>
    </div>
  ),
});

function SiteDetail() {
  const site = Route.useLoaderData();
  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <Link to="/recommended" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> All recommended sites
      </Link>

      <header className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center rounded-full bg-secondary/40 px-3 py-1 text-xs font-semibold text-foreground">{site.tag}</span>
          <h1 className="mt-3 text-4xl font-bold text-foreground">{site.name}</h1>
          <p className="mt-2 inline-flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" /> {site.location}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-card px-4 py-2 text-base font-bold text-foreground border border-border">
          <Star className="h-5 w-5 fill-secondary text-secondary" /> {site.rating}
        </span>
      </header>

      <p className="mt-6 max-w-3xl text-lg text-foreground/85">{site.desc}</p>

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

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="text-xl font-bold text-foreground">Amenities</h2>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {site.amenities.map((a) => (
              <li key={a} className="flex items-center gap-2 text-sm text-foreground/85">
                <Check className="h-4 w-4 text-primary" /> {a}
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-soft)" }}>
          <Quote className="h-6 w-6 text-primary" />
          <p className="mt-3 text-foreground/90 italic">"{site.review.text}"</p>
          <p className="mt-4 text-sm font-semibold text-foreground">— {site.review.author}</p>
        </section>
      </div>
    </article>
  );
}
