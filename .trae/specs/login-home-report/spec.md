# 儿童成长中心 - 登录与首页功能优化 PRD

## Overview
- **Summary**: 优化登录功能和首页展示，包括：1) 修复登录后跳转逻辑，支持自动进入已创建的家庭页面；2) 首页增加数据汇总展示（复盘记录、打卡情况、轮播知识）；3) 将静态分析报告改为历史周期分析报告模块。
- **Purpose**: 提升用户体验，让家长能够顺畅使用应用，快速获取孩子成长数据和知识内容。
- **Target Users**: 使用儿童成长中心的家长用户

## Goals
- [x] 修复登录跳转逻辑，已登录且有家庭的用户直接进入首页
- [x] 首页增加每日打卡进度展示和激励设计
- [x] 首页增加复盘记录汇总展示
- [x] 首页增加知识轮播组件
- [x] 将静态分析报告重构为历史周期分析报告模块

## Non-Goals (Out of Scope)
- 不新增用户注册功能变更
- 不涉及 Firebase 数据迁移
- 不新增第三方社交登录

## Background & Context
当前系统使用 Vercel Postgres + localStorage 进行数据存储，已实现基本的登录/注册和家庭管理功能。首页目前只有静态分析报告内容，缺少动态数据展示和用户激励机制。

## Functional Requirements
- **FR-1**: 登录后根据用户状态自动跳转（有家庭→首页，无家庭→家庭设置页）
- **FR-2**: 首页展示今日打卡进度和完成情况
- **FR-3**: 首页展示打卡激励（连续打卡天数、成就徽章）
- **FR-4**: 首页展示知识轮播（每日一条育儿知识）
- **FR-5**: 首页展示复盘记录摘要
- **FR-6**: 首页展示历史分析报告模块（按年龄分组）

## Non-Functional Requirements
- **NFR-1**: 页面加载时间 < 2s
- **NFR-2**: 响应式设计，支持移动端
- **NFR-3**: 数据持久化存储（localStorage）

## Constraints
- **Technical**: React + TypeScript + Zustand + TailwindCSS
- **Dependencies**: 已存在的 store 和类型定义

## Assumptions
- 用户已完成注册并创建/加入家庭
- 已有打卡任务和复盘记录数据

## Acceptance Criteria

### AC-1: 登录跳转逻辑修复
- **Given**: 用户已登录且存在家庭数据
- **When**: 用户进入登录页面
- **Then**: 自动跳转到首页 `/`
- **Verification**: `programmatic`

### AC-2: 登录跳转家庭设置
- **Given**: 用户已登录但无家庭数据
- **When**: 用户进入登录页面
- **Then**: 自动跳转到家庭设置页 `/family-setup`
- **Verification**: `programmatic`

### AC-3: 今日打卡进度展示
- **Given**: 用户有打卡任务
- **When**: 用户进入首页
- **Then**: 显示今日打卡进度条和完成数量
- **Verification**: `human-judgment`

### AC-4: 打卡激励展示
- **Given**: 用户有连续打卡记录
- **When**: 用户进入首页
- **Then**: 显示连续打卡天数和成就徽章
- **Verification**: `human-judgment`

### AC-5: 知识轮播展示
- **Given**: 系统有知识文章数据
- **When**: 用户进入首页
- **Then**: 显示每日知识卡片，支持左右滑动切换
- **Verification**: `human-judgment`

### AC-6: 分析报告模块
- **Given**: 系统有分析报告数据和复盘记录
- **When**: 用户进入首页
- **Then**: 显示年龄标签选择器、对应报告内容和最近复盘记录摘要
- **Verification**: `human-judgment`

## Open Questions
- [ ] 是否需要添加新的成就徽章等级？
- [ ] 知识轮播是否需要自动播放？
