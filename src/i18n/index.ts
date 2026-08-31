import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import zh from './locales/zh/translation.json';
import en from './locales/en/translation.json';
import type { Locale } from '@/store/useResumeStore';

/**
 * i18n 初始化。
 * 语言来源优先级（LanguageDetector 内置）：
 *   querystring(?lng=) → cookie(localStorage) → navigator → fallback zh
 *
 * 注意：语言与 resume 内容 locale（resume.locales[en]）解耦：
 *   - i18n.language 控制 UI 界面文案（按钮、标签、校验消息）
 *   - useResumeStore().locale 控制简历内容的语言（中文默认值 → 英文 locales.en）
 * 两者在 Toolbar 的语言切换时同步更新。
 */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      zh: { translation: zh },
      en: { translation: en },
    },
    fallbackLng: 'zh',
    supportedLngs: ['zh', 'en'] as Locale[],
    lowerCaseLng: true,
    interpolation: { escapeValue: false }, // React 已转义
    detection: {
      lookupLocalStorage: 'resume-next-lang',
      order: ['localStorage', 'navigator', 'querystring'],
      caches: ['localStorage'],
    },
  });

export default i18n;
