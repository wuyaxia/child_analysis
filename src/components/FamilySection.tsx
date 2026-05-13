import { Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function FamilySection() {
  const rules = [
    {
      title: '情绪可以有，但规则不能总变',
      description: '统一：可以哭、可以难受、大人会陪、但不一定满足',
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      title: '减少「代劳式养育」',
      description: '尤其：不愿走路就一直抱、一卡住立刻帮、一哭立刻满足',
      warning: '这些会削弱自主感、耐受力、自信',
      icon: <AlertTriangle className="w-6 h-6" />
    },
    {
      title: '增加「小挑战成功」',
      description: '例如：自己走100米、自己拿东西、自己解决一点困难、自己和小朋友说一句话',
      highlight: '难度必须「小而可完成」',
      icon: <CheckCircle className="w-6 h-6" />
    }
  ];

  const pitfalls = [
    { text: '贴标签', examples: ['他就是胆小', '太内向', '玻璃心'], warning: '孩子会内化' },
    { text: '用羞耻激将', examples: ['别的小朋友都敢', '男孩子怎么这样'], warning: '高敏感孩子特别容易受伤' },
    { text: '过度保护', examples: ['怕哭', '怕累', '怕受挫'], warning: '适度挫折是人格营养' }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <Users className="w-6 h-6 text-green-500" />
        家庭结构与养育建议
      </h2>
      
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 mb-6 border border-red-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-700">「多人轮流带」最大的风险：规则不一致</p>
            <p className="text-gray-600 text-sm mt-1">
              姥姥心软、爸爸讲原则、奶奶更迁就、妈妈周末补偿式满足。孩子会越来越依赖「找到最能满足我的人」，对不同人采取不同策略。
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-bold text-green-700 mb-4">你们现在最需要统一的3件事</h3>
        
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <div key={index} className="bg-green-50 rounded-xl p-5 border border-green-200">
              <div className="flex items-start gap-3">
                <div className="bg-green-500 text-white rounded-lg p-2">
                  {rule.icon}
                </div>
                <div>
                  <h4 className="font-bold text-green-800 mb-1">{rule.title}</h4>
                  <p className="text-gray-700 text-sm">{rule.description}</p>
                  {rule.warning && (
                    <p className="text-red-600 text-sm mt-1">{rule.warning}</p>
                  )}
                  {rule.highlight && (
                    <p className="text-green-600 text-sm mt-1 font-medium">
                      💡 {rule.highlight}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-gray-500 to-gray-700 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <XCircle className="w-5 h-5" />
          未来最容易踩的坑
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pitfalls.map((pitfall, index) => (
            <div key={index} className="bg-white/10 rounded-xl p-4">
              <p className="font-semibold mb-2">{pitfall.text}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {pitfall.examples.map((example, i) => (
                  <span key={i} className="bg-white/10 px-2 py-0.5 rounded text-xs">
                    {example}
                  </span>
                ))}
              </div>
              <p className="text-gray-300 text-xs">{pitfall.warning}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}