import { useTranslation } from 'react-i18next';
import { useResumeStore } from '@/store/useResumeStore';
import type { ResumeConfig } from '@/schema/resumeSchema';
import { Template1 } from './resume/Template1';
import { Template2 } from './resume/Template2';
import { Template3 } from './resume/Template3';
import type { CSSProperties } from 'react';
import { getLocalizedResume } from './resume/shared';

type PreviewProps = {
  resume: ResumeConfig;
  locale: 'zh' | 'en';
};

/** 把 resume.theme 注入为 CSS 变量 */
function withTheme(props: PreviewProps, children: React.ReactNode) {
  const { resume } = props;
  const style: CSSProperties = {
    '--resume-color': resume.theme?.color ?? '#5b8ff9',
    '--resume-tag-color': resume.theme?.tagColor ?? '#8bc34a',
  } as CSSProperties;
  return <div style={style} className="resume-preview">{children}</div>;
}

type PreviewPanelProps = {
  /** 如果传了，就用覆盖版（编辑器草稿合并后的实时预览），否则从 store 拿 */
  overrideResume?: ResumeConfig;
};

/** 简历预览面板：按 store.template 切换模板 */
export default function PreviewPanel({ overrideResume }: PreviewPanelProps) {
  const { t } = useTranslation();
  const storeResume = useResumeStore((s) => s.resume);
  const template = useResumeStore((s) => s.template);
  const locale = useResumeStore((s) => s.locale);

  // 草稿覆盖优先
  const resume = overrideResume ?? storeResume;
  const localizedResume = getLocalizedResume(resume, locale);

  let content: React.ReactNode = null;
  switch (template) {
    case 'template2':
      content = <Template2 value={localizedResume} locale={locale} />;
      break;
    case 'template3':
      content = <Template3 value={localizedResume} locale={locale} />;
      break;
    case 'template1':
    default:
      content = <Template1 value={localizedResume} locale={locale} />;
      break;
  }

  return (
    <div className="app-preview-outer rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6 overflow-hidden">
      <div className="preview-panel-header text-sm text-gray-500 mb-3 flex items-center justify-between">
        <span>{t('preview.title')} · {template}</span>
        <button
          className="text-xs text-resume hover:underline"
          onClick={() => window.print()}
        >
          {t('preview.print')}
        </button>
      </div>
      <div className="app-preview-panel flex justify-center bg-gray-50 p-2 md:p-4 rounded overflow-auto app-resume-paper">
        <div className="app-preview-inner">
          {withTheme({ resume: localizedResume, locale }, content)}
        </div>
      </div>
    </div>
  );
}
