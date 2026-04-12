import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArticleTreeNav } from "@/components/ArticleTreeNav";
import { articleTree, getExpandedIdsForArticle } from "@/data/articleTree";
import { decodeArticleRef, loadArticleMarkdown } from "@/data/articles";

export default function ArticlePage() {
  const params = useParams();
  const ref = params.ref ?? "";

  const decoded = useMemo(() => decodeArticleRef(ref), [ref]);

  const pageTitle = useMemo(() => {
    if (!decoded) return "文章";
    return decoded.itemTitle;
  }, [decoded]);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const [markdown, setMarkdown] = useState<string>("# 加载中\n");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const base = new Set<string>(["root"]);
    if (!decoded) return base;
    for (const id of getExpandedIdsForArticle(decoded)) base.add(id);
    return base;
  });

  useEffect(() => {
    if (!decoded) return;
    const needed = getExpandedIdsForArticle(decoded);
    setExpandedIds((prev) => {
      const next = new Set(prev);
      for (const id of needed) next.add(id);
      return next;
    });
  }, [decoded]);

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

  return (
    <div className="min-h-full bg-white dark:bg-zinc-900">
      <main className="w-full">
        <div className="grid min-h-screen gap-0 lg:grid-cols-[340px_1fr]">
          <aside className="hidden border-r border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 lg:block">
            <div className="sticky top-0 max-h-screen overflow-x-auto overflow-y-auto px-3 py-8">
              <ArticleTreeNav
                root={articleTree}
                expandedIds={expandedIds}
                onToggle={(id) =>
                  setExpandedIds((prev) => {
                    const next = new Set(prev);
                    if (next.has(id)) next.delete(id);
                    else next.add(id);
                    return next;
                  })
                }
                activeRef={ref}
              />
            </div>
          </aside>

          <div className="min-w-0 px-5 pb-10 pt-8">
            <div className="mx-auto max-w-[1040px]">
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
