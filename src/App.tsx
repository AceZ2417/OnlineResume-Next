import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import Toolbar from '@/components/Toolbar';
import EditorPanel from '@/components/EditorPanel';
import PreviewPanel from '@/components/PreviewPanel';
import { useResumeStore } from '@/store/useResumeStore';
import type { ResumeConfig } from '@/schema/resumeSchema';
import { resumeSchema } from '@/schema/resumeSchema';
import { useResumeData, downloadResume, importResumeFromFile } from '@/data/useResumeData';

/* ---------------- 草稿自动保存 ---------------- */
const DRAFT_KEY = 'resume-next-draft';

function loadDraft(): Partial<ResumeConfig> | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // 草稿不强制字段完整，只做浅结构检查（必须是对象）
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Partial<ResumeConfig>;
    }
    return null;
  } catch {
    return null;
  }
}

function saveDraft(data: Partial<ResumeConfig> | undefined) {
  if (!data) return;
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    /* 隐私模式/配额超，静默忽略 */
  }
}

function useDraftAutoSave(get: () => Partial<ResumeConfig>, deps: React.DependencyList) {
  const timer = useRef<number | null>(null);
  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => saveDraft(get()), 300);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default function App() {
  const { t } = useTranslation();
  const resume = useResumeStore((s) => s.resume);
  const setResume = useResumeStore((s) => s.setResume);
  const { loading, error, reload, fallback } = useResumeData();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  /**
   * 编辑器实时预览：
   *   EditorPanel 通过 Context 持续吐出 draft 值（未保存的表单改动）
   *   存到 App state，传给 PreviewPanel 优先展示，否则用 store 数据。
   */
  const [draft, setDraft] = useState<Partial<ResumeConfig> | null>(null);

  /** 草稿恢复：首次挂载时若有本地草稿，询问用户是否恢复 */
  const [draftPrompt, setDraftPrompt] = useState<{ data: Partial<ResumeConfig> } | null>(null);
  useEffect(() => {
    const draftData = loadDraft();
    if (draftData && Object.keys(draftData).length) {
      setDraftPrompt({ data: draftData });
    }
  }, []);

  /** 草稿自动保存（draft 变化后 300ms） */
  useDraftAutoSave(() => draft ?? {}, [draft]);

  /** 主题色 CSS 变量（Toolbar 的 bg-resume 按钮等用） */
  const themeStyle = useMemo(() => ({
    '--resume-color': resume.theme?.color ?? 'rgba(91, 143, 249, 1)',
    '--resume-tag-color': resume.theme?.tagColor ?? '#8bc34a',
  }) as CSSProperties, [resume.theme?.color, resume.theme?.tagColor]);

  /* ---------------- 未保存变更离开页面提示 ---------------- */
  const hasUnsaved = useMemo(() => {
    if (!draft) return false;
    // 简单比较：draft 是否非空且至少一个字段有值
    return Object.keys(draft).some((k) => (draft as any)[k] !== undefined);
  }, [draft]);

  useEffect(() => {
    if (!hasUnsaved) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsaved]);

  /* ---------------- 导入/导出 ---------------- */
  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        setResume(await importResumeFromFile(file));
        // 丢弃旧草稿（导入了新简历）
        localStorage.removeItem(DRAFT_KEY);
        setDraft(null);
      } catch (err) {
        alert(t('app.importFailed') + `${err instanceof Error ? err.message : String(err)}`);
      }
    };
    input.click();
  }, [setResume, t]);

  const handleExport = useCallback(() => {
    // 导出时优先包含 draft 内的改动（如果合法可合入）
    const merged = { ...resume, ...(draft ?? {}) };
    const validated = resumeSchema.safeParse(merged);
    downloadResume(validated.success ? validated.data : resume);
  }, [resume, draft]);

  /* ---------------- 草稿恢复对话框 ---------------- */
  const applyDraft = () => {
    if (!draftPrompt) return;
    // 合法则合并到 store，失败回空并丢弃
    const merged = resumeSchema.safeParse({ ...resume, ...draftPrompt.data });
    if (merged.success) {
      setResume(merged.data);
    }
    localStorage.removeItem(DRAFT_KEY);
    setDraft(null);
    setDraftPrompt(null);
  };
  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setDraftPrompt(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-500">
        {t('app.loading')}
      </div>
    );
  }

  const tabCls = (active: boolean) =>
    `flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? 'border-resume bg-resume text-white'
        : 'border-gray-300 bg-white text-gray-600'
    }`;

  return (
    <div style={themeStyle} className="min-h-screen bg-gray-100 text-gray-800 app-root">
      {/* ---------- 顶栏（打印隐藏） ---------- */}
      <div className="app-toolbar-print-hide">
        <Toolbar onImport={handleImport} onExport={handleExport} onReload={reload} onReset={fallback} />
      </div>

      {/* ---------- 草稿恢复提示（打印隐藏） ---------- */}
      {draftPrompt && (
        <div className="app-alert mx-auto mt-4 max-w-7xl rounded-md border border-sky-300 bg-sky-50 px-4 py-3 text-sm text-sky-800 flex items-center justify-between gap-3">
          <span>
            发现一份未保存的草稿，是否恢复？（草稿仅保存在本地浏览器）
          </span>
          <div className="flex gap-2 shrink-0">
            <button className="btn-ghost" onClick={discardDraft}>丢弃</button>
            <button className="btn-primary" onClick={applyDraft}>恢复</button>
          </div>
        </div>
      )}

      {/* ---------- 远程错误提示（打印隐藏） ---------- */}
      {error && !draftPrompt && (
        <div className="app-alert mx-auto mt-4 max-w-7xl rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>{t('app.remoteUnavailable')}</strong>
          &nbsp;（{error}），{t('app.remoteFallback')}。
        </div>
      )}

      {/* ---------- 移动端 Tab（打印隐藏） ---------- */}
      <div className="app-mobile-tabs mx-auto flex max-w-7xl gap-2 px-4 pt-4 md:hidden">
        <button className={tabCls(activeTab === 'edit')} onClick={() => setActiveTab('edit')}>
          {t('app.tabEdit')}
        </button>
        <button className={tabCls(activeTab === 'preview')} onClick={() => setActiveTab('preview')}>
          {t('app.tabPreview')}
        </button>
      </div>

      {/* ---------- 主网格：左编辑器 / 右预览 ---------- */}
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[2fr_3fr] app-main-grid">
        <div className={`app-editor-col ${activeTab === 'edit' ? 'block' : 'hidden md:block'} md:max-h-[calc(100vh-180px)] md:overflow-y-auto`}>
          {/* draftChange：子组件回调，让草稿变更驱动预览和自动保存 */}
          <EditorPanel onDraftChange={setDraft} />
        </div>
        <div className={`app-preview-col ${activeTab === 'preview' ? 'block' : 'hidden md:block'}`}>
          {/* 草稿合并预览：如果有 draft 就浅合并，否则用 store 里的 resume */}
          <PreviewPanel
            overrideResume={
              draft && Object.keys(draft).length
                ? ({ ...resume, ...draft } as ResumeConfig)
                : resume
            }
          />
        </div>
      </main>

      {/* 未保存提示角标（打印隐藏） */}
      {hasUnsaved && (
        <div className="fixed bottom-4 right-4 z-20 rounded-md bg-white px-3 py-2 shadow-md border border-gray-200 text-xs text-gray-600 app-editor-wrapper">
          <span style={{ color: '#f59e0b', marginRight: 6 }}>●</span>
          有未保存改动（已自动存草稿，刷新/关闭页面可恢复）
        </div>
      )}
    </div>
  );
}
