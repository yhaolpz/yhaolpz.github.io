import { Home, Moon, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { abilities, type AbilityId } from "@/data/abilitiesContent";
import { decodeArticleRef, loadArticleMarkdown } from "@/data/articles";
import { useTheme } from "@/theme/ThemeProvider";

export default function ArticlePage() {
  const { theme, toggleTheme } = useTheme();
  const params = useParams();
  const ref = params.ref ?? "";

  const decoded = useMemo(() => decodeArticleRef(ref), [ref]);

  const breadcrumbTitle = useMemo(() => {
    if (!decoded) return "文章";
    const ability = abilities.find((a) => a.id === (decoded.abilityId as AbilityId));
    return `Agent 架构学习 > ${ability?.label ?? decoded.abilityId} > ${decoded.groupTitle} > ${decoded.itemTitle}`;
  }, [decoded]);

  const pageTitle = useMemo(() => {
    if (!decoded) return "文章";
    return decoded.itemTitle;
  }, [decoded]);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const [markdown, setMarkdown] = useState<string>("# 加载中\n");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!decoded) {
        setMarkdown("# 未找到文章\n\n链接无效或文章不存在\n");
        return;
      }

      setMarkdown("# 加载中\n");
      const md = await loadArticleMarkdown(decoded);
      if (!cancelled) setMarkdown(md);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [decoded]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") window.close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="min-h-full bg-white dark:bg-zinc-900">
      <div className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/80">
        <div className="flex h-14 w-full items-center justify-between gap-3 px-5">
          <div className="flex min-w-0 items-center gap-2">
            <Link
              to="/"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              aria-label="首页"
            >
              <Home className="h-4 w-4" />
            </Link>
            <div className="min-w-0 truncate text-sm font-medium text-zinc-600 dark:text-zinc-400">{breadcrumbTitle}</div>
          </div>

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

      <main className="mx-auto max-w-[1040px] px-5 py-10">
        <div className="prose prose-zinc max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-200">{children}</h1>,
              h2: ({ children }) => <h2 className="mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-200">{children}</h2>,
              h3: ({ children }) => <h3 className="mt-5 text-base font-semibold text-zinc-900 dark:text-zinc-200">{children}</h3>,
              p: ({ children }) => <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">{children}</p>,
              ul: ({ children }) => <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-300">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-300">{children}</ol>,
              li: ({ children }) => <li className="leading-6">{children}</li>,
              a: ({ children, href }) => (
                <a
                  className="text-zinc-900 underline decoration-zinc-300 underline-offset-4 dark:text-zinc-200 dark:decoration-zinc-600"
                  href={href}
                >
                  {children}
                </a>
              ),
              code: ({ children }) => (
                <code className="rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[12px] text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="overflow-auto rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-[12px] text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                  {children}
                </pre>
              )
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>

        <footer className="mt-16 border-t border-zinc-200 py-8 dark:border-zinc-700">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">© {new Date().getFullYear()} WangYingHao.Ahab</div>
        </footer>
      </main>
    </div>
  );
}
