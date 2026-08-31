import type { ReactNode } from 'react';
import { Avatar } from '@/components/Avatar';
import type { ResumeConfig } from '@/schema/resumeSchema';
import type { Locale } from '@/store/useResumeStore';
import { getTitle, splitLines } from '../shared';
import './index.less';

type Props = { value: ResumeConfig; locale: Locale };

/** Ribbon（色带卡角）标题卡片容器：纯 CSS 实现替代 antd Badge.Ribbon */
function RibbonCard({
  title, color, children,
}: { title: string; color: string; children: ReactNode }) {
  return (
    <div className="ribbon-card">
      <div className="ribbon" style={{ background: color }}>
        <span>{title}</span>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

function SectionHeader({ title, color }: { title: string; color: string }) {
  return (
    <div className="section-header">
      <h1 style={{ background: color }}>{title}</h1>
    </div>
  );
}

function Wrapper({
  title, color, children,
}: { title: string; color: string; children: ReactNode }) {
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
      {/* 顶部：个人信息 + 头像 */}
      <RibbonCard title="个人信息" color={color}>
        <div className="basic-info">
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
              <Avatar avatarSrc={value.avatar?.src} shape={value.avatar?.shape as any} size={value.avatar?.size ?? 150} />
            </div>
          )}
        </div>
      </RibbonCard>

      {/* 工作 + 项目（1:1 分栏，小屏堆叠） */}
      <div className="row-grid">
        {value.workExpList?.length ? (
          <RibbonCard title={getTitle(value, 'workExpList', locale)} color={color}>
            <Wrapper title="" color={color}>
              <div className="section-list">
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
              </div>
            </Wrapper>
          </RibbonCard>
        ) : null}

        {value.projectList?.length ? (
          <RibbonCard title={getTitle(value, 'projectList', locale)} color={color}>
            <Wrapper title="" color={color}>
              <div className="section-list">
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
              </div>
            </Wrapper>
          </RibbonCard>
        ) : null}
      </div>

      {/* 教育、技能、奖项、作品、自我介绍（等宽分栏或堆叠） */}
      <div className="row-grid">
        {value.educationList?.length ? (
          <RibbonCard title={getTitle(value, 'educationList', locale)} color={color}>
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
          </RibbonCard>
        ) : null}

        {value.skillList?.length ? (
          <RibbonCard title={getTitle(value, 'skillList', locale)} color={color}>
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
          </RibbonCard>
        ) : null}
      </div>

      <div className="row-grid">
        {value.awardList?.length ? (
          <RibbonCard title={getTitle(value, 'awardList', locale)} color={color}>
            {value.awardList.map((a, i) => (
              <div key={i}>
                <span style={{ color: tagColor, marginRight: 6 }}>🎖️</span>
                <b>{a.award_info}</b>
                {a.award_time && <span className="sub">（{a.award_time}）</span>}
              </div>
            ))}
          </RibbonCard>
        ) : null}

        {value.workList?.length ? (
          <RibbonCard title={getTitle(value, 'workList', locale)} color={color}>
            {value.workList.map((w, i) => (
              <div key={i}>
                <span style={{ color: tagColor, marginRight: 6 }}>🏆</span>
                <b>{w.work_name}</b>
                {w.work_desc && <div>{w.work_desc}</div>}
                {w.visit_link && (
                  <a href={w.visit_link} target="_blank" rel="noreferrer" className="sub">访问链接</a>
                )}
              </div>
            ))}
          </RibbonCard>
        ) : null}

        {aboutme.join('').trim() ? (
          <RibbonCard title={getTitle(value, 'aboutme', locale)} color={color}>
            {aboutme.map((d, i) => <div key={i}>{d}</div>)}
          </RibbonCard>
        ) : null}
      </div>
    </div>
  );
}
