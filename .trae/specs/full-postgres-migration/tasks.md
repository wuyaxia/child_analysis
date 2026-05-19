# 儿童成长中心 - 全量 Postgres 数据库迁移任务分解

## [x] Task 1: 设计和实现完整的数据库 Schema
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 设计完整的 PostgreSQL 数据库表结构，包含所有业务数据
  - 创建初始化 SQL 脚本
  - 更新 init-db API 以支持完整的表创建
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `programmatic`: SQL 脚本可以无错误执行
  - `human-judgment`: Schema 设计覆盖所有数据类型，关系正确
- **Notes**: 表包括：users, families, family_members, children, growth_records, tasks, knowledge_articles, emotion_records, milestones, reviews, growth_measurements, analysis_reports

## [x] Task 2: 完善用户认证和家庭管理 API
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 完善 login API，返回用户的完整信息（包括家庭、孩子等关联数据）
  - 完善 register API
  - 创建 families API：创建家庭、加入家庭、获取家庭信息
  - 创建 family_members API
  - 创建 children API：管理孩子信息
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `programmatic`: 所有 API 端点可以正常调用
  - `human-judgment`: API 响应格式一致，错误处理完善
- **Notes**: 实现统一的 API 响应格式和错误处理

## [x] Task 3: 实现成长记录（GrowthRecord）API
- **Priority**: P1
- **Depends On**: Task 2
- **Description**: 
  - 创建 growth_records API，支持 CRUD 操作
  - 实现分页查询、按日期过滤等功能
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `programmatic`: CRUD 操作测试通过
- **Notes**: 关联到 family 和 child

## [x] Task 4: 实现任务（Task）API
- **Priority**: P1
- **Depends On**: Task 2
- **Description**: 
  - 创建 tasks API，支持 CRUD 操作
  - 实现任务完成日期管理
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `programmatic`: CRUD 操作测试通过
- **Notes**: 预置任务需要处理（区分预置和自定义）

## [x] Task 5: 实现其他业务数据 API
- **Priority**: P1
- **Depends On**: Task 3, 4
- **Description**: 
  - 创建 knowledge_articles API（只读+收藏/进度更新）
  - 创建 emotion_records API
  - 创建 milestones API
  - 创建 reviews API
  - 创建 growth_measurements API
  - 创建 analysis_reports API
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `programmatic`: 所有 API 端点可以正常调用
- **Notes**: 批量创建这些 API，遵循一致的模式

## [x] Task 6: 实现 API 客户端库
- **Priority**: P0
- **Depends On**: Task 5
- **Description**: 
  - 创建统一的 API 客户端封装
  - 实现请求拦截器、响应解析、错误处理
  - 实现身份认证管理（Session/Tokens）
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `human-judgment`: API 客户端使用方便，错误处理完善
- **Notes**: 封装在 src/lib/apiClient.ts

## [/] Task 7-8: 更新前端 Store 以集成 API
- **Priority**: P0
- **Depends On**: Task 6
- **Description**: 
  - 重构 useAuthStore，使用 API 替代 localStorage
  - 实现登录后获取完整用户和家庭数据
  - 保留 localStorage 作为会话缓存
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `human-judgment`: 登录流程正常，数据正确加载
- **Notes**: 保持向后兼容性

## [ ] Task 8: 更新 App Store 以集成 API
- **Priority**: P0
- **Depends On**: Task 7
- **Description**: 
  - 重构 useAppStore，移除 persist 中间件
  - 实现从 API 加载所有业务数据
  - 实现所有数据操作调用 API
  - 添加加载状态管理
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `human-judgment`: 所有功能正常，数据正确同步
- **Notes**: 这是核心任务，需要小心处理

## [x] Task 9-11: 实现离线缓存、数据迁移和最终集成
- **Priority**: P1
- **Depends On**: Task 8
- **Description**: 
  - 实现离线检测
  - 实现本地数据缓存（localStorage）
  - 实现在线后的数据同步
  - 创建数据迁移向导组件
  - 检测本地是否有旧数据
  - 实现批量数据上传功能
  - 实现迁移进度显示
  - 端到端测试所有功能
  - 修复发现的 bug
- **Acceptance Criteria Addressed**: AC-5, AC-6, AC-7
- **Test Requirements**:
  - `human-judgment`: 离线时功能正常，在线后数据可以同步；迁移向导使用流畅，数据成功迁移；所有现有功能正常工作
- **Notes**: 这是最后的验证阶段
