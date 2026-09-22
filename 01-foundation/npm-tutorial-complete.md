# NPM基础回顾

## 什么是NPM？

NPM（Node Package Manager）是JavaScript的包管理工具，它解决了前端开发中的三大痛点：

### 核心价值

1. **代码复用** - 不用重复造轮子，直接使用社区成熟的解决方案
2. **依赖管理** - 自动处理库之间的复杂依赖关系
3. **版本控制** - 确保团队使用相同版本的库，避免"在我电脑上能跑"的问题

### NPM生态

- **npmjs.com** - 全球最大的JavaScript包仓库，拥有数百万个开源包
- **下载量** - 每周数十亿次下载
- **覆盖面** - 从前端框架到后端工具，几乎涵盖所有场景

---

## package.json 详解

`package.json` 是每个NPM项目的"身份证"，包含了项目的所有元信息。

### 基础结构

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "我的第一个NPM项目",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "vue": "^3.5.0"
  },
  "devDependencies": {
    "vite": "^7.0.0",
    "@vitejs/plugin-vue": "^6.0.0"
  },
  "keywords": ["vue", "vite"],
  "author": "Your Name",
  "license": "MIT"
}
```

### 字段说明

| 字段 | 作用 | 示例 |
|------|------|------|
| `name` | 项目名称（唯一标识） | `"my-project"` |
| `version` | 语义化版本号 | `"1.0.0"` |
| `type` | 模块系统类型 | `"module"` = ES Modules |
| `scripts` | 可执行的脚本命令 | `"dev": "vite"` |
| `dependencies` | 生产环境依赖 | `"vue": "^3.5.0"` |
| `devDependencies` | 开发环境依赖 | `"vite": "^7.0.0"` |

---

## 依赖 vs 开发依赖

### 生产依赖（dependencies）

**用途：** 运行时必需的包，会打包到最终产物中

**示例：**
```json
{
  "dependencies": {
    "vue": "^3.5.0",
    "axios": "^1.6.0",
    "lodash": "^4.17.0"
  }
}
```

**特点：**
- 用户访问网站时需要这些包
- 缺少会导致运行时错误
- 需要考虑包的大小对性能的影响

### 开发依赖（devDependencies）

**用途：** 只在开发时使用，不会打包到最终产物

**示例：**
```json
{
  "devDependencies": {
    "vite": "^7.0.0",
    "eslint": "^8.50.0",
    "prettier": "^3.0.0",
    "vitest": "^3.0.0"
  }
}
```

**特点：**
- 开发时使用（编译、测试、代码检查）
- 部署时不需要
- 不影响最终产物大小

### 如何选择？

```
这个包在浏览器/Node.js运行时需要吗？
├── 是 → dependencies
└── 否 → devDependencies
```

**常见分类：**

| 类型 | dependencies | devDependencies |
|------|--------------|-----------------|
| 框架 | vue, react, angular | - |
| UI库 | element-plus, antd | - |
| 构建工具 | - | vite, webpack |
| 代码检查 | - | eslint, prettier |
| 测试框架 | - | vitest, jest |
| TypeScript | - | typescript |

---

## 常用NPM命令速查

### 项目初始化

```bash
# 交互式初始化（会问一系列问题）
npm init

# 快速初始化（使用默认值）
npm init -y

# 初始化ES Module项目
npm init -y && npm pkg set type="module"
```

### 依赖管理

```bash
# 安装生产依赖
npm install vue
npm install vue@3.5.0          # 指定版本
npm install vue@^3.5.0         # 3.5.x版本范围

# 安装开发依赖
npm install -D vite
npm install --save-dev vite

# 安装全局包
npm install -g pnpm

# 更新依赖
npm update                     # 更新所有依赖
npm update vue                 # 更新指定包

# 卸载依赖
npm uninstall vue

# 查看过期依赖
npm outdated
```

### 脚本运行

```bash
# 运行scripts中的命令
npm run dev
npm run build
npm run test

# 直接执行（不需要在scripts中定义）
npx vite
npx create-vite my-app

# 查看所有可用脚本
npm run
```

### 版本管理

```bash
# 查看当前版本
npm version

# 更新版本
npm version patch              # 1.0.0 → 1.0.1（修订号）
npm version minor              # 1.0.0 → 1.1.0（次版本）
npm version major              # 1.0.0 → 2.0.0（主版本）
```

### 其他常用命令

```bash
# 查看包信息
npm view vue versions          # 查看所有版本
npm view vue version           # 查看最新版本

# 检查安全漏洞
npm audit
npm audit fix

# 清除缓存
npm cache clean --force

# 查看全局包
npm list -g --depth=0
```

---

## 语义化版本（SemVer）

### 版本格式

```
主版本.次版本.修订号
Major.Minor.Patch
例如：3.5.2
```

### 版本号递增规则

| 类型 | 何时递增 | 示例 |
|------|----------|------|
| **主版本（Major）** | 不兼容的API变更 | 2.0.0 → 3.0.0 |
| **次版本（Minor）** | 向下兼容的功能新增 | 3.5.0 → 3.6.0 |
| **修订号（Patch）** | 向下兼容的问题修正 | 3.5.2 → 3.5.3 |

### 版本前缀

```json
{
  "dependencies": {
    "vue": "3.5.0",        // 精确版本：只安装3.5.0
    "vue": "^3.5.0",       // 插入号：安装3.x.x（保持主版本相同）
    "vue": "~3.5.0",       // 波浪号：安装3.5.x（保持主版本和次版本相同）
    "vue": ">=3.5.0",      // 大于等于
    "vue": "3.5.x",        // 通配符：匹配3.5.x
    "vue": "latest"        // 最新版本
  }
}
```

### 前缀对比

| 前缀 | 含义 | 允许范围 | 推荐场景 |
|------|------|----------|----------|
| `^` | 兼容版本 | 3.5.0 → 3.x.x | 大多数情况（默认） |
| `~` | 保守更新 | 3.5.0 → 3.5.x | 需要稳定时 |
| 无 | 精确锁定 | 仅3.5.0 | 需要精确控制时 |

### 锁文件

```bash
# package-lock.json
# 记录确切的依赖版本，确保团队一致性

# 提交到git
git add package-lock.json

# 安装时使用锁文件
npm ci                    # 严格按锁文件安装
npm install              # 安装并更新锁文件
```

---

## 实战：创建你的第一个NPM项目

### 步骤1：创建项目

```bash
# 创建项目目录
mkdir my-npm-project
cd my-npm-project

# 初始化package.json
npm init -y
```

### 步骤2：安装依赖

```bash
# 安装lodash作为生产依赖
npm install lodash

# 安装vitest作为开发依赖
npm install -D vitest
```

### 步骤3：添加脚本

```bash
# 添加test脚本
npm pkg set scripts.test="vitest run"

# 或者手动编辑package.json
```

### 步骤4：创建文件

```javascript
// src/utils.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
```

```javascript
// src/utils.test.js
import { describe, it, expect } from 'vitest';
import { add, subtract } from './utils.js';

describe('数学函数', () => {
  it('add函数应该正确相加', () => {
    expect(add(1, 2)).toBe(3);
  });

  it('subtract函数应该正确相减', () => {
    expect(subtract(5, 3)).toBe(2);
  });
});
```

### 步骤5：运行测试

```bash
npm run test

