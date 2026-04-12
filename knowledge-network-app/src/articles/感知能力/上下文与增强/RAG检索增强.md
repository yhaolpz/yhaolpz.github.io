# RAG检索增强

## 一句话定义

在生成前从外部知识库**检索相关片段**作为条件，缓解模型知识截止与幻觉，是 Agent「接地」的主流手段之一。

## 先理解什么（入门）

RAG = Retrieval + Augmented + Generation：先查后答。与微调相比，更适合**频繁变更的文档**（制度、产品说明、内部 wiki）。

## 再理解什么（进阶）

- **索引管线**：加载 → 切分 → 嵌入 → 存储；每步都有质量瓶颈。
- **查询改写**：多轮对话里要把「它」「上面那个」解析成可检索的独立查询。
- **重排序（rerank）**：向量召回 TopK 后再用小模型精排，提高精度。

## 落地要点（实践）

- 评估要同时看：召回率、答案忠实度、引用正确率。
- 对表格/代码类文档选合适切块与元数据。
- 线上灰度：对比「无 RAG / 有 RAG」的用户满意度与错误工单。

## 常见坑

- 检索到相似但错误的段落，模型会「自信地胡说」。
- 不做权限过滤，跨用户数据泄露。

## 延伸阅读

- [LangChain：RAG tutorial](https://python.langchain.com/docs/tutorials/rag)
- [LlamaIndex：检索与查询](https://docs.llamaindex.ai/en/stable/module_guides/querying/)
