import type { ReactNode } from 'react';
import { Avatar } from '@/components/Avatar';
import type { ResumeConfig } from '@/schema/resumeSchema';
import type { Locale } from '@/store/useResumeStore';
import { getTitle, splitLines } from '../shared';
import { PhoneFilled, MailFilled, GithubFilled, ZhihuCircleFilled, ScheduleFilled, EnvironmentFilled, HeartFilled, CrownFilled, CheckCircleFilled, TrophyFilled } from '@ant-design/icons';
import './index.less';

type Props = { value: ResumeConfig; locale: Locale };

/** Ribbon + Card 容器（纯 CSS 替代 antd Badge.Ribbon + Card） */
function RibbonCard({
  title, color, className, children,
}: { title: string; color: string; className?: string; children: ReactNode }) {
  return (
    <div className={`ribbon-card-wrapper ${className ?? ''}`}>
      <div className="ribbon" style={{ background: color }}>
        <span className="ribbon-text">{title}</span>
      </div>
      <div className="card-bordered">
        <div className="card-body">{children}</div>
      </div>
    </div>
  );
}

/** main-info 区域的 section header（h1 带旋转方块装饰） */
function SectionHeader({ title, color }: { title: string; color: string }) {
  return (
    <div className="section-header">
      <h1 style={{ background: color }}>{title}</h1>
    </div>
  );
}

function MainWrapper({ title, color, children }: { title: string; color: string; children: ReactNode }) {
  return (
    <section>
      <SectionHeader title={title} color={color} />
      <div className="section-body">{children}</div>
    </section>
  );
}

