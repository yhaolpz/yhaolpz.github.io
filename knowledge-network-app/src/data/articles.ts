import { abilityFolderNameById, type AbilityId } from "@/data/abilitiesMeta";

export const ARTICLES_ROOT_DIR = "按能力拆解 Agent 架构";

function base64UrlEncodeUtf8(text: string) {
  const base64 = btoa(unescape(encodeURIComponent(text)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function base64UrlDecodeUtf8(base64Url: string) {
  const normalized = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "===".slice((normalized.length + 3) % 4);
  const text = decodeURIComponent(escape(atob(padded)));
  return text;
}

export function encodeArticleRef(payload: { abilityId: string; groupTitle: string; itemTitle: string }) {
  return base64UrlEncodeUtf8(JSON.stringify(payload));
}

export function decodeArticleRef(ref: string): { abilityId: string; groupTitle: string; itemTitle: string } | null {
  try {
    const raw = base64UrlDecodeUtf8(ref);
    const obj = JSON.parse(raw) as { abilityId?: string; groupTitle?: string; itemTitle?: string };
    if (!obj.abilityId || !obj.groupTitle || !obj.itemTitle) return null;
    return { abilityId: obj.abilityId, groupTitle: obj.groupTitle, itemTitle: obj.itemTitle };
  } catch {
    return null;
  }
}

export function toFsName(name: string) {
  return name.trim().replace(/\//g, "／");
}

export function fromFsName(name: string) {
  return name.replace(/／/g, "/");
}

const MARKDOWN_LOADERS = import.meta.glob("/src/articles/按能力拆解 Agent 架构/**/*.md", {
  query: "?raw",
  import: "default"
}) as Record<string, () => Promise<string>>;

function toFsPath(pathLike: string) {
  return pathLike
    .split("/")
    .map((seg) => toFsName(seg))
    .join("/");
}

export function resolveArticlePath(payload: { abilityId: string; groupTitle: string; itemTitle: string }) {
  const abilityId = payload.abilityId as AbilityId;
  const abilityFolder = abilityFolderNameById[abilityId];
  if (!abilityFolder) return null;

  const groupFolder = toFsPath(payload.groupTitle);
  const fileName = `${toFsName(payload.itemTitle)}.md`;
  return `/src/articles/${ARTICLES_ROOT_DIR}/${abilityFolder}/${groupFolder}/${fileName}`;
}

export async function loadArticleMarkdown(payload: { abilityId: string; groupTitle: string; itemTitle: string }) {
  const path = resolveArticlePath(payload);
  if (!path) return "# 未找到文章\n\n链接无效或文章不存在\n";

  const loader = MARKDOWN_LOADERS[path];
  if (!loader) return "# 未找到文章\n\n链接无效或文章不存在\n";

  try {
    return await loader();
  } catch {
    return "# 未找到文章\n\n文章读取失败\n";
  }
}

export function listArticleRefs() {
  return Object.keys(MARKDOWN_LOADERS);
}
