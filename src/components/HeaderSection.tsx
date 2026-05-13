import { Baby, Heart, Sparkles } from 'lucide-react';

export default function HeaderSection() {
  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-12 px-6 rounded-3xl shadow-2xl mb-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Baby className="w-10 h-10" />
          <span className="text-lg font-medium bg-white/20 px-4 py-2 rounded-full">3岁男孩</span>
          <Sparkles className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          性格与行为发展分析报告
        </h1>
        <p className="text-center text-blue-100 text-lg mb-2">
          家庭养育建议版
        </p>
        
        <div className="mt-8 flex justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-6 h-6 text-pink-300" />
              <span className="font-semibold text-lg">核心结论</span>
            </div>
            <p className="text-xl font-bold text-center bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              正常发展范围内的高敏感 + 慢热型气质
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}