import { TrendingUp, Target, Calendar, CheckCircle2, Star } from 'lucide-react';

export default function RoadmapSection() {
  const stages = [
    {
      age: '3~4岁',
      title: '打基础阶段',
      emoji: '🌱',
      focus: ['建立安全感', '建立规则感', '提升体能', '提升情绪恢复力'],
      avoid: '不要追求「外向」',
      color: 'blue'
    },
    {
      age: '4~5岁',
      title: '扩展能力阶段',
      emoji: '🌿',
      focus: ['增加独立任务', '增加同伴活动', '增加小责任感'],
      avoid: '',
      color: 'green'
    },
    {
      age: '5~6岁',
      title: '巩固成长阶段',
      emoji: '🌳',
      focus: ['抗挫', '专注', '自主解决问题'],
      avoid: '',
      color: 'purple'
    }
  ];

  const colorMap = {
    blue: { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-300' },
    green: { bg: 'bg-green-500', light: 'bg-green-50', text: 'text-green-600', border: 'border-green-300' },
    purple: { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-300' }
  };

  const indicators = [
    { emoji: '⏱️', text: '崩溃恢复时间是否缩短', example: '以前20分钟 → 以后5分钟' },
    { emoji: '🎯', text: '是否越来越能接受「不按自己预期」', example: '这是成熟核心' },
    { emoji: '🚀', text: '是否敢尝试一点点陌生东西', example: '哪怕只进步10%' },
    { emoji: '💪', text: '是否愿意自己完成一些事情', example: '这是自信来源' }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl text-white shadow-lg">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">阶段性发展路线</h2>
            <p className="text-gray-500">一步一步，静待花开 🌸</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stages.map((stage, index) => {
            const colors = colorMap[stage.color as keyof typeof colorMap];
            return (
              <div key={index} className={`${colors.light} rounded-2xl p-6 border-2 ${colors.border} relative overflow-hidden`}>
                <div className="absolute top-0 right-0 text-8xl opacity-20 -translate-y-4 translate-x-4">
                  {stage.emoji}
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`${colors.bg} text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md`}>
                      {stage.age}
                    </span>
                    <TrendingUp className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-3xl">{stage.emoji}</span>
                    <h3 className={`font-bold text-lg ${colors.text}`}>{stage.title}</h3>
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    {stage.focus.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle2 className={`w-5 h-5 ${colors.text}`} />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {stage.avoid && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                      <p className="text-amber-700 text-sm font-medium">⚠️ {stage.avoid}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 text-8xl opacity-10 -translate-y-4 translate-x-4">
            🎯
          </div>
          
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-300" />
              一个非常关键的判断标准
            </h3>
            <p className="text-indigo-200 mb-4 text-lg">
              你们未来不要看「孩子还哭不哭」，而看以下指标是否在变好：
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {indicators.map((indicator, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3">
                  <span className="text-3xl">{indicator.emoji}</span>
                  <div>
                    <p className="font-medium text-lg">{indicator.text}</p>
                    <p className="text-indigo-200 text-sm">{indicator.example}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}