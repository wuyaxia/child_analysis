import { useState } from 'react';
import { Baby, Flower2, Sun, ChevronDown, ChevronUp } from 'lucide-react';

export default function Home() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const sections = [
    {
      id: 'conclusion',
      title: '核心结论',
      emoji: '💡',
      color: 'bg-[#F7DBA7]/30',
      borderColor: 'border-l-[#F7DBA7]',
      content: `目前整体属于"正常发展范围内的高敏感 + 慢热型气质"，孩子并不像"有问题"，更像是：

• 气质偏敏感、慢热、安全感需求高
• 情绪调节能力还不成熟
• 在困倦、疲劳、刚睡醒时，自控力会明显下降
• 依恋对象稳定（尤其依赖姥姥）
• 理解能力其实不错，具备讲道理基础
• 对外部世界探索动力不足，但在熟悉环境中能放开`
    },
    {
      id: 'direction',
      title: '未来发展方向',
      emoji: '🌱',
      color: 'bg-[#AAB794]/20',
      borderColor: 'border-l-[#AAB794]',
      content: `如果养育方式合适，会逐渐发展成：
• 情绪细腻、有观察力、共情能力强
• 谨慎但稳定、内驱力不错
• 熟悉后社交能力正常甚至很好

如果长期被"迁就式保护"或"高压纠正"，则容易发展为：
• 依赖性强、抗挫能力弱
• 回避型人格倾向、情绪爆发频繁
• 对陌生环境焦虑、做事怕失败

所以现在3岁是非常关键的"性格塑形窗口"。`
    },
    {
      id: 'problems',
      title: '问题本质分析',
      emoji: '🔍',
      color: 'bg-[#D4836C]/10',
      borderColor: 'border-l-[#D4836C]',
      content: `1️⃣ "必须爸爸拿玩具，否则崩溃"
→ 本质是：幼儿对秩序感 + 控制感的强需求
→ 3岁孩子对"预期"极度敏感，一旦现实和预期不一致，大脑会直接进入情绪系统

2️⃣ 玩具卡住直接大哭
→ 本质是：抗挫能力偏低 + 情绪调节弱
→ 但哭完能讲道理，说明理解力没问题，这是积极信号
→ 重点不是讲更多道理，而是训练"情绪恢复能力"

3️⃣ 出门不愿走路
→ 三层原因：依赖型安全需求、内驱探索欲偏弱、体能和耐力可能偏弱`
    },
    {
      id: 'solution',
      title: '核心解决方案',
      emoji: '✨',
      color: 'bg-[#F2D5D0]/30',
      borderColor: 'border-l-[#F2D5D0]',
      content: `【情绪恢复力】第一优先级
• 情绪先接住，不急着讲道理
• 崩溃时不要立刻满足
• 训练"等待能力"（从10秒、30秒、1分钟开始）

【运动策略】未来3年核心养育策略之一
第一梯队：平衡车/骑行、游泳、儿童体适能
第二梯队：武术（5岁后）、球类（适合以后）

【家庭统一】最重要的问题
• 规则不一致是最大风险
• 情绪可以有，但规则不能总变
• 减少"代劳式养育"
• 增加"小挑战成功"`
    },
    {
      id: 'action',
      title: '立即行动清单',
      emoji: '🎯',
      color: 'bg-[#D4836C]/15',
      borderColor: 'border-l-[#D4836C]',
      content: `现在立刻开始的5件事：

1️⃣ 固定一个长期运动项目
→ 优先：平衡车、游泳、体适能，坚持半年以上

2️⃣ 每天减少一点抱
→ 例如："先自己走到前面那棵树，再抱"，循序渐进

3️⃣ 建立统一养育原则
→ 所有老人统一：不因哭立刻妥协，情绪先接住，再坚持边界

4️⃣ 每天给一点"可控挑战"
→ 自己穿袜子、自己按电梯、自己问店员

5️⃣ 睡眠优先级拉满
→ 规律睡眠可能比讲道理更重要`
    },
  ];

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

      {/* 分析报告内容 */}
      <div className="px-6 space-y-4">
        <div className="organic-card p-5">
          <h2 className="text-xl font-bold text-[#5D4559] mb-4 flex items-center gap-2">
            <Baby className="w-6 h-6 text-[#D4836C]" />
            3岁男孩 · 性格与行为发展分析
          </h2>
          <p className="text-[#5D4559]/80 text-sm leading-relaxed mb-4">
            整体属于"正常发展范围内的高敏感 + 慢热型气质"，现在是非常关键的"性格塑形窗口"。
          </p>
        </div>

        {/* 可折叠的详细内容 */}
        <div className="space-y-3">
          {sections.map((section) => (
            <div key={section.id} className="organic-card overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                className="w-full text-left"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{section.emoji}</span>
                      <h3 className="text-lg font-bold text-[#5D4559]">{section.title}</h3>
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

        {/* 快捷操作 */}
        <div className="py-6">
          <div className="grid grid-cols-2 gap-4">
            <button className="organic-card p-5 text-left">
              <div className="bg-gradient-to-br from-[#D4836C]/10 to-[#D4836C]/20 rounded-2xl p-3 mb-3 inline-block">
                <Flower2 className="w-8 h-8 text-[#D4836C]" />
              </div>
              <h3 className="font-bold text-[#5D4559] mb-1">添加记录</h3>
              <p className="text-xs text-[#5D4559]/60">记录成长点滴</p>
            </button>
            
            <button className="organic-card p-5 text-left">
              <div className="bg-gradient-to-br from-[#AAB794]/10 to-[#AAB794]/20 rounded-2xl p-3 mb-3 inline-block">
                <Sun className="w-8 h-8 text-[#AAB794]" />
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
