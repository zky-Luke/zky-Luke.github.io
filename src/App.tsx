import React, { useState, useEffect } from 'react';
import { NavTab } from './types';
import { ROADMAP_STAGES } from './data/roadmapData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { HomeView } from './components/HomeView';
import { RoadmapView } from './components/RoadmapView';
import { KnowledgeView } from './components/KnowledgeView';
import { ArticleDetailView } from './components/ArticleDetailView';
import { ProjectLabView } from './components/ProjectLabView';
import { ProgressView } from './components/ProgressView';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string>('art-agent-mcp-deep-dive');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // User persistent progress
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ai_lab_completed_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [];
  });

  const [readArticleIds, setReadArticleIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ai_lab_read_articles');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  const [bookmarkedArticleIds, setBookmarkedArticleIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ai_lab_bookmarked_articles');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('ai_lab_completed_tasks', JSON.stringify(completedTaskIds));
  }, [completedTaskIds]);

  useEffect(() => {
    localStorage.setItem('ai_lab_read_articles', JSON.stringify(readArticleIds));
  }, [readArticleIds]);

  useEffect(() => {
    localStorage.setItem('ai_lab_bookmarked_articles', JSON.stringify(bookmarkedArticleIds));
  }, [bookmarkedArticleIds]);

  const handleToggleTask = (taskId: string) => {
    setCompletedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleToggleReadArticle = (articleId: string) => {
    setReadArticleIds((prev) =>
      prev.includes(articleId) ? prev.filter((id) => id !== articleId) : [...prev, articleId]
    );
  };

  const handleToggleBookmarkArticle = (articleId: string) => {
    setBookmarkedArticleIds((prev) =>
      prev.includes(articleId) ? prev.filter((id) => id !== articleId) : [...prev, articleId]
    );
  };

  const handleSelectArticle = (articleId: string) => {
    setSelectedArticleId(articleId);
    setActiveTab('article-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate percentage
  const totalTasks = ROADMAP_STAGES.flatMap((s) => s.weeks.flatMap((w) => w.tasks)).length;
  const completedPercent = Math.round((completedTaskIds.length / Math.max(1, totalTasks)) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Sticky Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        completedPercent={completedPercent}
      />

      {/* Main Content View Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full">
        {activeTab === 'home' && (
          <HomeView
            setActiveTab={setActiveTab}
            onSelectArticle={handleSelectArticle}
            completedPercent={completedPercent}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapView
            setActiveTab={setActiveTab}
            onSelectArticle={handleSelectArticle}
            completedTaskIds={completedTaskIds}
            onToggleTask={handleToggleTask}
          />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeView
            setActiveTab={setActiveTab}
            onSelectArticle={handleSelectArticle}
            readArticleIds={readArticleIds}
          />
        )}

        {activeTab === 'article-detail' && (
          <ArticleDetailView
            articleId={selectedArticleId}
            setActiveTab={setActiveTab}
            onSelectArticle={handleSelectArticle}
            readArticleIds={readArticleIds}
            onToggleReadArticle={handleToggleReadArticle}
            bookmarkedArticleIds={bookmarkedArticleIds}
            onToggleBookmarkArticle={handleToggleBookmarkArticle}
          />
        )}

        {activeTab === 'project-lab' && (
          <ProjectLabView setActiveTab={setActiveTab} />
        )}

        {activeTab === 'progress' && (
          <ProgressView
            setActiveTab={setActiveTab}
            completedTaskIds={completedTaskIds}
            readArticleIds={readArticleIds}
            completedPercent={completedPercent}
          />
        )}
      </main>

      {/* Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        setActiveTab={setActiveTab}
        onSelectArticle={handleSelectArticle}
      />

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
