# 前端工程化实验教程

一份面向有基础开发者的前端工程化系统教程，从包管理到生产部署，覆盖完整工程化链路。

## 适合谁

- 有HTML/CSS/JS基础的开发者
- 想系统学习前端工程化工具链的开发者
- 从传统开发模式转向现代化工程化开发的开发者

## 教程目录

| 章节 | 主题 | 核心内容 |
|------|------|----------|
| [01](01-introduction.md) | 前端工程化导论 | 什么是工程化、解决什么问题、整体架构 |
| [02](02-npm.md) | 包管理器 npm | package.json、依赖管理、语义化版本 |
| [03](03-modules.md) | JavaScript模块化 | ESM vs CommonJS、Tree Shaking |
| [04](04-vite.md) | 构建工具 Vite | 项目创建、配置、HMR、环境变量 |
| [05](05-webpack.md) | 构建工具 Webpack | 核心概念、Loader/Plugin、对比选型 |
| [06](06-vue3.md) | Vue3核心 | Composition API、组件系统、路由 |
| [07](07-toolchain.md) | 开发工具链 | ESLint、Prettier、Git Hooks、测试 |
| [08](08-production.md) | 生产部署 | 构建优化、代码分割、部署流程 |

## 学习路径

```
01 导论 → 02 npm → 03 模块化 → 04 Vite → 05 Webpack
                                          ↓
              08 部署 ← 07 工具链 ← 06 Vue3
```

建议按顺序学习，每章约20-30分钟。

## 环境准备

```bash
# 确保已安装 Node.js (v18+)
node --version

# 确保已安装 npm
npm --version
```

## 快速开始

```bash
# 1. 创建第一个Vite项目（第04章）
npm create vite@latest my-app -- --template vue
cd my-app
npm install
npm run dev
```

## 技术栈

- **包管理**: npm
- **构建工具**: Vite, Webpack
- **前端框架**: Vue 3
- **代码质量**: ESLint, Prettier
- **测试框架**: Vitest
