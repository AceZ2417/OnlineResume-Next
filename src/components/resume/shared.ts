import type { ResumeConfig } from '@/schema/resumeSchema';
import type { Locale } from '@/store/useResumeStore';
import { resumeSchema } from '@/schema/resumeSchema';

export type TitleKey = keyof NonNullable<ResumeConfig['titleNameMap']>;

const DEFAULT_TITLES: Record<Locale, Record<TitleKey, string>> = {
  zh: {
    educationList: '教育背景',
    workExpList: '工作经历',
    projectList: '项目经验',
    skillList: '个人技能',
    awardList: '更多信息',
    workList: '个人作品',
    aboutme: '个人评价',
  },
  en: {
    educationList: 'Education',
    workExpList: 'Work Experience',
    projectList: 'Projects',
    skillList: 'Skills',
    awardList: 'More Info',
    workList: 'Works',
    aboutme: 'Self Introduction',
  },
};

/**
 * 标题查找优先级：
 *   1) resume.titleNameMap[key]（用户自定义）
 *   2) DEFAULT_TITLES[locale][key]（按当前语言默认）
 *   3) String(key)
 */
export function getTitle(value: ResumeConfig, key: TitleKey, locale: Locale = 'zh'): string {
  const userTitle = (value.titleNameMap as Record<TitleKey, string | undefined> | undefined)?.[key];
  return userTitle ?? DEFAULT_TITLES[locale]?.[key] ?? String(key);
}

export function splitLines(text: string | null | undefined): string[] {
  if (!text) return [];
  return text.split('\n').filter((s, idx, arr) => s || idx === arr.length - 1);
}

/**
 * 返回当前语言对应的简历内容：
 *   - zh：使用 resume 原始对象
 *   - en：优先使用 resume.locales?.en（zod 校验合法），否则退回原始 zh
 */
export function getLocalizedResume(resume: ResumeConfig, locale: Locale): ResumeConfig {
  if (locale !== 'en') return resume;
  const localeData = resume.locales?.en;
  if (!localeData) return resume;
  const parsed = resumeSchema.safeParse(localeData);
  return parsed.success ? parsed.data : resume;
}
