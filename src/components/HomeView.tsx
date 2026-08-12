import React from 'react';
import { NavTab, Article } from '../types';
import { ROADMAP_STAGES } from '../data/roadmapData';
import { PROJECTS_DATA } from '../data/projectsData';
import { ARTICLES_DATA } from '../data/articlesData';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  FlaskConical,
  Clock,
  Zap,
  Layers,
  Code2,
  Cpu,
  ChevronRight,
  ShieldCheck,
  Star,
} from 'lucide-react';

interface HomeViewProps {
  setActiveTab: (tab: NavTab) => void;
  onSelectArticle: (articleId: string) => void;
  completedPercent: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  onSelectArticle,
  completedPercent,
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl p-8 sm:p-12 lg:p-16 border border-slate-800">
        {/* Background decorative elements */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>2025 全新实战课程 · LLM / RAG / Agent / MCP 全栈交付</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 leading-tight">
            12 周 AI 工程师成长路径
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
            从 Token 原理与 Prompt 工程切入，深攻 RAG 向量检索工程化，沉淀 ReAct 智能体与 MCP 统一协议规范，最终达成全栈 AI 应用 E2E 上线。
          </p>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80 max-w-3xl">
            <div>
              <div className="text-2xl font-bold text-white">12 周</div>
              <div className="text-xs text-slate-400">系统化深度路线</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-400">4 大</div>
              <div className="text-xs text-slate-400">核心演进阶段</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">6+</div>
              <div className="text-xs text-slate-400">工业级实战项目</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">100%</div>
              <div className="text-xs text-slate-400">全栈 TypeScript/Python</div>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              id="hero-start-learning-btn"
              onClick={() => setActiveTab('roadmap')}
              className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:brightness-110 active:scale-98 transition-all"
            >
              <span>进入 12 周学习路线</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              id="hero-project-lab-btn"
              onClick={() => setActiveTab('project-lab')}
              className="flex items-center gap-2.5 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all backdrop-blur-md"
            >
              <FlaskConical className="h-4 w-4 text-emerald-400" />
              <span>体验项目实验室</span>
            </button>
          </div>
        </div>
      </section>

      {/* Floating Progress Tracker Banner */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 dark:border-indigo-950 dark:bg-indigo-950/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                当前学习进度：Stage 3 - Agent 与 MCP 工作原理
              </span>
              <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-bold text-white">
                {completedPercent}% 完成
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              下一关键主线：ReAct 架构、MCP Protocol 服务器编写与工具调用调试
            </p>
          </div>
        </div>

        <button
          id="progress-banner-continue-btn"
          onClick={() => setActiveTab('roadmap')}
          className="shrink-0 flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-indigo-600 shadow-sm border border-slate-200 hover:bg-indigo-50 transition-colors dark:bg-slate-900 dark:border-slate-700 dark:text-indigo-400"
        >
          <span>继续第 8 周任务</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* 4 Stages Overview Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
              CURRICULUM STAGES
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-3xl mt-1">
              4 大阶段架构演进
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('roadmap')}
            className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400 flex items-center gap-1"
          >
            查看 12 周完整大纲 <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROADMAP_STAGES.map((stage) => {
            const isCurrent = stage.status === 'in_progress';
            return (
              <div
                key={stage.id}
                onClick={() => setActiveTab('roadmap')}
                className={`group relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? 'border-indigo-500 bg-white shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/20 dark:bg-slate-900 dark:border-indigo-500'
                    : 'border-slate-200 bg-white/80 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {stage.weeksLabel}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        stage.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : stage.status === 'in_progress'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                      }`}
                    >
                      {stage.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {stage.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {stage.subtitle}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>{stage.weeks.length} 个核心周主线</span>
                  <ArrowRight className="h-4 w-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Projects Bento Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
              HANDS-ON LABS
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-3xl mt-1">
              核心实战实验室项目
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('project-lab')}
            className="text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400 flex items-center gap-1"
          >
            在实验室直接测试 <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS_DATA.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setActiveTab('project-lab')}
              className="group relative rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:border-emerald-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {proj.badge}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {proj.estimatedHours}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {proj.title}
                </h3>

                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {proj.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {proj.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <Zap className="h-3 w-3 text-emerald-500" />
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>运行在线 Lab 示范</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Knowledge Base Articles */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
              DEEP ARTICLES
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-3xl mt-1">
              知识库核心精读
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('knowledge')}
            className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400 flex items-center gap-1"
          >
            浏览所有文章库 <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES_DATA.map((art) => (
            <div
              key={art.id}
              onClick={() => onSelectArticle(art.id)}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-indigo-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {art.stageLabel}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {art.readTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {art.title}
                </h3>

                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-500">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  <span>{art.difficulty} 难度</span>
                </div>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  阅读文章 <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
