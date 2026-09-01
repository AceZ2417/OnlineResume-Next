import type { ReactNode } from 'react';
import { Avatar } from '@/components/Avatar';
import type { ResumeConfig } from '@/schema/resumeSchema';
import type { Locale } from '@/store/useResumeStore';
import { getTitle, splitLines } from '../shared';
import { MobileFilled, MailFilled, GithubFilled, ZhihuCircleFilled, ScheduleFilled, EnvironmentFilled, HeartFilled, CrownFilled, CheckCircleFilled, TrophyFilled } from '@ant-design/icons';
import './index.less';

type Props = { value: ResumeConfig; locale: Locale };

/** 右侧 main-info 区的斜切角 section header */
function SectionHeader({ id, title, color }: { id?: string; title: string; color: string }) {
  return (
    <div className="section-header">
      {id && <img src={`images/${id}.png`} alt="" width="26" height="26" onError={(e) => (e.currentTarget.style.display = 'none')} />}
      <h1 style={{ background: color }}>{title}</h1>
    </div>
  );
}

function Wrapper({ id, title, color, children }: { id?: string; title: string; color: string; children: ReactNode }) {
  return (
    <section>
      <SectionHeader id={id} title={title} color={color} />
      <div className="section-body">{children}</div>
    </section>
  );
}

