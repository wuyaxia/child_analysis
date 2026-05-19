-- ============================================================
-- 儿童成长中心 - 完整示例数据
-- ============================================================

-- ------------------------------
-- 1. 用户表 (users)
-- ------------------------------
INSERT INTO users (username, password_hash, salt) 
VALUES 
    -- 妈妈 (密码: 123456)
    ('mom', 
    '4b9c4b11899ecf8eed9678d70eb38222282bd27e13bdfade04a993acd3b91e8e4195da6d9a5e406d0c2ceb9f60af9b8ed96729e0edb9bab41352382ba4efd0bb',
    '0123456789abcdef0123456789abcdef'),
    
    -- 爸爸 (密码: 123456)
    ('dad', 
    '236c6a72e2dd24cb0b302423c8e1387e8cc994b20df4f3a123735b5c375e9c1b11eac4d7ef3b316dcd5bcf554419a940b8b3c1d532ac5fb325b31a0028c9a332',
    '1234567890abcdef1234567890abcdef'),
    
    -- 爷爷 (密码: 123456)
    ('grandpa', 
    'b16f2c8dae06a2763369a50a871c9c1d2912b764ad0f86af0e4b2e5093e34a88ab0f51d6255747b2d059488f581675f45bb077bacc786440f3d7f7b5ab5f57fc',
    '2345678901abcdef2345678901abcdef'),
    
    -- 奶奶 (密码: 123456)
    ('grandma', 
    'a8a8cb5d7b8453b7ba7370d774b965c0c596dbe056b7ff1851cdd538475eb2372ad7c84b3c444713ef9dce0d1565053c45acf745ae6242cadb3bd08cbccbe0d9',
    '3456789012abcdef3456789012abcdef')
ON CONFLICT (username) DO NOTHING;

-- ------------------------------
-- 2. 家庭表 (families)
-- ------------------------------
INSERT INTO families (name, invite_code)
VALUES 
    ('幸福成长之家', 'HAPPY2025'),
    ('阳光宝贝家庭', 'SUNNY2025')
ON CONFLICT (invite_code) DO NOTHING;

-- ------------------------------
-- 3. 更新用户关联家庭
-- ------------------------------
UPDATE users SET family_id = (SELECT id FROM families WHERE invite_code = 'HAPPY2025') 
WHERE username IN ('mom', 'dad', 'grandpa', 'grandma');

-- ------------------------------
-- 4. 家庭成员表 (family_members)
-- ------------------------------
INSERT INTO family_members (family_id, user_id, username, role, nickname)
VALUES 
    ((SELECT id FROM families WHERE invite_code = 'HAPPY2025'), (SELECT id FROM users WHERE username = 'mom'), 'mom', 'mother', '妈妈'),
    ((SELECT id FROM families WHERE invite_code = 'HAPPY2025'), (SELECT id FROM users WHERE username = 'dad'), 'dad', 'father', '爸爸'),
    ((SELECT id FROM families WHERE invite_code = 'HAPPY2025'), (SELECT id FROM users WHERE username = 'grandpa'), 'grandpa', 'grandpa', '爷爷'),
    ((SELECT id FROM families WHERE invite_code = 'HAPPY2025'), (SELECT id FROM users WHERE username = 'grandma'), 'grandma', 'grandma', '奶奶')
ON CONFLICT DO NOTHING;

-- ------------------------------
-- 5. 孩子表 (children)
-- ------------------------------
INSERT INTO children (family_id, name, birth_date, gender, created_by)
VALUES 
    -- 小明 (哥哥, 3岁)
    ((SELECT id FROM families WHERE invite_code = 'HAPPY2025'), '小明', '2022-05-15', 'boy', (SELECT id FROM users WHERE username = 'mom')),
    
    -- 小红 (妹妹, 1岁)
    ((SELECT id FROM families WHERE invite_code = 'HAPPY2025'), '小红', '2024-03-20', 'girl', (SELECT id FROM users WHERE username = 'mom'))
ON CONFLICT DO NOTHING;

