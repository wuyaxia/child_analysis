import { useState } from 'react';
import { CheckCircle, Plus, Flower2, Calendar, Trash2, Clock, Trophy, BookOpen, Bike } from 'lucide-react';
import AddTaskModal from '../components/features/tasks/AddTaskModal';
import { useAppStore } from '../store/useAppStore';

const categoryConfig = {
  routine: { label: '规律作息', icon: Clock, color: '#D4836C' },
  activity: { label: '活动游戏', icon: Trophy, color: '#F7DBA7' },
  study: { label: '学习认知', icon: BookOpen, color: '#AAB794' },
  exercise: { label: '运动锻炼', icon: Bike, color: '#F2D5D0' },
};

export default function TasksPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const tasks = useAppStore((state) => state.tasks);
  const toggleTaskComplete = useAppStore((state) => state.toggleTaskComplete);
  const deleteTask = useAppStore((state) => state.deleteTask);

  const today = new Date().toISOString().split('T')[0];

  const completedToday = tasks.filter((task) => task.completedDates.includes(today));
  const totalToday = tasks.length;
  const progress = totalToday > 0 ? Math.round((completedToday.length / totalToday) * 100) : 0;

  const tasksByCategory = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  return (
    <div className="min-h-screen pb-28">
      {/* 顶部区域 */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full dots-bg opacity-60" />
        <div className="relative z-10 px-6 pt-10 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#F7DBA7]/40 rounded-2xl p-2">
              <Calendar className="w-7 h-7 text-[#5D4559]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#5D4559]">任务打卡</h1>
              <p className="text-[#5D4559]/60 text-sm">好习惯，慢慢来</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* 进度卡片 */}
        <div className="organic-card p-6">
          <h3 className="text-lg font-bold text-[#5D4559] mb-4 flex items-center gap-2">
            <Flower2 className="w-5 h-5 text-[#D4836C]" />
            今日进度
          </h3>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-[#5D4559]/70 mb-3">
              <span>已完成</span>
              <span className="font-semibold text-[#D4836C]">
                {completedToday.length} / {totalToday}
              </span>
            </div>
            <div className="w-full bg-[#F2D5D0]/40 rounded-full h-4 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ 
                  width: `${progress}%`,
                  background: 'linear-gradient(135deg, #D4836C, #C17059)'
                }}
              />
            </div>
            <p className="text-center text-3xl font-bold text-[#D4836C] mt-3">{progress}%</p>
          </div>
        </div>

        {/* 添加任务按钮 */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full organic-button text-white p-6"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-2xl p-3">
              <Plus className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg">添加新任务</h3>
              <p className="text-white/80 text-sm">创建今天的目标</p>
            </div>
          </div>
        </button>

        {/* 任务列表 */}
        {Object.entries(tasksByCategory).length === 0 ? (
          <div className="organic-card p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-[#5D4559] mb-2">还没有任务</h3>
            <p className="text-[#5D4559]/60">点击上方按钮添加任务！</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(categoryConfig).map(([catKey, config]) => {
              const categoryTasks = tasksByCategory[catKey] || [];
              if (categoryTasks.length === 0) return null;

              const Icon = config.icon;
              return (
                <div key={catKey} className="organic-card p-6">
                  <h3 className="font-bold text-[#5D4559] mb-4 flex items-center gap-2">
                    <div 
                      className="p-2 rounded-xl"
                      style={{ backgroundColor: `${config.color}25` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: config.color }} />
                    </div>
                    {config.label}
                  </h3>

                  <div className="space-y-3">
                    {categoryTasks.map((task) => {
                      const isCompleted = task.completedDates.includes(today);
                      return (
                        <div
                          key={task.id}
                          className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                            isCompleted
                              ? 'bg-[#AAB794]/10 border-[#AAB794]/30'
                              : 'bg-white border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <button
                              onClick={() => toggleTaskComplete(task.id, today)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                isCompleted
                                  ? 'bg-[#AAB794] border-[#AAB794] text-white'
                                  : 'border-[#5D4559]/20 hover:border-[#D4836C]'
                              }`}
                            >
                              {isCompleted && <CheckCircle className="w-5 h-5" />}
                            </button>
                            <div>
                              <p className={`font-medium ${isCompleted ? 'text-[#5D4559]/50 line-through' : 'text-[#5D4559]'}`}>
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="text-xs text-[#5D4559]/50 mt-1">{task.description}</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-2 text-[#5D4559]/30 hover:text-red-400 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddTaskModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
