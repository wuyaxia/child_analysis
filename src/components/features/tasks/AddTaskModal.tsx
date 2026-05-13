import { useState } from 'react';
import { X, Clock, Trophy, BookOpen, Bike } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const taskCategories = [
  { id: 'routine', label: '规律作息', icon: Clock, color: '#D4836C' },
  { id: 'activity', label: '活动游戏', icon: Trophy, color: '#F7DBA7' },
  { id: 'study', label: '学习认知', icon: BookOpen, color: '#AAB794' },
  { id: 'exercise', label: '运动锻炼', icon: Bike, color: '#F2D5D0' },
];

const defaultTasks = {
  routine: [
    { title: '早上7:30起床', description: '养成规律的作息习惯' },
    { title: '中午12:30午休', description: '保证充足的午睡' },
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
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4 pb-24">
      <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-[#5D4559]/10 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-[#5D4559]">添加新任务</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#5D4559]/5 hover:bg-[#5D4559]/10 transition-all"
          >
            <X className="w-5 h-5 text-[#5D4559]" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* 推荐任务 */}
          <div>
            <h3 className="text-sm font-bold text-[#5D4559] mb-3">推荐任务</h3>
            <div className="space-y-2">
              {defaultTasks[category].map((task, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAdd(task)}
                  className="w-full text-left p-4 bg-[#FDF8F3] rounded-2xl border border-[#D4836C]/10 hover:bg-[#F2D5D0]/20 transition-all"
                >
                  <p className="font-medium text-[#5D4559]">{task.title}</p>
                  {task.description && <p className="text-xs text-[#5D4559]/60 mt-1">{task.description}</p>}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-[#5D4559]/10" />

          {/* 自定义任务 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#5D4559] mb-2">自定义任务</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="任务名称"
                className="w-full px-4 py-3 border border-[#5D4559]/15 rounded-2xl focus:ring-2 focus:ring-[#D4836C]/30 focus:border-[#D4836C] outline-none transition-all bg-[#FDF8F3]"
                required
              />
            </div>

            <div>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="任务描述（可选）"
                className="w-full px-4 py-3 border border-[#5D4559]/15 rounded-2xl focus:ring-2 focus:ring-[#D4836C]/30 focus:border-[#D4836C] outline-none transition-all bg-[#FDF8F3]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#5D4559] mb-2">分类</label>
              <div className="grid grid-cols-2 gap-2">
                {taskCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id as any)}
                      className={`p-3 rounded-2xl border-2 transition-all ${
                        category === cat.id
                          ? 'border-[#D4836C] bg-[#D4836C]/10 text-[#D4836C]'
                          : 'border-transparent bg-[#FDF8F3] text-[#5D4559]/70 hover:border-[#D4836C]/30'
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
              <label className="block text-sm font-bold text-[#5D4559] mb-2">频率</label>
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
                    className={`p-3 rounded-2xl border-2 transition-all ${
                      frequency === freq.id
                        ? 'border-[#D4836C] bg-[#D4836C]/10 text-[#D4836C]'
                        : 'border-transparent bg-[#FDF8F3] text-[#5D4559]/70 hover:border-[#D4836C]/30'
                    }`}
                  >
                    <p className="text-sm font-medium">{freq.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D4836C] to-[#C17059] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              添加任务 ✨
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
