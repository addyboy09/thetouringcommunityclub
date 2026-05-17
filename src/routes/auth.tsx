import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "../integrations/supabase/client";
import { createFileRoute } from "@tanstack/react-router";

type FormValues = {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};


export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    mode: s.mode === "signup" ? ("signup" as const) : ("signin" as const),
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { mode } = Route.useSearch();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const password = watch("password");

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setServerError("Image must be 5MB or smaller");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: FormValues) => {
    setServerError("");
    setSuccess("");

    try {
      if (mode === "signup") {
        if (data.password !== data.confirmPassword) {
          setServerError("Passwords do not match");
          return;
        }

        const { data: signUpData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: { data: { name: data.name } },
        });

        if (error) throw error;

        const userId = signUpData.user?.id;
        if (userId && avatarFile) {
          const ext = avatarFile.name.split(".").pop()?.toLowerCase() || "jpg";
          const path = `${userId}/avatar.${ext}`;
          const { error: upErr } = await supabase.storage
            .from("avatars")
            .upload(path, avatarFile, { upsert: true, contentType: avatarFile.type });
          if (!upErr) {
            const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
            await supabase
              .from("profiles")
              .upsert({ user_id: userId, display_name: data.name ?? "", avatar_url: pub.publicUrl }, { onConflict: "user_id" });
          }
        } else if (userId && data.name) {
          await supabase
            .from("profiles")
            .upsert({ user_id: userId, display_name: data.name }, { onConflict: "user_id" });
        }

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
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Authentication failed");
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

        {mode === "signup" && (
          <div>
            <label className="block text-sm font-medium text-foreground">Profile picture (optional)</label>
            <div className="mt-2 flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted border border-border overflow-hidden flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-muted-foreground">No image</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={onAvatarChange}
                className="text-xs file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">JPG or PNG, up to 5MB.</p>
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
