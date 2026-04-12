import {
  abilityIdByFolderName,
  abilityMeta,
  abilityOrder,
  type AbilityId
} from "@/data/abilitiesMeta";
import { encodeArticleRef, fromFsName, listArticleRefs, toFsName } from "@/data/articles";

export type ArticleTreeNode =
  | {
      id: string;
      type: "root";
      label: string;
      children: ArticleTreeNode[];
    }
  | {
      id: string;
      type: "dir";
      label: string;
      children: ArticleTreeNode[];
    }
  | {
      id: string;
      type: "file";
      label: string;
      ref: string;
    };

export const ARTICLE_TREE_ROOT_LABEL = "按能力拆解 Agent 架构";

function dirId(abilityId: AbilityId, folderSegments: string[]) {
  const safe = folderSegments.map((seg) => toFsName(seg)).join("/");
  return `dir:${abilityId}/${safe}`;
}

export function getExpandedIdsForArticle(payload: { abilityId: string; groupTitle: string }) {
  const abilityId = payload.abilityId as AbilityId;
  const expanded = new Set<string>();
  expanded.add(`ability:${abilityId}`);

  const parts = payload.groupTitle
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);
  for (let i = 0; i < parts.length; i++) {
    expanded.add(dirId(abilityId, parts.slice(0, i + 1)));
  }
  return expanded;
}

type MutableDir = { id: string; type: "dir"; label: string; children: ArticleTreeNode[] };

function ensureDir(parent: MutableDir, id: string, label: string) {
  const hit = parent.children.find((c) => c.type === "dir" && c.id === id) as MutableDir | undefined;
  if (hit) return hit;
  const node: MutableDir = { id, type: "dir", label, children: [] };
  parent.children.push(node);
  return node;
}

function sortTree(node: ArticleTreeNode): ArticleTreeNode {
  if (node.type === "file") return node;
  const children = node.children
    .map(sortTree)
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
      return a.label.localeCompare(b.label, "zh-Hans-CN");
    });
  return { ...node, children } as ArticleTreeNode;
}

export function buildArticleTree() {
  const root: ArticleTreeNode = {
    id: "root",
    type: "root",
    label: ARTICLE_TREE_ROOT_LABEL,
    children: []
  };

  const abilityNodes = new Map<AbilityId, MutableDir>();
  for (const id of abilityOrder) {
    const label = abilityMeta[id].label;
    const node: MutableDir = { id: `ability:${id}`, type: "dir", label, children: [] };
    root.children.push(node);
    abilityNodes.set(id, node);
  }

  const prefix = "/src/articles/按能力拆解 Agent 架构/";
  for (const path of listArticleRefs()) {
    if (!path.startsWith(prefix)) continue;
    const rest = path.slice(prefix.length);
    const parts = rest.split("/");
    if (parts.length < 3) continue;

    const abilityFolder = parts[0];
    const abilityId = abilityIdByFolderName[abilityFolder] as AbilityId | undefined;
    if (!abilityId) continue;

    const abilityNode = abilityNodes.get(abilityId);
    if (!abilityNode) continue;

    const folderSegmentsFs = parts.slice(1, -1);
    const fileName = parts[parts.length - 1];
    if (!fileName.endsWith(".md")) continue;

    const folderSegments = folderSegmentsFs.map((seg) => fromFsName(seg));
    const groupTitle = folderSegments.join("/");
    const itemTitle = fromFsName(fileName.slice(0, -3));
    const ref = encodeArticleRef({ abilityId, groupTitle, itemTitle });

    let parent = abilityNode;
    for (let i = 0; i < folderSegments.length; i++) {
      const segs = folderSegments.slice(0, i + 1);
      parent = ensureDir(parent, dirId(abilityId, segs), folderSegments[i]);
    }

    parent.children.push({ id: `file:${ref}`, type: "file", label: itemTitle, ref });
  }

  return sortTree(root);
}

export const articleTree = buildArticleTree();
