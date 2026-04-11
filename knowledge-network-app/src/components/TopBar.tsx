import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/theme/ThemeProvider";

export function TopBar() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/80">
      <div className="mx-auto flex h-14 max-w-[1040px] items-center justify-between gap-3 px-5">
        <a href="#top" className="text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-200">
          Agent 架构学习
        </a>

        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          aria-label={theme === "dark" ? "切换到浅色主题" : "切换到暗色主题"}
          title={theme === "dark" ? "浅色" : "暗色"}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
