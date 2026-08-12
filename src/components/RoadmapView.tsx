import React, { useState } from 'react';
import { NavTab } from '../types';
import { ROADMAP_STAGES } from '../data/roadmapData';
import {
  CheckCircle2,
  Circle,
  Clock,
  Layers,
  Sparkles,
  BookOpen,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Code,
  Shield,
} from 'lucide-react';

interface RoadmapViewProps {
  setActiveTab: (tab: NavTab) => void;
  onSelectArticle: (articleId: string) => void;
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  setActiveTab,
  onSelectArticle,
  completedTaskIds,
  onToggleTask,
}) => {
  const [selectedStageId, setSelectedStageId] = useState<number>(3); // Default to Stage 3
  const [expandedWeekNumber, setExpandedWeekNumber] = useState<number | null>(7); // Default to Week 7

  const totalTasks = ROADMAP_STAGES.flatMap((s) => s.weeks.flatMap((w) => w.tasks)).length;
  const currentCompletedCount = completedTaskIds.length;
  const overallPercent = Math.round((currentCompletedCount / Math.max(1, totalTasks)) * 100);

  const activeStage = ROADMAP_STAGES.find((s) => s.id === selectedStageId) || ROADMAP_STAGES[2];

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              12 周 AI 工程师成长大纲
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl tracking-tight">
              从 LLM 基础到 Agent & MCP 全栈交付
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              结合理论推导、架构设计与工程落地的沉浸式路线图。点击阶段面板可切换，点击任务可打卡记录个人进度。
            </p>
          </div>

          {/* Overall Progress Gauge */}
          <div className="shrink-0 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50/50 p-5 dark:border-indigo-950 dark:from-indigo-950/40 dark:to-slate-900 min-w-[240px]">
            <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              <span>路线完成度</span>
              <span className="text-indigo-600 dark:text-indigo-400">{overallPercent}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              已完成 {currentCompletedCount} / {totalTasks} 个关键工程任务
            </p>
          </div>
        </div>

        {/* Stage Selector Tabs */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ROADMAP_STAGES.map((st) => {
            const isSelected = st.id === selectedStageId;
            const stageTasks = st.weeks.flatMap((w) => w.tasks);
            const stageDoneTasks = stageTasks.filter((t) => completedTaskIds.includes(t.id)).length;
            const stagePercent = stageTasks.length > 0 ? Math.round((stageDoneTasks / stageTasks.length) * 100) : 0;

            let badgeText = `${stagePercent}%`;
            if (stagePercent === 100) badgeText = '已完成 100%';
            else if (stagePercent > 0) badgeText = `进行中 ${stagePercent}%`;
            else badgeText = '未开始';

            return (
              <button
                key={st.id}
                onClick={() => setSelectedStageId(st.id)}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'border-slate-200 bg-slate-50/80 text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className={isSelected ? 'text-indigo-100' : 'text-slate-500'}>
                    {st.weeksLabel}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {badgeText}
                  </span>
                </div>
                <div className="font-extrabold text-sm line-clamp-1">{st.title.split(': ')[1] || st.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail Section */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {activeStage.weeksLabel}
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {activeStage.title}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {activeStage.description}
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {activeStage.weeks.length} 周聚焦进阶
              </span>
            </div>
          </div>

          {/* Weeks Accordion List */}
          <div className="mt-6 space-y-4">
            {activeStage.weeks.map((wk) => {
              const isExpanded = expandedWeekNumber === wk.weekNumber;
              const weekCompletedTasks = wk.tasks.filter(
                (t) => completedTaskIds.includes(t.id)
              ).length;
              const isWeekFullyDone = weekCompletedTasks === wk.tasks.length && wk.tasks.length > 0;

              return (
                <div
                  key={wk.weekNumber}
                  className={`rounded-2xl border transition-all ${
                    isExpanded
                      ? 'border-indigo-300 bg-white shadow-md dark:border-indigo-800 dark:bg-slate-900'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white dark:border-slate-800 dark:bg-slate-900/40'
                  }`}
                >
                  {/* Accordion Bar Header */}
                  <div
                    onClick={() => setExpandedWeekNumber(isExpanded ? null : wk.weekNumber)}
                    className="p-5 flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-extrabold ${
                          isWeekFullyDone
                            ? 'bg-emerald-500 text-white'
                            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}
                      >
                        W{wk.weekNumber}
                      </div>

                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          {wk.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          目标: {wk.goal}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                        打卡进度: {weekCompletedTasks}/{wk.tasks.length}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Body Content */}
                  {isExpanded && (
                    <div className="px-5 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-6">
                      {/* Key Concepts Tags */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          核心解析概念
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {wk.keyConcepts.map((concept, idx) => (
                            <span
                              key={idx}
                              className="rounded-lg bg-indigo-50 border border-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-900/60 dark:text-indigo-300"
                            >
                              #{concept}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Tasks Checklist */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          周任务打卡清单
                        </h4>
                        <div className="space-y-2">
                          {wk.tasks.map((task) => {
                            const isDone = completedTaskIds.includes(task.id);
                            return (
                              <div
                                key={task.id}
                                onClick={() => onToggleTask(task.id)}
                                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                                  isDone
                                    ? 'border-emerald-200 bg-emerald-50/40 text-slate-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-slate-300'
                                    : 'border-slate-200 bg-white hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-900'
                                }`}
                              >
                                <button className="mt-0.5 shrink-0">
                                  {isDone ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                                  )}
                                </button>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span
                                      className={`text-xs font-bold ${
                                        isDone
                                          ? 'line-through text-slate-400 dark:text-slate-500'
                                          : 'text-slate-900 dark:text-white'
                                      }`}
                                    >
                                      {task.title}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium">
                                      {task.estimatedHours} 小时
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {task.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Weekly Hands-on Project Reference */}
                      {wk.projectTitle && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">
                              本周核心实战
                            </span>
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                              {wk.projectTitle}
                            </h5>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                              {wk.projectDescription}
                            </p>
                          </div>
                          <button
                            onClick={() => setActiveTab('project-lab')}
                            className="shrink-0 flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                          >
                            <FlaskConical className="h-3.5 w-3.5" />
                            <span>前往实验室体验</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