-- ------------------------------
-- 6. 任务表 (tasks) - 完整的预设任务库
-- ------------------------------
INSERT INTO tasks (title, description, category, difficulty, age_min, age_max, duration, frequency, is_custom)
VALUES 
    -- ========== 规律作息 (routine) ==========
    ('早睡早起', '晚上9点前睡觉，早上7点起床', 'routine', 'easy', 36, 47, 10, 'daily', false),
    ('按时午休', '中午12:30-14:30午休', 'routine', 'easy', 36, 47, 120, 'daily', false),
    ('睡前仪式', '洗澡→换睡衣→刷牙→讲故事→关灯', 'routine', 'medium', 36, 47, 30, 'daily', false),
    ('定时排便', '培养固定时间排便习惯', 'routine', 'medium', 36, 47, 10, 'daily', false),
    ('独立入睡', '完成睡前仪式后自己入睡', 'routine', 'easy', 48, 59, 20, 'daily', false),
    ('时间感知', '认识整点和半点', 'routine', 'medium', 48, 59, 15, 'daily', false),
    ('晨间准备', '起床后自己穿衣、洗漱', 'routine', 'easy', 60, 71, 20, 'daily', false),
    ('按时作业', '放学后先完成小任务再玩', 'routine', 'medium', 60, 71, 15, 'daily', false),
    ('书包整理', '每晚整理好第二天书包', 'routine', 'easy', 72, 84, 10, 'daily', false),
    
    -- ========== 运动锻炼 (exercise) ==========
    ('户外跑跳', '每天户外活动30分钟', 'exercise', 'easy', 36, 47, 30, 'daily', false),
    ('平衡练习', '走直线、原地转圈', 'exercise', 'easy', 36, 47, 10, 'daily', false),
    ('拍球入门', '学习双手拍球', 'exercise', 'medium', 36, 47, 15, 'daily', false),
    ('骑平衡车', '户外平衡车骑行', 'exercise', 'easy', 48, 59, 30, 'daily', false),
    ('跳绳入门', '学习连续跳绳', 'exercise', 'easy', 60, 71, 15, 'daily', false),
    ('晨间体操', '做儿童广播体操', 'exercise', 'easy', 72, 84, 10, 'daily', false),
    
    -- ========== 认知学习 (cognitive) ==========
    ('认识颜色', '指认生活中的各种颜色', 'cognitive', 'easy', 36, 47, 10, 'daily', false),
    ('认识形状', '分辨圆形、方形、三角形', 'cognitive', 'easy', 36, 47, 10, 'daily', false),
    ('数数1-10', '正确数出1-10', 'cognitive', 'medium', 36, 47, 10, 'daily', false),
    ('数数1-20', '正确数出1-20', 'cognitive', 'easy', 48, 59, 10, 'daily', false),
    ('10以内加减', '熟练10以内加减法', 'cognitive', 'easy', 60, 71, 15, 'daily', false),
    ('100以内数数', '正数和倒数100以内', 'cognitive', 'easy', 72, 84, 10, 'daily', false),
    
    -- ========== 社交情感 (social) ==========
    ('主动问好', '见到熟人主动打招呼', 'social', 'easy', 36, 47, 5, 'daily', false),
    ('说谢谢', '收到帮助时说谢谢', 'social', 'easy', 36, 47, 5, 'daily', false),
    ('分享玩具', '主动与同伴分享玩具', 'social', 'easy', 48, 59, 15, 'daily', false),
    ('照顾他人', '关心帮助年龄小的孩子', 'social', 'easy', 60, 71, 10, 'daily', false),
    ('学校交往', '与同学友好相处', 'social', 'easy', 72, 84, 30, 'daily', false),
    
    -- ========== 生活自理 (selfcare) ==========
    ('自己吃饭', '独立使用餐具吃饭', 'selfcare', 'easy', 36, 47, 20, 'daily', false),
    ('洗手', '饭前便后正确洗手', 'selfcare', 'easy', 36, 47, 3, 'daily', false),
    ('自己刷牙', '独立刷牙2分钟', 'selfcare', 'easy', 48, 59, 3, 'daily', false),
    ('整理房间', '收拾自己的房间', 'selfcare', 'easy', 60, 71, 15, 'daily', false),
    
    -- ========== 艺术创意 (artistic) ==========
    ('涂鸦画画', '自由涂鸦创作', 'artistic', 'easy', 36, 47, 20, 'daily', false),
    ('手工制作', '折纸、剪纸等手工活动', 'artistic', 'medium', 48, 59, 20, 'daily', false),
    ('音乐律动', '跟着音乐跳舞', 'artistic', 'easy', 36, 47, 15, 'daily', false),
    
    -- ========== 安全意识 (safety) ==========
    ('认识红绿灯', '学习交通规则', 'safety', 'easy', 36, 47, 10, 'daily', false),
    ('不跟陌生人走', '学会拒绝陌生人', 'safety', 'easy', 36, 47, 5, 'daily', false),
    ('防火安全', '认识火的危险', 'safety', 'easy', 48, 59, 10, 'daily', false)
