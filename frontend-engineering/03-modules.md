# 第三章：JavaScript 模块化

## 3.1 为什么需要模块化

早期的 JavaScript 代码全部写在 `<script>` 标签中，存在严重问题：

- **全局污染**：所有变量和函数都挂在全局作用域，容易命名冲突
- **依赖混乱**：`<script>` 标签必须按顺序书写，维护困难
- **代码复用难**：无法按功能拆分文件，复用只能复制粘贴
- **协作困难**：多人开发时文件职责不清

模块化就是为了解决这些问题——将代码拆分成独立、可复用的单元，每个单元有自己的作用域和依赖关系。

## 3.2 CommonJS (CJS)

CommonJS 是 Node.js 的模块规范，使用 `require` 导入、`module.exports` 导出。

### 导出

```js
// math.js
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

module.exports = { add, multiply };
```

### 导入

```js
// app.js
const { add, multiply } = require('./math');

console.log(add(1, 2));       // 3
console.log(multiply(3, 4));  // 12
```

### 特点

- **同步加载**：`require` 是同步执行的，适合服务端
- **运行时加载**：在代码执行时才解析依赖
- **值的拷贝**：导出的是值的副本，原始值变化后导入方不会更新

```js
// counter.js
let count = 0;

function increment() {
  count++;
}

function getCount() {
  return count;
}

module.exports = { increment, getCount };

// main.js
const counter = require('./counter');

counter.increment();
console.log(counter.getCount()); // 1
// 注意：如果直接修改 count，外部不会感知
```

### 模块缓存

Node.js 会缓存已加载的模块，重复 `require` 同一模块返回缓存结果：

```js
// Node.js 会缓存模块，避免重复执行
const a = require('./module');
const b = require('./module'); // 返回同一个缓存对象
```

## 3.3 ESM (ES Modules)

ESM 是 JavaScript 语言层面的官方模块规范，ES2015 引入，浏览器和 Node.js 均支持。

### 导出

```js
// utils.js
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

// 默认导出
export default function greet(name) {
  return `Hello, ${name}`;
}
```

### 导入

```js
// app.js
import greet, { add, multiply } from './utils.js';

console.log(add(1, 2));          // 3
console.log(multiply(3, 4));     // 12
console.log(greet('World'));     // "Hello, World"
```

### 命名导出与默认导出

```js
// 命名导出：可以有多个
export const PI = 3.14159;
export function square(x) { return x * x; }

// 默认导出：每个模块只能有一个
export default class Calculator {
  add(a, b) { return a + b; }
}
```

```js
// 导入时可以重命名
import { PI as pi } from './math.js';
import Calc from './Calculator.js';
```

### 重新导出

```js
// index.js — 统一导出入口
export { add, multiply } from './math.js';
export { default as Calculator } from './Calculator.js';
```

### 特点

- **静态分析**：`import/export` 是声明式的，编译时确定依赖关系
- **异步加载**：浏览器中原生支持异步加载模块
- **活绑定**：导出的是值的引用，原始值变化后导入方会更新
- **Tree Shaking 友好**：静态分析使打包工具能移除未使用代码

## 3.4 ESM vs CJS 对比

| 特性 | CommonJS | ESM |
|------|----------|-----|
| 语法 | `require()` / `module.exports` | `import` / `export` |
| 加载时机 | 运行时同步加载 | 编译时静态解析 |
| 导出内容 | 值的拷贝 | 值的活绑定（引用） |
| 加载方式 | 动态，可在条件语句中使用 | 静态，必须在顶层作用域 |
| 浏览器支持 | 需打包工具转换 | 原生支持 |
| Node.js 支持 | 原生支持 | `.mjs` 文件或 `package.json` 中设置 `"type": "module"` |
| 循环依赖处理 | 可能出现不一致 | 通过活绑定正确处理 |
| Tree Shaking | 不支持 | 支持 |

### 在 Node.js 中使用 ESM

```json
// package.json
{
  "type": "module"
}
```

或者将文件后缀改为 `.mjs`：

```js
// app.mjs
import { add } from './math.mjs';
```

## 3.5 Tree Shaking

Tree Shaking 是一种死代码消除（Dead Code Elimination）技术，利用 ESM 的静态分析特性，移除未被使用的导出代码。

### 工作原理

```js
// math.js
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
export function multiply(a, b) { return a * b; }

// app.js — 只导入了 add
import { add } from './math.js';

console.log(add(1, 2));
```

打包后，`subtract` 和 `multiply` 会被自动移除，最终 bundle 中不包含这两段代码。

### 使用条件

- 必须使用 ESM 的 `import/export` 语法
- 导入时使用**命名导入**（`import { add } from`），而非整体导入（`import * as`）
- `package.json` 中配置 `"sideEffects": false`

```json
{
  "sideEffects": false
}
```

如果某些文件有副作用（如 polyfill），需要显式声明：

```json
{
  "sideEffects": ["*.css", "./src/polyfill.js"]
}
```

### 注意事项

- CJS 无法进行 Tree Shaking，因为 `require()` 是动态的
- 使用 `import *` 整体导入可能导致 Tree Shaking 失效
- 副作用代码（如修改全局变量）需要特殊处理

## 3.6 Dynamic import()

动态 `import()` 允许在运行时按需加载模块，适用于路由懒加载、条件加载等场景。

### 基本用法

```js
// 返回一个 Promise
import('./math.js').then((module) => {
  console.log(module.add(1, 2));
});
```

### async/await 写法

```js
async function loadModule() {
  const { add, multiply } = await import('./math.js');
  console.log(add(1, 2));
}
```

### 路由懒加载

```js
// Vue Router 示例
const routes = [
  {
    path: '/dashboard',
    component: () => import('./views/Dashboard.vue'),
  },
  {
    path: '/settings',
    component: () => import('./views/Settings.vue'),
  },
];
```

### React 懒加载

```jsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 动态导入与条件加载

```js
async function loadFeature() {
  if (process.env.NODE_ENV === 'development') {
    const devTools = await import('./devtools.js');
    devTools.init();
  }
}
```

### 预加载

```js
// 浏览器会提前加载模块，但不执行
import(/* webpackPrefetch: true */ './Dashboard.vue');
```

## 3.7 模块化最佳实践

1. **优先使用 ESM**：新项目统一使用 `import/export` 语法
2. **单一职责**：每个模块只做一件事
3. **统一导出入口**：使用 `index.js` 汇总导出，简化导入路径
4. **避免循环依赖**：重构代码消除模块间的循环引用
5. **按功能组织**：按功能而非文件类型划分目录结构

```
src/
├── features/
│   ├── auth/
│   │   ├── login.js
│   │   ├── register.js
│   │   └── index.js      // 统一导出
│   └── dashboard/
│       ├── chart.js
│       ├── stats.js
│       └── index.js
├── shared/
│   ├── utils.js
│   └── constants.js
└── app.js
```

## 3.8 本章小结

| 概念 | 核心要点 |
|------|---------|
| CommonJS | `require/module.exports`，运行时同步加载，值拷贝 |
| ESM | `import/export`，编译时静态解析，活绑定 |
| Tree Shaking | 利用 ESM 静态分析消除死代码 |
| Dynamic import() | 运行时按需加载，支持懒加载和代码分割 |

模块化是前端工程化的基础。掌握 CJS 和 ESM 的区别，理解 Tree Shaking 的原理，能够帮助你写出更高效、可维护的代码。
