'use client';

import type { ReactNode } from 'react';
import { BottomNav } from './bottom-nav';
import { Header } from './header';
import { Sidebar } from './sidebar';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <Header />

      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[240px_1fr] md:px-6">
        <Sidebar />
        <main>{children}</main>
      </div>

      <BottomNav />
    </div>
  );
}
