'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation } from './navigation';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block">
      <nav className="space-y-1 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--card)] p-3 card-shadow">
        {navigation.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-[var(--radius-control)] px-3 py-2 text-sm font-medium transition',
                active
                  ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
