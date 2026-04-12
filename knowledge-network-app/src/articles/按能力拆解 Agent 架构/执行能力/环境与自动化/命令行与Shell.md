# 命令行与Shell

## 一句话定义

在受控环境中执行 shell 命令，用于**仓库操作、脚本、运维诊断**等，是 coding agent 与 DevOps agent 的基础能力。

## 先理解什么（入门）

Shell 威力大、风险高。必须默认白名单命令、工作目录沙箱、禁止任意管道外泄秘密。

## 再理解什么（进阶）

- **TTY 与交互**：部分命令需伪终端；非交互 flag（如 `DEBIAN_FRONTEND=noninteractive`）。
- **输出截断**：`tail`/`head` 防止把巨量日志塞进模型。
- **跨平台**：Windows cmd/PowerShell 与 POSIX 差异。

## 落地要点（实践）

- 用最小权限 OS 用户跑 shell。
- 记录 argv 与 cwd 审计。
- 对 `rm -rf /` 类模式做静态拦截。

## 常见坑

- 拼接字符串命令导致注入。
- 长时间运行任务无超时拖死 worker。

## 延伸阅读

- [OWASP：Command Injection](https://owasp.org/www-community/attacks/Command_Injection)
