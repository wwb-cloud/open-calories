# OpenCalories - 卡路里记账本

基于 React Native 的离线卡路里追踪应用。

## Phase 1 - 手动模式 (已实现)

✅ 基础功能完成：
- 拍照/相册选择食物照片
- 手动选择食物类型（60+种常见食物）
- 调整重量（滑块 + 快捷按钮）
- 选择烹饪方式（生食/清蒸/炒/油炸）
- 自动计算热量
- SQLite 本地存储
- 历史记录查看与删除
- 今日热量汇总

## 项目结构

```
open-calories/
├── App.tsx                    # 应用入口与导航
├── src/
│   ├── screens/
│   │   ├── CameraScreen.tsx   # 相机/相册选择
│   │   ├── ResultScreen.tsx   # 食物记录详情
│   │   └── HistoryScreen.tsx  # 历史记录
│   ├── db/
│   │   └── database.ts        # SQLite 数据库操作
│   ├── data/
│   │   └── foods.ts           # 食物数据库 (60+种)
│   ├── types/
│   │   └── index.ts           # TypeScript 类型定义
│   └── ai/
│       └── tflite.ts          # TFLite 模块占位符
├── package.json
└── app.json
```

## 运行步骤

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npx expo start

# 3. 在 Android Studio 中运行
# 或扫描 Expo Go 二维码
```

## Phase 2 计划

- [ ] TFLite 食物分类模型集成
- [ ] OpenCV 银行卡参照体积估算
- [ ] AI 估算 vs 手动输入对比
- [ ] 模型量化优化 (<4MB)

## 技术栈

- React Native 0.73 + Expo SDK 50
- TypeScript
- React Navigation
- expo-sqlite (SQLite)
- expo-camera (相机)
- expo-image-picker (相册)

## 食物数据库

包含 60+ 种常见中国食物，涵盖：
- 主食 (米饭、面条、馒头等)
- 肉类 (鸡胸肉、猪肉、牛肉等)
- 蔬菜 (青菜、西兰花、西红柿等)
- 水果 (苹果、香蕉、橙子等)
- 零食/饮品 (牛奶、巧克力、薯片等)

每种食物包含：
- 名称
- 热量 (kcal/100g)
- 密度 (g/cm³，用于Phase 2体积估算)
- 分类

## 烹饪系数

| 烹饪方式 | 系数 | 说明 |
|---------|------|------|
| 生食 | 1.0 | 原始热量 |
| 清蒸 | 1.0 | 几乎不增加热量 |
| 炒 | 1.15 | 加少量油 |
| 油炸 | 1.45 | 大量吸油 |

## License

MIT