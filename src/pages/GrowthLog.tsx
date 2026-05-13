import { useState, useEffect } from 'react';
import { Calendar, Plus, Flower2, Sun, Trash2, Edit2 } from 'lucide-react';
import AddRecordModal from '../components/features/growth-log/AddRecordModal';
import { useAppStore } from '../store/useAppStore';
import { firestoreDataService } from '../lib/firestoreDataService';
import type { GrowthRecord } from '../types';

export default function GrowthLog() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [localRecords, setLocalRecords] = useState<GrowthRecord[]>([]);
  const localGrowthRecords = useAppStore((state) => state.growthRecords);
  const family = useAppStore((state) => state as any)?.family;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecords = async () => {
      // 优先从 Firestore 加载
      if (family?.id) {
        try {
          const firestoreRecords = await firestoreDataService.getGrowthRecords();
          if (firestoreRecords.length > 0) {
            setLocalRecords(firestoreRecords);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error('从 Firestore 加载失败:', error);
        }
      }
      // 降级到 localStorage
      setLocalRecords(localGrowthRecords);
      setIsLoading(false);
    };

    loadRecords();
  }, [family?.id]);

  const deleteGrowthRecord = async (id: string) => {
    // 尝试从 Firestore 删除
    if (family?.id) {
      try {
        await firestoreDataService.deleteGrowthRecord(id);
        setLocalRecords(prev => prev.filter(r => r.id !== id));
        return;
      } catch (error) {
        console.error('从 Firestore 删除失败:', error);
      }
    }
    // 降级到 localStorage
    useAppStore.getState().deleteGrowthRecord(id);
    setLocalRecords(prev => prev.filter(r => r.id !== id));
  };

  const handleRecordAdded = (record: GrowthRecord) => {
    setLocalRecords(prev => [record, ...prev]);
  };

  const growthRecords = localRecords;

  const sortedRecords = [...growthRecords].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'daily': return { emoji: '📝', color: '#D4836C', bg: 'rgba(212,131,108,0.1)' };
      case 'milestone': return { emoji: '🏆', color: '#F7DBA7', bg: 'rgba(247,219,167,0.2)' };
      case 'emotion': return { emoji: '😊', color: '#F2D5D0', bg: 'rgba(242,213,208,0.3)' };
      case 'skill': return { emoji: '🌟', color: '#AAB794', bg: 'rgba(170,183,148,0.2)' };
      default: return { emoji: '📝', color: '#D4836C', bg: 'rgba(212,131,108,0.1)' };
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

  return (
    <div className="min-h-screen pb-28">
      {/* 顶部区域 */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full dots-bg opacity-60" />
        <div className="relative z-10 px-6 pt-10 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#AAB794]/20 rounded-2xl p-2">
              <Flower2 className="w-7 h-7 text-[#AAB794]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#5D4559]">成长记录</h1>
              <p className="text-[#5D4559]/60 text-sm">记录每一天的美好</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* 快捷操作 */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full organic-card p-6 text-left organic-button text-white"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-2xl p-3">
              <Plus className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg">添加新记录</h3>
              <p className="text-white/80 text-sm">今天有什么想记录的？</p>
            </div>
          </div>
        </button>

        {/* 统计卡片 */}
        {growthRecords.length > 0 && (
          <div className="organic-card p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-[#D4836C] mb-1">{growthRecords.length}</div>
                <p className="text-xs text-[#5D4559]/60">总记录</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#AAB794] mb-1">
                  {growthRecords.filter((r) => r.type === 'milestone').length}
                </div>
                <p className="text-xs text-[#5D4559]/60">里程碑</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#5D4559] mb-1">
                  {new Set(growthRecords.map((r) => r.date)).size}
                </div>
                <p className="text-xs text-[#5D4559]/60">记录天数</p>
              </div>
            </div>
          </div>
        )}

        {/* 记录列表 */}
        {isLoading ? (
          <div className="organic-card p-12 text-center">
            <div className="text-6xl mb-4 animate-pulse">📝</div>
            <p className="text-[#5D4559]/60">加载中...</p>
          </div>
        ) : sortedRecords.length === 0 ? (
          <div className="organic-card p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-[#5D4559] mb-2">还没有记录</h3>
            <p className="text-[#5D4559]/60">点击上方按钮开始记录吧！</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedRecords.map((record) => {
              const style = getTypeStyle(record.type);
              return (
                <div key={record.id} className="organic-card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: style.bg }}
                      >
                        {style.emoji}
                      </div>
                      <div>
                        <p className="text-sm text-[#5D4559]/60">{formatDate(record.date)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-[#5D4559]/40 hover:text-[#D4836C] hover:bg-[#D4836C]/10 rounded-xl transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteGrowthRecord(record.id)}
                        className="p-2 text-[#5D4559]/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[#5D4559]/90 leading-relaxed mb-3">{record.content}</p>
                  {record.tags && record.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {record.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="px-3 py-1 rounded-full text-xs font-medium text-[#5D4559]/80"
                          style={{ backgroundColor: style.bg }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddRecordModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
