import { useState } from 'react';
import { X, Clock, Trophy, BookOpen, Bike } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const taskCategories = [
  { id: 'routine', label: '规律作息', icon: Clock },
  { id: 'activity', label: '活动游戏', icon: Trophy },
  { id: 'study', label: '学习认知', icon: BookOpen },
  { id: 'exercise', label: '运动锻炼', icon: Bike },
];

const defaultTasks = {
  routine: [
    { title: '早上7点半起床', description: '养成规律的作息习惯' },
    { title: '中午12点半午休', description: '保证充足的午睡' },
    { title: '晚上9点睡觉', description: '睡前放松，保证睡眠' },
  ],
  activity: [
    { title: '阅读绘本30分钟', description: '培养阅读习惯' },
    { title: '玩积木/拼图', description: '锻炼动手能力' },
  ],
  study: [
    { title: '认识5个新汉字', description: '学习识字' },
    { title: '数1-100数字', description: '数学启蒙' },
  ],
  exercise: [
    { title: '户外散步/跑步', description: '每天户外活动' },
    { title: '练习平衡车', description: '提升运动能力' },
  ],
};

export default function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'routine' | 'activity' | 'study' | 'exercise'>('routine');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'once'>('daily');
  const addTask = useAppStore((state) => state.addTask);

  const handleQuickAdd = (task: { title: string; description: string }) => {
    const newTask = {
      id: Date.now().toString(),
      title: task.title,
      description: task.description,
      category,
      frequency,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    addTask(newTask);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      category,
      frequency,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    addTask(newTask);
    onClose();
    setTitle('');
    setDescription('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4 pb-20">
      <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">添加新任务</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Quick Tasks */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3">推荐任务</h3>
            <div className="space-y-2">
              {defaultTasks[category].map((task, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAdd(task)}
                  className="w-full text-left p-3 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all"
                >
                  <p className="font-medium text-blue-800">{task.title}</p>
                  {task.description && <p className="text-xs text-blue-600 mt-1">{task.description}</p>}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Custom Task Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">自定义任务</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="任务名称"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="任务描述（可选）"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">分类</label>
              <div className="grid grid-cols-2 gap-2">
                {taskCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id as any)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        category === cat.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-xs font-medium">{cat.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">频率</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'daily', label: '每天' },
                  { id: 'weekly', label: '每周' },
                  { id: 'once', label: '单次' },
                ].map((freq) => (
                  <button
                    key={freq.id}
                    type="button"
                    onClick={() => setFrequency(freq.id as any)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      frequency === freq.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-sm font-medium">{freq.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              添加任务 ✨
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
