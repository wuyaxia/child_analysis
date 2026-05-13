
import { BookOpen, Search, Star, Tag, Filter } from 'lucide-react';

export default function KnowledgeBase() {
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
              className="bg-transparent border-none outline-none flex-1 text-gray-700"
            />
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Age Groups */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['3岁', '4岁', '5岁', '6岁'].map((age) => (
            <button
              key={age}
              className="px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 font-medium text-gray-700 whitespace-nowrap hover:border-blue-300 hover:text-blue-600 transition-all"
            >
              {age}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-500" />
            专题分类
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {['情绪管理', '社交能力', '运动发展', '认知学习', '饮食习惯', '睡眠作息'].map((category) => (
              <button
                key={category}
                className="bg-blue-50 text-blue-700 p-4 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Favorites */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            收藏内容
          </h2>
          <div className="text-center py-6 text-gray-400">
            <p>还没有收藏</p>
            <p className="text-sm">浏览文章后收藏您需要的内容</p>
          </div>
        </div>
      </div>
    </div>
  );
}

