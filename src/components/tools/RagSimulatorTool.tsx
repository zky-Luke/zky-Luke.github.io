import React, { useState } from 'react';
import { Database, Scissors, Search, Sparkles, CheckCircle2, Layers, RefreshCw } from 'lucide-react';

export const RagSimulatorTool: React.FC = () => {
  const [docContent, setDocContent] = useState<string>(
    `Model Context Protocol (MCP) 是 Anthropic 发布的统一大模型通信协议规范。MCP 通过标准 JSON-RPC 2.0 报文，将 Client (如 Claude Desktop) 与 Server (工具、资源、提示词) 解耦。\n\nRAG (Retrieval-Augmented Generation) 架构中，文本切块 (Chunking) 是向量检索召回率的关键。最常用的是 Recursive Character Splitter 递归分词，重叠 overlap 设置为 10%-15% 可以保持切块间的连续上下文。\n\nHybrid Search 混合检索结合了向量余弦相似度 (Dense Vector) 与关键词 BM25 (Sparse)，利用 Reciprocal Rank Fusion (RRF) 算法融合排名，显著提升对特定产品 ID 和术语的命中率。`
  );
  const [chunkSize, setChunkSize] = useState<number>(200);
  const [query, setQuery] = useState<string>('MCP 协议和 RAG 切块 overlap 是多少？');
  const [isLoading, setIsLoading] = useState(false);
  const [ragResult, setRagResult] = useState<any>(null);

  const handleSimulateRAG = async () => {
    if (!query.trim()) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/rag/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          documents: [{ name: 'AI工程实战手册.txt', content: docContent }],
          chunkSize,
          topK: 3,
        }),
      });

      const data = await response.json();
      setRagResult(data);
    } catch (error) {
      console.error('RAG Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document & Chunking Config */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
              <Database className="h-4 w-4 text-emerald-500" />
              <span>知识库原始文本输入</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">{docContent.length} 字符</span>
          </div>

          <textarea
            value={docContent}
            onChange={(e) => setDocContent(e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono leading-relaxed"
          />

          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                <Scissors className="h-3.5 w-3.5 text-emerald-500" />
                <span>Chunk Size (切块大小): {chunkSize} 字符</span>
              </label>
              <input
                type="range"
                min={80}
                max={400}
                step={20}
                value={chunkSize}
                onChange={(e) => setChunkSize(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Search Query Input */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              <Search className="h-4 w-4 text-emerald-500" />
              <span>向量 + 关键词 RAG 检索交互</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                提问 Query:
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="例如: MCP 的通信标准是什么？"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-medium"
              />
            </div>
          </div>

          <button
            onClick={handleSimulateRAG}
            disabled={isLoading || !query.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50 transition-all"
          >
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span>执行 Chunk 切块检索与 LLM 合成</span>
          </button>
        </div>
      </div>

      {/* RAG Results Display */}
      {ragResult && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-950 dark:bg-emerald-950/20">
              <div className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">生成 Chunk 分块</div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                {ragResult.chunksCount} 个片段
              </div>
            </div>
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-950 dark:bg-indigo-950/20">
              <div className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold">召回 Top-K 引用</div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                {ragResult.retrievedChunks?.length || 0} 个最相关片段
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="text-xs text-slate-500 font-semibold">相似度评分范围</div>
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {ragResult.retrievedChunks?.[0]?.score || '0.90+'} Cosine
              </div>
            </div>
          </div>

          {/* Retrieved Chunks Visual Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-emerald-500" />
              检索到的片段 (Retrieved Context Chunks)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ragResult.retrievedChunks?.map((chunk: any, idx: number) => (
                <div
                  key={chunk.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      [引用片段 {idx + 1}]
                    </span>
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      匹配度: {chunk.score}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-4 font-mono leading-relaxed">
                    {chunk.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Synthesized Answer Box */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 dark:border-emerald-900/60 dark:bg-emerald-950/30 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>RAG 基于检索上下文合成的回答：</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal whitespace-pre-wrap">
              {ragResult.answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
