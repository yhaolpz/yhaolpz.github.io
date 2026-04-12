# Selenium

## 一句话定义

经典的浏览器自动化框架与 **WebDriver 协议**实现生态，广泛用于测试与部分 Web Agent 场景。

## 先理解什么（入门）

Selenium 历史悠久，语言绑定多。与 Playwright 相比，部分 API 更低层，需要更多显式等待与重试配置。

## 再理解什么（进阶）

- **Grid**：分布式执行多浏览器矩阵测试。
- **驱动版本**：浏览器与 driver 版本需严格匹配。
- **与 Agent**：可作为遗留系统兼容层，新系统可优先评估 Playwright。

## 落地要点（实践）

- 统一封装等待与重试，避免每个脚本复制粘贴。
- 用 Page Object 模式降低维护成本。
- 记录 session id 便于分布式调试。

## 常见坑

- `Thread.sleep` 硬等导致慢且仍 flaky。
- 多窗口句柄切换错误。

## 延伸阅读

- [Selenium 官方文档](https://www.selenium.dev/documentation/)
