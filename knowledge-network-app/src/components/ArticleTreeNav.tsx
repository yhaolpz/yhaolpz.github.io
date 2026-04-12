import { ChevronDown, ChevronRight, FileText, Folder } from "lucide-react";
import { memo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { ArticleTreeNode } from "@/data/articleTree";

type Props = {
  root: ArticleTreeNode;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  activeRef: string;
};

function Row({ children, depth }: { children: ReactNode; depth: number }) {
  return (
    <div
      className="flex min-h-8 items-center gap-2 px-2 text-[13px] whitespace-nowrap"
      style={{ paddingLeft: 10 + depth * 14 }}
    >
      {children}
    </div>
  );
}

function NodeView({
  node,
  depth,
  expandedIds,
  onToggle,
  activeRef
}: {
  node: ArticleTreeNode;
  depth: number;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  activeRef: string;
}) {
  if (node.type === "file") {
    const active = node.ref === activeRef;
    return (
      <div>
        <Link
          to={`/article/${node.ref}`}
          aria-current={active ? "page" : undefined}
          className="block"
        >
          <div
            className={
              "relative px-2 py-1.5 transition-colors hover:bg-zinc-100/70 dark:hover:bg-zinc-800/60 " +
              (active ? "bg-zinc-200/70 font-medium text-zinc-900 dark:bg-zinc-800/80 dark:text-zinc-100" : "text-zinc-700 dark:text-zinc-300")
            }
            style={{ paddingLeft: 10 + depth * 14 }}
          >
            {active ? (
              <span className="absolute inset-y-1 left-0 w-0.5 bg-zinc-900/70 dark:bg-zinc-200/70" />
            ) : null}
            <span className="flex items-center gap-2 whitespace-nowrap text-[13px]">
              <FileText className="h-4 w-4 text-zinc-400" />
              <span>{node.label}</span>
            </span>
          </div>
        </Link>
      </div>
    );
  }

  const isRoot = node.type === "root";
  const expanded = expandedIds.has(node.id);
  const canToggle = true;
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;
  const labelClass = "" + (isRoot ? "font-semibold text-zinc-900 dark:text-zinc-200" : "text-zinc-800 dark:text-zinc-200");

  return (
    <div>
      <button
        type="button"
        onClick={() => onToggle(node.id)}
        className={
          "block w-full text-left transition-colors hover:bg-zinc-100/70 dark:hover:bg-zinc-800/60"
        }
        aria-label={`${expanded ? "收起" : "展开"} ${node.label}`}
      >
        <Row depth={depth}>
          <ChevronIcon className="h-4 w-4 text-zinc-400" />
          <Folder className="h-4 w-4 text-zinc-400" />
          <span className={labelClass}>{node.label}</span>
        </Row>
      </button>

      {expanded ? (
        <div className={isRoot ? "mt-1" : ""}>
          {node.children.map((child) => (
            <NodeView
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              onToggle={onToggle}
              activeRef={activeRef}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ArticleTreeNavImpl({ root, expandedIds, onToggle, activeRef }: Props) {
  return (
    <nav aria-label="文章目录" className="w-full">
      <NodeView node={root} depth={0} expandedIds={expandedIds} onToggle={onToggle} activeRef={activeRef} />
    </nav>
  );
}

export const ArticleTreeNav = memo(ArticleTreeNavImpl);