# 预期输出：
# ✓ src/utils.test.js (2 tests) 5ms
#   ✓ 数学函数 > add函数应该正确相加
#   ✓ 数学函数 > subtract函数应该正确相减
# 
#  Test Files  1 passed (1)
#       Tests  2 passed (2)
```

---

## 小结

✅ NPM是JavaScript的包管理工具
✅ `package.json` 是项目的配置中心
✅ 区分 `dependencies` 和 `devDependencies`
✅ 使用语义化版本管理依赖
✅ `package-lock.json` 确保团队一致性
# 核心语法复习

## ES Modules（现代标准）

ES Modules（ESM）是JavaScript的官方模块系统，从ES6（ES2015）开始引入。

### 基础语法

```javascript
// ========== 导出 ==========

// 命名导出 - utils.js
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// 默认导出 - Api类
export default class Api {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  async get(path) {
    const response = await fetch(`${this.baseURL}${path}`);
    return response.json();
  }
}

// ========== 导入 ==========

// 导入默认导出
import Api from './utils.js';

// 导入命名导出
import { formatDate, capitalize } from './utils.js';

// 导入并重命名
import Api as MyApi from './utils.js';
import { formatDate as format } from './utils.js';

// 导入全部
import * as Utils from './utils.js';
console.log(Utils.formatDate(new Date()));
console.log(Utils.capitalize('hello'));

// 只导入副作用（不导入具体值）
import './side-effects.js';
```

### ESM特点

| 特点 | 说明 |
|------|------|
| 静态分析 | 编译时确定导入导出，支持Tree Shaking |
| 浏览器原生支持 | `<script type="module">` |
| 严格模式 | 默认开启，无需`"use strict"` |
| 异步加载 | 支持动态`import()` |

### Tree Shaking

```javascript
// 只导入需要的函数，未使用的不会打包
import { formatDate } from './utils.js';

// 以下代码不会被包含在最终产物中
// export const capitalize = (str) => { ... }
```

---

## CommonJS（Node.js传统）

CommonJS是Node.js的默认模块系统，在Node.js早期版本中广泛使用。

### 基础语法

```javascript
// ========== 导出 ==========

// utils.js
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// 导出方式1：逐个导出
module.exports.formatDate = formatDate;
module.exports.capitalize = capitalize;

// 导出方式2：整体导出
module.exports = {
  formatDate,
  capitalize
};

// 导出方式3：直接赋值
exports.formatDate = formatDate;

// ========== 导入 ==========

// 方式1：整体导入
const Utils = require('./utils.js');
Utils.formatDate(new Date());

// 方式2：解构导入
const { formatDate, capitalize } = require('./utils.js');

// 方式3：重命名导入
const { formatDate: format } = require('./utils.js');
```

### CJS特点

| 特点 | 说明 |
|------|------|
| 动态加载 | 运行时解析，支持条件导入 |
| Node.js默认 | Node.js原生支持 |
| 同步加载 | require是同步的 |
| 不支持Tree Shaking | 所有导出都会被打包 |

### 动态导入

```javascript
// CommonJS动态导入
const moduleA = require('./module-a');

// 条件导入
if (process.env.NODE_ENV === 'development') {
  const debug = require('./debug');
  debug.enable();
}

// 异步加载（Node.js）
async function loadModule() {
  const { functionA } = await import('./module-a');
}
```

---

## ESM vs CJS 对比

| 特性 | ESM | CJS |
|------|-----|-----|
| **语法** | `import/export` | `require/module.exports` |
| **加载方式** | 异步 | 同步 |
| **分析时机** | 编译时（静态） | 运行时（动态） |
| **Tree Shaking** | ✅ 支持 | ❌ 不支持 |
| **浏览器支持** | ✅ 原生支持 | ❌ 需要打包工具 |
| **Node.js支持** | ✅ 支持（.mjs） | ✅ 默认支持（.cjs） |
| **循环依赖** | 处理良好 | 可能有问题 |
| **this顶层值** | `undefined` | 当前模块 |

### 选择建议

```javascript
// ✅ 推荐：新项目使用ESM
import { something } from './module.js';

// ⚠️ 特殊情况：需要兼容老项目时
const something = require('./module.cjs');

// ✅ 混合使用：ESM项目中导入CJS包
import lodash from 'lodash'; // 大多数CJS包都支持
```

---

## ES6+语法速查

### 箭头函数

```javascript
// ========== 基础语法 ==========

// 传统函数
function add(a, b) {
  return a + b;
}

// 箭头函数
const add = (a, b) => a + b;

// 单参数可省略括号
const double = x => x * 2;

// 无参数必须有括号
const greet = () => 'Hello!';

// 多行函数体需要大括号和return
const calculate = (a, b) => {
  const sum = a + b;
  const product = a * b;
  return { sum, product };
};

// ========== 返回对象 ==========

// 错误：会被解析为函数体
const createUser = (name, age) => { name, age }; // 语法错误

// 正确：用括号包裹
const createUser = (name, age) => ({ name, age });

// ========== this绑定 ==========

class Timer {
  constructor() {
    this.seconds = 0;
  }
  
  // 箭头函数没有自己的this，继承外层
  start() {
    this.interval = setInterval(() => {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  }
  
  stop() {
    clearInterval(this.interval);
  }
}
```

### 解构赋值

```javascript
// ========== 对象解构 ==========

const user = {
  name: 'John',
  age: 30,
  address: {
    city: 'Beijing',
    street: 'Main St'
  }
};

// 基础解构
const { name, age } = user;  // name='John', age=30

// 重命名
const { name: userName } = user;  // userName='John'

// 默认值
const { role = 'user' } = user;  // role='user'

// 嵌套解构
const { address: { city } } = user;  // city='Beijing'

// 剩余属性
const { name: n, ...rest } = user;  // rest={age:30, address:{...}}


// ========== 数组解构 ==========

const colors = ['red', 'green', 'blue'];

// 基础解构
const [first, second] = colors;  // first='red', second='green'

// 跳过元素
const [, , third] = colors;  // third='blue'

// 默认值
const [a, b, c, d = 'yellow'] = colors;  // d='yellow'

// 剩余元素
const [primary, ...restColors] = colors;  // restColors=['green', 'blue']

// 交换变量
let x = 1, y = 2;
[x, y] = [y, x];  // x=2, y=1


// ========== 函数参数解构 ==========

function createUser({ name, age, role = 'user' }) {
  return { name, age, role };
}

createUser({ name: 'John', age: 30 });


// ========== 默认参数 ==========

function greet(name = 'World', greeting = 'Hello') {
  return `${greeting}, ${name}!`;
}

greet();              // 'Hello, World!'
greet('John');        // 'Hello, John!'
greet('John', 'Hi');  // 'Hi, John!'
```

### 模板字符串

```javascript
const name = 'World';
const age = 30;

// 基础用法
const greeting = `Hello, ${name}!`;

// 表达式
const message = `${name} is ${age} years old.`;

// 多行
const multiLine = `
  Line 1
  Line 2
  Line 3
`;

// 标签模板
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] ? `<strong>${values[i]}</strong>` : '');
  }, '');
}

const name2 = 'John';
const result = highlight`Hello ${name2}!`; 
// 'Hello <strong>John</strong>!'
```

### 展开运算符

```javascript
// ========== 数组展开 ==========

const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// 合并数组
const merged = [...arr1, ...arr2];  // [1, 2, 3, 4, 5, 6]

// 复制数组
const copy = [...arr1];  // [1, 2, 3]

// 添加元素
const withNew = [0, ...arr1, 4];  // [0, 1, 2, 3, 4]


// ========== 对象展开 ==========

const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };

// 合并对象（后面的覆盖前面的）
const merged = { ...obj1, ...obj2 };  // { a: 1, b: 3, c: 4 }

// 复制对象
const copy = { ...obj1 };  // { a: 1, b: 2 }

// 添加属性
const withNew = { ...obj1, d: 4 };  // { a: 1, b: 2, d: 4 }


