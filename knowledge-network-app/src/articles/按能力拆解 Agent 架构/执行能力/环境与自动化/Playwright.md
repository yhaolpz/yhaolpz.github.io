# Playwright

## 一句话定义

微软开源的**跨浏览器端到端测试与自动化**框架，API 现代，适合作为 Web Agent 的执行后端。

## 先理解什么（入门）

Playwright 支持 Chromium/WebKit/Firefox，内置自动等待、trace、视频录制。比旧式 Selenium 更少 flaky。

## 再理解什么（进阶）

- **Locator**：推荐 role/text/testId 定位，减少脆弱 XPath。
- **并行**：浏览器上下文隔离，适合多任务并行。
- **与 LLM**：可把 accessibility tree 摘要给模型做决策。

## 落地要点（实践）

- CI 里用 `--headed=false` 与资源限制。
- 失败自动附加 trace.zip 到工单。
- 与视觉回归快照区分用途（UI 测试 vs Agent）。

## 常见坑

- 在 CI 无 GPU 环境跑 WebGL 重页面超时。
- 多语言页面 locator 写死文案导致脆弱。

## 延伸阅读

- [Playwright 官方文档](https://playwright.dev)
