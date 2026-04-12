# LlamaIndex

## 一句话定义

面向 **数据索引与检索** 的框架，强调把私域数据接进 LLM（常称「connect data to LLM」），适合 RAG 与知识型 Agent。

## 先理解什么（入门）

与泛用编排相比，LlamaIndex 在 **索引结构、查询引擎、路由** 上组件更丰富：同一批文档可建向量索引、关键词索引、知识图谱等，再由查询引擎选择策略。

## 再理解什么（进阶）

- **Index vs Retriever**：索引负责存与结构；检索器负责策略（top-k、rerank、hybrid）。
- **Router**：多数据源时按问题类型自动选择子引擎。
- **评估**：提供与下游评测工具结合的钩子，关注召回率与引用忠实度。

## 落地要点（实践）

- 切块（chunk）策略对问答影响极大，要与文档类型匹配。
- 大文档先分层摘要再细粒度检索，可降低噪声。
- 与 LlamaCloud 等托管服务结合时注意数据出境与合规。

## 常见坑

- 索引与业务权限不同步，检索到用户无权阅读的内容。
- 只建向量索引不做元数据过滤，跨部门文档会串味。

## 延伸阅读

- [LlamaIndex 官方文档](https://docs.llamaindex.ai/)
- [LlamaIndex：查询引擎概念](https://docs.llamaindex.ai/en/stable/understanding/querying/querying.html)