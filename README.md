# Resume Next · 现代化在线简历编辑器

基于 **Vite 6 + React 19 + TypeScript 5.8 + Tailwind CSS 4** 的纯前端简历 SPA，替代旧的 Gatsby 2 仓库。

- 📝 左编辑器（react-hook-form + zod 校验 + dnd-kit 拖拽排序）
- 👁️ 右预览（3 套模板，与旧版视觉一致，less 写法保留）
- 🌐 中英双语 UI + 简历内容切换（react-i18next，localStorage 记忆偏好）
- ⚡ **实时预览**：改字段 200 ms 内同步刷新，无需点保存
- 💾 **草稿自动保存**：浏览器意外关闭可恢复，未保存关标签 confirm 提示
- 🖨️ 一键 **打印 / 导出 PDF**（A4 尺寸，隐藏全部 UI，`print-color-adjust: exact`）
- 🚀 官方 **GitHub Pages** Actions 部署，无需 gh-pages 分支

---

## 快速开始

```bash
npm install
npm run dev       # 开发模式：http://localhost:5173
npm run build     # 类型检查 + 生产构建（产物在 dist/）
npm run preview   # 预览 dist 构建
```

> **运行环境**：推荐 Node.js 24 LTS（与 GitHub Actions 工作流一致），最低兼容 Node.js 20+；npm ≥ 10。
>
> 主流浏览器（Chrome / Edge / Firefox / Safari 近 3 年版本）开箱即用，构建目标 `es2020 / chrome90`。

打开浏览器访问 http://localhost:5173/ ，默认从本项目 `public/resume.json`（部署后即 `<BASE_URL>resume.json`）加载简历；远程不可用时自动降级到内置默认数据。

---

## 核心特性一览

| 能力 | 实现 |
|------|------|
| 数据 Schema & 校验 | **zod 4**（`src/schema/resumeSchema.ts`），所有 `ResumeConfig` 类型均由 `z.infer<>` 生成，单一真相源 |
| 状态管理 | **zustand 5 persist**（localStorage key = `resume-next-storage`），仅持久化 `resume / template / locale` |
| UI 框架 | **Tailwind CSS 4**（`@tailwindcss/vite` 插件、CSS-first，无 `tailwind.config.js`）|
| 主题色桥接 | `--resume-color` / `--resume-tag-color` → `@theme inline` → `bg-resume / text-resume / border-resume` |
| 表单 | **react-hook-form 7**，手写 `resumeResolver()` 适配 zod 4（`@hookform/resolvers` 暂不兼容 zod v4）|
| 拖拽排序 | **@dnd-kit/core + @dnd-kit/sortable**，RHF `useFieldArray` 语义对齐 |
| 国际化 | **react-i18next + i18next-browser-languagedetector**（UI key 与简历内容 `locales.en` 双路）|
| 打印 | `@media print` 独立样式，A4 单张输出背景色 |
| 草稿 | 独立 key `resume-next-draft`，300 ms 防抖自动保存，启动时提示恢复 |
| 头像 | 纯 DOM `Avatar` 组件（脱离 antd Avatar），尺寸支持 small/default/large/数字像素，**本地上传自动 Canvas 压缩到 ≤800px JPEG 0.85** 防止 localStorage 超限 |
| 图标 | 模板图标统一使用 `@ant-design/icons` SVG 图标（MobileFilled / PhoneFilled / CrownFilled …），8px margin、主题色、0.85 opacity，1:1 对齐旧版视觉 |
| 构建 | `tsc --noEmit` + Vite rollup，产物 gzip ≈ 153 KB + 6.2 KB CSS |

---

## 目录结构

