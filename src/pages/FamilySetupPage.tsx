import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Plus, ArrowRight, Flower2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { FamilyRole } from '../types';

const roles = [
  { value: 'father' as FamilyRole, label: '爸爸', icon: '👨' },
  { value: 'mother' as FamilyRole, label: '妈妈', icon: '👩' },
  { value: 'grandpa' as FamilyRole, label: '爷爷', icon: '👴' },
  { value: 'grandma' as FamilyRole, label: '奶奶', icon: '👵' },
  { value: 'other' as FamilyRole, label: '其他', icon: '🧑' },
];

export default function FamilySetupPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'create' | 'join' | null>(null);
  const [familyName, setFamilyName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [role, setRole] = useState<FamilyRole>('mother');
  const [nickname, setNickname] = useState('');
  
  const { user, createFamily, joinFamily, isLoading, error, clearError } = useAuthStore();

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await createFamily(familyName, role, nickname);
    navigate('/');
  };

  const handleJoinFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await joinFamily(inviteCode, role, nickname);
    navigate('/');
  };

  if (!mode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F2D5D0]/20 to-[#AAB794]/20 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="bg-[#D4836C] rounded-2xl p-3">
                <Flower2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[#5D4559] mb-2">
              创建或加入家庭
            </h1>
            <p className="text-[#5D4559]/60">
              开始记录孩子的成长吧
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setMode('create')}
              className="w-full bg-white hover:bg-gray-50 rounded-3xl p-6 text-left shadow-lg transition-all border-2 border-transparent hover:border-[#D4836C]/30"
            >
              <div className="flex items-center gap-4">
                <div className="bg-[#D4836C]/10 rounded-2xl p-4">
                  <Home className="w-8 h-8 text-[#D4836C]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#5D4559]">创建新家庭</h3>
                  <p className="text-[#5D4559]/60 text-sm">您是第一个加入的成员</p>
                </div>
                <ArrowRight className="w-6 h-6 text-[#5D4559]/30" />
              </div>
            </button>

            <button
              onClick={() => setMode('join')}
              className="w-full bg-white hover:bg-gray-50 rounded-3xl p-6 text-left shadow-lg transition-all border-2 border-transparent hover:border-[#AAB794]/30"
            >
              <div className="flex items-center gap-4">
                <div className="bg-[#AAB794]/20 rounded-2xl p-4">
                  <Users className="w-8 h-8 text-[#AAB794]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#5D4559]">加入已有家庭</h3>
                  <p className="text-[#5D4559]/60 text-sm">使用邀请码加入</p>
                </div>
                <ArrowRight className="w-6 h-6 text-[#5D4559]/30" />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2D5D0]/20 to-[#AAB794]/20 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <button
          onClick={() => { setMode(null); clearError(); }}
          className="mb-6 text-[#5D4559]/60 hover:text-[#5D4559] font-medium flex items-center gap-2"
        >
          ← 返回
        </button>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#5D4559] mb-6">
            {mode === 'create' ? '创建家庭' : '加入家庭'}
          </h2>

          <form onSubmit={mode === 'create' ? handleCreateFamily : handleJoinFamily} className="space-y-6">
            {mode === 'create' ? (
              <div>
                <label className="block text-sm font-medium text-[#5D4559] mb-2">
                  家庭名称
                </label>
                <input
                  type="text"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  placeholder="例如：小明一家"
                  className="block w-full px-4 py-3 border-2 border-[#5D4559]/10 rounded-2xl focus:ring-2 focus:ring-[#D4836C] focus:border-[#D4836C]"
                  autoFocus
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-[#5D4559] mb-2">
                  邀请码
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="请输入6位邀请码"
                  maxLength={6}
                  className="block w-full px-4 py-3 border-2 border-[#5D4559]/10 rounded-2xl focus:ring-2 focus:ring-[#AAB794] focus:border-[#AAB794] text-center text-xl tracking-[0.5em] font-mono"
                  autoFocus
                />
              </div>
            )}

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

            <div>
              <label className="block text-sm font-medium text-[#5D4559] mb-2">
                您的称呼
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="例如：妈妈"
                className="block w-full px-4 py-3 border-2 border-[#5D4559]/10 rounded-2xl focus:ring-2 focus:ring-[#D4836C] focus:border-[#D4836C]"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={
                isLoading ||
                !nickname ||
                (mode === 'create' && !familyName) ||
                (mode === 'join' && inviteCode.length < 6)
              }
              className="w-full bg-[#D4836C] hover:bg-[#D4836C]/90 text-white font-semibold py-3 px-6 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? '请稍候...' : (mode === 'create' ? '创建并进入' : '加入家庭')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
