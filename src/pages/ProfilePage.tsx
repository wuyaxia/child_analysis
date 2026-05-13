import { User, Settings, Download, Upload, Trash2, Baby } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="min-h-screen pb-24">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 px-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <User className="w-7 h-7" />
          个人中心
        </h1>
        <p className="text-purple-100">管理您的资料和数据</p>
      </div>

      <div className="px-4 py-6">
        {/* 孩子信息 */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
              <Baby className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">宝贝信息</h2>
              <p className="text-gray-600">3岁男孩</p>
            </div>
          </div>
        </div>

        {/* 数据管理 */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">数据管理</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 bg-blue-50 rounded-xl text-blue-700 hover:bg-blue-100 transition-all">
              <Download className="w-5 h-5" />
              <span>导出所有数据</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-green-50 rounded-xl text-green-700 hover:bg-green-100 transition-all">
              <Upload className="w-5 h-5" />
              <span>导入数据</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-red-50 rounded-xl text-red-700 hover:bg-red-100 transition-all">
              <Trash2 className="w-5 h-5" />
              <span>清空所有数据</span>
            </button>
          </div>
        </div>

        {/* 设置 */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-500" />
            设置
          </h3>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span>通知提醒</span>
              <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span>数据自动备份</span>
              <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* 关于 */}
        <div className="text-center py-6 text-gray-400 text-sm">
          <p>儿童成长中心 v1.0</p>
          <p className="mt-1">用心记录，陪伴成长 💙</p>
        </div>
      </div>
    </div>
  );
}
