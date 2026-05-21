# 远端存储迁移完整检查计划

## 问题分析

经过对项目的全面审查，发现以下功能模块尚未完全迁移到远端存储（PostgreSQL）：

### 1. GrowthLog.tsx 仍然使用 Firebase
**文件**: `/workspace/src/pages/GrowthLog.tsx`

**问题**: 该页面仍然导入并使用 `firestoreDataService` 来加载和管理成长记录，而不是使用 `useAppStore` 提供的 API 方法。

**具体问题**:
- 第5行: `import { firestoreDataService } from '../lib/firestoreDataService';`
- 第15-36行: 使用 `firestoreDataService.getGrowthRecords()` 和 `firestoreDataService.deleteGrowthRecord(id)`
- 第38-52行: 删除记录时优先尝试 Firestore

### 2. useAppStore.ts 的 addMultipleTasks 未使用 API
**文件**: `/workspace/src/store/useAppStore.ts`

**问题**: `addMultipleTasks` 方法只是本地状态更新，没有调用 API 将数据持久化到数据库。

**具体问题**:
- 第252-257行: 直接操作本地状态，没有调用 `apiClient.tasks.create()`

### 3. tasks API 缺少 source_preset_id（已修复）
**文件**: `/workspace/api/tasks.ts`

**问题**: 已修复 - 已添加 `source_preset_id` 字段的支持

### 4. schema.sql 缺少 source_preset_id（已修复）
**文件**: `/workspace/database/schema.sql`

**问题**: 已修复 - 已添加 `source_preset_id VARCHAR(255)` 列

### 5. 遗留的 Firebase 相关文件
**文件**:
- `/workspace/src/lib/firestoreDataService.ts`
- `/workspace/src/config/firebase.config.ts`
- `/workspace/src/lib/firebase.ts`

**状态**: 这些文件仍然存在，但应该在完全迁移后移除

---

## 修复计划

### 任务 1: 重写 GrowthLog.tsx 使用 useAppStore

**步骤**:
1. 移除 `firestoreDataService` 导入
2. 使用 `useAppStore` 的 `growthRecords` 和相关方法
3. 移除本地状态 `localRecords`，直接使用 store 数据
4. 更新 `deleteGrowthRecord` 方法使用 store 的 `deleteGrowthRecord`

### 任务 2: 更新 useAppStore 的 addMultipleTasks

**步骤**:
1. 将 `addMultipleTasks` 修改为异步函数
2. 循环调用 `apiClient.tasks.create()` 创建多个任务
3. 更新 store 状态

### 任务 3: 更新 initializeData 的任务合并逻辑

**步骤**:
1. 确保从数据库加载的任务正确处理 `sourcePresetId`
2. 合并预设任务和数据库任务时避免重复

### 任务 4: 清理 Firebase 相关文件（可选）

**步骤**:
1. 确认所有 Firebase 引用已移除
2. 删除 Firebase 相关配置和服务文件

---

## 依赖关系

- 任务 1 依赖: useAppStore 已正确配置 API 调用
- 任务 2 依赖: tasks API 已支持 source_preset_id
- 任务 3 依赖: tasks API 返回正确的数据格式

---

## 风险处理

1. **数据迁移风险**: 如果用户之前使用 Firestore，需要确保数据已迁移到 PostgreSQL
2. **API 调用失败**: 需要添加适当的错误处理和降级机制
3. **类型错误**: 需要运行 TypeScript 检查确保类型正确

---

## 验证检查

完成后需要验证:
- [ ] GrowthLog 页面正常加载成长记录
- [ ] 可以正常添加/删除成长记录
- [ ] 推荐任务不会重复添加
- [ ] TypeScript 编译通过
- [ ] 所有 API 调用正常工作