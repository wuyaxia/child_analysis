import { Heart, Clock, MessageSquare, AlertTriangle, CheckCircle, XCircle, Sparkles } from 'lucide-react';

export default function EmotionalResilience() {
  const practices = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: '情绪先接住，不急着讲道理',
      emoji: '🤗',
      wrong: ['别哭了 ❌', '这有什么 ❌', '男子汉不能这样 ❌'],
      right: ['你本来想让爸爸拿', '结果姥姥拿了，你很难受', '你现在很生气'],
      explanation: '这叫情绪命名，它会让孩子的大脑从情绪区回到语言区。'
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: '崩溃时不要立刻满足',
      emoji: '⏸️',
      wrong: ['哭 → 达成要求 ❌'],
      right: ['共情 ✓', '陪伴 ✓', '允许哭 ✓', '但不一定重来'],
      explanation: '如果每次都重来，大脑会强化「崩溃可以改变世界」。正确方式是：共情、陪伴、允许哭，但不一定满足。'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: '训练「等待能力」',
      emoji: '⏰',
      wrong: ['立刻满足 ❌'],
      right: ['等10秒', '等30秒', '等1分钟'],
      explanation: '从极小开始，并明确倒计时。这是未来情绪稳定的底层能力。'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-xl p-6 md:p-8 mb-8 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="absolute top-0 right-0 text-9xl opacity-10 -translate-y-8 translate-x-8">
        💝
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">情绪恢复力培养（第一优先级）</h2>
            <p className="text-indigo-200">最重要的能力培养 🎯</p>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <p className="text-center text-xl font-medium">
            <Sparkles className="w-5 h-5 inline text-yellow-300" />
            {' '}不是「不哭」，而是从崩溃恢复的速度越来越快{' '}
            <Sparkles className="w-5 h-5 inline text-yellow-300" />
          </p>
        </div>
        
        <div className="space-y-6">
          {practices.map((practice, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-white/20 rounded-xl p-3 text-3xl">
                  {practice.emoji}
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">{practice.title}</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-500/30 rounded-xl p-4 border border-red-400/30">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="w-5 h-5 text-red-300" />
                    <p className="text-red-200 font-bold">❌ 错误方式</p>
                  </div>
                  <ul className="space-y-1">
                    {practice.wrong.map((item, i) => (
                      <li key={i} className="text-red-100">{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-green-500/30 rounded-xl p-4 border border-green-400/30">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <p className="text-green-200 font-bold">✅ 正确做法</p>
                  </div>
                  <ul className="space-y-1">
                    {practice.right.map((item, i) => (
                      <li key={i} className="text-green-100">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 bg-white/10 rounded-xl p-3 flex items-start gap-2">
                <span className="text-xl">💡</span>
                <p className="text-indigo-200 text-sm">{practice.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}