ON CONFLICT DO NOTHING;

-- ------------------------------
-- 7. 知识库文章 (knowledge_articles)
-- ------------------------------
INSERT INTO knowledge_articles (title, content, age_group, categories, tags, source)
VALUES 
    -- 3岁文章
    ('3岁儿童的语言发展', 
    '3岁孩子的语言能力快速发展，可以说出完整的句子，表达复杂的想法。家长应该多与孩子交流，讲述故事，扩展词汇量。建议每天进行至少15分钟的亲子阅读。', 
    '3', '{"认知学习"}', '{"语言", "沟通", "阅读"}', '通用'),
    
    ('培养孩子的生活习惯', 
    '3-6岁是培养良好生活习惯的关键期。包括规律作息、健康饮食、自我管理等。建议制定固定的时间表，让孩子养成好习惯。', 
    '3', '{"生活管理"}', '{"习惯", "作息", "健康"}', '通用'),
    
    ('儿童运动发展指南', 
    '3-6岁儿童需要每天至少3小时的户外活动时间。运动有助于身体发育，还能促进大脑发育和情绪调节。', 
    '3', '{"运动发展"}', '{"运动", "健康", "发育"}', '通用'),
    
    -- 4岁文章
    ('4岁儿童的社交发展', 
    '4岁孩子开始对同伴交往产生浓厚兴趣，喜欢和小伙伴一起玩耍。家长可以鼓励孩子参与集体活动，学习分享和合作。', 
    '4', '{"社交情感"}', '{"社交", "友谊", "合作"}', '通用'),
    
    ('早期数学启蒙', 
    '4岁是数学启蒙的黄金时期。可以通过游戏、儿歌等方式让孩子认识数字、形状、大小等概念。', 
    '4', '{"认知学习"}', '{"数学", "启蒙", "游戏"}', '通用'),
    
    ('培养创造力', 
    '4岁孩子的想象力非常丰富，家长应该提供丰富的材料让孩子自由探索和创作，不要过多干预。', 
    '4', '{"艺术创意"}', '{"创造力", "想象力", "艺术"}', '通用'),
    
    -- 5岁文章
    ('幼小衔接准备', 
    '5岁孩子即将进入小学，需要培养良好的学习习惯和自理能力。建议提前练习独立完成作业、整理书包等技能。', 
    '5', '{"生活管理"}', '{"幼小衔接", "学习习惯", "自理"}', '通用'),
    
    ('情绪管理能力培养', 
    '5岁孩子开始有更复杂的情绪表达，家长应该帮助孩子识别和管理自己的情绪，学会用语言表达感受。', 
    '5', '{"社交情感"}', '{"情绪管理", "情商", "心理"}', '通用'),
    
    ('科学探索精神', 
    '5岁孩子好奇心旺盛，家长可以引导孩子观察自然、做简单的科学小实验，培养科学探索精神。', 
    '5', '{"认知学习"}', '{"科学", "探索", "自然"}', '通用'),
    
    -- 6岁文章
    ('阅读能力培养', 
    '6岁孩子应该能够独立阅读简单的绘本和故事书。家长可以陪伴阅读，鼓励孩子复述故事内容。', 
    '6', '{"认知学习"}', '{"阅读", "识字", "表达"}', '通用'),
    
    ('时间管理技巧', 
    '帮助6岁孩子建立时间观念，学会合理安排时间。可以使用可视化的时间表让孩子了解每天的计划。', 
    '6', '{"生活管理"}', '{"时间管理", "计划", "自律"}', '通用'),
    
    ('健康饮食习惯', 
    '培养孩子良好的饮食习惯，不挑食、不偏食。家长要以身作则，营造愉快的用餐氛围。', 
    '6', '{"生活管理"}', '{"饮食", "健康", "营养"}', '通用')
