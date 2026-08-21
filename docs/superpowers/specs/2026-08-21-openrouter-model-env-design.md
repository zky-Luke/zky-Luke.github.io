# OpenRouter 模型环境变量配置设计

## 目标

允许通过 `OPENROUTER_MODEL` 环境变量配置 OpenRouter 模型，同时保留当前模型作为默认值，保证未新增环境变量时现有部署继续可用。

## 设计

- 后端统一从 `process.env.OPENROUTER_MODEL` 读取模型名。
- 环境变量为空或未设置时，回退到 `inclusionai/ling-2.6-flash`。
- 所有后端 OpenRouter 请求继续使用导出的 `OPENROUTER_MODEL` 常量，因此聊天、研究、RAG 和 MCP 模拟调用保持一致。
- `.env.example` 增加模型配置示例。
- 测试覆盖默认值和环境变量覆盖行为。

## 验证

运行 OpenRouter 单元测试和 TypeScript 类型检查，确认请求体使用环境变量指定的模型且未破坏现有行为。
