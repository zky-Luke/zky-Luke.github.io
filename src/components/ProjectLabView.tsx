import React, { useState } from 'react';
import { NavTab } from '../types';
import { PROJECTS_DATA } from '../data/projectsData';
import { StreamingChatTool } from './tools/StreamingChatTool';
import { RagSimulatorTool } from './tools/RagSimulatorTool';
import { ResearchAssistantTool } from './tools/ResearchAssistantTool';
import { McpInspectorTool } from './tools/McpInspectorTool';
import {
  FlaskConical,
  MessageSquareText,
  Database,
  Sparkles,
  Cpu,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ProjectLabViewProps {
  setActiveTab: (tab: NavTab) => void;
}

export const ProjectLabView: React.FC<ProjectLabViewProps> = ({ setActiveTab }) => {
  const [activeLabId, setActiveLabId] = useState<string>('proj-stream-chat');

  const labTools = [
    {
      id: 'proj-stream-chat',
      title: '流式 AI 聊天应用',
      tag: 'LLM & SSE 流式',
      icon: MessageSquareText,
      component: StreamingChatTool,
    },
    {
      id: 'proj-personal-rag',
      title: '个人 RAG 知识库',
      tag: '向量 + RAG',
      icon: Database,
      component: RagSimulatorTool,
    },
    {
      id: 'proj-research-assistant',
      title: 'AI 自主研究助手',
      tag: 'ReAct Agent',
      icon: Sparkles,
      component: ResearchAssistantTool,
    },
    {
      id: 'proj-mcp-lab',
      title: 'MCP 工具实验室',
      tag: 'MCP Protocol',
      icon: Cpu,
      component: McpInspectorTool,
    },
  ];

  const activeToolObj = labTools.find((t) => t.id === activeLabId) || labTools[0];
  const ActiveComponent = activeToolObj.component;

  return (
    <div className="space-y-8 pb-16">
      {/* Lab Header Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <FlaskConical className="h-3.5 w-3.5 text-emerald-500" />
              AI 工程交互式实战实验室
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl tracking-tight">
              核心项目极客测试台
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              直接在浏览器中体验真实 SSE 流式打字机、向量切块相似度匹配、ReAct Agent 自主推理研究报告，以及 MCP Protocol 报文抓包调试。
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-2 text-xs font-bold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              <span>全量 Gemini 3.6 Flash 原生驱动</span>
            </span>
          </div>
        </div>

        {/* Interactive Lab Tabs */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
          {labTools.map((tool) => {
            const Icon = tool.icon;
            const isSelected = tool.id === activeLabId;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveLabId(tool.id)}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'border-slate-200 bg-slate-50/80 text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {tool.tag}
                  </span>
                </div>
                <div className="font-bold text-xs sm:text-sm">{tool.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Lab Component Render */}
      <div className="space-y-4">
        <ActiveComponent />
      </div>
    </div>
  );
};
