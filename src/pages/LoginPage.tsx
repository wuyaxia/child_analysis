import { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, CheckCircle, Flower2, UserPlus } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const { login, register, isLoading, error, clearError, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/family-setup');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!username || !password) {
      setLocalError('请填写所有字段');
      return;
    }

    if (isRegister) {
      if (password !== confirmPassword) {
        setLocalError('两次密码输入不一致');
        return;
      }
      if (password.length < 6) {
        setLocalError('密码长度至少6位');
        return;
      }

      try {
        await register(username, password);
      } catch (err: any) {
        setLocalError(err.message || '注册失败');
      }
    } else {
      try {
        await login(username, password);
      } catch (err: any) {
        setLocalError(err.message || '登录失败');
      }
    }
  };

  const displayError = localError || error;

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
            儿童成长中心
          </h1>
          <p className="text-[#5D4559]/60">
            {isRegister ? '创建账号，开始记录' : '欢迎回来'}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#5D4559] mb-2">
                用户名
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#5D4559]/40" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={isRegister ? '设置用户名' : '输入用户名'}
                  className="block w-full pl-12 pr-4 py-3 border-2 border-[#5D4559]/10 rounded-2xl focus:ring-2 focus:ring-[#D4836C] focus:border-[#D4836C] transition-all"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5D4559] mb-2">
                密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#5D4559]/40" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isRegister ? '设置密码（至少6位）' : '输入密码'}
                  className="block w-full pl-12 pr-4 py-3 border-2 border-[#5D4559]/10 rounded-2xl focus:ring-2 focus:ring-[#D4836C] focus:border-[#D4836C] transition-all"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-[#5D4559] mb-2">
                  确认密码
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#5D4559]/40" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="再次输入密码"
                    className="block w-full pl-12 pr-4 py-3 border-2 border-[#5D4559]/10 rounded-2xl focus:ring-2 focus:ring-[#D4836C] focus:border-[#D4836C] transition-all"
                  />
                </div>
              </div>
            )}

            {displayError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
                {displayError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !username || !password || (isRegister && !confirmPassword)}
              className="w-full bg-[#D4836C] hover:bg-[#D4836C]/90 text-white font-semibold py-3 px-6 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (isRegister ? '注册中...' : '登录中...') : (isRegister ? '注册' : '登录')}
              {!isLoading && (isRegister ? <UserPlus className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />)}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setLocalError(null);
                  clearError();
                }}
                className="text-[#D4836C] hover:text-[#D4836C]/80 font-medium"
              >
                {isRegister ? '已有账号？立即登录' : '没有账号？立即注册'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-[#5D4559]/60">
          <p>登录即表示同意我们的服务条款</p>
        </div>
      </div>
    </div>
  );
}
