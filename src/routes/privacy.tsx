import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy — The Touring Community Club" },
      { name: "description", content: "How The Touring Community Club collects, uses and protects your personal information." },
    ],
  }),
});

function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 prose prose-sm">
      <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="mt-8 space-y-6 text-foreground">
        <div>
          <h2 className="text-xl font-semibold">Who we are</h2>
          <p className="mt-2 text-sm text-muted-foreground">The Touring Community Club is a UK-based community for caravan, motorhome and tent tourers. This policy explains what data we collect when you use our website and members area.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">What we collect</h2>
          <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
            <li>Account details you provide when signing up (name, email address, password).</li>
            <li>Basic technical data such as browser type and pages visited, used to keep the site working.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">How we use your data</h2>
          <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
            <li>To create and manage your members account.</li>
            <li>To send service messages relating to your membership.</li>
            <li>To improve the site and our community offering.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Sharing</h2>
          <p className="mt-2 text-sm text-muted-foreground">We do not sell your personal data. We only share it with the trusted services we use to run the site (e.g. our hosting and authentication provider).</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Your rights</h2>
          <p className="mt-2 text-sm text-muted-foreground">Under UK GDPR you can request access to, correction of, or deletion of your personal data at any time. Contact us via our Facebook, TikTok or Instagram pages to make a request.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Cookies</h2>
          <p className="mt-2 text-sm text-muted-foreground">We use only essential cookies needed to keep you signed in to the members area. We do not use advertising or tracking cookies.</p>
        </div>
      </div>
    </section>
  );
}
