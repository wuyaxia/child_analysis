import { GrowthRecord, Task, Review, GrowthMeasurement, EmotionRecord, Milestone, KnowledgeArticle, AnalysisReport } from '../types';

// 缓存存储键
const CACHE_KEYS = {
  GROWTH_RECORDS: 'cache_growth_records',
  TASKS: 'cache_tasks',
  REVIEWS: 'cache_reviews',
  GROWTH_MEASUREMENTS: 'cache_growth_measurements',
  EMOTION_RECORDS: 'cache_emotion_records',
  MILESTONES: 'cache_milestones',
  KNOWLEDGE_ARTICLES: 'cache_knowledge_articles',
  ANALYSIS_REPORTS: 'cache_analysis_reports',
  LAST_SYNC: 'cache_last_sync',
  PENDING_OPERATIONS: 'cache_pending_ops'
} as const;

interface PendingOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  entityType: 'growth_record' | 'task' | 'review' | 'growth_measurement' | 'emotion_record' | 'milestone' | 'knowledge_article' | 'analysis_report';
  data: any;
  timestamp: number;
}

interface CacheData {
  growthRecords: GrowthRecord[];
  tasks: Task[];
  reviews: Review[];
  growthMeasurements: GrowthMeasurement[];
  emotionRecords: EmotionRecord[];
  milestones: Milestone[];
  knowledgeArticles: KnowledgeArticle[];
  analysisReports: AnalysisReport[];
}

class OfflineCacheManager {
  private isOnline: boolean;
  private listeners: Set<(online: boolean) => void>;

  constructor() {
    this.isOnline = navigator.onLine;
    this.listeners = new Set();
    
    window.addEventListener('online', () => this.handleOnlineStatus(true));
    window.addEventListener('offline', () => this.handleOnlineStatus(false));
  }

  private handleOnlineStatus(online: boolean) {
    this.isOnline = online;
    this.listeners.forEach(listener => listener(online));
    
    if (online) {
      this.syncPendingOperations();
    }
  }

  public getOnlineStatus(): boolean {
    return this.isOnline;
  }

  public addOnlineStatusListener(listener: (online: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // 获取所有缓存数据
  public getAllCacheData(): CacheData {
    return {
      growthRecords: this.getCache<GrowthRecord[]>(CACHE_KEYS.GROWTH_RECORDS, [] as GrowthRecord[]),
      tasks: this.getCache<Task[]>(CACHE_KEYS.TASKS, [] as Task[]),
      reviews: this.getCache<Review[]>(CACHE_KEYS.REVIEWS, [] as Review[]),
      growthMeasurements: this.getCache<GrowthMeasurement[]>(CACHE_KEYS.GROWTH_MEASUREMENTS, [] as GrowthMeasurement[]),
      emotionRecords: this.getCache<EmotionRecord[]>(CACHE_KEYS.EMOTION_RECORDS, [] as EmotionRecord[]),
      milestones: this.getCache<Milestone[]>(CACHE_KEYS.MILESTONES, [] as Milestone[]),
      knowledgeArticles: this.getCache<KnowledgeArticle[]>(CACHE_KEYS.KNOWLEDGE_ARTICLES, [] as KnowledgeArticle[]),
      analysisReports: this.getCache<AnalysisReport[]>(CACHE_KEYS.ANALYSIS_REPORTS, [] as AnalysisReport[])
    };
  }

  // 获取缓存
  public getCache<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`获取缓存失败 ${key}:`, error);
      return defaultValue;
    }
  }

  // 设置缓存
  public setCache<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`设置缓存失败 ${key}:`, error);
    }
  }

  // 清空缓存
  public clearCache(): void {
    Object.values(CACHE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // 获取待处理操作
  public getPendingOperations(): PendingOperation[] {
    return this.getCache<PendingOperation[]>(CACHE_KEYS.PENDING_OPERATIONS, []);
  }

  // 添加待处理操作
  public addPendingOperation(op: Omit<PendingOperation, 'id' | 'timestamp'>): void {
    const ops = this.getPendingOperations();
    const newOp: PendingOperation = {
      ...op,
      id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };
    ops.push(newOp);
    this.setCache(CACHE_KEYS.PENDING_OPERATIONS, ops);
  }

  // 清除待处理操作
  public clearPendingOperations(): void {
    this.setCache(CACHE_KEYS.PENDING_OPERATIONS, []);
  }

  // 更新最后同步时间
  public setLastSync(timestamp: number = Date.now()): void {
    this.setCache(CACHE_KEYS.LAST_SYNC, timestamp);
  }

  // 获取最后同步时间
  public getLastSync(): number | null {
    return this.getCache<number | null>(CACHE_KEYS.LAST_SYNC, null);
  }

  // 同步待处理操作
  public async syncPendingOperations(): Promise<void> {
    if (!this.isOnline) return;

    const ops = this.getPendingOperations();
    if (ops.length === 0) return;

    console.log('开始同步待处理操作:', ops.length, '项');
    
    // 这里我们只是标记已处理，实际的 API 调用需要在 apiClient 中实现
    // 在实际项目中，这里应该有重试逻辑和错误处理
    this.clearPendingOperations();
    this.setLastSync();
  }

  // 保存单个实体到缓存
  public saveGrowthRecord(record: GrowthRecord): void {
    const records = this.getCache<GrowthRecord[]>(CACHE_KEYS.GROWTH_RECORDS, []);
    const index = records.findIndex(r => r.id === record.id);
    if (index >= 0) {
      records[index] = record;
    } else {
      records.push(record);
    }
    this.setCache(CACHE_KEYS.GROWTH_RECORDS, records);
  }

  public saveTask(task: Task): void {
    const tasks = this.getCache<Task[]>(CACHE_KEYS.TASKS, []);
    const index = tasks.findIndex(t => t.id === task.id);
    if (index >= 0) {
      tasks[index] = task;
    } else {
      tasks.push(task);
    }
    this.setCache(CACHE_KEYS.TASKS, tasks);
  }

  public saveReview(review: Review): void {
    const reviews = this.getCache<Review[]>(CACHE_KEYS.REVIEWS, []);
    const index = reviews.findIndex(r => r.id === review.id);
    if (index >= 0) {
      reviews[index] = review;
    } else {
      reviews.push(review);
    }
    this.setCache(CACHE_KEYS.REVIEWS, reviews);
  }

  public saveGrowthMeasurement(measurement: GrowthMeasurement): void {
    const measurements = this.getCache<GrowthMeasurement[]>(CACHE_KEYS.GROWTH_MEASUREMENTS, []);
    const index = measurements.findIndex(m => m.id === measurement.id);
    if (index >= 0) {
      measurements[index] = measurement;
    } else {
      measurements.push(measurement);
    }
    this.setCache(CACHE_KEYS.GROWTH_MEASUREMENTS, measurements);
  }
}

export const offlineCache = new OfflineCacheManager();
export default offlineCache;
