import PDFDocument from 'pdfkit'
import logger from '@/utils/logger'

const NAVY = '#1a3a5c'
const DARK = '#1a1a1a'
const GRAY = '#333333'
const PAGE_WIDTH = 595.28
const MARGIN = 50
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

function wrapText(doc: PDFKit.PDFDocument, text: string, indent: number = 0) {
  doc.font('Times-Roman').fontSize(10.5).fillColor(DARK)
  doc.text(text, { indent, width: CONTENT_WIDTH - indent, lineGap: 3 })
}

function sectionHeader(doc: PDFKit.PDFDocument, title: string) {
  doc.moveDown(0.6)
  doc.font('Times-Bold').fontSize(12).fillColor(NAVY)
  doc.text(title.toUpperCase(), { width: CONTENT_WIDTH })
  doc.moveDown(0.15)
  doc.fontSize(0.5).fillColor(NAVY)
  const y = doc.y
  doc.rect(MARGIN, y, CONTENT_WIDTH, 0.6).fill(NAVY)
  doc.moveDown(0.6)
}

function entryHeader(doc: PDFKit.PDFDocument, left: string, right: string) {
  doc.font('Times-Bold').fontSize(11).fillColor(DARK)
  const leftWidth = doc.widthOfString(left)
  const rightWidth = doc.widthOfString(right)
  if (leftWidth + rightWidth + 10 < CONTENT_WIDTH) {
    doc.text(left, { width: CONTENT_WIDTH, continued: true })
    doc.font('Times-Roman').fontSize(10).fillColor(GRAY)
    doc.text(right, { align: 'right', width: CONTENT_WIDTH })
  } else {
    doc.text(left, { width: CONTENT_WIDTH })
    doc.font('Times-Roman').fontSize(10).fillColor(GRAY)
    doc.text(right, { align: 'right', width: CONTENT_WIDTH })
  }
}

function entrySub(doc: PDFKit.PDFDocument, left: string, right: string) {
  doc.font('Times-Italic').fontSize(10).fillColor(GRAY)
  const leftWidth = doc.widthOfString(left)
  const rightWidth = doc.widthOfString(right)
  if (leftWidth + rightWidth + 10 < CONTENT_WIDTH) {
    doc.text(left, { width: CONTENT_WIDTH, continued: true })
    doc.text(right, { align: 'right', width: CONTENT_WIDTH })
  } else {
    doc.text(left, { width: CONTENT_WIDTH })
    doc.text(right, { align: 'right', width: CONTENT_WIDTH })
  }
  doc.moveDown(0.25)
}

function bulletList(doc: PDFKit.PDFDocument, items: string[]) {
  for (const item of items) {
    doc.font('Times-Roman').fontSize(10.5).fillColor(DARK)
    const x = MARGIN + 18
    const savedX = doc.x
    const savedY = doc.y
    doc.x = x - 12
    doc.text('\u2022', { width: 10, lineGap: 3 })
    doc.y = savedY
    doc.x = x
    doc.text(item, { width: CONTENT_WIDTH - 18, lineGap: 3 })
    doc.x = savedX
  }
  doc.moveDown(0.3)
}

export class PdfGeneratorService {
  generateResumePdf(data: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const p = data.personalInfo || {}
      const doc = new PDFDocument({
        size: 'A4',
        margin: MARGIN,
        bufferPages: true,
      })

      const chunks: Buffer[] = []
      doc.on('data', (chunk: Buffer) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      // ── Header ──
      doc.font('Times-Bold').fontSize(22).fillColor(NAVY)
      doc.text((p.name || 'Resume').toUpperCase(), { align: 'center', width: CONTENT_WIDTH })
      doc.moveDown(0.3)

      // Contact
      const contactParts: string[] = []
      if (p.phone) contactParts.push(p.phone)
      if (p.email) contactParts.push(p.email)
      if (p.linkedin) contactParts.push(p.linkedin.replace(/^https?:\/\//, ''))
      if (p.github) contactParts.push(p.github.replace(/^https?:\/\//, ''))
      if (p.location) contactParts.push(p.location)
      const contactLine = contactParts.join(' | ')
      if (contactLine) {
        doc.font('Times-Roman').fontSize(9.5).fillColor(GRAY)
        doc.text(contactLine, { align: 'center', width: CONTENT_WIDTH })
      }
      doc.moveDown(0.5)
      doc.fontSize(0.7).fillColor(NAVY)
      const headerEnd = doc.y
      doc.rect(MARGIN, headerEnd, CONTENT_WIDTH, 1).fill(NAVY)
      doc.y = headerEnd + 1

      // ── Summary ──
      if (data.summary) {
        sectionHeader(doc, 'Summary')
        doc.font('Times-Roman').fontSize(10).fillColor(DARK)
        doc.text(data.summary, { width: CONTENT_WIDTH, lineGap: 3, align: 'justify' })
      }

      // ── Work Experience ──
      if (data.experience?.length) {
        sectionHeader(doc, 'Work Experience')
        for (const exp of data.experience) {
          if (exp.company || exp.dateRange) {
            entryHeader(doc, exp.company || '', exp.dateRange || '')
          }
          if (exp.role || exp.location) {
            entrySub(doc, exp.role || '', exp.location || '')
          }
          if (exp.bullets?.length) {
            bulletList(doc, exp.bullets)
          }
          doc.moveDown(0.5)
        }
      }

      // ── Projects ──
      if (data.projects?.length) {
        sectionHeader(doc, 'Projects')
        for (const proj of data.projects) {
          doc.font('Times-Bold').fontSize(10.5).fillColor(DARK)
          doc.text(proj.name, { width: CONTENT_WIDTH })
          if (proj.bullets?.length) {
            bulletList(doc, proj.bullets)
          }
          doc.moveDown(0.4)
        }
      }

      // ── Education ──
      if (data.education?.length) {
        sectionHeader(doc, 'Education')
        for (const edu of data.education) {
          if (edu.institution || edu.dateRange) {
            entryHeader(doc, edu.institution || '', edu.dateRange || '')
          }
          if (edu.degree || edu.location) {
            entrySub(doc, edu.degree || '', edu.location || '')
          }
          doc.moveDown(0.4)
        }
      }

      // ── Skills ──
      if (data.skills?.length) {
        sectionHeader(doc, 'Skills')
        for (const sk of data.skills) {
          const label = `${sk.category}: `
          const items = (sk.items || []).join(', ')
          doc.font('Times-Bold').fontSize(10.5).fillColor(NAVY)
          doc.text(label, { width: CONTENT_WIDTH, continued: true })
          doc.font('Times-Roman').fontSize(10.5).fillColor(DARK)
          doc.text(items, { width: CONTENT_WIDTH, lineGap: 3 })
          doc.moveDown(0.2)
        }
      }

      // ── Technical Skills ──
      if (data.technicalSkills?.length) {
        sectionHeader(doc, 'Technical Skills')
        doc.font('Times-Roman').fontSize(10.5).fillColor(DARK)
        doc.text(data.technicalSkills.join(', '), { width: CONTENT_WIDTH, lineGap: 2 })
      }

      // ── Certifications ──
      if (data.certifications?.length) {
        sectionHeader(doc, 'Certifications')
        bulletList(doc, data.certifications)
      }

      doc.end()
    })
  }
}

export const pdfGeneratorService = new PdfGeneratorService()
