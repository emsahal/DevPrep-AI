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

function wrapText(doc: PDFKit.PDFDocument, text: string, indent: number = 0) {
  doc.font('Times-Roman').fontSize(10.5).fillColor(DARK)
  doc.text(text, { indent, width: CONTENT_WIDTH - indent, lineGap: 2 })
}

/**
 * Section heading (e.g. "WORK EXPERIENCE") with a navy underline rule.
 *
 * FIX: previously used `doc.fontSize(0.5)` before `doc.moveDown(0.7)` to
 * draw the rule, which made moveDown() (which scales with the *current*
 * font size) collapse to near-zero — causing the cramped gap under every
 * section heading. Now the rule and spacing use fixed point offsets that
 * are independent of font size, so this can't silently break again.
 */
function sectionHeader(doc: PDFKit.PDFDocument, title: string) {
  if (needsPageBreak(doc, 40)) doc.addPage()

  doc.moveDown(0.7)
  doc.font('Times-Bold').fontSize(12).fillColor(NAVY)
  doc.text(title.toUpperCase(), { width: CONTENT_WIDTH })

  // gap between heading text and the underline rule
  const lineY = doc.y + 4
  doc.rect(MARGIN, lineY, CONTENT_WIDTH, 0.75).fill(NAVY)

  // gap between the rule and the section's body content
  doc.x = MARGIN
  doc.y = lineY + 10
}

function entryHeader(doc: PDFKit.PDFDocument, left: string, right: string) {
  if (needsPageBreak(doc, 30)) doc.addPage()
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
  doc.x = MARGIN
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
  doc.x = MARGIN
  doc.moveDown(0.15)
}

/**
 * Renders a "Stack: X, Y, Z" line as a non-bulleted, hanging-indent line
 * with a bold "Stack:" label — matching how the docx template renders
 * skills lines, instead of treating it as a regular bullet point.
 */
function stackLine(doc: PDFKit.PDFDocument, item: string, labelMatch: RegExpMatchArray) {
  if (needsPageBreak(doc, 20)) doc.addPage()
  const label = labelMatch[0] // e.g. "Stack: "
  const rest = item.slice(label.length)

  doc.font('Times-Bold').fontSize(10.5).fillColor(DARK)
  doc.text(label, MARGIN + 4, undefined, { continued: true, width: CONTENT_WIDTH - 4 })
  doc.font('Times-Roman').fontSize(10.5).fillColor(DARK)
  doc.text(rest, { width: CONTENT_WIDTH - 4, lineGap: 2 })
  doc.x = MARGIN
}

// Matches "Stack:", "Tech Stack:", "Technologies:" etc. at the start of a line
const STACK_LABEL_REGEX = /^(stack|tech stack|technologies|tools)\s*:\s*/i

