# CrewAI

## 一句话定义

面向「**角色 + 任务 + 团队**」的多 Agent 编排框架，强调用 Crew/Agent/Task 等对象组织协作流程。

## 先理解什么（入门）

CrewAI 适合快速搭演示：给每个 agent 设定角色与目标，定义任务 DAG 或顺序，让框架驱动对话与工具使用。

## 再理解什么（进阶）

- **与 LangGraph 对比**：CrewAI 偏高层业务语言；LangGraph 偏通用状态机与检查点。
- **观测**：需自行接入 tracing/日志以满足生产要求。
- **版本迭代**：关注 breaking changes 与社区插件生态。

## 落地要点（实践）

- 从最小 2～3 个 agent 开始验证价值再扩展。
- 为每个任务设清晰输出 schema 便于合并。
- 压测并发 crew 的资源占用。

## 常见坑

- 任务边界不清导致 agent 抢活或推诿。
- 无全局状态导致重复工作。

## 延伸阅读

- [CrewAI 官方文档](https://docs.crewai.com/)
