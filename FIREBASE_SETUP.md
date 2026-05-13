# Firebase 集成说明

## 功能介绍

我们已经集成了 Firebase 支持，提供以下功能：

1. **手机验证码登录** - 用户可以使用手机号登录
2. **家庭系统** - 创建家庭、加入家庭、邀请成员
3. **多孩子管理** - 支持添加、编辑、切换多个孩子
4. **实时数据同步** - 所有家庭成员可以实时共享数据

## Firebase 设置步骤

### 1. 创建 Firebase 项目

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 点击 "Create a project" 或 "Add project"
3. 按照向导完成项目创建

### 2. 启用身份验证

1. 在 Firebase Console 中，进入 "Authentication" → "Sign-in method"
2. 启用 "Phone" 登录方式
3. 按照提示配置短信验证（开发阶段可以使用测试号码）

### 3. 启用 Firestore 数据库

1. 进入 "Firestore Database" → "Create Database"
2. 选择 "Start in test mode" 或 "Start in production mode"
3. 选择数据库位置
4. 创建完成后，设置安全规则

### 4. 获取配置信息

1. 进入 "Project settings" → "General"
2. 在 "Your apps" 部分，点击 "Add app" → "Web"
3. 给应用起个名字，点击 "Register app"
4. 复制 `firebaseConfig` 对象

### 5. 更新项目配置

编辑 `src/config/firebase.config.ts` 文件，替换为真实的 Firebase 配置：

```typescript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 6. 配置 Firestore 安全规则

在 Firestore Database 的 "Rules" 标签页中，添加以下安全规则（开发阶段）：

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 用户可以读取和写入自己的用户文档
    match /users/{phone} {
      allow read, write: if request.auth != null;
    }
    
    // 家庭成员可以访问家庭数据
    match /families/{familyId} {
      allow read, write: if isFamilyMember(familyId);
      
      match /members/{memberId} {
        allow read, write: if isFamilyMember(familyId);
      }
      
      match /children/{childId} {
        allow read, write: if isFamilyMember(familyId);
        
        // 孩子的子集合
        match /{subcollection}/{docId} {
          allow read, write: if isFamilyMember(familyId);
        }
      }
    }
    
    function isFamilyMember(familyId) {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.token.phone_number)).data.familyId == familyId;
    }
  }
}
```

## 当前状态

✅ **基础架构已完成**
- Firebase SDK 已安装
- 类型定义已更新
- Zustand stores 已创建
- 登录页面、家庭设置页面、孩子管理页面已实现
- 路由守卫已集成

⚠️ **待完善**
- Firebase 配置需要用户自己设置
- 数据从 localStorage 到 Firestore 的迁移逻辑尚未实现
- 现有页面（记录、任务等）尚未完全接入 Firebase

## 下一步

1. 完成 Firebase 项目设置和配置
2. 将现有页面的数据操作接入 Firestore
3. 实现数据从 localStorage 到 Firebase 的迁移工具
4. 测试多端数据同步功能
