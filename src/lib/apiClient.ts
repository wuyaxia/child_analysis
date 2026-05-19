import { 
  User, 
  Family, 
  FamilyMember, 
  Child, 
  GrowthRecord, 
  Task, 
  KnowledgeArticle, 
  EmotionRecord, 
  Milestone, 
  Review, 
  GrowthMeasurement, 
  AnalysisReport,
  TaskCategory,
  DifficultyLevel,
  FamilyRole
} from '../types';

// ==================== 类型定义 ====================

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}

// ==================== 常量定义 ====================

const STORAGE_KEYS = {
  USER: 'auth_user',
  FAMILY: 'auth_family',
  CURRENT_MEMBER: 'auth_current_member'
} as const;

const API_BASE_URL = '/api';

// ==================== 会话管理类 ====================

class SessionManager {
  private static instance: SessionManager;
  
  private constructor() {}
  
  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }
  
  getUser(): User | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
  
  setUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }
  
  getFamily(): Family | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAMILY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
  
  setFamily(family: Family): void {
    localStorage.setItem(STORAGE_KEYS.FAMILY, JSON.stringify(family));
  }
  
  getCurrentMember(): FamilyMember | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_MEMBER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
  
  setCurrentMember(member: FamilyMember): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_MEMBER, JSON.stringify(member));
  }
  
  clear(): void {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }
}

// ==================== API 客户端类 ====================

class ApiClient {
  private session: SessionManager;
  
  constructor() {
    this.session = SessionManager.getInstance();
  }
  
