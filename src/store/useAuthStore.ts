import { create } from 'zustand';
import apiClient from '../lib/apiClient';
import { Child, Family, FamilyMember } from '../types';

interface AuthState {
  user: { id: string; username: string; familyId?: string } | null;
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
          id: String(session.user.id),
          username: session.user.username,
          familyId: session.user.familyId ? String(session.user.familyId) : undefined
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
      let familyWithChildren = family as Family | null;
      
      // 如果登录成功且有家庭，获取家庭详细信息（包含孩子）
      if (familyWithChildren) {
        try {
          const familyDetail = await apiClient.families.getByFamilyId(familyWithChildren.id);
          if (familyDetail.family) {
            familyWithChildren = familyDetail.family as Family;
          }
        } catch (e) {
          console.warn('获取家庭详细信息失败', e);
        }
      }
      
      set({
        user: user ? {
          id: String(user.id),
          username: user.username,
          familyId: user.familyId ? String(user.familyId) : undefined
        } : null,
        family: familyWithChildren,
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
