import { useEffect, type ReactNode } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

export function RequireMember({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate({ to: "/auth", search: { mode: "signup" } });
    }
  }, [session, loading, navigate]);

  if (loading) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-muted-foreground">Loading…</p>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">Members only</p>
        <h1 className="mt-2 text-3xl font-bold text-foreground">Sign up to view this section</h1>
        <p className="mt-3 text-muted-foreground">
          Recommended sites, approved sites, meet ups and discounts are exclusive to Touring Community Club members.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Sign up
          </Link>
          <Link
            to="/auth"
            search={{ mode: "signin" }}
            className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Sign in
          </Link>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
