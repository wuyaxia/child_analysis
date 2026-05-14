# Vercel 部署指南

## 部署步骤

### 1. 创建 Vercel 项目

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New..." → "Project"
3. 选择 "Import Git Repository"
4. 选择你的 GitHub 仓库（child_analysis）

### 2. 配置项目

在项目配置页面，设置以下选项：

**Framework Preset:** Vite（如果没有自动识别）

**Root Directory:** `.`（保持默认）

**Build Command:** `pnpm run build`

**Output Directory:** `dist`

**Install Command:** `pnpm install`

### 3. 添加环境变量

在 "Environment Variables" 部分，添加以下变量：

| Name | Value |
|------|-------|
| `VITE_FIREBASE_PROJECT_ID` | `childanalysis-32c23` |
| `VITE_FIREBASE_API_KEY` | `AIzaSyDjqB-1G75KaLIZjONO2z-ESmurAa-q_SU` |

⚠️ **重要:** 两个变量都要添加，API 才能正常工作。

### 4. 部署

点击 "Deploy" 按钮开始部署。

部署完成后，Vercel 会提供一个 URL，例如：`https://your-project.vercel.app`

## API 地址

部署完成后，API 端点为：
- 登录: `https://your-project.vercel.app/api/login`
- 注册: `https://your-project.vercel.app/api/register`

## 验证部署

1. 打开 Vercel 提供的 URL
2. 测试注册功能
3. 测试登录功能
4. 检查浏览器控制台是否有错误

## 常见问题

### Q: API 返回 500 错误
A: 检查环境变量是否正确配置，确保两个变量都已添加。

### Q: 部署失败
A: 查看 Vercel 控制台的部署日志，常见问题是依赖安装失败。

### Q: 如何更新代码
A: 推送到 GitHub 后，Vercel 会自动重新部署。

## Firebase 安全规则

部署完成后，建议更新 Firebase 安全规则，参考 `FIREBASE_SETUP.md`。
