import React, { useState } from 'react';
import { Sparkles, FileText, CheckCircle2, Clock, RefreshCw, Copy, Check, ChevronRight } from 'lucide-react';

export const ResearchAssistantTool: React.FC = () => {
  const [topic, setTopic] = useState('MCP (Model Context Protocol) 协议架构与分布式 Agent 选型对比');
  const [depth, setDepth] = useState('deep');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleTopics = [
    'DeepSeek-V3 Multi-Head Latent Attention (MLA) 机制拆解',
    'MCP (Model Context Protocol) 协议架构与分布式 Agent 选型对比',
    'RAG 架构中 Cross-Encoder Reranking 模型性能瓶颈调优',
  ];

  const handleGenerateResearch = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setReport(null);

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, depth }),
      });

      const data = await response.json();
      setReport(data.report || '生成报告失败');
    } catch (error) {
      console.error('Research Error:', error);
      setReport('⚠️ 请求错误，请检查服务器 GEMINI_API_KEY 配置。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (report) {
      navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Topic Input Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <span>AI 自主研究主题设置</span>
          </div>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
            ReAct Agent 多轮任务分解
          </span>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            研究课题名称:
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="输入您希望研究的 AI 工程课题..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Quick Topics */}
        <div>
          <label className="text-xs text-slate-400 block mb-1.5">快速选择参考课题：</label>
          <div className="flex flex-wrap gap-2">
            {sampleTopics.map((t, idx) => (
              <button
                key={idx}
                onClick={() => setTopic(t)}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerateResearch}
          disabled={isLoading || !topic.trim()}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-all"
        >
          {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          <span>启动 ReAct Agent 深度研究报告合成</span>
        </button>
      </div>

      {/* Loading Execution Progress Indicator */}
      {isLoading && (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 dark:border-indigo-950 dark:bg-indigo-950/20 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <RefreshCw className="h-4 w-4 animate-spin text-indigo-600" />
            <span>Agent 正在执行自主研究工作流...</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-indigo-200 dark:bg-slate-900 dark:border-slate-800">
              <span className="font-bold text-indigo-600">Phase 1</span>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">Query Plan 分解</p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-indigo-200 dark:bg-slate-900 dark:border-slate-800">
              <span className="font-bold text-indigo-600">Phase 2</span>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">多源技术要点提取</p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-indigo-200 dark:bg-slate-900 dark:border-slate-800">
              <span className="font-bold text-indigo-600">Phase 3</span>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">代码实现编写</p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-indigo-200 dark:bg-slate-900 dark:border-slate-800">
              <span className="font-bold text-indigo-600">Phase 4</span>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">架构对比与报告生成</p>
            </div>
          </div>
        </div>
      )}

      {/* Generated Report Display */}
      {report && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">AI 研究报告成果</h3>
            </div>

            <button
              onClick={handleCopyReport}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-500">已复制报告</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>复制 Markdown 报告</span>
                </>
              )}
            </button>
          </div>

          <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans text-slate-800 dark:text-slate-200 bg-slate-50/50 p-6 rounded-xl border border-slate-100 dark:bg-slate-950/40 dark:border-slate-800/80">
            {report}
          </div>
        </div>
      )}
    </div>
  );
};
