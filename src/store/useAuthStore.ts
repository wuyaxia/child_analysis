import { create } from 'zustand';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
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

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  family: null,
  currentMember: null,
  isLoading: false,
  error: null,

  initAuth: () => {
    const storedUsername = localStorage.getItem('auth_username');
    if (storedUsername) {
      (async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', storedUsername));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            set({ user: userData });
            
            if (userData.familyId) {
              const familyDoc = await getDoc(doc(db, 'families', userData.familyId));
              if (familyDoc.exists()) {
                const familyData = familyDoc.data();
                const membersQuery = query(
                  collection(db, 'families', userData.familyId, 'members')
                );
                const membersSnapshot = await getDocs(membersQuery);
                const members = membersSnapshot.docs.map(d => ({ 
                  id: d.id, 
                  ...d.data() 
                })) as FamilyMember[];
                
                const currentMember = members.find(m => m.id === userData.currentMemberId) || null;
                
                set({ 
                  family: { 
                    id: userData.familyId, 
                    name: familyData.name, 
                    inviteCode: familyData.inviteCode,
                    members, 
                    createdAt: familyData.createdAt || new Date().toISOString() 
                  },
                  currentMember
                });
              }
            }
          }
        } catch (error) {
          console.error('恢复用户状态失败:', error);
          localStorage.removeItem('auth_username');
        }
      })();
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
      
      localStorage.setItem('auth_username', username);
      
      const userDoc = await getDoc(doc(db, 'users', username));
      
      let userData: User;
      if (userDoc.exists()) {
        userData = userDoc.data() as User;
      } else {
        userData = {
          username,
          familyId: null,
          currentMemberId: null,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', username), userData);
      }
      
      set({ user: userData, isLoading: false });
      
      if (userData.familyId) {
        const familyDoc = await getDoc(doc(db, 'families', userData.familyId));
        if (familyDoc.exists()) {
          const familyData = familyDoc.data();
          const membersQuery = query(
            collection(db, 'families', userData.familyId, 'members')
          );
          const membersSnapshot = await getDocs(membersQuery);
          const members = membersSnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as FamilyMember[];
          const currentMember = members.find(m => m.id === userData.currentMemberId) || null;
          
          set({ 
            family: { 
              id: userData.familyId, 
              name: familyData.name, 
              inviteCode: familyData.inviteCode,
              members, 
              createdAt: familyData.createdAt || new Date().toISOString() 
            },
            currentMember
          });
        }
      }
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
      
      localStorage.setItem('auth_username', username);
      
      const userData: User = {
        username,
        familyId: null,
        currentMemberId: null,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', username), userData);
      
      set({ user: userData, isLoading: false });
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

      const familyRef = await addDoc(collection(db, 'families'), {
        name,
        inviteCode,
        createdAt: new Date().toISOString()
      });

      const memberId = user.username;
      const member: FamilyMember = {
        id: memberId,
        username: user.username,
        role,
        nickname,
        joinedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'families', familyRef.id, 'members', memberId), member);

      const updatedUser: User = {
        ...user,
        familyId: familyRef.id,
        currentMemberId: memberId
      };
      await setDoc(doc(db, 'users', user.username), updatedUser, { merge: true });

      set({
        user: updatedUser,
        family: {
          id: familyRef.id,
          name,
          inviteCode,
          members: [member],
          createdAt: new Date().toISOString()
        },
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

      const familiesQuery = query(
        collection(db, 'families'),
        where('inviteCode', '==', inviteCode)
      );
      const familiesSnapshot = await getDocs(familiesQuery);

      if (familiesSnapshot.empty) {
        throw new Error('Invalid invite code');
      }

      const familyDoc = familiesSnapshot.docs[0];
      const familyId = familyDoc.id;
      const familyData = familyDoc.data();

      const memberId = user.username;
      const member: FamilyMember = {
        id: memberId,
        username: user.username,
        role,
        nickname,
        joinedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'families', familyId, 'members', memberId), member);

      const updatedUser: User = {
        ...user,
        familyId,
        currentMemberId: memberId
      };
      await setDoc(doc(db, 'users', user.username), updatedUser, { merge: true });

      const membersQuery = query(collection(db, 'families', familyId, 'members'));
      const membersSnapshot = await getDocs(membersQuery);
      const members = membersSnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as FamilyMember[];

      set({
        user: updatedUser,
        family: {
          id: familyId,
          name: familyData.name,
          inviteCode: familyData.inviteCode,
          members,
          createdAt: familyData.createdAt || new Date().toISOString()
        },
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
      localStorage.removeItem('auth_username');
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
