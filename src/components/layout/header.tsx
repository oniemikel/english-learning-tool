// src/components/layout/header.tsx
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DUMMY_USER } from '@/lib/mock-data';
import { Icons } from '@/components/icons';

const Header = () => {
  return (
    <header className="flex h-16 items-center border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <span className="text-xl text-muted-foreground">·</span>
        <p className="text-muted-foreground">Saturday, 26 Jul 2026</p>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="relative">
          <Icons.Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search words, decks…"
            className="w-64 rounded-lg bg-muted pl-10"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Icons.Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#5b5bd6]" />
        </Button>
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-[#5b5bd6] text-white">
            {DUMMY_USER.avatar}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
