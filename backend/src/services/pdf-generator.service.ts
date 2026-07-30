import PDFDocument from 'pdfkit'
import logger from '@/utils/logger'

const NAVY = '#1F3864'
const DARK = '#1a1a1a'
const GRAY = '#333333'
const LIGHT_GRAY = '#888888'
const PAGE_WIDTH = 595.28
const MARGIN = 50
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2
const PAGE_HEIGHT = 841.89
const BOTTOM_MARGIN = 50

function needsPageBreak(doc: PDFKit.PDFDocument, neededHeight: number = 30) {
  return doc.y + neededHeight > PAGE_HEIGHT - BOTTOM_MARGIN
}

function getPdfFont(fontName: string = 'Times-Roman', isBold: boolean = false, isItalic: boolean = false): string {
  const norm = (fontName || '').toLowerCase()
  if (norm.includes('calibri') || norm.includes('helvetica') || norm.includes('arial') || norm.includes('sans')) {
    if (isBold && isItalic) return 'Helvetica-BoldOblique'
    if (isBold) return 'Helvetica-Bold'
    if (isItalic) return 'Helvetica-Oblique'
    return 'Helvetica'
  }
  if (norm.includes('courier')) {
    if (isBold && isItalic) return 'Courier-BoldOblique'
    if (isBold) return 'Courier-Bold'
    if (isItalic) return 'Courier-Oblique'
    return 'Courier'
  }
  // Default Times-Roman (Times New Roman / Georgia / Garamond style serif)
  if (isBold && isItalic) return 'Times-BoldItalic'
  if (isBold) return 'Times-Bold'
  if (isItalic) return 'Times-Italic'
  return 'Times-Roman'
}

function sectionHeader(doc: PDFKit.PDFDocument, title: string, fonts: { normal: string; bold: string; italic: string }) {
  if (needsPageBreak(doc, 40)) doc.addPage()

  doc.moveDown(0.7)
  doc.font(fonts.bold).fontSize(12).fillColor(NAVY)
  doc.text(title.toUpperCase(), { width: CONTENT_WIDTH })

  const lineY = doc.y + 4
  doc.rect(MARGIN, lineY, CONTENT_WIDTH, 0.75).fill(NAVY)

  doc.x = MARGIN
  doc.y = lineY + 10
}

function entryHeader(doc: PDFKit.PDFDocument, left: string, right: string, fonts: { normal: string; bold: string; italic: string }) {
  if (needsPageBreak(doc, 30)) doc.addPage()
  doc.font(fonts.bold).fontSize(11).fillColor(DARK)
  const leftWidth = doc.widthOfString(left)
  const rightWidth = doc.widthOfString(right)
  if (leftWidth + rightWidth + 10 < CONTENT_WIDTH) {
    doc.text(left, { width: CONTENT_WIDTH, continued: true })
    doc.font(fonts.normal).fontSize(10).fillColor(GRAY)
    doc.text(right, { align: 'right', width: CONTENT_WIDTH })
  } else {
    doc.text(left, { width: CONTENT_WIDTH })
    doc.font(fonts.normal).fontSize(10).fillColor(GRAY)
    doc.text(right, { align: 'right', width: CONTENT_WIDTH })
  }
  doc.x = MARGIN
}

function entrySub(doc: PDFKit.PDFDocument, left: string, right: string, fonts: { normal: string; bold: string; italic: string }) {
  doc.font(fonts.italic).fontSize(10).fillColor(GRAY)
  const leftWidth = doc.widthOfString(left)
  const rightWidth = doc.widthOfString(right)
  if (leftWidth + rightWidth + 10 < CONTENT_WIDTH) {
    doc.text(left, { width: CONTENT_WIDTH, continued: true })
    doc.text(right, { align: 'right', width: CONTENT_WIDTH })
  } else {
    doc.text(left, { width: CONTENT_WIDTH })
    doc.text(right, { align: 'right', width: CONTENT_WIDTH })
  }
  doc.x = MARGIN
  doc.moveDown(0.15)
}

const STACK_LABEL_REGEX = /^(stack|tech stack|technologies|tools)\s*:\s*/i

function stackLine(doc: PDFKit.PDFDocument, item: string, labelMatch: RegExpMatchArray, fonts: { normal: string; bold: string; italic: string }) {
  if (needsPageBreak(doc, 20)) doc.addPage()
  const label = labelMatch[0]
  const rest = item.slice(label.length)

  doc.font(fonts.bold).fontSize(10.5).fillColor(DARK)
  doc.text(label, MARGIN + 4, undefined, { continued: true, width: CONTENT_WIDTH - 4 })
  doc.font(fonts.normal).fontSize(10.5).fillColor(DARK)
  doc.text(rest, { width: CONTENT_WIDTH - 4, lineGap: 2 })
  doc.x = MARGIN
}

function bulletList(doc: PDFKit.PDFDocument, items: string[], fonts: { normal: string; bold: string; italic: string }) {
  for (const item of items) {
    if (needsPageBreak(doc, 20)) doc.addPage()

    const labelMatch = item.match(STACK_LABEL_REGEX)
    if (labelMatch) {
      stackLine(doc, item, labelMatch, fonts)
      continue
    }

    doc.font(fonts.normal).fontSize(10.5).fillColor(DARK)
    doc.text(`\u2022   ${item}`, MARGIN + 4, undefined, {
      width: CONTENT_WIDTH - 4,
      lineGap: 2,
    })
  }
  doc.moveDown(0.15)
}

