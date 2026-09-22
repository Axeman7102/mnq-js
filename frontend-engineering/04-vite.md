# 第四章：构建工具 Vite

## 4.1 什么是 Vite

Vite（法语"快"的意思）是尤雨溪开发的下一代前端构建工具，基于 ESBuild 和 Rollup 打包。

### 为什么比传统工具快

传统构建工具（如 Webpack）的工作流程：

1. 启动时遍历所有模块，构建完整的依赖图
2. 对所有文件进行编译、转换、打包
3. 项目越大，启动越慢

Vite 的工作流程：

1. **开发环境**：不打包，直接利用浏览器原生 ESM 支持
2. 按需编译——只有浏览器请求的文件才会被编译
3. 使用 **ESBuild**（Go 编写，比 JS 工具快 10-100 倍）进行预构建
4. 使用 **esbuild** 进行依赖预构建，**Rollup** 进行生产打包

核心优势：

| 对比项 | Webpack | Vite |
|--------|---------|------|
| 启动速度 | 需要完整打包，秒级到分钟级 | 按需编译，毫秒级 |
| 热更新速度 | 需要重新编译受影响模块链 | 精准更新，毫秒级 |
| 配置复杂度 | 配置项繁多 | 开箱即用，配置简洁 |
| 生态 | 最成熟 | 快速增长 |

## 4.2 创建 Vue3 + Vite 项目

### 方式一：使用 create-vue（推荐）

```bash
# npm
npm create vue@latest

# pnpm
pnpm create vue@latest
```

交互式选择：

```bash
✔ Project name: … my-vue-app
✔ Add TypeScript? … No / Yes
✔ Add JSX Support? … No / Yes
✔ Add Vue Router? … No / Yes
✔ Add Pinia? … No / Yes
✔ Add Vitest? … No / Yes
✔ Add ESLint? … No / Yes
✔ Add Prettier? … No / Yes
```

### 方式二：手动搭建

```bash
mkdir my-vue-app && cd my-vue-app
npm init -y
npm install vue
npm install -D vite @vitejs/plugin-vue
```

创建项目文件：

```bash
mkdir src public
touch index.html
touch src/main.js src/App.vue
touch vite.config.js
```

`index.html`（Vite 的入口文件在项目根目录）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Vue App</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

`vite.config.js`：

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
});
```

`src/main.js`：

```js
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
```

`src/App.vue`：

```vue
<template>
  <h1>Hello Vite + Vue3</h1>
</template>

<script setup>
</script>
```

`package.json` 添加脚本：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

启动开发服务器：

```bash
npm run dev
```

## 4.3 项目结构

```
my-vue-app/
├── index.html              # 入口 HTML（Vite 特有，位于根目录）
├── package.json
├── vite.config.js           # Vite 配置文件
├── public/                  # 静态资源，不会被 Vite 处理
│   └── favicon.ico
├── src/
│   ├── main.js              # 应用入口
│   ├── App.vue              # 根组件
│   ├── assets/              # 需要被构建处理的资源（图片、字体等）
│   ├── components/          # 公共组件
│   ├── views/               # 页面组件
│   ├── router/              # 路由配置
│   ├── stores/              # Pinia 状态管理
│   ├── utils/               # 工具函数
│   └── styles/              # 全局样式
└── .env                     # 环境变量文件
```

### 与 Webpack 项目结构的区别

- Vite 入口 `index.html` 在**根目录**，而非 `public/` 目录
- `index.html` 中通过 `<script type="module">` 直接引用源码
- `public/` 目录下的资源直接复制到构建输出，不经过构建处理

## 4.4 vite.config.js 配置详解

### 基础配置结构

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [],
  resolve: {},
  server: {},
  build: {},
  css: {},
});
```

### 开发服务器配置

```js
export default defineConfig({
  server: {
    port: 3000,                    // 端口号
    open: true,                    // 自动打开浏览器
    host: '0.0.0.0',              // 监听所有地址
    https: false,                  // 是否启用 HTTPS
    proxy: {},                     // 代理配置（详见 4.8）
    cors: true,                    // 启用 CORS
  },
});
```

### 构建配置

```js
export default defineConfig({
  build: {
    outDir: 'dist',               // 输出目录
    sourcemap: false,             // 是否生成 source map
    minify: 'esbuild',            // 压缩方式：esbuild（默认）或 terser
    chunkSizeWarningLimit: 500,   // chunk 大小警告阈值（KB）
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
        },
      },
    },
  },
});
```

## 4.5 HMR（热模块替换）

HMR（Hot Module Replacement）是指在不刷新整个页面的情况下，替换、添加或删除模块，同时保持应用状态。

### 工作原理

1. 文件修改后，Vite 通过 WebSocket 向客户端发送更新通知
2. 客户端只请求被修改的模块
3. Vite 编译该模块并返回新的模块代码
4. 客户端用新模块替换旧模块，执行更新逻辑

