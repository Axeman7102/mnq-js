# 第二章：包管理器 npm

## 1. 什么是 npm

npm（**N**ode **P**ackage **M**anager）是 Node.js 的默认包管理器，也是世界上最大的软件包注册中心。

### 为什么需要 npm？

- **依赖管理**：项目可能依赖几十甚至上百个第三方库，手动管理几乎不可能
- **版本控制**：不同项目可能需要同一库的不同版本
- **脚本命令**：统一管理项目的构建、测试、启动等命令
- **团队协作**：任何人克隆项目后，一条命令就能还原完整开发环境

### npm 的组成

1. **npm CLI**：命令行工具，用于安装、发布、管理包
2. **npm Registry**：在线仓库，托管所有公开的 npm 包
3. **npmjs.com**：网站，用于搜索、浏览、管理包

---

## 2. package.json 详解

`package.json` 是项目的核心配置文件，描述了项目的基本信息和依赖关系。

### 基本结构

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "一个示例项目",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "eslint": "^8.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "license": "MIT"
}
```

### 常用字段说明

| 字段 | 说明 |
|------|------|
| `name` | 项目名称，小写无空格，可包含 `@scope/` 前缀 |
| `version` | 语义化版本号（SemVer） |
| `description` | 项目描述 |
| `main` | 入口文件 |
| `scripts` | 自定义脚本命令 |
| `dependencies` | 生产环境依赖 |
| `devDependencies` | 开发环境依赖 |
| `peerDependencies` | 对宿主环境的依赖声明 |
| `engines` | 要求的 Node.js 版本 |
| `license` | 开源协议 |
| `repository` | 代码仓库地址 |
| `keywords` | 关键词，用于 npm 搜索 |

### scripts 脚本详解

`scripts` 字段定义了项目的命令别名：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint src/",
    "format": "prettier --write src/",
    "test": "vitest",
    "prepare": "husky install"
  }
}
```

运行方式：

```bash
npm run dev
npm run build
npm run lint
```

一些内置脚本可以省略 `run`：

```bash
npm start    # 等同于 npm run start
npm test     # 等同于 npm run test
npm run t    # 自定义脚本必须加 run
```

---

## 3. dependencies vs devDependencies

### dependencies（生产依赖）

项目运行时必须的包，例如：

```json
{
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "axios": "^1.6.0"
  }
}
```

特点：
- `npm install` 时会默认安装
- 会被打包到最终产物中
- 用户访问网站时需要这些依赖

### devDependencies（开发依赖）

只在开发阶段使用的包，例如：

```json
{
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-vue": "^5.0.0",
    "eslint": "^8.50.0",
    "prettier": "^3.0.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0"
  }
}
```

特点：
- 只在本地开发时使用
- 不会打包到生产产物
- 用于开发、构建、测试等工具链

### 如何区分？

简单判断标准：**这个包是否只在终端/编辑器里用？**

- 是 → `devDependencies`
- 否 → `dependencies`

---

## 4. 语义化版本号（SemVer）

npm 包的版本号遵循 **Semantic Versioning** 规范，格式为：

```
MAJOR.MINOR.PATCH
```

| 类型 | 含义 | 何时递增 |
|------|------|----------|
| **MAJOR** | 主版本号 | 有不兼容的 API 变更 |
| **MINOR** | 次版本号 | 向下兼容的功能新增 |
| **PATCH** | 补丁号 | 向下兼容的 bug 修复 |

### 示例

```
1.0.0  → 1.0.1  （修复了一个 bug）
1.0.1  → 1.1.0  （新增了一个功能）
1.1.0  → 2.0.0  （破坏性更新）
```

### 版本范围符号

| 符号 | 含义 | 示例 |
|------|------|------|
| `^` | 兼容版本（推荐） | `^3.4.0` → `>=3.4.0 <4.0.0` |
| `~` | 精确匹配小版本 | `~3.4.0` → `>=3.4.0 <3.5.0` |
| `*` | 任意版本 | `*` |
| `>=` | 大于等于 | `>=18.0.0` |

### 实际建议

```json
{
  "dependencies": {
    "vue": "^3.4.0"
  }
}
```

`^` 是最常用的选择，表示接受 `MAJOR` 版本内的更新。这通常是最安全且实用的策略。

---

## 5. 常用 npm 命令

### 安装依赖

```bash
# 安装 dependencies + devDependencies
npm install

# 只安装 production dependencies
npm install --production
npm install --omit=dev

# 安装指定包
npm install vue
npm install vue@3.4.0
npm install @scope/package-name

# 全局安装
npm install -g typescript

# 安装为 devDependency
npm install -D vite
npm install --save-dev eslint
```

### 移除依赖

```bash
# 移除指定包
npm uninstall vue
npm remove axios

# 全局移除
npm uninstall -g typescript
```

