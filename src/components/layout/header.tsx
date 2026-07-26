'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--card)_92%,transparent)]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/dashboard" className="text-sm font-semibold tracking-wide text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
          English Learning Tool
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
