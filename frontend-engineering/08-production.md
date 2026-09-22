# 第八章：生产部署

将开发环境的代码转化为可上线的生产版本，需要关注构建优化、资源压缩、环境配置和部署策略。本章将系统介绍前端项目的生产部署流程。

---

## 8.1 生产构建流程

Vite 在生产环境下使用 Rollup 进行打包，输出高度优化的静态资源。

### 构建命令

```bash
# 标准构建
npm run build

# 构建产物默认输出到 dist/ 目录
```

对应的 `package.json` 脚本：

```json
{
  "scripts": {
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

### 构建产物结构

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js      # 主逻辑（已压缩）
│   ├── index-[hash].css     # 样式（已压缩）
│   ├── vendor-[hash].js     # 第三方库
│   └── logo-[hash].png      # 图片资源
└── favicon.ico
```

### 构建分析

安装分析插件查看包体积：

```bash
npm install -D rollup-plugin-visualizer
```

在 `vite.config.ts` 中配置：

```ts
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    visualizer({
      open: true,
      filename: "stats.html",
      gzipSize: true,
    }),
  ],
});
```

执行 `npm run build` 后自动生成可视化报告。

---

## 8.2 代码分割策略

合理的代码分割可以显著减少首屏加载时间。

### 路由级分割

使用动态 `import()` 实现路由懒加载：

```tsx
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>加载中...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### 组件级分割

对体积较大的组件单独分割：

```tsx
const HeavyChart = lazy(() => import("./components/HeavyChart"));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>查看图表</button>
      {showChart && (
        <Suspense fallback={<Spinner />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}
```

### 手动分包

通过 `rollupOptions` 控制分割策略：

```ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-router": ["react-router-dom"],
          "vendor-ui": ["@radix-ui/react-dialog", "@radix-ui/react-dropdown"],
        },
      },
    },
  },
});
```

---

## 8.3 资源优化

### 图片优化

```bash
npm install -D vite-plugin-imagemin
```

```ts
import viteImagemin from "vite-plugin-imagemin";

export default defineConfig({
  plugins: [
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.8, 0.9] },
      svgo: {
        plugins: [{ name: "removeViewBox" }],
      },
    }),
  ],
});
```

### CSS 优化

Vite 默认开启 CSS 代码压缩：

```ts
export default defineConfig({
  css: {
    minify: true,
    // 提取 CSS 到单独文件
    extract: true,
  },
});
```

### 资源内联阈值

小于 4KB 的资源自动内联为 Base64：

```ts
export default defineConfig({
  build: {
    assetsInlineLimit: 4096,
  },
});
```

### 压缩配置

使用 Gzip 或 Brotli 压缩：

```bash
npm install -D vite-plugin-compression
```

```ts
import compression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    compression({
      algorithm: "gzip",
      threshold: 10240, // 10KB 以上才压缩
    }),
  ],
});
```

---

## 8.4 环境配置

### 环境变量

Vite 通过 `.env` 文件管理环境变量：

```
# .env                # 所有环境通用
VITE_APP_TITLE=My App

# .env.development    # 开发环境
VITE_API_BASE=http://localhost:3000/api

# .env.production     # 生产环境
VITE_API_BASE=https://api.example.com/api

# .env.staging        # 预发布环境
VITE_API_BASE=https://staging-api.example.com/api
```

### 类型安全

为环境变量添加类型定义：

```ts
// src/env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_BASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### 使用环境变量

```ts
const apiBase = import.meta.env.VITE_API_BASE;
const appName = import.meta.env.VITE_APP_TITLE;
```

---

## 8.5 部署方式

### 方式一：静态托管（Netlify / Vercel / Cloudflare Pages）

最简单的部署方式，适合大多数前端项目。

**Netlify 配置**（`netlify.toml`）：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Vercel 配置**（`vercel.json`）：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 方式二：Docker 部署

适合需要容器化或内网部署的场景。

**Dockerfile**：

```dockerfile
# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**：

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

构建并运行：

```bash
docker build -t my-app .
docker run -p 8080:80 my-app
```

### 方式三：CI/CD 自动化

以 GitHub Actions 为例：

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run lint
      - run: npm run test:run
      - run: npm run build

      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v3
        with:
          publish-dir: ./dist
          production-deploy: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 8.6 性能监控

### 构建时性能检查

Vite 内置构建计时：

```bash
vite build --debug
# 输出各阶段耗时和包体积
```

### Lighthouse CI 集成

```bash
npm install -D @lhci/cli
```

配置 `lighthouserc.json`：

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:4173"],
      "startServerCommand": "npm run preview"
    },
    "assert": {
      "assertions": {
        "first-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

在 CI 中运行：

```bash
npx lhci autorun
```

### 运行时性能监控

使用 Web Vitals 采集用户真实性能数据：

```bash
npm install web-vitals
```

```ts
import { onCLS, onFID, onLCP } from "web-vitals";

function reportToAnalytics(metric: any) {
  console.log(`${metric.name}: ${metric.value}`);
  // 上报到监控平台
  // fetch("/api/metrics", { method: "POST", body: JSON.stringify(metric) });
}

onCLS(reportToAnalytics);
onFID(reportToAnalytics);
onLCP(reportToAnalytics);
```

---

## 8.7 部署检查清单

上线前确认以下事项：

- [ ] 生产构建成功，无报错
- [ ] ESLint 检查通过
- [ ] 单元测试全部通过
- [ ] 代码分割生效，首屏体积合理
- [ ] 环境变量配置正确
- [ ] 路由配置了 fallback（SPA 必需）
- [ ] 静态资源设置了缓存策略
- [ ] Gzip/Brotli 压缩已启用
- [ ] HTTPS 已配置
- [ ] 错误监控已接入

---

## 本章小结

| 阶段 | 关键动作 | 工具 |
|------|----------|------|
| 构建优化 | 代码分割、Tree Shaking | Vite / Rollup |
| 资源优化 | 图片压缩、CSS 提取、Gzip | vite-plugin-imagemin、vite-plugin-compression |
| 环境管理 | 多环境配置、类型安全 | `.env` 文件、`ImportMetaEnv` |
| 部署上线 | 静态托管 / Docker / CI/CD | Netlify、Vercel、GitHub Actions |
| 性能监控 | Web Vitals、Lighthouse | web-vitals、@lhci/cli |

生产部署不仅是把代码放到线上，更需要建立从构建到监控的完整闭环。合理的优化策略可以让应用加载更快、运行更稳定。
