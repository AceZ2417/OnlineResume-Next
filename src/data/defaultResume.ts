import { resumeSchema, type ResumeConfig } from '@/schema/resumeSchema';
import resumeJson from './defaultResume.json';

/**
 * 默认简历数据：从 JSON 文件加载后用 zod schema 校验。
 * 校验失败会在开发期直接抛错（说明 JSON 数据结构有问题）。
 */
export const defaultResume: ResumeConfig = resumeSchema.parse(resumeJson);
