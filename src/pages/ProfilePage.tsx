import { User, Settings, Download, Upload, Trash2, Baby } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useState } from 'react';

export default function ProfilePage() {
  const store = useAppStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleExport = () => {
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      growthRecords: store.growthRecords,
      tasks: store.tasks,
      knowledgeArticles: store.knowledgeArticles,
      emotionRecords: store.emotionRecords,
      milestones: store.milestones,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `child-growth-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.growthRecords) {
          data.growthRecords.forEach((record: any) => store.addGrowthRecord(record));
        }
        alert('数据导入成功！');
      } catch (error) {
          alert('导入失败，请检查文件格式');
        }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDeleteAll = () => {
    if (confirm('确定要删除所有数据吗？此操作不可恢复！')) {
      store.growthRecords.forEach((record) => store.deleteGrowthRecord(record.id));
      setShowDeleteConfirm(false);
      alert('所有数据已删除');
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 px-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <User className="w-7 h-7" />
          个人中心
        </h1>
        <p className="text-blue-100">管理您的资料和数据</p>
      </div>

      <div className="px-4 py-6">
        {/* Child Info */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
              <Baby className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">宝贝信息</h2>
              <p className="text-gray-500">3岁男孩</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">数据统计</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-800">{store.growthRecords.length}</p>
              <p className="text-sm text-gray-500">成长记录</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{store.tasks.length}</p>
              <p className="text-sm text-gray-500">任务</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{store.milestones.length}</p>
              <p className="text-sm text-gray-500">里程碑</p>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">数据管理</h3>
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-3 p-3 bg-blue-50 rounded-xl text-blue-700 hover:bg-blue-100 transition-all"
            >
              <Download className="w-5 h-5" />
              <span>导出所有数据</span>
            </button>
            <label className="w-full flex items-center gap-3 p-3 bg-green-50 rounded-xl text-green-700 hover:bg-green-100 transition-all cursor-pointer">
              <Upload className="w-5 h-5" />
              <span>导入数据</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center gap-3 p-3 bg-red-50 rounded-xl text-red-700 hover:bg-red-100 transition-all"
            >
              <Trash2 className="w-5 h-5" />
              <span>删除所有数据</span>
            </button>
          </div>
        </div>

        {/* Settings */}
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

        {/* About */}
        <div className="text-center py-6 text-gray-400 text-sm">
          <p>儿童成长中心 v1.0</p>
          <p className="mt-1">用心记录，陪伴成长 💙</p>
        </div>
      </div>
    </div>
  );
}
