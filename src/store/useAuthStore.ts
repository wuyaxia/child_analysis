import { create } from 'zustand';
import apiClient from '../lib/apiClient';

interface Family {
  id: number;
  name: string;
  inviteCode: string;
  createdAt: string;
}

interface FamilyMember {
  id: number;
  userId: number;
  familyId: number;
  role: string;
  nickname: string;
  avatar?: string;
}

interface AuthState {
  user: { id: number; username: string; familyId?: number } | null;
  family: Family | null;
  currentMember: FamilyMember | null;
  isLoading: boolean;
  error: string | null;
  
  initAuth: () => () => void;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  
  createFamily: (name: string) => Promise<void>;
  joinFamily: (inviteCode: string) => Promise<void>;
  updateMember: (updates: Partial<FamilyMember>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  family: null,
  currentMember: null,
  isLoading: false,
  error: null,

  initAuth: () => {
    const session = apiClient.auth.getSession();
    if (session.user) {
      set({
        user: {
          id: session.user.id,
          username: session.user.username,
          familyId: session.user.familyId
        },
        family: session.family as Family | null,
        currentMember: session.currentMember as FamilyMember | null
      });
    }
    return () => {};
  },

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user, family, currentMember } = await apiClient.auth.login(username, password);
      set({
        user: user ? {
          id: user.id,
          username: user.username,
          familyId: user.familyId
        } : null,
        family: family as Family | null,
        currentMember: currentMember as FamilyMember | null,
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || '登录失败'
      });
      throw error;
    }
  },

  register: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.auth.register(username, password);
      await get().login(username, password);
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || '注册失败'
      });
      throw error;
    }
  },

  logout: () => {
    apiClient.auth.logout();
    set({
      user: null,
      family: null,
      currentMember: null,
      error: null
    });
  },

  clearError: () => set({ error: null }),

  createFamily: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const { family, member } = await apiClient.families.create(name);
      const user = get().user;
      if (user) {
        set({
          user: { ...user, familyId: family.id },
          family,
          currentMember: member,
          isLoading: false,
          error: null
        });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || '创建家庭失败'
      });
      throw error;
    }
  },

  joinFamily: async (inviteCode: string) => {
    set({ isLoading: true, error: null });
    try {
      const { family, member } = await apiClient.familyMembers.join(inviteCode);
      const user = get().user;
      if (user) {
        set({
          user: { ...user, familyId: family.id },
          family,
          currentMember: member,
          isLoading: false,
          error: null
        });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || '加入家庭失败'
      });
      throw error;
    }
  },

  updateMember: async (updates: Partial<FamilyMember>) => {
    try {
      const { currentMember } = get();
      if (!currentMember) throw new Error('未找到成员信息');
      
      const updated = await apiClient.familyMembers.update(currentMember.id, updates);
      set({ currentMember: updated });
    } catch (error: any) {
      set({ error: error.message || '更新失败' });
      throw error;
    }
  }
}));
