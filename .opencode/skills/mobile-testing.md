# 移动端测试专家

你是 React Native / Expo 移动端测试专家，专注于构建可靠、高效的测试体系。

## 测试金字塔

```
        ┌─────────┐
        │   E2E   │  ← Maestro (关键用户流程)
        ├─────────┤
        │ 集成测试 │  ← RNTL (组件交互)
        ├─────────┤
        │ 单元测试 │  ← Jest (纯函数、工具)
        └─────────┘
```

---

## 一、组件测试 (React Native Testing Library)

### 安装

```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native jest-expo
```

### Jest 配置

```javascript
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

### 测试示例

```typescript
// __tests__/components/FoodItem.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { FoodItem } from '@/components/FoodItem';

describe('FoodItem', () => {
  const mockFood = {
    id: '1',
    name: '苹果',
    caloriesPer100g: 52,
    category: 'fruit' as const,
    density: 0.85
  };

  it('renders food name correctly', () => {
    const { getByText } = render(
      <FoodItem food={mockFood} onPress={jest.fn()} />
    );
    
    expect(getByText('苹果')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <FoodItem food={mockFood} onPress={onPress} />
    );
    
    fireEvent.press(getByText('苹果'));
    expect(onPress).toHaveBeenCalledWith(mockFood);
  });

  it('displays calories correctly', () => {
    const { getByText } = render(
      <FoodItem food={mockFood} onPress={jest.fn()} />
    );
    
    expect(getByText(/52.*kcal/)).toBeTruthy();
  });
});
```

### 异步测试

```typescript
import { render, waitFor, act } from '@testing-library/react-native';

it('loads food list on mount', async () => {
  const { getByText, findByText } = render(<FoodListScreen />);
  
  // 等待数据加载
  await findByText('苹果');
  
  // 或使用 waitFor
  await waitFor(() => {
    expect(getByText('苹果')).toBeTruthy();
  });
});
```

### Mock 策略

```typescript
// __mocks__/expo-sqlite.js
export const openDatabaseAsync = jest.fn().mockResolvedValue({
  execAsync: jest.fn(),
  runAsync: jest.fn(),
  getAllAsync: jest.fn().mockResolvedValue([]),
  getFirstAsync: jest.fn().mockResolvedValue(null),
});

// __mocks__/expo-camera.js
export const Camera = jest.fn().mockImplementation(() => null);
export const useCameraPermissions = jest.fn(() => [
  { granted: true },
  jest.fn()
]);
```

---

## 二、E2E 测试 (Maestro)

### 为什么选择 Maestro？

- ✅ 支持 Expo 项目
- ✅ YAML 配置，简单直观
- ✅ 支持 iOS 模拟器和 Android 模拟器
- ✅ 可在 CI/CD 中运行
- ✅ 内置等待机制，减少 flaky 测试

### 安装

```bash
# macOS
brew tap mobile-dev-inc/tap
brew install maestro

# Windows (需要 Java 11+)
# 下载 https://github.com/mobile-dev-inc/maestro/releases
```

### 项目配置

```yaml
# .maestro/config.yaml
flows:
  - flows/**/*.yaml
```

### 测试流程示例

```yaml
# .maestro/flows/add-food-record.yaml
appId: com.anonymous.opencalories
---
- launchApp:
    clearState: true

# 导航到相机页面
- tapOn: "添加食物"

# 选择相册
- tapOn: "从相册选择"

# 授权相册访问（如果需要）
- tapOn:
    text: "允许"
    optional: true

# 选择一张图片
- tapOn:
    point: "50%,50%"

# 选择食物类型
- tapOn: "苹果"

# 调整重量
- swipe:
    start: "50%, 70%"
    end: "80%, 70%"
    direction: RIGHT

# 选择烹饪方式
- tapOn: "生食"

# 确认保存
- tapOn: "保存"

# 验证记录已创建
- assertVisible: "苹果"
- assertVisible: "52 kcal"
```

### 常用 Maestro 命令

```yaml
# 等待元素出现
- assertVisible: "按钮文本"

# 等待元素可点击
- waitForAnimationToEnd:
    timeout: 5000

# 输入文本
- tapOn: "输入框"
- inputText: "测试文本"

# 滚动查找
- scroll:
    direction: DOWN
- tapOn: "隐藏的按钮"

# 截图
- takeScreenshot: "结果页面"

# 条件判断
- runFlow:
    when:
      visible: "更新弹窗"
    commands:
      - tapOn: "稍后更新"
```

### 运行测试

```bash
# 运行单个流程
maestro test .maestro/flows/add-food-record.yaml

# 运行所有流程
maestro test .maestro/flows/

# 在特定设备运行
maestro test --device "iPhone 15" .maestro/flows/add-food-record.yaml
```

---

## 三、CI/CD 集成

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test

  e2e-android:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
      - run: npm ci
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      # 构建 Android APK
      - run: eas build --platform android --profile preview --local --output ./app.apk
      
      # 安装 Maestro
      - run: brew tap mobile-dev-inc/tap && brew install maestro
      
      # 启动模拟器
      - uses: reactivecircus/android-emulator-runner@v2
        with:
          api-level: 33
          script: maestro test .maestro/flows/
```

### EAS Build 配置

```json
// eas.json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": true
      }
    }
  }
}
```

---

## 四、测试最佳实践

### 1. 测试用户行为，而非实现细节

```typescript
// ❌ 不要测试实现细节
expect(component.state.isLoading).toBe(true);

// ✅ 测试用户可见的行为
expect(getByTestId('loading-spinner')).toBeTruthy();
```

### 2. 使用 data-testid 稳定定位

```tsx
// 组件
<TouchableOpacity 
  testID="add-food-button"
  onPress={handleAddFood}
>
  <Text>添加食物</Text>
</TouchableOpacity>

// 测试
fireEvent.press(getByTestId('add-food-button'));
```

### 3. 隔离外部依赖

```typescript
// Mock 数据库操作
jest.mock('@/db/database', () => ({
  getTodayRecords: jest.fn().mockResolvedValue(mockRecords),
  insertFoodRecord: jest.fn().mockResolvedValue(undefined),
}));
```

### 4. 测试关键路径

E2E 测试应覆盖：
- ✅ 核心用户流程（添加食物记录）
- ✅ 错误处理（网络失败、权限拒绝）
- ✅ 边界情况（空列表、大数据量）

---

## 五、项目测试命令

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "maestro test .maestro/flows/",
    "test:e2e:android": "maestro test --device 'Pixel_8_API_34' .maestro/flows/",
    "test:e2e:ios": "maestro test --device 'iPhone 15' .maestro/flows/"
  }
}
```

## 六、调试技巧

### Jest 调试

```typescript
import { debug } from '@testing-library/react-native';

render(<Component />);
debug(); // 打印组件树
```

### Maestro 调试

```bash
# 实时查看测试过程
maestro test --debug .maestro/flows/test.yaml

# 交互模式
maestro studio
```
