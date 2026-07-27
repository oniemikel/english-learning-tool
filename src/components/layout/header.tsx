import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { UserNav } from './user-nav';

const Header = async () => {
  const session = await auth();
  // The middleware protects this page, so session and session.user should exist.
  // We fetch the full user from the database to ensure we have the latest data.
  const user = session?.user
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true, image: true },
      })
    : null;

  // We create a user object that matches the Session['user'] type expected by UserNav
  const displayUser = user
    ? {
        name: user.name,
        email: user.email,
        image: user.image,
      }
    : null;

  return (
    <header className="flex h-16 items-center border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <UserNav user={displayUser} />
      </div>
    </header>
  );
};

export default Header;

