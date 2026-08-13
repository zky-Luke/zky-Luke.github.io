import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { createOpenRouterClient, OPENROUTER_MODEL, parseOpenRouterSseEvent, type ChatMessage } from "./src/server/openrouter.js";

dotenv.config();

// Initialize OpenRouter Client safely
const getOpenRouterClient = () => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.warn("OPENROUTER_API_KEY is not set in environment variables.");
    return null;
  }
  return createOpenRouterClient(apiKey);
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
  });

  app.use(express.json({ limit: "10mb" }));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 1. Streaming / Standard Chat Endpoint with OpenRouter Ling 2.6 Flash
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, systemInstruction, temperature = 0.7, stream = true } = req.body;
      const ai = getOpenRouterClient();

      if (!ai) {
        return res.status(500).json({
          error: "OPENROUTER_API_KEY Missing",
          message: "请在 Secrets 面板配置 OPENROUTER_API_KEY",
        });
      }

      const formattedMessages: ChatMessage[] = messages.map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }));

      if (stream) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const responseStream = await ai.generateTextStream({
          messages: formattedMessages,
          systemInstruction: systemInstruction || "你是一位专业的 AI 工程导师，擅长解答 LLM、RAG、Agent 和 MCP 相关的技术问题。语言简炼、逻辑清晰、输出高质量 Markdown。",
          temperature: Number(temperature),
        });

        if (!responseStream.body) throw new Error("OpenRouter returned an empty stream");
        const reader = responseStream.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n");
          buffer = events.pop() || "";
          for (const event of events) {
            const parsed = parseOpenRouterSseEvent(event);
            if (parsed.text) res.write(`data: ${JSON.stringify({ text: parsed.text })}\n\n`);
          }
        }
        res.write("data: [DONE]\n\n");
        res.end();
      } else {
        const text = await ai.generateText({
          messages: formattedMessages,
          systemInstruction: systemInstruction || "你是一位专业的 AI 工程导师，擅长解答 LLM、RAG、Agent 和 MCP 相关的技术问题。",
          temperature: Number(temperature),
        });

        res.json({ text });
      }
    } catch (error: any) {
      console.error("Chat Error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message || "Failed to generate AI chat response" });
      }
    }
  });

  // 2. AI Research Report Endpoint
  app.post("/api/research", async (req, res) => {
    try {
      const { topic, depth = "deep" } = req.body;
      const ai = getOpenRouterClient();

      if (!ai) {
        return res.status(500).json({
          error: "OPENROUTER_API_KEY Missing",
          message: "请配置 OPENROUTER_API_KEY 以生成研究报告",
        });
      }

      const prompt = `你是一个高级 AI 研究助手。请围绕以下主题，生成一份结构精密的深度研究报告：
【主题】: ${topic}
【深度级别】: ${depth}

请包含以下四大核心模块：
1. **研究规划 (Query Planning)**: 核心攻坚点与关键架构拆解
2. **技术原理解析 (Deep Dive)**: 核心机制、数学/逻辑原理与架构设计图示说明
3. **工程落地与代码实现 (Implementation)**: 完整、可运行的 Python/TypeScript 核心代码片段
4. **实践坑点与最佳实践 (Tradeoffs & Best Practices)**: 性能瓶颈、成本调优与选型建议

请使用 Markdown 格式渲染，结构分明，包含代码块与对比表格。`;

      const report = await ai.generateText({
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      });

      res.json({ report });
    } catch (error: any) {
      console.error("Research Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate research report" });
    }
  });

  // 3. RAG Search & QA Simulation Endpoint
  app.post("/api/rag/search", async (req, res) => {
    try {
      const { query, documents = [], chunkSize = 300, topK = 3 } = req.body;
      const ai = getOpenRouterClient();

      // Simple client side chunking simulation
      const chunks: { id: string; text: string; source: string; score: number }[] = [];
      documents.forEach((doc: { name: string; content: string }, docIdx: number) => {
        const text = doc.content;
        for (let i = 0; i < text.length; i += chunkSize) {
          const slice = text.slice(i, i + chunkSize);
          // Calculate rudimentary similarity score for preview demo
          const terms = query.toLowerCase().split(/\s+/);
          let matchCount = 0;
          terms.forEach((t: string) => {
            if (t && slice.toLowerCase().includes(t)) matchCount += 1;
          });
          const baseScore = Math.min(0.98, 0.45 + matchCount * 0.18 + Math.random() * 0.1);
          chunks.push({
            id: `chunk-${docIdx}-${i}`,
            text: slice,
            source: doc.name,
            score: Number(baseScore.toFixed(3)),
          });
        }
      });

      // Sort by score
      chunks.sort((a, b) => b.score - a.score);
      const retrievedChunks = chunks.slice(0, Number(topK));

      let ragAnswer = "";
      if (ai) {
        const contextText = retrievedChunks
          .map((c, idx) => `[引用文档 ${idx + 1}: ${c.source}]\n${c.text}`)
          .join("\n\n");

        const ragPrompt = `你是一个 RAG (检索增强生成) 问答系统。请仅依据以下【检索到的上下文】回答用户的【问题】。若上下文未提及，请明确说明。

【检索到的上下文】:
${contextText}

【用户问题】:
${query}

请在回答中标注引用来源，如 [引用文档 1]。`;

        ragAnswer = await ai.generateText({
          messages: [{ role: "user", content: ragPrompt }],
        });
      } else {
        ragAnswer = `[模拟 RAG 回答]: 根据检索到的 ${retrievedChunks.length} 个相关分块，关于 "${query}" 的回答已提取上下文。请配置 OPENROUTER_API_KEY 以体验实时 LLM 合成。`;
      }

      res.json({
        query,
        chunksCount: chunks.length,
        retrievedChunks,
        answer: ragAnswer,
      });
    } catch (error: any) {
      console.error("RAG Error:", error);
      res.status(500).json({ error: error.message || "Failed to execute RAG search" });
    }
  });

  // 4. MCP Simulator Endpoint
  app.post("/api/mcp/simulate", async (req, res) => {
    try {
      const { request } = req.body;
      const { jsonrpc = "2.0", method, params, id = 1 } = request || {};

      let responseResult: any = null;

      if (method === "tools/list") {
        responseResult = {
          tools: [
            {
              name: "calculate_token_cost",
              description: "计算指定 Token 数量和模型的预估调用成本",
              inputSchema: {
                type: "object",
                properties: {
                  model: { type: "string", description: `模型名称，如 ${OPENROUTER_MODEL}` },
                  inputTokens: { type: "number", description: "输入 Token 数量" },
                  outputTokens: { type: "number", description: "输出 Token 数量" },
                },
                required: ["model", "inputTokens", "outputTokens"],
              },
            },
            {
              name: "search_knowledge_base",
              description: "检索 AI 工程实战营知识库文章与最佳实践",
              inputSchema: {
                type: "object",
                properties: {
                  keyword: { type: "string", description: "搜索关键词" },
                },
                required: ["keyword"],
              },
            },
          ],
        };
      } else if (method === "tools/call") {
        const { name, arguments: args } = params || {};
        if (name === "calculate_token_cost") {
          const inCost = ((args.inputTokens || 0) / 1000000) * 0.075;
          const outCost = ((args.outputTokens || 0) / 1000000) * 0.30;
          responseResult = {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  model: args.model || OPENROUTER_MODEL,
                  inputTokens: args.inputTokens,
                  outputTokens: args.outputTokens,
                  estimatedCostUSD: `$${(inCost + outCost).toFixed(6)}`,
                  summary: `输入费用 $${inCost.toFixed(6)}, 输出费用 $${outCost.toFixed(6)}`,
                }, null, 2),
              },
            ],
          };
        } else if (name === "search_knowledge_base") {
          responseResult = {
            content: [
              {
                type: "text",
                text: `[MCP Tool Result]: 查找到关于 "${args.keyword}" 的 3 篇核心精读文章：《RAG 架构深度解析》、《MCP Protocol 规范与 Server 开发》、《System Prompt 结构化设计》。`,
              },
            ],
          };
        } else {
          responseResult = {
            content: [{ type: "text", text: `未知工具名称: ${name}` }],
            isError: true,
          };
        }
      } else if (method === "prompts/list") {
        responseResult = {
          prompts: [
            {
              name: "rag_system_prompt",
              description: "高鲁棒性 RAG 结构化 System Prompt 模板",
              arguments: [{ name: "domain", description: "业务领域" }],
            },
          ],
        };
      } else {
        responseResult = { message: `不支持的方法: ${method}` };
      }

      res.json({
        jsonrpc: "2.0",
        id,
        result: responseResult,
      });
    } catch (error: any) {
      console.error("MCP Error:", error);
      res.status(500).json({
        jsonrpc: "2.0",
        id: req.body?.request?.id || null,
        error: { code: -32603, message: error.message },
      });
    }
  });

  // Vite or Production Static Middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Engineering Lab Server listening on http://localhost:${PORT}/`);
  });
}

startServer();
