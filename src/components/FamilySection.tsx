import { Users, AlertTriangle, CheckCircle, XCircle, Shield, Heart } from 'lucide-react';

export default function FamilySection() {
  const rules = [
    {
      title: '情绪可以有，但规则不能总变',
      description: '可以哭、可以难受、大人会陪、但不一定满足',
      emoji: '🔒',
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      title: '减少「代劳式养育」',
      description: '不愿走路就一直抱、一卡住立刻帮、一哭立刻满足',
      warning: '这些会削弱自主感、耐受力、自信',
      emoji: '💪',
      icon: <AlertTriangle className="w-6 h-6" />
    },
    {
      title: '增加「小挑战成功」',
      description: '自己走100米、自己拿东西、自己解决一点困难',
      highlight: '难度必须「小而可完成」',
      emoji: '🎯',
      icon: <CheckCircle className="w-6 h-6" />
    }
  ];

  const pitfalls = [
    { 
      text: '贴标签', 
      emoji: '🏷️',
      examples: ['他就是胆小', '太内向', '玻璃心'], 
      warning: '孩子会内化' 
    },
    { 
      text: '用羞耻激将', 
      emoji: '😢',
      examples: ['别的小朋友都敢', '男孩子怎么这样'], 
      warning: '高敏感孩子特别容易受伤' 
    },
    { 
      text: '过度保护', 
      emoji: '🛡️',
      examples: ['怕哭', '怕累', '怕受挫'], 
      warning: '适度挫折是人格营养' 
    }
  ];

  return (
    <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl shadow-xl p-6 md:p-8 mb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-56 h-56 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-teal-200 to-green-200 rounded-full opacity-30 translate-x-1/3 translate-y-1/3"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl text-white shadow-lg">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">家庭养育建议</h2>
            <p className="text-green-600">统一战线，全家总动员！👨‍👩‍👧</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl p-5 mb-6 border-2 border-red-200 shadow-md">
          <div className="flex items-start gap-3">
            <div className="bg-red-500 rounded-full p-2 text-white">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-red-700 text-lg mb-1">⚠️ 「多人轮流带」最大的风险</p>
              <p className="text-gray-700 font-medium text-lg">规则不一致</p>
              <p className="text-gray-600 text-sm mt-2">
                姥姥心软、爸爸讲原则、奶奶更迁就、妈妈周末补偿式满足。孩子会越来越依赖「找到最能满足我的人」，对不同人采取不同策略。
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6" />
            你们现在最需要统一的3件事
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            {rules.map((rule, index) => (
              <div key={index} className="bg-white rounded-2xl p-5 shadow-md border-2 border-green-100 hover:border-green-300 transition-colors">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{rule.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-green-500 text-white rounded-lg p-1.5">
                        {rule.icon}
                      </div>
                      <h4 className="font-bold text-green-800 text-lg">{rule.title}</h4>
                    </div>
                    <p className="text-gray-700 mb-1">{rule.description}</p>
                    {rule.warning && (
                      <p className="text-red-600 text-sm font-medium">⚠️ {rule.warning}</p>
                    )}
                    {rule.highlight && (
                      <p className="text-green-600 text-sm font-medium">💡 {rule.highlight}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 text-8xl opacity-10 -translate-y-4 translate-x-4">
            ⚠️
          </div>
          
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              未来最容易踩的坑
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pitfalls.map((pitfall, index) => (
                <div key={index} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">{pitfall.emoji}</span>
                    <p className="font-bold text-lg">{pitfall.text}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {pitfall.examples.map((example, i) => (
                      <span key={i} className="bg-white/10 px-2 py-0.5 rounded text-xs">
                        "{example}"
                      </span>
                    ))}
                  </div>
                  <p className="text-red-200 text-sm">⚠️ {pitfall.warning}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}