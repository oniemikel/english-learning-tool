// src/components/layout/sidebar.tsx
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DUMMY_USER, SIDEBAR_NAV_ITEMS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Icons, Icon } from '@/components/icons';

const Sidebar = () => {
  const pathname = '/dashboard'; // Mock pathname

  return (
    <aside className="hidden h-screen w-60 flex-col border-r bg-[#0e0e12] text-white md:flex">
      <div className="border-b border-gray-800 p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5b5bd6]">
            <Icons.Decks className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">Lexify</span>
          <Badge variant="secondary">Pro</Badge>
        </Link>
      </div>
      <nav className="flex-1 space-y-6 p-2">
        <div>
          <h3 className="px-2 text-xs font-medium uppercase text-gray-400">
            Learn
          </h3>
          <ul className="mt-2 space-y-1">
            {SIDEBAR_NAV_ITEMS.learn.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                    pathname === item.href
                      ? 'bg-[#5b5bd6] text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  )}
                >
                  <Icon name={item.icon} className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge className="ml-auto bg-gray-700 text-gray-300">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="px-2 text-xs font-medium uppercase text-gray-400">
            Account
          </h3>
          <ul className="mt-2 space-y-1">
            {SIDEBAR_NAV_ITEMS.account.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                     pathname === item.href
                      ? 'bg-[#5b5bd6] text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  )}
                >
                  <Icon name={item.icon} className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-[#5b5bd6] text-white">
              {DUMMY_USER.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-semibold">{DUMMY_USER.name}</p>
            <p className="text-xs text-gray-400">{DUMMY_USER.email}</p>
          </div>
          <div className="flex items-center gap-1 text-yellow-400">
            <Icons.Streak className="h-4 w-4" />
            <span className="text-sm font-bold">{DUMMY_USER.streak}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