### 更新依赖

```bash
# 更新到最新版本
npm update

# 更新指定包
npm update vue

# 交互式更新
npm update
```

### 查看信息

```bash
# 查看包信息
npm info vue

# 查看包的版本列表
npm view vue versions

# 查看全局安装的包
npm list -g --depth=0

# 查看项目依赖树
npm list
```

### 执行脚本

```bash
# 运行 scripts 中定义的命令
npm run dev
npm run build
npm run lint

# 生命周期钩子
npm run prebuild    # build 执行前自动运行
npm run postinstall # install 完成后自动运行
```

### 其他常用命令

```bash
# 初始化 package.json（交互式）
npm init

# 快速初始化（使用默认值）
npm init -y

# 清理缓存
npm cache clean --force

# 发布包（需要账号）
npm publish
npm unpublish
```

---

## 6. package-lock.json 的重要性

### 什么是 package-lock.json？

`package-lock.json` 记录了**每个依赖的精确版本**和下载地址，确保每次安装都得到完全一致的结果。

### 为什么重要？

假设 `package.json` 中声明了：

```json
{
  "dependencies": {
    "some-lib": "^1.0.0"
  }
}
```

如果没有 lock 文件，`npm install` 可能安装到 `1.2.3`、`1.3.0` 或 `1.0.5`（取决于安装时间）。这可能导致：

- 本地开发和 CI 环境结果不同
- 不同开发者之间结果不同
- 偶发性的"在我电脑上是好的"

### 应该提交 lock 文件吗？

**应该**。以下是决策参考：

| 场景 | 是否提交 |
|------|----------|
| 应用项目（App） | ✅ 提交 |
| 库项目（Library） | ❌ 不提交 |

应用项目需要确定性，库项目需要测试不同版本的兼容性。

### 常见问题

**Q：`package-lock.json` 和 `package.json` 版本不一致怎么办？**

运行 `npm install` 即可同步。

**Q：锁文件冲突怎么解决？**

在 `git merge` 时可能冲突，运行 `npm install` 重新生成即可。

---

## 7. 实战：从零创建一个项目

### 步骤 1：创建目录

```bash
mkdir my-project
cd my-project
```

### 步骤 2：初始化 package.json

```bash
npm init -y
```

这会生成一个基础的 `package.json` 文件。

### 步骤 3：安装 Vue 3 + Vite

```bash
npm install vue
npm install -D vite @vitejs/plugin-vue
```

此时 `package.json` 会更新：

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "vue": "^3.5.0"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "@vitejs/plugin-vue": "^5.1.0"
  }
}
```

### 步骤 4：创建项目文件

**index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>我的 Vue 应用</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**vite.config.js**

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

**src/main.js**

```js
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

**src/App.vue**

```vue
<template>
  <div>
    <h1>{{ message }}</h1>
    <button @click="count++">点击了 {{ count }} 次</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('Hello Vue 3!')
const count = ref(0)
</script>
```

### 步骤 5：启动开发服务器

```bash
npm run dev
```

Vite 会启动一个本地开发服务器，访问提示的地址即可看到应用。

### 步骤 6：构建生产版本

```bash
npm run build
```

构建产物会输出到 `dist/` 目录，可以部署到任何静态服务器。

---

## 8. npm 配置与技巧

### 镜像源配置

国内访问 npm 官方源较慢，可配置淘宝镜像：

```bash
# 设置淘宝镜像
npm config set registry https://registry.npmmirror.com

# 恢复官方源
npm config set registry https://registry.npmjs.org

# 查看当前源
npm config get registry
```

### 运行参数传递

```bash
# 向脚本传递参数
npm run dev -- --port 3000

# 直接执行二进制文件（不需要 npx）
npm exec vite -- --version
```

### npx 的使用

`npx` 可以临时安装并执行包：

```bash
# 临时运行 create-vite 脚手架
npx create-vite my-app

# 不安装直接运行
npx eslint src/
```

### workspace 脚本

```bash
# 在所有子包中运行脚本
npm run build --workspaces

# 在指定子包中运行
npm run build -w packages/core
```

---

## 9. 总结

| 概念 | 要点 |
|------|------|
| **npm** | Node.js 包管理器，管理依赖和脚本 |
| **package.json** | 项目配置核心，定义依赖和命令 |
| **dependencies** | 生产环境必须的依赖 |
| **devDependencies** | 开发环境使用的工具 |
| **SemVer** | 语义化版本号规范（MAJOR.MINOR.PATCH） |
| **package-lock.json** | 锁定精确版本，保证一致性 |
| **scripts** | 自定义命令，统一项目操作 |

掌握 npm 是前端工程化的第一步。下一章我们将深入学习 Vite 构建工具。
