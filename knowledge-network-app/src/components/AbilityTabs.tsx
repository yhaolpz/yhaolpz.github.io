import { Brain, ChevronDown, Database, Eye, FileText, Folder, Wrench } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { abilities, abilityOrder, getAbility, type AbilityId, type KnowledgeGroup } from "@/data/abilitiesContent";
import { cn } from "@/lib/utils";
import { encodeArticleRef } from "@/data/articles";

function iconForAbility(id: AbilityId) {
  if (id === "perception") return Eye;
  if (id === "memory") return Database;
  if (id === "planning") return Brain;
  return Wrench;
}

function AbilityTabButton(props: {
  active: boolean;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  buttonRef?: React.Ref<HTMLButtonElement>;
}) {
  const Icon = props.icon;
  return (
    <button
      ref={props.buttonRef}
      onClick={props.onClick}
      className={cn(
        "group relative flex min-w-[180px] flex-1 flex-col gap-1 rounded-2xl border px-5 py-4 text-left transition",
        props.active
          ? "border-zinc-900 bg-zinc-50 ring-2 ring-zinc-900/10 dark:border-zinc-200/40 dark:bg-zinc-900 dark:ring-zinc-200/10"
          : "border-zinc-200 bg-white text-zinc-500 opacity-70 hover:bg-zinc-50 hover:opacity-90 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-800"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={cn(
              "rounded-2xl border p-2",
              props.active
                ? "border-zinc-900/20 dark:border-zinc-200/30"
                : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5",
                props.active ? "text-zinc-900 dark:text-zinc-200" : "text-zinc-500 dark:text-zinc-500"
              )}
            />
          </div>
          <div className="min-w-0">
            <div
              className={cn(
                "truncate text-base font-semibold",
                props.active ? "text-zinc-900 dark:text-zinc-200" : "text-zinc-700 dark:text-zinc-300"
              )}
            >
              {props.label}
            </div>
          </div>
        </div>
      </div>
      {null}
    </button>
  );
}

function GroupAccordion(props: {
  group: KnowledgeGroup;
  open: boolean;
  onToggle: () => void;
  onOpenItem?: (itemTitle: string) => void;
}) {
  return (
    <div className="border-b border-zinc-200 last:border-b-0 dark:border-zinc-700">
      <button
        onClick={props.onToggle}
        aria-expanded={props.open}
        className={cn(
          "flex w-full items-center justify-between gap-4 px-4 py-4 text-left",
          props.open
            ? "bg-zinc-50 dark:bg-zinc-900"
            : "bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-1.5 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            <Folder className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-200">{props.group.title}</div>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-zinc-500 transition-transform dark:text-zinc-500",
            props.open ? "rotate-180" : ""
          )}
        />
      </button>

      <div
        className={cn(
          "grid border-t border-zinc-200 transition-[grid-template-rows,opacity] duration-200 ease-out dark:border-zinc-700",
          props.open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {props.group.items.map((it) => (
              <button
                key={it.title}
                type="button"
                onClick={() => props.onOpenItem?.(it.title)}
                className="group flex w-full items-center gap-3 pl-10 pr-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800"
                title="打开文章"
              >
                <div className="rounded-xl border border-zinc-200 bg-white p-1.5 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-200">{it.title}</div>
                  {it.description ? (
                    <div className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500 dark:text-zinc-500">{it.description}</div>
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AbilityTabs(props: {
  defaultAbilityId?: AbilityId;
  onOpenArticle?: (payload: { ref: string; title: string }) => void;
}) {
  const initial = props.defaultAbilityId ?? "perception";
  const [activeId, setActiveId] = useState<AbilityId>(initial);

  const active = useMemo(() => getAbility(activeId), [activeId]);

  const [openGroupsByAbility, setOpenGroupsByAbility] = useState<Record<AbilityId, string[]>>(() => ({
    perception: [],
    memory: [],
    planning: [],
    execution: []
  }));

  const openGroupTitles = useMemo(() => {
    return new Set(openGroupsByAbility[activeId] ?? []);
  }, [activeId, openGroupsByAbility]);

  const tabBarRef = useRef<HTMLDivElement | null>(null);
  const tabButtonRefs = useRef<Record<AbilityId, HTMLButtonElement | null>>({
    perception: null,
    memory: null,
    planning: null,
    execution: null
  });
  const [activeTabMetrics, setActiveTabMetrics] = useState<{ left: number; width: number } | null>(null);
  const [tabBarWidth, setTabBarWidth] = useState<number>(0);

  function measureActiveTab() {
    const bar = tabBarRef.current;
    const btn = tabButtonRefs.current[activeId];
    if (!bar || !btn) {
      setActiveTabMetrics(null);
      setTabBarWidth(0);
      return;
    }
    const barRect = bar.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setActiveTabMetrics({ left: btnRect.left - barRect.left, width: btnRect.width });
    setTabBarWidth(barRect.width);
  }

  useLayoutEffect(() => {
    measureActiveTab();
  }, [activeId]);

  useEffect(() => {
    const onResize = () => measureActiveTab();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeId]);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const [minContentHeight, setMinContentHeight] = useState<number>(0);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const height = Math.ceil(el.getBoundingClientRect().height);
    if (height > minContentHeight) setMinContentHeight(height);
  }, [activeId, openGroupsByAbility, minContentHeight]);

  return (
    <div className="space-y-6 [overflow-anchor:none]">
      <div ref={tabBarRef} className="relative">
        <div className="flex flex-col gap-3 md:flex-row">
        {abilityOrder.map((id) => {
          const a = abilities.find((x) => x.id === id);
          if (!a) return null;
          const Icon = iconForAbility(a.id);
          return (
            <AbilityTabButton
              key={a.id}
              active={activeId === a.id}
              label={a.label}
              icon={Icon}
              buttonRef={(el) => {
                tabButtonRefs.current[a.id] = el;
              }}
              onClick={() => setActiveId(a.id)}
            />
          );
        })}
        </div>

        <div className="relative mt-2 h-4">
          {activeTabMetrics ? (
            <>
              <div
                className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-zinc-200 transition-[width] duration-200 ease-out dark:bg-zinc-700"
                style={{ width: Math.max(0, activeTabMetrics.left) }}
              />
              <div
                className="absolute top-1/2 h-px -translate-y-1/2 bg-zinc-200 transition-[left,width] duration-200 ease-out dark:bg-zinc-700"
                style={{
                  left: activeTabMetrics.left + activeTabMetrics.width,
                  width: Math.max(0, tabBarWidth - (activeTabMetrics.left + activeTabMetrics.width))
                }}
              />
            </>
          ) : (
            <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-zinc-200 dark:bg-zinc-700" />
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div ref={contentRef} style={{ minHeight: minContentHeight || undefined }}>
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
            {active.groups.map((g) => (
              <GroupAccordion
                key={g.title}
                group={g}
                open={openGroupTitles.has(g.title)}
                onToggle={() => {
                  setOpenGroupsByAbility((cur) => {
                    const prevList = cur[activeId] ?? [];
                    const nextSet = new Set(prevList);
                    if (nextSet.has(g.title)) nextSet.delete(g.title);
                    else nextSet.add(g.title);
                    return { ...cur, [activeId]: Array.from(nextSet) };
                  });
                }}
                onOpenItem={(itemTitle) => {
                  const decoded = { abilityId: active.id, groupTitle: g.title, itemTitle };
                  const ref = encodeArticleRef(decoded);
                  props.onOpenArticle?.({ title: `${active.label} > ${g.title} > ${itemTitle}`, ref });
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
