# Tasks - 推荐任务去重修复

## [ ] Task 1: 更新 Task 类型定义
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 在 `/workspace/src/types/index.ts` 的 Task 接口中添加 `sourcePresetId?: string` 字段
- **Acceptance Criteria Addressed**: Requirement: sourcePresetId 字段
- **Test Requirements**:
  - `programmatic`: Task 类型包含 sourcePresetId 字段
- **Notes**: 

## [ ] Task 2: 更新 useAppStore presetTasks
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 在 `/workspace/src/store/useAppStore.ts` 的 presetTasks 定义中添加 `sourcePresetId` 字段
  - 预设任务的 `sourcePresetId` 设置为其自身的 `id`
- **Acceptance Criteria Addressed**: Requirement: sourcePresetId 字段
- **Test Requirements**:
  - `programmatic`: 所有 presetTasks 包含 sourcePresetId
- **Notes**: 

## [ ] Task 3: 更新 TasksPage 过滤逻辑
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **Description**: 
  - 修改 `/workspace/src/pages/TasksPage.tsx` 中的 `filteredPresetTasks` 和 `recommendedTasks` 过滤逻辑
  - 同时检查 `t.sourcePresetId === task.id` 或 `t.id === task.id`
- **Acceptance Criteria Addressed**: Requirement: 推荐任务过滤逻辑
- **Test Requirements**:
  - `programmatic`: 同一个预设任务不会被重复推荐
- **Notes**: 

## [ ] Task 4: 更新添加任务逻辑
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 修改 `/workspace/src/pages/TasksPage.tsx` 中的 `handleQuickAdd` 函数
  - 添加新任务时设置 `sourcePresetId: task.id`
- **Acceptance Criteria Addressed**: Requirement: sourcePresetId 字段
- **Test Requirements**:
  - `programmatic`: 添加的预设任务包含正确的 sourcePresetId
- **Notes**: 

## [ ] Task 5: 更新 API 类型（可选）
- **Priority**: P2
- **Depends On**: Task 1
- **Description**: 
  - 如果需要持久化，修改 `/workspace/api/tasks.ts` 支持 sourcePresetId 字段
- **Acceptance Criteria Addressed**: 
- **Test Requirements**:
  - `programmatic`: API 能正确处理 sourcePresetId 字段
- **Notes**: 当前主要问题是前端去重，API 更新可选

## [ ] Task 6: 验证和测试
- **Priority**: P0
- **Depends On**: Task 1, Task 2, Task 3, Task 4
- **Description**: 
  - 运行构建验证代码正确
  - 手动测试推荐任务不会被重复添加
- **Acceptance Criteria Addressed**: 所有需求
- **Test Requirements**:
  - `programmatic`: npm run build 成功
  - `human-judgement`: 重复添加同一预设任务时不会被显示
- **Notes**: 
