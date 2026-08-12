import React, { useState, useEffect } from 'react';
import { NavTab } from '../types';
import { ROADMAP_STAGES } from '../data/roadmapData';
import { ARTICLES_DATA } from '../data/articlesData';
import {
  BarChart2,
  CheckCircle2,
  BookOpen,
  Clock,
  Sparkles,
  Flame,
  Award,
  Edit3,
  Save,
  Trash2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ProgressViewProps {
  setActiveTab: (tab: NavTab) => void;
  completedTaskIds: string[];
  readArticleIds: string[];
  completedPercent: number;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  setActiveTab,
  completedTaskIds,
  readArticleIds,
  completedPercent,
}) => {
  const [studyNotes, setStudyNotes] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);

  const [streakDays, setStreakDays] = useState<number>(1);

  useEffect(() => {
    const savedNotes = localStorage.getItem('ai_lab_study_notes');
    if (savedNotes) setStudyNotes(savedNotes);

    // Calculate dynamic visit streak
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const savedVisits = localStorage.getItem('ai_lab_visit_dates');
      let visitDates: string[] = savedVisits ? JSON.parse(savedVisits) : [];
      
      if (!visitDates.includes(todayStr)) {
        visitDates.push(todayStr);
        visitDates.sort();
        localStorage.setItem('ai_lab_visit_dates', JSON.stringify(visitDates));
      }

      // Calculate streak ending today or yesterday
      let streak = 0;
      let checkDate = new Date();
      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (visitDates.includes(dateStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      setStreakDays(Math.max(1, streak));
    } catch {
      setStreakDays(1);
    }
  }, []);

  const handleSaveNotes = () => {
    localStorage.setItem('ai_lab_study_notes', studyNotes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const allTasks = ROADMAP_STAGES.flatMap((s) => s.weeks.flatMap((w) => w.tasks));
  const totalTasks = allTasks.length;

  const totalCompletedHours = allTasks
    .filter((task) => completedTaskIds.includes(task.id))
    .reduce((sum, task) => sum + (task.estimatedHours || 0), 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <BarChart2 className="h-3.5 w-3.5 text-emerald-500" />
              个人 AI 工程成长看板
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl tracking-tight">
              学习进度与架构笔记
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              跟踪您的 12 周打卡任务、知识库精读覆盖率，并记录个人工程实践心得与架构总结。
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
              <Flame className="h-5 w-5 text-amber-500 fill-amber-500" />
              <div>
                <div className="text-xs font-bold">连续打卡 {streakDays} 天</div>
                <div className="text-[10px] opacity-80">保持沉浸式工程思考</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-800/60 dark:border-slate-800">
            <div className="text-xs text-slate-500 font-medium">总体打卡完成度</div>
            <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
              {completedPercent}%
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-800/60 dark:border-slate-800">
            <div className="text-xs text-slate-500 font-medium">已打卡周工程 Task</div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {completedTaskIds.length} / {totalTasks}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-800/60 dark:border-slate-800">
            <div className="text-xs text-slate-500 font-medium">精读文章数量</div>
            <div className="text-2xl font-extrabold text-violet-600 dark:text-violet-400 mt-1">
              {readArticleIds.length} / {ARTICLES_DATA.length}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-800/60 dark:border-slate-800">
            <div className="text-xs text-slate-500 font-medium">预计累计学时</div>
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
              {totalCompletedHours} 小时
            </div>
          </div>
        </div>
      </div>

      {/* Stage Progress Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stage Progress List */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            4 大阶段打卡完成率
          </h3>

          <div className="space-y-4">
            {ROADMAP_STAGES.map((stage) => {
              const stageTasks = stage.weeks.flatMap((w) => w.tasks);
              const stageDoneTasks = stageTasks.filter((t) => completedTaskIds.includes(t.id)).length;
              const percent = Math.round((stageDoneTasks / Math.max(1, stageTasks.length)) * 100);

              return (
                <div key={stage.id} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-slate-200">{stage.title}</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{percent}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Study Notes Notepad */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                <Edit3 className="h-4 w-4 text-indigo-500" />
                <span>个人 AI 架构设计随手记</span>
              </div>
              {isSaved && <span className="text-xs text-emerald-600 font-bold">✓ 已保存笔记</span>}
            </div>

            <textarea
              value={studyNotes}
              onChange={(e) => setStudyNotes(e.target.value)}
              placeholder="在学习 RAG, Agent 或 MCP 过程中记录的架构心得、思考或关键避坑点..."
              rows={8}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white leading-relaxed font-mono"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={() => {
                setStudyNotes('');
                localStorage.removeItem('ai_lab_study_notes');
              }}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>清空笔记</span>
            </button>

            <button
              onClick={handleSaveNotes}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              <span>保存到本地</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
