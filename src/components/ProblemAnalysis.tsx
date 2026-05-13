import { Brain, Gamepad2, Footprints, Lightbulb, MessageCircleQuestion, ArrowRight } from 'lucide-react';

export default function ProblemAnalysis() {
  const problems = [
    {
      icon: <Brain className="w-10 h-10" />,
      title: '必须爸爸拿玩具，否则崩溃',
      essence: '幼儿对秩序感 + 控制感的强需求',
      emoji: '🧠',
      explanation: '3岁孩子的大脑对「预期」极度敏感，一旦现实和预期不一致，大脑会直接进入情绪系统。',
      highlight: '主要发生在闹困时 💤',
      color: 'blue',
      bgPattern: 'bg-gradient-to-br from-blue-50 to-indigo-100'
    },
    {
      icon: <Gamepad2 className="w-10 h-10" />,
      title: '玩具卡住直接大哭',
      essence: '抗挫能力偏低 + 情绪调节弱',
      emoji: '🎮',
      explanation: '重要的积极信号：哭完能讲道理，还能复述。这意味着理解力没问题，认知能力不错。',
      highlight: '情绪能力发展滞后于理解能力 📈',
      color: 'purple',
      bgPattern: 'bg-gradient-to-br from-purple-50 to-pink-100'
    },
    {
      icon: <Footprints className="w-10 h-10" />,
      title: '出门不愿走路',
      essence: '依赖型安全需求 + 内驱探索欲偏弱',
      emoji: '👣',
      explanation: '环境不熟、不感兴趣、人多、刺激复杂时会自动回到「依附模式」。',
      highlight: '长期靠抱会弱化自主行动意愿 ⚠️',
      color: 'green',
      bgPattern: 'bg-gradient-to-br from-green-50 to-emerald-100'
    }
  ];

  const colorMap = {
    blue: { bg: 'bg-blue-500', border: 'border-blue-300', text: 'text-blue-600', light: 'bg-blue-100', dark: 'bg-blue-600' },
    purple: { bg: 'bg-purple-500', border: 'border-purple-300', text: 'text-purple-600', light: 'bg-purple-100', dark: 'bg-purple-600' },
    green: { bg: 'bg-green-500', border: 'border-green-300', text: 'text-green-600', light: 'bg-green-100', dark: 'bg-green-600' }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircleQuestion className="w-8 h-8 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-800">问题背后的本质</h2>
      </div>
      
      <div className="space-y-6">
        {problems.map((problem, index) => {
          const colors = colorMap[problem.color as keyof typeof colorMap];
          return (
            <div key={index} className={`${problem.bgPattern} rounded-2xl p-6 border ${colors.border} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 text-9xl opacity-10 -translate-y-4 translate-x-4">
                {problem.emoji}
              </div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-start gap-4">
                <div className={`${colors.bg} rounded-2xl p-4 text-white shadow-lg`}>
                  {problem.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{problem.emoji}</span>
                    <h3 className={`font-bold text-xl ${colors.text}`}>
                      {problem.title}
                    </h3>
                  </div>
                  
                  <div className={`inline-block ${colors.light} ${colors.text} px-4 py-1.5 rounded-full text-sm font-bold mb-3`}>
                    ✨ {problem.essence}
                  </div>
                  
                  <p className="text-gray-700 mb-3 leading-relaxed text-lg">
                    {problem.explanation}
                  </p>
                  
                  <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-xl">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-700 font-medium">{problem.highlight}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 text-8xl opacity-10 -translate-y-8 translate-x-8">
          ⚡
        </div>
        
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-6 text-center">🎯 孩子目前最大的核心问题</h3>
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-sm px-8 py-4 rounded-2xl">
              <span className="text-3xl">📉</span>
              <span className="text-4xl font-bold">低耐受</span>
              <span className="text-2xl">+</span>
              <span className="text-3xl">🤝</span>
              <span className="text-4xl font-bold">高依赖</span>
              <span className="text-2xl">+</span>
              <span className="text-3xl">⏰</span>
              <span className="text-4xl font-bold">情绪恢复慢</span>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4 mb-4">
            <p className="text-center text-lg">
              💔 不舒服 → 😢 崩溃 → 🎁 大人立刻满足 → 😮‍💨 更依赖 → 🔄 下次更难承受
            </p>
          </div>
          
          <p className="text-center text-xl font-medium">
            💡 所以你们未来养育目标应该是：<span className="bg-yellow-400 text-indigo-900 px-4 py-1 rounded-full">四大核心能力建设</span>
          </p>
        </div>
      </div>
    </div>
  );
}