export function Template3({ value, locale }: Props) {
  const theme = value.theme ?? { color: '#2f5785', tagColor: '#8bc34a' };
  const profile = value.profile;
  const aboutme = splitLines(value.aboutme?.aboutme_desc);
  const color = theme.color;
  const tagColor = theme.tagColor;

  return (
    <div className="template3-resume resume-content">
      {/* basic-info：个人信息 + 教育 + 作品 + 自我介绍 + 技能 + 奖项（Ribbon Card 包裹） */}
      <div className="basic-info">
        {/* 个人信息 */}
        <RibbonCard title="个人信息" color={color} className="section section-profile">
          <div className="profile">
            <div className="profile-info">
              {profile?.name && <div className="name">{profile.name}</div>}
              <div className="profile-list">
                {profile?.mobile && (
                  <div className="mobile">
                    <PhoneFilled style={{ color, opacity: 0.85 }} />
                    {profile.mobile}
                  </div>
                )}
                {profile?.email && (
                  <div className="email">
                    <MailFilled style={{ color, opacity: 0.85 }} />
                    {profile.email}
                  </div>
                )}
                {profile?.github && (
                  <div className="github">
                    <GithubFilled style={{ color, opacity: 0.85 }} />
                    <a href={profile.github} target="_blank" rel="noreferrer">{profile.github}</a>
                  </div>
                )}
                {profile?.zhihu && (
                  <div className="github">
                    <ZhihuCircleFilled style={{ color, opacity: 0.85 }} />
                    <a href={profile.zhihu} target="_blank" rel="noreferrer">{profile.zhihu}</a>
                  </div>
                )}
                {profile?.workExpYear && (
                  <div className="work-exp-year">
                    <ScheduleFilled style={{ color, opacity: 0.85 }} />
                    <span>工作经验: {profile.workExpYear}</span>
                  </div>
                )}
                {profile?.workPlace && (
                  <div className="work-place">
                    <EnvironmentFilled style={{ color, opacity: 0.85 }} />
                    <span>期望工作地: {profile.workPlace}</span>
                  </div>
                )}
                {profile?.positionTitle && (
                  <div className="expect-job">
                    <HeartFilled style={{ color, opacity: 0.85 }} />
                    <span>职位: {profile.positionTitle}</span>
                  </div>
                )}
              </div>
            </div>
            {/* 头像 */}
            {!value.avatar?.hidden && (
              <Avatar
                avatarSrc={value.avatar?.src}
                className="avatar"
                shape={value.avatar?.shape as any}
                size={value.avatar?.size ?? 84}
              />
            )}
          </div>
        </RibbonCard>

        {/* 教育背景 */}
        {value.educationList?.length ? (
          <RibbonCard title={getTitle(value, 'educationList', locale)} color={color} className="section section-education">
            {value.educationList.map((edu, i) => {
              const [start, end] = edu.edu_time;
              return (
                <div key={i} className="education-item">
                  <div>
                    <span>
                      <b>{edu.school}</b>
                      <span style={{ marginLeft: '8px' }}>
                        {edu.major && <span>{edu.major}</span>}
                        {edu.academic_degree && (
                          <span className="sub-info" style={{ marginLeft: '4px' }}>
                            ({edu.academic_degree})
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="sub-info" style={{ float: 'right' }}>
                      {start}{end ? ` ~ ${end}` : ' 至今'}
                    </span>
                  </div>
                </div>
              );
            })}
          </RibbonCard>
        ) : null}

        {/* 个人作品 */}
        {value.workList?.length ? (
          <RibbonCard title={getTitle(value, 'workList', locale)} color={color} className="section section-work">
            {value.workList.map((w, i) => (
              <div key={i}>
                <div>
                  <CrownFilled style={{ color: '#ffc107', marginRight: '8px' }} />
                  <b className="info-name">{w.work_name}</b>
                  {w.visit_link && (
                    <a className="sub-info" href={w.visit_link} target="_blank" rel="noreferrer">访问链接</a>
                  )}
                </div>
                {w.work_desc && <div>{w.work_desc}</div>}
              </div>
            ))}
          </RibbonCard>
        ) : null}

        {/* 自我介绍 */}
        {aboutme.join('').trim() ? (
          <RibbonCard title={getTitle(value, 'aboutme', locale)} color={color} className="section section-aboutme">
            {aboutme.map((d, i) => <div key={i}>{d}</div>)}
          </RibbonCard>
        ) : null}

        {/* 专业技能 */}
        {value.skillList?.length ? (
          <RibbonCard title={getTitle(value, 'skillList', locale)} color={color} className="section section-skill">
            {value.skillList.map((s, i) => {
              const skills = splitLines(s.skill_desc).join('；');
              return skills ? (
                <div className="skill-item" key={i}>
                  <span>
                    <CheckCircleFilled style={{ color: '#ffc107', marginRight: '8px' }} />
                    {skills}
                  </span>
                  {s.skill_level && (
                    <span className="skill-rate">
                      {'★'.repeat(Math.round(s.skill_level / 20))}
                      <span className="skill-rate-empty">{'★'.repeat(5 - Math.round(s.skill_level / 20))}</span>
                    </span>
                  )}
                </div>
              ) : null;
            })}
          </RibbonCard>
        ) : null}

        {/* 更多信息 */}
        {value.awardList?.length ? (
          <RibbonCard title={getTitle(value, 'awardList', locale)} color={color} className="section section-award">
            {value.awardList.map((a, i) => (
              <div key={i}>
                <TrophyFilled style={{ color: '#ffc107', marginRight: '8px' }} />
                <b className="info-name">{a.award_info}</b>
                {a.award_time && <span className="sub-info award-time">({a.award_time})</span>}
              </div>
            ))}
          </RibbonCard>
        ) : null}
      </div>

      {/* main-info：工作经历 + 项目经历（section-header h1 带旋转方块装饰） */}
      <div className="main-info">
        {value.workExpList?.length ? (
          <MainWrapper title={getTitle(value, 'workExpList', locale)} color={color}>
            <div className="section section-work-exp">
              {value.workExpList.map((work, i) => {
                const [start, end] = work.work_time ?? [];
                return work ? (
                  <div className="section-item" key={i}>
                    <div className="section-info">
                      <b className="info-name">
                        {work.company_name}
                        <span className="sub-info">{work.department_name}</span>
                      </b>
                      <span className="info-time">
                        {start}{end ? ` ~ ${end}` : ' 至今'}
                      </span>
                    </div>
                    <div className="work-description">{work.work_desc}</div>
                  </div>
                ) : null;
              })}
            </div>
          </MainWrapper>
        ) : null}

        {value.projectList?.length ? (
          <MainWrapper title={getTitle(value, 'projectList', locale)} color={color}>
            <div className="section section-project">
              {value.projectList.map((project, i) => project ? (
                <div className="section-item" key={i}>
                  <div className="section-info">
                    <b className="info-name">
                      {project.project_name}
                      <span className="info-time">{project.project_time}</span>
                    </b>
                    {project.project_role && (
                      <span className="tag" style={{ background: tagColor }}>{project.project_role}</span>
                    )}
                  </div>
                  <div className="section-detail">
                    <span>项目描述：</span>
                    <span>{project.project_desc}</span>
                  </div>
                  <div className="section-detail">
                    <span>主要工作：</span>
                    <span className="project-content">{project.project_content}</span>
                  </div>
                </div>
              ) : null)}
            </div>
          </MainWrapper>
        ) : null}
      </div>
    </div>
  );
}
