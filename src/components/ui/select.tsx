import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--card)] px-3 text-sm outline-none focus-visible:focus-ring',
        className,
      )}
      {...props}
    />
  );
}
