import jsPDF from 'jspdf'
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

function toFileName(text: string, idx: number): string {
  const words = text.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(Boolean).slice(0, 4)
  return `q${String(idx + 1).padStart(2, '0')}-${words.join('-').toLowerCase() || 'question'}.spec.js`
}

export async function generateQuizPdf(data: QuizPdfData) {
  const { title, topicName, questions, selectedAnswers, score, totalQuestions } = data

  const doc = new jsPDF('p', 'mm', 'a4')
  const pw = doc.internal.pageSize.getWidth()
  const ph = doc.internal.pageSize.getHeight()
  const m = 18
  const cw = pw - m * 2

  const ink: [number, number, number] = [11, 18, 32]
  const paper: [number, number, number] = [247, 246, 242]
  const line: [number, number, number] = [228, 225, 216]
  const muted: [number, number, number] = [87, 96, 106]
  const pass: [number, number, number] = [26, 127, 55]
  const passBg: [number, number, number] = [218, 251, 225]
  const fail: [number, number, number] = [207, 34, 46]
  const failBg: [number, number, number] = [255, 235, 233]
  const fileHdr: [number, number, number] = [241, 239, 233]

  const selectedMap = new Map(selectedAnswers.map((a) => [a.questionId, a.selectedAnswer]))

  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0
  const passed = percentage >= 70

  // ── helpers ──
  function roundRect(x: number, y: number, w: number, h: number, r: number, style: 'F' | 'S' | 'FD' = 'F') {
    doc.roundedRect(x, y, w, h, r, r, style)
  }

  // ── page bg ──
  doc.setFillColor(...paper)
  doc.rect(0, 0, pw, ph, 'F')

  // ── HEADER ──
  doc.setFillColor(...ink)
  doc.rect(0, 0, pw, 44, 'F')

  doc.setFont('courier', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(139, 150, 171)
  doc.text('DEVPREP AI · MASTERY QUIZ', m, 14)

  doc.setFont('courier', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(255, 255, 255)
  doc.text(title, m, 27)

  doc.setFont('courier', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(154, 165, 184)
  const breadcrumb = `main → results / ${title.replace(/\s+/g, '-').toLowerCase().slice(0, 30)}.quiz · ${dateStr}`
  doc.text(breadcrumb, m, 36)

  // green dot
  doc.setFillColor(...pass)
  doc.circle(m + 72, 10, 3, 'F')

  // ── SCORE CARD ──
  const scY = 52
  roundRect(m, scY, cw, 48, 5, 'F')
  doc.setDrawColor(...line)
  roundRect(m, scY, cw, 48, 5, 'S')

  doc.setFont('courier', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(...pass)
  doc.text(`+${score} passed`, m + 10, scY + 17)
  doc.setTextColor(...line)
  doc.text('/', m + 10 + doc.getTextWidth(`+${score} passed`), scY + 17)
  doc.setTextColor(...fail)
  doc.text(`−${totalQuestions - score} failed`, m + 10 + doc.getTextWidth(`+${score} passed/`), scY + 17)

  // status chip
  const chipLabel = passed ? 'Passed' : 'Failed'
  const chipW = doc.getTextWidth(chipLabel) + 18
  const chipX = pw - m - chipW
  doc.setFillColor(passed ? passBg[0] : failBg[0], passed ? passBg[1] : failBg[1], passed ? passBg[2] : failBg[2])
  doc.setDrawColor(passed ? pass[0] : fail[0], passed ? pass[1] : fail[1], passed ? pass[2] : fail[2])
  roundRect(chipX, scY + 8, chipW, 16, 5, 'FD')
  doc.setFont('courier', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(passed ? pass[0] : fail[0], passed ? pass[1] : fail[1], passed ? pass[2] : fail[2])
  doc.text(`${chipLabel} · ${percentage}%`, chipX + 9, scY + 19)

  // progress bar
  const barY = scY + 30
  const barW = cw - 20
  doc.setFillColor(...line)
  roundRect(m + 10, barY, barW, 7, 4, 'F')
  if (percentage > 0) {
    doc.setFillColor(...pass)
    doc.rect(m + 10, barY, barW * (percentage / 100), 7, 'F')
  }
  if (percentage < 100) {
    doc.setFillColor(...fail)
    doc.rect(m + 10 + barW * (percentage / 100), barY, barW * ((100 - percentage) / 100), 7, 'F')
  }

  // meta
  doc.setFont('courier', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...muted)
  const metaParts = []
  if (topicName) metaParts.push(`topic: ${topicName}`)
  metaParts.push(`questions: ${totalQuestions}`, `threshold: 70%`, `result: ${passed ? 'passed' : 'below threshold'}`)
  const metaText = metaParts.join('   ·   ')
  doc.text(metaText, m + 10, scY + 44)

  // ── QUESTIONS ──
  let yPos = scY + 62
  const bottomLimit = ph - 18

  questions.forEach((q, idx) => {
    const selectedAns = selectedMap.get(q.id)
    const fileName = toFileName(q.text, idx)

    // Page break estimate (card header + question + 4 options + explanation)
    if (yPos > bottomLimit - 50) {
      doc.addPage()
      doc.setFillColor(...paper)
      doc.rect(0, 0, pw, ph, 'F')
      yPos = 16
    }

    // ── diff card ──
    const cardX = m
    const cardW = cw
    let cardY = yPos

    // file header
    doc.setFillColor(...fileHdr)
    roundRect(cardX, cardY, cardW, 10, 4, 'F')
    doc.setDrawColor(...line)
    roundRect(cardX, cardY, cardW, 10, 4, 'S')
    doc.setFont('courier', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(139, 150, 171)
    doc.text(`Q${String(idx + 1).padStart(2, '0')}`, cardX + 10, cardY + 7)
    doc.setTextColor(...ink)
    doc.text(fileName, cardX + 22, cardY + 7)
    cardY += 10

    // remove bottom border of header + main border
    doc.setDrawColor(...line)
    doc.line(cardX, cardY, cardX + cardW, cardY)

    // question text
    const cleanedQ = q.text.replace(/\\n/g, '\n').replace(/<[^>]*>/g, '').replace(/#{1,6}\s/g, '').replace(/\*{1,2}/g, '').replace(/`{1,3}/g, '')
    doc.setFont('courier', 'bold')
    doc.setFontSize(9.5)
    doc.setTextColor(...ink)
    const qLines = doc.splitTextToSize(cleanedQ, cardW - 20)
    doc.text(qLines, cardX + 10, cardY + 7)
    const qH = qLines.length * 3.8 + 6
    cardY += qH + 4

    // options
    q.options.forEach((opt, i) => {
      const isSelected = i === selectedAns
      const isOptCorrect = i === q.correctAnswer
      const optPrefix = isSelected && isOptCorrect ? '+'
        : isSelected && !isOptCorrect ? '−'
        : '·'
      const isHighlighted = isSelected || (isOptCorrect && selectedAns !== undefined && !isSelected)
      const bg: [number, number, number] | null = isSelected && isOptCorrect ? passBg
        : isSelected && !isOptCorrect ? failBg
        : isOptCorrect && selectedAns !== undefined ? passBg
        : null
      const borderColor: [number, number, number] = isSelected && isOptCorrect ? pass
        : isSelected && !isOptCorrect ? fail
        : isOptCorrect && selectedAns !== undefined ? pass
        : [255, 255, 255] as [number, number, number]

      const optCleaned = opt.replace(/\\n/g, '\n').replace(/<[^>]*>/g, '')
      doc.setFont('courier', isHighlighted ? 'bold' : 'normal')
      doc.setFontSize(8.5)
      const label = `${optPrefix}  ${String.fromCharCode(65 + i)}  ${optCleaned}`
      const oLines = doc.splitTextToSize(label, cardW - 24)
      const oH = Math.max(oLines.length * 3.5 + 4, 8)

      if (bg) {
        doc.setFillColor(...bg)
        doc.rect(cardX + 1, cardY, cardW - 2, oH + 2, 'F')
      }
      doc.setDrawColor(...borderColor)
      doc.setLineWidth(1.5)
      doc.line(cardX + 1, cardY, cardX + 1, cardY + oH + 2)
      doc.setLineWidth(0.1)

      if (isHighlighted) {
        if (isSelected && !isOptCorrect) { doc.setTextColor(...fail) }
        else { doc.setTextColor(...pass) }
      } else {
        doc.setTextColor(59, 68, 83)
      }
      doc.text(oLines, cardX + 14, cardY + 5)
      cardY += oH + 2
    })

    cardY += 2

    // explanation
    if (q.explanation) {
      const expText = q.explanation.replace(/\\n/g, '\n').replace(/<[^>]*>/g, '').replace(/\*{1,2}/g, '').replace(/`{1,3}/g, '')
      const expH = Math.max(doc.splitTextToSize(expText, cardW - 28).length * 3.2 + 16, 20)

      if (cardY + expH > bottomLimit) {
        doc.addPage()
        doc.setFillColor(...paper)
        doc.rect(0, 0, pw, ph, 'F')
        cardY = 16
      }

      doc.setFillColor(250, 250, 247)
      doc.setDrawColor(...line)
      roundRect(cardX + 6, cardY, cardW - 12, expH, 4, 'FD')

      // avatar + header
      doc.setFillColor(...ink)
      roundRect(cardX + 14, cardY + 4, 14, 14, 3, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFont('courier', 'bold')
      doc.setFontSize(6.5)
      doc.text('DP', cardX + 14 + (14 - doc.getTextWidth('DP')) / 2, cardY + 13)

      doc.setFont('courier', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(...muted)
      doc.text('DevPrep AI commented', cardX + 34, cardY + 13)

      // explanation body
      doc.setFont('courier', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(59, 68, 83)
      const expLines = doc.splitTextToSize(expText, cardW - 32)
      doc.text(expLines, cardX + 14, cardY + 24)
      cardY += expH + 10
    }

    cardY += 4

    // draw card border
    doc.setDrawColor(...line)
    roundRect(cardX, yPos, cardW, cardY - yPos, 4, 'S')

    yPos = cardY + 4
  })

  // ── FOOTER ──
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setDrawColor(...line)
    doc.line(m, ph - 14, pw - m, ph - 14)
    doc.setFont('courier', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(154, 165, 184)
    doc.text(`devprep-ai / ${title.replace(/\s+/g, '-').toLowerCase().slice(0, 30)}`, m, ph - 6)
    const genW = doc.getTextWidth('generated by DevPrep AI')
    doc.text('generated by DevPrep AI', pw - m - genW, ph - 6)
  }

  const filename = `devprep-quiz-${title.replace(/\s+/g, '-').toLowerCase().slice(0, 30)}.pdf`
  doc.save(filename)
}
