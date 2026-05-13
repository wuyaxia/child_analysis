import { useState } from 'react';
import { Phone, ArrowRight, CheckCircle, Flower2, User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { FamilyRole } from '../types';

const roles = [
  { value: 'mother' as FamilyRole, label: '妈妈', icon: '👩' },
  { value: 'father' as FamilyRole, label: '爸爸', icon: '👨' },
  { value: 'grandma' as FamilyRole, label: '奶奶', icon: '👵' },
  { value: 'grandpa' as FamilyRole, label: '爷爷', icon: '👴' },
  { value: 'other' as FamilyRole, label: '其他', icon: '🧑' },
];

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [nickname, setNickname] = useState('');
  const [role, setRole] = useState<FamilyRole>('mother');
  const { loginWithPhone, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginWithPhone(phone, nickname, role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2D5D0]/20 to-[#AAB794]/20 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-[#D4836C] rounded-2xl p-3">
              <Flower2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#5D4559] mb-2">
            儿童成长中心
          </h1>
          <p className="text-[#5D4559]/60">
            记录美好，陪伴成长
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#5D4559] mb-2">
                您的手机号
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-[#5D4559]/40" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="请输入手机号（11位）"
                  maxLength={11}
                  className="block w-full pl-12 pr-4 py-3 border-2 border-[#5D4559]/10 rounded-2xl focus:ring-2 focus:ring-[#D4836C] focus:border-[#D4836C] transition-all"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5D4559] mb-2">
                您的称呼
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#5D4559]/40" />
                </div>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="例如：妈妈"
                  className="block w-full pl-12 pr-4 py-3 border-2 border-[#5D4559]/10 rounded-2xl focus:ring-2 focus:ring-[#D4836C] focus:border-[#D4836C] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5D4559] mb-3">
                您的角色
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`p-4 rounded-2xl text-center transition-all border-2 ${
                      role === r.value
                        ? 'border-[#D4836C] bg-[#D4836C]/10'
                        : 'border-[#5D4559]/10 hover:border-[#5D4559]/20'
                    }`}
                  >
                    <span className="text-3xl">{r.icon}</span>
                    <p className={`text-sm font-medium mt-1 ${
                      role === r.value ? 'text-[#D4836C]' : 'text-[#5D4559]/70'
                    }`}>
                      {r.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={phone.length !== 11 || !nickname || isLoading}
              className="w-full bg-[#D4836C] hover:bg-[#D4836C]/90 text-white font-semibold py-3 px-6 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? '请稍候...' : '开始使用'}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <p className="text-center text-xs text-[#5D4559]/50 mt-6">
            提示：此版本为简化版登录，无需验证码即可测试 Firestore 数据同步
          </p>
        </div>
      </div>
    </div>
  );
}