// ========== 函数参数展开 ==========

function sum(a, b, c) {
  return a + b + c;
}

const numbers = [1, 2, 3];
sum(...numbers);  // 6

// 剩余参数
function logArgs(...args) {
  console.log(args);
}

logArgs(1, 2, 3);  // [1, 2, 3]
```

### async/await

```javascript
// ========== Promise回顾 ==========

// 创建Promise
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, name: 'John' });
      } else {
        reject(new Error('Invalid ID'));
      }
    }, 1000);
  });
}

// Promise链
fetchUser(1)
  .then(user => fetchPosts(user.id))
  .then(posts => console.log(posts))
  .catch(err => console.error(err))
  .finally(() => console.log('Done'))


// ========== async/await ==========

// async函数总是返回Promise
async function loadUser(id) {
  try {
    const user = await fetchUser(id);
    const posts = await fetchPosts(user.id);
    return { user, posts };
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
}

// 使用
const data = await loadUser(1);
console.log(data);


// ========== 并发执行 ==========

// 顺序执行（慢）
const user = await fetchUser(1);
const posts = await fetchPosts(user.id);
const comments = await fetchComments(posts[0].id);

// 并行执行（快）
const [user2, settings] = await Promise.all([
  fetchUser(1),
  fetchSettings()
]);


// ========== 错误处理 ==========

// 方式1：try/catch
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    return null;
  }
}

// 方式2：包装函数（更优雅）
async function safeFetch(url) {
  try {
    const response = await fetch(url);
    return [null, await response.json()];
  } catch (error) {
    return [error, null];
  }
}

// 使用
const [error, data] = await safeFetch('/api/data');
if (error) {
  console.error(error);
} else {
  console.log(data);
}
```

### 可选链和空值合并

```javascript
// ========== 可选链 ?. ==========

const user = {
  profile: {
    name: 'John',
    address: {
      city: 'Beijing'
    }
  }
};

// 基础用法
const city = user?.profile?.address?.city;  // 'Beijing'

// 安全访问不存在的属性
const zip = user?.profile?.address?.zip;  // undefined（不报错）

// 安全调用方法
const result = user?.getName?.();  // undefined（不报错）

// 安全访问数组
const first = user?.tags?.[0];  // undefined（不报错）


// ========== 空值合并 ?? ==========

// null和undefined才会触发默认值
const name1 = null ?? 'Default';    // 'Default'
const name2 = undefined ?? 'Default';  // 'Default'
const name3 = '' ?? 'Default';      // ''（空字符串不是null/undefined）
const name4 = 0 ?? 'Default';       // 0（0不是null/undefined）
const name5 = false ?? 'Default';   // false（false不是null/undefined）

// 对比 || 运算符
const a = '' || 'Default';   // 'Default'（空字符串是falsy）
const b = 0 || 'Default';    // 'Default'（0是falsy）
const c = '' ?? 'Default';   // ''（空字符串不是null/undefined）
const d = 0 ?? 'Default';    // 0（0不是null/undefined）


// ========== 实际应用 ==========

// 安全访问深层嵌套数据
const userCity = user?.profile?.address?.city ?? 'Unknown';

// API响应处理
const response = await fetch('/api/user');
const data = await response.json();
const userName = data?.user?.name ?? 'Anonymous';
```

---

## 语法选择指南

| 场景 | 推荐语法 | 示例 |
|------|----------|------|
| 简单函数 | 箭头函数 | `const add = (a, b) => a + b` |
| 需要this | 普通函数 | `function method() {}` |
| 对象属性 | 简写 | `{ name, age }` |
| 数组/对象复制 | 展开运算符 | `[...arr]`, `{...obj}` |
| 异步操作 | async/await | `const data = await fetchData()` |
| 可选属性 | 可选链 | `user?.profile?.name` |
| 默认值 | 空值合并 | `value ?? 'default'` |
| 多值返回 | 解构 | `const { a, b } = obj` |

---

## 小结

✅ ESM是现代JavaScript的标准模块系统
✅ CJS是Node.js的传统模块系统，仍在使用
✅ 箭头函数简洁，但没有自己的this
✅ 解构赋值让代码更简洁
✅ async/await让异步代码更易读
✅ 可选链和空值合并简化空值处理
# Vite项目实战

## 什么是Vite？

Vite（法语"快"的意思）是一个现代化的前端构建工具，由Vue.js作者尤雨溪创建。

### 为什么选择Vite？

| 特性 | Vite | 传统工具（Webpack） |
|------|------|---------------------|
| **启动速度** | 秒级 | 分钟级 |
| **热更新** | 毫秒级 | 秒级 |
| **配置复杂度** | 简单 | 复杂 |
| **学习曲线** | 平缓 | 陡峭 |

### Vite的核心优势

1. **极速启动** - 基于ESM，按需编译
2. **即时热更新** - 只更新变化的模块
3. **开箱即用** - 内置TypeScript、CSS Modules等支持
4. **易于扩展** - 丰富的插件生态

---

## 创建Vue3 + Vite项目

### 步骤1：创建项目

```bash
# 使用npm create创建项目
npm create vite@latest my-vue-app -- --template vue

# 进入项目目录
cd my-vue-app
```

**预期输出：**
```
Scaffolding project in C:\Users\...\my-vue-app...
Done.
```

### 步骤2：安装依赖

```bash
npm install
```

**预期输出：**
```
added 15 packages in 3s

15 packages are looking for funding
  run `npm fund` for details
```

### 步骤3：启动开发服务器

```bash
npm run dev
```

**预期输出：**
```
  VITE v7.0.0  ready in 300 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 步骤4：访问项目

在浏览器打开 http://localhost:5173/ ，看到Vue欢迎页面即成功！

---

## 项目结构解析

```
my-vue-app/
├── node_modules/        # 依赖包目录（自动生成，不要手动修改）
├── public/              # 静态资源（不经过构建处理）
│   └── vite.svg         # 网站图标
├── src/                 # 源代码目录（主要工作区）
│   ├── assets/          # 静态资源（经过构建处理）
│   │   └── vue.svg
│   ├── components/      # Vue组件
│   │   └── HelloWorld.vue
│   ├── App.vue          # 根组件
│   ├── main.js          # 入口文件
│   └── style.css        # 全局样式
├── .gitignore           # Git忽略文件
├── index.html           # HTML入口（Vite的入口点）
├── package.json         # 项目配置
├── package-lock.json    # 依赖锁文件
└── vite.config.js       # Vite配置文件
```

### 关键文件详解

#### index.html - 入口文件

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

**注意：** Vite使用`index.html`作为入口点，而不是JavaScript文件！

#### src/main.js - 入口JavaScript

```javascript
import { createApp } from 'vue'  // 导入Vue
import './style.css'              // 导入全局样式
import App from './App.vue'       // 导入根组件

createApp(App).mount('#app')      // 创建Vue实例并挂载
```

#### src/App.vue - 根组件

```vue
<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
</style>
```

#### vite.config.js - Vite配置

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

---

## Vite配置详解

### 基础配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  // 插件配置
  plugins: [vue()],
  
  // 路径别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // 开发服务器配置
  server: {
    port: 3000,           // 端口号
    open: true,           // 自动打开浏览器
    proxy: {              // 代理配置（解决跨域）
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  
  // 构建配置
  build: {
    outDir: 'dist',       // 输出目录
    sourcemap: true,      // 生成source map
    minify: 'terser',     // 压缩方式
  },
})
```

### 路径别名配置

```javascript
// vite.config.js
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
})

