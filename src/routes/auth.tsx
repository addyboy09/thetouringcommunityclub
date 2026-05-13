import { createSignal, Show, createEffect } from "solid-js";
import { supabase } from "../lib/supabase";
import { Link, useNavigate, useSearchParams } from "@solidjs/router";

export default function Auth() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [mode, setMode] = createSignal<"signin" | "signup">(
    params.mode === "signup" ? "signup" : "signin"
  );

  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [name, setName] = createSignal("");
  const [busy, setBusy] = createSignal(false);
  const [error, setError] = createSignal("");
  const [success, setSuccess] = createSignal("");
  const [showPassword, setShowPassword] = createSignal(false);

  // Clear errors/success when mode changes
  createEffect(() => {
    mode();
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
  });

  const submit = async (e: Event) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");

    if (mode() === "signup" && password() !== confirmPassword()) {
      setBusy(false);
      setError("Passwords do not match.");
      return;
    }

    try {
      if (mode() === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email(),
          password: password(),
          options: {
            data: { name: name() }
          }
        });
        if (error) throw error;
        setSuccess("Account created! Redirecting you to the members area…");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email(),
          password: password()
        });
        if (error) throw error;
        setSuccess("Signed in successfully! Redirecting you to the members area…");
      }

      // Small delay so the success message is visible
      setTimeout(() => {
        navigate("/members");
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  const inputBaseClasses =
    "mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary";

  const errorBorderClasses = " border-destructive";
  const normalBorderClasses = " border-border";

  const passwordType = () => (showPassword() ? "text" : "password");

  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground">
        {mode() === "signin" ? "Sign in" : "Join the members area"}
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        {mode() === "signup"
          ? "Sign up to unlock the members-only section — exclusive recommended sites, member discounts and community meet ups."
          : "Welcome back. Sign in to access the members area."}
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <Show when={mode() === "signup"}>
          <div>
            <label className="block text-sm font-medium text-foreground">Name</label>
            <input
              type="text"
              required
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              className={
                inputBaseClasses +
                (error() && !name() ? errorBorderClasses : normalBorderClasses)
              }
            />
          </div>
        </Show>

        <div>
          <label className="block text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            required
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            className={
              inputBaseClasses +
              (error() && !email() ? errorBorderClasses : normalBorderClasses)
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <input
              type={passwordType()}
              required
              minLength={6}
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              className={
                inputBaseClasses +
                (error() && !password() ? errorBorderClasses : normalBorderClasses) +
                " pr-10"
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword())}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-muted-foreground hover:text-foreground"
            >
              {showPassword() ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <Show when={mode() === "signup"}>
          <div>
            <label className="block text-sm font-medium text-foreground">
              Confirm password
            </label>
            <input
              type={passwordType()}
              required
              minLength={6}
              value={confirmPassword()}
              onInput={(e) => setConfirmPassword(e.currentTarget.value)}
              className={
                inputBaseClasses +
                (error() && password() !== confirmPassword()
                  ? errorBorderClasses
                  : normalBorderClasses)
              }
            />
            <Show when={password() && confirmPassword() && password() !== confirmPassword()}>
              <p className="mt-1 text-xs text-destructive">Passwords do not match.</p>
            </Show>
          </div>
        </Show>

        <Show when={error()}>
          <p className="text-sm text-destructive">{error()}</p>
        </Show>

        <Show when={success()}>
          <p className="text-sm text-emerald-600">{success()}</p>
        </Show>

        <button
          type="submit"
          disabled={busy()}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground
                     hover:bg-primary/90 disabled:opacity-60"
        >
          {busy()
            ? "Please wait…"
            : mode() === "signin"
            ? "Sign in"
            : "Create account"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(mode() === "signin" ? "signup" : "signin")}
        className="mt-4 text-sm text-primary hover:underline"
      >
        {mode() === "signin"
          ? "Need an account? Sign up"
          : "Already have an account? Sign in"}
      </button>

      <div className="mt-8">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to site
        </Link>
      </div>
    </section>
  );
}
