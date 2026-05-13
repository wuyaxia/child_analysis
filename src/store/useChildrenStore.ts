import { create } from 'zustand';
import { 
  doc, 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  setDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Child } from '../types';
import { useAuthStore } from './useAuthStore';

interface ChildrenState {
  children: Child[];
  currentChild: Child | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
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

      const q = query(
        collection(db, 'families', familyId, 'children'),
        orderBy('order')
      );
      const snapshot = await getDocs(q);
      
      const children = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as Child[];

      // 设置当前孩子为第一个 isActive 为 true 的，或者第一个孩子
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
      
      const newChild: Omit<Child, 'id'> = {
        ...childData,
        order: children.length,
        isActive: children.length === 0, // 第一个孩子设为默认
        createdBy: user.phone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(
        collection(db, 'families', familyId, 'children'),
        newChild
      );

      const addedChild: Child = {
        id: docRef.id,
        ...newChild
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
      const familyId = useAuthStore.getState().family?.id;
      if (!familyId) throw new Error('请先加入家庭');

      const childRef = doc(db, 'families', familyId, 'children', childId);
      
      await setDoc(childRef, {
        ...data,
        updatedAt: new Date().toISOString()
      }, { merge: true });

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
      const familyId = useAuthStore.getState().family?.id;
      if (!familyId) throw new Error('请先加入家庭');

      // 将其他孩子的 isActive 设为 false
      const { children } = get();
      for (const c of children) {
        if (c.id !== child.id) {
          await setDoc(
            doc(db, 'families', familyId, 'children', c.id),
            { isActive: false, updatedAt: new Date().toISOString() },
            { merge: true }
          );
        }
      }

      // 设置当前孩子的 isActive 为 true
      await setDoc(
        doc(db, 'families', familyId, 'children', child.id),
        { isActive: true, updatedAt: new Date().toISOString() },
        { merge: true }
      );

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
