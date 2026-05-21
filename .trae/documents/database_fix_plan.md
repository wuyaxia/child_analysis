# 数据库存储问题修复计划

## 问题分析

经过全面检查，发现以下问题导致数据刷新后丢失：

### 1. 任务添加缺少关键参数
- `addMultipleTasks` 函数创建任务时缺少：
  - `childId` - 当前孩子 ID
  - `createdBy` - 创建者用户 ID
  - `familyId` - 家庭 ID

### 2. `source_preset_id` 字段验证
- 需要确认数据库表是否正确包含该字段

### 3. 测量数据添加问题
- 需要检查 GrowthCurve 组件中添加测量时的 childId 传递

### 4. 数据获取问题
- 需要验证数据库中确实有数据被写入

## 修复计划

### 1. 修复 useAppStore.ts
- 修复 `addMultipleTasks` 函数，添加缺失的参数
- 修复 `addTask` 函数（单个任务添加）
- 修复任务创建时的响应处理

### 2. 检查并修复 apiClient.ts
- 验证 tasks.create 函数的参数和响应处理
- 确保 created 任务正确解析为前端格式

### 3. 添加调试工具
- 创建一个简单的 API 端点来查看数据库中的实际数据
- 添加 console.log 来调试 API 调用

### 4. 验证数据库结构
- 确认 tasks 表包含 source_preset_id 字段
- 检查所有表结构是否正确

## 文件列表

1. `/workspace/src/store/useAppStore.ts` - 修复任务创建函数
2. `/workspace/src/lib/apiClient.ts` - 验证 API 调用
3. `/workspace/api/tasks.ts` - 检查并修复 API 端点
4. `/workspace/api/debug.ts` - 新增调试端点
