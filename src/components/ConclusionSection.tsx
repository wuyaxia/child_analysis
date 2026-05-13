import { CheckCircle, XCircle, ArrowRight, Sparkles, Heart, Brain } from 'lucide-react';

export default function ConclusionSection() {
  const traits = [
    { title: '气质偏敏感、慢热', desc: '安全感需求高，需要更多时间适应新环境', emoji: '🌸' },
    { title: '情绪调节能力待成熟', desc: '尤其在困倦、疲劳时自控力明显下降', emoji: '⏰' },
    { title: '依恋对象稳定', desc: '尤其依赖姥姥，建立了安全的情感联结', emoji: '💕' },
    { title: '理解能力不错', desc: '具备讲道理基础，哭完能复述', emoji: '🧠' }
  ];

  const positiveTraits = ['情绪细腻', '有观察力', '共情能力强', '谨慎但稳定', '内驱力不错', '熟悉后社交能力正常'];
  const negativeTraits = ['依赖性强', '抗挫能力弱', '回避型人格倾向', '情绪爆发频繁', '对陌生环境焦虑', '做事怕失败'];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl shadow-xl p-6 md:p-8 mb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl text-white shadow-lg">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">孩子的核心特质</h2>
            <p className="text-blue-600">了解孩子，才能更好地引导 🌟</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {traits.map((trait, index) => (
            <div key={index} className="bg-white rounded-2xl p-5 shadow-md border-2 border-blue-100 hover:border-blue-300 transition-colors">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{trait.emoji}</span>
                <div>
                  <p className="font-bold text-gray-800 text-lg">{trait.title}</p>
                  <p className="text-gray-600 text-sm mt-1">{trait.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-bold text-green-700">✅ 养育方式合适的发展方向</h3>
            </div>
            <ul className="grid grid-cols-2 gap-2">
              {positiveTraits.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-red-200 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-bold text-red-700">⚠️ 不当养育方式的风险</h3>
            </div>
            <ul className="grid grid-cols-2 gap-2">
              {negativeTraits.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl p-6 shadow-lg transform rotate-1">
          <div className="flex items-center justify-center gap-3 text-white">
            <Brain className="w-8 h-8" />
            <p className="text-xl font-bold text-center">
              💡 现在3岁是非常关键的「性格塑形窗口」！
            </p>
            <Brain className="w-8 h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}