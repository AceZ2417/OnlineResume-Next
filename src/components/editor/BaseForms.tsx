import type { FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { z } from 'zod';
import {
  avatarSchema,
  profileSchema,
  themeSchema,
  aboutmeSchema,
  educationSchema,
  workExpSchema,
  projectSchema,
  skillSchema,
  awardSchema,
  workSchema,
  titleNameMapSchema,
} from './schemas';
import { Avatar } from '@/components/Avatar';
import './editor.less';

export type FormState = {
  avatar?: z.infer<typeof avatarSchema>;
  profile?: z.infer<typeof profileSchema>;
  theme?: z.infer<typeof themeSchema>;
  titleNameMap?: z.infer<typeof titleNameMapSchema>;
  educationList?: z.infer<typeof educationSchema>[];
  workExpList?: z.infer<typeof workExpSchema>[];
  projectList?: z.infer<typeof projectSchema>[];
  skillList?: z.infer<typeof skillSchema>[];
  awardList?: z.infer<typeof awardSchema>[];
  workList?: z.infer<typeof workSchema>[];
  aboutme?: z.infer<typeof aboutmeSchema>;
};

export type A = any;
export type E = FieldErrors<FormState>;

/* ---------- 通用小组件（全部用 t() 取标签） ---------- */

export function TextField(props: {
  id: string;
  i18nLabel: string;
  i18nPlaceholder?: string;
  i18nHint?: string;
  type?: string;
  register: A;
  error?: any;
}) {
  const { t } = useTranslation();
  const { id, i18nLabel, i18nPlaceholder, i18nHint, register, error, type = 'text' } = props;
  return (
    <div className="field">
      <label htmlFor={id}>{t(i18nLabel)}</label>
      <input id={id} type={type} placeholder={i18nPlaceholder ? t(i18nPlaceholder) : undefined} {...register(id as any)} />
      {error?.message && <div className="field-error">{t(String(error.message))}</div>}
      {i18nHint && <div className="field-hint">{t(i18nHint)}</div>}
    </div>
  );
}

export function TextareaField(props: {
  id: string;
  i18nLabel: string;
  i18nPlaceholder?: string;
  rows?: number;
  register: A;
  error?: any;
}) {
  const { t } = useTranslation();
  const { id, i18nLabel, i18nPlaceholder, register, error, rows = 4 } = props;
  return (
    <div className="field">
      <label htmlFor={id}>{t(i18nLabel)}</label>
      <textarea id={id} rows={rows} placeholder={i18nPlaceholder ? t(i18nPlaceholder) : undefined} {...register(id as any)} />
      {error?.message && <div className="field-error">{t(String(error.message))}</div>}
    </div>
  );
}

export function CheckboxField(props: { id: string; i18nLabel: string; register: A }) {
  const { t } = useTranslation();
  const { id, i18nLabel, register } = props;
  return (
    <div className="switch-row">
      <input id={id} type="checkbox" {...register(id as any, { setValueAs: (v: any) => Boolean(v) })} />
      <label htmlFor={id}>{t(i18nLabel)}</label>
    </div>
  );
}

export function SelectField(props: {
  id: string;
  i18nLabel: string;
  options: Array<{ value: string; i18nLabel: string }>;
  register: A;
  error?: any;
}) {
  const { t } = useTranslation();
  const { id, i18nLabel, options, register, error } = props;
  return (
    <div className="field">
      <label htmlFor={id}>{t(i18nLabel)}</label>
      <select id={id} {...register(id as any)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {t(o.i18nLabel)}
          </option>
        ))}
      </select>
      {error?.message && <div className="field-error">{t(String(error.message))}</div>}
    </div>
  );
}

/* ---------- 分区折叠卡片 ---------- */

export function EditorSection(props: {
  i18nTitle: string;
  open?: boolean;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const { i18nTitle, open, children } = props;
  return (
    <details className="editor-section" open={open}>
      <summary>{t(i18nTitle)}</summary>
      <div className="editor-section-body">{children}</div>
    </details>
  );
}

/* ---------- Avatar 分区 ---------- */

export function AvatarForm({ register, errors, values }: { register: A; errors: E; values: FormState }) {
  const avatar = values.avatar ?? {};
  return (
    <EditorSection i18nTitle="editor.section.avatar" open>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 10 }}>
        <Avatar
          avatarSrc={avatar.src}
          shape={avatar.shape as any}
          size={avatar.size as any}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <TextField
            id="avatar.src"
            i18nLabel="editor.field.avatarSrc"
            i18nHint="editor.field.hintAvatarUrl"
            register={register}
            error={errors.avatar?.src}
          />
        </div>
      </div>
      <div className="field-row">
        <SelectField
          id="avatar.shape"
          i18nLabel="editor.field.avatarShape"
          options={[
            { value: 'circle', i18nLabel: 'editor.field.avatarShapeCircle' },
            { value: 'square', i18nLabel: 'editor.field.avatarShapeSquare' },
          ]}
          register={register}
        />
        <SelectField
          id="avatar.size"
          i18nLabel="editor.field.avatarSize"
          options={[
            { value: 'small', i18nLabel: 'misc.small' },
            { value: 'default', i18nLabel: 'misc.default' },
            { value: 'large', i18nLabel: 'misc.large' },
          ]}
          register={register}
        />
      </div>
      <CheckboxField id="avatar.hidden" i18nLabel="editor.field.avatarHidden" register={register} />
    </EditorSection>
  );
}

