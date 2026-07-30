import { ThemeToggle } from "@/components/ui/theme-toggle";

const Header = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6 animate-[ui-fade-in_220ms_ease-out]">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold tracking-wide text-foreground">
          English-Learning-Tool
        </h1>
      </div>

      {/* 右端にテーマ切り替えボタンを配置 */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
