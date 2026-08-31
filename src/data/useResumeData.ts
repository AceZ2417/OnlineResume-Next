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
 * 远程 resume.json 加载器。
 * 启动时尝试从 ${BASE_URL}resume.json 加载并校验，
 * 仅当用户未编辑过本地数据时才覆盖 store；
 * 失败（网络 / 校验）时静默回退内置默认数据。
 *
 * BASE_URL 由 Vite 注入：
 *   开发模式 "/" → "resume.json"
 *   生产模式 "/resume-next/" → "/resume-next/resume.json"
 */
export function useResumeData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setResume = useResumeStore((s) => s.setResume);
  const reset = useResumeStore((s) => s.reset);
  const currentResume = useResumeStore((s) => s.resume);

  useEffect(() => {
    let cancelled = false;
    const url = `${import.meta.env.BASE_URL}resume.json`;

    /**
     * 守卫：只有当用户未做过本地编辑时，才用远程 JSON 覆盖。
     * 否则 localStorage 中的用户编辑数据是权威，跳过远程。
     */
    if (!isSameAsDefault(currentResume)) {
      setLoading(false);
      return;
    }

    fetch(url)
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
        const message = err instanceof Error ? err.message : String(err);
        console.warn('[useResumeData] 远程 resume.json 加载失败，使用内置默认数据。', message);
        setError(message);
        // 不调用 setResume，store 初始值已经是 defaultResume
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [setResume, currentResume]);

  /** 手动触发重新加载 */
  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    // 强制刷新 fetch 缓存
    const url = `${import.meta.env.BASE_URL}resume.json?t=${Date.now()}`;
    fetch(url)
      .then((resp) => resp.json())
      .then((raw) => {
        const result = resumeSchema.safeParse(raw);
        if (!result.success) throw new Error('schema mismatch');
        setResume(result.data);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => setLoading(false));
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

/** 远程 URL （BASE_URL 拼接） */
export const REMOTE_RESUME_URL = `${import.meta.env.BASE_URL}resume.json`;
