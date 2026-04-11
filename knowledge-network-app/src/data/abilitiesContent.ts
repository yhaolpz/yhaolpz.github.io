import { abilityIdByFolderName, abilityMeta, abilityOrder } from "@/data/abilitiesMeta";
import { fromFsName } from "@/data/articles";

export type AbilityId = keyof typeof abilityMeta;

export type KnowledgeItem = {
  title: string;
  description?: string;
};

export type KnowledgeGroup = {
  title: string;
  items: KnowledgeItem[];
};

export type Ability = {
  id: AbilityId;
  label: string;
  tagline: string;
  description: string;
  groups: KnowledgeGroup[];
};

const ARTICLE_FILES = import.meta.glob("/src/articles/**/*.md", { query: "?raw", import: "default" });

function parseArticlePath(path: string): { abilityId: AbilityId; groupTitle: string; itemTitle: string } | null {
  const prefix = "/src/articles/";
  if (!path.startsWith(prefix)) return null;

  const rest = path.slice(prefix.length);
  const parts = rest.split("/");
  if (parts.length < 3) return null;

  const abilityFolder = parts[0];
  const groupFolder = parts.slice(1, -1).join("/");
  const fileName = parts[parts.length - 1];
  if (!fileName.endsWith(".md")) return null;

  const abilityId = abilityIdByFolderName[abilityFolder] as AbilityId | undefined;
  if (!abilityId) return null;

  return {
    abilityId,
    groupTitle: fromFsName(groupFolder),
    itemTitle: fromFsName(fileName.slice(0, -3))
  };
}

function buildGroupsByAbility() {
  const map = new Map<AbilityId, Map<string, Set<string>>>();
  for (const path of Object.keys(ARTICLE_FILES)) {
    const parsed = parseArticlePath(path);
    if (!parsed) continue;

    const byGroup = map.get(parsed.abilityId) ?? new Map<string, Set<string>>();
    const itemSet = byGroup.get(parsed.groupTitle) ?? new Set<string>();
    itemSet.add(parsed.itemTitle);
    byGroup.set(parsed.groupTitle, itemSet);
    map.set(parsed.abilityId, byGroup);
  }
  return map;
}

const groupsByAbility = buildGroupsByAbility();

export const abilities: Ability[] = abilityOrder.map((id) => {
  const meta = abilityMeta[id];
  const groupsMap = groupsByAbility.get(id) ?? new Map<string, Set<string>>();
  const groups: KnowledgeGroup[] = Array.from(groupsMap.entries())
    .sort(([a], [b]) => a.localeCompare(b, "zh-Hans-CN"))
    .map(([groupTitle, itemTitles]) => {
      const items: KnowledgeItem[] = Array.from(itemTitles)
        .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"))
        .map((title) => ({ title }));
      return { title: groupTitle, items };
    });

  return {
    id,
    label: meta.label,
    tagline: meta.tagline,
    description: meta.description,
    groups
  };
});

export { abilityOrder };

export function getAbility(id: AbilityId) {
  const hit = abilities.find((a) => a.id === id);
  if (!hit) throw new Error(`Unknown ability: ${id}`);
  return hit;
}
