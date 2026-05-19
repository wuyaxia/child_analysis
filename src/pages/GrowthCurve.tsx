import { useState, useEffect, useMemo } from 'react';
import { Calendar, Ruler, Weight, Trash2, Plus, Baby } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Scatter
} from 'recharts';
import {
  GROWTH_STANDARDS,
  getStandardAtAge,
  getPercentileLabel,
  calculateAgeMonths
} from '../lib/growthStandards';
import type { GrowthMeasurement } from '../types';

// 准备图表数据：合并参考曲线和实际测量数据
function prepareChartData(
  gender: 'boy' | 'girl',
  measurements: GrowthMeasurement[],
  minAge: number = 0,
  maxAge: number = 72
) {
  const data: any[] = [];

  // 生成每个月龄的参考曲线数据
  for (let age = minAge; age <= maxAge; age += 1) {
    const heightStd = getStandardAtAge(gender, 'height', age);
    const weightStd = getStandardAtAge(gender, 'weight', age);

    const point: any = { age };

    if (heightStd) {
      point.heightP3 = heightStd.p3;
      point.heightP10 = heightStd.p10;
      point.heightP25 = heightStd.p25;
      point.heightP50 = heightStd.p50;
      point.heightP75 = heightStd.p75;
      point.heightP90 = heightStd.p90;
      point.heightP97 = heightStd.p97;
    }

    if (weightStd) {
      point.weightP3 = weightStd.p3;
      point.weightP10 = weightStd.p10;
      point.weightP25 = weightStd.p25;
      point.weightP50 = weightStd.p50;
      point.weightP75 = weightStd.p75;
      point.weightP90 = weightStd.p90;
      point.weightP97 = weightStd.p97;
    }

    data.push(point);
  }

  // 将实际测量数据作为散点添加
  measurements.forEach((m) => {
    const existingPoint = data.find((d) => d.age === m.ageMonths);
    if (existingPoint) {
      existingPoint.actualHeight = m.height;
      existingPoint.actualWeight = m.weight;
    } else {
      data.push({
        age: m.ageMonths,
        actualHeight: m.height,
        actualWeight: m.weight,
      });
    }
  });

  return data.sort((a, b) => a.age - b.age);
}

// 自定义 Tooltip
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;

  return (
    <div className="bg-white p-3 rounded-xl shadow-lg border border-[#5D4559]/10">
      <p className="font-bold text-[#5D4559] mb-1">{label} 个月</p>
      {payload.map((entry: any, index: number) => {
        if (entry.value == null) return null;
        const name = entry.name;
        let displayName = name;
        let unit = '';

        if (name.includes('身高')) {
          unit = ' cm';
        } else if (name.includes('体重')) {
          unit = ' kg';
        } else if (name.startsWith('P')) {
          displayName = `身高${name}`;
          unit = ' cm';
        } else if (name.startsWith('体重P')) {
          displayName = name;
          unit = ' kg';
        }

        return (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {displayName}: {entry.value.toFixed(1)}{unit}
          </p>
        );
      })}
    </div>
  );
}

