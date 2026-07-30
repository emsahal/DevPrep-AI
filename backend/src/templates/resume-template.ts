export function renderResumeHtml(data: any): string {
  const p = data.personalInfo || {}
  const contactParts: string[] = []
  if (p.phone) contactParts.push(`<span>${p.phone}</span>`)
  if (p.email) contactParts.push(`<span>${p.email}</span>`)
  if (p.linkedin) contactParts.push(`<span><a href="${p.linkedin}">${p.linkedin.replace(/^https?:\/\//, '')}</a></span>`)
  if (p.github) contactParts.push(`<span><a href="${p.github}">${p.github.replace(/^https?:\/\//, '')}</a></span>`)
  if (p.location) contactParts.push(`<span>${p.location}</span>`)

  const summarySection = data.summary ? `
    <section>
      <p style="margin:0;line-height:1.5;font-size:10pt;color:#333">${data.summary}</p>
    </section>
  ` : ''

  const experienceSection = data.experience?.length ? `
    <section>
      <h2>Work Experience</h2>
      ${data.experience.map((exp: any) => `
        <div class="entry">
          <div class="entry-header">
            <span>${exp.company}</span>
            <span>${exp.dateRange || ''}</span>
          </div>
          <div class="entry-sub">
            <span>${exp.role || ''}</span>
            <span>${exp.location || ''}</span>
          </div>
          <ul>
            ${(exp.bullets || []).map((b: string) => `<li>${b}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </section>
  ` : ''

  const projectsSection = data.projects?.length ? `
    <section>
      <h2>Projects</h2>
      ${data.projects.map((proj: any) => `
        <div class="entry">
          <div class="project-title">${proj.name}</div>
          <ul>
            ${(proj.bullets || []).map((b: string) => `<li>${b}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </section>
  ` : ''

  const educationSection = data.education?.length ? `
    <section>
      <h2>Education</h2>
      ${data.education.map((edu: any) => `
        <div class="entry">
          <div class="entry-header">
            <span>${edu.institution}</span>
            <span>${edu.dateRange || ''}</span>
          </div>
          <div class="entry-sub">
            <span>${edu.degree || ''}</span>
            <span>${edu.location || ''}</span>
          </div>
        </div>
      `).join('')}
    </section>
  ` : ''

  const skillsSection = data.skills?.length ? `
    <section>
      <h2>Skills</h2>
      ${data.skills.map((sk: any) => `
        <div class="skills-row"><b>${sk.category}:</b> ${(sk.items || []).join(', ')}</div>
      `).join('')}
    </section>
  ` : ''

  const techSkillsSection = data.technicalSkills?.length ? `
    <section>
      <h2>Technical Skills</h2>
      <div class="skills-row">${data.technicalSkills.join(', ')}</div>
    </section>
  ` : ''

  const certSection = data.certifications?.length ? `
    <section>
      <h2>Certifications</h2>
      <ul>
        ${data.certifications.map((c: string) => `<li>${c}</li>`).join('')}
      </ul>
    </section>
  ` : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${p.name || 'Resume'} - Resume</title>
<style>
  @page { margin: 0; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Georgia', 'Times New Roman', serif;
    color: #1a1a1a;
    margin: 0;
    padding: 40px 55px;
    font-size: 10.5pt;
    line-height: 1.45;
  }
  header {
    text-align: center;
    margin-bottom: 14px;
    border-bottom: 2px solid #1a3a5c;
    padding-bottom: 10px;
  }
  header h1 {
    margin: 0 0 6px 0;
    font-size: 22pt;
    letter-spacing: 0.5px;
    color: #1a3a5c;
  }
  .contact { font-size: 9.5pt; color: #333; }
  .contact a { color: #1a3a5c; text-decoration: none; }
  .contact span:not(:last-child)::after { content: " | "; color: #999; }
  section { margin-top: 16px; }
  h2 {
    font-size: 12pt;
    color: #1a3a5c;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 1px solid #1a3a5c;
    padding-bottom: 3px;
    margin: 0 0 8px 0;
  }
  .entry { margin-bottom: 10px; }
  .entry-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 11pt;
  }
  .entry-sub {
    display: flex;
    justify-content: space-between;
    font-style: italic;
    font-size: 10pt;
    color: #333;
    margin-bottom: 4px;
  }
  ul { margin: 4px 0 0 0; padding-left: 18px; }
  li { margin-bottom: 3px; }
  .project-title { font-weight: bold; font-size: 10.5pt; }
  .skills-row { margin-bottom: 4px; }
  .skills-row b { color: #1a3a5c; }
</style>
</head>
<body>
  <header>
    <h1>${(p.name || 'Resume').toUpperCase()}</h1>
    <div class="contact">
      ${contactParts.join('\n      ')}
    </div>
  </header>
  ${summarySection}
  ${experienceSection}
  ${projectsSection}
  ${educationSection}
  ${skillsSection}
  ${techSkillsSection}
  ${certSection}
</body>
</html>`
}
