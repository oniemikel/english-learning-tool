'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mobileNavigation } from './navigation';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-[var(--border)] bg-[var(--card)] px-2 py-2 md:hidden">
      <ul className="mx-auto grid max-w-[640px] grid-cols-5 gap-1">
        {mobileNavigation.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center rounded-[var(--radius-control)] px-1 py-2 text-[11px] font-medium transition-colors',
                  active
                    ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]',
                )}
              >
                <Icon className="mb-1 h-4 w-4" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