export class PdfGeneratorService {
  generateResumePdf(data: any, fontName: string = 'Times New Roman'): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const p = data.personalInfo || {}
      const doc = new PDFDocument({
        size: 'A4',
        margin: MARGIN,
        bufferPages: true,
      })

      const fonts = {
        normal: getPdfFont(fontName, false, false),
        bold: getPdfFont(fontName, true, false),
        italic: getPdfFont(fontName, false, true),
      }

      const chunks: Buffer[] = []
      doc.on('data', (chunk: Buffer) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      try {
        // ── Header ──
        doc.font(fonts.bold).fontSize(22).fillColor(NAVY)
        doc.text(p.name || 'Resume', { align: 'center', width: CONTENT_WIDTH })
        doc.moveDown(0.3)

        // Contact line — plain text without hyperlinks
        const contactParts: string[] = []
        if (p.phone) contactParts.push(p.phone)
        if (p.email) contactParts.push(p.email)
        if (p.linkedin) contactParts.push(p.linkedin.replace(/^https?:\/\//, ''))
        if (p.github) contactParts.push(p.github.replace(/^https?:\/\//, ''))
        if (p.location) contactParts.push(p.location)
        const contactLine = contactParts.join(' | ')
        if (contactLine) {
          doc.font(fonts.normal).fontSize(9.5).fillColor(GRAY)
          doc.text(contactLine, { align: 'center', width: CONTENT_WIDTH })
        }

        // Header underline rule
        doc.moveDown(0.6)
        const headerEnd = doc.y
        doc.rect(MARGIN, headerEnd, CONTENT_WIDTH, 1).fill(NAVY)
        doc.x = MARGIN
        doc.y = headerEnd + 14

        // ── Summary ──
        if (data.summary) {
          sectionHeader(doc, 'Summary', fonts)
          doc.font(fonts.normal).fontSize(10).fillColor(DARK)
          doc.text(data.summary, { width: CONTENT_WIDTH, lineGap: 2, align: 'justify' })
        }

        // ── Work Experience ──
        if (data.experience?.length) {
          sectionHeader(doc, 'Work Experience', fonts)
          for (const exp of data.experience) {
            if (exp.company || exp.dateRange) {
              entryHeader(doc, exp.company || '', exp.dateRange || '', fonts)
            }
            if (exp.role || exp.location) {
              entrySub(doc, exp.role || '', exp.location || '', fonts)
            }
            if (exp.bullets?.length) {
              bulletList(doc, exp.bullets, fonts)
            }
            doc.moveDown(0.3)
          }
        }

        // ── Projects ──
        if (data.projects?.length) {
          sectionHeader(doc, 'Projects', fonts)
          for (const proj of data.projects) {
            if (needsPageBreak(doc, 30)) doc.addPage()
            doc.font(fonts.bold).fontSize(10.5).fillColor(DARK)
            doc.text(proj.name, { width: CONTENT_WIDTH })
            if (proj.bullets?.length) {
              bulletList(doc, proj.bullets, fonts)
            }
            doc.moveDown(0.2)
          }
        }

        // ── Education ──
        if (data.education?.length) {
          sectionHeader(doc, 'Education', fonts)
          for (const edu of data.education) {
            if (edu.institution || edu.dateRange) {
              entryHeader(doc, edu.institution || '', edu.dateRange || '', fonts)
            }
            if (edu.degree || edu.location) {
              entrySub(doc, edu.degree || '', edu.location || '', fonts)
            }
            doc.moveDown(0.3)
          }
        }

        // ── Skills ──
        if (data.skills?.length) {
          sectionHeader(doc, 'Skills', fonts)
          for (const sk of data.skills) {
            if (needsPageBreak(doc, 20)) doc.addPage()
            const label = `${sk.category}: `
            const items = (sk.items || []).join(', ')
            doc.font(fonts.bold).fontSize(10.5).fillColor(NAVY)
            doc.text(label, { width: CONTENT_WIDTH, continued: true })
            doc.font(fonts.normal).fontSize(10.5).fillColor(DARK)
            doc.text(items, { width: CONTENT_WIDTH, lineGap: 2 })
            doc.moveDown(0.15)
          }
        }

        // ── Technical Skills ──
        if (data.technicalSkills?.length) {
          sectionHeader(doc, 'Technical Skills', fonts)
          doc.font(fonts.normal).fontSize(10.5).fillColor(DARK)
          doc.text(data.technicalSkills.join(', '), { width: CONTENT_WIDTH, lineGap: 2 })
        }

        // ── Certifications ──
        if (data.certifications?.length) {
          sectionHeader(doc, 'Certifications', fonts)
          bulletList(doc, data.certifications, fonts)
        }

        doc.end()
      } catch (err) {
        reject(err)
      }
    })
  }
}

export const pdfGeneratorService = new PdfGeneratorService()