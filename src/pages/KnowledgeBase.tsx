import { useState } from 'react';
import { BookOpen, Search, Star, Tag, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const knowledgeArticles = [
  {
    id: '1',
    title: '如何应对孩子发脾气',
    content: '当孩子发脾气时，首先要保持冷静，不要训斥或打骂孩子。可以试着用温和的语言询问原因，帮助孩子识别和表达自己的情绪。等孩子冷静下来后，再和孩子一起讨论解决问题的方法。',
    ageGroup: '3' as const,
    category: ['情绪管理'],
    tags: ['情绪', '发脾气'],
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: '3岁孩子的语言发展',
    content: '3岁是孩子语言发展的关键时期。此时孩子应该能说出3-5个字的短句，能听懂简单的指令。可以多和孩子说话，讲故事，唱儿歌，帮助孩子提升语言能力。',
    ageGroup: '3' as const,
    category: ['认知学习'],
    tags: ['语言', '发展'],
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: '如何培养孩子的专注力',
    content: '可以通过简单的游戏和活动来培养孩子的专注力，如拼图、搭积木、画画等。每次活动的时间不宜过长，15-20分钟为宜。要选择孩子感兴趣的内容，当孩子专注时不要轻易打断。',
    ageGroup: '3' as const,
    category: ['认知学习'],
    tags: ['专注力', '游戏'],
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: '培养孩子良好的睡眠习惯',
    content: '建立固定的睡前程序，如洗澡、讲故事、听轻音乐等，帮助孩子做好睡前准备。保持规律的睡眠时间，创造安静舒适的睡眠环境。睡前避免让孩子玩电子产品。',
    ageGroup: '3' as const,
    category: ['规律作息'],
    tags: ['睡眠', '作息'],
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: '鼓励孩子社交互动',
    content: '多带孩子和其他小朋友一起玩，教孩子学会分享、轮流等待等社交技能。可以通过角色扮演游戏来帮助孩子理解社交规则。当孩子表现出良好的社交行为时，及时给予鼓励和表扬。',
    ageGroup: '3' as const,
    category: ['社交能力'],
    tags: ['社交', '互动'],
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
];

export default function KnowledgeBase() {
  const [selectedAge, setSelectedAge] = useState('3');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const store = useAppStore();
  const toggleFavorite = store.toggleFavorite;

  const articles = store.knowledgeArticles.length > 0 ? store.knowledgeArticles : knowledgeArticles;

  const filteredArticles = articles.filter((article) => {
    const matchesAge = article.ageGroup === selectedAge;
    const matchesSearch = searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorites = !showFavorites || article.isFavorite;
    return matchesAge && matchesSearch && matchesFavorites;
  });

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 px-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <BookOpen className="w-7 h-7" />
          育儿知识库
        </h1>
        <p className="text-blue-100">探索科学育儿方法</p>
      </div>

      <div className="px-4 py-6">
        {/* Search */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索育儿知识..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-gray-700"
            />
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Age Groups & Filter */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['3', '4', '5', '6'].map((age) => (
              <button
                key={age}
                onClick={() => setSelectedAge(age)}
                className={`px-4 py-2 rounded-full shadow-sm border-2 font-medium transition-all whitespace-nowrap ${
                  selectedAge === age
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                }`}
              >
                {age}岁
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-all ${
              showFavorites
                ? 'border-amber-500 bg-amber-500 text-white'
                : 'border-gray-200 bg-white text-gray-700'
            }`}
          >
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">收藏</span>
          </button>
        </div>

        {/* Articles List */}
        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">暂无相关内容</h3>
            <p className="text-gray-500">试试其他关键词或年龄段</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                <button
                  onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                  className="w-full text-left p-5 flex items-start justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg mb-2">{article.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {article.category.map((cat, index) => (
                        <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                          {cat}
                        </span>
                      ))}
                    </div>
                    {!expandedArticle && (
                      <p className="text-gray-600 text-sm line-clamp-2">{article.content}</p>
                    )}
                  </div>
                  <div className="ml-3">
                    {expandedArticle === article.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {expandedArticle === article.id && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed mb-4">{article.content}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => toggleFavorite(article.id)}
                        className={`p-2 rounded-full transition-all ${
                          article.isFavorite
                            ? 'bg-amber-100 text-amber-500'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <Star className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
