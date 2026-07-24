import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--card)] px-3 text-sm outline-none placeholder:text-[var(--muted-foreground)] focus-visible:focus-ring',
        className,
      )}
      {...props}
    />
  );
}
