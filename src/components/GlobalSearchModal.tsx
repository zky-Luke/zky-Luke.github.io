import React, { useState, useEffect } from 'react';
import { NavTab, Article } from '../types';
import { ARTICLES_DATA } from '../data/articlesData';
import { PROJECTS_DATA } from '../data/projectsData';
import { Search, X, BookOpen, FlaskConical, MapPin, ArrowRight, CornerDownLeft } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: NavTab) => void;
  onSelectArticle: (articleId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  onSelectArticle,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open search modal
          const btn = document.getElementById('nav-search-btn');
          btn?.click();
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredArticles = ARTICLES_DATA.filter((art) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      art.title.toLowerCase().includes(q) ||
      art.summary.toLowerCase().includes(q) ||
      art.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const filteredProjects = PROJECTS_DATA.filter((p) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tag.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden dark:bg-slate-900 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input header */}
        <div className="relative flex items-center border-b border-slate-200 dark:border-slate-800 px-4 py-3.5">
          <Search className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章、实验项目、RAG、MCP、Prompt 等..."
            className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 outline-none dark:text-white"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6 divide-y divide-slate-100 dark:divide-slate-800/60">
          {/* Articles Section */}
          <div>
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                知识库精选文章 ({filteredArticles.length})
              </span>
            </div>
            {filteredArticles.length === 0 ? (
              <p className="text-xs text-slate-400 py-2 italic">无匹配文章</p>
            ) : (
              <div className="space-y-1 mt-1">
                {filteredArticles.map((art) => (
                  <button
                    key={art.id}
                    onClick={() => {
                      onSelectArticle(art.id);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/80 group flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {art.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {art.difficulty}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{art.summary}</p>
                    </div>
                    <CornerDownLeft className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-500 shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Projects Section */}
          <div className="pt-4">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FlaskConical className="h-3.5 w-3.5 text-emerald-500" />
                实战实验室项目 ({filteredProjects.length})
              </span>
            </div>
            {filteredProjects.length === 0 ? (
              <p className="text-xs text-slate-400 py-2 italic">无匹配实验项目</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {filteredProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveTab('project-lab');
                      onClose();
                    }}
                    className="text-left p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-emerald-900/60 dark:hover:bg-emerald-950/20 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {p.title}
                      </span>
                      <span className="text-[10px] font-medium text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-full dark:bg-emerald-950 dark:text-emerald-300">
                        {p.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">{p.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-400 dark:border-slate-800 dark:bg-slate-950">
          <span>提示：按下 ESC 退出搜索</span>
          <button
            onClick={() => {
              setActiveTab('roadmap');
              onClose();
            }}
            className="flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-400 font-medium"
          >
            <span>直接查看 12 周完整路线图</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
