import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ChildProfile, GrowthRecord, Task, KnowledgeArticle, EmotionRecord, Milestone, Review, GrowthMeasurement } from '../types';

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

interface AppState {
  // 孩子资料
  childProfile: ChildProfile | null;
  setChildProfile: (profile: ChildProfile) => void;

  // 成长记录
  growthRecords: GrowthRecord[];
  addGrowthRecord: (record: GrowthRecord) => void;
  updateGrowthRecord: (id: string, record: Partial<GrowthRecord>) => void;
  deleteGrowthRecord: (id: string) => void;

  // 任务
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (taskId: string, date: string) => void;

  // 知识库
  knowledgeArticles: KnowledgeArticle[];
  toggleFavorite: (id: string) => void;
  updateReadProgress: (id: string, progress: number) => void;

  // 情绪记录
  emotionRecords: EmotionRecord[];
  addEmotionRecord: (record: EmotionRecord) => void;

  // 里程碑
  milestones: Milestone[];
  addMilestone: (milestone: Milestone) => void;

  // 阶段复盘
  reviews: Review[];
  addReview: (review: Review) => void;
  updateReview: (id: string, review: Partial<Review>) => void;
  deleteReview: (id: string) => void;

  // 生长测量
  growthMeasurements: GrowthMeasurement[];
  addGrowthMeasurement: (measurement: GrowthMeasurement) => void;
  deleteGrowthMeasurement: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 孩子资料
      childProfile: null,
      setChildProfile: (profile) => set({ childProfile: profile }),

      // 成长记录
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

      // 任务
      tasks: [],
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

      // 知识库
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

      // 情绪记录
      emotionRecords: [],
      addEmotionRecord: (record) =>
        set((state) => ({ emotionRecords: [...state.emotionRecords, record] })),

      // 里程碑
      milestones: [],
      addMilestone: (milestone) =>
        set((state) => ({ milestones: [...state.milestones, milestone] })),

      // 阶段复盘
      reviews: [],
      addReview: (review) => set((state) => ({ reviews: [...state.reviews, review] })),
      updateReview: (id, review) =>
        set((state) => ({
          reviews: state.reviews.map((r) => (r.id === id ? { ...r, ...review } : r)),
        })),
      deleteReview: (id) =>
        set((state) => ({ reviews: state.reviews.filter((r) => r.id !== id) })),

      // 生长测量
      growthMeasurements: [],
      addGrowthMeasurement: (measurement) =>
        set((state) => ({
          growthMeasurements: [...state.growthMeasurements, measurement],
        })),
      deleteGrowthMeasurement: (id) =>
        set((state) => ({
          growthMeasurements: state.growthMeasurements.filter((m) => m.id !== id),
        })),
    }),
    {
      name: 'child-growth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
