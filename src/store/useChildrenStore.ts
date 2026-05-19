import { create } from 'zustand';
import apiClient from '../lib/apiClient';
import { useAuthStore } from './useAuthStore';
import type { Child } from '../types';

interface ChildrenState {
  children: Child[];
  currentChild: Child | null;
  isLoading: boolean;
  error: string | null;
  
  fetchChildren: () => Promise<void>;
  addChild: (child: Omit<Child, 'id' | 'createdAt' | 'updatedAt' | 'order' | 'isActive' | 'createdBy'>) => Promise<void>;
  updateChild: (childId: string, data: Partial<Omit<Child, 'id' | 'createdAt' | 'createdBy'>>) => Promise<void>;
  setCurrentChild: (child: Child) => Promise<void>;
  clearError: () => void;
}

export const useChildrenStore = create<ChildrenState>((set, get) => ({
  children: [],
  currentChild: null,
  isLoading: false,
  error: null,

  fetchChildren: async () => {
    set({ isLoading: true, error: null });
    try {
      const familyId = useAuthStore.getState().family?.id;
      if (!familyId) {
        set({ isLoading: false });
        return;
      }

      const response = await apiClient.children.getByFamilyId(familyId);
      const children = response.children || [];

      const activeChild = children.find(c => c.isActive) || children[0] || null;

      set({ children, currentChild: activeChild, isLoading: false });
    } catch (error: any) {
      console.error('获取孩子列表失败:', error);
      set({ error: error.message || '获取孩子列表失败', isLoading: false });
    }
  },

  addChild: async (childData) => {
    set({ isLoading: true, error: null });
    try {
      const familyId = useAuthStore.getState().family?.id;
      const user = useAuthStore.getState().user;
      if (!familyId || !user) throw new Error('请先加入家庭');

      const { children } = get();
      
      const response = await apiClient.children.create({
        familyId,
        name: childData.name,
        birthDate: childData.birthDate,
        gender: childData.gender,
        avatar: childData.avatar,
        createdBy: user.id
      });

      const addedChild: Child = {
        id: response.child.id.toString(),
        name: response.child.name,
        birthDate: response.child.birthDate,
        gender: response.child.gender,
        avatar: response.child.avatar,
        familyId: response.child.familyId.toString(),
        order: children.length,
        isActive: children.length === 0,
        createdBy: user.username,
        createdAt: response.child.createdAt,
        updatedAt: response.child.updatedAt
      };

      const updatedChildren = [...children, addedChild];
      
      set({ 
        children: updatedChildren, 
        currentChild: addedChild.isActive ? addedChild : get().currentChild,
        isLoading: false 
      });

    } catch (error: any) {
      console.error('添加孩子失败:', error);
      set({ error: error.message || '添加孩子失败', isLoading: false });
    }
  },

  updateChild: async (childId, data) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.children.update({
        childId: parseInt(childId),
        ...data
      });

      const { children, currentChild } = get();
      const updatedChildren = children.map(c => 
        c.id === childId 
          ? { ...c, ...data, updatedAt: new Date().toISOString() }
          : c
      );

      set({ 
        children: updatedChildren,
        currentChild: currentChild?.id === childId 
          ? { ...currentChild, ...data, updatedAt: new Date().toISOString() }
          : currentChild,
        isLoading: false 
      });

    } catch (error: any) {
      console.error('更新孩子信息失败:', error);
      set({ error: error.message || '更新失败', isLoading: false });
    }
  },

  setCurrentChild: async (child) => {
    set({ isLoading: true, error: null });
    try {
      const { children } = get();

      for (const c of children) {
        await apiClient.children.update({
          childId: parseInt(c.id),
          isActive: c.id === child.id
        });
      }

      const updatedChildren = children.map(c => ({
        ...c,
        isActive: c.id === child.id
      }));

      set({ 
        children: updatedChildren, 
        currentChild: { ...child, isActive: true },
        isLoading: false 
      });

    } catch (error: any) {
      console.error('切换当前孩子失败:', error);
      set({ error: error.message || '切换失败', isLoading: false });
    }
  },

  clearError: () => set({ error: null })
}));
