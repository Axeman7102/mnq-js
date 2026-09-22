# 第七章：开发工具链

现代前端工程离不开一套完善的开发工具链。本章将介绍 ESLint、Prettier、Git Hooks 以及单元测试的核心配置，帮助你建立高效的代码质量保障流程。

---

## 7.1 ESLint 代码检查

ESLint 是 JavaScript/TypeScript 的静态代码分析工具，用于发现代码中的潜在问题并统一编码规范。

### 安装与基础配置

```bash
npm install -D eslint @eslint/js typescript-eslint
```

创建 `eslint.config.js`（扁平配置格式）：

```js
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn",
      "no-console": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    ignores: ["dist/", "node_modules/", "*.config.*"],
  }
);
```

### 常用规则说明

| 规则 | 作用 | 推荐值 |
|------|------|--------|
| `no-unused-vars` | 检测未使用的变量 | `warn` |
| `no-console` | 禁止 `console.log` | `warn` |
| `eqeqeq` | 要求使用 `===` | `error` |
| `@typescript-eslint/no-explicit-any` | 禁止 `any` 类型 | `warn` |

### 在 package.json 中添加脚本

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

---

## 7.2 Prettier 代码格式化

Prettier 负责统一代码风格（缩进、引号、分号等），与 ESLint 互补但职责不同。

### 安装与配置

```bash
npm install -D prettier
```

创建 `.prettierrc`：

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

创建 `.prettierignore`：

```
dist/
node_modules/
coverage/
*.min.js
```

### 常用命令

```bash
# 格式化所有文件
npx prettier --write .

# 检查格式（不修改）
npx prettier --check .
```

### ESLint 与 Prettier 共存

安装兼容插件，避免两者规则冲突：

```bash
npm install -D eslint-config-prettier
```

在 `eslint.config.js` 中最后引入：

```js
import prettier from "eslint-config-prettier";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier  // 放在最后，覆盖其他格式化规则
);
```

---

## 7.3 Git Hooks：husky 与 lint-staged

通过 Git Hooks 在提交代码前自动检查格式和规范，防止问题代码入库。

### 安装 husky

```bash
npm install -D husky
npx husky init
```

这会在项目根目录创建 `.husky/` 目录，并在 `package.json` 中添加 `prepare` 脚本。

### 配置 pre-commit 钩子

编辑 `.husky/pre-commit`：

```bash
npx lint-staged
```

### 配置 lint-staged

在 `package.json` 中添加：

```json
{
  "lint-staged": {
    "*.{js,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  }
}
```

**工作流程：**

1. 执行 `git commit` 时触发 pre-commit 钩子
2. lint-staged 只对暂存区的文件执行检查
3. ESLint 修复代码问题，Prettier 统一格式
4. 检查通过后才允许提交

---

## 7.4 单元测试：Vitest

Vitest 是基于 Vite 的极速测试框架，兼容 Jest API，配置更简洁。

### 安装与配置

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

在 `vite.config.ts` 中配置：

```ts
/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["node_modules/", "src/test/"],
    },
  },
});
```

创建 `src/test/setup.ts`：

```ts
import "@testing-library/jest-dom/vitest";
```

### 编写测试用例

创建 `src/utils/math.test.ts`：

```ts
import { describe, it, expect } from "vitest";
import { add, multiply } from "./math";

describe("数学工具函数", () => {
  it("add: 两数相加", () => {
    expect(add(1, 2)).toBe(3);
  });

  it("multiply: 两数相乘", () => {
    expect(multiply(2, 3)).toBe(6);
  });

  it("multiply: 乘以零", () => {
    expect(multiply(5, 0)).toBe(0);
  });
});
```

### React 组件测试

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Button from "./Button";

describe("Button 组件", () => {
  it("渲染正确的文本", () => {
    render(<Button>点击我</Button>);
    expect(screen.getByText("点击我")).toBeInTheDocument();
  });

  it("点击触发回调", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>点击</Button>);
    await userEvent.click(screen.getByText("点击"));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### 运行测试

```bash
# 运行所有测试
npx vitest

# 运行一次（CI 用）
npx vitest run

# 生成覆盖率报告
npx vitest run --coverage
```

---

## 7.5 代码质量工作流

将上述工具整合到项目中，形成完整的质量保障体系：

### package.json 脚本汇总

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "prepare": "husky"
  }
}
```

### 典型开发流程

```
编写代码 → git add → git commit
                         ↓
                   husky 触发 pre-commit
                         ↓
                   lint-staged 执行检查
                    ↙          ↘
              ESLint         Prettier
             自动修复        格式化代码
                    ↘          ↙
                   检查通过 → 提交成功
                   检查失败 → 阻止提交
```

### VS Code 推荐配置

安装以下扩展，实现编辑器实时提示：

- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier** (`esbenp.prettier-vscode`)

在 `.vscode/settings.json` 中启用保存时自动格式化：

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

---

## 本章小结

| 工具 | 职责 | 运行时机 |
|------|------|----------|
| ESLint | 代码质量检查 | 编辑器实时 / 提交前 / CI |
| Prettier | 代码格式化 | 编辑器实时 / 提交前 / CI |
| husky | Git Hooks 管理 | git commit 时触发 |
| lint-staged | 暂存区文件检查 | pre-commit 钩子中 |
| Vitest | 单元测试 | 开发时 / CI |

通过这套工具链，可以在开发阶段就发现并修复大部分代码问题，显著提升项目质量和团队协作效率。下一章我们将介绍生产部署的相关内容。
