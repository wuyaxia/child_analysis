import { TrendingUp, Target, Calendar } from 'lucide-react';

export default function RoadmapSection() {
  const stages = [
    {
      age: '3~4岁',
      title: '打基础阶段',
      focus: ['建立安全感', '建立规则感', '提升体能', '提升情绪恢复力'],
      avoid: '不要追求「外向」',
      color: 'blue'
    },
    {
      age: '4~5岁',
      title: '扩展能力阶段',
      focus: ['增加独立任务', '增加同伴活动', '增加小责任感'],
      avoid: '',
      color: 'green'
    },
    {
      age: '5~6岁',
      title: '巩固成长阶段',
      focus: ['抗挫', '专注', '自主解决问题'],
      avoid: '',
      color: 'purple'
    }
  ];

  const colorMap = {
    blue: { bg: 'bg-blue-500', bgLight: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
    green: { bg: 'bg-green-500', bgLight: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' },
    purple: { bg: 'bg-purple-500', bgLight: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' }
  };

  const indicators = [
    { text: '崩溃恢复时间是否缩短', example: '以前20分钟 → 以后5分钟' },
    { text: '是否越来越能接受「不按自己预期」', example: '这是成熟核心' },
    { text: '是否敢尝试一点点陌生东西', example: '哪怕只进步10%' },
    { text: '是否愿意自己完成一些事情', example: '这是自信来源' }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-indigo-500" />
        <h2 className="text-2xl font-bold text-gray-800">阶段性发展路线</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stages.map((stage, index) => {
          const colors = colorMap[stage.color as keyof typeof colorMap];
          return (
            <div key={index} className={`${colors.bgLight} rounded-2xl p-6 border ${colors.border}`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`${colors.bg} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                  {stage.age}
                </span>
                <TrendingUp className={`w-5 h-5 ${colors.text}`} />
              </div>
              <h3 className={`font-bold text-lg ${colors.text} mb-3`}>{stage.title}</h3>
              <ul className="space-y-2">
                {stage.focus.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <Target className="w-4 h-4" />
                    {item}
                  </li>
                ))}
              </ul>
              {stage.avoid && (
                <p className="mt-4 text-amber-600 text-sm font-medium">
                  ⚠️ {stage.avoid}
                </p>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          一个非常关键的判断标准
        </h3>
        <p className="text-indigo-200 mb-4">
          你们未来不要看「孩子还哭不哭」，而看以下指标是否在变好：
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {indicators.map((indicator, index) => (
            <div key={index} className="bg-white/10 rounded-xl p-4">
              <p className="font-medium">{indicator.text}</p>
              <p className="text-indigo-200 text-sm mt-1">{indicator.example}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}