import { useState } from 'react';
import { X, Camera, Smile, Frown, Meh, Calendar, Tag } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import type { GrowthRecord } from '../../../types';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type RecordType = 'daily' | 'milestone' | 'emotion' | 'skill';

const recordTypes: { type: RecordType; label: string; emoji: string }[] = [
  { type: 'daily', label: '日常记录', emoji: '📝' },
  { type: 'milestone', label: '成长里程碑', emoji: '🏆' },
  { type: 'emotion', label: '情绪记录', emoji: '😊' },
  { type: 'skill', label: '技能学习', emoji: '🌟' },
];

const emotions = [
  { type: 'happy', emoji: '😊', label: '开心' },
  { type: 'excited', emoji: '🥳', label: '兴奋' },
  { type: 'calm', emoji: '😌', label: '平静' },
  { type: 'sad', emoji: '😢', label: '难过' },
  { type: 'angry', emoji: '😤', label: '生气' },
  { type: 'frustrated', emoji: '😫', label: '沮丧' },
];

export default function AddRecordModal({ isOpen, onClose }: AddRecordModalProps) {
  const [type, setType] = useState<RecordType>('daily');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const addGrowthRecord = useAppStore((state) => state.addGrowthRecord);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record: GrowthRecord = {
      id: Date.now().toString(),
      type,
      content,
      date,
      tags: tags.length > 0 ? tags : undefined,
      createdAt: new Date().toISOString(),
    };
    addGrowthRecord(record);
    onClose();
    // Reset form
    setType('daily');
    setContent('');
    setDate(new Date().toISOString().split('T')[0]);
    setSelectedEmotion(null);
    setTags([]);
    setTagInput('');
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4 pb-20">
      <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">添加记录</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* 记录类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">记录类型</label>
            <div className="grid grid-cols-2 gap-2">
              {recordTypes.map((t) => (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => setType(t.type)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    type === t.type
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{t.emoji}</span>
                  <p className="text-sm mt-1">{t.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 日期选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              日期
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
            />
          </div>

          {/* 情绪选择（仅在情绪记录时显示） */}
          {type === 'emotion' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">今天的情绪</label>
              <div className="flex flex-wrap gap-2">
                {emotions.map((e) => (
                  <button
                    key={e.type}
                    type="button"
                    onClick={() => setSelectedEmotion(e.type)}
                    className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                      selectedEmotion === e.type
                        ? 'bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-purple-400'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-3xl">{e.emoji}</span>
                    <span className="text-xs text-gray-600 mt-1">{e.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 内容输入 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">记录内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="记录今天发生了什么..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none"
              required
            />
          </div>

          {/* 标签 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              标签
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-purple-500 hover:text-purple-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="添加标签..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all"
              >
                添加
              </button>
            </div>
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            保存记录 ✨
          </button>
        </form>
      </div>
    </div>
  );
}
