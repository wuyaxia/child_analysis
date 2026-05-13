// 基础类型定义
export interface ChildProfile {
  id: string;
  name: string;
  birthDate: string;
  gender: 'boy' | 'girl';
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
  source?: '中国卫健委' | '美国儿科学会' | '通用';
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

export interface Review {
  id: string;
  title: string;
  age: string;
  date: string;
  problems: string[];
  improvements: string[];
  notes?: string;
  createdAt: string;
}

export interface GrowthMeasurement {
  id: string;
  date: string;
  ageMonths: number;
  height: number; // 厘米
  weight: number; // 千克
  headCircumference?: number; // 头围，厘米，仅用于3岁以下
  createdAt: string;
}

export interface GrowthCurveData {
  ageMonths: number;
  p3: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  p97: number;
}
