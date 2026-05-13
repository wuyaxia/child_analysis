import { create } from 'zustand';
import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User, Family, FamilyMember, FamilyRole } from '../types';

interface AuthState {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  family: Family | null;
  currentMember: FamilyMember | null;
  isLoading: boolean;
  error: string | null;
  verificationId: string | null;
  
  // Actions
  sendVerificationCode: (phone: string) => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
  createFamily: (name: string, role: FamilyRole, nickname: string) => Promise<void>;
  joinFamily: (inviteCode: string, role: FamilyRole, nickname: string) => Promise<void>;
  logout: () => Promise<void>;
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
  firebaseUser: null,
  user: null,
  family: null,
  currentMember: null,
  isLoading: false,
  error: null,
  verificationId: null,

  sendVerificationCode: async (phone: string) => {
    set({ isLoading: true, error: null });
    try {
      // 创建 reCAPTCHA 验证器（测试环境用 invisible）
      const appVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });

      const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
      set({ verificationId: confirmationResult.verificationId, isLoading: false });
    } catch (error: any) {
      console.error('发送验证码失败:', error);
      set({ error: error.message || '发送验证码失败', isLoading: false });
    }
  },

  verifyCode: async (code: string) => {
    set({ isLoading: true, error: null });
    try {
      const { verificationId } = get();
      if (!verificationId) {
        throw new Error('请先获取验证码');
      }

      // Note: 这里需要用之前保存的 confirmationResult
      // 实际项目中需要保存 confirmationResult 到临时状态
      // 这里简化处理
      
      // 先模拟已登录用户（因为验证码登录需要真实 Firebase 配置）
      // TODO: 真实环境用 signInWithCredential
      const mockUser: Partial<FirebaseUser> = {
        phoneNumber: '+8613800138000',
        uid: 'mock-user-123'
      };

      // 检查用户是否已存在
      const userDoc = await getDoc(doc(db, 'users', mockUser.phoneNumber!));
      
      let userData: User;
      if (userDoc.exists()) {
        userData = userDoc.data() as User;
      } else {
        // 创建新用户
        userData = {
          phone: mockUser.phoneNumber!,
          familyId: null,
          currentMemberId: null,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', userData.phone), userData);
      }

      set({ 
        firebaseUser: mockUser as FirebaseUser, 
        user: userData, 
        isLoading: false 
      });

    } catch (error: any) {
      console.error('验证失败:', error);
      set({ error: error.message || '验证失败', isLoading: false });
    }
  },

  createFamily: async (name: string, role: FamilyRole, nickname: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user, firebaseUser } = get();
      if (!user || !firebaseUser) throw new Error('请先登录');

      const inviteCode = generateInviteCode();

      // 创建家庭文档
      const familyRef = await addDoc(collection(db, 'families'), {
        name,
        inviteCode,
        createdAt: serverTimestamp()
      });

      // 创建家庭成员（创建者）
      const memberId = firebaseUser.uid;
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

      // 获取家庭数据
      const familyDoc = await getDoc(doc(db, 'families', familyRef.id));
      const membersSnapshot = await getDocs(collection(db, 'families', familyRef.id, 'members'));
      const members = membersSnapshot.docs.map(doc => doc.data() as FamilyMember);

      set({ 
        user: updatedUser,
        family: {
          id: familyRef.id,
          name,
          inviteCode,
          members,
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
      const { user, firebaseUser } = get();
      if (!user || !firebaseUser) throw new Error('请先登录');

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
      const memberId = firebaseUser.uid;
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
      const membersSnapshot = await getDocs(collection(db, 'families', familyId, 'members'));
      const members = membersSnapshot.docs.map(doc => doc.data() as FamilyMember);

      set({ 
        user: updatedUser,
        family: {
          id: familyId,
          name: familyData.name,
          inviteCode: familyData.inviteCode,
          members,
          createdAt: new Date().toISOString()
        },
        currentMember: member,
        isLoading: false 
      });

    } catch (error: any) {
      console.error('加入家庭失败:', error);
      set({ error: error.message || '加入家庭失败', isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await signOut(auth);
      set({ 
        firebaseUser: null,
        user: null, 
        family: null, 
        currentMember: null, 
        isLoading: false 
      });
    } catch (error: any) {
      console.error('退出登录失败:', error);
      set({ error: error.message || '退出失败', isLoading: false });
    }
  },

  clearError: () => set({ error: null })
}));
