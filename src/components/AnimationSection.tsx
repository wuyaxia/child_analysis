import { Tv, ThumbsUp, ThumbsDown, BookOpen } from 'lucide-react';

export default function AnimationSection() {
  const recommended = [
    {
      title: '情绪成长类',
      priority: '最高优先级',
      examples: ['Bluey', "Daniel Tiger's Neighborhood"],
      benefits: ['情绪表达', '挫折处理', '社交', '安全感'],
      description: '非常适合高敏感孩子'
    },
    {
      title: '慢节奏自然探索类',
      priority: '推荐',
      examples: ['Puffin Rock', '小猪佩奇（适量）'],
      benefits: ['降低感官刺激', '建立稳定情绪节奏'],
      description: '帮助孩子放松情绪'
    }
  ];

  const avoid = [
    '高频切镜头',
    '强刺激',
    '吵闹',
    '对抗性强',
    '长期短视频化内容'
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <Tv className="w-6 h-6 text-purple-500" />
        动画启蒙与兴趣培养
      </h2>
      
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6 border border-purple-200">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-500" />
          <p className="text-purple-800 font-medium">
            重点不是「学知识」，而是借内容建立情绪模型和心理力量
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {recommended.map((category, index) => (
          <div key={index} className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <ThumbsUp className="w-5 h-5" />
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                {category.priority}
              </span>
            </div>
            <h3 className="font-bold text-lg mb-3">{category.title}</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {category.examples.map((example, i) => (
                <span key={i} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {example}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {category.benefits.map((benefit, i) => (
                <span key={i} className="bg-white/10 px-2 py-0.5 rounded text-xs">
                  {benefit}
                </span>
              ))}
            </div>
            <p className="text-purple-200 text-sm">{category.description}</p>
          </div>
        ))}
      </div>
      
      <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
        <div className="flex items-center gap-2 mb-4">
          <ThumbsDown className="w-5 h-5 text-red-500" />
          <h3 className="font-bold text-red-700">尽量避免</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {avoid.map((item, index) => (
            <span key={index} className="bg-red-100 text-red-700 px-4 py-2 rounded-full">
              {item}
            </span>
          ))}
        </div>
        <p className="text-red-600 text-sm mt-3">
          这类内容会进一步降低孩子的耐受力
        </p>
      </div>
    </div>
  );
}