```
resume-next/
├── .github/workflows/deploy.yml   # GitHub Pages 官方 Actions 部署
├── src/
│   ├── i18n/
│   │   ├── index.ts               # i18next 初始化（LanguageDetector localStorage）
│   │   └── locales/{zh,en}/translation.json   # 140+ UI 键，toolbar/editor/preview/app 四大域
│   ├── data/
│   │   └── useResumeData.ts       # 远程 resume.json 加载 + 守卫 + 导入/导出
│   ├── schema/
│   │   └── resumeSchema.ts        # zod 4 ResumeConfig 完整 schema（单一类型来源）
│   ├── store/
│   │   └── useResumeStore.ts      # zustand 5 persist + migrate(version:1) + zod 重入校验
│   ├── components/
│   │   ├── Toolbar.tsx            # 模板 / 语言切换 / Import Export Reload Reset
│   │   ├── App.tsx                # 主容器（草稿恢复 / beforeunload / overrideResume 实时预览）
│   │   ├── EditorPanel.tsx        # 编辑器主壳（RHF useForm + 字段 watch 防抖 200ms）
│   │   ├── PreviewPanel.tsx       # 预览壳（overrideResume 优先 + 主题色 CSS 变量注入）
│   │   ├── editor/
│   │   │   ├── BaseForms.tsx      # TextField/Textarea/Checkbox/Select/AvatarForm/ThemeForm 等 100% t()
│   │   │   ├── ListForms.tsx      # 6 大列表（教育 / 工作 / 项目 / 技能 / 奖项 / 作品集）
│   │   │   └── SortableList.tsx   # dnd-kit 可拖拽条目（+ 删除按钮 tooltip）
│   │   └── resume/
│   │       ├── shared.ts          # getTitle(locale) / getLocalizedResume()
│   │       ├── Template1/         # 模板 1（less 样式 1:1 移植）
│   │       ├── Template2/         # 模板 2（含头像）
│   │       └── Template3/         # 模板 3（RibbonCard 左右行：profile-info + profile-avatar）
│   ├── styles/print.less          # @media print A4 样式
│   ├── index.css                  # Tailwind 4 入口 + @theme inline 颜色桥接
│   └── main.tsx                   # StrictMode root 挂载 + print.less + i18n 初始化
├── vite.config.ts                 # base = env.BASE_PATH ?? './'（相对路径适配任意子路径）
├── tsconfig.json                  # strict:true / verbatimModuleSyntax / paths @/
└── package.json                   # homepage = https://AceZ2417.github.io/OnlineResume-Next/
```

---

## 7 阶段重构里程碑

从 Gatsby 2 迁移到现代化 SPA 的完整过程（每阶段独立可构建）：

| 阶段 | 主题 | 交付 |
|------|------|------|
| 0 | 骨架搭建 | Vite + React 19 + TS 5.8 项目启动 + Pages 工作流占位 |
| 1 | 数据层 | zod schema / 远程 resume.json 加载 / zustand persist / Import Export JSON |
| 2 | 布局 UI | Tailwind CSS 4、左右布局（2fr / 3fr）、移动端 Tab 切换、主题色 token |
| 3 | 模板 + 头像 | Template 1 / 2 / 3 less 样式移植，Template 3 RibbonCard + 头像 |
| 4 | 编辑器表单 | RHF + 自写 zod v4 resolver + useFieldArray + dnd-kit 拖拽排序 |
| 5 | i18n 双语 | react-i18next + LanguageDetector，zh/en UI + resume.locales.en 内容切换 |
| 6 | 用户体验 | 实时预览（200 ms 防抖）+ 草稿自动保存（300 ms）+ beforeunload + @media print A4 |
| 7 | 部署 + 文档 | 官方 Pages Actions 工作流 + README + 自动 BASE_PATH（仓库名自适应）|

---

## 部署到 GitHub Pages（一键）

工作流 `.github/workflows/deploy.yml` 使用 GitHub **官方** `actions/deploy-pages`（不用 `peaceiris/actions-gh-pages`），无需配置密钥。

### 步骤

1. 在 GitHub 新建仓库，如 `AceZ2417/OnlineResume-Next`（名字随意）。
2. 把本目录内容 push 到 `main` 分支：
   ```bash
   cd resume-next
   git init
   git add -A
   git commit -m "chore: init resume-next"
   git branch -M main
   git remote add origin https://github.com/<USER>/<REPO>.git
   git push -u origin main
   ```
3. 仓库 **Settings → Pages**：
   - **Source** 选 `GitHub Actions`（**不是** Deploy from branch）
