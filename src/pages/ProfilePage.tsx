import { useState } from 'react';
import { User, Settings, LogOut, Users, Baby, Copy, Share2, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { useChildrenStore } from '../store/useChildrenStore';
import MigrationGuide from '../components/features/migration/MigrationGuide';

export default function ProfilePage() {
  const navigate = useNavigate();
  const store = useAppStore();
  const { user, family, currentMember, logout } = useAuthStore();
  const { children } = useChildrenStore();
  const [copied, setCopied] = useState(false);

  const handleCopyInviteCode = async () => {
    if (family?.inviteCode) {
      await navigator.clipboard.writeText(family.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const roleLabels: Record<string, string> = {
    father: '爸爸',
    mother: '妈妈',
    grandpa: '爷爷',
    grandma: '奶奶',
    other: '其他'
  };

  const roleIcons: Record<string, string> = {
    father: '👨',
    mother: '👩',
    grandpa: '👴',
    grandma: '👵',
    other: '🧑'
  };

  return (
    <div className="min-h-screen pb-28">
      {/* 顶部区域 */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full dots-bg opacity-60" />
        <div className="relative z-10 px-6 pt-10 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#5D4559]/10 rounded-2xl p-2">
              <User className="w-7 h-7 text-[#5D4559]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#5D4559]">个人中心</h1>
              <p className="text-[#5D4559]/60 text-sm">
                {currentMember ? `${roleLabels[currentMember.role]} · ${currentMember.nickname}` : '管理您的数据和设置'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* 家庭信息卡片 */}
        {family && (
          <div className="organic-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#5D4559] flex items-center gap-2">
                <Home className="w-5 h-5 text-[#D4836C]" />
                {family.name}
              </h3>
            </div>
            
            <div className="space-y-4">
              {/* 邀请码 */}
              <div className="flex items-center justify-between p-4 bg-[#F7DBA7]/20 rounded-2xl">
                <div>
                  <p className="text-sm text-[#5D4559]/60 mb-1">家庭邀请码</p>
                  <p className="text-2xl font-bold font-mono tracking-widest text-[#5D4559]">
                    {family.inviteCode}
                  </p>
                </div>
                <button
                  onClick={handleCopyInviteCode}
                  className="bg-[#D4836C] hover:bg-[#D4836C]/90 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
                >
                  {copied ? '已复制 ✓' : <><Copy className="w-4 h-4" /> 复制</>}
                </button>
              </div>

              {/* 家庭成员列表 */}
              <div>
                <p className="text-sm text-[#5D4559]/60 mb-3">家庭成员</p>
                <div className="flex flex-wrap gap-2">
                  {family.members?.map((member) => (
                    <div
                      key={member.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                        member.id === currentMember?.id
                          ? 'bg-[#D4836C]/10 ring-1 ring-[#D4836C]/30'
                          : 'bg-gray-50'
                      }`}
                    >
                      <span className="text-xl">{roleIcons[member.role] || '🧑'}</span>
                      <span className="font-medium text-[#5D4559]">{member.nickname}</span>
                      {member.id === currentMember?.id && (
                        <span className="text-xs text-[#D4836C]">（我）</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 孩子信息 */}
        <div className="organic-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#5D4559] flex items-center gap-2">
              <Baby className="w-5 h-5 text-[#D4836C]" />
              我的孩子
            </h3>
            <button
              onClick={() => navigate('/children')}
              className="text-[#D4836C] text-sm font-medium"
            >
              管理
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {children.map((child) => (
              <div
                key={child.id}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl"
              >
                <span className="text-xl">{child.gender === 'boy' ? '👦' : '👧'}</span>
                <span className="font-medium text-[#5D4559]">{child.name}</span>
              </div>
            ))}
            {children.length === 0 && (
              <p className="text-[#5D4559]/60 text-sm">还没有添加孩子</p>
            )}
          </div>
        </div>

        {/* 数据统计 */}
        <div className="organic-card p-6">
          <h3 className="text-lg font-bold text-[#5D4559] mb-5">数据统计</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-4xl font-bold text-[#D4836C] mb-1">{store.growthRecords.length}</div>
              <p className="text-xs text-[#5D4559]/60">成长记录</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#AAB794] mb-1">{store.tasks.length}</div>
              <p className="text-xs text-[#5D4559]/60">任务</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#5D4559] mb-1">{store.milestones.length}</div>
              <p className="text-xs text-[#5D4559]/60">里程碑</p>
            </div>
          </div>
        </div>

        {/* 设置 */}
        <div className="organic-card p-6">
          <h3 className="text-lg font-bold text-[#5D4559] mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#D4836C]" />
            设置
          </h3>
          <div className="space-y-3">
            <button
              onClick={logout}
              className="w-full flex items-center gap-4 p-4 bg-red-50 hover:bg-red-100 rounded-2xl text-red-500 transition-all"
            >
              <LogOut className="w-6 h-6" />
              <div className="text-left flex-1">
                <p className="font-semibold">退出登录</p>
                <p className="text-xs text-red-400">退出当前账号</p>
              </div>
            </button>
          </div>
        </div>

        {/* 关于 */}
        <div className="text-center py-8 text-[#5D4559]/50 text-sm">
          <p className="font-medium">儿童成长中心 v1.0</p>
          <p className="mt-2">用心记录，陪伴成长 💛</p>
        </div>
      </div>
    </div>
  );
}
