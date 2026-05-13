# 远端存储与多端协同 - 设计文档

**日期**: 2026-05-13
**状态**: 已确认

## 1. 需求概述

### 1.1 核心功能
1. **远端存储** - 将本地 localStorage 数据迁移到 Firebase，支持多端同步
2. **家庭账号体系** - 手机号登录 + 家庭角色（爸爸、妈妈等）
3. **宝宝信息维护** - 支持管理多个孩子的档案信息

### 1.2 用户场景
- 家庭成员（爸爸、妈妈、老人）可在不同设备上查看和更新孩子的成长数据
- 所有家庭成员实时共享数据，支持多端协同
- 支持管理多个孩子（如双胞胎、二宝等）

## 2. 现有功能分析

当前已实现的功能模块（基于 [src/types/index.ts](file:///workspace/src/types/index.ts) 和 [src/App.tsx](file:///workspace/src/App.tsx)）：

### 2.1 现有页面
| 页面 | 功能 | 源文件 |
|------|------|--------|
| Home | 首页（儿童分析报告） | [src/pages/Home.tsx](file:///workspace/src/pages/Home.tsx) |
| GrowthLog | 成长记录 | [src/pages/GrowthLog.tsx](file:///workspace/src/pages/GrowthLog.tsx) |
| TasksPage | 任务打卡 | [src/pages/TasksPage.tsx](file:///workspace/src/pages/TasksPage.tsx) |
| KnowledgeBase | 知识库 | [src/pages/KnowledgeBase.tsx](file:///workspace/src/pages/KnowledgeBase.tsx) |
| ProfilePage | 个人资料 | [src/pages/ProfilePage.tsx](file:///workspace/src/pages/ProfilePage.tsx) |
| ReviewPage | 阶段复盘 | [src/pages/ReviewPage.tsx](file:///workspace/src/pages/ReviewPage.tsx) |
| GrowthCurve | 生长发育曲线 | [src/pages/GrowthCurve.tsx](file:///workspace/src/pages/GrowthCurve.tsx) |

### 2.2 现有数据结构
- ChildProfile - 孩子档案
- GrowthRecord - 成长记录
- Task - 任务打卡
- KnowledgeArticle - 知识库文章
- EmotionRecord - 情绪记录
- Milestone - 里程碑
- Review - 阶段复盘
- GrowthMeasurement - 生长测量

## 3. 技术方案

### 3.1 技术选型
- **Firebase Auth** - 手机号登录（短信验证码）
- **Firestore** - 实时 NoSQL 数据库
- **React + TypeScript** - 前端框架（现有）
- **Zustand** - 状态管理（现有）

### 3.2 Firebase 配置
需要配置以下 Firebase 服务：
```javascript
// firebaseConfig.js
{
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
}
```

## 4. 数据结构设计

### 4.1 Firestore 集合结构

```
/families/{familyId}
  - name: string           // 家庭名称，如"小明家"
  - createdAt: timestamp   // 创建时间
  - inviteCode: string     // 6位邀请码
  - members: {             // 子集合
      [memberId]: {
        phone: string,
        role: 'father' | 'mother' | 'grandpa' | 'grandma' | 'other',
        nickname: string,
        joinedAt: timestamp,
        avatar?: string
      }
    }

/users/{phone}            // 用户文档，key为手机号
  - phone: string
  - familyId: string | null
  - currentMemberId: string | null
  - createdAt: timestamp
  - lastLoginAt: timestamp

/families/{familyId}/children/{childId}
  - name: string              // 孩子姓名
  - birthDate: string         // 出生日期 (YYYY-MM-DD)
  - gender: 'boy' | 'girl'    // 性别
  - avatar?: string           // 头像URL
  - order: number             // 排序（家里第几个孩子）
  - isActive: boolean         // 是否是当前选中的孩子
  - createdBy: string
  - createdAt: timestamp
  - updatedAt: timestamp

/families/{familyId}/children/{childId}/growthRecords/{recordId}
  - type: 'daily' | 'milestone' | 'emotion' | 'skill'
  - content: string
  - photos?: string[]
  - tags?: string[]
  - createdBy: string      // memberId
  - createdAt: timestamp
  - updatedAt: timestamp

/families/{familyId}/children/{childId}/tasks/{taskId}
  - title: string
  - description?: string
  - category: TaskCategory
  - difficulty: DifficultyLevel
  - ageRange: { min: number, max: number }
  - duration: number
  - frequency: 'daily' | 'weekly' | 'once'
  - completedDates: string[]
  - isCustom: boolean
  - createdBy: string
  - createdAt: timestamp
  - updatedAt: timestamp

/families/{familyId}/children/{childId}/emotions/{recordId}
  - emotion: 'happy' | 'calm' | 'excited' | 'frustrated' | 'sad' | 'angry'
  - trigger?: string
  - response?: string
  - notes?: string
  - date: string
  - createdBy: string
  - createdAt: timestamp

/families/{familyId}/children/{childId}/milestones/{recordId}
  - title: string
  - date: string
  - description?: string
  - category: 'language' | 'motor' | 'social' | 'cognitive'
  - createdBy: string
  - createdAt: timestamp

/families/{familyId}/children/{childId}/reviews/{reviewId}
  - title: string
  - age: string
  - date: string
  - problems: string[]
  - improvements: string[]
  - notes?: string
  - createdBy: string
  - createdAt: timestamp
  - updatedAt: timestamp

/families/{familyId}/children/{childId}/measurements/{recordId}
  - date: string
  - ageMonths: number
  - height: number
  - weight: number
  - headCircumference?: number
  - createdBy: string
  - createdAt: timestamp
```

**设计说明**：每个孩子的所有数据放在该孩子的子集合下，支持多孩子数据独立管理。

## 5. 功能流程设计

### 5.1 登录流程

```
┌─────────────────┐
│  启动App/进入网站 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  检查登录状态    │
└────────┬────────┘
         │
    ┌────┴────┐
    │  已登录？ │
    └────┬────┘
     否   │   是
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌─────────────────┐
│登录页面│ │ 检查是否加入家庭  │
└───┬────┘ └────────┬────────┘
    │               │
    ▼               │  否
┌────────┐          ▼
│输入手机│    ┌────────────┐
│  号   │    │ 创建/加入家庭 │
└───┬───┘    └─────┬──────┘
    │              │
    ▼              │
┌────────┐         │
│发送验证码│        │
└───┬────┘         │
    │              │
    ▼              │
┌────────┐         │
│验证验证码│         │
└───┬────┘         │
    │              │
    └──────┬───────┘
           │
           ▼
    ┌────────────┐
    │  进入首页   │
    └────────────┘
```

### 5.2 创建/加入家庭流程

```
┌─────────────────┐
│ 创建或加入家庭  │
└────────┬────────┘
         │
    ┌────┴────┐
    │ 选择方式 │
    └────┬────┘
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│ 创建家庭 │ │ 加入家庭 │
└───┬────┘ └───┬────┘
    │          │
    ▼          ▼
┌────────┐ ┌────────┐
│选择角色 │ │输入邀请码│
└───┬────┘ └───┬────┘
    │          │
    ▼          │
┌────────┐     │
│设置昵称│     │
└───┬────┘     │
    │          │
    ▼          │
┌────────┐     │
│添加孩子│     │
└───┬────┘     │
    │          │
    └────┬─────┘
         │
         ▼
    ┌────────────┐
    │ 进入家庭首页│
    └────────────┘
```

### 5.3 邀请成员流程

```
┌─────────────────┐
│ 进入家庭设置    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  邀请新成员     │
└────────┬────────┘
         │
    ┌────┴────┐
    │ 选择方式 │
    └────┬────┘
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│邀请码  │ │手机号  │
│方式    │ │方式    │
└───┬────┘ └───┬────┘
    │          │
    ▼          ▼
┌────────┐ ┌────────┐
│复制    │ │发送    │
│邀请码  │ │邀请短信│
└────────┘ └───┬────┘
               │
               ▼
         ┌────────┐
         │对方接受 │
         │邀请    │
         └────────┘
```

## 6. 安全规则

### 6.1 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 用户只能读写自己的用户文档
    match /users/{phone} {
      allow read, write: if request.auth != null 
        && request.auth.token.phone_number == phone;
    }
    
    // 家庭成员可以读写家庭数据
    match /families/{familyId} {
      // 家庭文档本身
      allow read, write: if isFamilyMember(familyId);
      
      // 成员子集合
      match /members/{memberId} {
        allow read: if isFamilyMember(familyId);
        allow write: if isFamilyAdmin(familyId) || !exists(/databases/$(database)/documents/families/$(familyId)/members);
      }
      
      // 孩子子集合
      match /children/{childId} {
        allow read, write: if isFamilyMember(familyId);
        
        // 孩子的所有子文档（成长记录、任务等）
        match /{subcollection}/{docId} {
          allow read, write: if isFamilyMember(familyId);
        }
      }
    }
    
    function isFamilyMember(familyId) {
      return request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.token.phone_number)).data.familyId == familyId;
    }
    
    function isFamilyAdmin(familyId) {
      // 第一个加入的成员为管理员
      return true; // TODO: 实现管理员逻辑
    }
  }
}
```

## 7. 组件设计

### 7.1 新增页面
| 页面 | 功能 | 路径 |
|------|------|------|
| LoginPage | 登录页（手机号验证码） | `/login` |
| FamilySetupPage | 创建/加入家庭页 | `/family-setup` |
| FamilySettingsPage | 家庭设置页（邀请成员、管理成员） | `/family-settings` |
| ChildrenPage | 孩子管理页（添加/编辑/切换孩子） | `/children` |
| ProfilePage | 个人设置页（修改角色、退出家庭） | `/profile`（已有） |

### 7.2 新增组件
| 组件 | 功能 |
|------|------|
| PhoneLogin | 手机号登录组件 |
| VerifyCode | 验证码输入组件 |
| RoleSelector | 角色选择器 |
| InviteMember | 邀请成员组件 |
| FamilyMembers | 家庭成员列表 |
| ChildCard | 孩子卡片组件 |
| ChildForm | 添加/编辑孩子表单 |
| ChildSwitcher | 孩子切换器（页面顶部下拉选择） |

### 7.3 修改现有组件
| 组件 | 修改内容 |
|------|----------|
| [BottomNav](file:///workspace/src/components/layout/BottomNav.tsx) | 添加"我的"入口 |
| [MainLayout](file:///workspace/src/components/layout/MainLayout.tsx) | 添加登录状态检查、孩子切换器 |
| [useAppStore](file:///workspace/src/store/useAppStore.ts) | 改为 Firebase 同步模式、支持多孩子 |
| [Home.tsx](file:///workspace/src/pages/Home.tsx) | 适配多孩子，根据当前孩子显示信息 |
| [GrowthLog.tsx](file:///workspace/src/pages/GrowthLog.tsx) | 改为读取当前孩子的 Firebase 数据 |
| [TasksPage.tsx](file:///workspace/src/pages/TasksPage.tsx) | 改为读取当前孩子的 Firebase 数据 |
| [ReviewPage.tsx](file:///workspace/src/pages/ReviewPage.tsx) | 改为读取当前孩子的 Firebase 数据 |
| [GrowthCurve.tsx](file:///workspace/src/pages/GrowthCurve.tsx) | 改为读取当前孩子的 Firebase 数据 |
| [ProfilePage.tsx](file:///workspace/src/pages/ProfilePage.tsx) | 改为个人设置，添加退出登录 |

## 8. 状态管理设计

### 8.1 Auth Store（新增）
```typescript
interface AuthState {
  user: User | null;
  family: Family | null;
  currentMember: FamilyMember | null;
  isLoading: boolean;
  
  // Actions
  sendVerificationCode: (phone: string) => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
  createFamily: (name: string, role: Role, nickname: string) => Promise<void>;
  joinFamily: (inviteCode: string, role: Role, nickname: string) => Promise<void>;
  inviteMember: (method: 'code' | 'phone', phone?: string) => Promise<void>;
  logout: () => Promise<void>;
}
```

### 8.2 Children Store（新增）
```typescript
interface ChildrenState {
  children: Child[];
  currentChild: Child | null;
  isLoading: boolean;
  
  // Actions
  fetchChildren: () => Promise<void>;
  addChild: (child: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateChild: (childId: string, data: Partial<Child>) => Promise<void>;
  setCurrentChild: (child: Child) => void;
}
```

### 8.3 数据同步策略
- 首次加载：从 Firestore 同步完整数据到本地
- 增量更新：使用 Firestore onSnapshot 实时监听
- 离线支持：Firebase 自动缓存，离线时读取缓存
- 数据迁移：用户首次登录时，提示迁移现有 localStorage 数据

## 9. 实施步骤

### Phase 0: 准备工作
1. 创建 Firebase 项目
2. 启用 Firebase Auth（手机号登录）
3. 创建 Firestore 数据库
4. 配置安全规则
5. 获取配置信息

### Phase 1: Firebase 基础集成
1. 安装 Firebase SDK
2. 创建 Firebase 初始化文件
3. 配置 TypeScript 类型
4. 实现基础的 Auth hook

### Phase 2: 登录与家庭模块
1. 实现手机号登录 UI
2. 实现验证码验证
3. 创建/加入家庭流程
4. 邀请成员功能
5. 孩子管理功能（添加、编辑、切换）

### Phase 3: 数据同步（逐模块迁移）
1. 成长记录模块（[GrowthLog](file:///workspace/src/pages/GrowthLog.tsx)）
2. 任务打卡模块（[TasksPage](file:///workspace/src/pages/TasksPage.tsx)）
3. 阶段复盘模块（[ReviewPage](file:///workspace/src/pages/ReviewPage.tsx)）
4. 生长发育曲线模块（[GrowthCurve](file:///workspace/src/pages/GrowthCurve.tsx)）
5. 知识库模块（[KnowledgeBase](file:///workspace/src/pages/KnowledgeBase.tsx) - 保持本地存储或也同步）

### Phase 4: 完善与优化
1. 错误处理优化
2. 加载状态优化
3. 离线支持完善
4. 数据迁移工具（localStorage → Firebase）
5. 测试验证

## 10. 已知限制

1. **手机号登录限制**: Firebase 手机号登录需要配置短信模板，每个项目每月有免费额度
2. **数据迁移**: 现有 localStorage 数据需要用户手动迁移或导出导入
3. **离线支持**: 首次使用必须联网，之后可离线访问缓存数据

## 11. 后续扩展

- 微信登录（需要企业资质）
- 家庭相册功能
- 成长报告生成
- 推送通知提醒
- 数据统计与可视化
