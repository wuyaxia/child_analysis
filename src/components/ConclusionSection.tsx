import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export default function ConclusionSection() {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
        孩子的核心特质
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800">气质偏敏感、慢热</p>
              <p className="text-gray-600 text-sm mt-1">安全感需求高，需要更多时间适应新环境</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800">情绪调节能力待成熟</p>
              <p className="text-gray-600 text-sm mt-1">尤其在困倦、疲劳时自控力明显下降</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800">依恋对象稳定</p>
              <p className="text-gray-600 text-sm mt-1">尤其依赖姥姥，建立了安全的情感联结</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800">理解能力不错</p>
              <p className="text-gray-600 text-sm mt-1">具备讲道理基础，哭完能复述</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
          <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
            <ArrowRight className="w-5 h-5" />
            养育方式合适的发展方向
          </h3>
          <ul className="space-y-2">
            {['情绪细腻', '有观察力', '共情能力强', '谨慎但稳定', '内驱力不错', '熟悉后社交能力正常'].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100">
          <h3 className="text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
            <ArrowRight className="w-5 h-5" />
            不当养育方式的风险
          </h3>
          <ul className="space-y-2">
            {['依赖性强', '抗挫能力弱', '回避型人格倾向', '情绪爆发频繁', '对陌生环境焦虑', '做事怕失败'].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-700">
                <XCircle className="w-4 h-4 text-red-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-6 bg-amber-50 rounded-xl p-4 border border-amber-200">
        <p className="text-amber-800 font-medium text-center">
          💡 现在3岁是非常关键的「性格塑形窗口」
        </p>
      </div>
    </div>
  );
}