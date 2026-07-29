// src/components/layout/app-shell.tsx
import Header from './header';
import Sidebar from './sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden bg-background">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6 animate-[ui-fade-in_220ms_ease-out]">{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
