import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ChildProfile, GrowthRecord, Task, KnowledgeArticle, EmotionRecord, Milestone, Review, GrowthMeasurement, TaskCategory, DifficultyLevel } from '../types';

const presetTasks: Task[] = [
  // ===== 规律作息 ROUTINE =====
  // 3岁
  { id: 'pr-3e-1', title: '早睡早起', description: '晚上9点前睡觉，早上7点起床', category: 'routine', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pr-3e-2', title: '按时午休', description: '中午12:30-14:30午休', category: 'routine', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 120, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pr-3m-1', title: '睡前仪式', description: '洗澡→换睡衣→刷牙→讲故事→关灯', category: 'routine', difficulty: 'medium', ageRange: { min: 36, max: 47 }, duration: 30, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pr-3m-2', title: '定时排便', description: '培养固定时间排便习惯', category: 'routine', difficulty: 'medium', ageRange: { min: 36, max: 47 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  // 4岁
  { id: 'pr-4e-1', title: '独立入睡', description: '完成睡前仪式后自己入睡', category: 'routine', difficulty: 'easy', ageRange: { min: 48, max: 59 }, duration: 20, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pr-4m-1', title: '时间感知', description: '认识整点和半点', category: 'routine', difficulty: 'medium', ageRange: { min: 48, max: 59 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pr-4h-1', title: '作息记录', description: '用图表记录每日作息', category: 'routine', difficulty: 'hard', ageRange: { min: 48, max: 59 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  // 5岁
  { id: 'pr-5e-1', title: '早间准备', description: '起床后自己穿衣、洗漱', category: 'routine', difficulty: 'easy', ageRange: { min: 60, max: 71 }, duration: 20, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pr-5m-1', title: '按时作业', description: '放学后先完成小任务再玩', category: 'routine', difficulty: 'medium', ageRange: { min: 60, max: 71 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pr-5h-1', title: '日程管理', description: '自己安排周末活动', category: 'routine', difficulty: 'hard', ageRange: { min: 60, max: 71 }, duration: 30, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  // 6岁
  { id: 'pr-6e-1', title: '书包整理', description: '每晚整理好第二天书包', category: 'routine', difficulty: 'easy', ageRange: { min: 72, max: 84 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pr-6m-1', title: '作业计划', description: '制定放学后作业计划', category: 'routine', difficulty: 'medium', ageRange: { min: 72, max: 84 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pr-6h-1', title: '时间管理', description: '使用番茄钟管理时间', category: 'routine', difficulty: 'hard', ageRange: { min: 72, max: 84 }, duration: 30, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },

  // ===== 运动锻炼 EXERCISE =====
  // 3岁
  { id: 'pe-3e-1', title: '户外跑跳', description: '每天户外活动30分钟', category: 'exercise', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 30, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pe-3e-2', title: '平衡练习', description: '走直线、原地转圈', category: 'exercise', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pe-3m-1', title: '拍球入门', description: '学习双手拍球', category: 'exercise', difficulty: 'medium', ageRange: { min: 36, max: 47 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pe-3m-2', title: '跳格子', description: '双脚跳、单脚跳交替', category: 'exercise', difficulty: 'medium', ageRange: { min: 36, max: 47 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  // 4岁
  { id: 'pe-4e-1', title: '骑平衡车', description: '户外平衡车骑行', category: 'exercise', difficulty: 'easy', ageRange: { min: 48, max: 59 }, duration: 30, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pe-4m-1', title: '单脚站立', description: '单脚站立保持10秒', category: 'exercise', difficulty: 'medium', ageRange: { min: 48, max: 59 }, duration: 5, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pe-4m-2', title: '投掷练习', description: '投掷沙包或小球', category: 'exercise', difficulty: 'medium', ageRange: { min: 48, max: 59 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pe-4h-1', title: '球类游戏', description: '与同伴进行传球游戏', category: 'exercise', difficulty: 'hard', ageRange: { min: 48, max: 59 }, duration: 20, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  // 5岁
  { id: 'pe-5e-1', title: '跳绳入门', description: '学习连续跳绳', category: 'exercise', difficulty: 'easy', ageRange: { min: 60, max: 71 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pe-5m-1', title: '舞蹈练习', description: '跟着音乐跳舞', category: 'exercise', difficulty: 'medium', ageRange: { min: 60, max: 71 }, duration: 20, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pe-5h-1', title: '体能挑战', description: '完成障碍跑挑战', category: 'exercise', difficulty: 'hard', ageRange: { min: 60, max: 71 }, duration: 30, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  // 6岁
  { id: 'pe-6e-1', title: '晨间体操', description: '做儿童广播体操', category: 'exercise', difficulty: 'easy', ageRange: { min: 72, max: 84 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pe-6m-1', title: '球类运动', description: '足球或篮球基本动作', category: 'exercise', difficulty: 'medium', ageRange: { min: 72, max: 84 }, duration: 30, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pe-6h-1', title: '游泳基础', description: '学习游泳基本动作', category: 'exercise', difficulty: 'hard', ageRange: { min: 72, max: 84 }, duration: 45, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },

  // ===== 认知学习 COGNITIVE =====
  // 3岁
  { id: 'pc-3e-1', title: '认识颜色', description: '指认生活中的各种颜色', category: 'cognitive', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pc-3e-2', title: '认识形状', description: '分辨圆形、方形、三角形', category: 'cognitive', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pc-3m-1', title: '数数1-10', description: '正确数出1-10', category: 'cognitive', difficulty: 'medium', ageRange: { min: 36, max: 47 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pc-3m-2', title: '认识汉字', description: '学习5个常用汉字', category: 'cognitive', difficulty: 'medium', ageRange: { min: 36, max: 47 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pc-3h-1', title: '拼音入门', description: '学习6个单韵母', category: 'cognitive', difficulty: 'hard', ageRange: { min: 36, max: 47 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  // 4岁
  { id: 'pc-4e-1', title: '数数1-20', description: '正确数出1-20', category: 'cognitive', difficulty: 'easy', ageRange: { min: 48, max: 59 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pc-4e-2', title: '比较大小', description: '比较大、小、更大', category: 'cognitive', difficulty: 'easy', ageRange: { min: 48, max: 59 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pc-4m-1', title: '认识数字', description: '数字与数量对应', category: 'cognitive', difficulty: 'medium', ageRange: { min: 48, max: 59 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pc-4m-2', title: '简单加减', description: '5以内加减法', category: 'cognitive', difficulty: 'medium', ageRange: { min: 48, max: 59 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pc-4h-1', title: '阅读绘本', description: '独立阅读简单绘本', category: 'cognitive', difficulty: 'hard', ageRange: { min: 48, max: 59 }, duration: 20, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  // 5岁
  { id: 'pc-5e-1', title: '10以内加减', description: '熟练10以内加减法', category: 'cognitive', difficulty: 'easy', ageRange: { min: 60, max: 71 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pc-5e-2', title: '拼音读写', description: '拼读简单音节', category: 'cognitive', difficulty: 'easy', ageRange: { min: 60, max: 71 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pc-5m-1', title: '20以内加减', description: '20以内加减法', category: 'cognitive', difficulty: 'medium', ageRange: { min: 60, max: 71 }, duration: 20, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pc-5m-2', title: '写字练习', description: '练习书写汉字', category: 'cognitive', difficulty: 'medium', ageRange: { min: 60, max: 71 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pc-5h-1', title: '自主阅读', description: '阅读简单章节书', category: 'cognitive', difficulty: 'hard', ageRange: { min: 60, max: 71 }, duration: 30, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  // 6岁
  { id: 'pc-6e-1', title: '100以内数数', description: '正数和倒数100以内', category: 'cognitive', difficulty: 'easy', ageRange: { min: 72, max: 84 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pc-6m-1', title: '100以内加减', description: '100以内加减法', category: 'cognitive', difficulty: 'medium', ageRange: { min: 72, max: 84 }, duration: 20, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pc-6m-2', title: '拼音拼写', description: '看拼音写汉字', category: 'cognitive', difficulty: 'medium', ageRange: { min: 72, max: 84 }, duration: 20, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pc-6h-1', title: '看图说话', description: '看图编写小故事', category: 'cognitive', difficulty: 'hard', ageRange: { min: 72, max: 84 }, duration: 30, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },

  // ===== 社交情感 SOCIAL =====
  // 3岁
  { id: 'ps-3e-1', title: '主动问好', description: '见到熟人主动打招呼', category: 'social', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 5, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'ps-3e-2', title: '说谢谢', description: '收到帮助时说谢谢', category: 'social', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 5, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'ps-3m-1', title: '学会等待', description: '轮流玩耍时学会等待', category: 'social', difficulty: 'medium', ageRange: { min: 36, max: 47 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'ps-3m-2', title: '表达情绪', description: '用语言表达高兴、生气', category: 'social', difficulty: 'medium', ageRange: { min: 36, max: 47 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  // 4岁
  { id: 'ps-4e-1', title: '分享玩具', description: '主动与同伴分享玩具', category: 'social', difficulty: 'easy', ageRange: { min: 48, max: 59 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'ps-4e-2', title: '礼貌用语', description: '使用请、谢谢、对不起', category: 'social', difficulty: 'easy', ageRange: { min: 48, max: 59 }, duration: 5, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'ps-4m-1', title: '结交新朋友', description: '主动认识新伙伴', category: 'social', difficulty: 'medium', ageRange: { min: 48, max: 59 }, duration: 20, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'ps-4m-2', title: '团队游戏', description: '参与合作性游戏', category: 'social', difficulty: 'medium', ageRange: { min: 48, max: 59 }, duration: 20, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'ps-4h-1', title: '解决冲突', description: '学习用语言解决争执', category: 'social', difficulty: 'hard', ageRange: { min: 48, max: 59 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  // 5岁
  { id: 'ps-5e-1', title: '照顾他人', description: '关心帮助年龄小的孩子', category: 'social', difficulty: 'easy', ageRange: { min: 60, max: 71 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'ps-5m-1', title: '组织游戏', description: '主导组织小伙伴游戏', category: 'social', difficulty: 'medium', ageRange: { min: 60, max: 71 }, duration: 30, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'ps-5h-1', title: '同理心培养', description: '理解他人情绪和感受', category: 'social', difficulty: 'hard', ageRange: { min: 60, max: 71 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  // 6岁
  { id: 'ps-6e-1', title: '学校交往', description: '与同学友好相处', category: 'social', difficulty: 'easy', ageRange: { min: 72, max: 84 }, duration: 30, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'ps-6m-1', title: '情绪管理', description: '识别和控制负面情绪', category: 'social', difficulty: 'medium', ageRange: { min: 72, max: 84 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'ps-6h-1', title: '人际沟通', description: '清晰表达想法和需求', category: 'social', difficulty: 'hard', ageRange: { min: 72, max: 84 }, duration: 20, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },

  // ===== 生活自理 SELFCARE =====
  // 3岁
  { id: 'psc-3e-1', title: '自己吃饭', description: '独立使用餐具吃饭', category: 'selfcare', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 20, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psc-3e-2', title: '洗手', description: '饭前便后正确洗手', category: 'selfcare', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 3, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psc-3m-1', title: '穿脱衣物', description: '自己穿脱简单衣物', category: 'selfcare', difficulty: 'medium', ageRange: { min: 36, max: 47 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psc-3m-2', title: '收拾玩具', description: '玩完玩具放回原位', category: 'selfcare', difficulty: 'medium', ageRange: { min: 36, max: 47 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  // 4岁
  { id: 'psc-4e-1', title: '自己刷牙', description: '独立刷牙2分钟', category: 'selfcare', difficulty: 'easy', ageRange: { min: 48, max: 59 }, duration: 3, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psc-4e-2', title: '穿鞋袜子', description: '自己穿鞋和袜子', category: 'selfcare', difficulty: 'easy', ageRange: { min: 48, max: 59 }, duration: 5, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psc-4m-1', title: '整理衣物', description: '把脏衣服放进洗衣篮', category: 'selfcare', difficulty: 'medium', ageRange: { min: 48, max: 59 }, duration: 5, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psc-4m-2', title: '擦鼻涕', description: '正确使用纸巾擦鼻涕', category: 'selfcare', difficulty: 'medium', ageRange: { min: 48, max: 59 }, duration: 2, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psc-4h-1', title: '帮忙家务', description: '参与简单家务劳动', category: 'selfcare', difficulty: 'hard', ageRange: { min: 48, max: 59 }, duration: 15, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  // 5岁
  { id: 'psc-5e-1', title: '独立如厕', description: '自己如厕并整理衣物', category: 'selfcare', difficulty: 'easy', ageRange: { min: 60, max: 71 }, duration: 5, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psc-5e-2', title: '系扣子拉拉链', description: '学会系扣子和拉拉链', category: 'selfcare', difficulty: 'easy', ageRange: { min: 60, max: 71 }, duration: 5, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psc-5m-1', title: '简单烹饪', description: '参与制作简单食物', category: 'selfcare', difficulty: 'medium', ageRange: { min: 60, max: 71 }, duration: 20, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psc-5m-2', title: '铺床叠被', description: '整理自己的小床', category: 'selfcare', difficulty: 'medium', ageRange: { min: 60, max: 71 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psc-5h-1', title: '独立洗澡', description: '自己完成洗澡', category: 'selfcare', difficulty: 'hard', ageRange: { min: 60, max: 71 }, duration: 15, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  // 6岁
  { id: 'psc-6e-1', title: '整理书包', description: '自己整理第二天书包', category: 'selfcare', difficulty: 'easy', ageRange: { min: 72, max: 84 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psc-6e-2', title: '系鞋带', description: '学会系鞋带', category: 'selfcare', difficulty: 'easy', ageRange: { min: 72, max: 84 }, duration: 5, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psc-6m-1', title: '管理零花钱', description: '记录和保管零花钱', category: 'selfcare', difficulty: 'medium', ageRange: { min: 72, max: 84 }, duration: 10, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psc-6h-1', title: '独立出行', description: '在小区内独立行动', category: 'selfcare', difficulty: 'hard', ageRange: { min: 72, max: 84 }, duration: 30, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },

  // ===== 艺术创意 ARTISTIC =====
  // 3岁
  { id: 'pa-3e-1', title: '自由涂鸦', description: '用蜡笔或水彩涂鸦', category: 'artistic', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 20, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pa-3e-2', title: '撕纸粘贴', description: '撕纸并粘贴成图案', category: 'artistic', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 15, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pa-3m-1', title: '简笔画', description: '画简单的事物', category: 'artistic', difficulty: 'medium', ageRange: { min: 36, max: 47 }, duration: 20, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pa-3m-2', title: '黏土塑形', description: '用橡皮泥捏形状', category: 'artistic', difficulty: 'medium', ageRange: { min: 36, max: 47 }, duration: 20, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  // 4岁
  { id: 'pa-4e-1', title: '手指画', description: '用手指创作画作', category: 'artistic', difficulty: 'easy', ageRange: { min: 48, max: 59 }, duration: 20, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pa-4e-2', title: '折纸入门', description: '学习简单折纸', category: 'artistic', difficulty: 'easy', ageRange: { min: 48, max: 59 }, duration: 15, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pa-4m-1', title: '拼贴画', description: '用各种材料创作拼贴', category: 'artistic', difficulty: 'medium', ageRange: { min: 48, max: 59 }, duration: 30, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pa-4m-2', title: '唱歌表演', description: '学唱儿歌并表演', category: 'artistic', difficulty: 'medium', ageRange: { min: 48, max: 59 }, duration: 15, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pa-4h-1', title: '手工制作', description: '完成复杂手工作品', category: 'artistic', difficulty: 'hard', ageRange: { min: 48, max: 59 }, duration: 30, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  // 5岁
  { id: 'pa-5e-1', title: '水彩画', description: '学习水彩画技法', category: 'artistic', difficulty: 'easy', ageRange: { min: 60, max: 71 }, duration: 20, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pa-5e-2', title: '节奏练习', description: '跟随音乐打节拍', category: 'artistic', difficulty: 'easy', ageRange: { min: 60, max: 71 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pa-5m-1', title: '乐器启蒙', description: '学习简单乐器', category: 'artistic', difficulty: 'medium', ageRange: { min: 60, max: 71 }, duration: 20, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pa-5m-2', title: '角色扮演', description: '进行想象游戏', category: 'artistic', difficulty: 'medium', ageRange: { min: 60, max: 71 }, duration: 30, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pa-5h-1', title: '舞台表演', description: '参加戏剧表演', category: 'artistic', difficulty: 'hard', ageRange: { min: 60, max: 71 }, duration: 45, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  // 6岁
  { id: 'pa-6e-1', title: '线描画', description: '用线条作画', category: 'artistic', difficulty: 'easy', ageRange: { min: 72, max: 84 }, duration: 20, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pa-6m-1', title: '简单乐器', description: '学习尤克里里等简单乐器', category: 'artistic', difficulty: 'medium', ageRange: { min: 72, max: 84 }, duration: 20, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pa-6m-2', title: '舞蹈编排', description: '编排简单舞蹈动作', category: 'artistic', difficulty: 'medium', ageRange: { min: 72, max: 84 }, duration: 30, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'pa-6h-1', title: '才艺展示', description: '准备并展示才艺', category: 'artistic', difficulty: 'hard', ageRange: { min: 72, max: 84 }, duration: 60, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },

  // ===== 安全意识 SAFETY =====
  // 3岁
  { id: 'psf-3e-1', title: '不跟陌生人走', description: '记住不接受陌生人东西', category: 'safety', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 5, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psf-3e-2', title: '不摸危险品', description: '不碰电源和热水', category: 'safety', difficulty: 'easy', ageRange: { min: 36, max: 47 }, duration: 5, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psf-3m-1', title: '记住家庭信息', description: '记住爸爸妈妈名字电话', category: 'safety', difficulty: 'medium', ageRange: { min: 36, max: 47 }, duration: 10, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psf-3m-2', title: '安全游戏', description: '知道哪些地方不能去', category: 'safety', difficulty: 'medium', ageRange: { min: 36, max: 47 }, duration: 10, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  // 4岁
  { id: 'psf-4e-1', title: '交通安全', description: '认识红绿灯', category: 'safety', difficulty: 'easy', ageRange: { min: 48, max: 59 }, duration: 10, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psf-4e-2', title: '不爬高', description: '不在高处玩耍', category: 'safety', difficulty: 'easy', ageRange: { min: 48, max: 59 }, duration: 5, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psf-4m-1', title: '应急呼叫', description: '记住110、120、119', category: 'safety', difficulty: 'medium', ageRange: { min: 48, max: 59 }, duration: 10, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psf-4m-2', title: '过马路安全', description: '知道如何安全过马路', category: 'safety', difficulty: 'medium', ageRange: { min: 48, max: 59 }, duration: 10, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psf-4h-1', title: '自我保护', description: '知道身体隐私部位', category: 'safety', difficulty: 'hard', ageRange: { min: 48, max: 59 }, duration: 15, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  // 5岁
  { id: 'psf-5e-1', title: '独自在家安全', description: '知道独自在家注意事项', category: 'safety', difficulty: 'easy', ageRange: { min: 60, max: 71 }, duration: 10, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psf-5e-2', title: '用电安全', description: '不触碰电器和插座', category: 'safety', difficulty: 'easy', ageRange: { min: 60, max: 71 }, duration: 5, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psf-5m-1', title: '防溺水', description: '知道远离危险水域', category: 'safety', difficulty: 'medium', ageRange: { min: 60, max: 71 }, duration: 10, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psf-5m-2', title: '网络安全', description: '不单独接触网络', category: 'safety', difficulty: 'medium', ageRange: { min: 60, max: 71 }, duration: 10, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psf-5h-1', title: '校园安全', description: '了解校园安全规则', category: 'safety', difficulty: 'hard', ageRange: { min: 60, max: 71 }, duration: 15, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  // 6岁
  { id: 'psf-6e-1', title: '上学安全', description: '知道上学放学安全事项', category: 'safety', difficulty: 'easy', ageRange: { min: 72, max: 84 }, duration: 10, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psf-6e-2', title: '运动安全', description: '运动时注意安全', category: 'safety', difficulty: 'easy', ageRange: { min: 72, max: 84 }, duration: 5, frequency: 'daily', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psf-6m-1', title: '急救基础', description: '知道简单的自救方法', category: 'safety', difficulty: 'medium', ageRange: { min: 72, max: 84 }, duration: 15, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psf-6m-2', title: '环境安全', description: '识别社区安全隐患', category: 'safety', difficulty: 'medium', ageRange: { min: 72, max: 84 }, duration: 15, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
  { id: 'psf-6h-1', title: '综合安全演练', description: '完成安全撤离演练', category: 'safety', difficulty: 'hard', ageRange: { min: 72, max: 84 }, duration: 30, frequency: 'weekly', completedDates: [], isCustom: false, createdAt: new Date().toISOString() },
];

const defaultKnowledgeArticles: KnowledgeArticle[] = [
  // --- 中国卫健委系列 ---
  {
    id: 'cn-1',
    title: '3岁儿童膳食指南（中国卫健委）',
    content: '3岁儿童每天应摄入谷薯类100-150克，新鲜蔬菜200-250克，水果150-200克，肉禽鱼50-75克，鸡蛋1个，奶类350-500克，大豆及制品适量。保持食物多样性，每天不少于12种，每周不少于25种。',
    ageGroup: '3',
    category: ['饮食营养'],
    tags: ['中国卫健委', '膳食指南', '营养'],
    source: '中国卫健委',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cn-2',
    title: '儿童生长发育监测要点（中国卫健委）',
    content: '建议3岁以下儿童每3个月测量一次身高体重，3-6岁儿童每6个月测量一次。测量时应使用标准计量设备，保证测量的准确性。将测量结果记录在生长曲线图上，观察生长趋势。',
    ageGroup: '3',
    category: ['生长发育'],
    tags: ['中国卫健委', '生长监测', '身高体重'],
    source: '中国卫健委',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cn-3',
    title: '3-6岁儿童学习与发展指南概述',
    content: '根据中国卫健委发布的《3-6岁儿童学习与发展指南》，儿童发展分为健康、语言、社会、科学、艺术五个领域。应尊重幼儿发展的个体差异，支持和引导其从原有水平向更高水平发展。',
    ageGroup: '3',
    category: ['综合发展'],
    tags: ['中国卫健委', '发展指南', '早期教育'],
    source: '中国卫健委',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cn-4',
    title: '儿童视力保健要点（中国卫健委）',
    content: '3岁儿童每天应保证不少于2小时的户外活动。控制电子产品使用，单次不超过15分钟，每天累计不超过1小时。保持正确的读写姿势，每用眼20分钟应远眺20秒。',
    ageGroup: '3',
    category: ['安全健康'],
    tags: ['中国卫健委', '视力', '眼睛保护'],
    source: '中国卫健委',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cn-5',
    title: '预防儿童龋齿关键措施',
    content: '从牙齿萌出开始就应帮助孩子刷牙，3岁以下使用含氟牙膏米粒大小，3-6岁使用豌豆大小。每半年带孩子进行一次口腔检查。减少含糖食物和饮料的摄入频率。',
    ageGroup: '3',
    category: ['安全健康'],
    tags: ['中国卫健委', '龋齿', '口腔健康'],
    source: '中国卫健委',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },

  // --- 美国儿科学会(AAP)系列 ---
  {
    id: 'us-1',
    title: '3岁儿童睡眠建议（美国儿科学会）',
    content: '根据美国儿科学会建议，3-5岁儿童每天需要10-13小时睡眠，包括午睡。保持规律的睡前程序，睡前避免使用电子设备。创造安静、黑暗、凉爽的睡眠环境。',
    ageGroup: '3',
    category: ['规律作息'],
    tags: ['美国儿科学会', '睡眠', '作息'],
    source: '美国儿科学会',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'us-2',
    title: '儿童屏幕时间指南（AAP）',
    content: '美国儿科学会建议：18个月以下儿童除视频通话外避免使用屏幕；18-24个月可在家长陪伴下选择高质量节目；2-5岁儿童每天屏幕时间不超过1小时。',
    ageGroup: '3',
    category: ['习惯培养'],
    tags: ['美国儿科学会', '屏幕时间', '电子产品'],
    source: '美国儿科学会',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'us-3',
    title: '正面管教原则（AAP推荐）',
    content: '美国儿科学会推荐使用正面管教：设定明确一致的规则，使用积极的强化和鼓励，避免体罚和羞辱。当孩子行为不当时，先理解情绪背后的原因，再引导正确的行为。',
    ageGroup: '3',
    category: ['亲子沟通'],
    tags: ['美国儿科学会', '管教', '正面教育'],
    source: '美国儿科学会',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },

  // --- 原有内容补充 ---
  {
    id: '1',
    title: '如何应对孩子发脾气',
    content: '当孩子发脾气时，首先要保持冷静，不要训斥或打骂孩子。可以试着用温和的语言询问原因，帮助孩子识别和表达自己的情绪。等孩子冷静下来后，再和孩子一起讨论解决问题的方法。',
    ageGroup: '3',
    category: ['情绪管理'],
    tags: ['情绪', '发脾气'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: '3岁孩子的语言发展',
    content: '3岁是孩子语言发展的关键时期。此时孩子应该能说出3-5个字的短句，能听懂简单的指令。可以多和孩子说话，讲故事，唱儿歌，帮助孩子提升语言能力。',
    ageGroup: '3',
    category: ['认知学习'],
    tags: ['语言', '发展'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: '如何培养孩子的专注力',
    content: '可以通过简单的游戏和活动来培养孩子的专注力，如拼图、搭积木、画画等。每次活动的时间不宜过长，15-20分钟为宜。要选择孩子感兴趣的内容，当孩子专注时不要轻易打断。',
    ageGroup: '3',
    category: ['认知学习'],
    tags: ['专注力', '游戏'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: '培养孩子良好的睡眠习惯',
    content: '建立固定的睡前程序，如洗澡、讲故事、听轻音乐等，帮助孩子做好睡前准备。保持规律的睡眠时间，创造安静舒适的睡眠环境。睡前避免让孩子玩电子产品。',
    ageGroup: '3',
    category: ['规律作息'],
    tags: ['睡眠', '作息'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: '鼓励孩子社交互动',
    content: '多带孩子和其他小朋友一起玩，教孩子学会分享、轮流等待等社交技能。可以通过角色扮演游戏来帮助孩子理解社交规则。当孩子表现出良好的社交行为时，及时给予鼓励和表扬。',
    ageGroup: '3',
    category: ['社交能力'],
    tags: ['社交', '互动'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: '培养孩子的规则意识',
    content: '3岁孩子开始理解规则，但需要成人耐心地重复和引导。可以建立一些简单的家庭规则，如饭前洗手、玩具归位等。用简单的语言解释规则，和孩子一起执行，并给予及时的反馈。',
    ageGroup: '3',
    category: ['习惯培养'],
    tags: ['规则', '习惯'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    title: '3岁孩子的运动发展',
    content: '3岁孩子已经具备基本的大运动能力，如跑、跳、平衡等。可以鼓励孩子进行平衡车、拍球、跳跃等活动，增强身体协调性和力量。活动时注意安全，提供适宜的场地和装备。',
    ageGroup: '3',
    category: ['运动发展'],
    tags: ['运动', '大运动'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    title: '引导孩子学会自己吃饭',
    content: '3岁是培养独立进食的好时机。可以给孩子准备合适的餐具，让孩子自己练习用勺子或筷子。不要担心弄脏，鼓励孩子的每一点进步。提供多样化的食物，让孩子自己选择想吃的东西。',
    ageGroup: '3',
    category: ['生活自理'],
    tags: ['吃饭', '自理'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },

  // 4岁文章
  {
    id: '9',
    title: '4岁孩子的情绪特点',
    content: '4岁孩子的情绪更加丰富和复杂，开始有更细腻的情感表达。他们可能会有嫉妒感、好胜心，容易因为小事而情绪化。家长需要理解孩子的情绪变化，给予适当的引导和支持。',
    ageGroup: '4',
    category: ['情绪管理'],
    tags: ['情绪', '特点'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '10',
    title: '如何培养孩子的想象力',
    content: '4岁孩子的想象力迅速发展。可以通过讲故事、角色扮演、绘画等方式激发孩子的想象力。给孩子提供一些开放性的材料，如积木、彩纸、黏土等，让他们自由探索和创作。',
    ageGroup: '4',
    category: ['认知学习', '艺术启蒙'],
    tags: ['想象力', '创造力'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '11',
    title: '引导孩子学会分享',
    content: '4岁孩子的自我意识仍然较强，分享需要循序渐进。可以先从轮流玩开始，让孩子体验分享的快乐。用故事和实例告诉孩子分享的好处，当孩子主动分享时及时表扬。',
    ageGroup: '4',
    category: ['社交能力'],
    tags: ['分享', '交往'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '12',
    title: '培养孩子的安全意识',
    content: '4岁孩子活动范围扩大，需要加强安全教育。告诉孩子什么是危险的，如何保护自己。用具体的场景进行教育，如不碰电源、不跟陌生人走、记住家庭住址和电话等。',
    ageGroup: '4',
    category: ['安全健康'],
    tags: ['安全', '保护'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '13',
    title: '4岁孩子的阅读启蒙',
    content: '4岁是培养阅读兴趣的好时机。每天安排固定的亲子阅读时间，选择画面丰富、情节简单的绘本。可以和孩子一起读，一起讨论书中的内容，培养孩子的阅读习惯。',
    ageGroup: '4',
    category: ['认知学习'],
    tags: ['阅读', '绘本'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },

  // 5岁文章
  {
    id: '14',
    title: '5岁孩子的规则意识培养',
    content: '5岁孩子已经能理解更复杂的规则，可以引导他们参与制定规则。和孩子一起讨论家庭规则和游戏规则，让他们明白规则的重要性。当孩子违反规则时，用理性的方式引导，而不是简单指责。',
    ageGroup: '5',
    category: ['习惯培养'],
    tags: ['规则', '责任'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '15',
    title: '如何培养孩子的独立性',
    content: '5岁孩子可以做更多的事情了，如自己穿脱衣服、整理玩具、收拾书包等。给孩子提供独立完成任务的机会，不要急于帮忙，让他们在尝试中学会解决问题。',
    ageGroup: '5',
    category: ['生活自理'],
    tags: ['独立', '自理'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '16',
    title: '培养孩子的责任感',
    content: '可以给5岁孩子安排一些简单的家务活，如擦桌子、喂宠物、收碗筷等。让他们体会到自己是家庭的一员，有责任参与家庭事务。完成任务后及时肯定孩子的付出。',
    ageGroup: '5',
    category: ['习惯培养'],
    tags: ['责任', '家务'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '17',
    title: '5岁孩子的数学启蒙',
    content: '5岁是数学启蒙的好时期。可以在日常生活中教孩子数数、比较大小、认识形状和颜色。用游戏的方式学习数学，如分糖果、搭积木、数楼梯等，让孩子在玩中学。',
    ageGroup: '5',
    category: ['认知学习'],
    tags: ['数学', '启蒙'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '18',
    title: '引导孩子应对挫折',
    content: '5岁孩子开始面对更多挑战，如学习新技能、和朋友相处等。当孩子遇到挫折时，不要急于帮助解决，鼓励他们自己尝试。告诉孩子失败是正常的，重要的是要努力和坚持。',
    ageGroup: '5',
    category: ['情绪管理'],
    tags: ['挫折', '抗挫力'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },

  // 6岁文章
  {
    id: '19',
    title: '为孩子做好入学准备',
    content: '6岁孩子即将进入小学，需要做好各方面准备。培养孩子的自理能力，如整理书包、自己上厕所。培养孩子的时间观念，知道什么时候该做什么。和孩子一起讨论小学的生活，让他们对新环境有心理准备。',
    ageGroup: '6',
    category: ['学前准备'],
    tags: ['入学', '准备'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '20',
    title: '培养孩子的学习习惯',
    content: '6岁孩子需要开始培养良好的学习习惯。每天安排固定的学习时间，创造安静的学习环境。教孩子如何整理学习用品，如何专注完成任务。用积极的方式鼓励孩子的学习兴趣。',
    ageGroup: '6',
    category: ['习惯培养', '学前准备'],
    tags: ['学习', '习惯'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '21',
    title: '6岁孩子的社交能力',
    content: '6岁孩子需要更复杂的社交技能，如合作、沟通、解决冲突等。鼓励孩子和不同年龄的朋友交往，教他们如何表达自己的需求和感受，如何理解和关心他人。',
    ageGroup: '6',
    category: ['社交能力'],
    tags: ['社交', '合作'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '22',
    title: '培养孩子的时间观念',
    content: '6岁孩子可以开始理解时间的概念。教孩子认识时钟，理解先后顺序。和孩子一起制定每日时间表，如起床、吃饭、学习、玩耍的时间。让孩子体验遵守时间的好处。',
    ageGroup: '6',
    category: ['习惯培养'],
    tags: ['时间', '作息'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '23',
    title: '如何和6岁孩子有效沟通',
    content: '和6岁孩子沟通时要平等对待，尊重他们的想法和感受。用简单明了的语言表达，认真倾听孩子的话。鼓励孩子提问，一起讨论问题。用孩子能理解的方式解释复杂的事情。',
    ageGroup: '6',
    category: ['亲子沟通'],
    tags: ['沟通', '亲子'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },

  // 通用文章
  {
    id: '24',
    title: '如何表扬和奖励孩子',
    content: '有效的表扬要具体，指出孩子做得好的地方，而不是笼统地说"真棒"。奖励要及时，和孩子的行为相匹配。多用精神奖励，少用物质奖励，让孩子从行为本身获得满足感。',
    ageGroup: '3',
    category: ['亲子沟通'],
    tags: ['表扬', '奖励'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '25',
    title: '培养孩子的良好饮食习惯',
    content: '为孩子提供多样化的食物，让他们有机会尝试不同的口味。让孩子参与食物的准备和选择，增加他们对食物的兴趣。不要强迫孩子吃东西，营造愉快的用餐氛围。',
    ageGroup: '3',
    category: ['安全健康', '饮食营养'],
    tags: ['饮食', '习惯'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '26',
    title: '如何保护孩子的视力',
    content: '控制孩子使用电子产品的时间，每20分钟休息一下。确保孩子有充足的户外活动时间，每天至少2小时。保持正确的读写姿势，书桌和椅子高度要合适。定期检查孩子的视力。',
    ageGroup: '3',
    category: ['安全健康'],
    tags: ['视力', '保护'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '27',
    title: '引导孩子爱上运动',
    content: '选择适合孩子年龄的运动项目，让运动变得有趣。和孩子一起运动，成为他们的榜样。不要强调输赢，鼓励孩子享受运动的过程。定期安排户外活动，让孩子接触多种运动方式。',
    ageGroup: '3',
    category: ['运动发展'],
    tags: ['运动', '兴趣'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '28',
    title: '艺术启蒙对孩子的好处',
    content: '艺术活动可以培养孩子的创造力、想象力和观察力。让孩子自由地画画、涂色、做手工，不要限制他们的表达方式。给孩子提供丰富的艺术材料，鼓励他们大胆尝试。',
    ageGroup: '3',
    category: ['艺术启蒙'],
    tags: ['艺术', '创造力'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '29',
    title: '如何应对孩子的分离焦虑',
    content: '分离焦虑是孩子发展过程中的正常现象。和孩子告别时要简短而亲切，不要偷偷离开。给孩子一个安抚物，如他们喜欢的玩具或毯子。建立固定的离别仪式，让孩子有心理准备。',
    ageGroup: '3',
    category: ['情绪管理'],
    tags: ['分离', '焦虑'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '30',
    title: '培养孩子的好奇心',
    content: '鼓励孩子提问，认真回答他们的问题。如果不知道答案，可以和孩子一起查找。给孩子提供探索的机会，让他们接触新事物。对孩子的发现表示兴趣和赞赏，保护他们的好奇心。',
    ageGroup: '3',
    category: ['认知学习'],
    tags: ['好奇心', '探索'],
    source: '通用',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
];

export const categoryConfig: Record<TaskCategory, { label: string; icon: string; color: string }> = {
  routine: { label: '规律作息', icon: '🕐', color: '#D4836C' },
  exercise: { label: '运动锻炼', icon: '🏃', color: '#F2D5D0' },
  cognitive: { label: '认知学习', icon: '📚', color: '#AAB794' },
  social: { label: '社交情感', icon: '👫', color: '#F7DBA7' },
  selfcare: { label: '生活自理', icon: '🌟', color: '#B8D4E3' },
  artistic: { label: '艺术创意', icon: '🎨', color: '#E8C5D5' },
  safety: { label: '安全意识', icon: '🛡️', color: '#C9D99E' },
};

export const difficultyConfig: Record<DifficultyLevel, { label: string; stars: number; color: string }> = {
  easy: { label: '初级', stars: 1, color: '#AAB794' },
  medium: { label: '中级', stars: 2, color: '#F7DBA7' },
  hard: { label: '高级', stars: 3, color: '#D4836C' },
};

export const ageGroupConfig = {
  '3': { label: '3岁', minMonths: 36, maxMonths: 47 },
  '4': { label: '4岁', minMonths: 48, maxMonths: 59 },
  '5': { label: '5岁', minMonths: 60, maxMonths: 71 },
  '6': { label: '6岁', minMonths: 72, maxMonths: 84 },
};

interface AppState {
  childProfile: ChildProfile | null;
  setChildProfile: (profile: ChildProfile) => void;

  growthRecords: GrowthRecord[];
  addGrowthRecord: (record: GrowthRecord) => void;
  updateGrowthRecord: (id: string, record: Partial<GrowthRecord>) => void;
  deleteGrowthRecord: (id: string) => void;

  tasks: Task[];
  presetTasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (taskId: string, date: string) => void;
  addMultipleTasks: (tasks: Task[]) => void;

  knowledgeArticles: KnowledgeArticle[];
  toggleFavorite: (id: string) => void;
  updateReadProgress: (id: string, progress: number) => void;

  emotionRecords: EmotionRecord[];
  addEmotionRecord: (record: EmotionRecord) => void;

  milestones: Milestone[];
  addMilestone: (milestone: Milestone) => void;

  reviews: Review[];
  addReview: (review: Review) => void;
  updateReview: (id: string, review: Partial<Review>) => void;
  deleteReview: (id: string) => void;

  growthMeasurements: GrowthMeasurement[];
  addGrowthMeasurement: (measurement: GrowthMeasurement) => void;
  deleteGrowthMeasurement: (id: string) => void;

  selectedAgeGroup: '3' | '4' | '5' | '6';
  setSelectedAgeGroup: (age: '3' | '4' | '5' | '6') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      childProfile: null,
      setChildProfile: (profile) => set({ childProfile: profile }),

      growthRecords: [],
      addGrowthRecord: (record) =>
        set((state) => ({ growthRecords: [...state.growthRecords, record] })),
      updateGrowthRecord: (id, record) =>
        set((state) => ({
          growthRecords: state.growthRecords.map((r) =>
            r.id === id ? { ...r, ...record } : r
          ),
        })),
      deleteGrowthRecord: (id) =>
        set((state) => ({
          growthRecords: state.growthRecords.filter((r) => r.id !== id),
        })),

      tasks: [],
      presetTasks,
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, task) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...task } : t)),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      toggleTaskComplete: (taskId, date) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task;
            const completed = task.completedDates.includes(date);
            return {
              ...task,
              completedDates: completed
                ? task.completedDates.filter((d) => d !== date)
                : [...task.completedDates, date],
            };
          }),
        })),
      addMultipleTasks: (newTasks) =>
        set((state) => {
          const existingIds = new Set(state.tasks.map((t) => t.id));
          const uniqueTasks = newTasks.filter((t) => !existingIds.has(t.id));
          return { tasks: [...state.tasks, ...uniqueTasks] };
        }),

      knowledgeArticles: defaultKnowledgeArticles,
      toggleFavorite: (id) =>
        set((state) => ({
          knowledgeArticles: state.knowledgeArticles.map((a) =>
            a.id === id ? { ...a, isFavorite: !a.isFavorite } : a
          ),
        })),
      updateReadProgress: (id, progress) =>
        set((state) => ({
          knowledgeArticles: state.knowledgeArticles.map((a) =>
            a.id === id ? { ...a, readProgress: progress } : a
          ),
        })),

      emotionRecords: [],
      addEmotionRecord: (record) =>
        set((state) => ({ emotionRecords: [...state.emotionRecords, record] })),

      milestones: [],
      addMilestone: (milestone) =>
        set((state) => ({ milestones: [...state.milestones, milestone] })),

      reviews: [],
      addReview: (review) => set((state) => ({ reviews: [...state.reviews, review] })),
      updateReview: (id, review) =>
        set((state) => ({
          reviews: state.reviews.map((r) => (r.id === id ? { ...r, ...review } : r)),
        })),
      deleteReview: (id) =>
        set((state) => ({ reviews: state.reviews.filter((r) => r.id !== id) })),

      growthMeasurements: [],
      addGrowthMeasurement: (measurement) =>
        set((state) => ({
          growthMeasurements: [...state.growthMeasurements, measurement],
        })),
      deleteGrowthMeasurement: (id) =>
        set((state) => ({
          growthMeasurements: state.growthMeasurements.filter((m) => m.id !== id),
        })),

      selectedAgeGroup: '3',
      setSelectedAgeGroup: (age) => set({ selectedAgeGroup: age }),
    }),
    {
      name: 'child-growth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
