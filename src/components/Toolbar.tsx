import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useResumeStore, type Locale } from '@/store/useResumeStore';

const TEMPLATES = [
  { value: 'template1', labelCn: '模板 1', labelEn: 'Template 1' },
  { value: 'template2', labelCn: '模板 2', labelEn: 'Template 2' },
  { value: 'template3', labelCn: '模板 3', labelEn: 'Template 3' },
];

type ToolbarProps = {
  onImport: () => void;
  onExport: () => void;
  onReload: () => void;
  onReset: () => void;
};

export default function Toolbar({ onImport, onExport, onReload, onReset }: ToolbarProps) {
  const { t, i18n } = useTranslation();
  const template = useResumeStore((s) => s.template);
  const locale = useResumeStore((s) => s.locale);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const setLocale = useResumeStore((s) => s.setLocale);

  /**
   * 当 Toolbar 语言下拉改变 store.locale 时，同步 i18n.language。
   * 反过来，i18n 如果从 localStorage/query 恢复语言，也要同步 store。
   */
  useEffect(() => {
    if (i18n.resolvedLanguage && i18n.resolvedLanguage !== locale) {
      const resolved = i18n.resolvedLanguage.slice(0, 2).toLowerCase() as Locale;
      if (resolved === 'zh' || resolved === 'en') setLocale(resolved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLocaleChange = (next: Locale) => {
    setLocale(next);
    i18n.changeLanguage(next);
  };

  const localeEn = locale === 'en';

  const selectCls =
    'rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 focus:border-resume focus:outline-none';
  const btnCls =
    'rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:border-resume hover:text-resume';

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
        <span className="text-lg font-bold tracking-tight">
          Online <span className="text-resume">Resume</span>
        </span>

        <select
          className={selectCls}
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          aria-label={t('toolbar.template')}
        >
          {TEMPLATES.map((t) => (
            <option key={t.value} value={t.value}>
              {localeEn ? t.labelEn : t.labelCn}
            </option>
          ))}
        </select>

        <select
          className={selectCls}
          value={locale}
          onChange={(e) => handleLocaleChange(e.target.value as Locale)}
          aria-label={t('toolbar.language')}
        >
          <option value="zh">中文</option>
          <option value="en">English</option>
        </select>

        <div className="ml-auto flex flex-wrap gap-2">
          <button className={btnCls} onClick={onImport}>{t('toolbar.import')}</button>
          <button className={btnCls} onClick={onExport}>{t('toolbar.export')}</button>
          <button className={btnCls} onClick={onReload}>{t('toolbar.reload')}</button>
          <button className={btnCls} onClick={onReset}>{t('toolbar.reset')}</button>
        </div>
      </div>
    </header>
  );
}
