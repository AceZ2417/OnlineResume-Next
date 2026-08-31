import { useTranslation } from 'react-i18next';
import type { UseFieldArrayReturn, UseFormWatch } from 'react-hook-form';
import type { FormState, A, E } from './BaseForms';
import { SortableList } from './SortableList';
import { TextField, TextareaField, EditorSection } from './BaseForms';

type Watch = UseFormWatch<FormState>;

/* ---------- 教育背景 ---------- */

export function EducationListForm(props: {
  register: A;
  errors: E;
  array: UseFieldArrayReturn<FormState, 'educationList', 'id'>;
}) {
  const { t } = useTranslation();
  const { register, errors, array } = props;
  const { fields, append, remove, move } = array;
  return (
    <EditorSection i18nTitle="editor.section.education" open>
      <SortableList
        items={fields as any}
        onReorder={(a, b) => move(a, b)}
        onRemove={(i) => remove(i)}
        onAdd={() => append({ edu_time: ['', ''], school: '', major: '', academic_degree: '' } as any)}
        addButtonLabel={t('editor.field.addEducation')}
      >
        {(_, i) => (
          <>
            <TextField id={`educationList.${i}.school`} i18nLabel="editor.field.school" register={register} error={errors.educationList?.[i]?.school} />
            <div className="item-grid-2">
              <TextField id={`educationList.${i}.edu_time.0`} i18nLabel="editor.field.eduStart" register={register} />
              <TextField id={`educationList.${i}.edu_time.1`} i18nLabel="editor.field.eduEnd" register={register} />
            </div>
            <div className="item-grid-2">
              <TextField id={`educationList.${i}.major`} i18nLabel="editor.field.major" register={register} error={errors.educationList?.[i]?.major} />
              <TextField id={`educationList.${i}.academic_degree`} i18nLabel="editor.field.academicDegree" register={register} />
            </div>
          </>
        )}
      </SortableList>
    </EditorSection>
  );
}

/* ---------- 工作经历 ---------- */

export function WorkExpListForm(props: {
  register: A;
  errors: E;
  array: UseFieldArrayReturn<FormState, 'workExpList', 'id'>;
}) {
  const { t } = useTranslation();
  const { register, errors, array } = props;
  const { fields, append, remove, move } = array;
  return (
    <EditorSection i18nTitle="editor.section.workExp" open>
      <SortableList
        items={fields as any}
        onReorder={(a, b) => move(a, b)}
        onRemove={(i) => remove(i)}
        onAdd={() => append({ company_name: '', department_name: '', work_time: ['', ''], work_desc: '' } as any)}
        addButtonLabel={t('editor.field.addWorkExp')}
      >
        {(_, i) => (
          <>
            <div className="item-grid-2">
              <TextField id={`workExpList.${i}.company_name`} i18nLabel="editor.field.company" register={register} error={errors.workExpList?.[i]?.company_name} />
              <TextField id={`workExpList.${i}.department_name`} i18nLabel="editor.field.department" register={register} error={errors.workExpList?.[i]?.department_name} />
            </div>
            <div className="item-grid-2">
              <TextField id={`workExpList.${i}.work_time.0`} i18nLabel="editor.field.workStart" register={register} />
              <TextField id={`workExpList.${i}.work_time.1`} i18nLabel="editor.field.workEnd" register={register} />
            </div>
            <TextareaField
              id={`workExpList.${i}.work_desc`}
              i18nLabel="editor.field.workDesc"
              rows={5}
              register={register}
              error={errors.workExpList?.[i]?.work_desc}
            />
          </>
        )}
      </SortableList>
    </EditorSection>
  );
}

/* ---------- 项目经历 ---------- */

export function ProjectListForm(props: {
  register: A;
  errors: E;
  array: UseFieldArrayReturn<FormState, 'projectList', 'id'>;
}) {
  const { t } = useTranslation();
  const { register, errors, array } = props;
  const { fields, append, remove, move } = array;
  return (
    <EditorSection i18nTitle="editor.section.project">
      <SortableList
        items={fields as any}
        onReorder={(a, b) => move(a, b)}
        onRemove={(i) => remove(i)}
        onAdd={() => append({ project_name: '', project_role: '', project_desc: '', project_content: '', project_time: '' } as any)}
        addButtonLabel={t('editor.field.addProject')}
      >
        {(_, i) => (
          <>
            <div className="item-grid-2">
              <TextField id={`projectList.${i}.project_name`} i18nLabel="editor.field.projectName" register={register} error={errors.projectList?.[i]?.project_name} />
              <TextField id={`projectList.${i}.project_role`} i18nLabel="editor.field.projectRole" register={register} error={errors.projectList?.[i]?.project_role} />
            </div>
            <TextField id={`projectList.${i}.project_time`} i18nLabel="editor.field.projectTime" register={register} />
            <TextareaField id={`projectList.${i}.project_desc`} i18nLabel="editor.field.projectDesc" rows={3} register={register} />
            <TextareaField id={`projectList.${i}.project_content`} i18nLabel="editor.field.projectContent" rows={3} register={register} />
          </>
        )}
      </SortableList>
    </EditorSection>
  );
}

