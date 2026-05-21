import { create } from 'zustand';
import apiClient from '../lib/apiClient';
import { useAuthStore } from './useAuthStore';
import type { ChildProfile, GrowthRecord, Task, KnowledgeArticle, EmotionRecord, Milestone, Review, GrowthMeasurement, TaskCategory, DifficultyLevel, AnalysisReport } from '../types';

const presetTasks: Task[] = [
  { id: 'pr-3e-1', sourcePresetId: 'pr-3e-1', title: '早睡早起', description: '晚上9点前睡觉，早上7点起床', category: 'routine', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pr-3e-2', sourcePresetId: 'pr-3e-2', title: '按时午休', description: '中午12:30-14:30午休', category: 'routine', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 120, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pr-3m-1', sourcePresetId: 'pr-3m-1', title: '睡前仪式', description: '洗澡→换睡衣→刷牙→讲故事→关灯', category: 'routine', difficulty: 'medium', ageRange: { min: 36, max: 47 }, duration: 30, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pr-3m-2', sourcePresetId: 'pr-3m-2', title: '定时排便', description: '培养固定时间排便习惯', category: 'routine', difficulty: 'medium', ageRange: { min: 36, max: 47 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pr-4e-1', sourcePresetId: 'pr-4e-1', title: '独立入睡', description: '完成睡前仪式后自己入睡', category: 'routine', difficulty: 'easy', ageRange: { min: 48, max: 59 }, duration: 20, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pr-4m-1', sourcePresetId: 'pr-4m-1', title: '时间感知', description: '认识整点和半点', category: 'routine', difficulty: 'medium', ageRange: { min: 48, max: 59 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pr-5e-1', sourcePresetId: 'pr-5e-1', title: '早间准备', description: '起床后自己穿衣、洗漱', category: 'routine', difficulty: 'easy', ageRange: { min: 60, max: 71 }, duration: 20, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pr-5m-1', sourcePresetId: 'pr-5m-1', title: '按时作业', description: '放学后先完成小任务再玩', category: 'routine', difficulty: 'medium', ageRange: { min: 60, max: 71 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pr-6e-1', sourcePresetId: 'pr-6e-1', title: '书包整理', description: '每晚整理好第二天书包', category: 'routine', difficulty: 'easy', ageRange: { min: 72, max: 84 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pe-3e-1', sourcePresetId: 'pe-3e-1', title: '户外跑跳', description: '每天户外活动30分钟', category: 'exercise', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 30, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pe-3e-2', sourcePresetId: 'pe-3e-2', title: '平衡练习', description: '走直线、原地转圈', category: 'exercise', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pe-3m-1', sourcePresetId: 'pe-3m-1', title: '拍球入门', description: '学习双手拍球', category: 'exercise', difficulty: 'medium', ageRange: { min: 36, max: 47 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pe-4e-1', sourcePresetId: 'pe-4e-1', title: '骑平衡车', description: '户外平衡车骑行', category: 'exercise', difficulty: 'easy', ageRange: { min: 48, max: 59 }, duration: 30, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pe-5e-1', sourcePresetId: 'pe-5e-1', title: '跳绳入门', description: '学习连续跳绳', category: 'exercise', difficulty: 'easy', ageRange: { min: 60, max: 71 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pe-6e-1', sourcePresetId: 'pe-6e-1', title: '晨间体操', description: '做儿童广播体操', category: 'exercise', difficulty: 'easy', ageRange: { min: 72, max: 84 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pc-3e-1', sourcePresetId: 'pc-3e-1', title: '认识颜色', description: '指认生活中的各种颜色', category: 'cognitive', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pc-3e-2', sourcePresetId: 'pc-3e-2', title: '认识形状', description: '分辨圆形、方形、三角形', category: 'cognitive', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pc-3m-1', sourcePresetId: 'pc-3m-1', title: '数数1-10', description: '正确数出1-10', category: 'cognitive', difficulty: 'medium', ageRange: { min: 36, max: 47 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pc-4e-1', sourcePresetId: 'pc-4e-1', title: '数数1-20', description: '正确数出1-20', category: 'cognitive', difficulty: 'easy', ageRange: { min: 48, max: 59 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pc-5e-1', sourcePresetId: 'pc-5e-1', title: '10以内加减', description: '熟练10以内加减法', category: 'cognitive', difficulty: 'easy', ageRange: { min: 60, max: 71 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pc-6e-1', sourcePresetId: 'pc-6e-1', title: '100以内数数', description: '正数和倒数100以内', category: 'cognitive', difficulty: 'easy', ageRange: { min: 72, max: 84 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'ps-3e-1', sourcePresetId: 'ps-3e-1', title: '主动问好', description: '见到熟人主动打招呼', category: 'social', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 5, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'ps-3e-2', sourcePresetId: 'ps-3e-2', title: '说谢谢', description: '收到帮助时说谢谢', category: 'social', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 5, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'ps-4e-1', sourcePresetId: 'ps-4e-1', title: '分享玩具', description: '主动与同伴分享玩具', category: 'social', difficulty: 'easy', ageRange: { min: 48, max: 59 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'ps-5e-1', sourcePresetId: 'ps-5e-1', title: '照顾他人', description: '关心帮助年龄小的孩子', category: 'social', difficulty: 'easy', ageRange: { min: 60, max: 71 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'ps-6e-1', sourcePresetId: 'ps-6e-1', title: '学校交往', description: '与同学友好相处', category: 'social', difficulty: 'easy', ageRange: { min: 72, max: 84 }, duration: 30, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psc-3e-1', sourcePresetId: 'psc-3e-1', title: '自己吃饭', description: '独立使用餐具吃饭', category: 'selfcare', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 20, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psc-3e-2', sourcePresetId: 'psc-3e-2', title: '洗手', description: '饭前便后正确洗手', category: 'selfcare', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 3, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psc-4e-1', sourcePresetId: 'psc-4e-1', title: '自己刷牙', description: '独立刷牙2分钟', category: 'selfcare', difficulty: 'easy', ageRange: { min: 48, max: 59 }, duration: 3, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psc-5e-1', sourcePresetId: 'psc-5e-1', title: '整理房间', description: '收拾自己的房间', category: 'selfcare', difficulty: 'easy', ageRange: { min: 60, max: 71 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
];

export const categoryConfig: Record<TaskCategory, { label: string; icon: string; color: string }> = {
  routine: { label: '规律作息', icon: '🕐', color: '#D4836C' },
  exercise: { label: '运动锻炼', icon: '🏃', color: '#F2D5D0' },
  cognitive: { label: '认知学习', icon: '📚', color: '#AAB794' },
  social: { label: '社交情感', icon: '👫', color: '#F7DBA7' },
  selfcare: { label: '生活自理', icon: '🌟', color: '#B8D4E3' },
  artistic: { label: '艺术创意', icon: '🎨', color: '#E8C5D5' },
  safety: { label: '安全意识', icon: '🛡️', color: '#C9D99E' },
};

export const difficultyConfig: Record<DifficultyLevel, { label: string; stars: number; color: string }> = {
  easy: { label: '初级', stars: 1, color: '#AAB794' },
  medium: { label: '中级', stars: 2, color: '#F7DBA7' },
  hard: { label: '高级', stars: 3, color: '#D4836C' },
};

export const ageGroupConfig = {
  '3': { label: '3岁', minMonths: 36, maxMonths: 47 },
  '4': { label: '4岁', minMonths: 48, maxMonths: 59 },
  '5': { label: '5岁', minMonths: 60, maxMonths: 71 },
  '6': { label: '6岁', minMonths: 72, maxMonths: 84 },
};

interface AppState {
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  childProfile: ChildProfile | null;
  setChildProfile: (profile: ChildProfile) => void;
  
  growthRecords: GrowthRecord[];
  addGrowthRecord: (record: GrowthRecord) => Promise<void>;
  updateGrowthRecord: (id: string, record: Partial<GrowthRecord>) => Promise<void>;
  deleteGrowthRecord: (id: string) => Promise<void>;
  
  tasks: Task[];
  presetTasks: Task[];
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskComplete: (taskId: string, date: string) => Promise<void>;
  addMultipleTasks: (tasks: Task[]) => void;
  
  knowledgeArticles: KnowledgeArticle[];
  toggleFavorite: (id: string) => Promise<void>;
  updateReadProgress: (id: string, progress: number) => Promise<void>;
  
  emotionRecords: EmotionRecord[];
  addEmotionRecord: (record: EmotionRecord) => Promise<void>;
  
  milestones: Milestone[];
  addMilestone: (milestone: Milestone) => Promise<void>;
  
  reviews: Review[];
  addReview: (review: Review) => Promise<void>;
  updateReview: (id: string, review: Partial<Review>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  
  growthMeasurements: GrowthMeasurement[];
  addGrowthMeasurement: (measurement: GrowthMeasurement) => Promise<void>;
  deleteGrowthMeasurement: (id: string) => Promise<void>;
  
  selectedAgeGroup: '3' | '4' | '5' | '6';
  setSelectedAgeGroup: (age: '3' | '4' | '5' | '6') => void;
  
  analysisReports: AnalysisReport[];
  selectedReportId: string | null;
  setSelectedReportId: (id: string | null) => void;
  addAnalysisReport: (report: AnalysisReport) => Promise<void>;
  
  initializeData: (childId?: string) => Promise<void>;
}

export const useAppStore = create<AppState>()((set, get) => ({
  isLoading: false,
  error: null,
  isInitialized: false,
  
  childProfile: null,
  setChildProfile: async (profile) => {
    const family = useAuthStore.getState().family;
    if (!family) return;
    
    try {
      const { child } = await apiClient.children.create({
        familyId: family.id,
        name: profile.name,
        birthDate: profile.birthDate,
        gender: profile.gender,
        createdBy: useAuthStore.getState().user?.id
      });
      set({ childProfile: { ...profile, id: child.id.toString() } });
    } catch (error) {
      set({ error: '创建孩子信息失败' });
      throw error;
    }
  },
  
  growthRecords: [],
  addGrowthRecord: async (record) => {
    try {
      const response = await apiClient.growthRecords.create({
        childId: record.childId,
        date: record.date,
        type: record.type,
        content: record.content,
        photos: record.photos || [],
        tags: record.tags || [],
        createdBy: useAuthStore.getState().user?.id
      });
      const newRecord = response.data;
      set((state) => ({ growthRecords: [...state.growthRecords, newRecord] }));
    } catch (error) {
      set({ error: '添加成长记录失败' });
      throw error;
    }
  },
  updateGrowthRecord: async (id, record) => {
    try {
      const response = await apiClient.growthRecords.update({ recordId: parseInt(id), ...record });
      const updatedRecord = response.data;
      set((state) => ({
        growthRecords: state.growthRecords.map((r) => r.id === id ? updatedRecord : r)
      }));
    } catch (error) {
      set({ error: '更新成长记录失败' });
      throw error;
    }
  },
  deleteGrowthRecord: async (id) => {
    try {
      await apiClient.growthRecords.delete(parseInt(id));
      set((state) => ({
        growthRecords: state.growthRecords.filter((r) => r.id !== id)
      }));
    } catch (error) {
      set({ error: '删除成长记录失败' });
      throw error;
    }
  },
  
  tasks: [],
  presetTasks,
  addTask: async (task) => {
    const family = useAuthStore.getState().family;
    const user = useAuthStore.getState().user;
    const currentChild = get().childProfile;
    
    if (!family) return;
    
    try {
      const response = await apiClient.tasks.create({
        childId: currentChild?.id ? parseInt(currentChild.id) : undefined,
        title: task.title,
        description: task.description,
        category: task.category,
        difficulty: task.difficulty,
        ageMin: task.ageRange.min,
        ageMax: task.ageRange.max,
        duration: task.duration,
        frequency: task.frequency,
        isCustom: true,
        createdBy: user?.id ? parseInt(user.id) : undefined
      });
      const newTask = response.data;
      set((state) => ({ tasks: [...state.tasks, newTask] }));
    } catch (error) {
      set({ error: '添加任务失败' });
      throw error;
    }
  },
  updateTask: async (id, task) => {
    try {
      const response = await apiClient.tasks.update({ taskId: parseInt(id), ...task });
      const updatedTask = response.data;
      set((state) => ({
        tasks: state.tasks.map((t) => t.id === id ? updatedTask : t)
      }));
    } catch (error) {
      set({ error: '更新任务失败' });
      throw error;
    }
  },
  deleteTask: async (id) => {
    try {
      await apiClient.tasks.delete(parseInt(id));
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id)
      }));
    } catch (error) {
      set({ error: '删除任务失败' });
      throw error;
    }
  },
  toggleTaskComplete: async (taskId, date) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task) return;
    
    const isCompleted = task.completedDates.includes(date);
    const newCompletedDates = isCompleted
      ? task.completedDates.filter((d) => d !== date)
      : [...task.completedDates, date];
    
    try {
      await apiClient.tasks.update({ taskId: parseInt(taskId), completedDates: newCompletedDates });
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, completedDates: newCompletedDates } : t
        )
      }));
    } catch (error) {
      set({ error: '更新任务状态失败' });
      throw error;
    }
  },
  addMultipleTasks: async (newTasks) => {
    const family = useAuthStore.getState().family;
    const user = useAuthStore.getState().user;
    const currentChild = get().childProfile;
    
    const createdTasks = [];
    for (const task of newTasks) {
      try {
        const created = await apiClient.tasks.create({
          childId: currentChild?.id ? parseInt(currentChild.id) : undefined,
          title: task.title,
          description: task.description,
          category: task.category,
          difficulty: task.difficulty,
          ageMin: task.ageRange.min,
          ageMax: task.ageRange.max,
          duration: task.duration,
          knowledgeIds: task.knowledgeIds,
          frequency: task.frequency,
          isCustom: task.isCustom,
          sourcePresetId: task.sourcePresetId,
          createdBy: user?.id ? parseInt(user.id) : undefined
        });
        if (created && created.data) {
          createdTasks.push(created.data);
        }
      } catch (error) {
        console.error('创建任务失败:', error);
      }
    }
    set((state) => ({
      tasks: [...state.tasks, ...createdTasks],
    }));
  },
  
  knowledgeArticles: [],
  toggleFavorite: async (id) => {
    const article = get().knowledgeArticles.find((a) => a.id === id);
    if (!article) return;
    
    try {
      await apiClient.knowledge.updateFavorite(parseInt(id), !article.isFavorite);
      set((state) => ({
        knowledgeArticles: state.knowledgeArticles.map((a) =>
          a.id === id ? { ...a, isFavorite: !a.isFavorite } : a
        )
      }));
    } catch (error) {
      console.error('更新收藏失败', error);
    }
  },
  updateReadProgress: async (id, progress) => {
    try {
      await apiClient.knowledge.updateProgress(parseInt(id), progress);
      set((state) => ({
        knowledgeArticles: state.knowledgeArticles.map((a) =>
          a.id === id ? { ...a, readProgress: progress } : a
        )
      }));
    } catch (error) {
      console.error('更新阅读进度失败', error);
    }
  },
  
  emotionRecords: [],
  addEmotionRecord: async (record) => {
    try {
      const response = await apiClient.emotions.createEmotion({
        childId: record.childId,
        date: record.date,
        emotion: record.emotion,
        trigger: record.trigger,
        response: record.response,
        notes: record.notes,
        createdBy: useAuthStore.getState().user?.id
      });
      const newRecord = response.data;
      set((state) => ({ emotionRecords: [...state.emotionRecords, newRecord] }));
    } catch (error) {
      set({ error: '添加情感记录失败' });
      throw error;
    }
  },
  
  milestones: [],
  addMilestone: async (milestone) => {
    try {
      const response = await apiClient.knowledge.createMilestone({
        childId: milestone.childId,
        title: milestone.title,
        date: milestone.date,
        description: milestone.description,
        category: milestone.category,
        createdBy: useAuthStore.getState().user?.id
      });
      const newMilestone = response.data;
      set((state) => ({ milestones: [...state.milestones, newMilestone] }));
    } catch (error) {
      set({ error: '添加里程碑失败' });
      throw error;
    }
  },
  
  reviews: [],
  addReview: async (review) => {
    try {
      const response = await apiClient.reviews.create({
        childId: review.childId,
        title: review.title,
        age: review.age,
        date: review.date,
        problems: review.problems,
        improvements: review.improvements,
        notes: review.notes,
        createdBy: useAuthStore.getState().user?.id
      });
      const newReview = response.data;
      set((state) => ({ reviews: [...state.reviews, newReview] }));
    } catch (error) {
      set({ error: '添加复盘失败' });
      throw error;
    }
  },
  updateReview: async (id, review) => {
    try {
      const response = await apiClient.reviews.update({ reviewId: parseInt(id), ...review });
      const updatedReview = response.data;
      set((state) => ({
        reviews: state.reviews.map((r) => r.id === id ? updatedReview : r)
      }));
    } catch (error) {
      set({ error: '更新复盘失败' });
      throw error;
    }
  },
  deleteReview: async (id) => {
    try {
      await apiClient.reviews.delete(parseInt(id));
      set((state) => ({
        reviews: state.reviews.filter((r) => r.id !== id)
      }));
    } catch (error) {
      set({ error: '删除复盘失败' });
      throw error;
    }
  },
  
  growthMeasurements: [],
  addGrowthMeasurement: async (measurement) => {
    try {
      const response = await apiClient.emotions.createMeasurement({
        childId: measurement.childId,
        date: measurement.date,
        ageMonths: measurement.ageMonths,
        height: measurement.height,
        weight: measurement.weight,
        headCircumference: measurement.headCircumference,
        createdBy: useAuthStore.getState().user?.id
      });
      const newMeasurement = response.data;
      set((state) => ({ growthMeasurements: [...state.growthMeasurements, newMeasurement] }));
    } catch (error) {
      set({ error: '添加测量数据失败' });
      throw error;
    }
  },
  deleteGrowthMeasurement: async (id) => {
    try {
      await apiClient.emotions.deleteMeasurement(parseInt(id));
      set((state) => ({
        growthMeasurements: state.growthMeasurements.filter((m) => m.id !== id)
      }));
    } catch (error) {
      set({ error: '删除测量数据失败' });
      throw error;
    }
  },
  
  selectedAgeGroup: '3',
  setSelectedAgeGroup: (age) => set({ selectedAgeGroup: age }),
  
  analysisReports: [],
  selectedReportId: null,
  setSelectedReportId: (id) => set({ selectedReportId: id }),
  addAnalysisReport: async (report) => {
    try {
      const response = await apiClient.analysisReports.create({
        childId: report.childId,
        age: report.age,
        title: report.title,
        sections: report.sections,
      });
      const newReport = response.data;
      set((state) => ({ analysisReports: [...state.analysisReports, newReport] }));
    } catch (error) {
      set({ error: '添加分析报告失败' });
      throw error;
    }
  },
  
  initializeData: async (childId?: string) => {
    const family = useAuthStore.getState().family;
    if (!family) return;
    
    set({ isLoading: true, error: null });
    try {
      // 自动获取 childProfile
      let activeChildId = childId;
      let childProfileData = get().childProfile;
      
      if (!childProfileData && family.children && family.children.length > 0) {
        // 优先使用 isActive 的孩子，如果没有则使用第一个
        const activeChild = family.children.find(c => c.isActive) || family.children[0];
        childProfileData = {
          id: activeChild.id,
          name: activeChild.name,
          birthDate: activeChild.birthDate,
          gender: activeChild.gender,
          avatar: activeChild.avatar
        };
        set({ childProfile: childProfileData });
        activeChildId = activeChild.id;
      }
      
      const promises = [
        apiClient.reviews.getByFamilyId(family.id),
        apiClient.analysisReports.getByFamilyId(family.id),
        apiClient.knowledge.getArticles()
      ];
      
      if (activeChildId) {
        promises.push(
          apiClient.tasks.getByChildId(activeChildId),
          apiClient.growthRecords.getByChildId(activeChildId),
          apiClient.emotions.getEmotions(activeChildId),
          apiClient.knowledge.getMilestones(activeChildId),
          apiClient.emotions.getMeasurements(activeChildId)
        );
      } else {
        promises.push(
          apiClient.tasks.getAll()
        );
      }
      
      const results = await Promise.all(promises);
      
      const reviewsResult = results[0] as any;
      const reportsResult = results[1] as any;
      const articlesResult = results[2] as any;
      
      let dbTasks: any[] = [];
      let growthRecords: GrowthRecord[] = [];
      let emotionRecords: EmotionRecord[] = [];
      let milestones: Milestone[] = [];
      let growthMeasurements: GrowthMeasurement[] = [];
      
      if (activeChildId) {
        const tasksResult = results[3] as any;
        growthRecords = (results[4] as any).data || [];
        emotionRecords = (results[5] as any).data || [];
        milestones = (results[6] as any).data || [];
        growthMeasurements = (results[7] as any).data || [];
        dbTasks = tasksResult.data || tasksResult.tasks || [];
      } else {
        const tasksResult = results[3] as any;
        dbTasks = tasksResult.data || tasksResult.tasks || [];
      }
      
      const existingTaskIds = new Set(presetTasks.map(t => t.id));
      const newDbTasks = dbTasks.filter((t: Task) => !existingTaskIds.has(t.id));
      const allTasks = [...presetTasks, ...newDbTasks];
      
      set({
        tasks: allTasks,
        reviews: reviewsResult.reviews || [],
        analysisReports: reportsResult.reports || [],
        knowledgeArticles: articlesResult.data || [],
        growthRecords,
        emotionRecords,
        milestones,
        growthMeasurements,
        isLoading: false,
        isInitialized: true
      });
      
      if (reportsResult.reports && reportsResult.reports.length > 0) {
        set({ selectedReportId: reportsResult.reports[0].id });
      }
    } catch (error) {
      console.error('初始化数据失败', error);
      set({ isLoading: false, isInitialized: true, error: '加载数据失败' });
    }
  }
}));
