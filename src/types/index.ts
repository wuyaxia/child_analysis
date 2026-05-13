// 基础类型定义
export interface ChildProfile {
  id: string;
  name: string;
  birthDate: string;
  avatar?: string;
}

export interface GrowthRecord {
  id: string;
  date: string;
  type: 'daily' | 'milestone' | 'emotion' | 'skill';
  content: string;
  photos?: string[];
  tags?: string[];
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: 'routine' | 'activity' | 'study' | 'exercise';
  frequency: 'daily' | 'weekly' | 'once';
  completedDates: string[];
  createdAt: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  ageGroup: '3' | '4' | '5' | '6';
  category: string[];
  tags: string[];
  isFavorite: boolean;
  readProgress?: number;
  createdAt: string;
}

export interface EmotionRecord {
  id: string;
  date: string;
  emotion: 'happy' | 'calm' | 'excited' | 'frustrated' | 'sad' | 'angry';
  trigger?: string;
  response?: string;
  notes?: string;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  description?: string;
  category: 'language' | 'motor' | 'social' | 'cognitive';
}