ON CONFLICT DO NOTHING;

-- ------------------------------
-- 8. 成长测量数据 (growth_measurements)
-- ------------------------------
INSERT INTO growth_measurements (child_id, date, age_months, height, weight, head_circumference, created_by)
VALUES 
    -- 小明的成长记录
    ((SELECT id FROM children WHERE name = '小明'), '2024-05-15', 24, 85.0, 12.0, 48.0, (SELECT id FROM users WHERE username = 'mom')),
    ((SELECT id FROM children WHERE name = '小明'), '2024-08-15', 27, 88.5, 12.8, 48.5, (SELECT id FROM users WHERE username = 'mom')),
    ((SELECT id FROM children WHERE name = '小明'), '2024-11-15', 30, 92.0, 13.5, 49.0, (SELECT id FROM users WHERE username = 'mom')),
    ((SELECT id FROM children WHERE name = '小明'), '2025-02-15', 33, 95.5, 14.2, 49.5, (SELECT id FROM users WHERE username = 'mom')),
    ((SELECT id FROM children WHERE name = '小明'), '2025-05-15', 36, 98.0, 15.0, 50.0, (SELECT id FROM users WHERE username = 'mom')),
    
    -- 小红的成长记录
    ((SELECT id FROM children WHERE name = '小红'), '2024-06-20', 3, 60.0, 6.5, 40.0, (SELECT id FROM users WHERE username = 'mom')),
    ((SELECT id FROM children WHERE name = '小红'), '2024-09-20', 6, 68.0, 8.0, 42.0, (SELECT id FROM users WHERE username = 'mom')),
    ((SELECT id FROM children WHERE name = '小红'), '2024-12-20', 9, 72.0, 9.2, 43.5, (SELECT id FROM users WHERE username = 'mom')),
    ((SELECT id FROM children WHERE name = '小红'), '2025-03-20', 12, 76.0, 10.0, 44.5, (SELECT id FROM users WHERE username = 'mom'))
ON CONFLICT DO NOTHING;

-- ------------------------------
-- 9. 里程碑 (milestones)
-- ------------------------------
INSERT INTO milestones (child_id, title, date, description, category, created_by)
VALUES 
    -- 小明的里程碑
    ((SELECT id FROM children WHERE name = '小明'), '第一次独立走路', '2023-08-20', '在客厅里稳稳地走了几步！', 'motor', (SELECT id FROM users WHERE username = 'mom')),
    ((SELECT id FROM children WHERE name = '小明'), '说出完整句子', '2024-03-10', '第一次说：「妈妈，我要喝水！」', 'language', (SELECT id FROM users WHERE username = 'mom')),
    ((SELECT id FROM children WHERE name = '小明'), '认识100个汉字', '2024-11-15', '能认出100个常用汉字', 'cognitive', (SELECT id FROM users WHERE username = 'dad')),
    ((SELECT id FROM children WHERE name = '小明'), '学会骑自行车', '2025-04-20', '学会了骑带辅助轮的自行车', 'motor', (SELECT id FROM users WHERE username = 'dad')),
    
    -- 小红的里程碑
    ((SELECT id FROM children WHERE name = '小红'), '第一次叫妈妈', '2024-08-15', '清晰地叫了一声妈妈！', 'language', (SELECT id FROM users WHERE username = 'mom')),
    ((SELECT id FROM children WHERE name = '小红'), '学会爬', '2024-10-01', '开始熟练地爬行', 'motor', (SELECT id FROM users WHERE username = 'mom')),
    ((SELECT id FROM children WHERE name = '小红'), '独站片刻', '2025-02-10', '能够独自站立几秒钟', 'motor', (SELECT id FROM users WHERE username = 'mom'))
ON CONFLICT DO NOTHING;

