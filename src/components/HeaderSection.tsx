import { Baby, Heart, Sparkles } from 'lucide-react';

export default function HeaderSection() {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16 px-6 rounded-3xl shadow-2xl mb-8 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-4 right-10 w-40 h-40 bg-pink-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-400 rounded-full blur-2xl"></div>
      </div>
      
      <div className="absolute top-8 right-8 opacity-20">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="currentColor">
          <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="10 5"/>
          <circle cx="60" cy="60" r="35" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="60" cy="60" r="20" fill="currentColor"/>
        </svg>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="relative">
            <Baby className="w-14 h-14" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-yellow-700" />
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
            <span className="text-xl font-medium">3岁男孩</span>
          </div>
          <Sparkles className="w-14 h-14 text-yellow-300" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          性格与行为发展分析报告
        </h1>
        <p className="text-center text-blue-100 text-xl mb-2">
          家庭养育建议版
        </p>
        
        <div className="mt-10 flex justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl border border-white/20">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-8 h-8 text-pink-300 animate-pulse" />
              <span className="font-semibold text-lg">核心结论</span>
            </div>
            <p className="text-2xl font-bold text-center bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
              正常发展范围内的高敏感 + 慢热型气质
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}