// 使用示例
import Button from '@components/Button.vue'
import { formatDate } from '@utils/date'
import logo from '@assets/logo.png'
```

### 代理配置

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      // 简单代理
      '/api': 'http://localhost:8080',
      
      // 详细配置
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      
      // 多个代理
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
      },
    },
  },
})
```

### 环境变量

```bash
# .env（所有环境都会加载）
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App

# .env.local（本地覆盖，不提交到git）
VITE_API_URL=http://localhost:8080

# .env.development（开发环境）
VITE_API_URL=http://localhost:8080

# .env.production（生产环境）
VITE_API_URL=https://api.production.com
```

```javascript
// 使用环境变量
const apiUrl = import.meta.env.VITE_API_URL
const appTitle = import.meta.env.VITE_APP_TITLE

console.log('API URL:', apiUrl)
console.log('App Title:', appTitle)

// 注意：只有VITE_开头的变量才会暴露给客户端代码
```

---

## 热模块替换（HMR）

Vite的热更新是其核心优势之一。

### 什么是HMR？

**HMR（Hot Module Replacement）** - 热模块替换，只更新变化的模块，不刷新整个页面。

### 操作演示

1. 启动开发服务器：`npm run dev`
2. 打开 `src/components/HelloWorld.vue`
3. 修改标题文字，保存文件
4. 观察浏览器：页面立即更新，无需刷新！

### HMR工作原理

```
修改文件 
  ↓
Vite检测到文件变化 
  ↓
只编译变化的模块
  ↓
发送更新到浏览器
  ↓
浏览器替换变化的模块
```

### 对比传统工具

| 工具 | HMR机制 | 速度 |
|------|---------|------|
| Vite | 基于ESM，直接请求修改的文件 | 毫秒级 |
| Webpack | 需要重新打包整个bundle | 秒级 |

### 实际测试

```bash
# 启动开发服务器
npm run dev

# 在另一个终端修改文件
echo '<h1>Hello Vite!</h1>' > src/components/HelloWorld.vue

# 观察浏览器输出 - 立即更新，无需刷新
```

---

## 组件开发实战

### 创建第一个组件

```vue
<!-- src/components/Counter.vue -->
<script setup>
import { ref } from 'vue'

// 响应式数据
const count = ref(0)

// 方法
const increment = () => {
  count.value++
}

const decrement = () => {
  count.value--
}
</script>

<template>
  <div class="counter">
    <h2>计数器</h2>
    <p>当前值：{{ count }}</p>
    <button @click="decrement">-</button>
    <button @click="increment">+</button>
  </div>
</template>

<style scoped>
.counter {
  padding: 20px;
  text-align: center;
}

button {
  margin: 0 10px;
  padding: 5px 15px;
  font-size: 16px;
  cursor: pointer;
}
</style>
```

### 使用组件

```vue
<!-- src/App.vue -->
<script setup>
import Counter from './components/Counter.vue'
</script>

<template>
  <div>
    <h1>我的Vite应用</h1>
    <Counter />
  </div>
</template>
```

### Props和Events

```vue
<!-- src/components/UserCard.vue -->
<script setup>
// 定义Props
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    default: 18
  },
  email: String
})

// 定义Events
const emit = defineEmits(['update', 'delete'])

const handleUpdate = () => {
  emit('update', { name: props.name })
}

const handleDelete = () => {
  emit('delete', props.name)
}
</script>

<template>
  <div class="user-card">
    <h3>{{ name }}</h3>
    <p>年龄：{{ age }}</p>
    <p v-if="email">邮箱：{{ email }}</p>
    <button @click="handleUpdate">更新</button>
    <button @click="handleDelete">删除</button>
  </div>
</template>

<style scoped>
.user-card {
  border: 1px solid #ccc;
  padding: 15px;
  margin: 10px;
  border-radius: 8px;
}

button {
  margin-right: 10px;
  padding: 5px 10px;
}
</style>
```

### 使用UserCard

```vue
<!-- src/App.vue -->
<script setup>
import UserCard from './components/UserCard.vue'

const users = [
  { name: '张三', age: 25, email: 'zhangsan@example.com' },
  { name: '李四', age: 30 },
  { name: '王五', age: 28, email: 'wangwu@example.com' }
]

const handleUpdate = (user) => {
  console.log('更新用户:', user)
}

const handleDelete = (name) => {
  console.log('删除用户:', name)
}
</script>

<template>
  <div>
    <h1>用户列表</h1>
    <UserCard
      v-for="user in users"
      :key="user.name"
      :name="user.name"
      :age="user.age"
      :email="user.email"
      @update="handleUpdate"
      @delete="handleDelete"
    />
  </div>
</template>
```

---

## 组合式API（Composition API）

### 什么是组合式API？

组合式API是Vue3引入的新API风格，使用函数组织代码，而不是选项对象。

### 对比选项API

```vue
<!-- 选项API（Vue2风格） -->
<script>
export default {
  data() {
    return {
      count: 0,
      name: 'John'
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2
    }
  },
  mounted() {
    console.log('组件已挂载')
  }
}
</script>
```

```vue
<!-- 组合式API（Vue3推荐） -->
<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const count = ref(0)
const name = ref('John')

// 方法
const increment = () => {
  count.value++
}

// 计算属性
const doubleCount = computed(() => count.value * 2)

// 生命周期
onMounted(() => {
  console.log('组件已挂载')
})
</script>
```

### 自定义组合函数

```javascript
// src/composables/useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  return {
    count,
    increment,
    decrement,
    reset
  }
}
```

```vue
<!-- 使用自定义组合函数 -->
<script setup>
import { useCounter } from '@/composables/useCounter'

const { count, increment, decrement, reset } = useCounter(10)
</script>

<template>
  <div>
    <p>计数：{{ count }}</p>
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>
    <button @click="reset">重置</button>
  </div>
</template>
```

### 数据请求

```javascript
// src/composables/useFetch.js
import { ref, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(true)

  const fetchData = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(url.value || url)
      data.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // 如果url是ref，监听变化
  if (typeof url === 'object' && url.value !== undefined) {
    watchEffect(fetchData)
  } else {
    fetchData()
  }

  return { data, error, loading, refetch: fetchData }
}
```

```vue
<script setup>
import { useFetch } from '@/composables/useFetch'

const { data: users, loading, error } = useFetch('https://jsonplaceholder.typicode.com/users')
</script>

<template>
  <div>
    <h1>用户列表</h1>
    
    <div v-if="loading">加载中...</div>
    
    <div v-else-if="error">错误：{{ error }}</div>
    
    <ul v-else>
      <li v-for="user in users" :key="user.id">
        {{ user.name }} - {{ user.email }}
      </li>
    </ul>
  </div>
</template>
```

---

## 生产构建

### 构建命令

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 构建输出

```
dist/
├── assets/
│   ├── index-[hash].js      # 主JS文件（已压缩）
│   ├── index-[hash].css     # CSS文件
│   └── vue-[hash].js        # Vue库代码
├── index.html
└── ...
```

### 构建优化

```javascript
// vite.config.js
export default defineConfig({
  build: {
    // 输出目录
    outDir: 'dist',
    
    // 生成source map
    sourcemap: true,
    
    // 压缩方式
    minify: 'terser',
    
    // 分包策略
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue'],
          vendor: ['lodash']
        }
      }
    },
    
    // 资源处理
    assetsInlineLimit: 4096,  // 4KB以下的资源内联
    
    // CSS代码分割
    cssCodeSplit: true,
  },
})
```

---

## 常用命令速查

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览构建结果 |
| `npm run lint` | 代码检查 |
| `npm run format` | 代码格式化 |

---

## 小结

