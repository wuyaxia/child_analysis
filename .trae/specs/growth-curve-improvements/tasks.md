# Tasks

- [x] Task 1: 安装 recharts 图表库
  - [x] SubTask 1.1: 运行 `npm install recharts`
  - [x] SubTask 1.2: 验证安装成功，检查 package.json

- [x] Task 2: 完善 useAuthStore 以支持家庭孩子数据
  - [x] SubTask 2.1: 在 Family 接口中添加 children 字段
  - [x] SubTask 2.2: 在登录/获取家庭时自动加载孩子数据

- [x] Task 3: 完善 useAppStore 以支持 childProfile 初始化
  - [x] SubTask 3.1: 在 initializeData 中自动获取孩子信息
  - [x] SubTask 3.2: 如果没有 childProfile 但有孩子数据，自动设置

- [x] Task 4: 扩展生长曲线标准数据
  - [x] SubTask 4.1: 将 GROWTH_STANDARDS 从 36-72 月扩展到 0-72 月
  - [x] SubTask 4.2: 补充完整的卫健委百分位数据

- [x] Task 5: 重构 GrowthCurve 页面
  - [x] SubTask 5.1: 移除手动性别切换，改为自动获取
  - [x] SubTask 5.2: 添加自动月龄计算（根据宝宝生日和测量日期）
  - [x] SubTask 5.3: 集成 recharts 双Y轴图表
  - [x] SubTask 5.4: 绘制卫健委参考曲线（P3、P10、P25、P50、P75、P90、P97）
  - [x] SubTask 5.5: 将宝宝实际测量数据绘制到参考图上
  - [x] SubTask 5.6: 更新添加记录表单，移除月龄输入

- [x] Task 6: 更新 API 以支持自动计算
  - [x] SubTask 6.1: 修改 emotions.ts API，支持不传入 ageMonths 时自动计算
  - [x] SubTask 6.2: 确保后端能正确接收自动计算的月龄

- [x] Task 7: 测试和验证
  - [x] SubTask 7.1: 测试图表正确显示身高体重双曲线
  - [x] SubTask 7.2: 测试自动月龄计算
  - [x] SubTask 7.3: 测试自动性别识别
  - [x] SubTask 7.4: 运行 lint 和 typecheck
