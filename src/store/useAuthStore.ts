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
  
  // Actions
  loginWithPhone: (phone: string, nickname: string, role: FamilyRole) => Promise<void>;
  createFamily: (name: string, role: FamilyRole, nickname: string) => Promise<void>;
  joinFamily: (inviteCode: string, role: FamilyRole, nickname: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// 生成邀请码
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

  loginWithPhone: async (phone: string, nickname: string, role: FamilyRole) => {
    set({ isLoading: true, error: null });
    try {
      // 模拟用户登录（简化版）
      const phoneNumber = phone.startsWith('+86') ? phone : `+86${phone}`;
      const userDoc = await getDoc(doc(db, 'users', phoneNumber));
      
      let userData: User;
      if (userDoc.exists()) {
        userData = userDoc.data() as User;
        set({ user: userData, isLoading: false });
        
        // 如果用户已有家庭，加载家庭数据
        if (userData.familyId) {
          const familyDoc = await getDoc(doc(db, 'families', userData.familyId));
          if (familyDoc.exists()) {
            const familyData = familyDoc.data();
            const membersQuery = query(
              collection(db, 'families', userData.familyId, 'members')
            );
            const membersSnapshot = await getDocs(membersQuery);
            const members = membersSnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as FamilyMember[];
            
            set({ 
              family: { 
                id: userData.familyId, 
                name: familyData.name, 
                inviteCode: familyData.inviteCode,
                members, 
                createdAt: familyData.createdAt || new Date().toISOString() 
              } 
            });
          }
        }
        return;
      }
      
      // 创建新用户
      userData = {
        phone: phoneNumber,
        familyId: null,
        currentMemberId: null,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', phoneNumber), userData);
      set({ user: userData, isLoading: false });
    } catch (error: any) {
      console.error('登录失败:', error);
      set({ error: error.message || '登录失败', isLoading: false });
    }
  },

  createFamily: async (name: string, role: FamilyRole, nickname: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = get();
      if (!user) throw new Error('请先登录');

      const inviteCode = generateInviteCode();

      // 创建家庭文档
      const familyRef = await addDoc(collection(db, 'families'), {
        name,
        inviteCode,
        createdAt: new Date().toISOString()
      });

      // 创建家庭成员（创建者）
      const memberId = user.phone; // 用手机号作为 member ID
      const member: FamilyMember = {
        id: memberId,
        phone: user.phone,
        role,
        nickname,
        joinedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'families', familyRef.id, 'members', memberId), member);

      // 更新用户文档
      const updatedUser: User = {
        ...user,
        familyId: familyRef.id,
        currentMemberId: memberId
      };
      await setDoc(doc(db, 'users', user.phone), updatedUser, { merge: true });

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
      console.error('创建家庭失败:', error);
      set({ error: error.message || '创建家庭失败', isLoading: false });
    }
  },

  joinFamily: async (inviteCode: string, role: FamilyRole, nickname: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = get();
      if (!user) throw new Error('请先登录');

      // 查找家庭
      const familiesQuery = query(
        collection(db, 'families'),
        where('inviteCode', '==', inviteCode)
      );
      const familiesSnapshot = await getDocs(familiesQuery);

      if (familiesSnapshot.empty) {
        throw new Error('邀请码无效');
      }

      const familyDoc = familiesSnapshot.docs[0];
      const familyId = familyDoc.id;
      const familyData = familyDoc.data();

      // 创建家庭成员
      const memberId = user.phone;
      const member: FamilyMember = {
        id: memberId,
        phone: user.phone,
        role,
        nickname,
        joinedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'families', familyId, 'members', memberId), member);

      // 更新用户文档
      const updatedUser: User = {
        ...user,
        familyId,
        currentMemberId: memberId
      };
      await setDoc(doc(db, 'users', user.phone), updatedUser, { merge: true });

      // 获取所有家庭成员
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
      console.error('加入家庭失败:', error);
      set({ error: error.message || '加入家庭失败', isLoading: false });
    }
  },

  logout: () => {
    set({ 
      user: null, 
      family: null, 
      currentMember: null 
    });
  },

  clearError: () => set({ error: null })
}));
