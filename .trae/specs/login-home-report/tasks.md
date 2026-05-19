# 儿童成长中心 - 登录与首页功能优化任务分解

## [x] Task 1: 修复登录跳转逻辑
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 修改 LoginPage.tsx，根据用户是否有家庭决定跳转目标
  - 有家庭 → 跳转首页 `/`
  - 无家庭 → 跳转家庭设置页 `/family-setup`
- **Acceptance Criteria Addressed**: AC-1, AC-2
- **Test Requirements**:
  - `programmatic`: 登录成功后根据 family 状态正确跳转
  - `human-judgement`: 登录页面代码逻辑清晰，注释说明跳转规则
- **Notes**: 检查 useAuthStore 中的 family 状态是否正确加载

## [x] Task 2: 首页增加打卡进度展示模块
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 在首页顶部增加今日打卡进度卡片
  - 显示完成任务数/总任务数
  - 添加进度条可视化
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `programmatic`: 进度条百分比计算正确
  - `human-judgement`: 卡片设计美观，数据展示清晰
- **Notes**: 使用 useAppStore 中的 tasks 数据计算今日完成情况

## [x] Task 3: 首页增加打卡激励模块
- **Priority**: P1
- **Depends On**: Task 2
- **Description**: 
  - 添加连续打卡天数展示
  - 添加成就徽章系统（3天/7天/30天/100天）
  - 添加本周获得星星数统计
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `programmatic`: 连续打卡天数计算正确
  - `human-judgement`: 徽章展示美观，激励效果明显
- **Notes**: 需要在 useAppStore 中添加连续打卡统计逻辑

## [x] Task 4: 首页增加知识轮播组件
- **Priority**: P1
- **Depends On**: Task 2
- **Description**: 
  - 创建知识轮播卡片组件
  - 支持左右滑动/点击切换
  - 显示知识标题和摘要
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `human-judgement`: 轮播切换流畅，卡片设计美观
- **Notes**: 使用 useAppStore 中的 knowledgeArticles 数据

## [x] Task 5: 首页增加分析报告模块
- **Priority**: P0
- **Depends On**: Task 2
- **Description**: 
  - 将静态分析报告重构为动态数据
  - 添加年龄标签选择器（如：3岁、4岁等）
  - 支持按年龄查看不同阶段的分析报告
  - 显示最近复盘记录摘要（最多3条）
- **Acceptance Criteria Addressed**: AC-6, AC-7
- **Test Requirements**:
  - `human-judgement`: 报告展示清晰，切换流畅
- **Notes**: 已在 store 中添加 presetAnalysisReports 数据，使用 reviews 数据显示复盘记录
