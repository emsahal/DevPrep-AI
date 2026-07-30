import {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  BorderStyle, ExternalHyperlink, LevelFormat, convertInchesToTwip
} from 'docx'
import type { ResumeData } from '@/types'

export async function generateResumeDocx(data: ResumeData): Promise<Blob> {
  const NAVY = '1F3864'
  const DARKGRAY = '333333'
  const FONT = 'Times New Roman'

  const children: Paragraph[] = []

  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text: data.personalInfo?.name || 'Resume', bold: true, size: 44, font: FONT, color: NAVY })],
  }))

  const contactParts: any[] = []
  if (data.personalInfo?.phone) contactParts.push(new TextRun({ text: data.personalInfo.phone, size: 20, font: FONT }))
  if (data.personalInfo?.email) {
    if (contactParts.length) contactParts.push(new TextRun({ text: '  |  ', size: 20, font: FONT, color: '888888' }))
    contactParts.push(new TextRun({ text: data.personalInfo.email, size: 20, font: FONT }))
  }
  if (data.personalInfo?.linkedin) {
    if (contactParts.length) contactParts.push(new TextRun({ text: '  |  ', size: 20, font: FONT, color: '888888' }))
    contactParts.push(new ExternalHyperlink({
      link: data.personalInfo.linkedin,
      children: [new TextRun({ text: data.personalInfo.linkedin, size: 20, font: FONT, color: '1155CC', underline: {} })],
    }))
  }

  children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: contactParts }))

  function sectionHeading(text: string) {
    return new Paragraph({
      spacing: { before: 200, after: 100 },
      border: { bottom: { color: NAVY, space: 2, style: BorderStyle.SINGLE, size: 6 } },
      children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 24, font: FONT, color: NAVY })],
    })
  }

  function titleLine(left: string, right?: string) {
    return new Paragraph({
      spacing: { before: 120, after: 20 },
      tabStops: [{ type: 'right', position: convertInchesToTwip(6.5) }],
      children: [
        new TextRun({ text: left, bold: true, size: 22, font: FONT }),
        ...(right ? [new TextRun({ text: `\t${right}`, bold: true, size: 20, font: FONT, color: DARKGRAY })] : []),
      ],
    })
  }

  function subTitleLine(left: string, right?: string) {
    return new Paragraph({
      spacing: { after: 80 },
      tabStops: [{ type: 'right', position: convertInchesToTwip(6.5) }],
      children: [
        new TextRun({ text: left, italics: true, size: 20, font: FONT }),
        ...(right ? [new TextRun({ text: `\t${right}`, italics: true, size: 20, font: FONT, color: DARKGRAY })] : []),
      ],
    })
  }

  function bulletItem(text: string) {
    return new Paragraph({
      numbering: { reference: 'bullet-list', level: 0 },
      spacing: { after: 60 },
      alignment: AlignmentType.JUSTIFIED,
      children: [new TextRun({ text, size: 20, font: FONT })],
    })
  }

  function skillLine(label: string, value: string) {
    return new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: `${label}: `, bold: true, size: 20, font: FONT }),
        new TextRun({ text: value, size: 20, font: FONT }),
      ],
    })
  }

  if (data.summary) {
    children.push(sectionHeading('Professional Summary'))
    children.push(new Paragraph({
      spacing: { after: 120 },
      alignment: AlignmentType.JUSTIFIED,
      children: [new TextRun({ text: data.summary, size: 20, font: FONT })],
    }))
  }

  if (data.experience?.length) {
    children.push(sectionHeading('Experience'))
    data.experience.forEach((exp) => {
      children.push(titleLine(exp.company, exp.dateRange))
      children.push(subTitleLine(exp.role, exp.location))
      exp.bullets?.forEach((b) => children.push(bulletItem(b)))
    })
  }

  if (data.projects?.length) {
    children.push(sectionHeading('Projects'))
    data.projects.forEach((proj) => {
      children.push(titleLine(proj.name))
      proj.bullets?.forEach((b) => children.push(bulletItem(b)))
    })
  }

  if (data.education?.length) {
    children.push(sectionHeading('Education'))
    data.education.forEach((edu) => {
      children.push(titleLine(edu.institution, edu.dateRange))
      children.push(subTitleLine(edu.degree, edu.location))
    })
  }

  if (data.technicalSkills?.length) {
    children.push(sectionHeading('Technical Skills'))
    children.push(new Paragraph({
      spacing: { after: 100 },
      children: [new TextRun({ text: data.technicalSkills.join(' · '), size: 20, font: FONT })],
    }))
  }

  if (data.skills?.length) {
    children.push(sectionHeading('Skills'))
    data.skills.forEach((sk) => skillLine(sk.category, sk.items?.join(', ')))
  }

  if (data.certifications?.length) {
    children.push(sectionHeading('Certifications'))
    data.certifications.forEach((cert) => {
      children.push(new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: `· ${cert}`, size: 20, font: FONT })],
      }))
    })
  }

  const doc = new Document({
    numbering: {
      config: [{
        reference: 'bullet-list',
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '\u2022',
          alignment: AlignmentType.LEFT,
          style: {
            paragraph: {
              indent: { left: convertInchesToTwip(0.28), hanging: convertInchesToTwip(0.18) },
            },
          },
        }],
      }],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 720, bottom: 720, left: 900, right: 900 },
        },
      },
      children,
    }],
  })

  return Packer.toBlob(doc)
}

export async function generateCoverLetterDocx(letter: string, _candidateName: string): Promise<Blob> {
  const FONT = 'Times New Roman'

  const children = letter.split('\n').filter(l => l.trim()).map((line) => {
    return new Paragraph({
      spacing: { after: 160 },
      alignment: AlignmentType.JUSTIFIED,
      children: [new TextRun({ text: line, size: 22, font: FONT })],
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
