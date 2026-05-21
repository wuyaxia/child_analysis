import { useState } from 'react';
import { Calendar, Plus, ChevronDown, ChevronUp, Trash2, Edit2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { Review } from '../types';

export default function ReviewPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    age: '',
    date: new Date().toISOString().split('T')[0],
    problems: [''],
    improvements: [''],
    notes: '',
  });

  const reviews = useAppStore((state) => state.reviews);
  const addReview = useAppStore((state) => state.addReview);
  const deleteReview = useAppStore((state) => state.deleteReview);
  const childProfile = useAppStore((state) => state.childProfile);

  const handleAddProblem = () => {
    setFormData({ ...formData, problems: [...formData.problems, ''] });
  };

  const handleRemoveProblem = (index: number) => {
    const newProblems = formData.problems.filter((_, i) => i !== index);
    setFormData({ ...formData, problems: newProblems });
  };

  const handleProblemChange = (index: number, value: string) => {
    const newProblems = [...formData.problems];
    newProblems[index] = value;
    setFormData({ ...formData, problems: newProblems });
  };

  const handleAddImprovement = () => {
    setFormData({ ...formData, improvements: [...formData.improvements, ''] });
  };

  const handleRemoveImprovement = (index: number) => {
    const newImprovements = formData.improvements.filter((_, i) => i !== index);
    setFormData({ ...formData, improvements: newImprovements });
  };

  const handleImprovementChange = (index: number, value: string) => {
    const newImprovements = [...formData.improvements];
    newImprovements[index] = value;
    setFormData({ ...formData, improvements: newImprovements });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.age.trim()) return;

    await addReview({
      childId: childProfile?.id || '',
      title: formData.title,
      age: formData.age,
      date: formData.date,
      problems: formData.problems.filter((p) => p.trim()),
      improvements: formData.improvements.filter((i) => i.trim()),
      notes: formData.notes,
    });

    setFormData({
      title: '',
      age: '',
      date: new Date().toISOString().split('T')[0],
      problems: [''],
      improvements: [''],
      notes: '',
    });
    setShowAddForm(false);
  };

  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen pb-28">
      {/* 顶部区域 */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full dots-bg opacity-60" />
        <div className="relative z-10 px-6 pt-10 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#AAB794]/20 rounded-2xl p-2">
              <Calendar className="w-7 h-7 text-[#AAB794]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#5D4559]">阶段复盘</h1>
              <p className="text-[#5D4559]/60 text-sm">定期收集问题，阶段性总结复盘</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* 添加复盘按钮 */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full organic-button text-white p-5"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-2xl p-3">
              <Plus className="w-7 h-7" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg">新建复盘记录</h3>
              <p className="text-white/80 text-sm">记录阶段性问题和改进</p>
            </div>
          </div>
        </button>

        {/* 添加表单 */}
        {showAddForm && (
          <div className="organic-card p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 标题和年龄 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-[#5D4559] mb-2">阶段名称</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="如：3岁总结"
                    className="w-full px-4 py-3 border border-[#5D4559]/15 rounded-2xl bg-[#FDF8F3] focus:border-[#D4836C] outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#5D4559] mb-2">年龄</label>
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="如：3岁1个月"
                    className="w-full px-4 py-3 border border-[#5D4559]/15 rounded-2xl bg-[#FDF8F3] focus:border-[#D4836C] outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* 日期 */}
              <div>
                <label className="block text-sm font-bold text-[#5D4559] mb-2">日期</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-[#5D4559]/15 rounded-2xl bg-[#FDF8F3] focus:border-[#D4836C] outline-none transition-all"
                />
              </div>

              {/* 遇到的问题 */}
              <div>
                <label className="block text-sm font-bold text-[#5D4559] mb-2">遇到的问题</label>
                <div className="space-y-2">
                  {formData.problems.map((problem, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={problem}
                        onChange={(e) => handleProblemChange(index, e.target.value)}
                        placeholder={`问题 ${index + 1}`}
                        className="flex-1 px-4 py-2 border border-[#5D4559]/15 rounded-xl bg-[#FDF8F3] focus:border-[#D4836C] outline-none transition-all"
                      />
                      {formData.problems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveProblem(index)}
                          className="px-3 py-2 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddProblem}
                  className="mt-2 text-sm text-[#D4836C] hover:text-[#C17059] font-medium"
                >
                  + 添加问题
                </button>
              </div>

              {/* 改进措施 */}
              <div>
                <label className="block text-sm font-bold text-[#5D4559] mb-2">改进措施</label>
                <div className="space-y-2">
                  {formData.improvements.map((improvement, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={improvement}
                        onChange={(e) => handleImprovementChange(index, e.target.value)}
                        placeholder={`措施 ${index + 1}`}
                        className="flex-1 px-4 py-2 border border-[#5D4559]/15 rounded-xl bg-[#FDF8F3] focus:border-[#D4836C] outline-none transition-all"
                      />
                      {formData.improvements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImprovement(index)}
                          className="px-3 py-2 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddImprovement}
                  className="mt-2 text-sm text-[#AAB794] hover:text-[#8fa17a] font-medium"
                >
                  + 添加措施
                </button>
              </div>

              {/* 备注 */}
              <div>
                <label className="block text-sm font-bold text-[#5D4559] mb-2">其他备注</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="其他想记录的内容..."
                  rows={3}
                  className="w-full px-4 py-3 border border-[#5D4559]/15 rounded-2xl bg-[#FDF8F3] focus:border-[#D4836C] outline-none transition-all resize-none"
                />
              </div>

              {/* 提交按钮 */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#D4836C] to-[#C17059] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                保存复盘记录 ✨
              </button>
            </form>
          </div>
        )}

        {/* 历史复盘记录 */}
        <div>
          <h3 className="text-lg font-bold text-[#5D4559] mb-4">复盘历史</h3>
          
          {sortedReviews.length === 0 ? (
            <div className="organic-card p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-[#5D4559] mb-2">还没有复盘记录</h3>
              <p className="text-[#5D4559]/60">点击上方按钮创建第一个复盘！</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedReviews.map((review) => (
                <div key={review.id} className="organic-card overflow-hidden">
                  <button
                    onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)}
                    className="w-full text-left"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-[#5D4559] mb-1">{review.title}</h4>
                          <div className="flex items-center gap-3 text-sm text-[#5D4559]/60">
                            <span>{review.age}</span>
                            <span>•</span>
                            <span>{new Date(review.date).toLocaleDateString('zh-CN')}</span>
                          </div>
                        </div>
                        {expandedReview === review.id ? (
                          <ChevronUp className="w-5 h-5 text-[#5D4559]/50" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[#5D4559]/50" />
                        )}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <span className="bg-[#D4836C]/15 text-[#D4836C] px-3 py-1 rounded-full text-xs font-medium">
                          {review.problems.length} 个问题
                        </span>
                        <span className="bg-[#AAB794]/15 text-[#AAB794] px-3 py-1 rounded-full text-xs font-medium">
                          {review.improvements.length} 项改进
                        </span>
                      </div>
                    </div>
                  </button>

                  {expandedReview === review.id && (
                    <div className="px-5 pb-5 border-t border-[#5D4559]/10">
                      <div className="pt-4 space-y-4">
                        {/* 问题 */}
                        {review.problems.length > 0 && (
                          <div>
                            <h5 className="text-sm font-bold text-[#D4836C] mb-2">🔍 遇到的问题</h5>
                            <ul className="space-y-2">
                              {review.problems.map((problem, index) => (
                                <li key={index} className="text-[#5D4559]/85 text-sm bg-[#D4836C]/5 p-3 rounded-xl">
                                  {problem}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* 改进 */}
                        {review.improvements.length > 0 && (
                          <div>
                            <h5 className="text-sm font-bold text-[#AAB794] mb-2">✨ 改进措施</h5>
                            <ul className="space-y-2">
                              {review.improvements.map((improvement, index) => (
                                <li key={index} className="text-[#5D4559]/85 text-sm bg-[#AAB794]/5 p-3 rounded-xl">
                                  {improvement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* 备注 */}
                        {review.notes && (
                          <div>
                            <h5 className="text-sm font-bold text-[#5D4559] mb-2">📝 备注</h5>
                            <p className="text-[#5D4559]/85 text-sm bg-[#F2D5D0]/20 p-3 rounded-xl">
                              {review.notes}
                            </p>
                          </div>
                        )}

                        {/* 操作按钮 */}
                        <div className="flex gap-3 pt-2">
                          <button className="flex-1 p-3 bg-[#D4836C]/10 text-[#D4836C] rounded-xl hover:bg-[#D4836C]/20 transition-all">
                            <Edit2 className="w-4 h-4 mx-auto" />
                          </button>
                          <button 
                            onClick={() => deleteReview(review.id)}
                            className="flex-1 p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}