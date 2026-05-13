import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { supabase } from "../lib/supabase";

type FormValues = {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export const Route = new Route({
  path: "/auth",
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch<{ mode?: string }>();
  const mode = search.mode === "signup" ? "signup" : "signin";

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const password = watch("password");

  const onSubmit = async (data: FormValues) => {
    setServerError("");
    setSuccess("");

    try {
      if (mode === "signup") {
        if (data.password !== data.confirmPassword) {
          setServerError("Passwords do not match");
          return;
        }

        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: { name: data.name },
          },
        });

        if (error) throw error;

        setSuccess("Account created! Redirecting…");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error) throw error;

        setSuccess("Signed in! Redirecting…");
      }

      setTimeout(() => navigate({ to: "/members" }), 1200);
    } catch (err: any) {
      setServerError(err.message || "Authentication failed");
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground">
        {mode === "signin" ? "Sign in" : "Join the members area"}
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "signup"
          ? "Sign up to unlock the members-only section — exclusive recommended sites, member discounts and community meet ups."
          : "Welcome back. Sign in to access the members area."}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {mode === "signup" && (
          <div>
            <label className="block text-sm font-medium text-foreground">Name</label>
            <input
              {...register("name", { required: true })}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">Name is required</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground">Email</label>
          <input
            {...register("email", { required: true })}
            type="email"
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">Email is required</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <input
              {...register("password", { required: true, minLength: 6 })}
              type={showPassword ? "text" : "password"}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm pr-10
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-muted-foreground hover:text-foreground"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive mt-1">
              Password must be at least 6 characters
            </p>
          )}
        </div>

        {mode === "signup" && (
          <div>
            <label className="block text-sm font-medium text-foreground">
              Confirm password
            </label>
            <input
              {...register("confirmPassword", { required: true })}
              type={showPassword ? "text" : "password"}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive mt-1">Please confirm password</p>
            )}
            {password && watch("confirmPassword") !== password && (
              <p className="text-xs text-destructive mt-1">Passwords do not match</p>
            )}
          </div>
        )}

        {serverError && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}

        {success && (
          <p className="text-sm text-emerald-600">{success}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground
                     hover:bg-primary/90 disabled:opacity-60"
        >
          {isSubmitting
            ? "Please wait…"
            : mode === "signin"
            ? "Sign in"
            : "Create account"}
        </button>
      </form>

      <Link
        to="/auth"
        search={{ mode: mode === "signin" ? "signup" : "signin" }}
        className="mt-4 inline-block text-sm text-primary hover:underline"
      >
        {mode === "signin"
          ? "Need an account? Sign up"
          : "Already have an account? Sign in"}
      </Link>

      <div className="mt-8">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to site
        </Link>
      </div>
    </section>
  );
}