function bulletList(doc: PDFKit.PDFDocument, items: string[]) {
  for (const item of items) {
    if (needsPageBreak(doc, 20)) doc.addPage()

    const labelMatch = item.match(STACK_LABEL_REGEX)
    if (labelMatch) {
      stackLine(doc, item, labelMatch)
      continue
    }

    doc.font('Times-Roman').fontSize(10.5).fillColor(DARK)
    // Bullet + text rendered as a single text call so PDFKit never splits
    // them across a page break with mismatched Y positions.
    doc.text(`\u2022   ${item}`, MARGIN + 4, undefined, {
      width: CONTENT_WIDTH - 4,
      lineGap: 2,
    })
  }
  doc.x = MARGIN
  doc.moveDown(0.15)
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

      try {
        // ── Header ──
        doc.font('Times-Bold').fontSize(22).fillColor(NAVY)
        doc.text(p.name || 'Resume', { align: 'center', width: CONTENT_WIDTH })
        doc.moveDown(0.3)

        // Contact line — phone/email/location as plain text,
        // LinkedIn/GitHub rendered as clickable hyperlinks.
        //
        // NOTE: we intentionally avoid passing explicit x/y coordinates to
        // doc.text() when using the `link` option. PDFKit's link-annotation
        // code computes the clickable rectangle from its own internal text
        // layout state; mixing that with manual x/y + lineBreak:false made
        // it compute a NaN width and crash inside PDFDocument.link(). Using
        // `continued: true` chaining lets PDFKit track position/width itself.
        const LINK_COLOR = '#1155CC'
        type ContactPart = { text: string; url?: string }
        const contactItems: ContactPart[] = []
        if (p.phone) contactItems.push({ text: p.phone })
        if (p.email) contactItems.push({ text: p.email, url: `mailto:${p.email}` })
        if (p.linkedin) {
          const url = p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}`
          contactItems.push({ text: p.linkedin.replace(/^https?:\/\//, ''), url })
        }
        if (p.github) {
          const url = p.github.startsWith('http') ? p.github : `https://${p.github}`
          contactItems.push({ text: p.github.replace(/^https?:\/\//, ''), url })
        }
        if (p.location) contactItems.push({ text: p.location })

        if (contactItems.length) {
          const sep = '   |   '

          // Compute total rendered width so we can center the whole line
          // by setting a starting x, then let continued:true handle the rest.
          doc.font('Times-Roman').fontSize(9.5)
          let totalWidth = 0
          contactItems.forEach((item, i) => {
            totalWidth += doc.widthOfString(item.text)
            if (i < contactItems.length - 1) totalWidth += doc.widthOfString(sep)
          })

          const startX = MARGIN + Math.max(0, (CONTENT_WIDTH - totalWidth) / 2)
          doc.x = startX

          contactItems.forEach((item, i) => {
            const isLast = i === contactItems.length - 1

            doc.font('Times-Roman').fontSize(9.5)
            doc.fillColor(item.url ? LINK_COLOR : LIGHT_GRAY)
            doc.text(item.text, {
              continued: !isLast,
              link: item.url,
              underline: !!item.url,
            })

            if (!isLast) {
              doc.fillColor(LIGHT_GRAY)
              doc.text(sep, { continued: true })
            }
          })

          // last item already had continued:false, so the line is already closed
          doc.x = MARGIN
          doc.moveDown(0.2)
        }

        // header underline rule
        doc.moveDown(0.6)
        const headerEnd = doc.y
        doc.rect(MARGIN, headerEnd, CONTENT_WIDTH, 1).fill(NAVY)
        doc.x = MARGIN
        doc.y = headerEnd + 14

        // ── Summary ──
        if (data.summary) {
          sectionHeader(doc, 'Summary')
          doc.font('Times-Roman').fontSize(10).fillColor(DARK)
          doc.text(data.summary, { width: CONTENT_WIDTH, lineGap: 2, align: 'justify' })
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
            doc.moveDown(0.3)
          }
        }

        // ── Projects ──
        if (data.projects?.length) {
          sectionHeader(doc, 'Projects')
          for (const proj of data.projects) {
            if (needsPageBreak(doc, 30)) doc.addPage()
            doc.font('Times-Bold').fontSize(10.5).fillColor(DARK)
            doc.text(proj.name, { width: CONTENT_WIDTH })
            if (proj.bullets?.length) {
              bulletList(doc, proj.bullets)
            }
            doc.moveDown(0.2)
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
            doc.moveDown(0.3)
          }
        }

        // ── Skills ──
        if (data.skills?.length) {
          sectionHeader(doc, 'Skills')
          for (const sk of data.skills) {
            if (needsPageBreak(doc, 20)) doc.addPage()
            const label = `${sk.category}: `
            const items = (sk.items || []).join(', ')
            doc.font('Times-Bold').fontSize(10.5).fillColor(NAVY)
            doc.text(label, { width: CONTENT_WIDTH, continued: true })
            doc.font('Times-Roman').fontSize(10.5).fillColor(DARK)
            doc.text(items, { width: CONTENT_WIDTH, lineGap: 2 })
            doc.x = MARGIN
            doc.moveDown(0.15)
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
      } catch (err) {
        logger.error('Failed to generate resume PDF', err)
        reject(err)
      }
    })
  }
}

export const pdfGeneratorService = new PdfGeneratorService()