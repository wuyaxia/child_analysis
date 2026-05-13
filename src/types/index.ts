export type TaskCategory = 
  | 'routine'      // 规律作息
  | 'exercise'     // 运动锻炼
  | 'cognitive'    // 认知学习
  | 'social'       // 社交情感
  | 'selfcare'     // 生活自理
  | 'artistic'     // 艺术创意
  | 'safety';      // 安全意识

export type DifficultyLevel = 
  | 'easy'         // 初级 ⭐
  | 'medium'       // 中级 ⭐⭐
  | 'hard';        // 高级 ⭐⭐⭐

export type FamilyRole = 
  | 'father' 
  | 'mother' 
  | 'grandpa' 
  | 'grandma' 
  | 'other';

// ==================== Firebase 相关类型 ====================

export interface User {
  phone: string;
  familyId: string | null;
  currentMemberId: string | null;
  createdAt: string;
  lastLoginAt: string;
}

export interface FamilyMember {
  id: string;
  phone: string;
  role: FamilyRole;
  nickname: string;
  avatar?: string;
  joinedAt: string;
}

export interface Family {
  id: string;
  name: string;
  inviteCode: string;
  members: FamilyMember[];
  createdAt: string;
}

export interface Child {
  id: string;
  name: string;
  birthDate: string;
  gender: 'boy' | 'girl';
  avatar?: string;
  order: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== 原有类型（兼容 Firebase） ====================

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
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  difficulty: DifficultyLevel;
  ageRange: {
    min: number;
    max: number;
  };
  duration: number;
  knowledgeIds?: string[];
  frequency: 'daily' | 'weekly' | 'once';
  completedDates: string[];
  isCustom: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
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
  createdBy?: string;
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  description?: string;
  category: 'language' | 'motor' | 'social' | 'cognitive';
  createdBy?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  title: string;
  age: string;
  date: string;
  problems: string[];
  improvements: string[];
  notes?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GrowthMeasurement {
  id: string;
  date: string;
  ageMonths: number;
  height: number;
  weight: number;
  headCircumference?: number;
  createdBy?: string;
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