/* ---------- 个人技能 ---------- */

export function SkillListForm(props: {
  register: A;
  errors: E;
  array: UseFieldArrayReturn<FormState, 'skillList', 'id'>;
  watch: Watch;
}) {
  const { t } = useTranslation();
  const { register, errors, array, watch } = props;
  const { fields, append, remove, move } = array;
  return (
    <EditorSection i18nTitle="editor.section.skill">
      <SortableList
        items={fields as any}
        onReorder={(a, b) => move(a, b)}
        onRemove={(i) => remove(i)}
        onAdd={() => append({ skill_name: '', skill_level: 80, skill_desc: '' } as any)}
        addButtonLabel={t('editor.field.addSkill')}
      >
        {(_, i) => {
          const level = watch(`skillList.${i}.skill_level` as any) ?? 80;
          return (
            <>
              <TextField id={`skillList.${i}.skill_name`} i18nLabel="editor.field.skillName" register={register} error={errors.skillList?.[i]?.skill_name} />
              <div className="field">
                <label>{t('editor.field.skillLevel')}：{Number(level)}</label>
                <input
                  type="range" min={0} max={100} step={1}
                  {...register(`skillList.${i}.skill_level` as any, {
                    setValueAs: (v: any) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
                  })}
                />
                <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(100, Math.max(0, Number(level) || 0))}%`,
                    height: '100%',
                    background: 'var(--resume-color, #5b8ff9)',
                  }} />
                </div>
              </div>
              <TextareaField id={`skillList.${i}.skill_desc`} i18nLabel="editor.field.skillDesc" rows={3} register={register} />
            </>
          );
        }}
      </SortableList>
    </EditorSection>
  );
}

/* ---------- 更多信息/奖项 ---------- */

export function AwardListForm(props: {
  register: A;
  errors: E;
  array: UseFieldArrayReturn<FormState, 'awardList', 'id'>;
}) {
  const { t } = useTranslation();
  const { register, errors, array } = props;
  const { fields, append, remove, move } = array;
  return (
    <EditorSection i18nTitle="editor.section.award">
      <SortableList
        items={fields as any}
        onReorder={(a, b) => move(a, b)}
        onRemove={(i) => remove(i)}
        onAdd={() => append({ award_info: '', award_time: '' } as any)}
        addButtonLabel={t('editor.field.addAward')}
      >
        {(_, i) => (
          <div className="item-grid-2">
            <TextField id={`awardList.${i}.award_info`} i18nLabel="editor.field.awardInfo" register={register} error={errors.awardList?.[i]?.award_info} />
            <TextField id={`awardList.${i}.award_time`} i18nLabel="editor.field.awardTime" register={register} />
          </div>
        )}
      </SortableList>
    </EditorSection>
  );
}

/* ---------- 作品 ---------- */

export function WorkListForm(props: {
  register: A;
  errors: E;
  array: UseFieldArrayReturn<FormState, 'workList', 'id'>;
}) {
  const { t } = useTranslation();
  const { register, errors, array } = props;
  const { fields, append, remove, move } = array;
  return (
    <EditorSection i18nTitle="editor.section.work">
      <SortableList
        items={fields as any}
        onReorder={(a, b) => move(a, b)}
        onRemove={(i) => remove(i)}
        onAdd={() => append({ work_name: '', work_desc: '', visit_link: '' } as any)}
        addButtonLabel={t('editor.field.addWork')}
      >
        {(_, i) => (
          <>
            <div className="item-grid-2">
              <TextField id={`workList.${i}.work_name`} i18nLabel="editor.field.workName" register={register} error={errors.workList?.[i]?.work_name} />
              <TextField id={`workList.${i}.visit_link`} i18nLabel="editor.field.visitLink" type="url" register={register} error={errors.workList?.[i]?.visit_link} />
            </div>
            <TextareaField id={`workList.${i}.work_desc`} i18nLabel="editor.field.workDesc" rows={3} register={register} />
          </>
        )}
      </SortableList>
    </EditorSection>
  );
}
