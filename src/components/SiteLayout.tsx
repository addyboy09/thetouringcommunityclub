import { Link, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import logo from "@/assets/logo.jpeg";
import { Facebook, Instagram, Heart } from "lucide-react";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/recommended", label: "Recommended" },
  { to: "/approved", label: "Approved" },
  { to: "/meetups", label: "Meet Ups" },
  { to: "/discounts", label: "Discounts" },
  { to: "/useful-links", label: "Useful Links" },
  { to: "/team", label: "Team" },
  { to: "/gallery", label: "Gallery" },
] as const;

export function SiteLayout() {
  const { session } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 gap-3">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src={logo} alt="The Touring Community Club" className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/20" />
            <span className="font-bold text-foreground tracking-tight leading-tight text-sm sm:text-base font-display">
              The Touring<br className="sm:hidden" /> Community Club
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-full hover:text-primary hover:bg-primary/5 transition-colors"
                activeProps={{ className: "px-3 py-2 text-sm font-medium rounded-full text-primary bg-primary/10" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {session ? (
              <Link to="/members" className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition">
                Members Area
              </Link>
            ) : (
              <>
                <Link to="/auth" search={{ mode: "signin" }} className="px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground">
                  Sign in
                </Link>
                <Link to="/auth" search={{ mode: "signup" }} className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition">
                  Join free
                </Link>
              </>
            )}
          </div>
        </div>
        <nav className="md:hidden flex overflow-x-auto gap-1 px-4 pb-2 border-t border-border/50 [-ms-overflow-style:'none'] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="whitespace-nowrap px-3 py-1.5 text-xs font-medium text-muted-foreground rounded-full"
              activeProps={{ className: "whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-full text-primary bg-primary/10" }}
            >
              {item.label}
            </Link>
          ))}
          {!session && (
            <Link to="/auth" search={{ mode: "signup" }} className="ml-auto whitespace-nowrap rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
              Join free
            </Link>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-card mt-16">
        <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt="" className="h-10 w-10 rounded-full object-cover" />
              <p className="font-semibold text-foreground font-display">The Touring Community Club</p>
            </div>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs leading-relaxed">
              A friendly UK community for caravan and motorhome tourers. Made with <Heart className="inline h-3.5 w-3.5 text-accent" /> by members, for members.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Explore</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/recommended" className="text-muted-foreground hover:text-primary">Recommended Sites</Link></li>
              <li><Link to="/approved" className="text-muted-foreground hover:text-primary">Approved Sites</Link></li>
              <li><Link to="/meetups" className="text-muted-foreground hover:text-primary">Meet Ups</Link></li>
              <li><Link to="/discounts" className="text-muted-foreground hover:text-primary">Discounts</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Community</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/useful-links" className="text-muted-foreground hover:text-primary">Useful Links</Link></li>
              <li><Link to="/members" className="text-muted-foreground hover:text-primary">Members Area</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
            </ul>
            <div className="mt-4 flex items-center gap-3 text-muted-foreground">
              <a href="https://facebook.com" target="_blank" rel="noreferrer noopener" aria-label="Facebook" className="hover:text-primary"><Facebook className="h-4 w-4" /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer noopener" aria-label="Instagram" className="hover:text-primary"><Instagram className="h-4 w-4" /></a>
              <span className="text-xs">· TikTok</span>
            </div>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} The Touring Community Club. All rights reserved.</p>
            <Link to="/admin" className="text-xs text-muted-foreground hover:text-primary">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
