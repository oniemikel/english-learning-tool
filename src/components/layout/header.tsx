import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserNav } from "./user-nav";

const Header = async () => {
  const session = await auth();

  // Middlewareで認証済みなので、最新のユーザー情報をDBから取得
  const user = session?.user
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          displayName: true,
          email: true,
          avatarUrl: true,
        },
      })
    : null;

  // UserNavが期待する形式へ変換
  const displayUser = user
    ? {
        name: user.displayName,
        email: user.email,
        image: user.avatarUrl,
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
