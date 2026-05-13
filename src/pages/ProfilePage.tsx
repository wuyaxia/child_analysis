import { useState } from 'react';
import { User, Settings, Download, Upload, Trash2, Baby } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

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
      type: 'application/json'
    });
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
    <div className="min-h-screen pb-28">
      {/* 顶部区域 */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full dots-bg opacity-60" />
        <div className="relative z-10 px-6 pt-10 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#5D4559]/10 rounded-2xl p-2">
              <User className="w-7 h-7 text-[#5D4559]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#5D4559]">个人中心</h1>
              <p className="text-[#5D4559]/60 text-sm">管理您的数据和设置</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* 孩子信息卡片 */}
        <div className="organic-card p-6">
          <div className="flex items-center gap-5">
            <div className="bg-gradient-to-br from-[#F2D5D0] to-[#FDF8F3] rounded-3xl p-5">
              <Baby className="w-14 h-14 text-[#D4836C]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#5D4559] mb-1">宝贝信息</h2>
              <p className="text-[#5D4559]/70">3岁男孩</p>
            </div>
          </div>
        </div>

        {/* 数据统计 */}
        <div className="organic-card p-6">
          <h3 className="text-lg font-bold text-[#5D4559] mb-5">数据统计</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-4xl font-bold text-[#D4836C] mb-1">{store.growthRecords.length}</div>
              <p className="text-xs text-[#5D4559]/60">成长记录</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#AAB794] mb-1">{store.tasks.length}</div>
              <p className="text-xs text-[#5D4559]/60">任务</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#5D4559] mb-1">{store.milestones.length}</div>
              <p className="text-xs text-[#5D4559]/60">里程碑</p>
            </div>
          </div>
        </div>

        {/* 数据管理 */}
        <div className="organic-card p-6">
          <h3 className="text-lg font-bold text-[#5D4559] mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#D4836C]" />
            数据管理
          </h3>
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-4 p-4 bg-[#D4836C]/10 hover:bg-[#D4836C]/15 rounded-2xl text-[#D4836C] transition-all"
            >
              <Download className="w-6 h-6" />
              <div className="text-left flex-1">
                <p className="font-semibold">导出所有数据</p>
                <p className="text-xs text-[#D4836C]/70">备份您的数据到本地</p>
              </div>
            </button>

            <label className="w-full flex items-center gap-4 p-4 bg-[#AAB794]/10 hover:bg-[#AAB794]/15 rounded-2xl text-[#AAB794] transition-all cursor-pointer">
              <Upload className="w-6 h-6" />
              <div className="text-left flex-1">
                <p className="font-semibold">导入数据</p>
                <p className="text-xs text-[#AAB794]/70">从本地文件恢复数据</p>
              </div>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center gap-4 p-4 bg-red-50 hover:bg-red-100 rounded-2xl text-red-500 transition-all"
            >
              <Trash2 className="w-6 h-6" />
              <div className="text-left flex-1">
                <p className="font-semibold">删除所有数据</p>
                <p className="text-xs text-red-400">清空所有记录</p>
              </div>
            </button>
          </div>
        </div>

        {/* 关于 */}
        <div className="text-center py-8 text-[#5D4559]/50 text-sm">
          <p className="font-medium">儿童成长中心 v1.0</p>
          <p className="mt-2">用心记录，陪伴成长 💛</p>
        </div>
      </div>
    </div>
  );
}
