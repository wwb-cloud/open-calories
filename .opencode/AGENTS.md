# OpenCalories 项目指南

## 项目概述

OpenCalories 是一个离线卡路里追踪应用，使用 React Native + Expo 构建。

**核心功能**：
- 拍照/相册选择食物照片
- 手动选择食物类型（60+种）
- 调整重量并计算热量
- SQLite 本地存储
- 历史记录管理

**技术栈**：
- React Native 0.81 + Expo SDK 54
- TypeScript 5.9
- React Navigation
- expo-sqlite (SQLite)
- expo-camera / expo-image-picker

## 项目结构

```
open-calories/
├── App.tsx                    # 应用入口与导航
├── src/
│   ├── screens/               # 页面组件
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
└── .opencode/
    └── skills/                # 项目 Skills
        ├── react-native-expo.md
        ├── sqlite.md
        └── typescript.md
```

## 开发规范

### 代码风格
- 函数组件 + Hooks
- TypeScript 严格模式
- StyleSheet.create 样式
- useCallback/useMemo 优化

### 命名约定
- 组件：PascalCase (FoodItem)
- 函数：camelCase (calculateCalories)
- 常量：UPPER_SNAKE_CASE (COOKING_COEFFICIENTS)
- 文件：PascalCase.tsx (组件) / camelCase.ts (工具)

### 数据流
- SQLite 作为唯一数据源
- 页面组件负责数据获取
- 子组件通过 props 接收数据

## 可用 Skills

| Skill | 用途 | 触发场景 |
|-------|------|---------|
| react-native-expo | RN/Expo 开发指南 | 组件开发、导航、性能优化 |
| sqlite | 数据库操作 | CRUD、迁移、查询优化 |
| typescript | 类型安全 | 类型定义、泛型、类型守卫 |

## 常用命令

```bash
# 开发
npm start              # 启动 Expo
npm run android        # Android 运行
npm run ios            # iOS 运行

# 检查
npx tsc --noEmit       # 类型检查
npx expo install --check  # 依赖检查
```

## Phase 2 计划

- [ ] TFLite 食物分类模型
- [ ] OpenCV 体积估算
- [ ] AI vs 手动对比
