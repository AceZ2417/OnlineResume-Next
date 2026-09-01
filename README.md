# OnlineResume-Next · 现代化在线简历编辑器

基于 **Vite 6 + React 19 + TypeScript 5.8 + Tailwind CSS 4** 的纯前端简历 SPA，替代旧的 Gatsby 2 仓库。

> 🌐 **在线地址**：[https://AceZ2417.github.io/OnlineResume-Next/](https://AceZ2417.github.io/OnlineResume-Next/)

---

## 目录

- [功能特点](#功能特点)
- [技术栈](#技术栈)
- [运行环境](#运行环境)
- [快速开始](#快速开始)
- [部署流程](#部署流程)
- [目录结构](#目录结构)
- [常用操作](#常用操作)
- [开发到部署全流程](#开发到部署全流程)
- [浏览器兼容](#浏览器兼容)

---

## 功能特点

| 能力 | 实现 |
|------|------|
| 📝 左编辑器 | react-hook-form + zod 校验 + @dnd-kit 拖拽排序，6 大列表可自由增删排 |
| 👁️ 右预览 | 3 套模板实时同步，与旧版视觉一致，Less 写法保留 |
| ⚡ 实时预览 | 改字段 **200 ms 内**刷新，无需手动保存 |
| 💾 草稿自动保存 | 300 ms 防抖存 localStorage，浏览器崩溃可恢复，`beforeunload` 关标签提示 |
| 🌐 中英双语 | react-i18next 界面 i18n + 简历内容 `locales.en` 切换，localStorage 记忆偏好 |
| 🖨️ 一键打印/PDF | A4 尺寸，`@media print` 独立样式，`print-color-adjust: exact` 保留背景色 |
| � 导入导出 JSON | Toolbar 一键导入导出，远程 resume.json 加载失败自动降级内置默认数据 |
| 🖼️ 头像本地上传 | Canvas 自动压缩至 ≤800px JPEG 0.85，支持形状（圆/方）和尺寸（小/默认/大）|
| 🎨 主题色自定义 | CSS 变量 + Tailwind `@theme inline` 桥接，预览实时变色 |
| 📱 响应式布局 | PC 端左右分栏（2fr / 3fr），移动端 Tab 切换 |

---

## 技术栈

| 分类 | 技术 | 版本 |
|------|------|------|
| **构建工具** | Vite | 6.x |
| **前端框架** | React | 19.x |
| **开发语言** | TypeScript | 5.8.x |
| **样式方案** | Tailwind CSS 4 | 4.x |
| — | Less（模板样式） | 4.x |
| **状态管理** | Zustand | 5.x |
| **表单** | react-hook-form | 7.x |
| **数据校验** | zod | 4.x |
| **拖拽排序** | @dnd-kit/core + @dnd-kit/sortable | 6.x / 10.x |
| **国际化** | i18next + react-i18next + i18next-browser-languagedetector | 26.x / 17.x / 8.x |
| **图标** | @ant-design/icons | 6.x |
| **部署** | GitHub Pages 官方 Actions | — |

### 核心实现一览

| 能力 | 实现方式 |
|------|----------|
| 数据 Schema & 校验 | **zod 4**（`src/schema/resumeSchema.ts`），所有 `ResumeConfig` 类型均由 `z.infer<>` 生成，单一真相源 |
| 状态持久化 | **zustand 5 persist**（localStorage key = `resume-next-storage`），仅持久化 `resume / template / locale` |
| 主题色桥接 | `--resume-color` / `--resume-tag-color` → `@theme inline` → `bg-resume / text-resume / border-resume` |
| 表单校验 | 自写 `resumeResolver()` 适配 zod 4（`@hookform/resolvers` 暂不兼容 zod v4）|
| 国际化双路 | UI key 翻译 + 简历内容 `locales.en` 切换 |
| 打印 | `@media print` 独立样式，A4 单张输出背景色 |
| 草稿恢复 | 独立 key `resume-next-draft`，300 ms 防抖自动保存，启动时提示恢复 |
| 头像压缩 | 纯 DOM Canvas 压缩到 ≤800px JPEG 0.85，防止 localStorage 超限 |
| 构建产物 | gzip ≈ 153 KB + 6.2 KB CSS |

---

## 运行环境

| 类别 | 要求 |
|------|------|
| **Node.js** | 推荐 **24 LTS**（与 GitHub Actions 工作流一致），最低兼容 **20+** |
| **包管理器** | npm ≥ 10 |
| **浏览器** | Chrome / Edge / Firefox / Safari 近 3 年版本 |
| **构建目标** | `es2020 / chrome90` |
| **操作系统** | Windows / macOS / Linux |

---

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式（http://localhost:5173，热更新）
npm run dev

# 类型检查 + 生产构建（产物在 dist/）
npm run build

# 本地预览构建产物
npm run preview
```

打开浏览器访问 http://localhost:5173/ ，默认从本项目 `public/resume.json`（部署后即 `<BASE_URL>resume.json`）加载简历；远程不可用时自动降级到内置默认数据。

---

## 部署流程

使用 GitHub **官方** `actions/deploy-pages`（无需 gh-pages 分支，无需配置密钥）。

### 一键部署步骤

1. **在 GitHub 新建仓库**，如 `AceZ2417/OnlineResume-Next`

2. **Push 代码到 main 分支**：
   ```bash
   cd OnlineResume-Next
   git init
   git add -A
   git commit -m "chore: init resume-next"
   git branch -M main
   git remote add origin https://github.com/<USER>/<REPO>.git
   git push -u origin main
   ```

3. **仓库 Settings → Pages**：
   - **Source** 选 `GitHub Actions`（**不是** Deploy from branch）

4. **仓库 Settings → Actions → General**：
   - 确认 `Workflow permissions` 为 `Read and write permissions`（给 Pages token 写权限）

5. **等待 Actions 跑完** → 访问 `https://<USER>.github.io/<REPO>/`

### base 路径自动计算

工作流会**自动根据仓库名计算 base 路径**：

| 仓库类型 | BASE_PATH | 示例 |
|----------|-----------|------|
| `<USER>.github.io` 根仓库 | `/` | `https://acez2417.github.io/` |
| 项目页仓库 | `/<REPO>/` | `https://acez2417.github.io/OnlineResume-Next/` |

### 自定义域名

在 Pages 页面填写域名 → 仓库根目录加 `CNAME` 文件（或 Settings 里直接填写，Pages 会自动生成）。

### 推送即部署

```bash
git add -A
git commit -m "feat: <你的改动>"
git push origin main
# → 自动触发 Actions 构建并部署
```

> 💡 部署后浏览器可能缓存旧版，按 **Ctrl+F5 / Ctrl+Shift+R** 强刷即可看到最新效果。

---

## 目录结构

```
OnlineResume-Next/
├── .github/workflows/deploy.yml   # GitHub Pages 官方 Actions 部署
├── public/
│   └── resume.json                # 简历数据（部署后可被远程加载）
├── src/
│   ├── i18n/
│   │   ├── index.ts               # i18next 初始化（LanguageDetector localStorage）
│   │   └── locales/{zh,en}/translation.json  # 140+ UI 键
│   ├── data/
│   │   ├── defaultResume.json     # 默认简历数据
│   │   ├── defaultResume.ts       # 默认数据 TS 导入
│   │   └── useResumeData.ts       # 远程 resume.json 加载 + 守卫 + 导入/导出
│   ├── schema/
│   │   └── resumeSchema.ts        # zod 4 ResumeConfig 完整 schema（单一类型来源）
│   ├── store/
│   │   └── useResumeStore.ts      # zustand 5 persist + migrate + zod 重入校验
│   ├── components/
│   │   ├── Toolbar.tsx            # 模板 / 语言切换 / Import Export Reload Reset
│   │   ├── App.tsx                # 主容器（草稿恢复 / beforeunload / 实时预览）
│   │   ├── EditorPanel.tsx        # 编辑器主壳（RHF + 200ms 防抖）
│   │   ├── PreviewPanel.tsx       # 预览壳（草稿合并 + 主题色 CSS 变量注入）
│   │   ├── Avatar/                # 纯 DOM 头像组件（支持压缩）
│   │   ├── editor/
│   │   │   ├── BaseForms.tsx      # TextField/Textarea/Checkbox/Select/AvatarForm/ThemeForm
│   │   │   ├── ListForms.tsx      # 6 大列表（教育/工作/项目/技能/奖项/作品集）
│   │   │   └── SortableList.tsx   # dnd-kit 可拖拽条目
│   │   └── resume/
│   │       ├── shared.ts          # getTitle(locale) / getLocalizedResume()
│   │       ├── Template1/         # 模板 1（2:3 分栏 + 阴影 + header 斜切角）
│   │       ├── Template2/         # 模板 2（深色顶栏 + 头像在右侧）
│   │       └── Template3/         # 模板 3（RibbonCard 左右行）
│   ├── styles/
│   │   └── print.less             # @media print A4 样式
│   ├── index.css                  # Tailwind 4 入口 + @theme inline 颜色桥接
│   ├── main.tsx                   # StrictMode root 挂载 + i18n 初始化
│   └── vite-env.d.ts
├── index.html
├── vite.config.ts                 # base = env.BASE_PATH ?? './'（相对路径适配任意子路径）
├── tsconfig.json                  # strict:true / verbatimModuleSyntax / paths @/
├── package.json
├── MIGRATION.md                   # 重构迁移里程碑记录
└── README.md
```

---

## 常用操作

| 需求 | 做法 |
|------|------|
| 导入已有简历 JSON | Toolbar → Import JSON |
| 导出当前简历 | Toolbar → Export JSON（自动 merge 未保存草稿）|
| 远程重新拉取 resume.json | Toolbar → Reload Remote |
| 恢复默认简历 | Toolbar → Reset Default |
| 切换模板 | Toolbar 下拉框，UI 文案 + 分区标题同步切换 |
| 切换界面语言 | Toolbar → Language → 简体中文 / English |
| 切换简历内容到英文 | 切语言到 English；若 `resume.locales.en` 字段存在且合法，预览自动用英文版 |
| 打印 / 导出 PDF | 预览区右上角 🖨️ Print → 打印机选「另存为 PDF」|
| 修改主题色 | 编辑器 → 主题（Theme）→ 颜色输入 / 标签色输入 |
| 上传本地头像 | 编辑器 → 头像（Avatar）→「📁 本地上传」选图，自动压缩 |
| 调整头像尺寸/形状 | 编辑器 → 头像 → 尺寸（小/默认/大）/ 形状（圆/方），预览实时生效 |
| 编辑简历内容（生产） | 编辑 `public/resume.json` → push → Actions 自动部署 |

---

## 开发到部署全流程

```bash
# 1. 拉代码 + 装依赖
git clone https://github.com/<USER>/OnlineResume-Next.git
cd OnlineResume-Next
npm install

# 2. 本地开发（http://localhost:5173，热更新）
npm run dev

# 3. 类型检查 + 生产构建
npm run build

# 4. 本地预览构建产物（验证 BASE_PATH 相对路径）
npm run preview

# 5. 提交并推送 —— 触发 GitHub Actions 自动部署
git add -A
git commit -m "feat: <message>"
git push origin main
```

### 修改简历内容

| 方式 | 说明 |
|------|------|
| 临时预览 | 左侧编辑器改字段，右侧 200 ms 内实时刷新 |
| 本地持久化 | 编辑器改动自动存 localStorage（300 ms 防抖）|
| 生产部署 | 编辑 `public/resume.json` → push → Actions 自动部署 |

### 常见问题速查

| 现象 | 原因 / 解决 |
|------|-------------|
| 一直显示「正在加载简历数据…」 | 远程 resume.json 路径不对或 404；确认 `public/resume.json` 存在且 BASE_PATH 正确 |
| 改了代码看不到效果 | 浏览器缓存；**Ctrl+F5** 强刷 |
| 部署后头像/图标变形 | 模板 hardcode 覆盖动态尺寸；若自行改样式请勿在 less 里写死 width/height |
| Actions 部署 403 | Settings → Actions → General → Workflow permissions 改为 `Read and write permissions` |
| Pages 404 | Settings → Pages → Source 必须选 `GitHub Actions`（不是 Deploy from branch）|

---

## 浏览器兼容

构建目标 `es2020 / chrome90`，覆盖近 3 年主流浏览器（Chrome / Edge / Firefox / Safari）。
