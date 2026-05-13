import { Tv, ThumbsUp, ThumbsDown, BookOpen, Play, Pause } from 'lucide-react';

export default function AnimationSection() {
  const recommended = [
    {
      title: '情绪成长类',
      emoji: '🧸',
      priority: '最高优先级',
      examples: ['Bluey', "Daniel Tiger's Neighborhood"],
      benefits: ['情绪表达', '挫折处理', '社交', '安全感'],
      description: '非常适合高敏感孩子，帮助他们学习情绪管理'
    },
    {
      title: '慢节奏自然探索类',
      emoji: '🦋',
      priority: '推荐',
      examples: ['Puffin Rock', '小猪佩奇（适量）'],
      benefits: ['降低感官刺激', '建立稳定情绪节奏'],
      description: '帮助孩子放松情绪，享受平静的观看体验'
    }
  ];

  const avoid = [
    { text: '高频切镜头', emoji: '📺' },
    { text: '强刺激', emoji: '💥' },
    { text: '吵闹', emoji: '🔊' },
    { text: '对抗性强', emoji: '⚔️' },
    { text: '短视频化', emoji: '📱' }
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-3xl shadow-xl p-6 md:p-8 mb-8 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-200 to-pink-200 rounded-full opacity-40 translate-y-24 -translate-x-24"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl text-white shadow-lg">
            <Tv className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">动画启蒙建议</h2>
            <p className="text-purple-600">用好的内容滋养孩子的心灵 🌟</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md border border-purple-100">
          <div className="flex items-start gap-3">
            <BookOpen className="w-6 h-6 text-purple-500 mt-1" />
            <div>
              <p className="text-purple-800 font-bold text-lg">
                💡 重点不是「学知识」
              </p>
              <p className="text-purple-600">
                而是借内容建立情绪模型和心理力量
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {recommended.map((category, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-md border-2 border-purple-100 hover:border-purple-300 transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 text-7xl opacity-20 translate-y-2 translate-x-2">
                {category.emoji}
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-3xl">{category.emoji}</span>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{category.title}</h3>
                    <span className="bg-purple-100 text-purple-600 px-3 py-0.5 rounded-full text-xs font-bold">
                      {category.priority}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {category.examples.map((example, i) => (
                    <span key={i} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                      ▶ {example}
                    </span>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {category.benefits.map((benefit, i) => (
                    <span key={i} className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded text-xs">
                      ✨ {benefit}
                    </span>
                  ))}
                </div>
                
                <p className="text-gray-600 text-sm">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-red-200">
          <div className="flex items-center gap-2 mb-4">
            <ThumbsDown className="w-6 h-6 text-red-500" />
            <h3 className="font-bold text-red-700 text-lg">❌ 尽量避免这些类型</h3>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-4">
            {avoid.map((item, index) => (
              <div key={index} className="bg-white rounded-xl px-4 py-2 shadow-sm flex items-center gap-2 border border-red-100">
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-red-700 font-medium">{item.text}</span>
              </div>
            ))}
          </div>
          
          <div className="bg-red-100 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <p className="text-red-800 font-medium">
              这类内容会进一步降低孩子的耐受力，影响情绪调节能力发展
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}