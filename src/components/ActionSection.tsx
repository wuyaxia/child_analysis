import { Rocket, Bike, Footprints, Users, Target, Moon } from 'lucide-react';

export default function ActionSection() {
  const actions = [
    {
      icon: <Bike className="w-8 h-8" />,
      title: '固定一个长期运动项目',
      details: ['平衡车', '游泳', '体适能'],
      note: '坚持半年以上',
      color: 'orange'
    },
    {
      icon: <Footprints className="w-8 h-8" />,
      title: '每天减少一点抱',
      details: ['「先自己走到前面那棵树」', '再抱'],
      note: '循序渐进',
      color: 'green'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: '建立统一养育原则',
      details: ['不因哭立刻妥协', '情绪先接住', '再坚持边界'],
      note: '所有老人统一',
      color: 'blue'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: '每天给一点「可控挑战」',
      details: ['自己穿袜子', '自己按电梯', '自己问店员'],
      note: '从小事做起',
      color: 'purple'
    },
    {
      icon: <Moon className="w-8 h-8" />,
      title: '睡眠优先级拉满',
      details: ['固定午睡', '不过度刺激', '睡醒缓冲时间', '避免太累再出门'],
      note: '规律睡眠可能比讲道理更重要',
      color: 'indigo'
    }
  ];

  const colorMap = {
    orange: { bg: 'bg-orange-500', bgLight: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', light: 'bg-orange-100' },
    green: { bg: 'bg-green-500', bgLight: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', light: 'bg-green-100' },
    blue: { bg: 'bg-blue-500', bgLight: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', light: 'bg-blue-100' },
    purple: { bg: 'bg-purple-500', bgLight: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', light: 'bg-purple-100' },
    indigo: { bg: 'bg-indigo-500', bgLight: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600', light: 'bg-indigo-100' }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Rocket className="w-6 h-6 text-amber-500" />
        <h2 className="text-2xl font-bold text-gray-800">最建议立刻开始的5件事</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => {
          const colors = colorMap[action.color as keyof typeof colorMap];
          return (
            <div key={index} className={`${colors.bgLight} rounded-2xl p-5 border ${colors.border}`}>
              <div className={`${colors.bg} rounded-xl p-3 text-white w-fit mb-4`}>
                {action.icon}
              </div>
              <h3 className={`font-bold text-lg ${colors.text} mb-3`}>{action.title}</h3>
              <div className="flex flex-wrap gap-1 mb-3">
                {action.details.map((detail, i) => (
                  <span key={i} className={`${colors.light} ${colors.text} px-2 py-1 rounded-full text-xs`}>
                    {detail}
                  </span>
                ))}
              </div>
              <p className="text-gray-600 text-sm font-medium">{action.note}</p>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
        <p className="text-center text-lg font-medium mb-4">
          整体来看，我对这个孩子的未来是偏乐观的
        </p>
        <p className="text-center text-green-100">
          因为你提到一个特别关键的点：<strong>他哭完能理解，也能复述。</strong>
        </p>
        <div className="mt-4 flex justify-center">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <p className="text-green-100">
              这说明：理解力在线 · 依恋关系稳定 · 可塑性很高
            </p>
          </div>
        </div>
        <p className="text-center mt-4 text-xl font-bold">
          帮他慢慢建立面对世界的耐受力与自我控制感
        </p>
      </div>
    </div>
  );
}