-- ------------------------------
-- 10. 情感记录 (emotion_records)
-- ------------------------------
INSERT INTO emotion_records (child_id, date, emotion, trigger, response, notes, created_by)
VALUES 
    -- 小明的情感记录
    ((SELECT id FROM children WHERE name = '小明'), '2025-01-20', 'happy', '周末去公园玩了', '整个下午都很开心', '玩了滑梯和沙子', (SELECT id FROM users WHERE username = 'mom')),
    ((SELECT id FROM children WHERE name = '小明'), '2025-01-22', 'frustrated', '积木搭了好几次都倒了', '有点生气，后来学会了耐心', '最后在爸爸的帮助下搭好了', (SELECT id FROM users WHERE username = 'dad')),
    ((SELECT id FROM children WHERE name = '小明'), '2025-01-25', 'excited', '明天要去动物园', '兴奋得睡不着觉', '期待看大熊猫', (SELECT id FROM users WHERE username = 'mom')),
    ((SELECT id FROM children WHERE name = '小明'), '2025-01-28', 'sad', '最喜欢的玩具车丢了', '哭了很久', '后来在沙发底下找到了', (SELECT id FROM users WHERE username = 'mom')),
    ((SELECT id FROM children WHERE name = '小明'), '2025-02-01', 'calm', '安静地看绘本', '看了半小时的绘本', '特别专注', (SELECT id FROM users WHERE username = 'grandma')),
    
    -- 小红的情感记录
    ((SELECT id FROM children WHERE name = '小红'), '2025-01-18', 'happy', '妈妈陪她玩游戏', '笑得很开心', '玩了躲猫猫', (SELECT id FROM users WHERE username = 'mom')),
    ((SELECT id FROM children WHERE name = '小红'), '2025-01-25', 'angry', '不想吃饭', '哭闹了一会儿', '后来还是吃了半碗', (SELECT id FROM users WHERE username = 'grandma'))
ON CONFLICT DO NOTHING;

-- ------------------------------
-- 11. 成长记录 (growth_records)
-- ------------------------------
INSERT INTO growth_records (child_id, date, record_type, content, photos, tags, created_by)
VALUES 
    -- 小明的成长记录
    ((SELECT id FROM children WHERE name = '小明'), '2025-01-15', 'daily', '今天在幼儿园学会了唱《小星星》', '{}', '{"幼儿园", "音乐", "学习"}', (SELECT id FROM users WHERE username = 'mom')),
    ((SELECT id FROM children WHERE name = '小明'), '2025-01-20', 'milestone', '学会了自己穿鞋子！', '{"photo1.jpg"}', '{"生活自理", "成长"}', (SELECT id FROM users WHERE username = 'dad')),
    ((SELECT id FROM children WHERE name = '小明'), '2025-01-25', 'daily', '今天在幼儿园认识了新朋友！', '{}', '{"幼儿园", "社交", "友谊"}', (SELECT id FROM users WHERE username = 'mom')),
    ((SELECT id FROM children WHERE name = '小明'), '2025-02-01', 'skill', '学会了拍球10次以上！', '{"photo2.jpg"}', '{"运动", "技能", "进步"}', (SELECT id FROM users WHERE username = 'dad')),
    ((SELECT id FROM children WHERE name = '小明'), '2025-02-10', 'emotion', '今天情绪管理得很好，没有发脾气', '{}', '{"情绪", "成长", "进步"}', (SELECT id FROM users WHERE username = 'mom')),
    
    -- 小红的成长记录
    ((SELECT id FROM children WHERE name = '小红'), '2025-01-18', 'daily', '今天第一次自己用勺子吃饭', '{"photo3.jpg"}', '{"生活自理", "成长"}', (SELECT id FROM users WHERE username = 'mom')),
    ((SELECT id FROM children WHERE name = '小红'), '2025-02-05', 'milestone', '长出了第一颗乳牙！', '{}', '{"成长", "健康"}', (SELECT id FROM users WHERE username = 'mom'))
ON CONFLICT DO NOTHING;

