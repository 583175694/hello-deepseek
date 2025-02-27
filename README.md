以下是这个项目的 README：

# AI 聊天应用

这是一个基于 Next.js 和 NestJS 构建的全栈 AI 聊天应用。

## 技术栈

### 前端
- Next.js 15
- React 19
- TailwindCSS
- Zustand (状态管理)
- Axios (HTTP 客户端)
- shadcn/ui (UI 组件库)

### 后端
- NestJS
- LangChain
- DeepSeek API

## 主要功能

- 💬 实时 AI 对话
- 📝 多会话管理
- 🔄 历史记录同步
- 🎨 深色/浅色主题
- 🔍 对话内容搜索 (开发中)

## 项目结构

```
├── client/               # 前端项目
│   ├── src/
│   │   ├── app/         # Next.js 页面
│   │   ├── components/  # React 组件
│   │   ├── lib/        # 工具函数
│   │   ├── store/      # 状态管理
│   │   └── types/      # TypeScript 类型定义
│   
└── server/              # 后端项目
    └── src/
        ├── chat/       # 聊天相关模块
        └── main.ts     # 应用入口
```

## 快速开始

### 前端开发

```bash
cd client
npm install
npm run dev
```

访问 http://localhost:5173

### 后端开发

```bash
cd server
npm install
npm run start:dev
```

服务将运行在 http://localhost:3000

## 环境变量

### 后端 (.env)
```
DEEPSEEK_API_KEY=your_api_key
```

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT

## 致谢

- [Next.js](https://nextjs.org/)
- [NestJS](https://nestjs.com/)
- [DeepSeek](https://deepseek.com/)
- [shadcn/ui](https://ui.shadcn.com/)
