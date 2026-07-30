import jsPDF from 'jspdf'
import type { ResumeData } from '@/types'

export async function generateResumePdf(data: ResumeData): Promise<Blob> {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const left = 56
  let y = 48
  const FONT = 'Times-Roman'

  function addText(text: string, size: number, style: 'normal' | 'bold' | 'italic' = 'normal', color?: string, maxW?: number) {
    doc.setFont(FONT, style)
    doc.setFontSize(size)
    if (color) doc.setTextColor(color)
    else doc.setTextColor(0)
    const lines = doc.splitTextToSize(text, maxW || pageW - left * 2)
    doc.text(lines, left, y)
    y += lines.length * (size * 0.3528 * 1.4)
  }

  function addSection(title: string) {
    y += 12
    doc.setDrawColor('#1F3864')
    doc.setLineWidth(0.75)
    doc.line(left, y, pageW - left, y)
    y += 4
    doc.setFont(FONT, 'bold')
    doc.setFontSize(11)
    doc.setTextColor('#1F3864')
    doc.text(title.toUpperCase(), left, y)
    y += 16
  }

  function addBullet(text: string, size: number) {
    doc.setFont(FONT, 'normal')
    doc.setFontSize(size)
    doc.setTextColor('#333333')
    const indent = 16
    const maxW = pageW - left * 2 - indent
    const lines = doc.splitTextToSize(text, maxW)
    doc.text('\u2022', left, y + 1)
    doc.text(lines, left + indent, y)
    y += lines.length * (size * 0.3528 * 1.4) + 4
  }

  // Page check
  function checkPage() {
    if (y > doc.internal.pageSize.getHeight() - 56) {
      doc.addPage()
      y = 48
    }
  }

  // Name
  doc.setFont(FONT, 'bold')
  doc.setFontSize(22)
  doc.setTextColor('#1F3864')
  const name = data.personalInfo?.name || 'Resume'
  doc.text(name, left, y)
  y += 24

  // Contact
  const contactParts = [data.personalInfo?.phone, data.personalInfo?.email].filter(Boolean)
  if (contactParts.length) {
    doc.setFont(FONT, 'normal')
    doc.setFontSize(10)
    doc.setTextColor('#333333')
    doc.text(contactParts.join('  |  '), left, y)
    y += 16
  }

  // Summary
  if (data.summary) {
    addSection('Professional Summary')
    checkPage()
    addText(data.summary, 10, 'normal', '#333333')
  }

  // Experience
  if (data.experience?.length) {
    addSection('Experience')
    data.experience.forEach((exp) => {
      checkPage()
      doc.setFont(FONT, 'bold')
      doc.setFontSize(11)
      doc.setTextColor('#000000')
      const expLine = `${exp.company}${exp.dateRange ? `   ${exp.dateRange}` : ''}`
      const parts = doc.splitTextToSize(expLine, pageW - left * 2)
      doc.text(parts, left, y)
      y += parts.length * 15 + 4

      doc.setFont(FONT, 'italic')
      doc.setFontSize(10)
      doc.setTextColor('#555555')
      const roleLine = [exp.role, exp.location].filter(Boolean).join(' · ')
      if (roleLine) {
        doc.text(roleLine, left, y)
        y += 16
      }

      exp.bullets?.forEach((b) => {
        checkPage()
        addBullet(b, 10)
      })
      y += 4
    })
  }

  // Projects
  if (data.projects?.length) {
    addSection('Projects')
    data.projects.forEach((proj) => {
      checkPage()
      doc.setFont(FONT, 'bold')
      doc.setFontSize(11)
      doc.setTextColor('#000000')
      doc.text(proj.name, left, y)
      y += 16

      proj.bullets?.forEach((b) => {
        checkPage()
        addBullet(b, 10)
      })
      y += 4
    })
  }

  // Education
  if (data.education?.length) {
    addSection('Education')
    data.education.forEach((edu) => {
      checkPage()
      doc.setFont(FONT, 'bold')
      doc.setFontSize(11)
      doc.setTextColor('#000000')
      doc.text(edu.institution, left, y)
      y += 14

      doc.setFont(FONT, 'italic')
      doc.setFontSize(10)
      doc.setTextColor('#555555')
      const eduLine = [edu.degree, edu.location].filter(Boolean).join(' · ')
      if (eduLine) {
        doc.text(`${eduLine}   ${edu.dateRange || ''}`, left, y)
        y += 14
      }
    })
  }

  // Skills
  if (data.skills?.length) {
    addSection('Skills')
    data.skills.forEach((sk) => {
      checkPage()
      doc.setFont(FONT, 'bold')
      doc.setFontSize(10)
      doc.setTextColor('#333333')
      const label = `${sk.category}: `
      const labelW = doc.getTextWidth(label)
      doc.text(label, left, y)
      doc.setFont(FONT, 'normal')
      const items = (sk.items || []).join(', ')
      const maxW = pageW - left * 2 - labelW
      const itemLines = doc.splitTextToSize(items, maxW)
      doc.text(itemLines, left + labelW, y)
      y += Math.max(itemLines.length, 1) * 14
    })
  }

  // Technical Skills (flat)
  if (data.technicalSkills?.length) {
    addSection('Technical Skills')
    checkPage()
    addText(data.technicalSkills.join(', '), 10, 'normal', '#333333')
  }

  // Certifications
  if (data.certifications?.length) {
    addSection('Certifications')
    data.certifications.forEach((cert) => {
      checkPage()
      addBullet(cert, 10)
    })
  }

  return doc.output('blob')
}

