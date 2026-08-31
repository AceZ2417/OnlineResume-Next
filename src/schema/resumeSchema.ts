import { z } from 'zod';

/**
 * Tuple schema for time ranges used across multiple sections.
 * Matches TypeScript `[string | undefined, string | number]`.
 * Allows `undefined` for the start (e.g., "至今" / "present").
 */
const timeRange = z
  .tuple([z.string().optional(), z.union([z.string(), z.number()])])
  .optional();

/** Avatar section */
const avatarSchema = z
  .object({
    src: z.string().optional(),
    shape: z.string().optional(),
    size: z.string().optional(),
    hidden: z.boolean().optional(),
  })
  .passthrough()
  .optional();

/** Personal profile */
const profileSchema = z
  .object({
    name: z.string(),
    mobile: z.string().optional(),
    email: z.string().optional(),
    github: z.string().optional(),
    zhihu: z.string().optional(),
    workExpYear: z.string().optional(),
    workPlace: z.string().optional(),
    positionTitle: z.string().optional(),
  })
  .passthrough()
  .optional();

/** Theme config */
export const themeSchema = z
  .object({
    color: z.string(),
    tagColor: z.string(),
  })
  .passthrough()
  .optional();

/** Custom title labels */
const titleNameMapSchema = z
  .object({
    educationList: z.string().optional(),
    workExpList: z.string().optional(),
    projectList: z.string().optional(),
    skillList: z.string().optional(),
    awardList: z.string().optional(),
    workList: z.string().optional(),
    aboutme: z.string().optional(),
  })
  .passthrough()
  .optional();

/** Education entry */
const educationItemSchema = z
  .object({
    edu_time: z.tuple([z.string().optional(), z.union([z.string(), z.number()])]),
    school: z.string(),
    major: z.string().optional(),
    academic_degree: z.string().optional(),
  })
  .passthrough();

/** Work experience entry */
const workExpItemSchema = z
  .object({
    company_name: z.string(),
    department_name: z.string(),
    work_time: timeRange,
    work_desc: z.string(),
  })
  .passthrough();

/** Project entry */
const projectItemSchema = z
  .object({
    project_name: z.string(),
    project_role: z.string(),
    project_desc: z.string().optional(),
    project_content: z.string().optional(),
    project_time: z.string().optional(),
  })
  .passthrough();

/** Skill entry */
const skillItemSchema = z
  .object({
    skill_name: z.string().optional(),
    skill_level: z.number().optional(),
    skill_desc: z.string().optional(),
  })
  .passthrough();

/** Award entry */
const awardItemSchema = z
  .object({
    award_info: z.string(),
    award_time: z.string().optional(),
  })
  .passthrough();

/** Work / portfolio entry */
const workItemSchema = z
  .object({
    work_name: z.string().optional(),
    work_desc: z.string().optional(),
    visit_link: z.string().optional(),
  })
  .passthrough();

/** Self-introduction block */
const aboutmeSchema = z
  .object({
    aboutme_desc: z.string(),
  })
  .passthrough()
  .optional();

/**
 * Base schema without recursive locales field.
 * Separated so TypeScript can infer the type without recursion issues.
 */
const baseResumeSchema = z.object({
  avatar: avatarSchema,
  profile: profileSchema,
  theme: themeSchema,
  titleNameMap: titleNameMapSchema,
  educationList: z.array(educationItemSchema).optional(),
  workExpList: z.array(workExpItemSchema).optional(),
  projectList: z.array(projectItemSchema).optional(),
  skillList: z.array(skillItemSchema).optional(),
  awardList: z.array(awardItemSchema).optional(),
  workList: z.array(workItemSchema).optional(),
  aboutme: aboutmeSchema,
  template: z.string().optional(),
});

/**
 * Main resume schema.
 * locales uses z.lazy for recursive self-reference.
 *
 * NOTE: 显式类型注解会导致 Zod 推断的输出类型与手写的 ResumeConfig 冲突，
 * 这里使用 as-cast 让类型系统相信它们一致。schema 运行时行为不受影响。
 */
export const resumeSchema = baseResumeSchema
  .extend({
    locales: z.record(z.string(), z.lazy(() => resumeSchema)).optional(),
  })
  .passthrough() as unknown as z.ZodType<ResumeConfig>;

/** Derived TypeScript type from the schema (single source of truth) */
export type ResumeConfig = z.infer<typeof baseResumeSchema> & {
  locales?: Record<string, ResumeConfig>;
};
