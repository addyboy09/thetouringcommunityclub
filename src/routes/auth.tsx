<form onSubmit={submit} className="mt-6 space-y-4">

  {/* Name Field */}
  <div>
    <label className="block text-sm font-medium text-foreground">
      Name
    </label>
    <input
      type="text"
      name="name"
      placeholder="Your name"
      required
      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
    />
  </div>

  {/* Email Field */}
  <div>
    <label className="block text-sm font-medium text-foreground">
      Email
    </label>
    <input
      type="email"
      required
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
    />
  </div>

  {/* Password Field */}
  <div>
    <label className="block text-sm font-medium text-foreground">
      Password
    </label>
    <input
      type="password"
      required
      minLength={6}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
    />
  </div>

  {error && (
    <p className="text-sm text-destructive">{error}</p>
  )}

  <button
    type="submit"
    disabled={busy}
    className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
  >
    {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
  </button>
</form>
