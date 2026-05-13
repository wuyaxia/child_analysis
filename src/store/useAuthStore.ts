import { create } from 'zustand';
import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  signOut,
  onAuthStateChanged,
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
  confirmationResult: any; // 用于保存确认对象
  
  // Actions
  sendVerificationCode: (phone: string) => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
  createFamily: (name: string, role: FamilyRole, nickname: string) => Promise<void>;
  joinFamily: (inviteCode: string, role: FamilyRole, nickname: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  initAuth: () => () => void;
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
  confirmationResult: null,

  initAuth: () => {
    return onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        set({ firebaseUser: fbUser });
        
        // 获取用户数据
        const phone = fbUser.phoneNumber;
        if (phone) {
          const userDoc = await getDoc(doc(db, 'users', phone));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            set({ user: userData });
            
            // 如果用户已有家庭，加载家庭数据
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
                
                // 查找当前成员
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
        }
      } else {
        set({ 
          firebaseUser: null, 
          user: null, 
          family: null, 
          currentMember: null 
        });
      }
    });
  },

  sendVerificationCode: async (phone: string) => {
    set({ isLoading: true, error: null });
    try {
      const phoneNumber = phone.startsWith('+86') ? phone : `+86${phone}`;
      
      // 先确保 reCAPTCHA 容器存在
      let recaptchaContainer = document.getElementById('recaptcha-container');
      if (!recaptchaContainer) {
        recaptchaContainer = document.createElement('div');
        recaptchaContainer.id = 'recaptcha-container';
        document.body.appendChild(recaptchaContainer);
      }
      
      // 创建 reCAPTCHA 验证器
      const appVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });

      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      set({ confirmationResult, isLoading: false });
    } catch (error: any) {
      console.error('发送验证码失败:', error);
      set({ error: error.message || '发送验证码失败', isLoading: false });
    }
  },

  verifyCode: async (code: string) => {
    set({ isLoading: true, error: null });
    try {
      const { confirmationResult } = get();
      if (!confirmationResult) {
        throw new Error('请先获取验证码');
      }

      const result = await confirmationResult.confirm(code);
      const fbUser = result.user;
      const phone = fbUser.phoneNumber;
      
      if (!phone) {
        throw new Error('登录失败');
      }
      
      // 处理用户数据
      const userDoc = await getDoc(doc(db, 'users', phone));
      
      let userData: User;
      if (userDoc.exists()) {
        userData = userDoc.data() as User;
      } else {
        // 创建新用户
        userData = {
          phone,
          familyId: null,
          currentMemberId: null,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', phone), userData);
      }
      
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

  logout: async () => {
    try {
      await signOut(auth);
      set({ 
        firebaseUser: null,
        user: null, 
        family: null, 
        currentMember: null 
      });
    } catch (error: any) {
      console.error('退出登录失败:', error);
      set({ error: error.message || '退出失败' });
    }
  },

  clearError: () => set({ error: null })
}));
