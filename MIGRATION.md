# resume-next 迁移任务清单

> 旧项目：Gatsby 2 + React 17 + antd 4 + less（`OnlineRresume/`）
> 新项目：Vite 6 + React 19 + TypeScript（本目录 `resume-next/`）
> 原则：**resume.json 数据结构是唯一资产，全程保持字段兼容**；每个阶段独立可验收、可上线。

图例：`[ ]` 待办 · `[~]` 进行中 · `[x]` 完成

---

## 阶段 0：项目骨架 ✅（已完成）

- [x] Vite 6 + React 19 + TS 5.8 脚手架（strict 模式，`@` 路径别名）
- [x] 类型移植：`src/types/resume.ts`（ResumeConfig / ThemeConfig，与旧版字段兼容，theme 并入主类型）
- [x] 数据移植：`src/data/defaultResume.json`（旧项目 personal resume.json 完整拷贝）+ `public/resume.json`
- [x] zustand store：`useResumeStore`（setResume / reset，localStorage 持久化）
- [x] 演示页：App.tsx 读取 store 展示姓名/职位/联系方式/头像
- [x] GitHub Pages 部署工作流（官方 upload-pages-artifact + deploy-pages 流程）
- [x] README 与本清单

**验收**：`npm run build` 通过；`npm run dev` 能显示默认简历数据。

---

## 阶段 1：数据层完善

- [x] 引入 `zod`：定义 `resumeSchema`，替代 `defaultResume.ts` 中的 `as unknown as` 断言
- [x] JSON 加载策略：启动时 `fetch('${BASE_URL}resume.json')` → zod 校验 → 写入 store；失败回退内置默认数据
- [x] 导入/导出：`importResumeFromFile` / `downloadResume` / `exportResumeJson` 工具函数（UI 在 App.tsx 骨架中演示）
- [x] 版本化迁移：store 增加 `version: 1` + `migrate` 占位；`onRehydrateStorage` 用 zod 校验 localStorage 数据
- [ ] 确认旧版编辑器 localStorage key，提供旧数据一键迁移读取（可选）

**验收**：篡改 resume.json 字段时 zod 能报出明确错误路径；刷新页面数据不丢。

---

## 阶段 2：UI 框架与布局 ✅（已完成）

- [x] **决策点 A**：选定 `Tailwind CSS 4`（用户决策；经 `@tailwindcss/vite` 官方插件接入，CSS-first 配置无 tailwind.config.js）
- [x] 整体布局：左侧编辑器占位 / 右侧实时预览（PC 端 `md:grid-cols-[2fr_3fr]`），移动端 Tab 切换
- [x] 主题色系统：`theme.color` → CSS 变量（`--resume-color`）→ `@theme inline` 注册为 Tailwind token（`bg-resume` / `border-resume` / `text-resume`，透明度修饰符自动支持）
- [x] 顶部工具栏：模板切换、语言切换、导入/导出 JSON、重载远程、恢复默认
- [x] 架构调整：`template` / `locale` 作为 store 顶层视图偏好字段（`partialize` 持久化），不再写入 resume 内容——保证导出 JSON 纯净、数据守卫不受视图切换影响

**验收**：PC/移动端布局可用；切换主题色预览区即时变色。

---

## 阶段 3：模板移植（核心资产）✅（已完成）

- [x] 移植 `Avatar` 组件（纯 DOM 实现，支持 shape/size/hidden，去 antd 依赖）
- [x] 移植 Template1（2:3 分栏 + 阴影 + header 斜切角标签；basic-info / educationList / workExpList / projectList / skillList / awardList / workList / aboutme 全部分区）
- [x] 移植 Template2（顶部深色横栏 + 左 1fr/右 2fr 分栏 + 头像在 profile-info 行右侧）
- [x] 移植 Template3（色带卡角 RibbonCard 容器 + 头像行 + 1:1 网格分区）
- [x] 样式方案：保留 `.less`（Vite 原生支持），全局 less 作用域，每个模板独立 `index.less`；全局 UI 用 Tailwind 4（分阶段迁移）
- [x] 打印样式：每个模板各自 `@media print { @page { size: A4; } ... }`，预览面板附带"🖨️ 打印 / 导出 PDF"按钮
- [x] i18n 文案：分区标题读取 `titleNameMap`，缺省回退中文（`shared.ts` 提供 `getTitle`）