### 为什么 Vite 的 HMR 更快

- Vite 的 HMR 是在**当前模块边界**上进行的
- 不需要重新构建整个模块依赖链
- 对于 Vue 组件，只替换组件模板，保留组件状态

```js
// 热更新 API
if (import.meta.hot) {
  import.meta.hot.accept('./module.js', (newModule) => {
    // 处理模块更新
  });
}
```

### Vue 组件的 HMR

Vue 单文件组件天然支持 HMR，修改 `<template>`、`<script>` 或 `<style>` 都会自动热更新，且保留组件状态。

## 4.6 环境变量

Vite 内置支持 `.env` 文件加载环境变量。

### 文件约定

| 文件 | 说明 |
|------|------|
| `.env` | 所有环境都会加载 |
| `.env.local` | 所有环境都会加载，被 git 忽略 |
| `.env.[mode]` | 只在指定模式下加载 |
| `.env.[mode].local` | 只在指定模式下加载，被 git 忽略 |

优先级：`.env.[mode].local` > `.env.[mode]` > `.env.local` > `.env`

### 使用规则

环境变量必须以 `VITE_` 开头才能在客户端代码中访问：

```bash
# .env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App

# 以下变量不会暴露给客户端
SECRET_KEY=xxx
DB_PASSWORD=xxx
```

```js
// 在代码中访问
console.log(import.meta.env.VITE_API_URL);
console.log(import.meta.env.VITE_APP_TITLE);
console.log(import.meta.env.MODE);      // 'development' 或 'production'
console.log(import.meta.env.PROD);      // true 或 false
console.log(import.meta.env.DEV);       // true 或 false
```

### 多环境配置

```bash
# .env.development
VITE_API_URL=http://localhost:3000/api

# .env.production
VITE_API_URL=https://api.example.com/api
```

运行不同环境：

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 指定模式构建
vite build --mode staging
```

## 4.7 路径别名

路径别名可以避免深层嵌套时的 `../../` 相对路径。

### 配置

```js
// vite.config.js
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },
});
```

### 使用

```vue
<script setup>
// 之前
import Button from '../../../components/Button.vue';
import { formatDate } from '../../../utils/date';

// 使用别名后
import Button from '@components/Button.vue';
import { formatDate } from '@utils/date';
</script>

<style>
/* CSS 中也可以使用 */
.logo {
  background-image: url('@assets/logo.png');
}
</style>
```

### TypeScript 支持

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

## 4.8 Proxy 代理配置

开发环境下的跨域问题通过 Vite 的代理解决。

### 基本代理

```js
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      // 代理 /api 开头的请求到后端服务器
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

效果：
- 请求 `/api/users` → 转发到 `http://localhost:8080/users`
- 请求 `/api/posts` → 转发到 `http://localhost:8080/posts`

### WebSocket 代理

```js
export default defineConfig({
  server: {
    proxy: {
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
      },
    },
  },
});
```

### 正则匹配代理

```js
export default defineConfig({
  server: {
    proxy: {
      // 匹配 /api 和 /rest 开头的请求
      '^(\\/api|\\/rest)': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
```

### 多代理配置

```js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://api-server:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/auth': {
        target: 'http://auth-server:4000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://ws-server:5000',
        ws: true,
      },
    },
  },
});
```

### 代理选项

| 选项 | 说明 |
|------|------|
| `target` | 目标服务器地址 |
| `changeOrigin` | 修改请求头中的 `Host` 为目标地址 |
| `rewrite` | 重写请求路径 |
| `ws` | 是否代理 WebSocket |
| `secure` | 是否验证 SSL 证书 |
| `headers` | 自定义请求头 |
| `configure` | 自定义代理行为 |

```js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        secure: false,
        headers: {
          'X-Custom-Header': 'yes',
        },
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('proxy request:', req.url);
          });
        },
      },
    },
  },
});
```

## 4.9 常用插件

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  plugins: [
    vue(),
    // 自动导入 Vue API（ref, computed 等）
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-imports.d.ts',
    }),
    // 自动注册组件
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts',
    }),
  ],
});
```

## 4.10 本章小结

| 概念 | 核心要点 |
|------|---------|
| Vite | 基于 ESM 的快速构建工具，开发时不打包 |
| 项目入口 | `index.html` 在根目录，`<script type="module">` 引用源码 |
| HMR | 毫秒级热更新，只替换修改的模块 |
| 环境变量 | 以 `VITE_` 开头，通过 `.env` 文件管理 |
| 路径别名 | `@` 指向 `src`，避免深层相对路径 |
| Proxy | 开发环境解决跨域，转发请求到后端服务器 |

Vite 以其极致的开发体验，已成为 Vue3 生态的默认构建工具。掌握其配置和原理，能显著提升开发效率。
