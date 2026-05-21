# 任务模块 - 推荐任务去重修复

## Why
当前推荐任务可以被重复添加到"我的任务"中，因为：
- 预设任务（presetTasks）有固定 ID（如 `pr-3e-1`）
- 添加到"我的任务"时生成了新 ID（如 `task-1234567890`）
- 过滤推荐任务时比较的是任务 ID，新旧 ID 不匹配导致重复添加

## What Changes
- 添加预设任务时保留原始 ID 作为 `sourcePresetId`
- 过滤推荐任务时检查 `sourcePresetId` 而非 `id`
- 数据库和 store 结构需要支持 `sourcePresetId` 字段

## Impact
- Affected specs: 任务模块
- Affected code:
  - `/workspace/src/store/useAppStore.ts` - Task 接口和 presetTasks
  - `/workspace/src/pages/TasksPage.tsx` - 过滤逻辑和添加逻辑
  - `/workspace/src/types/index.ts` - Task 接口
  - `/workspace/api/tasks.ts` - 后端 API

## Technical Details

### 当前问题
```typescript
// 过滤逻辑 - 比较的是任务 ID
const notAdded = !tasks.some((t) => t.id === task.id);

// 添加逻辑 - 生成新的随机 ID
const newTask = { ...task, id: `task-${Date.now()}`, ... };

// 结果：新任务的 ID 与预设任务不同，导致可以重复添加
```

### 解决方案
```typescript
// 预设任务保留原始 ID
interface Task {
  id: string;
  sourcePresetId?: string; // 来源预设任务的 ID（如果有）
  // ...other fields
}

// 过滤逻辑 - 检查 sourcePresetId
const notAdded = !tasks.some((t) => 
  t.sourcePresetId === task.id || t.id === task.id
);

// 添加逻辑 - 添加时设置 sourcePresetId
const newTask = {
  ...task,
  id: `task-${Date.now()}`, 
  sourcePresetId: task.id, // 记录来源
  ...
};
```

## ADDED Requirements

### Requirement: sourcePresetId 字段
系统 SHALL 在任务对象中添加 `sourcePresetId` 字段，用于追踪任务是否来自预设任务

#### Scenario: 添加预设任务
- **WHEN** 用户从推荐任务中添加预设任务
- **THEN** 新任务包含 `sourcePresetId` 字段，值为原始预设任务的 ID
- **AND** 新任务有独立的任务 ID

#### Scenario: 过滤已添加的推荐任务
- **WHEN** 显示推荐任务列表时
- **THEN** 过滤条件包含检查 `sourcePresetId` 或 `id` 是否匹配

## MODIFIED Requirements

### Requirement: Task 类型定义
**修改**: 在 Task 接口中添加 `sourcePresetId?: string` 字段

### Requirement: 推荐任务过滤逻辑
**修改**: 过滤推荐任务时，同时检查 `sourcePresetId` 和 `id`
