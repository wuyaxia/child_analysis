import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ChildProfile, GrowthRecord, Task, KnowledgeArticle, EmotionRecord, Milestone } from '../types';

interface AppState {
  // 孩子资料
  childProfile: ChildProfile | null;
  setChildProfile: (profile: ChildProfile) => void;

  // 成长记录
  growthRecords: GrowthRecord[];
  addGrowthRecord: (record: GrowthRecord) => void;
  updateGrowthRecord: (id: string, record: Partial<GrowthRecord>) => void;
  deleteGrowthRecord: (id: string) => void;

  // 任务
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (taskId: string, date: string) => void;

  // 知识库
  knowledgeArticles: KnowledgeArticle[];
  toggleFavorite: (id: string) => void;
  updateReadProgress: (id: string, progress: number) => void;

  // 情绪记录
  emotionRecords: EmotionRecord[];
  addEmotionRecord: (record: EmotionRecord) => void;

  // 里程碑
  milestones: Milestone[];
  addMilestone: (milestone: Milestone) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // 孩子资料
      childProfile: null,
      setChildProfile: (profile) => set({ childProfile: profile }),

      // 成长记录
      growthRecords: [],
      addGrowthRecord: (record) =>
        set((state) => ({ growthRecords: [...state.growthRecords, record] })),
      updateGrowthRecord: (id, record) =>
        set((state) => ({
          growthRecords: state.growthRecords.map((r) =>
            r.id === id ? { ...r, ...record } : r
          ),
        })),
      deleteGrowthRecord: (id) =>
        set((state) => ({
          growthRecords: state.growthRecords.filter((r) => r.id !== id),
        })),

      // 任务
      tasks: [],
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, task) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...task } : t)),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      toggleTaskComplete: (taskId, date) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task;
            const completed = task.completedDates.includes(date);
            return {
              ...task,
              completedDates: completed
                ? task.completedDates.filter((d) => d !== date)
                : [...task.completedDates, date],
            };
          }),
        })),

      // 知识库
      knowledgeArticles: [],
      toggleFavorite: (id) =>
        set((state) => ({
          knowledgeArticles: state.knowledgeArticles.map((a) =>
            a.id === id ? { ...a, isFavorite: !a.isFavorite } : a
          ),
        })),
      updateReadProgress: (id, progress) =>
        set((state) => ({
          knowledgeArticles: state.knowledgeArticles.map((a) =>
            a.id === id ? { ...a, readProgress: progress } : a
          ),
        })),

      // 情绪记录
      emotionRecords: [],
      addEmotionRecord: (record) =>
        set((state) => ({ emotionRecords: [...state.emotionRecords, record] })),

      // 里程碑
      milestones: [],
      addMilestone: (milestone) =>
        set((state) => ({ milestones: [...state.milestones, milestone] })),
    }),
    {
      name: 'child-growth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
