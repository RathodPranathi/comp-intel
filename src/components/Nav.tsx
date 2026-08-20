import Link from "next/link";

export function Nav() {
  return (
    <header className="border-b border-border bg-surface/60 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-level" />
          <span className="font-semibold tracking-tight">Levelline</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted">
          <Link href="/" className="hover:text-foreground transition-colors">
            Explore
          </Link>
          <Link href="/companies" className="hover:text-foreground transition-colors">
            Companies
          </Link>
          <Link href="/compare" className="hover:text-foreground transition-colors">
            Compare
          </Link>
        </nav>
      </div>
    </header>
  );
}
