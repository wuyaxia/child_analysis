import { Bike, Waves, Dumbbell, Sword, CircleDot } from 'lucide-react';

export default function SportsSection() {
  const firstTier = [
    {
      icon: <Bike className="w-8 h-8" />,
      title: '儿童平衡车 / 骑行类',
      benefits: ['不需要强对抗', '成就反馈快', '身体控制感强', '自信提升明显'],
      reason: '特别适合慢热、敏感、不爱社交的孩子，很多胆小孩子会因为骑车变得大胆。'
    },
    {
      icon: <Waves className="w-8 h-8" />,
      title: '游泳',
      benefits: ['提升身体觉醒', '增强核心力量', '改善情绪稳定', '天然降低焦虑'],
      reason: '水环境会天然降低焦虑，对高敏感孩子非常友好。'
    },
    {
      icon: <Dumbbell className="w-8 h-8" />,
      title: '儿童体适能',
      benefits: ['跑跳', '平衡', '障碍', '翻滚', '攀爬'],
      reason: '这类课比「技术型运动」更适合3岁孩子。'
    }
  ];

  const secondTier = [
    {
      icon: <Sword className="w-8 h-8" />,
      title: '武术 / 跆拳道',
      note: '5岁后更合适',
      reason: '现在可能太早，3岁很多课程其实是排队、指令、纪律，对敏感孩子可能压力偏大。'
    },
    {
      icon: <CircleDot className="w-8 h-8" />,
      title: '球类（足球、篮球）',
      note: '适合以后',
      reason: '现在规则复杂、挫败多、等待多，可能容易崩溃。'
    }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <Dumbbell className="w-6 h-6 text-orange-500" />
        运动建议
      </h2>
      
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 mb-6 border border-orange-200">
        <p className="text-orange-800 font-medium text-center">
          运动应该成为未来3年的核心养育策略之一
        </p>
        <p className="text-orange-600 text-sm text-center mt-1">
          身体控制感 · 成就感 · 多巴胺建立 · 挫折耐受训练 · 社交暴露
        </p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-bold text-blue-600 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          第一梯队（最推荐）
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {firstTier.map((sport, index) => (
            <div key={index} className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
              <div className="bg-blue-500 rounded-xl p-3 text-white w-fit mb-4">
                {sport.icon}
              </div>
              <h4 className="font-bold text-blue-700 mb-2">{sport.title}</h4>
              <div className="flex flex-wrap gap-1 mb-3">
                {sport.benefits.map((benefit, i) => (
                  <span key={i} className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                    {benefit}
                  </span>
                ))}
              </div>
              <p className="text-gray-600 text-sm">{sport.reason}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-bold text-gray-600 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
          第二梯队（稍后考虑）
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {secondTier.map((sport, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gray-400 rounded-xl p-3 text-white">
                  {sport.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-700">{sport.title}</h4>
                  <span className="text-gray-400 text-sm">{sport.note}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{sport.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}