export function Template1({ value, locale }: Props) {
  const theme = value.theme ?? { color: '#5b8ff9', tagColor: '#8bc34a' };
  const profile = value.profile;
  const aboutme = splitLines(value.aboutme?.aboutme_desc);
  const color = theme.color;

  return (
    <div className="template1-resume resume-content">
      {/* 左栏 2fr */}
      <div className="basic-info">
        {!value.avatar?.hidden && (
          <Avatar
            avatarSrc={value.avatar?.src}
            className="avatar"
            shape={value.avatar?.shape as 'circle' | 'square' | undefined}
            size={value.avatar?.size ?? 84}
          />
        )}
        <div className="profile">
          {profile?.name && <div className="name">{profile.name}</div>}
          <div className="profile-list">
            {profile?.mobile && (
              <div className="item">
                <MobileFilled style={{ color, opacity: 0.85 }} />
                {profile.mobile}
              </div>
            )}
            {profile?.email && (
              <div className="item">
                <MailFilled style={{ color, opacity: 0.85 }} />
                {profile.email}
              </div>
            )}
            {profile?.github && (
              <div className="item">
                <GithubFilled style={{ color, opacity: 0.85 }} />
                <a href={profile.github} target="_blank" rel="noreferrer">{profile.github}</a>
              </div>
            )}
            {profile?.zhihu && (
              <div className="item">
                <ZhihuCircleFilled style={{ color, opacity: 0.85 }} />
                <a href={profile.zhihu} target="_blank" rel="noreferrer">{profile.zhihu}</a>
              </div>
            )}
            {profile?.workExpYear && (
              <div className="item">
                <ScheduleFilled style={{ color, opacity: 0.85 }} />
                <span>工作经验: {profile.workExpYear}</span>
              </div>
            )}
            {profile?.workPlace && (
              <div className="item">
                <EnvironmentFilled style={{ color, opacity: 0.85 }} />
                <span>期望工作地: {profile.workPlace}</span>
              </div>
            )}
            {profile?.positionTitle && (
              <div className="item">
                <HeartFilled style={{ color, opacity: 0.85 }} />
                <span>职位: {profile.positionTitle}</span>
              </div>
            )}
          </div>
        </div>

        {aboutme.join('').trim() && (
          <section className="section section-aboutme">
            <div className="section-title" style={{ color }}>{getTitle(value, 'aboutme', locale)}</div>
            {aboutme.map((d, i) => <div key={i}>{d}</div>)}
          </section>
        )}

        {value.educationList?.length ? (
          <section className="section section-education">
            <div className="section-title" style={{ color }}>{getTitle(value, 'educationList', locale)}</div>
            {value.educationList.map((edu, i) => {
              const [start, end] = edu.edu_time;
              return (
                <div key={i} className="education-item">
                  <div>
                    <b>{edu.school}</b>
                    <span className="sub-info" style={{ float: 'right' }}>
                      {start}{end ? ` ~ ${end}` : ' 至今'}
                    </span>
                  </div>
                  <div>
                    {edu.major && <span>{edu.major}</span>}
                    {edu.academic_degree && (
                      <span className="sub-info" style={{ marginLeft: 4 }}>（{edu.academic_degree}）</span>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        ) : null}

        {value.workList?.length ? (
          <section className="section section-work">
            <div className="section-title" style={{ color }}>{getTitle(value, 'workList', locale)}</div>
            {value.workList.map((work, i) => (
              <div key={i}>
                <div>
                  <CrownFilled style={{ color: '#ffc107', marginRight: '8px' }} />
                  <b className="info-name">{work.work_name}</b>
                  {work.visit_link && (
                    <a className="sub-info" href={work.visit_link} target="_blank" rel="noreferrer">访问链接</a>
                  )}
                </div>
                {work.work_desc && <div>{work.work_desc}</div>}
              </div>
            ))}
          </section>
        ) : null}

        {value.skillList?.length ? (
          <section className="section section-skill">
            <div className="section-title" style={{ color }}>{getTitle(value, 'skillList', locale)}</div>
            {value.skillList.map((skill, i) => skill ? (
              <div key={i}>
                <div className="section-info" style={{ marginTop: 8 }}>
                  <b className="info-name">{skill.skill_name}</b>
                  {skill.skill_level != null && (
                    <span className="skill-rate">
                      {'★'.repeat(Math.round(skill.skill_level / 20))}
                      <span className="skill-rate-empty">{'★'.repeat(5 - Math.round(skill.skill_level / 20))}</span>
                    </span>
                  )}
                </div>
                {splitLines(skill.skill_desc).map((d, j) => d ? (
                  <div className="skill-detail-item" key={j}>
                    <CheckCircleFilled style={{ color: '#ffc107', marginRight: '8px' }} />
                    {d}
                  </div>
                ) : null)}
              </div>
            ) : null)}
          </section>
        ) : null}

        {value.awardList?.length ? (
          <section className="section section-award">
            <div className="section-title" style={{ color }}>{getTitle(value, 'awardList', locale)}</div>
            {value.awardList.map((award, i) => (
              <div key={i}>
                <TrophyFilled style={{ color: '#ffc107', marginRight: '8px' }} />
                <b className="info-name">{award.award_info}</b>
                {award.award_time && <span className="sub-info award-time">（{award.award_time}）</span>}
              </div>
            ))}
          </section>
        ) : null}
      </div>

      {/* 右栏 3fr */}
      <div className="main-info">
        {value.workExpList?.length ? (
          <Wrapper id="work-experience" title={getTitle(value, 'workExpList', locale)} color={color}>
            <div className="section section-work-exp">
              {value.workExpList.map((work, i) => {
                const [start, end] = work.work_time ?? [];
                return (
                  <div className="section-item" key={i}>
                    <div className="section-info">
                      <b className="info-name">
                        {work.company_name}
                        <span className="sub-info">{work.department_name}</span>
                      </b>
                      <span className="info-time">{start}{end ? ` ~ ${end}` : ' 至今'}</span>
                    </div>
                    <div className="work-description">{work.work_desc}</div>
                  </div>
                );
              })}
            </div>
          </Wrapper>
        ) : null}

        {value.projectList?.length ? (
          <Wrapper id="skill" title={getTitle(value, 'projectList', locale)} color={color}>
            <div className="section section-project">
              {value.projectList.map((project, i) => (
                <div className="section-item" key={i}>
                  <div className="section-info">
                    <b className="info-name">
                      {project.project_name}
                      <span className="info-time">{project.project_time}</span>
                    </b>
                    {project.project_role && (
                      <span className="tag" style={{ background: theme.tagColor }}>{project.project_role}</span>
                    )}
                  </div>
                  {project.project_desc && (
                    <div className="section-detail"><b>项目描述：</b><span>{project.project_desc}</span></div>
                  )}
                  {project.project_content && (
                    <div className="section-detail"><b>主要工作：</b><span className="project-content">{project.project_content}</span></div>
                  )}
                </div>
              ))}
            </div>
          </Wrapper>
        ) : null}
      </div>
    </div>
  );
}
