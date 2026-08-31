import type { ReactNode } from 'react';
import { Avatar } from '@/components/Avatar';
import type { ResumeConfig } from '@/schema/resumeSchema';
import type { Locale } from '@/store/useResumeStore';
import { getTitle, splitLines } from '../shared';
import './index.less';

type Props = { value: ResumeConfig; locale: Locale };

function Wrapper({
  className, title, color, children,
}: { className?: string; title: string; color: string; children: ReactNode }) {
  return (
    <div className={`section ${className ?? ''}`}>
      <div className="section-title" style={{ color }}>
        <span className="title">{title}</span>
        <span className="title-addon" />
      </div>
      <div className="section-body">{children}</div>
    </div>
  );
}

export function Template2({ value, locale }: Props) {
  const theme = value.theme ?? { color: '#2f5785', tagColor: '#8bc34a' };
  const profile = value.profile;
  const aboutme = splitLines(value.aboutme?.aboutme_desc);
  const color = theme.color;
  const tagColor = theme.tagColor;

  return (
    <div className="template2-resume resume-content">
      {/* 顶部头部区：左个人信息 + 右头像 */}
      <div className="basic-info" style={{ background: color }}>
        <div className="profile">
          <div className="profile-info">
            {profile?.name && <div className="name">{profile.name}</div>}
            <div className="profile-list">
              {profile?.mobile && <div className="item">📱 {profile.mobile}</div>}
              {profile?.email && <div className="item">✉️ {profile.email}</div>}
              {profile?.github && (
                <div className="item">
                  🐙 <a href={profile.github} target="_blank" rel="noreferrer">{profile.github}</a>
                </div>
              )}
              {profile?.zhihu && (
                <div className="item">
                  💡 <a href={profile.zhihu} target="_blank" rel="noreferrer">{profile.zhihu}</a>
                </div>
              )}
              {profile?.workExpYear && <div className="item">⏰ 工作经验：{profile.workExpYear}</div>}
              {profile?.workPlace && <div className="item">📍 期望工作地：{profile.workPlace}</div>}
              {profile?.positionTitle && <div className="item">💼 职位：{profile.positionTitle}</div>}
            </div>
          </div>
          {!value.avatar?.hidden && (
            <div className="profile-avatar">
              <Avatar avatarSrc={value.avatar?.src} shape={value.avatar?.shape as any} size={value.avatar?.size ?? 120} />
            </div>
          )}
        </div>
      </div>

      {/* 左右两栏主内容 */}
      <div className="main-body">
        {/* 左栏 */}
        <aside className="side-bar">
          {value.educationList?.length ? (
            <Wrapper title={getTitle(value, 'educationList', locale)} color={color}>
              {value.educationList.map((edu, i) => {
                const [start, end] = edu.edu_time;
                return (
                  <div key={i} className="education-item">
                    <div className="edu-top">
                      <b>{edu.school}</b>
                      <span className="sub">{start}{end ? ` ~ ${end}` : ''}</span>
                    </div>
                    <div>
                      {edu.major && <span>{edu.major}</span>}
                      {edu.academic_degree && <span className="sub" style={{ marginLeft: 4 }}>（{edu.academic_degree}）</span>}
                    </div>
                  </div>
                );
              })}
            </Wrapper>
          ) : null}

          {value.awardList?.length ? (
            <Wrapper title={getTitle(value, 'awardList', locale)} color={color}>
              {value.awardList.map((a, i) => (
                <div key={i}>
                  <span style={{ color: tagColor, marginRight: 6 }}>🎖️</span>
                  <b>{a.award_info}</b>
                  {a.award_time && <span className="sub">（{a.award_time}）</span>}
                </div>
              ))}
            </Wrapper>
          ) : null}

          {value.skillList?.length ? (
            <Wrapper title={getTitle(value, 'skillList', locale)} color={color}>
              {value.skillList.map((s, i) => s ? (
                <div key={i}>
                  <b>{s.skill_name}</b>
                  {splitLines(s.skill_desc).map((d, j) => d ? (
                    <div key={j} className="skill-item">
                      <span style={{ color: tagColor, marginRight: 6 }}>✓</span>{d}
                    </div>
                  ) : null)}
                </div>
              ) : null)}
            </Wrapper>
          ) : null}

          {value.workList?.length ? (
            <Wrapper title={getTitle(value, 'workList', locale)} color={color}>
              {value.workList.map((w, i) => (
                <div key={i}>
                  <span style={{ color: tagColor, marginRight: 6 }}>🏆</span>
                  <b>{w.work_name}</b>
                  {w.work_desc && <div>{w.work_desc}</div>}
                </div>
              ))}
            </Wrapper>
          ) : null}
        </aside>

        {/* 右栏 */}
        <div className="content-bar">
          {aboutme.join('').trim() ? (
            <Wrapper title={getTitle(value, 'aboutme', locale)} color={color}>
              {aboutme.map((d, i) => <div key={i}>{d}</div>)}
            </Wrapper>
          ) : null}

          {value.workExpList?.length ? (
            <Wrapper title={getTitle(value, 'workExpList', locale)} color={color}>
              {value.workExpList.map((work, i) => {
                const [start, end] = work.work_time ?? [];
                return (
                  <div className="section-item" key={i}>
                    <div className="section-info">
                      <b>
                        {work.company_name}
                        <span className="sub">{work.department_name}</span>
                      </b>
                      <span className="sub">{start}{end ? ` ~ ${end}` : ''}</span>
                    </div>
                    <div className="work-desc">{work.work_desc}</div>
                  </div>
                );
              })}
            </Wrapper>
          ) : null}

          {value.projectList?.length ? (
            <Wrapper title={getTitle(value, 'projectList', locale)} color={color}>
              {value.projectList.map((project, i) => (
                <div className="section-item" key={i}>
                  <div className="section-info">
                    <b>
                      {project.project_name}
                      <span className="sub">{project.project_time}</span>
                    </b>
                    {project.project_role && (
                      <span className="tag" style={{ background: tagColor }}>{project.project_role}</span>
                    )}
                  </div>
                  {project.project_desc && (
                    <div className="section-detail"><b>项目描述：</b>{project.project_desc}</div>
                  )}
                  {project.project_content && (
                    <div className="section-detail"><b>主要工作：</b><span className="project-content">{project.project_content}</span></div>
                  )}
                </div>
              ))}
            </Wrapper>
          ) : null}
        </div>
      </div>
    </div>
  );
}
