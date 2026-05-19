# 儿童成长中心 - 全量 Postgres 数据库迁移 PRD

## Overview
- **Summary**: 将应用的所有数据模块从 localStorage 和 Firebase 混合存储迁移到 Vercel Postgres（Supabase PostgreSQL），实现统一的云端数据持久化和多端数据同步。
- **Purpose**: 解决当前数据分散存储导致的数据同步、备份、多设备访问等问题，提供统一、可靠、可扩展的数据存储方案。
- **Target Users**: 儿童成长中心的所有用户（父母、祖父母等家庭成员）

## Goals
- 统一所有数据存储到 Vercel Postgres 数据库
- 实现完整的 CRUD API 接口
- 支持多端数据同步
- 保留现有 localStorage 作为离线缓存层（降级方案）
- 实现数据迁移工具，帮助用户将现有本地数据迁移到云端
- 保持现有功能完整，确保迁移过程用户体验平滑

## Non-Goals (Out of Scope)
- 不实现实时数据同步（WebSocket / 实时订阅）
- 不修改现有的 UI 交互逻辑
- 不进行大规模的功能重构
- 不实现复杂的冲突解决策略（使用最后写入优先策略）

## Background & Context
当前应用的数据存储架构存在以下问题：
1. **数据分散**: 用户、家庭数据在 Vercel Postgres，业务数据在 localStorage/Firebase
2. **无法多端同步**: 用户更换设备或在不同设备访问时数据无法同步
3. **数据安全**: localStorage 存储在用户设备上，存在数据丢失风险
4. **无法实现协作**: 家庭成员无法共享和协作编辑孩子的成长数据

### 现有技术架构
- **后端**: Vercel Serverless Functions + Supabase PostgreSQL
- **前端**: React + TypeScript + Zustand
- **当前存储**: 
  - 认证/用户/家庭：Vercel Postgres
  - 业务数据：localStorage + Zustand persist
  - Firestore：集成但未完全使用

## Functional Requirements
### 数据模型层
- **FR-1**: 设计完整的 PostgreSQL 数据库 schema，覆盖所有现有数据类型
- **FR-2**: 实现数据库表的创建、索引和约束
- **FR-3**: 设计外键关系，确保数据一致性

### API 层
- **FR-4**: 实现用户和家庭管理的完整 API（已部分实现，需完善）
- **FR-5**: 实现成长记录（GrowthRecord）的 CRUD API
- **FR-6**: 实现任务（Task）的 CRUD API
- **FR-7**: 实现知识库文章（KnowledgeArticle）的 API
- **FR-8**: 实现情感记录（EmotionRecord）的 CRUD API
- **FR-9**: 实现里程碑（Milestone）的 CRUD API
- **FR-10**: 实现复盘（Review）的 CRUD API
- **FR-11**: 实现成长测量（GrowthMeasurement）的 CRUD API
- **FR-12**: 实现孩子（Child）的 CRUD API
- **FR-13**: 实现分析报告（AnalysisReport）的 CRUD API
- **FR-14**: 实现统一的 API 错误处理和响应格式

### 前端集成层
- **FR-15**: 更新 Zustand store，移除 localStorage 持久化，改为调用 API
- **FR-16**: 实现 API 请求客户端库（axios/fetch 封装）
- **FR-17**: 实现离线缓存机制（localStorage 作为降级方案）
- **FR-18**: 实现数据加载和错误状态的 UI 反馈

### 数据迁移层
- **FR-19**: 实现本地数据检测和迁移向导
- **FR-20**: 实现批量数据上传功能
- **FR-21**: 实现迁移进度显示和确认

## Non-Functional Requirements
- **NFR-1**: API 响应时间 < 500ms（95% 的请求）
- **NFR-2**: 支持至少 1000 个并发用户
- **NFR-3**: 数据验证确保数据完整性
- **NFR-4**: API 接口有适当的安全验证（JWT/Session）
- **NFR-5**: 离线缓存功能在网络断开时仍可正常使用基础功能

## Constraints
- **Technical**: 
  - 继续使用 Vercel Serverless Functions
  - 数据库使用 Vercel Postgres（Supabase PostgreSQL）
  - 前端技术栈保持不变
- **Business**: 
  - 迁移过程不能影响现有用户使用
  - 必须保持向后兼容

## Assumptions
- 用户已经在 Supabase 中创建了数据库
- Vercel 环境变量 DATABASE_URL 已正确配置
- 用户希望保留现有数据并迁移到云端
- 网络连接在大多数时间是可用的

## Acceptance Criteria

### AC-1: 数据库 Schema 设计完成
- **Given**: 需求分析完成
- **When**: Schema 设计完成
- **Then**: 所有数据类型都有对应的数据库表定义，包含适当的索引和约束
- **Verification**: `human-judgment`
- **Notes**: Schema 需包含所有现有数据模型

### AC-2: 用户认证和家庭 API 完善
- **Given**: 数据库已初始化
- **When**: 用户进行登录、注册、创建/加入家庭操作
- **Then**: 所有操作正确读写数据库，并返回一致的响应格式
- **Verification**: `programmatic`

### AC-3: 业务数据 CRUD API 实现
- **Given**: 数据库已初始化
- **When**: 调用各个业务模块的 API
- **Then**: API 正确执行 CRUD 操作，数据持久化到数据库
- **Verification**: `programmatic`

### AC-4: 前端 Store 集成 API
- **Given**: API 实现完成
- **When**: 用户在前端进行操作
- **Then**: 数据正确通过 API 读写，并保持界面响应
- **Verification**: `human-judgment`

### AC-5: 离线缓存功能正常
- **Given**: 网络断开
- **When**: 用户继续使用应用
- **Then**: 应用仍然可以正常工作，数据缓存在本地
- **Verification**: `human-judgment`

### AC-6: 数据迁移功能正常
- **Given**: 用户有本地数据
- **When**: 用户使用迁移向导
- **Then**: 本地数据成功上传到云端，并显示迁移进度
- **Verification**: `human-judgment`

### AC-7: 所有现有功能正常工作
- **Given**: 迁移完成
- **When**: 用户使用所有现有功能
- **Then**: 所有功能与迁移前保持一致，体验无差异
- **Verification**: `human-judgment`

## Open Questions
- [ ] 是否需要实现用户数据备份/导出功能？
- [ ] 离线数据同步策略是否需要更复杂的设计（比如队列机制）？
- [ ] 是否需要实现数据版本控制和回滚？
