import React, { useState, useEffect } from 'react';
import { Upload, Database, CheckCircle, XCircle, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { apiClient } from '../../../lib/apiClient';
import { useAuthStore } from '../../../store/useAuthStore';
import { useChildrenStore } from '../../../store/useChildrenStore';
import { useAppStore } from '../../../store/useAppStore';
import { GrowthRecord, Task, Review, GrowthMeasurement } from '../../../types';

interface MigrationResult {
  success: boolean;
  count: number;
  errors: string[];
}

interface MigrationState {
  stage: 'intro' | 'checking' | 'migrating' | 'done' | 'error';
  progress: number;
  currentStep: string;
  results: {
    growthRecords?: MigrationResult;
    tasks?: MigrationResult;
    reviews?: MigrationResult;
    growthMeasurements?: MigrationResult;
  };
}

export default function DataMigrationWizard({ onComplete }: { onComplete?: () => void }) {
  const [state, setState] = useState<MigrationState>({
    stage: 'intro',
    progress: 0,
    currentStep: '',
    results: {}
  });

  const { family } = useAuthStore();
  const { currentChild } = useChildrenStore();
  const appStore = useAppStore();

  // 检查是否有本地数据需要迁移
  const hasLocalData = appStore.growthRecords.length > 0 || 
                      appStore.tasks.filter(t => t.isCustom).length > 0 ||
                      appStore.reviews.length > 0 ||
                      appStore.growthMeasurements.length > 0;

  const handleStartMigration = async () => {
    if (!family?.id || !currentChild?.id) {
      setState(prev => ({
        ...prev,
        stage: 'error',
        currentStep: '未选择家庭或孩子'
      }));
      return;
    }

    setState({
      stage: 'migrating',
      progress: 0,
      currentStep: '准备迁移数据...',
      results: {}
    });

    try {
      // 迁移成长记录
      setState(prev => ({ ...prev, currentStep: '迁移成长记录...', progress: 10 }));
      const growthRecordsResult = await migrateGrowthRecords();

      // 迁移任务
      setState(prev => ({ ...prev, currentStep: '迁移任务数据...', progress: 35 }));
      const tasksResult = await migrateTasks();

      // 迁移复盘
      setState(prev => ({ ...prev, currentStep: '迁移复盘数据...', progress: 60 }));
      const reviewsResult = await migrateReviews();

      // 迁移生长测量
      setState(prev => ({ ...prev, currentStep: '迁移生长测量数据...', progress: 85 }));
      const measurementsResult = await migrateMeasurements();

      setState(prev => ({
        ...prev,
        stage: 'done',
        progress: 100,
        currentStep: '迁移完成！',
        results: {
          growthRecords: growthRecordsResult,
          tasks: tasksResult,
          reviews: reviewsResult,
          growthMeasurements: measurementsResult
        }
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        stage: 'error',
        currentStep: error instanceof Error ? error.message : '迁移失败'
      }));
    }
  };

  const migrateGrowthRecords = async (): Promise<MigrationResult> => {
    const records = appStore.growthRecords;
    if (records.length === 0) {
      return { success: true, count: 0, errors: [] };
    }

    const errors: string[] = [];
    let migratedCount = 0;

    for (const record of records) {
      try {
        await apiClient.growthRecords.create({
          childId: currentChild!.id,
          date: record.date,
          type: record.type,
          content: record.content,
          photos: record.photos,
          tags: record.tags,
          createdBy: record.createdBy
        });
        migratedCount++;
      } catch (error) {
        errors.push(`记录 ${record.id}: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    }

    return {
      success: errors.length === 0,
      count: migratedCount,
      errors
    };
  };

  const migrateTasks = async (): Promise<MigrationResult> => {
    const customTasks = appStore.tasks.filter(t => t.isCustom);
    if (customTasks.length === 0) {
      return { success: true, count: 0, errors: [] };
    }

    const errors: string[] = [];
    let migratedCount = 0;

    for (const task of customTasks) {
      try {
        await apiClient.tasks.create({
          childId: currentChild!.id,
          title: task.title,
          description: task.description,
          category: task.category,
          difficulty: task.difficulty,
          ageMin: task.ageRange.min,
          ageMax: task.ageRange.max,
          duration: task.duration,
          knowledgeIds: task.knowledgeIds,
          frequency: task.frequency,
          isCustom: true,
          createdBy: task.createdBy
        });
        migratedCount++;
      } catch (error) {
        errors.push(`任务 ${task.id}: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    }

    return {
      success: errors.length === 0,
      count: migratedCount,
      errors
    };
  };

  const migrateReviews = async (): Promise<MigrationResult> => {
    const reviews = appStore.reviews;
    if (reviews.length === 0) {
      return { success: true, count: 0, errors: [] };
    }

    const errors: string[] = [];
    let migratedCount = 0;

    for (const review of reviews) {
      try {
        await apiClient.reviews.create({
          childId: currentChild!.id,
          title: review.title,
          age: review.age,
          date: review.date,
          problems: review.problems,
          improvements: review.improvements,
          notes: review.notes,
          createdBy: review.createdBy
        });
        migratedCount++;
      } catch (error) {
        errors.push(`复盘 ${review.id}: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    }

    return {
      success: errors.length === 0,
      count: migratedCount,
      errors
    };
  };

  const migrateMeasurements = async (): Promise<MigrationResult> => {
    const measurements = appStore.growthMeasurements;
    if (measurements.length === 0) {
      return { success: true, count: 0, errors: [] };
    }

    const errors: string[] = [];
    let migratedCount = 0;

    for (const measurement of measurements) {
      try {
        await apiClient.growthMeasurements.create({
          childId: currentChild!.id,
          date: measurement.date,
          ageMonths: measurement.ageMonths,
          height: measurement.height,
          weight: measurement.weight,
          headCircumference: measurement.headCircumference,
          createdBy: measurement.createdBy
        });
        migratedCount++;
      } catch (error) {
        errors.push(`测量 ${measurement.id}: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    }

    return {
      success: errors.length === 0,
      count: migratedCount,
      errors
    };
  };

  const getTotalMigrated = () => {
    const { results } = state;
    return (results.growthRecords?.count || 0) +
           (results.tasks?.count || 0) +
           (results.reviews?.count || 0) +
           (results.growthMeasurements?.count || 0);
  };

  const getTotalErrors = () => {
    const { results } = state;
    return (results.growthRecords?.errors.length || 0) +
           (results.tasks?.errors.length || 0) +
           (results.reviews?.errors.length || 0) +
           (results.growthMeasurements?.errors.length || 0);
  };

  if (state.stage === 'intro') {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-[#F7DBA7]/20 rounded-2xl p-3">
            <Upload className="w-6 h-6 text-[#D4836C]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#5D4559] text-lg mb-2">
              数据迁移向导
            </h3>
            <p className="text-sm text-[#5D4559]/70 mb-4">
              将您的本地数据迁移到云端数据库，实现数据同步和备份。
            </p>
            
            {hasLocalData ? (
              <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                <p className="text-sm text-[#5D4559]/70 mb-3">检测到本地数据：</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#5D4559]/60">成长记录</span>
                    <span className="font-semibold text-[#5D4559]">{appStore.growthRecords.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5D4559]/60">自定义任务</span>
                    <span className="font-semibold text-[#5D4559]">{appStore.tasks.filter(t => t.isCustom).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5D4559]/60">复盘</span>
                    <span className="font-semibold text-[#5D4559]">{appStore.reviews.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5D4559]/60">生长测量</span>
                    <span className="font-semibold text-[#5D4559]">{appStore.growthMeasurements.length}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">没有本地数据需要迁移</span>
                </div>
              </div>
            )}

            <button
              onClick={handleStartMigration}
              disabled={!hasLocalData}
              className="w-full bg-[#D4836C] hover:bg-[#D4836C]/90 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Database className="w-5 h-5" />
              {hasLocalData ? '开始迁移' : '暂无数据'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.stage === 'migrating') {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="text-center py-8">
          <div className="animate-spin w-12 h-12 border-4 border-[#D4836C] border-t-transparent rounded-full mx-auto mb-4" />
          <h3 className="font-bold text-[#5D4559] text-lg mb-2">
            正在迁移数据...
          </h3>
          <p className="text-sm text-[#5D4559]/70 mb-4">{state.currentStep}</p>
          
          {/* 进度条 */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#D4836C] h-2 rounded-full transition-all duration-300" 
              style={{ width: `${state.progress}%` }} 
            />
          </div>
          <p className="text-sm text-[#5D4559]/60 mt-2">{state.progress}%</p>
        </div>
      </div>
    );
  }

  if (state.stage === 'done') {
    const totalMigrated = getTotalMigrated();
    const totalErrors = getTotalErrors();
    
    return (
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="flex items-start gap-4 mb-6">
          <div className={`${totalErrors === 0 ? 'bg-green-100' : 'bg-yellow-100'} rounded-2xl p-3`}>
            {totalErrors === 0 ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#5D4559] text-lg mb-2">
              迁移完成！
            </h3>
            <p className="text-sm text-[#5D4559]/70 mb-4">
              成功迁移 {totalMigrated} 条数据{totalErrors > 0 && `，${totalErrors} 条失败`}
            </p>

            <div className="space-y-3 mb-4">
              {[
                { key: 'growthRecords', label: '成长记录', result: state.results.growthRecords },
                { key: 'tasks', label: '任务', result: state.results.tasks },
                { key: 'reviews', label: '复盘', result: state.results.reviews },
                { key: 'growthMeasurements', label: '生长测量', result: state.results.growthMeasurements },
              ].map(({ key, label, result }) => {
                if (!result) return null;
                
                return (
                  <div 
                    key={key}
                    className={`p-3 rounded-xl ${
                      result.success 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#5D4559]">{label}</span>
                      {result.success ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">{result.count} 条</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <XCircle className="w-4 h-4" />
                          <span className="text-sm">错误</span>
                        </div>
                      )}
                    </div>
                    {result.errors.length > 0 && (
                      <div className="mt-2 text-xs text-red-500">
                        {result.errors.slice(0, 2).map((err, i) => (
                          <div key={i}>{err}</div>
                        ))}
                        {result.errors.length > 2 && (
                          <div>...还有 {result.errors.length - 2} 条错误</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={onComplete}
              className="w-full bg-[#D4836C] hover:bg-[#D4836C]/90 text-white font-semibold py-3 px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              完成
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.stage === 'error') {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="text-center py-8">
          <div className="bg-red-100 rounded-2xl p-3 inline-block mb-4">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="font-bold text-[#5D4559] text-lg mb-2">
            迁移失败
          </h3>
          <p className="text-sm text-[#5D4559]/70 mb-4">{state.currentStep}</p>
          
          <button
            onClick={handleStartMigration}
            className="bg-[#D4836C] hover:bg-[#D4836C]/90 text-white font-semibold py-3 px-6 rounded-2xl transition-all flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            重试
          </button>
        </div>
      </div>
    );
  }

  return null;
}
