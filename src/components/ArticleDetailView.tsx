import React, { useState } from 'react';
import { NavTab, Article } from '../types';
import { ARTICLES_DATA } from '../data/articlesData';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Bookmark,
  Share2,
  Copy,
  Check,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Code2,
} from 'lucide-react';

interface ArticleDetailViewProps {
  articleId: string;
  setActiveTab: (tab: NavTab) => void;
  onSelectArticle: (id: string) => void;
  readArticleIds: string[];
  onToggleReadArticle: (id: string) => void;
  bookmarkedArticleIds: string[];
  onToggleBookmarkArticle: (id: string) => void;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  articleId,
  setActiveTab,
  onSelectArticle,
  readArticleIds,
  onToggleReadArticle,
  bookmarkedArticleIds,
  onToggleBookmarkArticle,
}) => {
  const article = ARTICLES_DATA.find((a) => a.id === articleId) || ARTICLES_DATA[0];
  const [copiedSnippetIndex, setCopiedSnippetIndex] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  const isRead = readArticleIds.includes(article.id);
  const isBookmarked = bookmarkedArticleIds.includes(article.id);

  // Find next and prev articles
  const currentIndex = ARTICLES_DATA.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? ARTICLES_DATA[currentIndex - 1] : null;
  const nextArticle = currentIndex < ARTICLES_DATA.length - 1 ? ARTICLES_DATA[currentIndex + 1] : null;

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetIndex(index);
    setTimeout(() => setCopiedSnippetIndex(null), 2000);
  };

  const handleQuizOptionSelect = (qId: string, optionIdx: number) => {
    if (quizSubmitted[qId]) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitQuiz = (qId: string) => {
    setQuizSubmitted((prev) => ({ ...prev, [qId]: true }));
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Nav Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('knowledge')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>返回知识库列表</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleBookmarkArticle(article.id)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
              isBookmarked
                ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-indigo-600' : ''}`} />
            <span>{isBookmarked ? '已收藏' : '收藏'}</span>
          </button>

          <button
            onClick={() => onToggleReadArticle(article.id)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              isRead
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{isRead ? '标记为未读' : '完成精读打卡'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left TOC Sticky Sidebar (1 Col) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
              文章目录
            </h3>
            <nav className="space-y-2 text-xs">
              {article.toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block py-1 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors line-clamp-1"
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Article Body (3 Cols) */}
        <div className="lg:col-span-3 space-y-8">
          {/* Article Header Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-indigo-50 px-3 py-1 font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {article.stageLabel}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                难度: {article.difficulty}
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {article.readTime}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {article.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-2 border-indigo-500 pl-3">
              {article.summary}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {article.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="rounded-md bg-slate-50 border border-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800/60 dark:border-slate-700/60 dark:text-slate-400"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Article Formatted Text Render */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 space-y-6 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 leading-relaxed text-sm sm:text-base">
            <div className="prose dark:prose-invert max-w-none space-y-4">
              {article.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('## ')) {
                  const headingText = paragraph.replace('## ', '');
                  const headingId = article.toc[idx]?.id || `section-${idx}`;
                  return (
                    <h2
                      id={headingId}
                      key={idx}
                      className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pt-6 border-t border-slate-100 dark:border-slate-800 tracking-tight"
                    >
                      {headingText}
                    </h2>
                  );
                } else if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-base sm:text-lg font-bold text-slate-900 dark:text-white pt-2">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                } else if (paragraph.startsWith('- ')) {
                  const listItems = paragraph.split('\n');
                  return (
                    <ul key={idx} className="list-disc pl-5 space-y-1 my-2">
                      {listItems.map((li, lIdx) => (
                        <li key={lIdx} className="text-sm">
                          {li.replace('- ', '')}
                        </li>
                      ))}
                    </ul>
                  );
                } else {
                  return (
                    <p key={idx} className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                }
              })}
            </div>

            {/* Code Snippets Section */}
            {article.codeSnippets && article.codeSnippets.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-indigo-500" />
                  实战示例代码
                </h3>

                {article.codeSnippets.map((snippet, sIdx) => (
                  <div
                    key={sIdx}
                    className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 shadow-lg"
                  >
                    <div className="flex items-center justify-between bg-slate-900 px-4 py-2.5 text-xs border-b border-slate-800">
                      <span className="font-mono text-indigo-400 font-semibold">{snippet.filename}</span>
                      <button
                        onClick={() => handleCopyCode(snippet.code, sIdx)}
                        className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-700 transition-colors"
                      >
                        {copiedSnippetIndex === sIdx ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-emerald-400">已复制</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>复制代码</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-indigo-100">
                      <code>{snippet.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            )}

            {/* Interactive Practice Quiz Section */}
            {article.quiz && article.quiz.length > 0 && (
              <div className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6 dark:border-indigo-900/60 dark:bg-indigo-950/30 space-y-6">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-base">
                  <HelpCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <span>🎯 课后实践自测</span>
                </div>

                {article.quiz.map((q) => {
                  const userAns = selectedAnswers[q.id];
                  const isSubmitted = quizSubmitted[q.id];
                  const isCorrect = userAns === q.correctAnswer;

                  return (
                    <div
                      key={q.id}
                      className="rounded-xl border border-indigo-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4"
                    >
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{q.question}</h4>

                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = userAns === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleQuizOptionSelect(q.id, optIdx)}
                              className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                                isSelected
                                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                                  : 'border-slate-200 hover:border-slate-300 dark:border-slate-800'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}. {opt}
                            </button>
                          );
                        })}
                      </div>

                      {userAns !== undefined && !isSubmitted && (
                        <button
                          onClick={() => handleSubmitQuiz(q.id)}
                          className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
                        >
                          提交校验答案
                        </button>
                      )}

                      {isSubmitted && (
                        <div
                          className={`p-3 rounded-xl text-xs font-medium ${
                            isCorrect
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-900 dark:text-emerald-300'
                              : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-300'
                          }`}
                        >
                          <div className="font-bold mb-1">
                            {isCorrect ? '✅ 回答正确！' : '❌ 校验未通过'}
                          </div>
                          <p>{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Next / Prev Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevArticle ? (
              <button
                onClick={() => onSelectArticle(prevArticle.id)}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 text-left transition-all dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <ChevronLeft className="h-3.5 w-3.5" /> 上一篇文章
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white mt-1 line-clamp-1">
                  {prevArticle.title}
                </div>
              </button>
            ) : <div />}

            {nextArticle && (
              <button
                onClick={() => onSelectArticle(nextArticle.id)}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 text-right transition-all dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-end gap-1">
                  下一篇文章 <ChevronRight className="h-3.5 w-3.5" />
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white mt-1 line-clamp-1">
                  {nextArticle.title}
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
