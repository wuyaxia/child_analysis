import { useState, useEffect } from 'react';
import { Upload, Database, CheckCircle, X, AlertCircle, ArrowRight } from 'lucide-react';
import { dataMigration } from '../../../lib/dataMigration';
import { useAuthStore } from '../../../store/useAuthStore';
import { useChildrenStore } from '../../../store/useChildrenStore';

interface MigrationResult {
  success: boolean;
  migrated: number;
  failed: number;
  errors: string[];
}

interface MigrationResults {
  growthRecords: MigrationResult;
  tasks: MigrationResult;
  reviews: MigrationResult;
  measurements: MigrationResult;
}

export default function MigrationGuide() {
  const [step, setStep] = useState<'intro' | 'migrating' | 'done'>('intro');
  const [results, setResults] = useState<MigrationResults | null>(null);
  const [localDataCount, setLocalDataCount] = useState({ 
    growthRecords: 0, 
    tasks: 0, 
    reviews: 0, 
    measurements: 0, 
    total: 0 
  });
  const { family } = useAuthStore();
  const { currentChild } = useChildrenStore();

  useEffect(() => {
    if (family?.id && currentChild?.id) {
      setLocalDataCount(dataMigration.getLocalDataCount());
    }
  }, [family?.id, currentChild?.id]);

  const handleStartMigration = async () => {
    setStep('migrating');
    const migrationResults = await dataMigration.migrateAll();
    setResults(migrationResults);
    setStep('done');
  };

  if (!family?.id || !currentChild?.id) {
    return null;
  }

  const totalMigrated = results 
    ? results.growthRecords.migrated + 
      results.tasks.migrated + 
      results.reviews.migrated + 
      results.measurements.migrated
    : 0;

  if (step === 'intro') {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-[#F7DBA7]/20 rounded-2xl p-3">
            <Upload className="w-6 h-6 text-[#D4836C]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#5D4559] text-lg mb-2">
              数据迁移到云端
            </h3>
            <p className="text-sm text-[#5D4559]/70 mb-4">
              将您的本地数据备份到 Firebase 云端，实现多设备同步
            </p>
            
            {localDataCount.total > 0 ? (
              <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                <p className="text-sm text-[#5D4559]/70 mb-3">本地数据统计：</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#5D4559]/60">成长记录</span>
                    <span className="font-semibold text-[#5D4559]">{localDataCount.growthRecords}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5D4559]/60">任务打卡</span>
                    <span className="font-semibold text-[#5D4559]">{localDataCount.tasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5D4559]/60">阶段复盘</span>
                    <span className="font-semibold text-[#5D4559]">{localDataCount.reviews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5D4559]/60">生长测量</span>
                    <span className="font-semibold text-[#5D4559]">{localDataCount.measurements}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                  <span className="font-medium text-[#5D4559]">总计</span>
                  <span className="font-bold text-[#D4836C]">{localDataCount.total} 条</span>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">暂无本地数据需要迁移</span>
                </div>
              </div>
            )}

            <button
              onClick={handleStartMigration}
              disabled={localDataCount.total === 0}
              className="w-full bg-[#D4836C] hover:bg-[#D4836C]/90 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Database className="w-5 h-5" />
              {localDataCount.total > 0 ? '开始迁移' : '暂无数据需迁移'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'migrating') {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="text-center py-8">
          <div className="animate-spin w-12 h-12 border-4 border-[#D4836C] border-t-transparent rounded-full mx-auto mb-4" />
          <h3 className="font-bold text-[#5D4559] text-lg mb-2">
            正在迁移数据...
          </h3>
          <p className="text-sm text-[#5D4559]/60">
            请稍候，数据正在上传到云端
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-green-100 rounded-2xl p-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-[#5D4559] text-lg mb-2">
            迁移完成！
          </h3>
          <p className="text-sm text-[#5D4559]/70 mb-4">
            成功迁移 {totalMigrated} 条数据到云端
          </p>

          <div className="space-y-3">
            {[
              { key: 'growthRecords', label: '成长记录' },
              { key: 'tasks', label: '任务打卡' },
              { key: 'reviews', label: '阶段复盘' },
              { key: 'measurements', label: '生长测量' },
            ].map(({ key, label }) => {
              const result = results?.[key as keyof MigrationResults];
              return (
                <div 
                  key={key}
                  className={`p-3 rounded-xl ${
                    result?.success 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#5D4559]">{label}</span>
                    {result?.success ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">{result.migrated} 条</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600">
                        <X className="w-4 h-4" />
                        <span className="text-sm">失败</span>
                      </div>
                    )}
                  </div>
                  {result?.errors && result.errors.length > 0 && (
                    <p className="text-xs text-red-500 mt-1">{result.errors[0]}</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-[#F7DBA7]/20 rounded-2xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#D4836C] flex-shrink-0 mt-0.5" />
              <div className="text-sm text-[#5D4559]/80">
                <p className="font-medium mb-1">提示</p>
                <p>数据已同步到云端，家庭成员可实时共享。迁移完成后建议清除本地缓存以确保数据一致性。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
