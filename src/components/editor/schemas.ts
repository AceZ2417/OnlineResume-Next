import { z } from 'zod';

/** 表单的子字段类型定义：复用阶段 1 的 resumeSchema，保证表单输出与 ResumeConfig 完全一致。
 * 这些子类型都基于 resumeSchema 中对应子对象的 shape 单独提取，
 * 确保"校验通过即可作为 ResumeConfig 字段使用"。
 */

export const avatarSchema = z.object({
  src: z.string().optional(),
  shape: z.enum(['circle', 'square']).optional().or(z.string().optional()),
  size: z.union([z.enum(['small', 'default', 'large']), z.string(), z.number()]).optional(),
  hidden: z.boolean().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(1, { message: '姓名为必填项' }),
  mobile: z.string().optional(),
  email: z.string().email({ message: '邮箱格式不正确' }).or(z.string().length(0)).optional(),
  github: z.string().optional(),
  zhihu: z.string().optional(),
  workExpYear: z.string().optional(),
  workPlace: z.string().optional(),
  positionTitle: z.string().optional(),
});

export const themeSchema = z.object({
  color: z.string().min(1, { message: '主题色为必填项' }),
  tagColor: z.string().min(1, { message: '标签色为必填项' }),
});

export const aboutmeSchema = z.object({
  aboutme_desc: z.string().optional(),
});

/* ---------- 8 个列表项 schema ---------- */

const tupleTime = z.tuple([z.string().optional(), z.union([z.string(), z.number()])]);

export const educationSchema = z.object({
  edu_time: tupleTime,
  school: z.string().min(1, { message: '学校为必填项' }),
  major: z.string().optional(),
  academic_degree: z.string().optional(),
});

export const workExpSchema = z.object({
  company_name: z.string().min(1, { message: '公司为必填项' }),
  department_name: z.string().min(1, { message: '部门为必填项' }),
  work_time: tupleTime.optional(),
  work_desc: z.string().min(1, { message: '工作描述为必填项' }),
});

export const projectSchema = z.object({
  project_name: z.string().min(1, { message: '项目名称为必填项' }),
  project_role: z.string().min(1, { message: '担任角色为必填项' }),
  project_desc: z.string().optional(),
  project_content: z.string().optional(),
  project_time: z.string().optional(),
});

export const skillSchema = z.object({
  skill_name: z.string().optional(),
  skill_level: z.number().max(100).min(0).optional().or(z.null().transform(() => undefined)),
  skill_desc: z.string().optional(),
});

export const awardSchema = z.object({
  award_info: z.string().min(1, { message: '奖项信息为必填项' }),
  award_time: z.string().optional(),
});

export const workSchema = z.object({
  work_name: z.string().optional(),
  work_desc: z.string().optional(),
  visit_link: z.string().optional(),
});

export const titleNameMapSchema = z.object({
  educationList: z.string().optional(),
  workExpList: z.string().optional(),
  projectList: z.string().optional(),
  skillList: z.string().optional(),
  awardList: z.string().optional(),
  workList: z.string().optional(),
  aboutme: z.string().optional(),
});

/* ---------- 一些默认值工厂：给"新增"按钮提供初始空模板 ---------- */

export const emptyEducation = (): z.infer<typeof educationSchema> => ({
  edu_time: ['', ''],
  school: '',
  major: '',
  academic_degree: '',
});

export const emptyWorkExp = (): z.infer<typeof workExpSchema> => ({
  company_name: '',
  department_name: '',
  work_time: ['', ''],
  work_desc: '',
});

export const emptyProject = (): z.infer<typeof projectSchema> => ({
  project_name: '',
  project_role: '',
  project_desc: '',
  project_content: '',
  project_time: '',
});

export const emptySkill = (): z.infer<typeof skillSchema> => ({
  skill_name: '',
  skill_level: 80,
  skill_desc: '',
});

export const emptyAward = (): z.infer<typeof awardSchema> => ({
  award_info: '',
  award_time: '',
});

export const emptyWork = (): z.infer<typeof workSchema> => ({
  work_name: '',
  work_desc: '',
  visit_link: '',
});
