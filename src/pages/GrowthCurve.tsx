import { useState } from 'react';
import { Calendar, Ruler, Weight, Trash2, Plus } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

// 中国卫健委 3-6岁儿童身高体重标准值（简化版本）
const GROWTH_STANDARDS = {
  boy: {
    height: [
      { age: 36, p3: 90.6, p10: 92.8, p25: 95.1, p50: 97.5, p75: 100.1, p90: 102.7, p97: 105.7 },
      { age: 42, p3: 94.8, p10: 97.1, p25: 99.6, p50: 102.2, p75: 104.9, p90: 107.6, p97: 110.9 },
      { age: 48, p3: 98.7, p10: 101.2, p25: 103.7, p50: 106.5, p75: 109.4, p90: 112.3, p97: 115.8 },
      { age: 54, p3: 102.3, p10: 104.9, p25: 107.7, p50: 110.6, p75: 113.6, p90: 116.6, p97: 120.4 },
      { age: 60, p3: 105.8, p10: 108.7, p25: 111.6, p50: 114.7, p75: 117.9, p90: 121.1, p97: 125.1 },
      { age: 66, p3: 109.3, p10: 112.3, p25: 115.4, p50: 118.7, p75: 122.0, p90: 125.4, p97: 129.6 },
      { age: 72, p3: 112.7, p10: 115.8, p25: 119.0, p50: 122.5, p75: 126.0, p90: 129.6, p97: 134.0 },
    ],
    weight: [
      { age: 36, p3: 12.4, p10: 13.2, p25: 14.0, p50: 15.0, p75: 16.1, p90: 17.3, p97: 18.7 },
      { age: 42, p3: 13.9, p10: 14.8, p25: 15.8, p50: 16.9, p75: 18.2, p90: 19.5, p97: 21.2 },
      { age: 48, p3: 15.2, p10: 16.2, p25: 17.3, p50: 18.6, p75: 20.0, p90: 21.5, p97: 23.5 },
      { age: 54, p3: 16.5, p10: 17.6, p25: 18.8, p50: 20.2, p75: 21.8, p90: 23.5, p97: 25.6 },
      { age: 60, p3: 17.8, p10: 19.0, p25: 20.4, p50: 21.9, p75: 23.7, p90: 25.6, p97: 28.0 },
      { age: 66, p3: 19.1, p10: 20.4, p25: 21.9, p50: 23.7, p75: 25.7, p90: 27.8, p97: 30.5 },
      { age: 72, p3: 20.4, p10: 21.8, p25: 23.5, p50: 25.4, p75: 27.5, p90: 29.8, p97: 32.8 },
    ],
  },
  girl: {
    height: [
      { age: 36, p3: 89.3, p10: 91.6, p25: 94.0, p50: 96.3, p75: 98.9, p90: 101.4, p97: 104.5 },
      { age: 42, p3: 93.5, p10: 95.9, p25: 98.4, p50: 100.9, p75: 103.6, p90: 106.3, p97: 109.5 },
      { age: 48, p3: 97.4, p10: 100.0, p25: 102.7, p50: 105.4, p75: 108.3, p90: 111.1, p97: 114.5 },
      { age: 54, p3: 101.0, p10: 103.7, p25: 106.5, p50: 109.4, p75: 112.4, p90: 115.5, p97: 119.2 },
      { age: 60, p3: 104.6, p10: 107.4, p25: 110.3, p50: 113.4, p75: 116.6, p90: 119.8, p97: 123.8 },
      { age: 66, p3: 108.0, p10: 110.9, p25: 114.0, p50: 117.3, p75: 120.7, p90: 124.0, p97: 128.3 },
      { age: 72, p3: 111.6, p10: 114.7, p25: 117.9, p50: 121.4, p75: 125.0, p90: 128.6, p97: 133.0 },
    ],
    weight: [
      { age: 36, p3: 11.9, p10: 12.6, p25: 13.5, p50: 14.5, p75: 15.7, p90: 16.9, p97: 18.4 },
      { age: 42, p3: 13.4, p10: 14.2, p25: 15.1, p50: 16.3, p75: 17.6, p90: 18.9, p97: 20.7 },
      { age: 48, p3: 14.7, p10: 15.7, p25: 16.8, p50: 18.1, p75: 19.6, p90: 21.2, p97: 23.2 },
      { age: 54, p3: 15.9, p10: 17.1, p25: 18.4, p50: 19.9, p75: 21.6, p90: 23.4, p97: 25.7 },
      { age: 60, p3: 17.2, p10: 18.4, p25: 19.9, p50: 21.6, p75: 23.5, p90: 25.5, p97: 28.2 },
      { age: 66, p3: 18.4, p10: 19.8, p25: 21.4, p50: 23.3, p75: 25.4, p90: 27.6, p97: 30.5 },
      { age: 72, p3: 19.7, p10: 21.3, p25: 23.0, p50: 25.1, p75: 27.4, p90: 29.9, p97: 33.1 },
    ],
  },
};

