import { CheckCircle, Clock, Plus, Trophy, Calendar } from 'lucide-react';

export default function TasksPage() {
  return (
    <div className="min-h-screen pb-24">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-8 px-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <CheckCircle className="w-7 h-7" />
          任务打卡
        </h1>
        <p className="text-orange-100">坚持好习惯，每一天都进步</p>
      </div>

      <div className="px-4 py-6">
        {/* 今日进度 */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            今日进度
          </h2>
          <div className="text-center py-8 text-gray-400">
            <p>📊 任务功能即将上线...</p>
            <p className="text-sm mt-2">敬请期待！</p>
          </div>
        </div>

        {/* 快捷添加 */}
        <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mb-6">
          <Plus className="w-5 h-5" />
          <span className="font-bold">添加新任务</span>
        </button>

        {/* 任务分类 */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              规律作息
            </h3>
            <div className="text-center py-4 text-gray-400">
              <p>暂无任务</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" />
              每日活动
            </h3>
            <div className="text-center py-4 text-gray-400">
              <p>暂无任务</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