export default function GrowthCurve() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    height: '',
    weight: '',
  });

  const storeMeasurements = useAppStore((state) => state.growthMeasurements);
  const addMeasurementToStore = useAppStore((state) => state.addGrowthMeasurement);
  const deleteMeasurementFromStore = useAppStore((state) => state.deleteGrowthMeasurement);
  const childProfile = useAppStore((state) => state.childProfile);
  const family = useAuthStore((state) => state.family);

  // 自动获取宝宝性别
  const childGender = useMemo<'boy' | 'girl'>(() => {
    if (childProfile?.gender) {
      return childProfile.gender;
    }
    // 从 family.children 中获取
    const activeChild = family?.children?.find((c) => c.isActive) || family?.children?.[0];
    return activeChild?.gender || 'boy';
  }, [childProfile, family]);

  // 自动获取宝宝生日
  const childBirthDate = useMemo(() => {
    if (childProfile?.birthDate) {
      return childProfile.birthDate;
    }
    const activeChild = family?.children?.find((c) => c.isActive) || family?.children?.[0];
    return activeChild?.birthDate;
  }, [childProfile, family]);

  // 宝宝姓名
  const childName = useMemo(() => {
    if (childProfile?.name) {
      return childProfile.name;
    }
    const activeChild = family?.children?.find((c) => c.isActive) || family?.children?.[0];
    return activeChild?.name || '宝宝';
  }, [childProfile, family]);

  const sortedMeasurements = useMemo(
    () => [...storeMeasurements].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [storeMeasurements]
  );

  // 计算图表显示的年龄范围
  const ageRange = useMemo(() => {
    if (sortedMeasurements.length === 0) return { min: 0, max: 72 };
    const ages = sortedMeasurements.map((m) => m.ageMonths);
    const min = Math.max(0, Math.min(...ages) - 6);
    const max = Math.min(72, Math.max(...ages) + 6);
    return { min, max };
  }, [sortedMeasurements]);

  // 准备图表数据
  const chartData = useMemo(
    () => prepareChartData(childGender, sortedMeasurements, ageRange.min, ageRange.max),
    [childGender, sortedMeasurements, ageRange.min, ageRange.max]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childBirthDate) {
      alert('未找到宝宝生日信息，无法计算月龄');
      return;
    }

    const ageMonths = calculateAgeMonths(childBirthDate, formData.date);

    addMeasurementToStore({
      ...formData,
      ageMonths,
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      childId: childProfile?.id || family?.children?.[0]?.id,
    } as GrowthMeasurement);

    setShowAddModal(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      height: '',
      weight: '',
    });
  };

  // 计算自动月龄（用于显示）
  const autoAgeMonths = useMemo(() => {
    if (!childBirthDate || !formData.date) return null;
    return calculateAgeMonths(childBirthDate, formData.date);
  }, [childBirthDate, formData.date]);

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
          {childName && (
            <div className="flex items-center gap-2 mt-3">
              <Baby className="w-4 h-4 text-[#D4836C]" />
              <span className="text-sm text-[#5D4559]/70">
                {childName} · {childGender === 'boy' ? '男' : '女'}孩
                {childBirthDate && ` · 生日: ${childBirthDate}`}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* 添加按钮 */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddModal(true)}
            className="organic-button text-white px-6 py-3 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            添加测量
          </button>
        </div>

        {/* 身高生长曲线图 */}
        <div className="organic-card p-6">
          <h3 className="text-lg font-bold text-[#5D4559] mb-4 flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#D4836C]" />
            身高曲线（cm）
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis
                  dataKey="age"
                  tick={{ fontSize: 12, fill: '#5D4559' }}
                  label={{ value: '月龄', position: 'insideBottom', offset: -2, fill: '#5D4559', fontSize: 12 }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#5D4559' }}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {/* 百分位参考曲线 */}
                <Area type="monotone" dataKey="heightP3" stroke="#E8D5D0" fill="#E8D5D0" fillOpacity={0.1} name="P3" />
                <Area type="monotone" dataKey="heightP97" stroke="#E8D5D0" fill="#E8D5D0" fillOpacity={0.1} name="P97" />
                <Line type="monotone" dataKey="heightP10" stroke="#D4836C" strokeDasharray="4 4" dot={false} strokeWidth={1} name="P10" />
                <Line type="monotone" dataKey="heightP25" stroke="#F7DBA7" strokeDasharray="4 4" dot={false} strokeWidth={1} name="P25" />
                <Line type="monotone" dataKey="heightP50" stroke="#AAB794" strokeWidth={2} dot={false} name="P50" />
                <Line type="monotone" dataKey="heightP75" stroke="#F7DBA7" strokeDasharray="4 4" dot={false} strokeWidth={1} name="P75" />
                <Line type="monotone" dataKey="heightP90" stroke="#D4836C" strokeDasharray="4 4" dot={false} strokeWidth={1} name="P90" />
                {/* 实际测量数据 */}
                <Scatter dataKey="actualHeight" fill="#D4836C" stroke="#D4836C" strokeWidth={2} r={5} name="实际身高" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#AAB794]" />P50 中位数</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#D4836C] border-dashed" />P10/P90</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#F7DBA7] border-dashed" />P25/P75</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#D4836C]" />实际测量</span>
          </div>
        </div>

        {/* 体重生长曲线图 */}
        <div className="organic-card p-6">
          <h3 className="text-lg font-bold text-[#5D4559] mb-4 flex items-center gap-2">
            <Weight className="w-5 h-5 text-[#AAB794]" />
            体重曲线（kg）
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis
                  dataKey="age"
                  tick={{ fontSize: 12, fill: '#5D4559' }}
                  label={{ value: '月龄', position: 'insideBottom', offset: -2, fill: '#5D4559', fontSize: 12 }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#5D4559' }}
                  domain={['dataMin - 2', 'dataMax + 2']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {/* 百分位参考曲线 */}
                <Area type="monotone" dataKey="weightP3" stroke="#D4E0D0" fill="#D4E0D0" fillOpacity={0.1} name="P3" />
                <Area type="monotone" dataKey="weightP97" stroke="#D4E0D0" fill="#D4E0D0" fillOpacity={0.1} name="P97" />
                <Line type="monotone" dataKey="weightP10" stroke="#AAB794" strokeDasharray="4 4" dot={false} strokeWidth={1} name="P10" />
                <Line type="monotone" dataKey="weightP25" stroke="#F7DBA7" strokeDasharray="4 4" dot={false} strokeWidth={1} name="P25" />
                <Line type="monotone" dataKey="weightP50" stroke="#D4836C" strokeWidth={2} dot={false} name="P50" />
                <Line type="monotone" dataKey="weightP75" stroke="#F7DBA7" strokeDasharray="4 4" dot={false} strokeWidth={1} name="P75" />
                <Line type="monotone" dataKey="weightP90" stroke="#AAB794" strokeDasharray="4 4" dot={false} strokeWidth={1} name="P90" />
                {/* 实际测量数据 */}
                <Scatter dataKey="actualWeight" fill="#AAB794" stroke="#AAB794" strokeWidth={2} r={5} name="实际体重" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#D4836C]" />P50 中位数</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#AAB794] border-dashed" />P10/P90</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#F7DBA7] border-dashed" />P25/P75</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#AAB794]" />实际测量</span>
          </div>
        </div>

        {/* 最新测量值 */}
        {sortedMeasurements.length > 0 && (
          <div className="organic-card p-6">
            <h3 className="text-lg font-bold text-[#5D4559] mb-4">最新测量</h3>
            {(() => {
              const latest = sortedMeasurements[sortedMeasurements.length - 1];
              const heightStatus = getPercentileLabel(latest.height, childGender, 'height', latest.ageMonths);
              const weightStatus = getPercentileLabel(latest.weight, childGender, 'weight', latest.ageMonths);

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
              {[...sortedMeasurements].reverse().map((m) => {
                const heightStatus = getPercentileLabel(m.height, childGender, 'height', m.ageMonths);
                const weightStatus = getPercentileLabel(m.weight, childGender, 'weight', m.ageMonths);

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
                        onClick={() => deleteMeasurementFromStore(m.id)}
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

              {/* 自动计算的月龄显示 */}
              {autoAgeMonths !== null && (
                <div className="bg-[#AAB794]/10 rounded-2xl p-3">
                  <p className="text-sm text-[#5D4559]/70">自动计算月龄</p>
                  <p className="text-lg font-bold text-[#5D4559]">{autoAgeMonths} 个月</p>
                </div>
              )}

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
