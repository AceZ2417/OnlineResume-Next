import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { resumeSchema, type ResumeConfig } from '@/schema/resumeSchema';
import { defaultResume } from '@/data/defaultResume';

export type Locale = 'zh' | 'en';

type ResumeStore = {
  /** 当前简历数据（纯内容，不含视图偏好） */
  resume: ResumeConfig;
  /** 当前模板（视图偏好，独立于 resume 内容，不进导出数据） */
  template: string;
  /** 界面语言（视图偏好；文案 i18n 在阶段 5 实现） */
  locale: Locale;
  setResume: (resume: ResumeConfig) => void;
  setTemplate: (template: string) => void;
  setLocale: (locale: Locale) => void;
  /** 恢复默认：内容 + 视图偏好一起重置 */
  reset: () => void;
};

/**
 * persist version 从 1 开始（0 有特殊含义）。
 * 未来 schema 变更时递增 version 并补 migrate 函数即可。
 */
const STORAGE_VERSION = 1;

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resume: defaultResume,
      template: 'template1',
      locale: 'zh',
      setResume: (resume) => set({ resume }),
      setTemplate: (template) => set({ template }),
      setLocale: (locale) => set({ locale }),
      reset: () => set({ resume: defaultResume, template: 'template1', locale: 'zh' }),
    }),
    {
      name: 'resume-next-storage',
      version: STORAGE_VERSION,
      /** 只持久化内容与视图偏好，函数自动排除 */
      partialize: (state) => ({
        resume: state.resume,
        template: state.template,
        locale: state.locale,
      }),
      /**
       * 迁移占位：schema 不变时空实现即可。
       * 当 version 递增时，这里负责把旧格式数据转换为新格式。
       */
      migrate: (persistedState) => persistedState as ResumeStore,
      /**
       * 从 localStorage 恢复数据后用 zod 再校验一次。
       * 如果用户手动篡改了 localStorage 或旧版数据格式不兼容，
       * 这里会捕获 ZodError 并回退到 defaultResume。
       */
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const result = resumeSchema.safeParse(state.resume);
        if (!result.success) {
          console.warn(
            '[store] localStorage 中的简历数据校验失败，已回退默认值。',
            result.error.flatten(),
          );
          useResumeStore.setState({ resume: defaultResume });
        }
      },
    },
  ),
);
