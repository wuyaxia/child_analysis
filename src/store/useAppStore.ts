import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ChildProfile, GrowthRecord, Task, KnowledgeArticle, EmotionRecord, Milestone } from '../types';

const defaultKnowledgeArticles: KnowledgeArticle[] = [
  {
    id: '1',
    title: '如何应对孩子发脾气',
    content: '当孩子发脾气时，首先要保持冷静，不要训斥或打骂孩子。可以试着用温和的语言询问原因，帮助孩子识别和表达自己的情绪。等孩子冷静下来后，再和孩子一起讨论解决问题的方法。',
    ageGroup: '3',
    category: ['情绪管理'],
    tags: ['情绪', '发脾气'],
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: '3岁孩子的语言发展',
    content: '3岁是孩子语言发展的关键时期。此时孩子应该能说出3-5个字的短句，能听懂简单的指令。可以多和孩子说话，讲故事，唱儿歌，帮助孩子提升语言能力。',
    ageGroup: '3',
    category: ['认知学习'],
    tags: ['语言', '发展'],
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: '如何培养孩子的专注力',
    content: '可以通过简单的游戏和活动来培养孩子的专注力，如拼图、搭积木、画画等。每次活动的时间不宜过长，15-20分钟为宜。要选择孩子感兴趣的内容，当孩子专注时不要轻易打断。',
    ageGroup: '3',
    category: ['认知学习'],
    tags: ['专注力', '游戏'],
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: '培养孩子良好的睡眠习惯',
    content: '建立固定的睡前程序，如洗澡、讲故事、听轻音乐等，帮助孩子做好睡前准备。保持规律的睡眠时间，创造安静舒适的睡眠环境。睡前避免让孩子玩电子产品。',
    ageGroup: '3',
    category: ['规律作息'],
    tags: ['睡眠', '作息'],
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: '鼓励孩子社交互动',
    content: '多带孩子和其他小朋友一起玩，教孩子学会分享、轮流等待等社交技能。可以通过角色扮演游戏来帮助孩子理解社交规则。当孩子表现出良好的社交行为时，及时给予鼓励和表扬。',
    ageGroup: '3',
    category: ['社交能力'],
    tags: ['社交', '互动'],
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
];

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
    (set, get) => ({
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
      knowledgeArticles: defaultKnowledgeArticles,
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