/* ---------- 基本信息分区 ---------- */

export function ProfileForm({ register, errors }: { register: A; errors: E }) {
  return (
    <EditorSection i18nTitle="editor.section.profile" open>
      <TextField id="profile.name" i18nLabel="editor.field.name" register={register} error={errors.profile?.name} />
      <div className="field-row">
        <TextField id="profile.mobile" i18nLabel="editor.field.mobile" type="tel" register={register} error={errors.profile?.mobile} />
        <TextField id="profile.email" i18nLabel="editor.field.email" type="email" register={register} error={errors.profile?.email} />
      </div>
      <div className="field-row">
        <TextField id="profile.github" i18nLabel="editor.field.github" type="url" register={register} error={errors.profile?.github} />
        <TextField id="profile.zhihu" i18nLabel="editor.field.zhihu" type="url" register={register} error={errors.profile?.zhihu} />
      </div>
      <div className="field-row">
        <TextField id="profile.workExpYear" i18nLabel="editor.field.workExpYear" register={register} error={errors.profile?.workExpYear} />
        <TextField id="profile.workPlace" i18nLabel="editor.field.workPlace" register={register} error={errors.profile?.workPlace} />
      </div>
      <TextField id="profile.positionTitle" i18nLabel="editor.field.positionTitle" register={register} error={errors.profile?.positionTitle} />
    </EditorSection>
  );
}

/* ---------- 主题配色分区 ---------- */

export function ThemeForm({ register, errors, values }: { register: A; errors: E; values: FormState }) {
  const { t } = useTranslation();
  const theme = values.theme;
  return (
    <EditorSection i18nTitle="editor.section.theme">
      <div className="field-row">
        <div className="field">
          <label>{t('editor.field.themeColor')}</label>
          <input type="color" {...register('theme.color' as any)} defaultValue={theme?.color ?? '#5b8ff9'} style={{ height: 36 }} />
          {errors.theme?.color && <div className="field-error">{t(String(errors.theme.color.message))}</div>}
        </div>
        <div className="field">
          <label>{t('editor.field.tagColor')}</label>
          <input type="color" {...register('theme.tagColor' as any)} defaultValue={theme?.tagColor ?? '#8bc34a'} style={{ height: 36 }} />
          {errors.theme?.tagColor && <div className="field-error">{t(String(errors.theme.tagColor.message))}</div>}
        </div>
      </div>
    </EditorSection>
  );
}

/* ---------- 自我介绍分区 ---------- */

export function AboutmeForm({ register }: { register: A }) {
  return (
    <EditorSection i18nTitle="editor.section.aboutme">
      <TextareaField
        id="aboutme.aboutme_desc"
        i18nLabel="editor.field.aboutmeText"
        rows={6}
        register={register}
      />
    </EditorSection>
  );
}

/* ---------- 分区标题自定义 ---------- */

export function TitleNameMapForm({ register, errors }: { register: A; errors: E }) {
  return (
    <EditorSection i18nTitle="editor.section.titles">
      <div className="field-row">
        <TextField id="titleNameMap.educationList" i18nLabel="editor.field.educationTitle" register={register} error={errors.titleNameMap?.educationList} />
        <TextField id="titleNameMap.workExpList" i18nLabel="editor.field.workExpTitle" register={register} error={errors.titleNameMap?.workExpList} />
      </div>
      <div className="field-row">
        <TextField id="titleNameMap.projectList" i18nLabel="editor.field.projectTitle" register={register} error={errors.titleNameMap?.projectList} />
        <TextField id="titleNameMap.skillList" i18nLabel="editor.field.skillTitle" register={register} error={errors.titleNameMap?.skillList} />
      </div>
      <div className="field-row">
        <TextField id="titleNameMap.awardList" i18nLabel="editor.field.awardTitle" register={register} error={errors.titleNameMap?.awardList} />
        <TextField id="titleNameMap.workList" i18nLabel="editor.field.workTitle" register={register} error={errors.titleNameMap?.workList} />
      </div>
      <TextField id="titleNameMap.aboutme" i18nLabel="editor.field.aboutmeTitle" register={register} error={errors.titleNameMap?.aboutme} />
    </EditorSection>
  );
}