✅ Vite基于ESM，启动和热更新极快
✅ `index.html`是Vite的入口点
✅ `vite.config.js`是配置中心
✅ 环境变量以`VITE_`开头
✅ 组合式API是Vue3推荐的API风格
✅ 组件是Vue应用的基本单元
# Webpack关键对比

## Webpack核心概念

Webpack是一个现代JavaScript应用程序的模块打包工具。

### 四大核心

| 概念 | 说明 | 示例 |
|------|------|------|
| **Entry** | 入口文件，Webpack从这里开始构建依赖图 | `./src/index.js` |
| **Output** | 输出配置，定义打包后的文件位置和命名 | `dist/bundle.js` |
| **Loader** | 处理非JavaScript文件（CSS、图片等） | `babel-loader`, `css-loader` |
| **Plugin** | 扩展功能（代码压缩、环境变量注入等） | `HtmlWebpackPlugin` |

### 基础配置

```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 入口
  entry: './src/index.js',
  
  // 输出
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  
  // 模块规则（Loader）
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  
  // 插件
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  
  // 模式
  mode: 'development', // 或 'production'
};
```

### Loader详解

```javascript
// 常用Loader

// JavaScript/JSX处理
{
  test: /\.jsx?$/,
  use: 'babel-loader',
  exclude: /node_modules/
}

// CSS处理
{
  test: /\.css$/,
  use: ['style-loader', 'css-loader']
}

// SCSS处理
{
  test: /\.scss$/,
  use: ['style-loader', 'css-loader', 'sass-loader']
}

// 图片处理
{
  test: /\.(png|jpe?g|gif|svg)$/i,
  type: 'asset/resource'
}

// 字体处理
{
  test: /\.(woff|woff2|eot|ttf|otf)$/i,
  type: 'asset/resource'
}
```

### Plugin详解

```javascript
// 常用Plugin

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  plugins: [
    // 生成HTML文件
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
    }),
    
    // 提取CSS到单独文件
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css',
    }),
  ],
  
  optimization: {
    minimizer: [
      '...',  // 继承默认的JS压缩
      new CssMinimizerPlugin(),  // CSS压缩
    ],
  },
};
```

---

## Vite vs Webpack 全面对比

### 核心差异

| 特性 | Vite | Webpack |
|------|------|---------|
| **启动速度** | 秒级（按需编译） | 分钟级（全量打包） |
| **热更新** | 极快（模块级） | 较慢（重新打包） |
| **配置复杂度** | 简单（开箱即用） | 复杂（需大量配置） |
| **生态成熟度** | 新兴但快速发展 | 非常成熟 |
| **学习曲线** | 平缓 | 陡峭 |
| **生产构建** | Rollup | Webpack |
| **浏览器支持** | 现代浏览器 | 所有浏览器 |

### 为什么Vite更快？

**传统Webpack流程：**
```
启动 → 解析所有依赖 → 打包成bundle → 启动服务器
      ↑
      这一步很慢，项目越大越慢
```

**Vite流程：**
```
启动 → 只处理入口 → 按需编译 → 启动服务器
      ↑
      这一步几乎瞬间完成
```

**核心区别：**
- Webpack：启动时需要打包所有代码
- Vite：启动时只处理入口，其他代码按需加载

### 配置对比

#### 创建Vue3项目

**Vite配置：**
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

**Webpack配置：**
```javascript
// webpack.config.js
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
};
```

#### 开发服务器配置

**Vite：**
```javascript
// vite.config.js
export default defineConfig({
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

**Webpack：**
```javascript
// webpack.config.js
module.exports = {
  devServer: {
    port: 3000,
    open: true,
    hot: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
};
```

#### 路径别名配置

**Vite：**
```javascript
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Webpack：**
```javascript
const path = require('path')

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}
```

### 开发依赖对比

**Vite项目依赖：**
```json
{
  "devDependencies": {
    "vite": "^7.0.0",
    "@vitejs/plugin-vue": "^6.0.0"
  }
}
```

**Webpack项目依赖：**
```json
{
  "devDependencies": {
    "webpack": "^5.0.0",
    "webpack-cli": "^5.0.0",
    "webpack-dev-server": "^4.0.0",
    "vue-loader": "^17.0.0",
    "@vue/compiler-sfc": "^3.0.0",
    "css-loader": "^6.0.0",
    "style-loader": "^3.0.0",
    "html-webpack-plugin": "^5.0.0",
    "babel-loader": "^9.0.0",
    "@babel/core": "^7.0.0",
    "@babel/preset-env": "^7.0.0"
  }
}
```

**结论：** Vite依赖更少，配置更简单。

### 性能数据参考

| 操作 | Vite | Webpack 5 |
|------|------|-----------|
| 冷启动 | ~300ms | ~30s |
| 热更新 | ~50ms | ~2s |
| 构建（prod） | ~15s | ~30s |

*数据仅供参考，实际取决于项目复杂度*

---

## Webpack实战示例

### 创建Webpack项目

```bash
# 创建项目目录
mkdir my-webpack-app
cd my-webpack-app

# 初始化package.json
npm init -y

# 安装依赖
npm install -D webpack webpack-cli webpack-dev-server
npm install -D @babel/core @babel/preset-env babel-loader
npm install -D css-loader style-loader html-webpack-plugin
npm install -D vue-loader @vue/compiler-sfc
npm install -D vue
```

### 项目结构

```
my-webpack-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── HelloWorld.vue
│   ├── App.vue
│   └── main.js
├── package.json
└── webpack.config.js
```

### 文件内容

**public/index.html：**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Webpack Vue App</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

**src/main.js：**
```javascript
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

**src/App.vue：**
```vue
<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>
    <h1>Webpack + Vue</h1>
    <HelloWorld />
  </div>
</template>
```

**src/components/HelloWorld.vue：**
```vue
<template>
  <div>
    <p>Hello World!</p>
  </div>
</template>
```

**webpack.config.js：**
```javascript
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.vue'],
  },
  devServer: {
    port: 3000,
    hot: true,
    open: true,
  },
  mode: 'development',
};
```

**package.json scripts：**
```json
{
  "scripts": {
    "dev": "webpack serve",
    "build": "webpack --mode production",
    "lint": "eslint src"
  }
}
```

### 运行项目

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

---

## 何时选Vite，何时选Webpack？

### 选Vite的情况

✅ **新项目** - 尤其是Vue3、React现代框架
✅ **中小型项目** - 不需要复杂的构建定制
✅ **追求开发体验** - 启动速度、热更新性能
✅ **个人项目或创业公司** - 快速迭代
✅ **学习前端** - 配置简单，容易上手

### 选Webpack的情况

✅ **大型企业项目** - 需要细粒度控制
✅ **成熟生态需求** - 需要特定的插件
✅ **遗留项目维护** - 已使用Webpack
✅ **特殊加载器需求** - 需要自定义文件类型处理
✅ **团队熟悉Webpack** - 不想重新学习

### 迁移建议

如果你有现有Webpack项目：

1. **小项目** - 考虑直接迁移到Vite
   - 优势：开发体验大幅提升
   - 成本：需要适配一些配置

2. **大项目** - 保持Webpack或渐进式迁移
   - 优势：稳定，团队熟悉
   - 策略：新模块用Vite，老模块保持Webpack

3. **新模块** - 可以用Vite
   - 策略：新模块独立使用Vite，通过微前端或API集成

---

## 学习路径建议

### 初学者路径

```
1. 学习Vite（简单易上手）
   ↓
2. 创建一个完整项目
   ↓
3. 理解构建流程
   ↓
4. 了解Webpack基础概念
   ↓
5. 根据项目需求选择工具
```

### 进阶路径

```
1. 深入理解Vite原理（ESM、HMR）
   ↓
