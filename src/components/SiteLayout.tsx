import { Link, Outlet } from "@tanstack/react-router";
import logo from "@/assets/logo.jpeg";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/recommended", label: "Recommended Sites" },
  { to: "/approved", label: "Approved Sites" },
  { to: "/meetups", label: "Meet Ups" },
  { to: "/discounts", label: "Discounts" },
] as const;

export function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="The Touring Community Club" className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/20" />
            <span className="font-bold text-foreground tracking-tight leading-tight text-sm sm:text-base">
              The Touring<br className="sm:hidden" /> Community Club
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:text-primary hover:bg-primary/5 transition-colors"
                activeProps={{ className: "px-3 py-2 text-sm font-medium rounded-md text-primary bg-primary/10" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <nav className="md:hidden flex overflow-x-auto gap-1 px-4 pb-2 border-t border-border/50">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="whitespace-nowrap px-3 py-1.5 text-xs font-medium text-muted-foreground rounded-md"
              activeProps={{ className: "whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-md text-primary bg-primary/10" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-card mt-16">
        <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="h-9 w-9 rounded-full object-cover" />
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} The Touring Community Club</p>
          </div>
          <p className="text-xs text-muted-foreground">Find us on Facebook · TikTok · Instagram</p>
        </div>
      </footer>
    </div>
  );
}
