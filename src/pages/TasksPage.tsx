import { useState } from 'react';
import { CheckCircle, Clock, Plus, Trophy, Calendar, Trash2 } from 'lucide-react';
import AddTaskModal from '../components/features/tasks/AddTaskModal';
import { useAppStore } from '../store/useAppStore';

const categoryConfig = {
  routine: { label: '规律作息', icon: Clock, color: 'blue' },
  activity: { label: '活动游戏', icon: Trophy, color: 'amber' },
  study: { label: '学习认知', icon: CheckCircle, color: 'green' },
  exercise: { label: '运动锻炼', icon: Calendar, color: 'pink' },
};

export default function TasksPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const tasks = useAppStore((state) => state.tasks);
  const toggleTaskComplete = useAppStore((state) => state.toggleTaskComplete);
  const deleteTask = useAppStore((state) => state.deleteTask);

  const today = new Date().toISOString().split('T')[0];

  const completedToday = tasks.filter((task) => task.completedDates.includes(today));
  const totalToday = tasks.length > 0 ? Math.min(tasks.length, 10) : 0;
  const progress = totalToday > 0 ? Math.round((completedToday.length / totalToday) * 100) : 0;

  const tasksByCategory = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  const handleCheck = (taskId: string) => {
    toggleTaskComplete(taskId, today);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 px-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <CheckCircle className="w-7 h-7" />
          任务打卡
        </h1>
        <p className="text-blue-100">坚持好习惯，每一天都进步</p>
      </div>

      <div className="px-4 py-6">
        {/* Today's Progress */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-500" />
            今日进度
          </h2>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>今日完成</span>
              <span>
                {completedToday.length} / {totalToday}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center text-lg font-bold text-gray-700 mt-2">{progress}%</p>
          </div>
        </div>

        {/* Quick Add */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mb-6 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span className="font-bold">添加新任务</span>
        </button>

        {/* Task Lists by Category */}
        {Object.entries(tasksByCategory).length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">还没有任务</h3>
            <p className="text-gray-500">点击上方「添加新任务」开始！</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(categoryConfig).map(([catKey, config]) => {
              const categoryTasks = tasksByCategory[catKey] || [];
              if (categoryTasks.length === 0) return null;

              const Icon = config.icon;
              return (
                <div key={catKey} className="bg-white rounded-2xl shadow-md p-5">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Icon className={`w-5 h-5 text-${config.color}-500`} />
                    {config.label}
                  </h3>

                  <div className="space-y-3">
                    {categoryTasks.map((task) => {
                      const isCompleted = task.completedDates.includes(today);
                      return (
                        <div
                          key={task.id}
                          className={`p-4 rounded-xl border-2 flex items-center justify-between ${
                            isCompleted
                              ? 'bg-green-50 border-green-200'
                              : 'bg-gray-50 border-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <button
                              onClick={() => handleCheck(task.id)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                isCompleted
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-300 hover:border-blue-500'
                              }`}
                            >
                              {isCompleted && <CheckCircle className="w-5 h-5" />}
                            </button>
                            <div>
                              <p className={`font-medium ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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
