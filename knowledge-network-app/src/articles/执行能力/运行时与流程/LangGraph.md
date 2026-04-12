# LangGraph

## 一句话定义

LangChain 生态中的**图式 Agent 运行时**：以节点为计算单元、边为控制流，支持循环、分支、检查点与人机协同。

## 先理解什么（入门）

适合「需要多轮、可能失败重试、要暂停等人」的流程。比线性 Chain 更贴近真实生产。

## 再理解什么（进阶）

- **Checkpointing**：持久化状态，支持回放与时间旅行调试。
- **Human-in-the-loop**：在边上挂中断与恢复。
- **与 LangChain Runnable**：可组合，渐进迁移。

## 落地要点（实践）

- 先画状态图再编码，避免边漏检。
- 为每条边设超时与错误边。
- 与 LangSmith 集成观测。

## 常见坑

- 图过于复杂难维护，应拆子图。
- 无限制循环无熔断。

## 延伸阅读

- [LangGraph 文档](https://docs.langchain.com/oss/python/langgraph/overview)
