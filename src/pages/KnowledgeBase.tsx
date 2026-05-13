import { useState } from 'react';
import { BookOpen, Search, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function KnowledgeBase() {
  const [selectedAge, setSelectedAge] = useState('3');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const store = useAppStore();
  const toggleFavorite = store.toggleFavorite;

  const articles = store.knowledgeArticles;

  const filteredArticles = articles.filter((article) => {
    const matchesAge = article.ageGroup === selectedAge;
    const matchesSearch = searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorites = !showFavorites || article.isFavorite;
    return matchesAge && matchesSearch && matchesFavorites;
  });

  return (
    <div className="min-h-screen pb-28">
      {/* 顶部区域 */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full dots-bg opacity-60" />
        <div className="relative z-10 px-6 pt-10 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#F2D5D0]/40 rounded-2xl p-2">
              <BookOpen className="w-7 h-7 text-[#D4836C]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#5D4559]">育儿知识库</h1>
              <p className="text-[#5D4559]/60 text-sm">探索科学育儿方法</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* 搜索框 */}
        <div className="organic-card p-4">
          <div className="flex items-center gap-3 bg-[#FDF8F3] rounded-2xl px-4 py-3">
            <Search className="w-5 h-5 text-[#5D4559]/40" />
            <input
              type="text"
              placeholder="搜索育儿知识..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-[#5D4559]"
            />
          </div>
        </div>

        {/* 筛选栏 */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {['3', '4', '5', '6'].map((age) => (
            <button
              key={age}
              onClick={() => setSelectedAge(age)}
              className={`px-5 py-2 rounded-2xl border-2 font-semibold transition-all whitespace-nowrap ${
                selectedAge === age
                  ? 'border-[#D4836C] bg-[#D4836C] text-white'
                  : 'border-transparent bg-white text-[#5D4559]/70'
              }`}
            >
              {age}岁
            </button>
          ))}

          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 transition-all whitespace-nowrap ${
              showFavorites
                ? 'border-[#F7DBA7] bg-[#F7DBA7] text-[#5D4559]'
                : 'border-transparent bg-white text-[#5D4559]/70'
            }`}
          >
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">收藏</span>
          </button>
        </div>

        {/* 文章列表 */}
        {filteredArticles.length === 0 ? (
          <div className="organic-card p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-[#5D4559] mb-2">暂无相关内容</h3>
            <p className="text-[#5D4559]/60">试试其他关键词或年龄段</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <div key={article.id} className="organic-card overflow-hidden">
                <button
                  onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                  className="w-full text-left p-5"
                >
                  <h3 className="text-lg font-bold text-[#5D4559] mb-2 leading-snug">
                    {article.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {article.category.map((cat, index) => (
                      <span 
                        key={index} 
                        className="bg-[#AAB794]/15 text-[#AAB794] px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  {!expandedArticle && (
                    <p className="text-[#5D4559]/70 text-sm line-clamp-2">
                      {article.content}
                    </p>
                  )}
                </button>

                {expandedArticle === article.id && (
                  <div className="px-5 pb-5 border-t border-[#5D4559]/10">
                    <p className="text-[#5D4559]/85 leading-relaxed mb-4">
                      {article.content}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="bg-[#F2D5D0]/40 text-[#5D4559]/70 px-3 py-1 rounded-full text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => toggleFavorite(article.id)}
                        className={`p-2 rounded-xl transition-all ${
                          article.isFavorite
                            ? 'bg-[#F7DBA7]/40 text-[#5D4559]'
                            : 'bg-[#5D4559]/5 text-[#5D4559]/40'
                        }`}
                      >
                        <Star className="w-5 h-5" fill={article.isFavorite ? 'currentColor' : 'none'} />
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