4. 仓库 **Settings → Actions → General**：确认 `Workflow permissions` 为 `Read and write permissions`（给 Pages token 写权限）。
5. 等 Actions 跑完 → 打开 `https://<USER>.github.io/<REPO>/`。

> 💡 工作流会**自动根据仓库名计算 base 路径**：
> - 仓库是 `<USER>.github.io` → `BASE_PATH="/"` （根域名部署）
> - 其它仓库名 → `BASE_PATH="/<REPO>/"` （项目页子路径，例如 OnlineResume-Next → `/OnlineResume-Next/`）

### 自定义域名

在 Pages 页面填你的域名 → 仓库根目录加 `CNAME` 文件（或 Settings 里填就行，Pages 会自动生成 CNAME artifact）。工作流会自动产出 `dist/`，CNAME 会被 Pages 服务器保存。

---

## 常用操作

| 需求 | 做法 |
|------|------|
| 导入已有简历 JSON | Toolbar → Import JSON |
| 导出当前简历（含未保存草稿） | Toolbar → Export JSON（会自动 merge 草稿合法字段）|
| 远程重新拉取 resume.json | Toolbar → Reload Remote |
| 恢复默认简历 | Toolbar → Reset Default |
| 切模板 / 切语言 | Toolbar 对应下拉框，UI 文案 + 分区标题同步切换 |
| 切换简历内容到英文 | 切语言到 English；如果 `resume.locales.en` 字段存在且合法，预览自动使用英文版内容 |
| 打印 / 导出 PDF | 预览区右上角 🖨️ Print → 打印机选「另存为 PDF」即可 |
| 修改主题色 | 编辑器 → 主题（Theme）→ 颜色输入 / 标签色输入 |
| 上传本地头像 | 编辑器 → 头像（Avatar）→ 「📁 本地上传」选图，自动压缩；URL 字段留空时可用「清除头像」移除 |
| 调整头像尺寸/形状 | 编辑器 → 头像 → 尺寸（小/默认/大）/ 形状（圆/方），预览实时生效 |

---

## 浏览器兼容

构建目标 `es2020 / chrome90`，覆盖近 3 年主流浏览器（Chrome / Edge / Firefox / Safari）。

---

## 开发到部署全流程

一条命令链串起从拉代码到上线：

```bash
# 1. 拉代码 + 装依赖（Node 24 推荐，Node 20+ 兼容）
git clone https://github.com/<USER>/OnlineResume-Next.git
cd OnlineResume-Next
npm install

# 2. 本地开发（http://localhost:5173，热更新）
npm run dev

# 3. 类型检查 + 生产构建（产物在 dist/）
npm run build

# 4. 本地预览构建产物（验证 BASE_PATH='./' 相对路径）
npm run preview

# 5. 提交并推送到 main —— 触发 GitHub Actions 自动部署
git add -A
git commit -m "feat: <message>"
git push origin main
```

> 推送后到仓库 **Actions** 页查看部署进度，跑完即可访问 `https://<USER>.github.io/<REPO>/`。
> 部署后浏览器可能缓存旧版，按 **Ctrl+F5 / Ctrl+Shift+R** 强刷即可看到最新效果。

### 修改简历内容

- **临时预览**：左侧编辑器改字段，右侧 200 ms 内实时刷新。
- **永久保存**：点编辑器底部「保存到简历」写入 zustand persist（localStorage key = `resume-next-storage`）。
- **生产部署**：编辑 `public/resume.json`（仓库内），push 后 Actions 会把最新 JSON 一并部署到 Pages。

### 常见问题速查

| 现象 | 原因 / 解决 |
|------|-------------|
| 一直显示「正在加载简历数据…」 | 远程 resume.json 路径不对或 404；确认 `public/resume.json` 存在且 BASE_PATH 正确 |
| 改了代码看不到效果 | 浏览器缓存；Ctrl+F5 强刷 |
| 部署后头像/图标变形 | 模板 hardcode 覆盖动态尺寸；已移除，若自行改样式请勿在 less 里写死 width/height |
| Actions 部署 403 | 仓库 Settings → Actions → General → Workflow permissions 改为 `Read and write permissions` |
| Pages 404 | Settings → Pages → Source 必须选 `GitHub Actions`（不是 Deploy from branch）|