-- ------------------------------
-- 12. 复盘记录 (reviews)
-- ------------------------------
INSERT INTO reviews (child_id, title, age, date, problems, improvements, notes, created_by)
VALUES 
    -- 小明的复盘
    ((SELECT id FROM children WHERE name = '小明'), '3岁第1周成长复盘', '3岁', '2025-01-26', '{"早上起床有些磨蹭", "偶尔会发脾气"}', '{"学会了自己吃饭", "可以独立入睡"}', '这一周进步很大！继续加油！', (SELECT id FROM users WHERE username = 'mom')),
    ((SELECT id FROM children WHERE name = '小明'), '3岁第2周成长复盘', '3岁', '2025-02-02', '{"注意力不够集中", "不爱喝水"}', '{"拍球技能进步明显", "社交能力提升"}', '需要培养专注力，多喝水。', (SELECT id FROM users WHERE username = 'mom')),
    ((SELECT id FROM children WHERE name = '小明'), '3个月成长总结', '3岁', '2025-03-01', '{"有时过于敏感", "耐心不够"}', '{"语言表达能力大幅提升", "独立性增强"}', '总体表现优秀，继续保持！', (SELECT id FROM users WHERE username = 'dad'))
ON CONFLICT DO NOTHING;

-- ------------------------------
-- 13. 分析报告 (analysis_reports)
-- ------------------------------
INSERT INTO analysis_reports (child_id, age, title, sections)
VALUES 
    -- 小明的分析报告
    ((SELECT id FROM children WHERE name = '小明'), '3岁', '3岁 · 性格与行为发展分析', 
    '[
        {"id": "core-conclusion", "title": "核心结论", "emoji": "💡", "color": "bg-[#F7DBA7]/30", "borderColor": "border-[#F7DBA7]", "content": "目前整体属于正常发展范围内的高敏感 + 慢热型气质。小明情感细腻，观察力强，但面对新环境需要时间适应。"},
        {"id": "future-direction", "title": "未来发展方向", "emoji": "🌱", "color": "bg-[#AAB794]/20", "borderColor": "border-[#AAB794]", "content": "如果养育方式合适，会逐渐发展成情绪细腻、有观察力的孩子。建议多提供安全感，鼓励探索。"},
        {"id": "problem-analysis", "title": "问题本质分析", "emoji": "🔍", "color": "bg-[#D4836C]/10", "borderColor": "border-[#D4836C]", "content": "3岁孩子对预期极度敏感，一旦现实和预期不一致，大脑会直接进入情绪系统。需要提前建立清晰的规则和预期。"},
        {"id": "solution", "title": "核心解决方案", "emoji": "✨", "color": "bg-[#F2D5D0]/30", "borderColor": "border-[#F2D5D0]", "content": "情绪恢复力是第一优先级。建议通过绘本、游戏等方式帮助孩子识别和管理情绪。"},
        {"id": "action-plan", "title": "立即行动清单", "emoji": "🎯", "color": "bg-[#D4836C]/15", "borderColor": "border-[#D4836C]", "content": "1. 建立每日固定的情绪分享时间\\n2. 使用情绪卡片帮助识别情绪\\n3. 练习深呼吸技巧\\n4. 多给予肯定和鼓励"}
    ]'::jsonb)
ON CONFLICT DO NOTHING;

-- ------------------------------
-- 14. 更新用户的 current_member_id
-- ------------------------------
UPDATE users u
SET current_member_id = (
    SELECT id FROM family_members fm 
    WHERE fm.user_id = u.id AND fm.family_id = u.family_id
)
WHERE family_id IS NOT NULL;

-- ------------------------------
-- 15. 显示插入结果
-- ------------------------------
SELECT '=== 示例数据插入完成 ===' AS message;
SELECT COUNT(*) AS users_count FROM users;
SELECT COUNT(*) AS families_count FROM families;
SELECT COUNT(*) AS family_members_count FROM family_members;
SELECT COUNT(*) AS children_count FROM children;
SELECT COUNT(*) AS tasks_count FROM tasks;
SELECT COUNT(*) AS articles_count FROM knowledge_articles;
SELECT COUNT(*) AS measurements_count FROM growth_measurements;
SELECT COUNT(*) AS milestones_count FROM milestones;
SELECT COUNT(*) AS emotions_count FROM emotion_records;
SELECT COUNT(*) AS records_count FROM growth_records;
SELECT COUNT(*) AS reviews_count FROM reviews;
SELECT COUNT(*) AS reports_count FROM analysis_reports;
