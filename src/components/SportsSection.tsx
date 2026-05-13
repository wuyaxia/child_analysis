import { Bike, Waves, Dumbbell, Sword, CircleDot, Trophy, Star } from 'lucide-react';

export default function SportsSection() {
  const firstTier = [
    {
      icon: <Bike className="w-10 h-10" />,
      title: '儿童平衡车',
      emoji: '🚴',
      benefits: ['不需要强对抗', '成就反馈快', '身体控制感强', '自信提升明显'],
      reason: '特别适合慢热、敏感的孩子，很多胆小孩子会因为骑车变得大胆！',
      highlight: '推荐指数 ⭐⭐⭐⭐⭐'
    },
    {
      icon: <Waves className="w-10 h-10" />,
      title: '游泳',
      emoji: '🏊',
      benefits: ['提升身体觉醒', '增强核心力量', '改善情绪稳定', '天然降低焦虑'],
      reason: '水环境会天然降低焦虑，对高敏感孩子非常友好！',
      highlight: '推荐指数 ⭐⭐⭐⭐⭐'
    },
    {
      icon: <Dumbbell className="w-10 h-10" />,
      title: '儿童体适能',
      emoji: '🏃',
      benefits: ['跑跳', '平衡', '障碍', '翻滚', '攀爬'],
      reason: '这类课比「技术型运动」更适合3岁孩子！',
      highlight: '推荐指数 ⭐⭐⭐⭐'
    }
  ];

  const secondTier = [
    {
      icon: <Sword className="w-8 h-8" />,
      title: '武术 / 跆拳道',
      emoji: '🥋',
      note: '适合5岁后',
      reason: '现在可能太早，3岁很多课程其实是排队、指令、纪律，对敏感孩子可能压力偏大。'
    },
    {
      icon: <CircleDot className="w-8 h-8" />,
      title: '球类运动',
      emoji: '⚽',
      note: '适合以后',
      reason: '现在规则复杂、挫败多、等待多，可能容易崩溃。'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-3xl shadow-xl p-6 md:p-8 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full opacity-30 -translate-y-32 translate-x-32"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-3 rounded-xl text-white shadow-lg">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">运动建议</h2>
            <p className="text-orange-600">让孩子动起来，收获更多成长！</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <Star className="w-6 h-6 text-yellow-500" />
            <p className="text-orange-800 font-bold text-lg">
              运动应该成为未来3年的核心养育策略之一
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['💪 身体控制感', '🏆 成就感', '🎯 多巴胺建立', '🌱 挫折耐受训练', '👫 社交暴露'].map((item, i) => (
              <span key={i} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                {item}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></span>
            🥇 第一梯队（最推荐）
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {firstTier.map((sport, index) => (
              <div key={index} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-shadow border-2 border-transparent hover:border-orange-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl p-3 text-white shadow-lg">
                    {sport.icon}
                  </div>
                  <span className="text-4xl">{sport.emoji}</span>
                </div>
                <h4 className="font-bold text-gray-800 text-lg mb-2">{sport.title}</h4>
                <div className="flex flex-wrap gap-1 mb-3">
                  {sport.benefits.map((benefit, i) => (
                    <span key={i} className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full text-xs">
                      {benefit}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-2">{sport.reason}</p>
                <div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium inline-block">
                  {sport.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-gray-500 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
            🥈 第二梯队（稍后考虑）
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {secondTier.map((sport, index) => (
              <div key={index} className="bg-white/80 rounded-2xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-gray-400 rounded-xl p-3 text-white">
                    {sport.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-700">{sport.title}</h4>
                    <span className="text-gray-400 text-sm">⏰ {sport.note}</span>
                  </div>
                  <span className="text-3xl ml-auto">{sport.emoji}</span>
                </div>
                <p className="text-gray-600 text-sm">{sport.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}