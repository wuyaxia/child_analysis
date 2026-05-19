import { useState } from 'react';
import { Baby, Flower2, Sun, ChevronDown, ChevronUp, FileText, Target, Award, Star, BookOpen, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import type { KnowledgeArticle } from '../types';

export default function Home() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [currentKnowledgeIndex, setCurrentKnowledgeIndex] = useState(0);
  const { 
    analysisReports, 
    selectedReportId, 
    setSelectedReportId,
    tasks,
    reviews,
    knowledgeArticles
  } = useAppStore();
  
  const navigate = useNavigate();
  
  // 获取当前选中的报告
  const currentReport = analysisReports.find(r => r.id === selectedReportId);
  
  // 计算今日打卡进度
  const today = new Date().toISOString().split('T')[0];
  const completedToday = tasks.filter(task => task.completedDates.includes(today));
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedToday.length / totalTasks) * 100) : 0;
  
  // 计算连续打卡天数
  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const hasCompletedTask = tasks.some(task => task.completedDates.includes(dateStr));
      if (hasCompletedTask) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  };
  
  const streak = calculateStreak();
  
  // 获取成就徽章
  const getBadge = () => {
    if (streak >= 100) return { emoji: '💎', name: '钻石徽章', color: 'text-purple-500' };
    if (streak >= 30) return { emoji: '🥇', name: '金牌徽章', color: 'text-yellow-500' };
    if (streak >= 7) return { emoji: '🥈', name: '银牌徽章', color: 'text-gray-400' };
    if (streak >= 3) return { emoji: '🏅', name: '铜牌徽章', color: 'text-orange-500' };
    return null;
  };
  
  const badge = getBadge();
  
  // 获取本周获得星星数
  const getWeeklyStars = () => {
    let stars = 0;
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayCompleted = tasks.filter(task => task.completedDates.includes(dateStr));
      stars += dayCompleted.length;
    }
    return stars;
  };
  
  const weeklyStars = getWeeklyStars();
  
  // 知识轮播
  const filteredKnowledge = knowledgeArticles.filter(a => a.ageGroup === '3').slice(0, 5);
  const currentKnowledge: KnowledgeArticle = filteredKnowledge[currentKnowledgeIndex] || filteredKnowledge[0];
  
  const nextKnowledge = () => {
    setCurrentKnowledgeIndex((prev) => (prev + 1) % filteredKnowledge.length);
  };
  
  const prevKnowledge = () => {
    setCurrentKnowledgeIndex((prev) => (prev - 1 + filteredKnowledge.length) % filteredKnowledge.length);
  };
  
  // 最近复盘记录
  const recentReviews = [...reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

  return (
    <div className="min-h-screen pb-28">
      {/* 顶部hero区域 */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full dots-bg opacity-60" />
        
        <div className="relative z-10 px-6 pt-10 pb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="bg-[#F2D5D0] rounded-2xl p-2 animate-float">
              <Flower2 className="w-6 h-6 text-[#D4836C]" />
            </div>
            <h1 className="text-3xl font-bold text-[#5D4559]">
              儿童成长中心
            </h1>
            <div className="bg-[#AAB794]/20 rounded-2xl p-2">
              <Sun className="w-6 h-6 text-[#AAB794]" />
            </div>
          </div>
          
          <p className="text-center text-[#5D4559]/70 text-lg mt-2">
            用心记录，陪伴成长 💛
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="px-6 pb-6">
          <div className="organic-card p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-[#D4836C] mb-1">3</div>
                <p className="text-xs text-[#5D4559]/60">岁</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#AAB794] mb-1">高敏感</div>
                <p className="text-xs text-[#5D4559]/60">气质</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#5D4559] mb-1">慢热</div>
                <p className="text-xs text-[#5D4559]/60">性格</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 今日打卡进度 */}
      <div className="px-6 space-y-4">
        <div className="organic-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#D4836C]" />
              <span className="font-semibold text-[#5D4559]">今日打卡</span>
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
            已完成 {completedToday.length} / {totalTasks} 个任务
          </p>
          <button
            onClick={() => navigate('/tasks')}
            className="w-full mt-4 py-3 bg-[#D4836C]/10 text-[#D4836C] rounded-xl hover:bg-[#D4836C]/20 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            去打卡
          </button>
        </div>

        {/* 打卡激励 */}
        <div className="organic-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-[#F7DBA7]" />
            <span className="font-semibold text-[#5D4559]">本周成就</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-[#F7DBA7]/30 to-[#F2D5D0]/30 rounded-2xl p-4 text-center">
              <div className="text-3xl mb-1">🔥</div>
              <div className="text-xl font-bold text-[#5D4559]">{streak} 天</div>
              <p className="text-xs text-[#5D4559]/60">连续打卡</p>
            </div>
            <div className="bg-gradient-to-br from-[#AAB794]/30 to-[#C9D99E]/30 rounded-2xl p-4 text-center">
              <div className="text-3xl mb-1">⭐</div>
              <div className="text-xl font-bold text-[#5D4559]">{weeklyStars}</div>
              <p className="text-xs text-[#5D4559]/60">本周获得星星</p>
            </div>
          </div>
          {badge && (
            <div className="mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-3">
              <span className="text-2xl">{badge.emoji}</span>
              <span className={`font-medium ${badge.color}`}>{badge.name}</span>
              <span className="text-xs text-[#5D4559]/50">· 连续{streak}天打卡</span>
            </div>
          )}
        </div>

        {/* 知识轮播 */}
        <div className="organic-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-[#AAB794]" />
            <span className="font-semibold text-[#5D4559]">今日知识</span>
          </div>
          
          {filteredKnowledge.length > 0 && currentKnowledge && (
            <div className="relative">
              <button
                onClick={prevKnowledge}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all z-10"
              >
                <ChevronLeft className="w-5 h-5 text-[#5D4559]" />
              </button>
              
              <div className="ml-6 mr-6">
                <div className="bg-gradient-to-br from-[#AAB794]/10 to-[#C9D99E]/10 rounded-2xl p-4">
                  <p className="text-xs text-[#AAB794] mb-2">{currentKnowledge.source || '育儿知识'}</p>
                  <h4 className="font-bold text-[#5D4559] mb-2">{currentKnowledge.title}</h4>
                  <p className="text-sm text-[#5D4559]/70 line-clamp-3">{currentKnowledge.content}</p>
                </div>
              </div>
              
              <button
                onClick={nextKnowledge}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all z-10"
              >
                <ChevronRight className="w-5 h-5 text-[#5D4559]" />
              </button>
              
              <div className="flex justify-center gap-1 mt-4">
                {filteredKnowledge.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentKnowledgeIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentKnowledgeIndex ? 'bg-[#AAB794] w-6' : 'bg-[#5D4559]/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 最近复盘记录 */}
        {recentReviews.length > 0 && (
          <div className="organic-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#D4836C]" />
                <span className="font-semibold text-[#5D4559]">最近复盘</span>
              </div>
              <button onClick={() => navigate('/review')} className="text-sm text-[#D4836C] hover:text-[#C17059]">
                查看全部 →
              </button>
            </div>
            <div className="space-y-3">
              {recentReviews.map((review) => (
                <div key={review.id} className="bg-[#FDF8F3] rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-[#5D4559]">{review.title}</h5>
                    <span className="text-xs text-[#5D4559]/50">{new Date(review.date).toLocaleDateString('zh-CN')}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-[#D4836C]/10 text-[#D4836C] px-2 py-1 rounded-full">
                      {review.problems.length} 问题
                    </span>
                    <span className="text-xs bg-[#AAB794]/10 text-[#AAB794] px-2 py-1 rounded-full">
                      {review.improvements.length} 改进
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 历史成长分析报告模块 */}
        <div className="organic-card p-5">
          <h2 className="text-xl font-bold text-[#5D4559] mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#D4836C]" />
            历史成长分析报告
          </h2>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {analysisReports.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReportId(report.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedReportId === report.id
                    ? 'bg-[#D4836C] text-white'
                    : 'bg-white text-[#5D4559]/70'
                }`}
              >
                {report.age}
              </button>
            ))}
          </div>
        </div>

        {/* 当前报告内容 */}
        {currentReport && (
          <>
            <div className="organic-card p-5">
              <h3 className="text-xl font-bold text-[#5D4559] mb-4 flex items-center gap-2">
                <Baby className="w-6 h-6 text-[#D4836C]" />
                {currentReport.title}
              </h3>
              <p className="text-[#5D4559]/80 text-sm leading-relaxed mb-4">
                这是{currentReport.age}的成长分析报告，记录了当时的发展特点和养育建议。
              </p>
            </div>

            {/* 可折叠的详细内容 */}
            <div className="space-y-3">
              {currentReport.sections.map((section) => (
                <div key={section.id} className="organic-card overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                    className="w-full text-left"
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{section.emoji}</span>
                          <h4 className="text-lg font-bold text-[#5D4559]">{section.title}</h4>
                        </div>
                        {expandedSection === section.id ? (
                          <ChevronUp className="w-5 h-5 text-[#5D4559]/50" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[#5D4559]/50" />
                        )}
                      </div>
                    </div>
                  </button>

                  {expandedSection === section.id && (
                    <div className={`px-5 pb-5 border-t ${section.borderColor} border-2`}>
                      <div className="pt-4">
                        <div className={`${section.color} rounded-2xl p-4`}>
                          <pre className="text-[#5D4559]/85 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                            {section.content}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* 快捷操作 */}
        <div className="py-6">
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => navigate('/growth')} className="organic-card p-5 text-left">
              <div className="bg-gradient-to-br from-[#D4836C]/10 to-[#D4836C]/20 rounded-2xl p-3 mb-3 inline-block">
                <Flower2 className="w-8 h-8 text-[#D4836C]" />
              </div>
              <h3 className="font-bold text-[#5D4559] mb-1">添加记录</h3>
              <p className="text-xs text-[#5D4559]/60">记录成长点滴</p>
            </button>
            
            <button onClick={() => navigate('/review')} className="organic-card p-5 text-left">
              <div className="bg-gradient-to-br from-[#AAB794]/10 to-[#AAB794]/20 rounded-2xl p-3 mb-3 inline-block">
                <Star className="w-8 h-8 text-[#AAB794]" />
              </div>
              <h3 className="font-bold text-[#5D4559] mb-1">阶段复盘</h3>
              <p className="text-xs text-[#5D4559]/60">定期总结复盘</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
