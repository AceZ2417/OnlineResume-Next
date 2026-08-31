import { useCallback, useEffect, useState } from 'react';
import { resumeSchema, type ResumeConfig } from '@/schema/resumeSchema';
import { defaultResume } from '@/data/defaultResume';
import { useResumeStore } from '@/store/useResumeStore';

/**
 * 深度比较 store 当前数据与 defaultResume 是否一致。
 * 一致 → 用户未做过本地编辑 → 可以用远程 JSON 覆盖（拿到最新版本）
 * 不一致 → 用户有本地编辑 → 跳过远程，保留用户数据
 *
 * 使用 JSON.stringify 比较（性能足够，简历数据 < 10KB）。
 * 两个值都经过 zod.parse，字段顺序一致，stringify 结果可信。
 */
function isSameAsDefault(a: ResumeConfig): boolean {
  return JSON.stringify(a) === JSON.stringify(defaultResume);
}

/**
 * 远程简历 JSON 的绝对地址（注意：新仓库 OnlineResume-Next 本身没有实时数据）。
 * 线上简历是旧 Gatsby 2 站在 OnlineRresume Pages 下的静态资源：
 *   旧仓库文件 static/resume/resume.json
 *   → Gatsby build 时拷贝到 Pages 子路径 /resume/resume.json
 *   → 线上地址：https://acez2417.github.io/OnlineRresume/resume/resume.json（已验证可访问）。
 */
export const REMOTE_RESUME_URL =
  'https://acez2417.github.io/OnlineRresume/resume/resume.json';

const FETCH_TIMEOUT_MS = 8_000;

export function useResumeData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setResume = useResumeStore((s) => s.setResume);
  const reset = useResumeStore((s) => s.reset);
  const currentResume = useResumeStore((s) => s.resume);
  // persist 重新水化完成后才允许读取 localStorage 里的权威数据
  const hasHydrated = useResumeStore.persist.hasHydrated();

  useEffect(() => {
    let cancelled = false;

    // 1. Zustand persist 尚未完成 localStorage 读取 → 无法判断 isSameAsDefault，
    //    直接 return，下一次重渲染（hydrate 后 state 更新触发 useEffect 重跑）。
    if (!hasHydrated) return;

    // 2. 守卫：只有当用户未做过本地编辑时，才用远程 JSON 覆盖。
    //    否则 localStorage 中的用户编辑数据是权威，跳过远程。
    if (!isSameAsDefault(currentResume)) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(new Error('fetch timeout')),
      FETCH_TIMEOUT_MS,
    );

    fetch(REMOTE_RESUME_URL, { signal: controller.signal, cache: 'no-store' })
      .then(async (resp) => {
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        return resp.json();
      })
      .then((raw) => {
        if (cancelled) return;
        const result = resumeSchema.safeParse(raw);
        if (!result.success) {
          throw new Error(result.error.flatten().formErrors.join(', ') || 'schema mismatch');
        }
        setResume(result.data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error
            ? err.name === 'AbortError'
              ? 'timeout'
              : err.message
            : String(err);
        console.warn('[useResumeData] 远程 resume.json 加载失败，使用内置默认数据。', message);
        setError(message);
        // 不调用 setResume，store 初始值已经是 defaultResume
      })
      .finally(() => {
        window.clearTimeout(timeoutId);
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
    // 显式依赖 hasHydrated：hydrate 完成会触发重渲染，useEffect 重新执行
  }, [setResume, currentResume, hasHydrated]);

  /** 手动触发重新加载 */
  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(new Error('fetch timeout')),
      FETCH_TIMEOUT_MS,
    );
    fetch(`${REMOTE_RESUME_URL}?t=${Date.now()}`, {
      signal: controller.signal,
      cache: 'no-store',
    })
      .then((resp) => {
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        return resp.json();
      })
      .then((raw) => {
        const result = resumeSchema.safeParse(raw);
        if (!result.success) throw new Error('schema mismatch');
        setResume(result.data);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        window.clearTimeout(timeoutId);
        setLoading(false);
      });
  }, [setResume]);

  /** 手动恢复默认数据（忽略远程文件） */
  const fallback = useCallback(() => {
    reset();
    setError(null);
  }, [reset]);

  return { loading, error, reload, fallback };
}

/* ---------- Import / Export 工具函数 ---------- */

/**
 * 导出当前简历数据为 JSON 字符串（格式化，带 zod 校验）。
 */
export function exportResumeJson(data: ResumeConfig): string {
  const validated = resumeSchema.parse(data);
  return JSON.stringify(validated, null, 2);
}

/**
 * 从 File 对象导入简历数据。
 * @returns 解析后的 ResumeConfig，失败时抛 ZodError 或 SyntaxError
 */
export async function importResumeFromFile(file: File): Promise<ResumeConfig> {
  const text = await file.text();
  const raw = JSON.parse(text);
  return resumeSchema.parse(raw);
}

/**
 * 触发浏览器下载当前简历数据为 resume.json。
 */
export function downloadResume(data: ResumeConfig): void {
  const json = exportResumeJson(data);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resume.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
