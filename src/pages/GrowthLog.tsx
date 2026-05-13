import { useState } from 'react';
import { Calendar, Plus, BookOpen, Award, Trash2, Edit2 } from 'lucide-react';
import AddRecordModal from '../components/features/growth-log/AddRecordModal';
import { useAppStore } from '../store/useAppStore';

const getTypeColor = (type: string) => {
  switch (type) {
    case 'daily':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', emoji: '📝' };
    case 'milestone':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', emoji: '🏆' };
    case 'emotion':
      return { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', emoji: '😊' };
    case 'skill':
      return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', emoji: '🌟' };
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', emoji: '📝' };
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
};

export default function GrowthLog() {
  const [showAddModal, setShowAddModal] = useState(false);
  const growthRecords = useAppStore((state) => state.growthRecords);
  const deleteGrowthRecord = useAppStore((state) => state.deleteGrowthRecord);

  const sortedRecords = [...growthRecords].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 px-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <BookOpen className="w-7 h-7" />
          成长记录
        </h1>
        <p className="text-blue-100">记录每一天的成长与进步</p>
      </div>

      <div className="px-4 py-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <Plus className="w-10 h-10 mx-auto mb-3" />
            <p className="font-bold">添加记录</p>
          </button>
          <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95">
            <Award className="w-10 h-10 mx-auto mb-3" />
            <p className="font-bold">成长里程碑</p>
          </button>
        </div>

        {/* Stats */}
        {growthRecords.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-800">{growthRecords.length}</p>
                <p className="text-sm text-gray-500">总记录</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {growthRecords.filter((r) => r.type === 'milestone').length}
                </p>
                <p className="text-sm text-gray-500">里程碑</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {new Set(growthRecords.map((r) => r.date)).size}
                </p>
                <p className="text-sm text-gray-500">记录天数</p>
              </div>
            </div>
          </div>
        )}

        {/* Records List */}
        <div className="space-y-4">
          {sortedRecords.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">还没有记录</h3>
              <p className="text-gray-500">点击上方「添加记录」开始记录吧！</p>
            </div>
          ) : (
            sortedRecords.map((record) => {
              const typeStyle = getTypeColor(record.type);
              return (
                <div
                  key={record.id}
                  className={`bg-white rounded-2xl shadow-md p-5 border-l-4 ${
                    record.type === 'daily'
                      ? 'border-l-blue-400'
                      : record.type === 'milestone'
                      ? 'border-l-amber-400'
                      : record.type === 'emotion'
                      ? 'border-l-pink-400'
                      : 'border-l-green-400'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{typeStyle.emoji}</span>
                      <span className="text-sm text-gray-500">{formatDate(record.date)}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteGrowthRecord(record.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-800 leading-relaxed mb-3">{record.content}</p>
                  {record.tags && record.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {record.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${typeStyle.bg} ${typeStyle.text}`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <AddRecordModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
