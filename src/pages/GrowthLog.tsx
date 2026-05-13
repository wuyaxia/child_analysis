import { Calendar, Plus, BookOpen, Award } from 'lucide-react';

export default function GrowthLog() {
  return (
    <div className="min-h-screen pb-24">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-8 px-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <BookOpen className="w-7 h-7" />
          成长记录
        </h1>
        <p className="text-blue-100">记录每一天的成长与进步</p>
      </div>

      <div className="px-4 py-6">
        {/* 快捷操作卡片 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <Plus className="w-10 h-10 mx-auto mb-3" />
            <p className="font-bold">添加记录</p>
          </button>
          <button className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <Award className="w-10 h-10 mx-auto mb-3" />
            <p className="font-bold">成长里程碑</p>
          </button>
        </div>

        {/* 日历视图 */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              本月记录
            </h2>
          </div>
          <div className="text-center py-8 text-gray-400">
            <p>📝 记录功能即将上线...</p>
            <p className="text-sm mt-2">敬请期待！</p>
          </div>
        </div>

        {/* 近期记录 */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="font-bold text-gray-800 mb-4">近期记录</h2>
          <div className="text-center py-6 text-gray-400">
            <p>还没有记录</p>
            <p className="text-sm">点击上方「添加记录」开始记录吧！</p>
          </div>
        </div>
      </div>
    </div>
  );
}
