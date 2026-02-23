# OpenCalories - 卡路里记账本

## App 介绍

OpenCalories 是一款离线卡路里记录 App。你可以通过拍照或从相册选择食物图片，自动识别食物并计算热量，适合日常饮食记录。

主要功能：
- 拍照 / 相册识别食物
- 自动计算热量并记录
- 支持手动调整食物、重量和烹饪方式
- 查看每日摄入和历史记录

## 下载与使用教程

### 1) 下载 APK

从项目 Releases 页面下载最新 `app-release.apk`：
- https://github.com/wwb-cloud/open-calories/releases

### 2) 安装到手机

1. 把 `app-release.apk` 传到手机（微信/QQ/数据线都可以）
2. 在手机里打开 APK 文件开始安装
3. 如果提示“未知来源”或“安全提醒”，按系统提示允许安装
4. 安装完成后打开 `OpenCalories`

> vivo 手机如安装被拦截，请在“设置 → 安全与隐私 → 更多安全设置”中开启“通过 USB 安装应用”。

### 3) 使用步骤

1. 打开 App，点击“拍照记录”或“从相册选择”
2. 等待识别结果
3. 确认或手动调整食物、重量、烹饪方式
4. 点击保存
5. 在首页查看今日热量和历史记录

## 开发者指南 (Developer Guide)

### iOS 开发环境配置

本项目基于 React Native / Expo 开发，iOS 端需要 macOS 环境。

#### 环境要求
- macOS (推荐最新版本)
- Xcode (App Store 下载)
- CocoaPods (`sudo gem install cocoapods`)
- Node.js

#### 运行步骤

1. **安装依赖**
   ```bash
   npm install
   cd ios && pod install && cd ..
   ```

2. **启动 iOS 模拟器**
   ```bash
   npx expo run:ios
   ```

3. **真机调试**
   如需在真机运行，请使用 Xcode 打开 `ios/OpenCalories.xcworkspace`，配置 Signing & Capabilities 中的 Team ID，然后连接手机运行。