**验收**：三个模板渲染你的简历数据（周俊），主题色跟随 `resume.theme.color` 实时生效；浏览器打印预览为标准 A4。

---

## 阶段 4：编辑器表单

- [ ] **决策点 B（二选一）**：
  - `antd Form`：与旧版交互一致，迁移快
  - `react-hook-form + zod`：类型安全更好，与阶段 1 的 schema 直接复用
- [ ] 分组表单：基本信息 / 教育 / 工作 / 项目 / 技能 / 奖项 / 作品 / 自我介绍
- [ ] 列表项增删、拖拽排序（推荐 `@dnd-kit/core` 替代旧版 react-dnd）
- [ ] 表单 → store 双向同步（受控 + debounce 持久化）
- [ ] 头像设置：src、shape、size、hidden
- [ ] 多语言副本编辑（`locales`，可选，最后做）

**验收**：编辑任意字段预览区实时更新；刷新后数据保持。

---

## 阶段 5：功能补齐

- [ ] i18n：`react-i18next` + zh-CN / en-US 语言包（界面文案，非简历内容）
- [ ] URL 分享：`json-url` 或 `lz-string` 压缩简历数据到 query 参数，生成分享链接
- [ ] Google Analytics：gtag 脚本注入（可环境变量开关）
- [ ] 空状态与错误边界：数据损坏时的兜底 UI

**验收**：分享链接打开后完整还原简历；中英界面可切换。

---

## 阶段 6：质量与收尾

- [ ] ESLint 9（flat config）+ Prettier 统一，接入 CI 检查
- [ ] Vitest + Testing Library：store / zod schema / 工具函数单测
- [ ] 构建体积分析（`rollup-plugin-visualizer`），目标 gzip < 200KB（不含字体）
- [ ] Lighthouse：Performance / Best Practices ≥ 90
- [ ] README 截图与在线地址更新

**验收**：CI 全绿；bundle 体积与 Lighthouse 达标。

---

## 阶段 7：上线切换

- [ ] 在 GitHub 创建新仓库 `resume-next`（Public）
- [ ] 把本目录内容推送到新仓库（见下方命令），**不要**把外层 OnlineRresume 历史带进去
- [ ] 新仓库 Settings → Pages → Source 选 **GitHub Actions**
- [ ] 确认线上地址：`https://acez2417.github.io/resume-next/`（仓库名不同则改 `vite.config.ts` 的 `base`）
- [ ] 旧仓库 `OnlineRresume` 处理：保留运行一段时间，README 顶部加"已迁移"提示与跳转链接
- [ ] 全部验证通过后，可归档旧仓库（Settings → General → Archive）

### 推送到新仓库的命令

```powershell
# 在 resume-next 目录内执行
git init
git config user.name "AceZ2417"
git config user.email "AceZ2417@users.noreply.github.com"
git add .
git commit -m "chore: Vite + React 19 重构骨架"
git branch -M master
git remote add origin https://github.com/AceZ2417/resume-next.git
git push -u origin master
```

> 注意：若先在 GitHub 上建了带 README 的仓库，push 前先 `git pull origin master --allow-unrelated-histories` 或建仓时不勾选初始化文件。

---

## 关键决策记录

| 日期 | 决策 | 理由 |
|------|------|------|
| 2026-08-30 | 采用 Vite SPA 而非 Next/Astro | 单页工具应用，无需 SSR/SSG；GitHub Pages 静态托管 |
| 2026-08-30 | resume.json 字段 100% 兼容旧版 | 数据是唯一资产，老用户零迁移成本 |
| 2026-08-30 | 部署改用官方 deploy-pages 流程 | 摒弃 gh-pages 分支方案，消除部署提交/缓存/Source 清空问题 |
| 2026-08-30 | 骨架先置于 OnlineRresume/resume-next | 沙箱仅允许写当前项目目录；迁出为独立仓库只需整体移动 |
| 2026-08-31 | 阶段 2 选定 Tailwind CSS 4（@tailwindcss/vite 插件） | 用户决策；CSS-first 零配置，主题色经 @theme inline 桥接 CSS 变量 |
| 2026-08-31 | template/locale 作为 store 顶层字段，不写入 resume | 视图偏好与内容分离：导出 JSON 纯净、isSameAsDefault 守卫不被视图切换触发 |
