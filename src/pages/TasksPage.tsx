import { useState, useMemo, useCallback } from 'react';
import { CheckCircle, Plus, Calendar, Trash2, Sparkles, Target, Filter, Star, Clock, ChevronRight, Rocket, Smile } from 'lucide-react';
import AddTaskModal from '../components/features/tasks/AddTaskModal';
import { useAppStore, categoryConfig, difficultyConfig, ageGroupConfig } from '../store/useAppStore';
import type { TaskCategory, DifficultyLevel, Task } from '../types';

type TabType = 'my' | 'recommend';

export default function TasksPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('my');
  const [filterCategory, setFilterCategory] = useState<TaskCategory | 'all'>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<'3' | '4' | '5' | '6'>('3');
  const [celebrating, setCelebrating] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [isAddingAll, setIsAddingAll] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const tasks = useAppStore((state) => state.tasks);
  const presetTasks = useAppStore((state) => state.presetTasks);
  const addTask = useAppStore((state) => state.addTask);
  const toggleTaskComplete = useAppStore((state) => state.toggleTaskComplete);
  const deleteTaskFromStore = useAppStore((state) => state.deleteTask);

  const today = new Date().toISOString().split('T')[0];

  const showCelebration = useCallback(() => {
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 2000);
  }, []);

  const handleToggleComplete = useCallback((taskId: string, date: string, wasCompleted: boolean) => {
    toggleTaskComplete(taskId, date);
    if (!wasCompleted) {
      showCelebration();
    }
  }, [toggleTaskComplete, showCelebration]);

  const filteredPresetTasks = useMemo(() => {
    const ageConfig = ageGroupConfig[selectedAgeGroup];
    return presetTasks.filter((task) => {
      const inAgeRange = task.ageRange.min <= ageConfig.maxMonths && task.ageRange.max >= ageConfig.minMonths;
      const inCategory = filterCategory === 'all' || task.category === filterCategory;
      const inDifficulty = filterDifficulty === 'all' || task.difficulty === filterDifficulty;
      const notAdded = !tasks.some((t) => t.sourcePresetId === task.id || t.id === task.id);
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
        const notAdded = !tasks.some((t) => t.sourcePresetId === task.id || t.id === task.id);
        return inAgeRange && notAdded;
      })
      .slice(0, 8);
  }, [presetTasks, tasks, selectedAgeGroup]);

  const handleQuickAdd = async (task: Task) => {
    await addTask({
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      completedDates: [],
      sourcePresetId: task.sourcePresetId || task.id,
    });
  };

  const handleAddAllRecommended = async () => {
    setIsAddingAll(true);
    setAddSuccess(false);
    
    try {
      for (const task of recommendedTasks) {
        await addTask({
          ...task,
          id: `task-${Date.now()}-${Math.random()}`,
          createdAt: new Date().toISOString(),
          completedDates: [],
          sourcePresetId: task.sourcePresetId || task.id,
        });
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 3000);
    } catch (error) {
      console.error('添加任务失败:', error);
    } finally {
      setIsAddingAll(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('确定要删除这个任务吗？删除后无法恢复！')) {
      return;
    }
    deleteTaskFromStore(taskId);
  };

  const renderDifficultyStars = (difficulty: DifficultyLevel) => {
    const config = difficultyConfig[difficulty];
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${star <= config.stars ? 'fill-current' : ''}`}
            style={{ color: star <= config.stars ? config.color : '#E5E5E5' }}
          />
        ))}
      </div>
    );
  };

  const renderTaskCard = (task: Task, showDelete = true) => {
    const isCompleted = task.completedDates.includes(today);
    const catConfig = categoryConfig[task.category];
    const isExpanded = expandedTaskId === task.id;

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    const sortedDates = [...task.completedDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const recentDates = sortedDates.slice(0, 7);

    return (
      <div
        key={task.id}
        className={`rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
          isCompleted
            ? 'bg-gradient-to-br from-[#AAB794]/20 to-[#AAB794]/5 border-[#AAB794]/40'
            : 'bg-white border-transparent hover:border-[#D4836C]/30'
        } ${isExpanded ? 'shadow-xl' : 'hover:shadow-lg'}`}
      >
        <div className="p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleToggleComplete(task.id, today, isCompleted)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 flex-shrink-0 ${
                isCompleted
                  ? 'bg-gradient-to-br from-[#AAB794] to-[#8B9E7A] border-[#AAB794] text-white shadow-lg shadow-[#AAB794]/30'
                  : 'bg-gradient-to-br from-white to-gray-50 border-[#5D4559]/20 hover:border-[#D4836C] hover:from-[#D4836C]/10'
              }`}
            >
              {isCompleted && <CheckCircle className="w-8 h-8" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-lg ${isCompleted ? 'text-[#5D4559]/50 line-through' : 'text-[#5D4559]'}`}>
                {task.title}
              </p>
              {task.description && (
                <p className="text-sm text-[#5D4559]/50 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <span
                  className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{ backgroundColor: `${catConfig.color}25`, color: catConfig.color }}
                >
                  {catConfig.icon} {catConfig.label}
                </span>
                {renderDifficultyStars(task.difficulty)}
                <span className="text-xs text-[#5D4559]/40 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {task.duration}分钟
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              {showDelete && (
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-2.5 text-[#5D4559]/30 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              )}
              <button
                onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${
                  isExpanded 
                    ? 'bg-[#D4836C]/20 text-[#D4836C]' 
                    : 'text-[#5D4559]/30 hover:text-[#5D4559]/60 hover:bg-gray-100'
                }`}
              >
                <ChevronRight 
                  className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} 
                />
              </button>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="px-4 pb-4 pt-0">
            <div className="bg-gradient-to-r from-[#5D4559]/5 to-transparent rounded-2xl p-4 mt-2">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#D4836C]" />
                <span className="text-sm font-bold text-[#5D4559]">任务详情</span>
              </div>
              <p className="text-sm text-[#5D4559]/70 leading-relaxed mb-4">
                {task.description || '暂无描述'}
              </p>
              
              {task.completedDates.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-[#AAB794]" />
                    <span className="text-sm font-bold text-[#5D4559]">完成记录</span>
                    <span className="text-xs text-[#5D4559]/40 ml-auto">
                      共 {task.completedDates.length} 天
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentDates.map((date) => (
                      <span
                        key={date}
                        className="px-3 py-1.5 bg-[#AAB794]/15 text-[#AAB794] text-xs rounded-full font-medium"
                      >
                        ✓ {formatDate(date)}
                      </span>
                    ))}
                    {sortedDates.length > 7 && (
                      <span className="px-3 py-1.5 bg-gray-100 text-[#5D4559]/40 text-xs rounded-full font-medium">
                        +{sortedDates.length - 7} 天
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {task.completedDates.length === 0 && (
                <div className="text-center py-4">
                  <div className="text-3xl mb-2">📝</div>
                  <p className="text-sm text-[#5D4559]/50">还没有完成记录，开始打卡吧！</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const categories = Object.entries(categoryConfig) as [TaskCategory, typeof categoryConfig[TaskCategory]];
  const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard'];

  return (
    <div className="min-h-screen pb-32 relative overflow-hidden">
      {/* Celebration Animation */}
      {celebrating && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="text-8xl animate-bounce">
            {['🎉', '🌟', '✨', '👏', '💪'][Math.floor(Math.random() * 5)]}
          </div>
        </div>
      )}

      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-[#D4836C]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-40 -left-20 w-56 h-56 bg-gradient-to-tr from-[#F7DBA7]/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-gradient-to-tl from-[#AAB794]/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="bg-gradient-to-br from-[#F7DBA7] to-[#F2D5D0] rounded-3xl p-4 shadow-lg shadow-[#F7DBA7]/30">
              <Calendar className="w-8 h-8 text-[#5D4559]" />
            </div>
            <div className="absolute -top-1 -right-1 text-lg animate-pulse">
              <Sparkles className="w-5 h-5 text-[#D4836C]" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-[#5D4559] tracking-tight">
              任务打卡
            </h1>
            <p className="text-[#5D4559]/60 text-sm mt-1 font-medium">
              好习惯，慢慢来 🌱
            </p>
          </div>
        </div>

        {/* Age Group Selector */}
        <div className="flex gap-2 overflow-x-auto pb-3">
          {(['3', '4', '5', '6'] as const).map((age) => (
            <button
              key={age}
              onClick={() => setSelectedAgeGroup(age)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                selectedAgeGroup === age
                  ? 'bg-gradient-to-r from-[#D4836C] to-[#C17059] text-white shadow-xl shadow-[#D4836C]/30 transform scale-105'
                  : 'bg-white/90 backdrop-blur text-[#5D4559] hover:bg-white hover:shadow-md'
              }`}
            >
              {ageGroupConfig[age].label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 space-y-5 relative z-10">
        {/* Progress Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 border-2 border-white/50 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7DBA7]/10 via-transparent to-[#AAB794]/10" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-[#D4836C]/20 to-[#F7DBA7]/20 rounded-2xl p-2.5">
                  <Target className="w-6 h-6 text-[#D4836C]" />
                </div>
                <span className="font-bold text-[#5D4559] text-lg">
                  今日进度
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold bg-gradient-to-r from-[#D4836C] to-[#C17059] bg-clip-text text-transparent">
                  {progress}%
                </span>
                <span className="text-[#5D4559]/40 text-sm font-medium">完成</span>
              </div>
            </div>
            
            <div className="w-full h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${progress}%`, 
                  background: 'linear-gradient(90deg, #D4836C, #C17059, #AAB794)',
                  boxShadow: '0 0 20px rgba(212, 131, 108, 0.4)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="flex items-center gap-2 bg-[#AAB794]/15 px-3 py-1.5 rounded-xl">
                <CheckCircle className="w-4 h-4 text-[#AAB794]" />
                <span className="text-sm font-bold text-[#AAB794]">
                  {completedToday.length}
                </span>
              </div>
              <span className="text-[#5D4559]/30">/</span>
              <span className="text-sm font-bold text-[#5D4559]/60">
                {totalToday} 个任务
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { id: 'my', label: '我的任务' },
            { id: 'recommend', icon: Sparkles, label: '智能推荐' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 py-3 px-4 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#5D4559] to-[#7A6476] text-white shadow-xl shadow-[#5D4559]/20'
                  : 'bg-white/90 backdrop-blur text-[#5D4559]/70 hover:bg-white'
              }`}
            >
              {tab.icon && <tab.icon className="w-4.5 h-4.5" />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        {(filterCategory !== 'all' || filterDifficulty !== 'all') && (
          <button
            onClick={() => {
              setFilterCategory('all');
              setFilterDifficulty('all');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#5D4559]/10 to-[#5D4559]/5 text-[#5D4559] rounded-2xl text-sm font-medium hover:from-[#5D4559]/20 transition-all duration-300"
          >
            <Filter className="w-4 h-4" />
            清除筛选
          </button>
        )}

        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur rounded-2xl px-3.5 py-2 shadow-sm">
            <Filter className="w-4 h-4 text-[#5D4559]/50" />
            <span className="text-xs font-bold text-[#5D4559]/50">分类</span>
          </div>
          {categories.map(([key, config]) => (
            <button
              key={key}
              onClick={() => setFilterCategory(filterCategory === key ? 'all' : key)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 ${
                filterCategory === key
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-white/80 backdrop-blur text-[#5D4559]/70 hover:bg-white'
              }`}
              style={filterCategory === key ? { backgroundColor: config.color } : {}}
            >
              {config.icon} {config.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur rounded-2xl px-3.5 py-2 shadow-sm">
            <Star className="w-4 h-4 text-[#5D4559]/50" />
            <span className="text-xs font-bold text-[#5D4559]/50">难度</span>
          </div>
          {difficulties.map((diff) => {
            const config = difficultyConfig[diff];
            return (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(filterDifficulty === diff ? 'all' : diff)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 ${
                  filterDifficulty === diff
                    ? 'text-white shadow-lg scale-105'
                    : 'bg-white/80 backdrop-blur text-[#5D4559]/70 hover:bg-white'
                }`}
                style={filterDifficulty === diff ? { backgroundColor: config.color } : {}}
              >
                {Array(config.stars).fill('⭐').join('')} {config.label}
              </button>
            );
          })}
        </div>

        {/* Recommended Tab */}
        {activeTab === 'recommend' && (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F7DBA7]/20 via-white to-[#E8C5D5]/20 border-2 border-white/50 shadow-xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#D4836C]/10 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="bg-gradient-to-br from-[#D4836C]/20 to-[#F7DBA7]/30 rounded-2xl p-3">
                        <Sparkles className="w-6 h-6 text-[#D4836C]" />
                      </div>
                      <div className="absolute -top-1 -right-1 text-sm animate-spin-slow">
                        ✨
                      </div>
                    </div>
                    <div>
                      <span className="font-bold text-[#5D4559] text-lg block">
                        {ageGroupConfig[selectedAgeGroup].label}推荐任务
                      </span>
                      <span className="text-xs text-[#5D4559]/50 font-medium">
                        为孩子精选的成长任务
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-white/70 backdrop-blur rounded-2xl px-3 py-1.5">
                    <span className="text-xs font-bold text-[#D4836C]">
                      {recommendedTasks.length}
                    </span>
                    <span className="text-xs text-[#5D4559]/40">个</span>
                  </div>
                </div>
                <p className="text-[#5D4559]/70 mb-4 leading-relaxed">
                  根据 {ageGroupConfig[selectedAgeGroup].label} 儿童发展特点精选的任务，每完成一个任务都是成长的一小步！ 🚀
                </p>
                {recommendedTasks.length > 0 && (
                  <button
                    onClick={handleAddAllRecommended}
                    disabled={isAddingAll}
                    className={`w-full py-4 rounded-2xl font-bold text-base shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5 ${
                      addSuccess
                        ? 'bg-gradient-to-r from-[#AAB794] to-[#8B9E7A] text-white shadow-[#AAB794]/30'
                        : isAddingAll
                        ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#D4836C] to-[#C17059] text-white shadow-[#D4836C]/30 hover:shadow-2xl'
                    }`}
                  >
                    {addSuccess ? (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        添加成功！
                      </>
                    ) : isAddingAll ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        正在添加...
                      </>
                    ) : (
                      <>
                        <div className="bg-white/20 rounded-xl p-2">
                          <Plus className="w-5 h-5" />
                        </div>
                        一键添加全部推荐任务
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {recommendedTasks.length === 0 ? (
              <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur border-2 border-white/50 shadow-xl p-10 text-center">
                <div className="text-7xl mb-4 animate-bounce">
                  🎉
                </div>
                <h3 className="text-2xl font-extrabold text-[#5D4559] mb-2">
                  太棒了！
                </h3>
                <p className="text-[#5D4559]/60 leading-relaxed">
                  已添加所有推荐任务！去"我的任务"中继续坚持吧！
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendedTasks.map((task) => (
                  <div key={task.id} className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur border-2 border-white/50 shadow-lg">
                    <div className="p-5">
                      {renderTaskCard(task, false)}
                      <button
                        onClick={() => handleQuickAdd(task)}
                        className="w-full mt-4 py-3.5 rounded-2xl bg-gradient-to-r from-[#AAB794]/15 to-[#AAB794]/8 text-[#AAB794] text-sm font-bold hover:from-[#AAB794]/25 transition-all duration-300 flex items-center justify-center gap-2 group"
                      >
                        <div className="bg-[#AAB794]/20 rounded-xl p-1.5 group-hover:bg-[#AAB794]/30 transition-all">
                          <Plus className="w-4.5 h-4.5" />
                        </div>
                        添加任务
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Tasks Tab */}
        {activeTab === 'my' && (
          <div className="space-y-5">
            {filteredMyTasks.length === 0 && tasks.length === 0 ? (
              <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur border-2 border-white/50 shadow-xl p-12 text-center">
                <div className="text-7xl mb-5 animate-bounce">
                  🌱
                </div>
                <h3 className="text-2xl font-extrabold text-[#5D4559] mb-3">
                  还没有任务
                </h3>
                <p className="text-[#5D4559]/60 mb-7 leading-relaxed">
                  去"智能推荐"看看适合
                  <span className="font-bold text-[#D4836C]">
                    {ageGroupConfig[selectedAgeGroup].label}
                  </span>
                  的任务吧！
                </p>
                <button
                  onClick={() => setActiveTab('recommend')}
                  className="px-8 py-4 bg-gradient-to-r from-[#D4836C] to-[#C17059] text-white rounded-2xl font-bold shadow-xl shadow-[#D4836C]/30 hover:shadow-2xl transition-all flex items-center gap-3 mx-auto group"
                >
                  <Sparkles className="w-6 h-6" />
                  查看推荐任务
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            ) : filteredMyTasks.length === 0 ? (
              <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur border-2 border-white/50 shadow-xl p-10 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-[#5D4559] mb-2">
                  没有符合筛选条件的任务
                </h3>
                <button
                  onClick={() => {
                    setFilterCategory('all');
                    setFilterDifficulty('all');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-[#D4836C]/10 to-[#F7DBA7]/10 text-[#D4836C] rounded-2xl font-bold text-sm hover:from-[#D4836C]/20 transition-all"
                >
                  清除筛选
                </button>
              </div>
            ) : (
              <>
                {Object.entries(tasksByCategory).map(([catKey, catTasks]) => {
                  const [key, config] = categories.find(([k]) => k === catKey) || [catKey, categoryConfig[catKey as TaskCategory]];
                  const completedInCategory = catTasks.filter((t) => t.completedDates.includes(today)).length;
                  const categoryProgress = Math.round((completedInCategory / catTasks.length) * 100);
                  
                  return (
                    <div key={catKey} className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur border-2 border-white/50 shadow-xl">
                      <div 
                        className="absolute top-0 left-0 w-full h-1"
                        style={{ backgroundColor: `${config.color}40` }}
                      />
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-3">
                            <div 
                              className="rounded-2xl p-2.5"
                              style={{ backgroundColor: `${config.color}20` }}
                            >
                              <span className="text-2xl">{config.icon}</span>
                            </div>
                            <div>
                              <h3 className="font-extrabold text-[#5D4559] text-lg">
                                {config.label}
                              </h3>
                              <div className="flex items-center gap-2 mt-0.5">
                                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ 
                                      width: `${categoryProgress}%`,
                                      backgroundColor: config.color
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-[#5D4559]/50 font-medium">
                                  {categoryProgress}%
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 bg-gray-100 rounded-2xl px-3 py-1.5">
                            <span className="text-sm font-bold" style={{ color: config.color }}>
                              {completedInCategory}
                            </span>
                            <span className="text-xs text-[#5D4559]/40">/</span>
                            <span className="text-sm font-bold text-[#5D4559]/60">
                              {catTasks.length}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3.5">
                          {catTasks.map((task) => renderTaskCard(task))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-24 left-0 right-0 px-6 z-40 pointer-events-none">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full bg-gradient-to-r from-[#D4836C] via-[#E8C5D5] to-[#C17059] text-white p-5 rounded-full font-extrabold text-xl shadow-2xl shadow-[#D4836C]/40 hover:shadow-[#D4836C]/60 transition-all duration-300 flex items-center justify-center gap-3 pointer-events-auto group"
        >
          <div className="bg-white/20 rounded-2xl p-2.5 group-hover:bg-white/30 transition-all group-hover:scale-110">
            <Plus className="w-7 h-7" />
          </div>
          添加自定义任务
          <Rocket className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
        </button>
      </div>

      <AddTaskModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
