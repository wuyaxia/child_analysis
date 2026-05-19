# 生长曲线优化规格说明

## Why
当前生长曲线页面存在以下问题：
- 缺少中国卫健委官方生长曲线参考图
- 身高体重分开显示，无法直观对比
- 需要手动切换男孩女孩
- 添加记录时需要手动选择月龄

## What Changes
- 从中国卫健委官网获取/嵌入儿童生长曲线参考图
- 使用双Y轴图表同时展示身高体重曲线
- 根据宝宝信息自动识别性别
- 添加记录时自动根据宝宝生日计算月龄

## Impact
- Affected specs: 生长曲线模块
- Affected code:
  - `/workspace/src/pages/GrowthCurve.tsx`
  - `/workspace/src/store/useAppStore.ts`
  - `/workspace/src/store/useAuthStore.ts`
  - 新增 `/workspace/api/growth-standards.ts`

## ADDED Requirements

### Requirement: 卫健委生长曲线数据获取
系统 SHALL 提供从中国卫健委官网获取儿童生长曲线参考数据的能力

#### Scenario: 获取标准数据
- **WHEN** 页面加载时或需要绘制曲线时
- **THEN** 从卫健委数据源获取3-6岁男/女孩身高体重百分位曲线数据
- **AND** 数据包含 P3、P10、P25、P50、P75、P90、P97 百分位线

### Requirement: 双Y轴生长曲线图表
系统 SHALL 提供双Y轴图表，同时展示身高和体重曲线

#### Scenario: 显示生长曲线
- **WHEN** 有测量数据时
- **THEN** 显示身高曲线（左Y轴，单位cm）
- **AND** 显示体重曲线（右Y轴，单位kg）
- **AND** 叠加显示卫健委百分位参考曲线

### Requirement: 自动性别识别
系统 SHALL 根据宝宝信息自动识别性别，无需手动切换

#### Scenario: 自动获取性别
- **WHEN** 页面加载且存在宝宝数据时
- **THEN** 自动从宝宝信息获取性别
- **AND** 隐藏手动性别切换按钮
- **AND** 图表使用对应性别的参考曲线

### Requirement: 自动月龄计算
系统 SHALL 根据宝宝生日和测量日期自动计算月龄

#### Scenario: 自动计算月龄
- **WHEN** 用户添加新测量记录时
- **THEN** 月龄字段根据测量日期和宝宝生日自动计算
- **AND** 隐藏月龄手动输入
- **AND** 显示计算出的月龄供参考

## MODIFIED Requirements

### Requirement: 生长测量记录
**原要求**: 用户手动输入月龄
**新要求**: 系统根据宝宝生日和测量日期自动计算月龄

#### Scenario: 添加测量记录
- **WHEN** 用户填写测量日期、身高、体重后提交
- **THEN** 系统自动计算月龄 = (测量日期 - 宝宝生日) 的月数
- **AND** 记录保存时包含自动计算的月龄

## Technical Implementation Notes

### 数据获取策略
1. 优先使用已内置在代码中的卫健委标准数据（不依赖外部抓取）
2. 数据格式保持与现有 `GROWTH_STANDARDS` 一致
3. 支持 0-6 岁全年龄段（0-72月）

### 图表库选择
- 使用 `recharts` 库（轻量级、React 原生支持）
- 需要添加到 `package.json` 依赖

### 宝宝数据获取流程
1. 登录后从 `useAuthStore.family.children` 获取孩子列表
2. 如果只有一个孩子，直接使用
3. 如果有多个孩子，优先使用 `isActive` 为 true 的孩子
4. 存储在 `useAppStore.childProfile` 中供 GrowthCurve 页面使用