2. 学习Webpack配置（Loader、Plugin）
   ↓
3. 掌握两者性能优化
   ↓
4. 根据场景做出技术选型
```

---

## 小结

✅ Webpack是成熟的模块打包工具，生态丰富
✅ Vite基于ESM，启动和热更新更快
✅ Vite配置更简单，依赖更少
✅ 新项目优先考虑Vite，老项目根据情况决定
✅ 两者各有优势，根据需求选择
# 总结与最佳实践

## NPM项目特色总结

### 核心价值

| 特色 | 说明 | 价值 |
|------|------|------|
| **依赖管理** | 自动处理复杂的依赖关系树 | 不用手动下载和管理库 |
| **版本控制** | 语义化版本确保兼容性 | 团队使用相同版本 |
| **脚本系统** | 统一的命令执行接口 | 标准化开发流程 |
| **生态系统** | 数百万个开源包可用 | 快速实现功能 |
| **锁文件** | `package-lock.json`锁定确切版本 | 环境一致性 |

### 最佳实践

```bash
# 1. 使用锁文件
git add package-lock.json

# 2. 明确依赖类型
npm install lodash          # 生产依赖
npm install -D eslint       # 开发依赖

# 3. 使用语义化版本
npm install vue@^3.5.0     # 允许次版本更新
npm install vue@3.5.0      # 精确锁定版本

# 4. 定期更新
npm update                 # 更新依赖
npm audit                  # 检查安全漏洞
```

---

## 构建工具选择指南

### 决策树

```
你的项目需要什么？
│
├── 快速启动、简单配置
│   └── ✅ 选择 Vite
│
├── 复杂的构建定制
│   └── ✅ 选择 Webpack
│
├── 大型企业项目
│   └── ✅ 选择 Webpack（或评估两者）
│
├── 新项目 + 现代框架
│   └── ✅ 选择 Vite
│
└── 已有Webpack项目
    └── ✅ 保持Webpack（或渐进式迁移）
```

### 对比总结

| 维度 | Vite | Webpack |
|------|------|---------|
| **启动速度** | ⭐⭐⭐⭐⭐ 极快 | ⭐⭐ 较慢 |
| **热更新** | ⭐⭐⭐⭐⭐ 极快 | ⭐⭐⭐ 一般 |
| **配置复杂度** | ⭐⭐⭐⭐⭐ 简单 | ⭐⭐ 复杂 |
| **生态成熟度** | ⭐⭐⭐ 快速发展 | ⭐⭐⭐⭐⭐ 非常成熟 |
| **学习曲线** | ⭐⭐⭐⭐⭐ 平缓 | ⭐⭐ 陡峭 |
| **生产构建** | ⭐⭐⭐⭐ 优秀 | ⭐⭐⭐⭐ 优秀 |

### 推荐选择

```
大多数情况 → Vite（简单、快速、现代）
特殊需求 → Webpack（生态、控制、兼容）
```

---

## 开发工作流最佳实践

### 1. 项目初始化

```bash
# Vite项目（推荐）
npm create vite@latest my-app -- --template vue
cd my-app
npm install
npm run dev

# 或者使用yarn/pnpm
yarn create vite my-app --template vue
pnpm create vite my-app --template vue
```

### 2. 依赖管理规范

```bash
# ✅ 正确做法
npm install lodash              # 生产依赖
npm install -D eslint prettier  # 开发依赖
npm install -D vitest           # 测试框架

# ❌ 错误做法
npm install --save lodash       # 不需要--save（默认就是）
npm install eslint              # 应该加-D
```

### 3. 脚本组织

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src",
    "lint:fix": "eslint src --fix",
    "format": "prettier --write src",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

### 4. 环境管理

```bash
# 本地配置（不提交）
.env.local

# 环境特定配置
.env.development    # 开发环境
.env.production     # 生产环境
.env.test           # 测试环境
```

```javascript
// 使用环境变量
const apiUrl = import.meta.env.VITE_API_URL
```

### 5. 代码质量

```bash
# 代码检查
npm run lint

# 代码格式化
npm run format

# 类型检查（TypeScript）
npm run type-check
```

---

## 常见问题解答

### Q1: Vite真的比Webpack快吗？

**A:** 是的，特别是在开发阶段：
- **启动速度**：Vite秒级 vs Webpack分钟级
- **热更新**：Vite毫秒级 vs Webpack秒级
- **生产构建**：两者差距不大

### Q2: 我应该学哪个？

**A:** 建议：
1. **先学Vite** - 简单易上手，配置简单
2. **再了解Webpack** - 企业常用，生态成熟
3. **根据项目需求选择** - 不要为了用而用

### Q3: 项目已经用了Webpack，需要迁移吗？

**A:** 不一定：
- **小项目** - 可以考虑迁移，体验提升明显
- **大项目** - 保持稳定，渐进式迁移
- **新模块** - 新模块可以用Vite

### Q4: Vite支持IE11吗？

**A:** 不支持。Vite基于ESM，只支持现代浏览器。如果需要支持IE11，使用Webpack。

### Q5: 如何处理跨域问题？

**A:** 开发服务器代理配置：

**Vite：**
```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

**Webpack：**
```javascript
// webpack.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
}
```

---

## 学习资源推荐

### 官方文档

| 工具 | 网址 | 特点 |
|------|------|------|
| Vite | https://vitejs.dev/ | 文档简洁，示例丰富 |
| Webpack | https://webpack.js.org/ | 文档详细，配置完整 |
| Vue.js | https://vuejs.org/ | 组合式API教程 |
| NPM | https://docs.npmjs.com/ | 包管理完整指南 |

### 实践建议

1. **先跑通** - 先让项目运行起来，再深入理解
2. **读配置** - 理解每个配置项的作用
3. **看源码** - 感兴趣时阅读工具源码
4. **做项目** - 实践是最好的学习方式

### 学习路径

```
初学者：
1. 学习JavaScript基础
2. 学习Vue/React基础
3. 使用Vite创建项目
4. 理解构建流程
5. 根据需要深入Webpack

进阶者：
1. 深入理解Vite原理
2. 学习Webpack配置
3. 掌握性能优化
4. 根据场景技术选型
```

---

## 核心要点回顾

### NPM
- ✅ `package.json`是项目配置中心
- ✅ 区分`dependencies`和`devDependencies`
- ✅ 使用语义化版本管理依赖
- ✅ `package-lock.json`确保环境一致性

### 语法
- ✅ ESM是现代JavaScript的标准模块系统
- ✅ 箭头函数简洁，但没有自己的this
- ✅ 解构赋值让代码更简洁
- ✅ async/await让异步代码更易读

### Vite
- ✅ 基于ESM，启动和热更新极快
- ✅ 配置简单，开箱即用
- ✅ Vue3/React的首选构建工具

### Webpack
- ✅ 生态成熟，插件丰富
- ✅ 配置灵活，控制精细
- ✅ 适合大型企业项目

---

## 下一步行动

### 立即行动

1. **创建你的第一个Vite项目**
   ```bash
   npm create vite@latest my-first-app -- --template vue
   cd my-first-app
   npm install
   npm run dev
   ```

2. **修改代码，体验热更新**
   - 修改`src/App.vue`
   - 观察浏览器实时更新

3. **构建生产版本**
   ```bash
   npm run build
   npm run preview
   ```

### 深入学习

1. **学习Vue3组合式API** - 现代Vue开发方式
2. **了解TypeScript** - 类型安全
3. **学习测试** - vitest/jest
4. **了解CI/CD** - 自动化部署

---

## 恭喜！

你已经完成了NPM项目特色与构建工具的学习！

