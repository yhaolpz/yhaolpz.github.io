export type AbilityId = "perception" | "memory" | "planning" | "execution";

export const abilityOrder: AbilityId[] = ["perception", "memory", "planning", "execution"];

export const abilityFolderNameById: Record<AbilityId, string> = {
  perception: "感知能力",
  memory: "记忆能力",
  planning: "规划能力",
  execution: "执行能力"
};

export const abilityIdByFolderName: Record<string, AbilityId> = {
  "感知能力": "perception",
  "记忆能力": "memory",
  "规划能力": "planning",
  "执行能力": "execution"
};

export const abilityMeta: Record<AbilityId, { label: string; tagline: string; description: string }> = {
  perception: {
    label: "感知能力",
    tagline: "让 Agent 理解输入信息",
    description: "把输入与环境信号标准化，并构建模型可理解的上下文"
  },
  memory: {
    label: "记忆能力",
    tagline: "让 Agent 沉淀关键信息",
    description: "把关键信息沉淀下来，并在恰当的时机可检索、可压缩、可遗忘"
  },
  planning: {
    label: "规划能力",
    tagline: "把目标变成计划",
    description: "把目标拆解成可执行步骤，并用推理与策略做决策与迭代"
  },
  execution: {
    label: "执行能力",
    tagline: "把计划落地为动作",
    description: "把决策落地为动作：调用工具、与环境交互，并可监控"
  }
};

