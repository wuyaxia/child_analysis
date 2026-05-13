import { useState } from 'react';
import { Phone, ArrowRight, CheckCircle, Flower2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginPage() {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const { sendVerificationCode, verifyCode, isLoading, error, clearError } = useAuthStore();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    clearError();
    // 格式化手机号（添加国家码）
    const formattedPhone = phone.startsWith('+') ? phone : `+86${phone}`;
    await sendVerificationCode(formattedPhone);
    if (!error) {
      setStep('code');
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    await verifyCode(code);
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
            用心记录，陪伴成长
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {step === 'phone' ? (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#5D4559] mb-2">
                  手机号
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-[#5D4559]/40" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="请输入手机号"
                    className="block w-full pl-12 pr-4 py-3 border-2 border-[#5D4559]/10 rounded-2xl focus:ring-2 focus:ring-[#D4836C] focus:border-[#D4836C] transition-all"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!phone || isLoading}
                className="w-full bg-[#D4836C] hover:bg-[#D4836C]/90 text-white font-semibold py-3 px-6 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? '发送中...' : '获取验证码'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#5D4559] mb-2">
                  验证码
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="请输入验证码"
                  maxLength={6}
                  className="block w-full px-4 py-3 border-2 border-[#5D4559]/10 rounded-2xl focus:ring-2 focus:ring-[#D4836C] focus:border-[#D4836C] transition-all text-center text-2xl tracking-[0.5em] font-mono"
                  autoFocus
                />
                <p className="text-center text-[#5D4559]/50 text-sm mt-3">
                  验证码已发送至 {phone}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={code.length < 6 || isLoading}
                  className="w-full bg-[#D4836C] hover:bg-[#D4836C]/90 text-white font-semibold py-3 px-6 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? '验证中...' : '登录'}
                  <CheckCircle className="w-5 h-5" />
                </button>
                
                <button
                  type="button"
                  onClick={() => { setStep('phone'); clearError(); }}
                  className="w-full text-[#5D4559]/60 hover:text-[#5D4559] font-medium py-2"
                >
                  返回修改手机号
                </button>
              </div>
            </form>
          )}
        </div>

        {/* reCAPTCHA 占位符（必需） */}
        <div id="recaptcha-container" className="hidden"></div>
      </div>
    </div>
  );
}