  // ==================== 请求方法 ====================
  
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
    
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || data.error || '请求失败');
    }
    
    return data;
  }
  
  // ==================== 认证 API ====================
  
  auth = {
    login: async (username: string, password: string): Promise<{ 
      user: User; 
      family?: Family; 
      currentMember?: FamilyMember;
    }> => {
      const response = await this.request<{
        user: User;
        family?: Family;
        currentMember?: FamilyMember;
      }>('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      
      if (response.user) {
        this.session.setUser(response.user);
      }
      if (response.family) {
        this.session.setFamily(response.family);
      }
      if (response.currentMember) {
        this.session.setCurrentMember(response.currentMember);
      }
      
      return response;
    },
    
    register: async (username: string, password: string): Promise<{ user: User }> => {
      const response = await this.request<{ user: User }>('/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      
      if (response.user) {
        this.session.setUser(response.user);
      }
      
      return response;
    },
    
    logout: (): void => {
      this.session.clear();
    },
    
    getSession: (): { user: User | null; family: Family | null; currentMember: FamilyMember | null } => {
      return {
        user: this.session.getUser(),
        family: this.session.getFamily(),
        currentMember: this.session.getCurrentMember(),
      };
    },
  };
  
  // ==================== 家庭 API ====================
  
  families = {
    create: async (name: string): Promise<{ 
      family: Family; 
      member: FamilyMember;
    }> => {
      const user = this.session.getUser();
      const response = await this.request<{ family: Family; member: FamilyMember }>('/families', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      
      if (response.family) {
        this.session.setFamily(response.family);
      }
      if (response.member) {
        this.session.setCurrentMember(response.member);
        const user = this.session.getUser();
        if (user) {
          this.session.setUser({
            ...user,
            familyId: response.family.id,
            currentMemberId: response.member.id,
          });
        }
      }
      
      return response;
    },
    
    getByInviteCode: async (inviteCode: string): Promise<{ family: Family & { members: FamilyMember[] } }> => {
      const response = await this.request<{ family: Family & { members: FamilyMember[] } }>(
        `/families?inviteCode=${encodeURIComponent(inviteCode)}`
      );
      return response;
    },
    
    getByFamilyId: async (familyId: string | number): Promise<{ 
      family: Family & { members: FamilyMember[]; children: Child[] };
    }> => {
      const response = await this.request<{ 
        family: Family & { members: FamilyMember[]; children: Child[] };
      }>(`/families?familyId=${encodeURIComponent(familyId)}`);
      
      if (response.family) {
        this.session.setFamily(response.family);
      }
      
      return response;
    },
  };
  
  // ==================== 家庭成员 API ====================

  familyMembers = {
    join: async (inviteCode: string): Promise<{ member: FamilyMember; family: { id: string | number; name: string; inviteCode: string } }> => {
      const response = await this.request<{ 
        member: FamilyMember; 
        family: { id: string | number; name: string; inviteCode: string } 
      }>('/family-members', {
        method: 'POST',
        body: JSON.stringify({ inviteCode }),
      });
      
      if (response.family) {
        this.session.setFamily(response.family as any);
      }
      if (response.member) {
        this.session.setCurrentMember(response.member);
        const user = this.session.getUser();
        if (user) {
          this.session.setUser({
            ...user,
            familyId: response.family.id,
            currentMemberId: response.member.id,
          });
        }
      }
      
      return response;
    },

    getById: async (memberId: string | number): Promise<{ member: FamilyMember }> => {
      const response = await this.request<{ member: FamilyMember }>(
        `/family-members?memberId=${encodeURIComponent(memberId)}`
      );
      return response;
    },

    getByFamilyId: async (familyId: string | number): Promise<{ members: FamilyMember[] }> => {
      const response = await this.request<{ members: FamilyMember[] }>(
        `/family-members?familyId=${encodeURIComponent(familyId)}`
      );
      return response;
    },

    update: async (memberId: string | number, updateData: any): Promise<{ member: FamilyMember }> => {
      const response = await this.request<{ member: FamilyMember }>('/family-members', {
        method: 'PUT',
        body: JSON.stringify({ memberId, ...updateData }),
      });
      return response;
    },

    leave: async (memberId: string | number, userId: string | number): Promise<void> => {
      await this.request('/family-members', {
        method: 'DELETE',
        body: JSON.stringify({ memberId, userId }),
      });
    },
  };
  
  // ==================== 孩子 API ====================
  
  children = {
    create: async (childData: {
      familyId: string | number;
      name: string;
      birthDate: string;
      gender: 'boy' | 'girl';
      avatar?: string;
    }): Promise<{ child: Child }> => {
      const response = await this.request<{ child: Child }>('/children', {
        method: 'POST',
        body: JSON.stringify(childData),
      });
      return response;
    },
    
    getById: async (childId: string | number): Promise<{ child: Child }> => {
      const response = await this.request<{ child: Child }>(
        `/children?childId=${encodeURIComponent(childId)}`
      );
      return response;
    },
    
    getByFamilyId: async (familyId: string | number): Promise<{ children: Child[] }> => {
      const response = await this.request<{ children: Child[] }>(
        `/children?familyId=${encodeURIComponent(familyId)}`
      );
      return response;
    },
    
    update: async (updateData: any): Promise<{ child: Child }> => {
      const response = await this.request<{ child: Child }>('/children', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      return response;
    },
    
    delete: async (childId: string | number): Promise<void> => {
      await this.request('/children', {
        method: 'DELETE',
        body: JSON.stringify({ childId }),
      });
    },
  };
  
  // ==================== 成长记录 API ====================
  
  growthRecords = {
    create: async (recordData: any): Promise<ApiResponse<GrowthRecord>> => {
      return await this.request<GrowthRecord>('/growth-records', {
        method: 'POST',
        body: JSON.stringify(recordData),
      });
    },
    
    getById: async (recordId: string | number): Promise<ApiResponse<GrowthRecord>> => {
      return await this.request<GrowthRecord>(
        `/growth-records?recordId=${encodeURIComponent(recordId)}`
      );
    },
    
    getByChildId: async (
      childId: string | number, 
      page: number = 1, 
      limit: number = 20
    ): Promise<PaginatedResponse<GrowthRecord>> => {
      const response = await this.request<GrowthRecord[]>(
        `/growth-records?childId=${encodeURIComponent(childId)}&page=${page}&limit=${limit}`
      );
      return response as unknown as PaginatedResponse<GrowthRecord>;
    },
    
    update: async (updateData: any): Promise<ApiResponse<GrowthRecord>> => {
      return await this.request<GrowthRecord>('/growth-records', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    },
    
    delete: async (recordId: string | number): Promise<void> => {
      await this.request('/growth-records', {
        method: 'DELETE',
        body: JSON.stringify({ recordId }),
      });
    },
  };
  
  // ==================== 任务 API ====================
  
  tasks = {
    create: async (taskData: any): Promise<ApiResponse<Task>> => {
      return await this.request<Task>('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      });
    },
    
    getById: async (taskId: string | number): Promise<ApiResponse<Task>> => {
      return await this.request<Task>(
        `/tasks?taskId=${encodeURIComponent(taskId)}`
      );
    },
    
    getByFamilyId: async (familyId: string | number): Promise<{ tasks: Task[] }> => {
      const response = await this.request<{ tasks: Task[] }>(
        `/tasks?familyId=${encodeURIComponent(familyId)}`
      );
      return response;
    },
    
    getByChildId: async (
      childId: string | number,
      options?: {
        isCustom?: boolean;
        category?: TaskCategory;
        page?: number;
        limit?: number;
      }
    ): Promise<PaginatedResponse<Task>> => {
      const params = new URLSearchParams();
      params.append('childId', String(childId));
      if (options?.isCustom !== undefined) params.append('isCustom', String(options.isCustom));
      if (options?.category) params.append('category', options.category);
      if (options?.page) params.append('page', String(options.page));
      if (options?.limit) params.append('limit', String(options.limit));
      
      const response = await this.request<Task[]>(`/tasks?${params.toString()}`);
      return response as unknown as PaginatedResponse<Task>;
    },
    
    getAll: async (
      options?: {
        isCustom?: boolean;
        category?: TaskCategory;
        page?: number;
        limit?: number;
      }
    ): Promise<PaginatedResponse<Task>> => {
      const params = new URLSearchParams();
      if (options?.isCustom !== undefined) params.append('isCustom', String(options.isCustom));
      if (options?.category) params.append('category', options.category);
      if (options?.page) params.append('page', String(options.page));
      if (options?.limit) params.append('limit', String(options.limit));
      
      const response = await this.request<Task[]>(`/tasks?${params.toString()}`);
      return response as unknown as PaginatedResponse<Task>;
    },
    
    update: async (updateData: any): Promise<ApiResponse<Task>> => {
      return await this.request<Task>('/tasks', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    },
    
    delete: async (taskId: string | number): Promise<void> => {
      await this.request('/tasks', {
        method: 'DELETE',
        body: JSON.stringify({ taskId }),
      });
    },
  };
  
  // ==================== 知识和里程碑 API (合并) ====================

  knowledge = {
    // 知识库相关
    getArticles: async (
      options?: {
        ageGroup?: string;
        page?: number;
        limit?: number;
      }
    ): Promise<PaginatedResponse<KnowledgeArticle>> => {
      const params = new URLSearchParams();
      if (options?.ageGroup) params.append('ageGroup', options.ageGroup);
      if (options?.page) params.append('page', String(options.page));
      if (options?.limit) params.append('limit', String(options.limit));
      
      const response = await this.request<KnowledgeArticle[]>(`/knowledge?${params.toString()}`);
      return response as unknown as PaginatedResponse<KnowledgeArticle>;
    },
    
    updateFavorite: async (articleId: string | number, isFavorite: boolean): Promise<void> => {
      await this.request('/knowledge', {
        method: 'PUT',
        body: JSON.stringify({ id: articleId, isFavorite }),
      });
    },
    
    updateProgress: async (articleId: string | number, readProgress: number): Promise<void> => {
      await this.request('/knowledge', {
        method: 'PUT',
        body: JSON.stringify({ id: articleId, readProgress }),
      });
    },
    
    // 里程碑相关
    createMilestone: async (milestoneData: any): Promise<ApiResponse<Milestone>> => {
      return await this.request<Milestone>('/knowledge', {
        method: 'POST',
        body: JSON.stringify(milestoneData),
      });
    },
    
    getMilestones: async (
      childId: string | number,
      options?: {
        category?: string;
        page?: number;
        limit?: number;
      }
    ): Promise<PaginatedResponse<Milestone>> => {
      const params = new URLSearchParams();
      params.append('childId', String(childId));
      if (options?.category) params.append('category', options.category);
      if (options?.page) params.append('page', String(options.page));
      if (options?.limit) params.append('limit', String(options.limit));
      
      const response = await this.request<Milestone[]>(`/knowledge?${params.toString()}`);
      return response as unknown as PaginatedResponse<Milestone>;
    },
    
    updateMilestone: async (updateData: any): Promise<ApiResponse<Milestone>> => {
      return await this.request<Milestone>('/knowledge', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    },
    
    deleteMilestone: async (milestoneId: string | number): Promise<void> => {
      await this.request('/knowledge', {
        method: 'DELETE',
        body: JSON.stringify({ milestoneId }),
      });
    },
  };
  
  // ==================== 情绪和测量 API (合并) ====================

  emotions = {
    // 情绪记录相关
    createEmotion: async (recordData: any): Promise<ApiResponse<EmotionRecord>> => {
      return await this.request<EmotionRecord>('/emotions', {
        method: 'POST',
        body: JSON.stringify(recordData),
      });
    },
    
    getEmotions: async (
      childId: string | number,
      page: number = 1,
      limit: number = 20
    ): Promise<PaginatedResponse<EmotionRecord>> => {
      const response = await this.request<EmotionRecord[]>(
        `/emotions?childId=${encodeURIComponent(childId)}&page=${page}&limit=${limit}`
      );
      return response as unknown as PaginatedResponse<EmotionRecord>;
    },
    
    updateEmotion: async (updateData: any): Promise<ApiResponse<EmotionRecord>> => {
      return await this.request<EmotionRecord>('/emotions', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    },
    
    deleteEmotion: async (recordId: string | number): Promise<void> => {
      await this.request('/emotions', {
        method: 'DELETE',
        body: JSON.stringify({ recordId }),
      });
    },
    
    // 生长测量相关
    createMeasurement: async (measurementData: any): Promise<ApiResponse<GrowthMeasurement>> => {
      return await this.request<GrowthMeasurement>('/emotions', {
        method: 'POST',
        body: JSON.stringify(measurementData),
      });
    },
    
    getMeasurements: async (
      childId: string | number,
      page: number = 1,
      limit: number = 20
    ): Promise<PaginatedResponse<GrowthMeasurement>> => {
      const response = await this.request<GrowthMeasurement[]>(
        `/emotions?childId=${encodeURIComponent(childId)}&page=${page}&limit=${limit}`
      );
      return response as unknown as PaginatedResponse<GrowthMeasurement>;
    },
    
    updateMeasurement: async (updateData: any): Promise<ApiResponse<GrowthMeasurement>> => {
      return await this.request<GrowthMeasurement>('/emotions', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    },
    
    deleteMeasurement: async (measurementId: string | number): Promise<void> => {
      await this.request('/emotions', {
        method: 'DELETE',
        body: JSON.stringify({ measurementId }),
      });
    },
  };
  
  // ==================== 复盘 API ====================

  reviews = {
    create: async (reviewData: any): Promise<ApiResponse<Review>> => {
      return await this.request<Review>('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData),
      });
    },

    getById: async (reviewId: string | number): Promise<ApiResponse<Review>> => {
      return await this.request<Review>(
        `/reviews?reviewId=${encodeURIComponent(reviewId)}`
      );
    },

    getByFamilyId: async (familyId: string | number): Promise<{ reviews: Review[] }> => {
      const response = await this.request<{ reviews: Review[] }>(
        `/reviews?familyId=${encodeURIComponent(familyId)}`
      );
      return response;
    },

    update: async (updateData: any): Promise<ApiResponse<Review>> => {
      return await this.request<Review>('/reviews', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    },

    delete: async (reviewId: string | number): Promise<void> => {
      await this.request('/reviews', {
        method: 'DELETE',
        body: JSON.stringify({ reviewId }),
      });
    },
  };
  
  // ==================== 分析报告 API ====================

  analysisReports = {
    create: async (reportData: any): Promise<ApiResponse<AnalysisReport>> => {
      return await this.request<AnalysisReport>('/analysis-reports', {
        method: 'POST',
        body: JSON.stringify(reportData),
      });
    },

    getById: async (reportId: string | number): Promise<ApiResponse<AnalysisReport>> => {
      return await this.request<AnalysisReport>(
        `/analysis-reports?reportId=${encodeURIComponent(reportId)}`
      );
    },

    getByFamilyId: async (familyId: string | number): Promise<{ reports: AnalysisReport[] }> => {
      const response = await this.request<{ reports: AnalysisReport[] }>(
        `/analysis-reports?familyId=${encodeURIComponent(familyId)}`
      );
      return response;
    },

    update: async (updateData: any): Promise<ApiResponse<AnalysisReport>> => {
      return await this.request<AnalysisReport>('/analysis-reports', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    },

    delete: async (reportId: string | number): Promise<void> => {
      await this.request('/analysis-reports', {
        method: 'DELETE',
        body: JSON.stringify({ reportId }),
      });
    },
  };
}

// ==================== 导出实例 ====================

export const apiClient = new ApiClient();
export const sessionManager = SessionManager.getInstance();

// 导出默认实例以便直接使用
export default apiClient;