export async function generateResumeDocx(data: ResumeData, selectedFont: string = 'Times New Roman'): Promise<Blob> {
  const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, TabStopType, TabStopPosition } = await import('docx')

  const NAVY = '1a3a5c'
  const DARK = '1a1a1a'
  const GRAY = '333333'
  const FONT = selectedFont || 'Times New Roman'

  const children: any[] = []

  // Name header
  const p = data.personalInfo || {} as any
  if (p.name) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [new TextRun({ text: p.name.toUpperCase(), bold: true, size: 44, font: FONT, color: NAVY })],
    }))
  }

  // Contact line
  const contactParts: string[] = []
  if (p.phone) contactParts.push(p.phone)
  if (p.email) contactParts.push(p.email)
  if (p.linkedin) contactParts.push(p.linkedin.replace(/^https?:\/\//, ''))
  if (p.github) contactParts.push(p.github.replace(/^https?:\/\//, ''))
  if (p.location) contactParts.push(p.location)
  if (contactParts.length) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [new TextRun({ text: contactParts.join(' | '), size: 19, font: FONT, color: GRAY })],
    }))
  }

  // Divider after header
  children.push(new Paragraph({
    spacing: { after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: NAVY } },
    children: [],
  }))

  function addSectionHeader(title: string) {
    children.push(new Paragraph({
      spacing: { before: 200, after: 60 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: NAVY } },
      children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 24, font: FONT, color: NAVY })],
    }))
  }

  function addBulletItem(text: string) {
    children.push(new Paragraph({
      spacing: { after: 60 },
      indent: { left: 360, hanging: 180 },
      children: [
        new TextRun({ text: '\u2022  ', size: 21, font: FONT, color: DARK }),
        new TextRun({ text, size: 21, font: FONT, color: DARK }),
      ],
    }))
  }

  // Summary
  if (data.summary) {
    addSectionHeader('Summary')
    children.push(new Paragraph({
      spacing: { after: 120 },
      alignment: AlignmentType.JUSTIFIED,
      children: [new TextRun({ text: data.summary, size: 21, font: FONT, color: DARK })],
    }))
  }

  // Experience
  if (data.experience?.length) {
    addSectionHeader('Work Experience')
    for (const exp of data.experience) {
      // Company + date on same line
      const headerRuns: any[] = []
      if (exp.company) headerRuns.push(new TextRun({ text: exp.company, bold: true, size: 22, font: FONT, color: DARK }))
      if (exp.dateRange) {
        headerRuns.push(new TextRun({ text: '\t', size: 22, font: FONT }))
        headerRuns.push(new TextRun({ text: exp.dateRange, size: 20, font: FONT, color: GRAY }))
      }
      children.push(new Paragraph({
        spacing: { before: 100, after: 40 },
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: headerRuns,
      }))

      // Role + location
      const subRuns: any[] = []
      if (exp.role) subRuns.push(new TextRun({ text: exp.role, italics: true, size: 20, font: FONT, color: GRAY }))
      if (exp.location) {
        subRuns.push(new TextRun({ text: '\t', size: 20, font: FONT }))
        subRuns.push(new TextRun({ text: exp.location, italics: true, size: 20, font: FONT, color: GRAY }))
      }
      if (subRuns.length) {
        children.push(new Paragraph({
          spacing: { after: 60 },
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: subRuns,
        }))
      }

      // Bullets
      if (exp.bullets?.length) {
        exp.bullets.forEach((b: string) => addBulletItem(b))
      }
    }
  }

  // Projects
  if (data.projects?.length) {
    addSectionHeader('Projects')
    for (const proj of data.projects) {
      children.push(new Paragraph({
        spacing: { before: 80, after: 40 },
        children: [new TextRun({ text: proj.name, bold: true, size: 21, font: FONT, color: DARK })],
      }))
      if (proj.bullets?.length) {
        proj.bullets.forEach((b: string) => addBulletItem(b))
      }
    }
  }

  // Education
  if (data.education?.length) {
    addSectionHeader('Education')
    for (const edu of data.education) {
      const headerRuns: any[] = []
      if (edu.institution) headerRuns.push(new TextRun({ text: edu.institution, bold: true, size: 22, font: FONT, color: DARK }))
      if (edu.dateRange) {
        headerRuns.push(new TextRun({ text: '\t', size: 22, font: FONT }))
        headerRuns.push(new TextRun({ text: edu.dateRange, size: 20, font: FONT, color: GRAY }))
      }
      children.push(new Paragraph({
        spacing: { before: 80, after: 40 },
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: headerRuns,
      }))

      const subRuns: any[] = []
      if (edu.degree) subRuns.push(new TextRun({ text: edu.degree, italics: true, size: 20, font: FONT, color: GRAY }))
      if (edu.location) {
        subRuns.push(new TextRun({ text: '\t', size: 20, font: FONT }))
        subRuns.push(new TextRun({ text: edu.location, italics: true, size: 20, font: FONT, color: GRAY }))
      }
      if (subRuns.length) {
        children.push(new Paragraph({
          spacing: { after: 60 },
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: subRuns,
        }))
      }
    }
  }

  // Skills
  if (data.skills?.length) {
    addSectionHeader('Skills')
    for (const sk of data.skills) {
      children.push(new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: `${sk.category}: `, bold: true, size: 21, font: FONT, color: NAVY }),
          new TextRun({ text: (sk.items || []).join(', '), size: 21, font: FONT, color: DARK }),
        ],
      }))
    }
  }

  // Technical Skills
  if (data.technicalSkills?.length) {
    addSectionHeader('Technical Skills')
    children.push(new Paragraph({
      spacing: { after: 80 },
      children: [new TextRun({ text: data.technicalSkills.join(', '), size: 21, font: FONT, color: DARK })],
    }))
  }

  // Certifications
  if (data.certifications?.length) {
    addSectionHeader('Certifications')
    data.certifications.forEach((cert: string) => addBulletItem(cert))
  }

  // Achievements
  if ((data as any).achievements?.length) {
    addSectionHeader('Achievements')
    ;(data as any).achievements.forEach((ach: string) => addBulletItem(ach))
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1080, bottom: 1080, left: 1200, right: 1200 },
        },
      },
      children,
    }],
  })

  return Packer.toBlob(doc)
}

export async function generateCoverLetterDocx(_letter: string, _candidateName: string): Promise<Blob> {
  const { Document, Packer, Paragraph, TextRun, AlignmentType } = await import('docx')
  const children = _letter.split('\n').filter(l => l.trim()).map((line) => {
    return new Paragraph({
      spacing: { after: 160 },
      alignment: AlignmentType.JUSTIFIED,
      children: [new TextRun({ text: line, size: 22, font: 'Times New Roman' })],
    })
  })

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
        },
      },
      children,
    }],
  })

  return Packer.toBlob(doc)
}