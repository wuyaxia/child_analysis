import { AlertCircle, Lightbulb, Brain, Gamepad2, Footprints } from 'lucide-react';

export default function ProblemAnalysis() {
  const problems = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: '必须爸爸拿玩具，否则崩溃',
      essence: '幼儿对秩序感 + 控制感的强需求',
      explanation: '3岁孩子的大脑对「预期」极度敏感，一旦现实和预期不一致，大脑会直接进入情绪系统。他要的未必是玩具，而是「必须按我脑子里的方式发生」。',
      highlight: '主要发生在闹困时',
      color: 'blue'
    },
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: '玩具卡住直接大哭',
      essence: '抗挫能力偏低 + 情绪调节弱',
      explanation: '重要的积极信号：哭完能讲道理，还能复述。这意味着理解力没问题，认知能力不错，不是完全失控型孩子。问题主要在「情绪上头时无法处理」。',
      highlight: '情绪能力发展滞后于理解能力',
      color: 'purple'
    },
    {
      icon: <Footprints className="w-8 h-8" />,
      title: '出门不愿走路',
      essence: '依赖型安全需求 + 内驱探索欲偏弱 + 体能可能偏弱',
      explanation: '环境不熟、不感兴趣、人多、刺激复杂时会自动回到「依附模式」。有些孩子天然是观察型、慢热型，需要外部动机。',
      highlight: '长期靠抱会弱化自主行动意愿',
      color: 'green'
    }
  ];

  const colorMap = {
    blue: { bg: 'bg-blue-500', bgLight: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', light: 'bg-blue-100' },
    purple: { bg: 'bg-purple-500', bgLight: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', light: 'bg-purple-100' },
    green: { bg: 'bg-green-500', bgLight: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', light: 'bg-green-100' }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-orange-500" />
        问题背后的本质
      </h2>
      
      <div className="space-y-6">
        {problems.map((problem, index) => {
          const colors = colorMap[problem.color as keyof typeof colorMap];
          return (
            <div key={index} className={`${colors.bgLight} rounded-2xl p-6 border ${colors.border}`}>
              <div className="flex items-start gap-4">
                <div className={`${colors.bg} rounded-xl p-3 text-white`}>
                  {problem.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg ${colors.text} mb-2`}>
                    {problem.title}
                  </h3>
                  <div className={`inline-block ${colors.light} ${colors.text} px-3 py-1 rounded-full text-sm font-medium mb-3`}>
                    {problem.essence}
                  </div>
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    {problem.explanation}
                  </p>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{problem.highlight}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">孩子目前最大的核心问题</h3>
        <div className="text-center mb-6">
          <span className="text-3xl font-bold">低耐受 + 高依赖 + 情绪恢复慢</span>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-center text-sm text-indigo-100">
            不舒服 → 崩溃 → 大人立刻满足 → 更依赖 → 下次更难承受
          </p>
        </div>
        <p className="text-center mt-4 font-medium">
          养育目标：四大核心能力建设
        </p>
      </div>
    </div>
  );
}