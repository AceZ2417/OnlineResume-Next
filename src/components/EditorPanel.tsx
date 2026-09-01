import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { Resolver } from 'react-hook-form';
import { z } from 'zod';
import type { CSSProperties } from 'react';

import { useResumeStore } from '@/store/useResumeStore';
import { resumeSchema, type ResumeConfig } from '@/schema/resumeSchema';
import {
  AvatarForm, ProfileForm, ThemeForm, AboutmeForm, TitleNameMapForm,
  type FormState,
} from './editor/BaseForms';
import {
  EducationListForm, WorkExpListForm, ProjectListForm,
  SkillListForm, AwardListForm, WorkListForm,
} from './editor/ListForms';

/**
 * zod v4 的类型与 @hookform/resolvers 的 zodResolver 声明不兼容，
 * 这里用一个 wrapper resolver：values → schema.safeParse → 返回 errors 结构。
 * 运行时与 zodResolver 行为一致，但类型完全独立。
 */
function resumeResolver(): Resolver<FormState> {
  return async (values) => {
    const result = resumeSchema.safeParse(values as unknown as ResumeConfig);
    if (!result.success) {
      const errors: Record<string, any> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join('.');
        errors[path] = { type: 'zod', message: issue.message };
      }
      return { values: {}, errors };
    }
    return { values: values as any, errors: {} };
  };
}

type EditorPanelProps = {
  /** 草稿变更回调：传入当前表单全量值（脏状态，供预览合并/草稿保存） */
  onDraftChange?: (draft: Partial<ResumeConfig>) => void;
};

export default function EditorPanel({ onDraftChange }: EditorPanelProps) {
  const { t } = useTranslation();
  const resume = useResumeStore((s) => s.resume);
  const setResume = useResumeStore((s) => s.setResume);
  const themeColor = resume.theme?.color ?? '#5b8ff9';

  const {
    register, handleSubmit, control, formState: { errors, isDirty, isValid, isSubmitting }, reset, watch, setError, clearErrors,
  } = useForm<FormState>({
    resolver: resumeResolver(),
    defaultValues: resume as any,
    mode: 'onBlur',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
    shouldUnregister: false,
  });

  const educationFA = useFieldArray({ control, name: 'educationList' });
  const workExpFA = useFieldArray({ control, name: 'workExpList' });
  const projectFA = useFieldArray({ control, name: 'projectList' });
  const skillFA = useFieldArray({ control, name: 'skillList' });
  const awardFA = useFieldArray({ control, name: 'awardList' });
  const workFA = useFieldArray({ control, name: 'workList' });

  /* ---------------- 实时草稿（表单 watch 订阅，onDraftChange 回调外层） ---------------- */
  useEffect(() => {
    if (!onDraftChange) return;
    let timer: number | null = null;
    // subscribe 监听全表单字段变化，防抖 200ms 再回传
    const { unsubscribe } = watch((values) => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        // 草稿无需严格校验字段完整，直接当成 ResumeConfig 子集透传
        onDraftChange(values as Partial<ResumeConfig>);
      }, 200);
    });
    return () => {
      unsubscribe();
      if (timer) window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch, onDraftChange]);

  const wrapperStyle = useMemo(() => ({
    '--resume-color': themeColor,
    '--resume-tag-color': resume.theme?.tagColor ?? '#8bc34a',
  }) as CSSProperties, [themeColor, resume.theme?.tagColor]);

  const onSubmit: SubmitHandler<FormState> = async (values) => {
    try {
      const clean = resumeSchema.parse({
        ...values,
        template: resume.template,
      } as unknown as ResumeConfig) as unknown as ResumeConfig;
      setResume(clean);
      // 保存成功：清空草稿（独立 key 交给 App 管，但回调父组件清空 draft 状态）
      if (onDraftChange) onDraftChange({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const flat = err.flatten();
        const msg = t('editor.saveFailed') + (flat.formErrors ?? []).join('; ') + Object.keys(flat.fieldErrors).join(', ');
        setError('root' as any, { message: msg });
        return;
      }
      throw err;
    }
  };

  return (
    <div style={wrapperStyle} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-500 mb-3 flex items-center justify-between">
        <span>{t('editor.title')}</span>
        <span>
          {isDirty && <span style={{ color: '#f59e0b', marginRight: 8 }}>● {t('editor.dirty')}</span>}
          <span style={{ color: isValid ? '#10b981' : '#dc2626' }}>
            {isValid ? t('editor.valid') : t('editor.invalid')}
          </span>
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-0" style={{ padding: '2px 4px 14px' }}>
        <AvatarForm register={register} errors={errors} values={watch()} />
        <ProfileForm register={register} errors={errors} />
        <EducationListForm register={register} errors={errors} array={educationFA as any} />
        <WorkExpListForm register={register} errors={errors} array={workExpFA as any} />
        <ProjectListForm register={register} errors={errors} array={projectFA as any} />
        <SkillListForm register={register} errors={errors} array={skillFA as any} watch={watch as any} />
        <AwardListForm register={register} errors={errors} array={awardFA as any} />
        <WorkListForm register={register} errors={errors} array={workFA as any} />
        <AboutmeForm register={register} />
        <TitleNameMapForm register={register} errors={errors} />
        <ThemeForm register={register} errors={errors} values={watch()} />

        {errors.root && (
          <div className="field-error" style={{ padding: '8px 10px', background: '#fef2f2', borderRadius: 6 }}>
            {String((errors.root as any).message ?? '')}
          </div>
        )}

        <div className="editor-footer" style={{ marginTop: 12 }}>
          <button
            type="button"
            className="btn-ghost"
            disabled={!isDirty || isSubmitting}
            onClick={() => {
              reset(resume as any);
              clearErrors();
              if (onDraftChange) onDraftChange({});
            }}
          >
            {t('editor.undo')}
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting || !isValid}>
            {isSubmitting ? t('editor.saving') : t('editor.save')}
          </button>
        </div>
      </form>
    </div>
  );
}
