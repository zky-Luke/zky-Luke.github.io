import React from 'react';
import { NavTab } from '../types';
import { Sparkles, Terminal, Code2, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">AI 工程实战营</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              聚焦 LLM 基础、RAG 工程化、Agent 智能体与 MCP 协议。帮助工程师建立从模型调用到生产交付的全栈 AI 系统能力。
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-400">
              <Terminal className="h-3.5 w-3.5" />
              <span>Powered by Gemini 3.6 Flash & @google/genai</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">学习路线 4 大阶段</h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <button onClick={() => setActiveTab('roadmap')} className="hover:text-white transition-colors">
                  Stage 1: LLM 基础与 Prompt 工程
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('roadmap')} className="hover:text-white transition-colors">
                  Stage 2: RAG 工程化与向量数据库
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('roadmap')} className="hover:text-white transition-colors">
                  Stage 3: Agent 智能体与 MCP 协议
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('roadmap')} className="hover:text-white transition-colors">
                  Stage 4: AI 全栈交付与 E2E 部署
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">实战实验室</h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <button onClick={() => setActiveTab('project-lab')} className="hover:text-white transition-colors">
                  流式 AI 聊天应用 (SSE)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('project-lab')} className="hover:text-white transition-colors">
                  个人 RAG 知识库与切块可视化
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('project-lab')} className="hover:text-white transition-colors">
                  AI 自主研究助手 (ReAct)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('project-lab')} className="hover:text-white transition-colors">
                  MCP 工具实验室 (JSON-RPC)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">系统交付质量</h3>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                <span>100% 工业级架构验证</span>
              </div>
              <p className="text-[11px] text-slate-400">
                代码均基于 TypeScript 与 Server-side 安全规范构建，包含完整的类型约束与异常拦截。
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2025 AI Engineering Lab. Built with React 19, Vite & Tailwind CSS.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted for AI Software Engineers with</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
