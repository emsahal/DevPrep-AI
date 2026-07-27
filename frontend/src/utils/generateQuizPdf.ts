import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { QuizQuestion } from '@/services/quizService'

interface QuizPdfData {
  title: string
  description: string
  topicName?: string
  questions: QuizQuestion[]
  selectedAnswers: Array<{ questionId: string; selectedAnswer: number }>
  score: number
  totalQuestions: number
}

async function loadImageAsBase64(url: string): Promise<string> {
  const response = await fetch(url)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export async function generateQuizPdf(data: QuizPdfData) {
  const { title, description, topicName, questions, selectedAnswers, score, totalQuestions } = data

  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - margin * 2

  // ── Brand Colors ──
  const primary: [number, number, number] = [109, 59, 215]
  const primaryLight: [number, number, number] = [208, 188, 255]
  const primaryDark: [number, number, number] = [52, 0, 128]
  const secondary: [number, number, number] = [76, 215, 246]
  const success: [number, number, number] = [16, 185, 129]
  const error: [number, number, number] = [239, 68, 68]
  const textDark: [number, number, number] = [30, 30, 30]
  const textMuted: [number, number, number] = [100, 100, 110]
  const borderLight: [number, number, number] = [230, 230, 235]
  const bgLight: [number, number, number] = [248, 248, 252]

  const selectedMap = new Map(selectedAnswers.map((a) => [a.questionId, a.selectedAnswer]))

  // ── Load logo ──
  let logoData: string | null = null
  try {
    const logoModule = await import('@/assets/logo.png')
    logoData = await loadImageAsBase64(logoModule.default)
  } catch {
    // logo optional
  }

  // ── Helper: wrapped text block ──
  function textBlock(text: string, x: number, y: number, maxWidth: number, fontSize: number, color: [number, number, number] = textDark, bold = false): number {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y)
    return y + lines.length * fontSize * 0.3528
  }

  // ── Helper: draw a single option ──
  function drawOption(optText: string, idx: number, correctIdx: number, selectedIdx: number | undefined, y: number): number {
    const isCorrect = idx === correctIdx
    const isSelected = idx === selectedIdx
    const prefix = String.fromCharCode(65 + idx)

    const optX = margin + 14
    const optWidth = contentWidth - 18
    const lineHeight = 4.2

    const cleaned = optText.replace(/\\n/g, '\n').replace(/<[^>]*>/g, '')
    doc.setFontSize(9)
    doc.setFont('helvetica', isCorrect || isSelected ? 'bold' : 'normal')
    const lines = doc.splitTextToSize(cleaned, optWidth - 20)
    const blockHeight = Math.max(lines.length * lineHeight + 6, 9)

    let bg: [number, number, number] | null = null
    let fg: [number, number, number] = textDark
    let marker = ''

    if (isSelected && isCorrect) {
      bg = success; fg = success; marker = '  ✓'
    } else if (isSelected && !isCorrect) {
      bg = error; fg = error; marker = '  ✗'
    } else if (isCorrect) {
      bg = [230, 250, 240]; fg = success; marker = '  ✓'
    }

    if (bg) {
      doc.setFillColor(...bg)
      doc.setDrawColor(...bg)
      doc.setOpacity(0.12)
      doc.roundedRect(optX - 4, y - 4, optWidth, blockHeight, 3, 3, 'F')
      doc.setOpacity(1)
    }

    doc.setTextColor(...fg)
    const label = `${prefix}. ${cleaned}${marker}`
    const textLines = doc.splitTextToSize(label, optWidth - 10)
    doc.text(textLines, optX + 2, y + 1)

    return y + blockHeight + 2
  }

  // ── Page Background ──
  doc.setFillColor(252, 252, 254)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  // ============================================================
  //  HEADER
  // ============================================================
  const headerHeight = 52
  doc.setFillColor(...primary)
  doc.rect(0, 0, pageWidth, headerHeight, 'F')

  // Decorative circles
  doc.setFillColor(...primaryDark)
  doc.setOpacity(0.15)
  doc.circle(pageWidth - 30, 10, 25, 'F')
  doc.circle(pageWidth - 10, 40, 15, 'F')
  doc.setOpacity(1)

  // Logo + Brand
  if (logoData) {
    try { doc.addImage(logoData, 'PNG', margin, 10, 24, 24) } catch {}
  }
  doc.setTextColor(...primaryLight)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('DevPrep AI', margin + (logoData ? 30 : 0), 20)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(200, 190, 230)
  doc.text('Master Your Technical Interview', margin + (logoData ? 30 : 0), 27)

  // Right side: quiz title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(255, 255, 255)
  const titleWidth = doc.getTextWidth(title)
  doc.text(title, pageWidth - margin - titleWidth, 20)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(200, 190, 230)
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  doc.text(`Generated: ${dateStr}`, pageWidth - margin - doc.getTextWidth(`Generated: ${dateStr}`), 28)

  // ============================================================
  //  TOPIC BADGE
  // ============================================================
  if (topicName) {
    const badgeY = headerHeight + 8
    doc.setFillColor(240, 235, 255)
    doc.roundedRect(margin, badgeY, contentWidth, 10, 4, 4, 'F')

    doc.setTextColor(...primary)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.text(`Topic: ${topicName}`, margin + 6, badgeY + 7)
  }

  // ============================================================
  //  SCORE CARD
  // ============================================================
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0
  const passed = percentage >= 70
  const scoreY = (topicName ? headerHeight + 24 : headerHeight + 14)

  // Score card background with gradient-like effect
  doc.setFillColor(passed ? 240 : 255, passed ? 252 : 248, passed ? 248 : 246)
  doc.setDrawColor(passed ? [16, 185, 129] : [239, 68, 68])
  doc.roundedRect(margin, scoreY, contentWidth, 36, 6, 6, 'FD')

  // Score badge (left)
  doc.setFillColor(passed ? success : error)
  doc.circle(margin + 24, scoreY + 18, 12, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  const pctStr = `${percentage}%`
  const pctW = doc.getTextWidth(pctStr)
  doc.text(pctStr, margin + 24 - pctW / 2, scoreY + 22)

  // Score text (center)
  doc.setTextColor(...textDark)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  const scoreText = `${score} / ${totalQuestions} correct`
  const sw = doc.getTextWidth(scoreText)
  doc.text(scoreText, pageWidth / 2 - sw / 2, scoreY + 16)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...textMuted)
  const statusText = passed ? 'Congratulations! You passed the quiz.' : 'Keep practicing! Review the explanations below.'
  const statusW = doc.getTextWidth(statusText)
  doc.text(statusText, pageWidth / 2 - statusW / 2, scoreY + 28)

  // Result badge (right)
  const resultLabel = passed ? 'PASSED' : 'FAILED'
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(passed ? success : error)
  const rw = doc.getTextWidth(resultLabel) + 16
  doc.setDrawColor(passed ? success : error)
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(pageWidth - margin - rw, scoreY + 9, rw, 18, 9, 9, 'FD')
  doc.text(resultLabel, pageWidth - margin - rw + (rw - doc.getTextWidth(resultLabel)) / 2, scoreY + 22)

  // ============================================================
  //  QUESTIONS
  // ============================================================
  let yPos = scoreY + 52
  const bottomLimit = pageHeight - 20

  questions.forEach((q, idx) => {
    const selectedAnswer = selectedMap.get(q.id)
    const cleanedText = q.text.replace(/\\n/g, '\n').replace(/<[^>]*>/g, '').replace(/#{1,6}\s/g, '').replace(/\*{1,2}/g, '').replace(/`{1,3}/g, '')

    // ── Check page break needed ──
    if (yPos > bottomLimit - 40) {
      doc.addPage()
      yPos = 20
    }

    // ── Question header ──
    doc.setFillColor(...primary)
    doc.circle(margin + 5, yPos, 5, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    const qNum = `${idx + 1}`
    doc.text(qNum, margin + 5 - doc.getTextWidth(qNum) / 2, yPos + 3)

    // Question text
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...textDark)
    const qLines = doc.splitTextToSize(cleanedText, contentWidth - 24)
    doc.text(qLines, margin + 16, yPos + 1)
    yPos += qLines.length * 4.5 + 6

    // ── Options ──
    q.options.forEach((opt, i) => {
      if (yPos > bottomLimit - 30) {
        doc.addPage()
        yPos = 20
      }
      yPos = drawOption(opt, i, q.correctAnswer, selectedAnswer, yPos)
    })

    // ── Explanation ──
    if (q.explanation) {
      if (yPos > bottomLimit - 30) {
        doc.addPage()
        yPos = 20
      }

      const expText = q.explanation.replace(/\\n/g, '\n').replace(/<[^>]*>/g, '').replace(/\*{1,2}/g, '').replace(/`{1,3}/g, '')

      doc.setFontSize(8.5)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...primary)
      doc.text('EXPLANATION', margin + 6, yPos + 4)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(...textMuted)

      const expLines = doc.splitTextToSize(expText, contentWidth - 16)
      const expH = Math.max(expLines.length * 3.2 + 14, 18)

      // Explanation box
      doc.setFillColor(246, 244, 252)
      doc.setDrawColor(...primary)
      doc.setOpacity(0.3)
      doc.roundedRect(margin, yPos, contentWidth, expH, 4, 4, 'FD')
      doc.setOpacity(1)

      doc.text(expLines, margin + 6, yPos + 12)
      yPos += expH + 8
    }

    // ── Separator ──
    if (idx < questions.length - 1) {
      if (yPos > bottomLimit - 10) {
        doc.addPage()
        yPos = 20
      }
      doc.setDrawColor(...borderLight)
      doc.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 8
    }
  })

  // ============================================================
  //  FOOTER (all pages)
  // ============================================================
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)

    // Footer line
    doc.setDrawColor(...borderLight)
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...textMuted)
    doc.text(`Page ${i} of ${totalPages}`, margin, pageHeight - 6)

    doc.setTextColor(160, 150, 180)
    doc.text('Generated by DevPrep AI', pageWidth - margin - doc.getTextWidth('Generated by DevPrep AI'), pageHeight - 6)
  }

  const filename = `devprep-quiz-${title.replace(/\s+/g, '-').toLowerCase().slice(0, 30)}.pdf`
  doc.save(filename)
}
