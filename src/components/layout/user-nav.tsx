'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { cn } from '@/lib/utils';

interface UserNavProps {
  user: Session['user'] | null | undefined;
  variant?: 'icon' | 'sidebar';
  className?: string;
}

export function UserNav({ user, variant = 'icon', className }: UserNavProps) {
  if (!user) return null;

  const userName = user.name ?? 'User';
  const userEmail = user.email ?? 'No email';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === 'sidebar' ? (
          <Button
            variant="ghost"
            className={cn(
              'h-auto w-full justify-start gap-3 rounded-md px-2 py-2 text-left transition-all duration-200 ease-in-out hover:bg-accent hover:text-accent-foreground active:scale-[0.99]',
              className,
            )}
          >
            <Avatar className="h-8 w-8">
              {user.image && <AvatarImage src={user.image} alt={userName} />}
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{userName}</span>
              <span className="block truncate text-xs text-muted-foreground">{userEmail}</span>
            </span>
          </Button>
        ) : (
          <Button variant="ghost" className={cn('relative h-9 w-9 rounded-full', className)}>
            <Avatar className="h-9 w-9">
              {user.image && <AvatarImage src={user.image} alt={userName} />}
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userInitial}
              </AvatarFallback>
            </Avatar>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align={variant === 'sidebar' ? 'start' : 'end'}
        side={variant === 'sidebar' ? 'top' : 'bottom'}
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* <DropdownMenuItem asChild>
            <Link href="/settings">View Profile</Link>
          </DropdownMenuItem> */}
          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
