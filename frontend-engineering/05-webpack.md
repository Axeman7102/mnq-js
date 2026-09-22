# 第五章：构建工具 Webpack

## 5.1 什么是 Webpack

Webpack 是一个现代 JavaScript 应用程序的**静态模块打包工具**。当 Webpack 处理应用程序时，它会从一个或多个入口点构建一个依赖图，将项目中使用的每一个模块打包成一个或多个 bundle。

核心能力：

- **模块化**：支持 ES Module、CommonJS、AMD 等多种模块规范
- **代码转换**：通过 Loader 将 TypeScript、Sass 等转译为浏览器可运行代码
- **代码分割**：按需加载，优化首屏加载速度
- **资源管理**：图片、字体、CSS 等均可作为模块处理
- **热模块替换（HMR）**：开发时实时更新，无需刷新页面

```
源代码 → Entry → [Loaders 转换] → [Plugins 优化] → Output(bundle.js)
```

---

## 5.2 四个核心概念

### 5.2.1 Entry（入口）

Entry 指示 Webpack 应该使用哪个模块作为构建依赖图的起点。

```js
// 单入口
module.exports = {
  entry: './src/main.js'
}

// 多入口
module.exports = {
  entry: {
    app: './src/app.js',
    admin: './src/admin.js'
  }
}
```

### 5.2.2 Output（输出）

Output 告诉 Webpack 在哪里输出构建后的 bundle，以及如何命名。

```js
const path = require('path')

module.exports = {
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true  // 每次构建前清理 dist 目录
  }
}
```

常用占位符：

| 占位符 | 说明 |
|--------|------|
| `[name]` | chunk 名称 |
| `[hash]` | 构建哈希 |
| `[contenthash]` | 文件内容哈希 |
| `[chunkhash]` | chunk 内容哈希 |

### 5.2.3 Loader（加载器）

Loader 让 Webpack 能够处理非 JavaScript 文件。Webpack 本身只能理解 JavaScript 和 JSON，Loader 将所有类型的文件转换为有效的模块。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset/resource'
      }
    ]
  }
}
```

Loader 特点：

- 支持链式调用，从右到左执行
- 可以是同步或异步函数
- 输入是源文件内容，输出是转换后的结果

### 5.2.4 Plugin（插件）

Plugin 用于执行更广泛的任务，如打包优化、资源管理、环境变量注入等。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'My App'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ]
}
```

---

## 5.3 完整配置示例

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  mode: isDev ? 'development' : 'production',

  entry: './src/main.js',

  output: {
    filename: 'js/[name].[contenthash:8].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/'
  },

  devServer: {
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.s[ac]ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: { maxSize: 8 * 1024 }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:8][ext]'
        }
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      minify: !isDev
    }),
    ...(isDev ? [] : [new MiniCssExtractPlugin()])
  ]
}
```

---

## 5.4 常用 Loader

| Loader | 用途 | 安装 |
|--------|------|------|
| `babel-loader` | JS/JSX 转译 | `npm i -D babel-loader @babel/core @babel/preset-env` |
| `css-loader` | 解析 CSS 模块引入 | `npm i -D css-loader` |
| `style-loader` | 将 CSS 注入 DOM | `npm i -D style-loader` |
| `sass-loader` | 编译 Sass/SCSS | `npm i -D sass-loader sass` |
| `less-loader` | 编译 Less | `npm i -D less-loader less` |
| `postcss-loader` | CSS 后处理（自动前缀等） | `npm i -D postcss-loader postcss` |
| `ts-loader` | 编译 TypeScript | `npm i -D ts-loader typescript` |
| `file-loader` | 文件复制到输出目录 | 内置 asset/resource |
| `url-loader` | 小文件转 base64 | 内置 asset/inline |
| `eslint-loader` | 代码检查 | 用 ESLintWebpackPlugin 替代 |

---

## 5.5 常用 Plugin

| Plugin | 用途 |
|--------|------|
| `HtmlWebpackPlugin` | 自动生成 HTML 文件并注入 bundle |
| `CleanWebpackPlugin` | 构建前清理 dist 目录 |
| `MiniCssExtractPlugin` | 提取 CSS 为独立文件 |
| `DefinePlugin` | 定义全局常量（如环境变量） |
| `CopyWebpackPlugin` | 复制静态资源到 dist |
| `CompressionWebpackPlugin` | 生成 gzip 压缩文件 |
| `BundleAnalyzerPlugin` | 可视化分析 bundle 大小 |

```js
// 环境变量注入
const webpack = require('webpack')

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify('https://api.example.com')
    })
  ]
}
```

---

## 5.6 Vite vs Webpack

| 对比维度 | Webpack | Vite |
|----------|---------|------|
| **开发启动速度** | 需要打包整个依赖图，项目大时较慢 | 基于 ESM 按需加载，冷启动极快 |
| **热更新（HMR）** | 重新编译受影响的模块 | 仅更新变动文件，毫秒级 |
| **生产构建** | 使用自身打包能力 | 使用 Rollup 打包 |
| **配置复杂度** | 需要配置 Loader、Plugin | 开箱即用，配置极少 |
| **生态成熟度** | 非常成熟，插件丰富 | 快速成长，插件兼容 Rollup |
| **底层原理** | Bundle-based | ESM-based |
| **TypeScript** | 需要 ts-loader 或 babel | 原生支持 |
| **CSS 处理** | 需要多个 Loader 组合 | 内置 CSS/PostCSS 支持 |
| **代码分割** | 手动配置或 dynamic import | 自动基于路由分割 |
| **适用场景** | 复杂企业项目、需要高度定制 | 中小型项目、快速原型开发 |

---

## 5.7 选择建议

**选择 Webpack 的场景：**

- 项目需要高度定制化的构建配置
- 使用非 ESM 的旧项目或库
- 需要成熟的插件生态支持复杂需求
- 微前端等需要精细化控制的架构
- 团队对 Webpack 已有丰富经验

**选择 Vite 的场景：**

- 新项目优先考虑，开发体验显著提升
- Vue3 / React 等现代框架项目
- 对构建速度有较高要求
- 不需要复杂的自定义 Loader/Plugin
- 中小型项目或个人项目

**迁移建议：** 已有 Webpack 项目不必急于迁移。Vite 提供了 `@vitejs/plugin-legacy` 兼容方案，新模块可用 Vite 接入，逐步替换。

---

## 5.8 小结

- Webpack 是以模块为核心的静态打包工具，通过 Entry → Loader → Plugin → Output 流程完成构建
- Loader 负责文件转换，Plugin 负责构建优化
- Vite 基于 ESM 的开发服务器显著提升了开发体验
- 选择工具应根据项目规模、团队经验和性能需求综合判断
- 掌握 Webpack 仍有价值，大量存量项目仍在使用

下一章我们将学习 Vue3 核心内容。
