# OCR与文档解析

## 一句话定义

把扫描件、PDF、截图中的文字与版面结构识别出来，变成可检索、可引用的**纯文本与结构化块**。

## 先理解什么（入门）

OCR 是「像素 → 字符」；文档解析还要处理**表格、标题层级、页眉页脚、多栏排版**。Agent 场景里常见目标是：问答、比对合同条款、从报表抽字段。

## 再理解什么（进阶）

- **版面分析**：先检测段落/表格/图注，再 OCR，比整页当一张图识别更准。
- **后处理**：词典纠错、数字格式、中英文混排。
- **与 RAG 结合**：按段落或表格行切块建索引，检索时带回坐标便于高亮。

## 落地要点（实践）

- 区分「可复制 PDF」与「扫描件」：前者可直接抽文本，不必上重型 OCR。
- 对表格优先保留行列结构（Markdown/HTML），避免落成乱序纯文本。
- 评估指标：字符错误率、表格 F1、端到端问答命中率。

## 常见坑

- 忽略旋转、水印、印章导致整段识别失败。
- OCR 结果不做清洗直接入库，噪声会污染检索。

## 延伸阅读

- [Tesseract OCR（开源）](https://github.com/tesseract-ocr/tesseract)
- [Azure AI Document Intelligence](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/overview)
