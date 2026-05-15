import { create } from 'zustand';
import { User, Family, FamilyMember, FamilyRole } from '../types';

interface AuthState {
  user: User | null;
  family: Family | null;
  currentMember: FamilyMember | null;
  isLoading: boolean;
  error: string | null;
  
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  createFamily: (name: string, role: FamilyRole, nickname: string) => Promise<void>;
  joinFamily: (inviteCode: string, role: FamilyRole, nickname: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  initAuth: () => () => void;
}

const generateInviteCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const STORAGE_KEYS = {
  USER: 'auth_user',
  FAMILY: 'auth_family',
  CURRENT_MEMBER: 'auth_current_member'
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  family: null,
  currentMember: null,
  isLoading: false,
  error: null,

  initAuth: () => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const storedFamily = localStorage.getItem(STORAGE_KEYS.FAMILY);
      const storedMember = localStorage.getItem(STORAGE_KEYS.CURRENT_MEMBER);
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const family = storedFamily ? JSON.parse(storedFamily) : null;
        const currentMember = storedMember ? JSON.parse(storedMember) : null;
        
        set({ user, family, currentMember });
      }
    } catch (error) {
      console.error('恢复用户状态失败:', error);
    }
    return () => {};
  },

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      const user: User = {
        username,
        familyId: null,
        currentMemberId: null,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      set({ user, isLoading: false });
      
    } catch (error: any) {
      console.error('Login failed:', error);
      set({ error: error.message || 'Login failed', isLoading: false });
      throw error;
    }
  },

  register: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      const user: User = {
        username,
        familyId: null,
        currentMemberId: null,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      set({ user, isLoading: false });
      
    } catch (error: any) {
      console.error('Registration failed:', error);
      set({ error: error.message || 'Registration failed', isLoading: false });
      throw error;
    }
  },

  createFamily: async (name: string, role: FamilyRole, nickname: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = get();
      if (!user) throw new Error('Please login first');

      const inviteCode = generateInviteCode();
      const familyId = 'family_' + Date.now();
      const memberId = user.username;
      
      const member: FamilyMember = {
        id: memberId,
        username: user.username,
        role,
        nickname,
        joinedAt: new Date().toISOString()
      };
      
      const family: Family = {
        id: familyId,
        name,
        inviteCode,
        members: [member],
        createdAt: new Date().toISOString()
      };
      
      const updatedUser: User = {
        ...user,
        familyId,
        currentMemberId: memberId
      };
      
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      localStorage.setItem(STORAGE_KEYS.FAMILY, JSON.stringify(family));
      localStorage.setItem(STORAGE_KEYS.CURRENT_MEMBER, JSON.stringify(member));
      
      set({
        user: updatedUser,
        family,
        currentMember: member,
        isLoading: false
      });

    } catch (error: any) {
      console.error('Failed to create family:', error);
      set({ error: error.message || 'Failed to create family', isLoading: false });
    }
  },

  joinFamily: async (inviteCode: string, role: FamilyRole, nickname: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = get();
      if (!user) throw new Error('Please login first');

      const familyId = 'family_joined_' + Date.now();
      const memberId = user.username;
      
      const member: FamilyMember = {
        id: memberId,
        username: user.username,
        role,
        nickname,
        joinedAt: new Date().toISOString()
      };
      
      const family: Family = {
        id: familyId,
        name: '家庭 ' + inviteCode,
        inviteCode,
        members: [member],
        createdAt: new Date().toISOString()
      };
      
      const updatedUser: User = {
        ...user,
        familyId,
        currentMemberId: memberId
      };
      
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      localStorage.setItem(STORAGE_KEYS.FAMILY, JSON.stringify(family));
      localStorage.setItem(STORAGE_KEYS.CURRENT_MEMBER, JSON.stringify(member));
      
      set({
        user: updatedUser,
        family,
        currentMember: member,
        isLoading: false
      });

    } catch (error: any) {
      console.error('Failed to join family:', error);
      set({ error: error.message || 'Failed to join family', isLoading: false });
    }
  },

  logout: async () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.FAMILY);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_MEMBER);
      set({
        user: null,
        family: null,
        currentMember: null
      });
    } catch (error: any) {
      console.error('Logout failed:', error);
      set({ error: error.message || 'Logout failed' });
    }
  },

  clearError: () => set({ error: null })
}));
