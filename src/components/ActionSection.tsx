import { Rocket, Bike, Footprints, Users, Target, Moon, CheckCircle2, Sparkles } from 'lucide-react';

export default function ActionSection() {
  const actions = [
    {
      icon: <Bike className="w-8 h-8" />,
      title: '固定一个长期运动项目',
      emoji: '🏃',
      details: ['平衡车', '游泳', '体适能'],
      note: '坚持半年以上',
      color: 'orange'
    },
    {
      icon: <Footprints className="w-8 h-8" />,
      title: '每天减少一点抱',
      emoji: '👣',
      details: ['先自己走到前面那棵树', '再抱'],
      note: '循序渐进',
      color: 'green'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: '建立统一养育原则',
      emoji: '🤝',
      details: ['不因哭立刻妥协', '情绪先接住', '再坚持边界'],
      note: '所有老人统一',
      color: 'blue'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: '每天给一点「可控挑战」',
      emoji: '🎯',
      details: ['自己穿袜子', '自己按电梯', '自己问店员'],
      note: '从小事做起',
      color: 'purple'
    },
    {
      icon: <Moon className="w-8 h-8" />,
      title: '睡眠优先级拉满',
      emoji: '😴',
      details: ['固定午睡', '不过度刺激', '睡醒缓冲时间', '避免太累再出门'],
      note: '规律睡眠可能比讲道理更重要',
      color: 'indigo'
    }
  ];

  const colorMap = {
    orange: { bg: 'bg-gradient-to-br from-orange-500 to-amber-500', light: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
    green: { bg: 'bg-gradient-to-br from-green-500 to-emerald-500', light: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
    blue: { bg: 'bg-gradient-to-br from-blue-500 to-cyan-500', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    purple: { bg: 'bg-gradient-to-br from-purple-500 to-pink-500', light: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
    indigo: { bg: 'bg-gradient-to-br from-indigo-500 to-violet-500', light: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' }
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-3xl shadow-xl p-6 md:p-8 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-30 translate-x-32 -translate-y-32"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl text-white shadow-lg">
            <Rocket className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">最建议立刻开始的5件事</h2>
            <p className="text-orange-600">马上行动，改变从今天开始！🚀</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {actions.map((action, index) => {
            const colors = colorMap[action.color as keyof typeof colorMap];
            return (
              <div key={index} className={`${colors.light} rounded-2xl p-5 border-2 ${colors.border} hover:shadow-lg transition-all hover:-translate-y-1`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${colors.bg} rounded-xl p-3 text-white shadow-md`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <span className="text-2xl">{action.emoji}</span>
                  </div>
                </div>
                <h3 className={`font-bold text-lg ${colors.text} mb-2`}>{action.title}</h3>
                <div className="flex flex-wrap gap-1 mb-3">
                  {action.details.map((detail, i) => (
                    <span key={i} className={`${colors.light} ${colors.text} px-2 py-0.5 rounded-full text-xs font-medium`}>
                      {detail}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="font-medium">{action.note}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 text-9xl opacity-10 -translate-y-8 translate-x-8">
            ✨
          </div>
          
          <div className="relative z-10">
            <p className="text-center text-xl font-medium mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              整体来看，我对这个孩子的未来是偏乐观的
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </p>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4 text-center">
              <p className="text-lg">
                因为你提到一个特别关键的点：<strong className="text-yellow-200">他哭完能理解，也能复述。</strong>
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {['理解力在线', '依恋关系稳定', '可塑性很高'].map((item, i) => (
                <span key={i} className="bg-white/20 px-4 py-1 rounded-full text-sm font-medium">
                  ✓ {item}
                </span>
              ))}
            </div>
            
            <p className="text-center text-2xl font-bold">
              💪 帮他慢慢建立面对世界的<br />
              <span className="bg-yellow-400 text-green-800 px-4 py-1 rounded-full">耐受力与自我控制感</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}