记住：
- **Vite**是现代前端开发的首选
- **Webpack**在特定场景下仍然重要
- **实践**是最好的学习方式

祝你在前端开发的道路上越走越远！
# Vue核心知识点

## Vue简介

Vue是一个渐进式JavaScript框架，用于构建用户界面。

### 核心特点

| 特点 | 说明 |
|------|------|
| **渐进式** | 可以只用核心库，也可以引入全家桶 |
| **响应式** | 数据变化自动更新视图 |
| **组件化** | UI拆分为独立、可复用的组件 |
| **虚拟DOM** | 高效的DOM更新机制 |
| **组合式API** | Vue3推荐的代码组织方式 |

---

## 创建Vue应用

### 基础示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Vue基础示例</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
  <div id="app">
    <h1>{{ message }}</h1>
    <button @click="changeMessage">点击修改</button>
  </div>

  <script>
    const { createApp, ref } = Vue

    createApp({
      setup() {
        const message = ref('Hello Vue!')
        
        const changeMessage = () => {
          message.value = 'Hello World!'
        }

        return { message, changeMessage }
      }
    }).mount('#app')
  </script>
</body>
</html>
```

### Vite项目中的Vue

```vue
<!-- src/App.vue -->
<script setup>
import { ref } from 'vue'

const message = ref('Hello Vue!')

const changeMessage = () => {
  message.value = 'Hello World!'
}
</script>

<template>
  <div>
    <h1>{{ message }}</h1>
    <button @click="changeMessage">点击修改</button>
  </div>
</template>
```

---

## 模板语法

### 插值

```vue
<template>
  <!-- 文本插值 -->
  <p>{{ message }}</p>
  
  <!-- 表达式 -->
  <p>{{ count + 1 }}</p>
  <p>{{ ok ? 'Yes' : 'No' }}</p>
  <p>{{ message.split('').reverse().join('') }}</p>
  
  <!-- 方法调用 -->
  <p>{{ formatDate(new Date()) }}</p>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('Hello')
const count = ref(0)
const ok = ref(true)

const formatDate = (date) => {
  return date.toLocaleDateString('zh-CN')
}
</script>
```

### 指令

```vue
<template>
  <!-- v-bind：动态绑定属性 -->
  <img v-bind:src="imageUrl">
  <img :src="imageUrl">
  <div :class="{ active: isActive }"></div>
  <div :style="{ color: textColor }"></div>
  
  <!-- v-on：事件绑定 -->
  <button v-on:click="handleClick">点击</button>
  <button @click="handleClick">点击</button>
  <button @click.stop="handleClick">阻止冒泡</button>
  <button @submit.prevent="handleSubmit">阻止默认行为</button>
  
  <!-- v-model：双向绑定 -->
  <input v-model="text">
  <input v-model.number="age" type="number">
  <input v-model.trim="name">
  <input v-model.lazy="search">
  
  <!-- v-if / v-else：条件渲染 -->
  <div v-if="show">显示内容</div>
  <div v-else>隐藏时显示</div>
  
  <!-- v-show：显示/隐藏 -->
  <div v-show="isVisible">显示内容</div>
  
  <!-- v-for：列表渲染 -->
  <ul>
    <li v-for="(item, index) in items" :key="item.id">
      {{ index }}. {{ item.name }}
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue'

const imageUrl = ref('/logo.png')
const isActive = ref(true)
const textColor = ref('red')
const text = ref('')
const age = ref(18)
const name = ref('')
const search = ref('')
const show = ref(true)
const isVisible = ref(true)
const items = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Orange' }
])

const handleClick = () => {
  console.log('clicked')
}

const handleSubmit = () => {
  console.log('submitted')
}
</script>
```

---

## 组合式API

### ref和reactive

```vue
<template>
  <div>
    <p>count: {{ count }}</p>
    <p>user.name: {{ user.name }}</p>
    <p>user.age: {{ user.age }}</p>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// ref：基本类型
const count = ref(0)

// reactive：对象
const user = reactive({
  name: 'John',
  age: 30
})

// 修改ref
count.value++

// 修改reactive
user.name = 'Jane'
user.age = 25
</script>
```

### computed

```vue
<template>
  <div>
    <p>firstName: {{ firstName }}</p>
    <p>lastName: {{ lastName }}</p>
    <p>fullName: {{ fullName }}</p>
    <button @click="changeName">修改名字</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

// 计算属性（只读）
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`
})

// 计算属性（可读写）
const fullNameWritable = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (newValue) => {
    const [first, last] = newValue.split(' ')
    firstName.value = first
    lastName.value = last
  }
})

const changeName = () => {
  firstName.value = 'Jane'
}
</script>
```

### watch和watchEffect

```vue
<template>
  <div>
    <input v-model="keyword" placeholder="搜索...">
    <p>搜索: {{ keyword }}</p>
    <p>搜索结果: {{ searchResult }}</p>
  </div>
</template>

<script setup>
import { ref, watch, watchEffect } from 'vue'

const keyword = ref('')
const searchResult = ref('')

// watch：监听特定数据
watch(keyword, (newVal, oldVal) => {
  console.log(`搜索词从 "${oldVal}" 变为 "${newVal}"`)
  searchResult.value = `搜索 "${newVal}" 的结果...`
})

// watch：监听多个数据
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log(`名字从 ${oldFirst} ${oldLast} 变为 ${newFirst} ${newLast}`)
})

// watch：深度监听对象
const user = ref({ name: 'John', age: 30 })
watch(user, (newVal) => {
  console.log('user变化:', newVal)
}, { deep: true })

// watchEffect：自动追踪依赖
watchEffect(() => {
  console.log(`当前搜索: ${keyword.value}`)
  // 自动追踪keyword的变化
})
</script>
```

### 生命周期

```vue
<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from 'vue'

const data = ref(null)

// 组件挂载前
onBeforeMount(() => {
  console.log('组件即将挂载')
})

// 组件挂载后
onMounted(() => {
  console.log('组件已挂载')
  
  // 常用场景：获取数据
  fetchData()
})

// 数据更新前
onBeforeUpdate(() => {
  console.log('数据即将更新')
})

// 数据更新后
onUpdated(() => {
  console.log('数据已更新')
})

// 组件卸载前
onBeforeUnmount(() => {
  console.log('组件即将卸载')
  // 清理定时器、事件监听等
})

// 组件卸载后
onUnmounted(() => {
  console.log('组件已卸载')
})

const fetchData = async () => {
  const response = await fetch('/api/data')
  data.value = await response.json()
}
</script>
```

---

## 组件

### 组件定义

```vue
<!-- src/components/MyButton.vue -->
<script setup>
import { ref } from 'vue'

// Props
const props = defineProps({
  text: {
    type: String,
    default: '按钮'
  },
  type: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger'].includes(value)
  },
  disabled: Boolean
})

// Events
const emit = defineEmits(['click'])

// 方法
const handleClick = () => {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<template>
  <button
    :class="['btn', `btn-${type}`]"
    :disabled="disabled"
    @click="handleClick"
  >
    {{ text }}
  </button>
</template>

<style scoped>
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #409eff;
  color: white;
}

.btn-secondary {
  background-color: #909399;
  color: white;
}

.btn-danger {
  background-color: #f56c6c;
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

### 使用组件

```vue
<!-- src/App.vue -->
<script setup>
import { ref } from 'vue'
import MyButton from './components/MyButton.vue'

const count = ref(0)

const handleClick = () => {
  count.value++
}
</script>

<template>
  <div>
    <h1>计数: {{ count }}</h1>
    
    <MyButton text="点击+1" @click="handleClick" />
    
    <MyButton 
      text="次要按钮" 
      type="secondary" 
      @click="handleClick" 
    />
    
    <MyButton 
      text="禁用按钮" 
      disabled 
    />
  </div>
