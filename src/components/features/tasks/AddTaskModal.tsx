import { useState } from 'react';
import { X, Clock, Star, Check } from 'lucide-react';
import { useAppStore, categoryConfig, difficultyConfig } from '../../../store/useAppStore';
import type { TaskCategory, DifficultyLevel, Task } from '../../../types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('routine');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'once'>('daily');
  const [duration, setDuration] = useState('15');

  const addTask = useAppStore((state) => state.addTask);
  const selectedAgeGroup = useAppStore((state) => state.selectedAgeGroup);

  const categories = Object.entries(categoryConfig) as [TaskCategory, typeof categoryConfig[TaskCategory]][];
  const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const ageMonths = {
      '3': { min: 36, max: 47 },
      '4': { min: 48, max: 59 },
      '5': { min: 60, max: 71 },
      '6': { min: 72, max: 84 },
    };

    const newTask: Task = {
      id: `custom-${Date.now()}`,
      title,
      description,
      category,
      difficulty,
      ageRange: ageMonths[selectedAgeGroup],
      duration: parseInt(duration) || 15,
      frequency,
      completedDates: [],
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    addTask(newTask);
    onClose();
    setTitle('');
    setDescription('');
    setCategory('routine');
    setDifficulty('easy');
    setFrequency('daily');
    setDuration('15');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4 pb-24">
      <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-[#5D4559]/10 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-[#5D4559]">添加自定义任务</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#5D4559]/5 hover:bg-[#5D4559]/10 transition-all"
          >
            <X className="w-5 h-5 text-[#5D4559]" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#5D4559] mb-2">任务名称</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：每天阅读绘本"
                className="w-full px-4 py-3 border border-[#5D4559]/15 rounded-2xl focus:ring-2 focus:ring-[#D4836C]/30 focus:border-[#D4836C] outline-none transition-all bg-[#FDF8F3]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#5D4559] mb-2">任务描述（可选）</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="描述任务的细节或目标"
                rows={2}
                className="w-full px-4 py-3 border border-[#5D4559]/15 rounded-2xl focus:ring-2 focus:ring-[#D4836C]/30 focus:border-[#D4836C] outline-none transition-all bg-[#FDF8F3 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#5D4559] mb-2">任务分类</label>
              <div className="grid grid-cols-4 gap-2">
                {categories.map(([key, config]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCategory(key)}
                    className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                      category === key
                        ? 'border-[#D4836C] bg-[#D4836C]/10'
                        : 'border-transparent bg-[#FDF8F3] hover:border-[#D4836C]/30'
                    }`}
                  >
                    <span className="text-lg">{config.icon}</span>
                    <p className="text-xs font-medium text-[#5D4559]">{config.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#5D4559] mb-2">难度等级</label>
              <div className="grid grid-cols-3 gap-2">
                {difficulties.map((diff) => {
                  const config = difficultyConfig[diff];
                  return (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`p-3 rounded-2xl border-2 transition-all ${
                        difficulty === diff
                          ? 'border-[#D4836C] bg-[#D4836C]/10'
                          : 'border-transparent bg-[#FDF8F3] hover:border-[#D4836C]/30'
                      }`}
                    >
                      <div className="flex justify-center gap-0.5 mb-1">
                        {[1, 2, 3].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= config.stars ? 'fill-current text-[#F7DBA7]' : 'text-gray-200'}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm font-medium text-[#5D4559] text-center">{config.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#5D4559] mb-2">执行频率</label>
                <div className="space-y-2">
                  {[
                    { id: 'daily', label: '每天' },
                    { id: 'weekly', label: '每周' },
                    { id: 'once', label: '单次' },
                  ].map((freq) => (
                    <button
                      key={freq.id}
                      type="button"
                      onClick={() => setFrequency(freq.id as 'daily' | 'weekly' | 'once')}
                      className={`w-full p-2 rounded-xl border-2 transition-all text-sm ${
                        frequency === freq.id
                          ? 'border-[#D4836C] bg-[#D4836C]/10 text-[#D4836C]'
                          : 'border-transparent bg-[#FDF8F3] text-[#5D4559]/70'
                      }`}
                    >
                      {freq.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#5D4559] mb-2">预计时长</label>
                <div className="relative">
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="1"
                    max="120"
                    className="w-full px-4 py-2 border border-[#5D4559]/15 rounded-xl focus:ring-2 focus:ring-[#D4836C]/30 focus:border-[#D4836C] outline-none transition-all bg-[#FDF8F3]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#5D4559]/50">分钟</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D4836C] to-[#C17059] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              添加任务
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