export default function GrowthCurve() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [childGender, setChildGender] = useState<'boy' | 'girl'>('boy');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    ageMonths: 36,
    height: '',
    weight: '',
  });

  const { growthMeasurements, addGrowthMeasurement, deleteGrowthMeasurement } = useAppStore();

  const calculateAgeMonths = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    return Math.max(36, Math.min(72, months));
  };

  const getPercentileLabel = (value: number, type: 'height' | 'weight', ageMonths: number) => {
    const standards = GROWTH_STANDARDS[childGender][type];
    const standard = standards.reduce((closest, s) =>
      Math.abs(s.age - ageMonths) < Math.abs(closest.age - ageMonths) ? s : closest
    );

    if (value < standard.p3) return { label: '偏下', color: '#D4836C' };
    if (value < standard.p10) return { label: '中下', color: '#D4836C' };
    if (value < standard.p25) return { label: '偏低', color: '#F7DBA7' };
    if (value < standard.p75) return { label: '正常', color: '#AAB794' };
    if (value < standard.p90) return { label: '偏高', color: '#F7DBA7' };
    if (value < standard.p97) return { label: '中上', color: '#D4836C' };
    return { label: '偏上', color: '#D4836C' };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGrowthMeasurement({
      id: Date.now().toString(),
      ...formData,
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      createdAt: new Date().toISOString(),
    });
    setShowAddModal(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      ageMonths: 36,
      height: '',
      weight: '',
    });
  };

  const sortedMeasurements = [...growthMeasurements].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="min-h-screen pb-28">
      {/* 顶部区域 */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full dots-bg opacity-60" />
        <div className="relative z-10 px-6 pt-10 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-[#D4836C]/20 to-[#AAB794]/20 rounded-2xl p-2">
              <Ruler className="w-7 h-7 text-[#D4836C]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#5D4559]">生长发育曲线</h1>
              <p className="text-[#5D4559]/60 text-sm">基于中国卫健委标准</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* 性别选择和添加按钮 */}
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="block text-sm font-bold text-[#5D4559] mb-2">选择儿童性别</label>
            <div className="flex gap-2">
              <button
                onClick={() => setChildGender('boy')}
                className={`flex-1 py-3 px-4 rounded-2xl font-bold transition-all ${
                  childGender === 'boy'
                    ? 'bg-[#D4836C] text-white'
                    : 'bg-white text-[#5D4559]/60 hover:bg-[#FDF8F3]'
                }`}
              >
                男孩
              </button>
              <button
                onClick={() => setChildGender('girl')}
                className={`flex-1 py-3 px-4 rounded-2xl font-bold transition-all ${
                  childGender === 'girl'
                    ? 'bg-[#F2D5D0] text-[#5D4559]'
                    : 'bg-white text-[#5D4559]/60 hover:bg-[#FDF8F3]'
                }`}
              >
                女孩
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="organic-button text-white p-4"
          >
            <Plus className="w-7 h-7" />
          </button>
        </div>

        {/* 生长曲线图示意 */}
        <div className="organic-card p-6">
          <h3 className="text-lg font-bold text-[#5D4559] mb-4">生长趋势</h3>
          <div className="bg-gradient-to-b from-[#FDF8F3] to-white rounded-2xl p-4 h-48 flex items-center justify-center">
            {sortedMeasurements.length > 0 ? (
              <div className="w-full">
                <div className="flex justify-between text-xs text-[#5D4559]/60 mb-2">
                  <span>身高（cm）</span>
                  <span>年龄（月）</span>
                </div>
                <div className="flex items-end justify-around h-32 border-l-2 border-b-2 border-[#D4836C]/30">
                  {sortedMeasurements.map((m, i) => (
                    <div
                      key={m.id}
                      className="flex flex-col items-center"
                    >
                      <div
                        className="w-4 h-4 rounded-full bg-[#D4836C]"
                        style={{
                          transform: `translateY(${Math.max(0, Math.min(100, (1 - (m.height - 80) / 50)) * 100)}px)`,
                        }}
                      />
                      <span className="text-xs text-[#5D4559]/60 mt-2">{m.ageMonths}月</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-[#5D4559]/60">
                <div className="text-4xl mb-2">📊</div>
                <p>添加测量数据后将显示生长趋势</p>
              </div>
            )}
          </div>
        </div>

        {/* 最新测量值 */}
        {sortedMeasurements.length > 0 && (
          <div className="organic-card p-6">
            <h3 className="text-lg font-bold text-[#5D4559] mb-4">最新测量</h3>
            {(() => {
              const latest = sortedMeasurements[sortedMeasurements.length - 1];
              const heightStatus = getPercentileLabel(latest.height, 'height', latest.ageMonths);
              const weightStatus = getPercentileLabel(latest.weight, 'weight', latest.ageMonths);

              return (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#D4836C]/10 rounded-2xl p-4 text-center">
                    <Ruler className="w-8 h-8 mx-auto mb-2 text-[#D4836C]" />
                    <p className="text-sm text-[#5D4559]/60">身高</p>
                    <p className="text-3xl font-bold text-[#5D4559]">{latest.height} cm</p>
                    <span
                      className="inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2"
                      style={{ backgroundColor: heightStatus.color + '30', color: heightStatus.color }}
                    >
                      {heightStatus.label}
                    </span>
                  </div>
                  <div className="bg-[#AAB794]/10 rounded-2xl p-4 text-center">
                    <Weight className="w-8 h-8 mx-auto mb-2 text-[#AAB794]" />
                    <p className="text-sm text-[#5D4559]/60">体重</p>
                    <p className="text-3xl font-bold text-[#5D4559]">{latest.weight} kg</p>
                    <span
                      className="inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2"
                      style={{ backgroundColor: weightStatus.color + '30', color: weightStatus.color }}
                    >
                      {weightStatus.label}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 测量历史 */}
        <div>
          <h3 className="text-lg font-bold text-[#5D4559] mb-4">测量记录</h3>
          {sortedMeasurements.length === 0 ? (
            <div className="organic-card p-12 text-center">
              <div className="text-6xl mb-4">📏</div>
              <h4 className="text-xl font-semibold text-[#5D4559] mb-2">还没有测量记录</h4>
              <p className="text-[#5D4559]/60">点击上方按钮添加第一次测量</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedMeasurements.reverse().map((m) => {
                const heightStatus = getPercentileLabel(m.height, 'height', m.ageMonths);
                const weightStatus = getPercentileLabel(m.weight, 'weight', m.ageMonths);

                return (
                  <div key={m.id} className="organic-card p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#D4836C]/10 rounded-2xl p-2">
                          <Calendar className="w-5 h-5 text-[#D4836C]" />
                        </div>
                        <div>
                          <p className="font-bold text-[#5D4559]">{m.ageMonths}个月</p>
                          <p className="text-sm text-[#5D4559]/60">
                            {new Date(m.date).toLocaleDateString('zh-CN')}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteGrowthMeasurement(m.id)}
                        className="p-2 text-[#5D4559]/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[#5D4559]/70">身高</span>
                        <span className="font-bold text-[#D4836C]">{m.height} cm</span>
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ backgroundColor: heightStatus.color + '30', color: heightStatus.color }}
                        >
                          {heightStatus.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#5D4559]/70">体重</span>
                        <span className="font-bold text-[#AAB794]">{m.weight} kg</span>
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ backgroundColor: weightStatus.color + '30', color: weightStatus.color }}
                        >
                          {weightStatus.label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 标准参考值 */}
        <div className="organic-card p-6">
          <h3 className="text-lg font-bold text-[#5D4559] mb-4">标准参考值</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#D4836C]" />
              <span className="text-[#5D4559]/70">P3-P10: 偏下</span>
              <span className="w-4 h-4 rounded-full bg-[#F7DBA7]" />
              <span className="text-[#5D4559]/70">P10-P25: 偏低</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#AAB794]" />
              <span className="text-[#5D4559]/70">P25-P75: 正常范围</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#F7DBA7]" />
              <span className="text-[#5D4559]/70">P75-P90: 偏高</span>
              <span className="w-4 h-4 rounded-full bg-[#D4836C]" />
              <span className="text-[#5D4559]/70">P90-P97: 偏上</span>
            </div>
          </div>
        </div>
      </div>

      {/* 添加测量模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4 pb-24">
          <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-[#5D4559]/10 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-[#5D4559]">添加测量</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#5D4559]/5 hover:bg-[#5D4559]/10 transition-all"
              >
                <Trash2 className="w-5 h-5 text-[#5D4559]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#5D4559] mb-2">测量日期</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-[#5D4559]/15 rounded-2xl bg-[#FDF8F3] focus:border-[#D4836C] outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#5D4559] mb-2">月龄</label>
                <input
                  type="number"
                  min="36"
                  max="72"
                  value={formData.ageMonths}
                  onChange={(e) => setFormData({ ...formData, ageMonths: parseInt(e.target.value) || 36 })}
                  className="w-full px-4 py-3 border border-[#5D4559]/15 rounded-2xl bg-[#FDF8F3] focus:border-[#D4836C] outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#5D4559] mb-2">身高（厘米）</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="w-full px-4 py-3 border border-[#5D4559]/15 rounded-2xl bg-[#FDF8F3] focus:border-[#D4836C] outline-none transition-all"
                  placeholder="例如: 97.5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#5D4559] mb-2">体重（公斤）</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-4 py-3 border border-[#5D4559]/15 rounded-2xl bg-[#FDF8F3] focus:border-[#D4836C] outline-none transition-all"
                  placeholder="例如: 15.0"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#D4836C] to-[#C17059] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                保存测量 ✨
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
