import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Vite 基础路径：
 *   - 开发模式：默认 /
 *   - 生产模式：优先使用环境变量 BASE_PATH
 *       • 部署到 GitHub Pages 仓库子路径：BASE_PATH="/<repo-name>/"
 *       • 部署到自定义域名根目录：BASE_PATH="/"
 *       • 未设定时默认 "./"（相对路径，放入任何子路径都可直接打开）
 *
 * GitHub Actions 工作流会自动注入 BASE_PATH（见 .github/workflows/deploy.yml）。
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base =
    mode === 'production'
      ? env.BASE_PATH ?? './'
      : '/';
  return {
    plugins: [react(), tailwindcss()],
    base,
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    build: {
      target: 'es2020',
      cssTarget: 'chrome90',
    },
  };
});
