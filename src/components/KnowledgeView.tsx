import React, { useState } from 'react';
import { NavTab, CategoryType, Article } from '../types';
import { ARTICLES_DATA } from '../data/articlesData';
import {
  BookOpen,
  Search,
  Filter,
  Clock,
  Sparkles,
  CheckCircle2,
  Bookmark,
  ArrowRight,
  Tag,
  Star,
  ChevronRight,
} from 'lucide-react';

interface KnowledgeViewProps {
  setActiveTab: (tab: NavTab) => void;
  onSelectArticle: (articleId: string) => void;
  readArticleIds: string[];
}

export const KnowledgeView: React.FC<KnowledgeViewProps> = ({
  setActiveTab,
  onSelectArticle,
  readArticleIds,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const categories: { id: CategoryType; label: string }[] = [
    { id: 'all', label: '全部文章' },
    { id: 'llm', label: 'LLM 基础' },
    { id: 'rag', label: 'RAG 工程化' },
    { id: 'agent', label: 'Agent & MCP' },
    { id: 'devops', label: 'AI 运维与 E2E' },
  ];

  const filteredArticles = ARTICLES_DATA.filter((art) => {
    // Category match
    if (selectedCategory !== 'all' && art.category !== selectedCategory) return false;
    // Difficulty match
    if (selectedDifficulty !== 'all' && art.difficulty !== selectedDifficulty) return false;
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = art.title.toLowerCase().includes(q);
      const matchSummary = art.summary.toLowerCase().includes(q);
      const matchTag = art.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchTag) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
              AI 工程知识库与深度架构解析
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl tracking-tight">
              系统化 AI 技术图谱与研读
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              涵盖系统 Prompt 设计、RAG 向量检索与重排、Agent 循环、MCP JSON-RPC 协议与 LangGraph 工作流实战全集。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
              共 {ARTICLES_DATA.length} 篇核心精读
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl dark:bg-slate-800/80">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input & Difficulty Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索文章标题或关键字..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <option value="all">所有难度等级</option>
              <option value="入门">入门 (Beginner)</option>
              <option value="中级">中级 (Intermediate)</option>
              <option value="高级">高级 (Advanced)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Article Cards Grid (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          {filteredArticles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
              <BookOpen className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
              <h3 className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-300">未找到相关技术文章</h3>
              <p className="mt-1 text-xs text-slate-400">建议清空搜索条件或切换全部分类重试</p>
            </div>
          ) : (
            filteredArticles.map((article) => {
              const isRead = readArticleIds.includes(article.id);
              return (
                <div
                  key={article.id}
                  onClick={() => onSelectArticle(article.id)}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 cursor-pointer flex flex-col sm:flex-row justify-between gap-6"
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {article.stageLabel}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        {article.difficulty}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {article.readTime}
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {article.title}
                    </h2>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {article.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-slate-50 border border-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800/60 dark:border-slate-700/60 dark:text-slate-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-6">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        isRead
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {isRead ? <CheckCircle2 className="h-3 w-3" /> : <Star className="h-3 w-3" />}
                      <span>{isRead ? '已阅读' : '推荐精读'}</span>
                    </span>

                    <button className="flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform dark:text-indigo-400 mt-auto">
                      <span>阅读全文</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">阅读进展统计</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600 dark:text-slate-400">精读覆盖率</span>
                <span className="text-indigo-600 font-bold dark:text-indigo-400">
                  {readArticleIds.length} / {ARTICLES_DATA.length} 篇
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all"
                  style={{
                    width: `${Math.round((readArticleIds.length / ARTICLES_DATA.length) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Quick Lab Links Card */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/30 space-y-3">
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">
              理论 &rarr; 实战演练
            </span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              边读文章，边在实验室调测 MCP 与 Agent
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              文章配套真实可运行的 JSON-RPC 报文抓包与 Gemini API 流式调用。
            </p>
            <button
              onClick={() => setActiveTab('project-lab')}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <span>前往项目实验室</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
