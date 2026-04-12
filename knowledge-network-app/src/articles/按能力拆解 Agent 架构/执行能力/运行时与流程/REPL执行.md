# REPL执行

## 一句话定义

在**交互式解释器**中逐条执行代码并立即返回结果，适合快速验证、调试与短脚本 Agent。

## 先理解什么（入门）

REPL（Read-Eval-Print Loop）延迟低，但状态持续累积。与 notebook 类似需注意命名空间污染。

## 再理解什么（进阶）

- **与沙箱结合**：REPL 进程仍要在隔离环境。
- **多语言**：`python` / `node` / `sqlite` REPL 各有绑定成本。
- **会话重置**：每任务 `reset` 防变量泄漏。

## 落地要点（实践）

- 捕获 stdout/stderr 长度上限。
- 对 `import os` 等敏感模块黑名单或替换。
- 超时 kill 整个 REPL 进程树。

## 常见坑

- 长驻 REPL 被多用户复用导致数据串味。
- 未限制 `while True` 占满 CPU。

## 延伸阅读

- [Python REPL 文档](https://docs.python.org/3/tutorial/interpreter.html)
