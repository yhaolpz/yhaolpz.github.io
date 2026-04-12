import { TopBar } from "@/components/TopBar";
import { AbilityTabs } from "@/components/AbilityTabs";
import { abilities } from "@/data/abilitiesContent";
import { Brain, Database, Eye, Wrench } from "lucide-react";

function abilityIcon(id: string) {
  if (id === "perception") return Eye;
  if (id === "memory") return Database;
  if (id === "planning") return Brain;
  return Wrench;
}

export default function Home() {
  return (
    <div id="top" className="min-h-full bg-white dark:bg-zinc-900">
      <TopBar />

      <main className="mx-auto max-w-[1040px] px-5 py-10 [overflow-anchor:none]">
        <section className="pt-2">
          <h1 className="mt-3 text-2xl font-medium leading-tight text-zinc-900 dark:text-zinc-200 md:text-3xl">
            按能力拆解 Agent 架构
          </h1>
        </section>

        <section id="relationship" className="mt-12 scroll-mt-20">
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {abilities.map((a) => {
              const Icon = abilityIcon(a.id);
              return (
                <div key={a.id} className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900">
                      <Icon className="h-5 w-5 text-zinc-900 dark:text-zinc-200" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-base font-semibold text-zinc-900 dark:text-zinc-200">{a.label}</div>
                      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{a.tagline}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{a.description}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="knowledge" className="mt-12 scroll-mt-20">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-200">关键技术</h2>

          <div className="mt-6">
            <AbilityTabs
              defaultAbilityId="perception"
              onOpenArticle={(payload) => {
                window.open(`${import.meta.env.BASE_URL}#/article/${payload.ref}`, "_blank", "noopener,noreferrer");
              }}
            />
          </div>
        </section>

        <footer className="mt-16 border-t border-zinc-200 py-8 dark:border-zinc-700">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">© {new Date().getFullYear()} WangYingHao.Ahab</div>
        </footer>
      </main>
    </div>
  );
}
