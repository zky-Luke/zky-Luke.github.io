export type NavTab = 'home' | 'roadmap' | 'knowledge' | 'article-detail' | 'project-lab' | 'progress';

export type CategoryType = 'all' | 'llm' | 'rag' | 'agent' | 'mcp' | 'devops';

export type DifficultyLevel = '入门' | '中级' | '高级';

export type ArticleReadStatus = '未读' | '已读' | '精读中';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface CodeSnippet {
  language: string;
  filename: string;
  code: string;
  description?: string;
}

export interface Article {
  id: string;
  title: string;
  category: CategoryType;
  categoryLabel: string;
  stageNumber: number;
  stageLabel: string;
  author: string;
  publishDate: string;
  readTime: string;
  difficulty: DifficultyLevel;
  tags: string[];
  summary: string;
  coverImage?: string;
  readStatus: ArticleReadStatus;
  content: string; // Markdown / HTML content
  toc: { id: string; title: string; level: number }[];
  codeSnippets?: CodeSnippet[];
  quiz?: QuizQuestion[];
  relatedArticleIds?: string[];
}

export interface WeeklyTask {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  isCompleted: boolean;
  type: 'theory' | 'hands-on' | 'architecture' | 'code';
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  goal: string;
  tasks: WeeklyTask[];
  projectTitle?: string;
  projectDescription?: string;
  keyConcepts: string[];
  articleIds: string[];
}

export interface RoadmapStage {
  id: number;
  title: string;
  weeksLabel: string;
  status: 'completed' | 'in_progress' | 'locked';
  subtitle: string;
  badge: string;
  description: string;
  weeks: RoadmapWeek[];
  colorTheme: string;
}

export interface ProjectLabItem {
  id: string;
  title: string;
  tag: string;
  difficulty: DifficultyLevel;
  estimatedHours: string;
  description: string;
  iconName: string;
  badge: string;
  features: string[];
  techStack: string[];
  demoType: 'chat' | 'rag' | 'research' | 'mcp';
}

export interface UserProgress {
  completedTaskIds: string[];
  readArticleIds: string[];
  bookmarkedArticleIds: string[];
  studyNotes: Record<string, string>;
  totalHoursSpent: number;
  currentStage: number;
  currentWeek: number;
}
