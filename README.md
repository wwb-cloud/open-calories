# OpenCalories - 卡路里记账本

## App 介绍

OpenCalories 是一款离线卡路里记录 App。你可以通过拍照或从相册选择食物图片，自动识别食物并计算热量，适合日常饮食记录。

主要功能：
- 拍照 / 相册识别食物
- 自动计算热量并记录
- 支持手动调整食物、重量和烹饪方式
- 查看每日摄入和历史记录

## 下载与安装 (Download & Install)

### Android 用户
1. 访问 [Releases 页面](https://github.com/wwb-cloud/open-calories/releases) 下载最新 `app-release.apk`
2. 直接安装即可（部分手机需允许“安装未知来源应用”）

> vivo 手机如安装被拦截，请在“设置 → 安全与隐私 → 更多安全设置”中开启“通过 USB 安装应用”。

### iOS 用户
由于 iOS 系统限制，暂无法直接安装。您可以选择以下方式：

#### 方式 A：自签名安装 (推荐极客用户)
1. 从 Releases 页面下载最新 `.ipa` 文件（需自行寻找签名工具）
2. 使用 [AltStore](https://altstore.io/) 或 [Sideloadly](https://sideloadly.io/) 安装到手机
3. 在“设置 → 通用 → VPN与设备管理”中信任开发者证书
*注意：个人免费证书有效期仅 7 天，需定期刷新*

#### 方式 B：自行编译 (推荐开发者)
如果您拥有 Mac 电脑：
1. 克隆本项目代码
2. 运行 `npm install && cd ios && pod install`
3. 连接手机，使用 Xcode 打开 `ios/OpenCalories.xcworkspace` 运行

## 使用教程

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
