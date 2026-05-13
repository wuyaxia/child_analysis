import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby, Plus, Edit2, Check, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useChildrenStore } from '../store/useChildrenStore';

export default function ChildrenPage() {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    gender: 'boy' as 'boy' | 'girl'
  });

  const { children, currentChild, fetchChildren, addChild, updateChild, setCurrentChild, isLoading, error } = useChildrenStore();
  const { family } = useAuthStore();

  useEffect(() => {
    if (family?.id) {
      fetchChildren();
    }
  }, [family?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateChild(editingId, formData);
      setEditingId(null);
    } else {
      await addChild(formData);
      setIsAdding(false);
    }
    setFormData({ name: '', birthDate: '', gender: 'boy' });
  };

  const startEdit = (child: any) => {
    setEditingId(child.id);
    setFormData({
      name: child.name,
      birthDate: child.birthDate,
      gender: child.gender
    });
    setIsAdding(true);
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', birthDate: '', gender: 'boy' });
  };

  if (!family) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>请先加入家庭</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6 text-[#5D4559]" />
          </button>
          <h1 className="text-xl font-bold text-[#5D4559]">孩子管理</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Children List */}
        <div className="space-y-4">
          {children.map((child) => (
            <div
              key={child.id}
              className={`organic-card p-5 transition-all ${
                child.id === currentChild?.id ? 'ring-2 ring-[#D4836C]' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                    child.gender === 'boy' ? 'bg-blue-100' : 'bg-pink-100'
                  }`}>
                    {child.gender === 'boy' ? '👦' : '👧'}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#5D4559] text-lg">{child.name}</h3>
                    <p className="text-[#5D4559]/60 text-sm">
                      出生于 {child.birthDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {child.id === currentChild?.id ? (
                    <div className="bg-[#D4836C] text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      当前
                    </div>
                  ) : (
                    <button
                      onClick={() => setCurrentChild(child)}
                      className="text-[#D4836C] hover:bg-[#D4836C]/10 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      切换
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(child)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <Edit2 className="w-5 h-5 text-[#5D4559]/60" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Button */}
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full organic-card p-5 border-2 border-dashed border-[#5D4559]/20 hover:border-[#D4836C]/40 transition-all flex items-center justify-center gap-3"
          >
            <div className="bg-[#D4836C]/10 rounded-2xl p-3">
              <Plus className="w-6 h-6 text-[#D4836C]" />
            </div>
            <span className="font-medium text-[#5D4559]/70">添加孩子</span>
          </button>
        )}

        {/* Add/Edit Form */}
        {isAdding && (
          <div className="organic-card p-6">
            <h3 className="text-lg font-bold text-[#5D4559] mb-6">
              {editingId ? '编辑孩子信息' : '添加孩子'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#5D4559] mb-2">
                  孩子姓名
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入姓名"
                  className="block w-full px-4 py-3 border-2 border-[#5D4559]/10 rounded-2xl focus:ring-2 focus:ring-[#D4836C]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5D4559] mb-2">
                  出生日期
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="block w-full px-4 py-3 border-2 border-[#5D4559]/10 rounded-2xl focus:ring-2 focus:ring-[#D4836C]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5D4559] mb-3">
                  性别
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: 'boy' })}
                    className={`flex-1 p-4 rounded-2xl text-center transition-all border-2 ${
                      formData.gender === 'boy'
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-[#5D4559]/10 hover:border-[#5D4559]/20'
                    }`}
                  >
                    <span className="text-3xl">👦</span>
                    <p className={`text-sm font-medium mt-1 ${
                      formData.gender === 'boy' ? 'text-blue-600' : 'text-[#5D4559]/70'
                    }`}>
                      男孩
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: 'girl' })}
                    className={`flex-1 p-4 rounded-2xl text-center transition-all border-2 ${
                      formData.gender === 'girl'
                        ? 'border-pink-400 bg-pink-50'
                        : 'border-[#5D4559]/10 hover:border-[#5D4559]/20'
                    }`}
                  >
                    <span className="text-3xl">👧</span>
                    <p className={`text-sm font-medium mt-1 ${
                      formData.gender === 'girl' ? 'text-pink-600' : 'text-[#5D4559]/70'
                    }`}>
                      女孩
                    </p>
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 py-3 px-6 rounded-2xl font-medium text-[#5D4559]/60 hover:bg-gray-100"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={!formData.name || !formData.birthDate || isLoading}
                  className="flex-1 bg-[#D4836C] hover:bg-[#D4836C]/90 text-white font-semibold py-3 px-6 rounded-2xl disabled:opacity-50 transition-all"
                >
                  {isLoading ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