</template>
```

### 插槽

```vue
<!-- src/components/Card.vue -->
<script setup>
defineProps({
  title: String
})
</script>

<template>
  <div class="card">
    <!-- 具名插槽：header -->
    <div class="card-header">
      <slot name="header">
        {{ title }}
      </slot>
    </div>
    
    <!-- 默认插槽：content -->
    <div class="card-body">
      <slot>
        默认内容
      </slot>
    </div>
    
    <!-- 具名插槽：footer -->
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  padding: 16px;
  background-color: #f5f5f5;
  font-weight: bold;
}

.card-body {
  padding: 16px;
}

.card-footer {
  padding: 16px;
  background-color: #f5f5f5;
}
</style>
```

### 使用插槽

```vue
<script setup>
import Card from './components/Card.vue'
</script>

<template>
  <Card title="卡片标题">
    <!-- 使用默认插槽 -->
    <p>这是卡片内容</p>
    <p>可以放任何内容</p>
    
    <!-- 使用具名插槽 -->
    <template #header>
      <h2>自定义头部</h2>
    </template>
    
    <template #footer>
      <button>确定</button>
      <button>取消</button>
    </template>
  </Card>
</template>
```

### 动态组件

```vue
<script setup>
import { ref, shallowRef } from 'vue'
import TabHome from './components/TabHome.vue'
import TabAbout from './components/TabAbout.vue'
import TabContact from './components/TabContact.vue'

const tabs = [
  { name: '首页', component: TabHome },
  { name: '关于', component: TabAbout },
  { name: '联系', component: TabContact }
]

const currentTab = shallowRef(TabHome)
</script>

<template>
  <div>
    <button 
      v-for="tab in tabs" 
      :key="tab.name"
      @click="currentTab = tab.component"
    >
      {{ tab.name }}
    </button>
    
    <component :is="currentTab" />
  </div>
</template>
```

---

## 状态管理（Pinia）

### 安装

```bash
npm install pinia
```

### 配置

```javascript
// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

### 定义Store

```javascript
// src/stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  // 状态
  state: () => ({
    count: 0,
    name: 'Counter'
  }),
  
  // 计算属性
  getters: {
    doubleCount: (state) => state.count * 2,
    countMessage: (state) => `当前计数: ${state.count}`
  },
  
  // 方法
  actions: {
    increment() {
      this.count++
    },
    
    decrement() {
      this.count--
    },
    
    async fetchCount() {
      const response = await fetch('/api/count')
      const data = await response.json()
      this.count = data.count
    }
  }
})
```

### 使用Store

```vue
<script setup>
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

const counterStore = useCounterStore()

// 使用storeToRefs保持响应式
const { count, doubleCount } = storeToRefs(counterStore)

// 方法可以直接解构
const { increment, decrement } = counterStore
</script>

<template>
  <div>
    <h1>{{ counterStore.name }}</h1>
    <p>计数: {{ count }}</p>
    <p>双倍: {{ doubleCount }}</p>
    <p>消息: {{ counterStore.countMessage }}</p>
    
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>
    <button @click="counterStore.fetchCount">获取数据</button>
  </div>
</template>
```

---

## 路由（Vue Router）

### 安装

```bash
npm install vue-router
```

### 配置

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue')
  },
  {
    path: '/user/:id',
    name: 'User',
    component: () => import('@/views/User.vue'),
    props: true
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return { name: 'Login' }
  }
})

export default router
```

```javascript
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```

### 使用路由

```vue
<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 获取路由参数
console.log(route.params.id)
console.log(route.query.keyword)

// 编程式导航
const goToUser = (id) => {
  router.push({ name: 'User', params: { id } })
}

const goToHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div>
    <!-- 导航链接 -->
    <router-link to="/">首页</router-link>
    <router-link :to="{ name: 'About' }">关于</router-link>
    
    <!-- 路由出口 -->
    <router-view />
  </div>
</template>
```

---

## 自定义指令

### 定义指令

```javascript
// src/directives/focus.js
export const vFocus = {
  mounted: (el) => {
    el.focus()
  }
}

// src/directives/loading.js
export const vLoading = {
  mounted: (el, binding) => {
    if (binding.value) {
      el.classList.add('loading')
    }
  },
  updated: (el, binding) => {
    if (binding.value) {
      el.classList.add('loading')
    } else {
      el.classList.remove('loading')
    }
  }
}
```

### 使用指令

```vue
<script setup>
import { vFocus } from '@/directives/focus'
import { vLoading } from '@/directives/loading'
import { ref } from 'vue'

const isLoading = ref(false)
</script>

<template>
  <div>
    <!-- 自动聚焦 -->
    <input v-focus>
    
    <!-- 加载状态 -->
    <div v-loading="isLoading">
      内容区域
    </div>
    
    <button @click="isLoading = !isLoading">
      切换加载状态
    </button>
  </div>
</template>
```

---

## Teleport

```vue
<script setup>
import { ref } from 'vue'

const showModal = ref(false)
</script>

<template>
  <div>
    <button @click="showModal = true">打开弹窗</button>
    
    <!-- Teleport将内容渲染到body下 -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <h2>弹窗标题</h2>
          <p>弹窗内容</p>
          <button @click="showModal = false">关闭</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 8px;
  min-width: 300px;
}
</style>
```

---

## Suspense

```vue
<!-- src/App.vue -->
<script setup>
import { Suspense } from 'vue'
import UserProfile from './components/UserProfile.vue'
</script>

<template>
  <Suspense>
    <!-- 默认插槽：异步组件 -->
    <template #default>
      <UserProfile />
    </template>
    
    <!-- 加载中插槽 -->
    <template #fallback>
      <div>加载中...</div>
    </template>
  </Suspense>
</template>
```

```vue
<!-- src/components/UserProfile.vue -->
<script setup>
// 异步组件
const response = await fetch('/api/user')
const user = await response.json()
</script>

<template>
  <div>
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
  </div>
</template>
```

---

## 最佳实践

### 1. 组件设计原则

- **单一职责** - 每个组件只做一件事
- **可复用性** - 通过Props和Events实现复用
- **可组合性** - 使用组合式API组织逻辑

### 2. 状态管理

- **局部状态** - 组件内部使用`ref`和`reactive`
- **共享状态** - 跨组件使用Pinia
- **服务器状态** - 使用`@tanstack/vue-query`管理

### 3. 性能优化

```vue
<script setup>
import { ref, computed, shallowRef, triggerRef } from 'vue'

// 1. 使用computed缓存计算结果
const doubleCount = computed(() => count.value * 2)

// 2. 使用shallowRef处理大型对象
const largeData = shallowRef({ /* 大型对象 */ })

// 3. 使用v-once缓存静态内容
// <div v-once>静态内容</div>

// 4. 使用v-memo缓存列表项
// <div v-memo="[item.id]">{{ item.name }}</div>
</script>
```

### 4. 代码组织

```
src/
├── components/          # 可复用组件
│   ├── common/          # 通用组件
│   └── features/        # 功能组件
├── composables/         # 组合函数
├── directives/          # 自定义指令
├── stores/              # Pinia状态
├── views/               # 页面组件
├── router/              # 路由配置
└── utils/               # 工具函数
```

---

## 小结

✅ Vue是渐进式JavaScript框架
✅ 组合式API是Vue3推荐的API风格
✅ 组件是Vue应用的基本单元
✅ Pinia是官方推荐的状态管理库
✅ Vue Router用于构建单页应用
✅ 合理使用生命周期和响应式API
