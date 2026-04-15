# AI分身创建页面 - 技术架构文档

## 技术栈

* **框架**: React 18 + TypeScript

* **构建工具**: Vite

* **样式**: Tailwind CSS

* **状态管理**: Zustand

* **路由**: React Router DOM

* **图标**: Lucide React

## 项目结构

```
src/
├── components/           # 组件目录
│   ├── common/          # 通用组件
│   │   ├── Header.tsx   # 顶部导航
│   │   ├── Slider.tsx   # 滑块组件
│   │   └── Tag.tsx      # 标签组件
│   ├── personality/     # 人设相关组件
│   │   ├── PersonalitySliders.tsx    # 性格滑块组
│   │   ├── LanguageStyleSliders.tsx  # 语言风格滑块组
│   │   └── TagSelector.tsx           # 标签选择器
│   ├── qa/              # 问答相关组件
│   │   ├── QAInterface.tsx           # 问答界面
│   │   ├── ChatBubble.tsx            # 聊天气泡
│   │   ├── MemoryCard.tsx            # 记忆卡片
│   │   └── QuestionGenerator.ts      # 问题生成器
│   └── preview/         # 预览相关
│       └── AvatarPreview.tsx
├── pages/               # 页面
│   └── CreateAvatar.tsx # 创建AI分身主页面
├── stores/              # 状态管理
│   └── avatarStore.ts   # AI分身状态存储
├── types/               # 类型定义
│   └── avatar.ts        # AI分身相关类型
├── constants/           # 常量
│   └── tags.ts          # 标签常量
└── utils/               # 工具函数
    └── helpers.ts
```

## 核心组件设计

### 1. Slider 滑块组件

```typescript
interface SliderProps {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (value: number) => void;
}
```

### 2. TagSelector 标签选择器

```typescript
interface TagSelectorProps {
  categories: TagCategory[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

interface TagCategory {
  name: string;
  tags: string[];
}
```

### 3. QAInterface 问答界面

```typescript
interface QAInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  onEndQA: () => void;
  memories: MemoryItem[];
}

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: number;
}
```

## 状态管理设计

### Zustand Store 结构

```typescript
interface AvatarStore {
  // 表单状态
  personality: PersonalityConfig;
  languageStyle: LanguageStyleConfig;
  selectedTags: string[];
  memories: MemoryItem[];
  
  // 问答状态
  messages: Message[];
  currentQuestionIndex: number;
  isQAActive: boolean;
  
  // 方法
  updatePersonality: (key: keyof PersonalityConfig, value: number) => void;
  updateLanguageStyle: (key: keyof LanguageStyleConfig, value: number) => void;
  toggleTag: (tag: string) => void;
  addMessage: (message: Message) => void;
  addMemory: (memory: MemoryItem) => void;
  importFromDouyin: (config: Partial<AvatarStore>) => void;
  reset: () => void;
}
```

## 数据流

1. **用户操作** → 触发 Store 方法
2. **Store 更新** → 组件重新渲染
3. **问答流程** → 异步调用 AI 生成问题/分析回答
4. **完成创建** → 提交完整配置到后端

## API 接口设计

### 抖音导入

```typescript
POST /api/douyin/import
Response: {
  personality: PersonalityConfig;
  languageStyle: LanguageStyleConfig;
  tags: string[];
}
```

### AI 问答

```typescript
POST /api/ai/question
Request: {
  conversationHistory: Message[];
  currentConfig: AvatarConfig;
}
Response: {
  question: string;
  suggestedAdjustments?: Partial<AvatarConfig>;
  extractedMemories?: MemoryItem[];
}
```

### 保存配置

```typescript
POST /api/avatar/create
Request: AvatarConfig
Response: {
  avatarId: string;
  success: boolean;
}
```

## 性能优化

1. **组件懒加载**: 问答模块使用 React.lazy 按需加载
2. **状态切片**: Zustand 使用选择器避免不必要的重渲染
3. **防抖处理**: 滑块变化使用防抖避免频繁更新
4. **本地存储**: 自动保存草稿到 localStorage

