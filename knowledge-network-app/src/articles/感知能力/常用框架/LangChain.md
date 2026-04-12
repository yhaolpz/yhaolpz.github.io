# LangChain

## 一句话定义

一套用于编排 **LLM + 检索 + 工具 + 记忆** 的应用框架与组件库，帮助快速搭建 Agent 与 RAG 流水线。

## 先理解什么（入门）

你可以把 LangChain 理解为「乐高零件」：文档加载、切分、向量化、链（Chain）、代理（Agent）、回调与追踪等。它不负责替你选模型，但提供**常见模式的现成抽象**。

## 再理解什么（进阶）

- **LCEL / Runnable**：用组合式 API 描述数据流，便于流式输出与并行。
- **与 LangGraph 关系**：复杂状态机、循环、人机协同用 LangGraph 更自然；简单链式仍可用 LangChain 高层组件。
- **可观测**：与 LangSmith 集成做 trace、评估与回归测试。

## 落地要点（实践）

- 先画数据流再选组件，避免「为了用框架而用框架」。
- 版本升级快，锁定依赖并阅读迁移说明。
- 生产环境关注：超时、重试、幂等与密钥管理。

## 常见坑

- 把过多逻辑塞进 prompt 字符串，难以测试与复用。
- 忽略检索质量，只堆叠链式调用。

## 延伸阅读

- [LangChain 官方文档](https://python.langchain.com/docs/introduction/)
- [LangGraph 文档（复杂 Agent 运行时）](https://langchain-ai.github.io/langgraph/)
