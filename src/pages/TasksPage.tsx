import { useState, useMemo, useEffect } from 'react';
import { CheckCircle, Plus, Calendar, Trash2, Sparkles, Target, Filter, Star, Clock, X, ChevronRight } from 'lucide-react';
import AddTaskModal from '../components/features/tasks/AddTaskModal';
import { useAppStore, categoryConfig, difficultyConfig, ageGroupConfig } from '../store/useAppStore';
import { firestoreDataService } from '../lib/firestoreDataService';
import type { TaskCategory, DifficultyLevel, Task } from '../types';

type TabType = 'my' | 'recommend';

export default function TasksPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('my');
  const [filterCategory, setFilterCategory] = useState<TaskCategory | 'all'>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<'3' | '4' | '5' | '6'>('3');
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const storeTasks = useAppStore((state) => state.tasks);
  const presetTasks = useAppStore((state) => state.presetTasks);
  const addTaskToStore = useAppStore((state) => state.addTask);
  const addMultipleTasks = useAppStore((state) => state.addMultipleTasks);
  const toggleTaskCompleteStore = useAppStore((state) => state.toggleTaskComplete);
  const deleteTaskFromStore = useAppStore((state) => state.deleteTask);
  const family = (useAppStore.getState() as any)?.family;

  const tasks = localTasks.length > 0 ? localTasks : storeTasks;

  useEffect(() => {
    const loadTasks = async () => {
      if (family?.id) {
        try {
          const firestoreTasks = await firestoreDataService.getTasks();
          if (firestoreTasks.length > 0) {
            setLocalTasks(firestoreTasks);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error('从 Firestore 加载任务失败:', error);
        }
      }
      setLocalTasks(storeTasks);
      setIsLoading(false);
    };
    loadTasks();
  }, [family?.id]);

  const toggleTaskComplete = async (taskId: string, date: string) => {
    if (family?.id) {
      try {
        await firestoreDataService.toggleTaskComplete(taskId, date);
        setLocalTasks(prev => prev.map(task => {
          if (task.id !== taskId) return task;
          const completed = task.completedDates.includes(date);
          return {
            ...task,
            completedDates: completed
              ? task.completedDates.filter(d => d !== date)
              : [...task.completedDates, date]
          };
        }));
        return;
      } catch (error) {
        console.error('更新 Firestore 任务失败:', error);
      }
    }
    toggleTaskCompleteStore(taskId, date);
    setLocalTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      const completed = task.completedDates.includes(date);
      return {
        ...task,
        completedDates: completed
          ? task.completedDates.filter(d => d !== date)
          : [...task.completedDates, date]
      };
    }));
  };

  const deleteTask = async (taskId: string) => {
    if (family?.id) {
      try {
        await firestoreDataService.deleteTask(taskId);
        setLocalTasks(prev => prev.filter(t => t.id !== taskId));
        return;
      } catch (error) {
        console.error('从 Firestore 删除任务失败:', error);
      }
    }
    deleteTaskFromStore(taskId);
    setLocalTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask = { ...task, id: `task-${Date.now()}`, createdAt: new Date().toISOString() };
    if (family?.id) {
      try {
        const id = await firestoreDataService.addTask(task);
        setLocalTasks(prev => [{ ...task, id, createdAt: new Date().toISOString() }, ...prev]);
        return;
      } catch (error) {
        console.error('添加到 Firestore 失败:', error);
      }
    }
    addTaskToStore(newTask as Task);
    setLocalTasks(prev => [newTask as Task, ...prev]);
  };

  const addMultipleTasksToFirestore = async (tasksToAdd: Task[]) => {
    const newTasks = tasksToAdd.map(t => ({ ...t, id: `task-${Date.now()}-${Math.random()}`, createdAt: new Date().toISOString() }));
    if (family?.id) {
      try {
        for (const task of newTasks) {
          await firestoreDataService.addTask(task);
        }
        setLocalTasks(prev => [...newTasks, ...prev]);
        return;
      } catch (error) {
        console.error('批量添加到 Firestore 失败:', error);
      }
    }
    addMultipleTasks(newTasks);
    setLocalTasks(prev => [...newTasks, ...prev]);
  };

  const today = new Date().toISOString().split('T')[0];

  const filteredPresetTasks = useMemo(() => {
    const ageConfig = ageGroupConfig[selectedAgeGroup];
    return presetTasks.filter((task) => {
      const inAgeRange = task.ageRange.min <= ageConfig.maxMonths && task.ageRange.max >= ageConfig.minMonths;
      const inCategory = filterCategory === 'all' || task.category === filterCategory;
      const inDifficulty = filterDifficulty === 'all' || task.difficulty === filterDifficulty;
      const notAdded = !tasks.some((t) => t.id === task.id);
      return inAgeRange && inCategory && inDifficulty && notAdded;
    });
  }, [presetTasks, tasks, selectedAgeGroup, filterCategory, filterDifficulty]);

  const filteredMyTasks = useMemo(() => {
    return tasks.filter((task) => {
      const inCategory = filterCategory === 'all' || task.category === filterCategory;
      const inDifficulty = filterDifficulty === 'all' || task.difficulty === filterDifficulty;
      return inCategory && inDifficulty;
    });
  }, [tasks, filterCategory, filterDifficulty]);

  const tasksByCategory = useMemo(() => {
    return filteredMyTasks.reduce((acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = [];
      }
      acc[task.category].push(task);
      return acc;
    }, {} as Record<TaskCategory, Task[]>);
  }, [filteredMyTasks]);

  const completedToday = tasks.filter((task) => task.completedDates.includes(today));
  const totalToday = tasks.length;
  const progress = totalToday > 0 ? Math.round((completedToday.length / totalToday) * 100) : 0;

  const recommendedTasks = useMemo(() => {
    const ageConfig = ageGroupConfig[selectedAgeGroup];
    return presetTasks
      .filter((task) => {
        const inAgeRange = task.ageRange.min <= ageConfig.maxMonths && task.ageRange.max >= ageConfig.minMonths;
        const notAdded = !tasks.some((t) => t.id === task.id);
        return inAgeRange && notAdded;
      })
      .slice(0, 8);
  }, [presetTasks, tasks, selectedAgeGroup]);

  const handleQuickAdd = (task: Task) => {
    addTask({ 
      title: task.title,
      description: task.description,
      category: task.category,
      difficulty: task.difficulty,
      ageRange: task.ageRange,
      duration: task.duration,
      knowledgeIds: task.knowledgeIds,
      frequency: task.frequency,
      completedDates: [],
      isCustom: task.isCustom,
    });
  };

  const handleAddAllRecommended = async () => {
    const toAddPromises = recommendedTasks.map((task) => 
      addTask({ 
        title: task.title,
        description: task.description,
        category: task.category,
        difficulty: task.difficulty,
        ageRange: task.ageRange,
        duration: task.duration,
        knowledgeIds: task.knowledgeIds,
        frequency: task.frequency,
        completedDates: [],
        isCustom: task.isCustom,
      })
    );
    await Promise.all(toAddPromises);
  };

  const renderDifficultyStars = (difficulty: DifficultyLevel) => {
    const config = difficultyConfig[difficulty];
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${star <= config.stars ? 'fill-current' : ''}`}
            style={{ color: star <= config.stars ? config.color : '#E5E5E5' }}
          />
        ))}
      </div>
    );
  };

  const renderTaskCard = (task: Task, showDelete = true) => {
    const isCompleted = task.completedDates.includes(today);
    const catConfig = categoryConfig[task.category];
    const diffConfig = difficultyConfig[task.difficulty];

    return (
      <div
        key={task.id}
        className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
          isCompleted
            ? 'bg-[#AAB794]/10 border-[#AAB794]/30'
            : 'bg-white border-transparent hover:border-[#D4836C]/20'
        }`}
      >
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => toggleTaskComplete(task.id, today)}
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0 ${
              isCompleted
                ? 'bg-[#AAB794] border-[#AAB794] text-white'
                : 'border-[#5D4559]/20 hover:border-[#D4836C]'
            }`}
          >
            {isCompleted && <CheckCircle className="w-5 h-5" />}
          </button>
          <div className="flex-1 min-w-0">
            <p className={`font-medium ${isCompleted ? 'text-[#5D4559]/50 line-through' : 'text-[#5D4559]'}`}>
              {task.title}
            </p>
            {task.description && (
              <p className="text-xs text-[#5D4559]/50 mt-1 truncate">{task.description}</p>
            )}
            <div className="flex items-center gap-3 mt-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${catConfig.color}30`, color: '#5D4559' }}
              >
                {catConfig.icon} {catConfig.label}
              </span>
              {renderDifficultyStars(task.difficulty)}
              <span className="text-xs text-[#5D4559]/40 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {task.duration}分钟
              </span>
            </div>
          </div>
        </div>
        {showDelete && (
          <button
            onClick={() => deleteTask(task.id)}
            className="p-2 text-[#5D4559]/30 hover:text-red-400 hover:bg-red-50 rounded-xl transition-all flex-shrink-0 ml-2"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  const categories = Object.entries(categoryConfig) as [TaskCategory, typeof categoryConfig[TaskCategory]][];
  const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard'];

  return (
    <div className="min-h-screen pb-28">
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full dots-bg opacity-60" />
        <div className="relative z-10 px-6 pt-10 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#F7DBA7]/40 rounded-2xl p-2">
              <Calendar className="w-7 h-7 text-[#5D4559]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#5D4559]">任务打卡</h1>
              <p className="text-[#5D4559]/60 text-sm">好习惯，慢慢来</p>
            </div>
          </div>

          <div className="flex gap-2">
            {(['3', '4', '5', '6'] as const).map((age) => (
              <button
                key={age}
                onClick={() => setSelectedAgeGroup(age)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedAgeGroup === age
                    ? 'bg-[#D4836C] text-white shadow-lg'
                    : 'bg-white/80 text-[#5D4559] hover:bg-white'
                }`}
              >
                {ageGroupConfig[age].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 space-y-4">
        <div className="organic-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#D4836C]" />
              <span className="font-semibold text-[#5D4559]">今日进度</span>
            </div>
            <span className="text-2xl font-bold text-[#D4836C]">{progress}%</span>
          </div>
          <div className="w-full bg-[#F2D5D0]/40 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%`, background: 'linear-gradient(135deg, #D4836C, #C17059)' }}
            />
          </div>
          <p className="text-center text-sm text-[#5D4559]/60 mt-2">
            已完成 {completedToday.length} / {totalToday} 个任务
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
          <button
            onClick={() => setActiveTab('my')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'my'
                ? 'bg-[#5D4559] text-white'
                : 'bg-white text-[#5D4559]/70'
            }`}
          >
            我的任务
          </button>
          <button
            onClick={() => setActiveTab('recommend')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
              activeTab === 'recommend'
                ? 'bg-[#5D4559] text-white'
                : 'bg-white text-[#5D4559]/70'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            智能推荐
          </button>
        </div>

        <div className="flex gap-2 items-center overflow-x-auto pb-2">
          <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1.5">
            <Filter className="w-4 h-4 text-[#5D4559]/50" />
            <span className="text-xs text-[#5D4559]/50">分类:</span>
          </div>
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filterCategory === 'all'
                ? 'bg-[#D4836C] text-white'
                : 'bg-white text-[#5D4559]/70'
            }`}
          >
            全部
          </button>
          {categories.map(([key, config]) => (
            <button
              key={key}
              onClick={() => setFilterCategory(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                filterCategory === key
                  ? 'text-white'
                  : 'bg-white text-[#5D4559]/70'
              }`}
              style={filterCategory === key ? { backgroundColor: config.color.replace('#', '') === 'D4836C' ? '#D4836C' : config.color } : {}}
            >
              {config.icon} {config.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 items-center overflow-x-auto pb-2">
          <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1.5">
            <Star className="w-4 h-4 text-[#5D4559]/50" />
            <span className="text-xs text-[#5D4559]/50">难度:</span>
          </div>
          <button
            onClick={() => setFilterDifficulty('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filterDifficulty === 'all'
                ? 'bg-[#D4836C] text-white'
                : 'bg-white text-[#5D4559]/70'
            }`}
          >
            全部
          </button>
          {difficulties.map((diff) => {
            const config = difficultyConfig[diff];
            return (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  filterDifficulty === diff
                    ? 'text-white'
                    : 'bg-white text-[#5D4559]/70'
                }`}
                style={filterDifficulty === diff ? { backgroundColor: config.color } : {}}
              >
                {Array(config.stars).fill('⭐').join('')} {config.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'recommend' && (
          <div className="space-y-4">
            <div className="organic-card p-5 bg-gradient-to-r from-[#F7DBA7]/30 to-[#E8C5D5]/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D4836C]" />
                  <span className="font-semibold text-[#5D4559]">
                    {ageGroupConfig[selectedAgeGroup].label}推荐任务
                  </span>
                </div>
                <span className="text-xs text-[#5D4559]/60">
                  共 {recommendedTasks.length} 个
                </span>
              </div>
              <p className="text-sm text-[#5D4559]/70 mb-4">
                根据 {ageGroupConfig[selectedAgeGroup].label} 儿童发展特点精选的任务
              </p>
              {recommendedTasks.length > 0 && (
                <button
                  onClick={handleAddAllRecommended}
                  className="w-full bg-gradient-to-r from-[#D4836C] to-[#C17059] text-white py-3 rounded-2xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  一键添加全部推荐任务
                </button>
              )}
            </div>

            {recommendedTasks.length === 0 ? (
              <div className="organic-card p-8 text-center">
                <div className="text-5xl mb-3">🎉</div>
                <p className="text-[#5D4559] font-medium">已添加所有推荐任务！</p>
                <p className="text-[#5D4559]/50 text-sm mt-1">可以在"我的任务"中查看和管理</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recommendedTasks.map((task) => (
                  <div key={task.id} className="organic-card p-4">
                    {renderTaskCard(task, false)}
                    <button
                      onClick={() => handleQuickAdd(task)}
                      className="w-full mt-3 py-2 rounded-xl bg-[#AAB794]/10 text-[#AAB794] text-sm font-medium hover:bg-[#AAB794]/20 transition-all flex items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      添加任务
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'my' && (
          <div className="space-y-4">
            {filteredMyTasks.length === 0 && tasks.length === 0 ? (
              <div className="organic-card p-12 text-center">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold text-[#5D4559] mb-2">还没有任务</h3>
                <p className="text-[#5D4559]/60 mb-4">去"智能推荐"看看适合{ageGroupConfig[selectedAgeGroup].label}的任务吧！</p>
                <button
                  onClick={() => setActiveTab('recommend')}
                  className="px-6 py-3 bg-[#D4836C] text-white rounded-full font-medium hover:bg-[#C17059] transition-all flex items-center gap-2 mx-auto"
                >
                  <Sparkles className="w-4 h-4" />
                  查看推荐任务
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : filteredMyTasks.length === 0 ? (
              <div className="organic-card p-8 text-center">
                <div className="text-5xl mb-3">🔍</div>
                <p className="text-[#5D4559]">没有符合筛选条件的任务</p>
                <button
                  onClick={() => {
                    setFilterCategory('all');
                    setFilterDifficulty('all');
                  }}
                  className="mt-3 text-sm text-[#D4836C] underline"
                >
                  清除筛选
                </button>
              </div>
            ) : (
              <>
                {Object.entries(tasksByCategory).map(([catKey, catTasks]) => {
                  const [key, config] = categories.find(([k]) => k === catKey) || [catKey, categoryConfig[catKey as TaskCategory]];
                  return (
                    <div key={catKey} className="organic-card p-5">
                      <h3 className="font-bold text-[#5D4559] mb-4 flex items-center gap-2">
                        <span
                          className="p-2 rounded-xl text-lg"
                          style={{ backgroundColor: `${config.color}30` }}
                        >
                          {config.icon}
                        </span>
                        {config.label}
                        <span className="text-xs text-[#5D4559]/40 ml-auto">
                          {catTasks.filter((t) => t.completedDates.includes(today)).length}/{catTasks.length}
                        </span>
                      </h3>
                      <div className="space-y-3">
                        {catTasks.map((task) => renderTaskCard(task))}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-20 left-0 right-0 px-6 z-40">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full bg-gradient-to-r from-[#D4836C] to-[#C17059] text-white p-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-xl transition-all flex items-center justify-center gap-3"
        >
          <div className="bg-white/20 rounded-full p-2">
            <Plus className="w-6 h-6" />
          </div>
          添加自定义任务
        </button>
      </div>

      <AddTaskModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
