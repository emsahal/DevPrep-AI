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
  const { title, topicName, questions, selectedAnswers, score, totalQuestions } = data

  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - margin * 2

  const primaryR = 109; const primaryG = 59; const primaryB = 215
  const primaryLightR = 208; const primaryLightG = 188; const primaryLightB = 255
  const primaryDarkR = 52; const primaryDarkG = 0; const primaryDarkB = 128
  const successR = 16; const successG = 185; const successB = 129
  const errorR = 239; const errorG = 68; const errorB = 68
  const textDarkR = 30; const textDarkG = 30; const textDarkB = 30
  const textMutedR = 100; const textMutedG = 100; const textMutedB = 110

  const selectedMap = new Map(selectedAnswers.map((a) => [a.questionId, a.selectedAnswer]))

  let logoData: string | null = null
  try {
    const logoModule = await import('@/assets/logo.png')
    logoData = await loadImageAsBase64(logoModule.default)
  } catch {
    // logo optional
  }

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

    let fillR: number | null = null; let fillG: number | null = null; let fillB: number | null = null
    let fgR = textDarkR; let fgG = textDarkG; let fgB = textDarkB
    let marker = ''

    if (isSelected && isCorrect) {
      fillR = successR; fillG = successG; fillB = successB; fgR = successR; fgG = successG; fgB = successB; marker = '  ✓'
    } else if (isSelected && !isCorrect) {
      fillR = errorR; fillG = errorG; fillB = errorB; fgR = errorR; fgG = errorG; fgB = errorB; marker = '  ✗'
    } else if (isCorrect) {
      fillR = 230; fillG = 250; fillB = 240; fgR = successR; fgG = successG; fgB = successB; marker = '  ✓'
    }

    if (fillR !== null) {
      doc.setFillColor(fillR, fillG!, fillB!)
      doc.setDrawColor(fillR, fillG!, fillB!)
      doc.roundedRect(optX - 4, y - 4, optWidth, blockHeight, 3, 3, 'F')
    }

    doc.setTextColor(fgR, fgG, fgB)
    const label = `${prefix}. ${cleaned}${marker}`
    const textLines = doc.splitTextToSize(label, optWidth - 10)
    doc.text(textLines, optX + 2, y + 1)

    return y + blockHeight + 2
  }

  // ── Page Background ──
  doc.setFillColor(252, 252, 254)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  // ── HEADER ──
  const headerHeight = 52
  doc.setFillColor(primaryR, primaryG, primaryB)
  doc.rect(0, 0, pageWidth, headerHeight, 'F')

  doc.setFillColor(primaryDarkR, primaryDarkG, primaryDarkB)
  doc.circle(pageWidth - 30, 10, 25, 'F')
  doc.circle(pageWidth - 10, 40, 15, 'F')

  if (logoData) {
    try { doc.addImage(logoData, 'PNG', margin, 10, 24, 24) } catch {}
  }
  doc.setTextColor(primaryLightR, primaryLightG, primaryLightB)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('DevPrep AI', margin + (logoData ? 30 : 0), 20)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(200, 190, 230)
  doc.text('Master Your Technical Interview', margin + (logoData ? 30 : 0), 27)

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

  // ── TOPIC BADGE ──
  if (topicName) {
    const badgeY = headerHeight + 8
    doc.setFillColor(240, 235, 255)
    doc.roundedRect(margin, badgeY, contentWidth, 10, 4, 4, 'F')
    doc.setTextColor(primaryR, primaryG, primaryB)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.text(`Topic: ${topicName}`, margin + 6, badgeY + 7)
  }

  // ── SCORE CARD ──
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0
  const passed = percentage >= 70
  const scoreY = (topicName ? headerHeight + 24 : headerHeight + 14)

  doc.setFillColor(passed ? 240 : 255, passed ? 252 : 248, passed ? 248 : 246)
  doc.setDrawColor(passed ? successR : errorR, passed ? successG : errorG, passed ? successB : errorB)
  doc.roundedRect(margin, scoreY, contentWidth, 36, 6, 6, 'FD')

  doc.setFillColor(passed ? successR : errorR, passed ? successG : errorG, passed ? successB : errorB)
  doc.circle(margin + 24, scoreY + 18, 12, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  const pctStr = `${percentage}%`
  const pctW = doc.getTextWidth(pctStr)
  doc.text(pctStr, margin + 24 - pctW / 2, scoreY + 22)

  doc.setTextColor(textDarkR, textDarkG, textDarkB)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  const scoreText = `${score} / ${totalQuestions} correct`
  const sw = doc.getTextWidth(scoreText)
  doc.text(scoreText, pageWidth / 2 - sw / 2, scoreY + 16)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(textMutedR, textMutedG, textMutedB)
  const statusText = passed ? 'Congratulations! You passed the quiz.' : 'Keep practicing! Review the explanations below.'
  const statusW = doc.getTextWidth(statusText)
  doc.text(statusText, pageWidth / 2 - statusW / 2, scoreY + 28)

  const resultLabel = passed ? 'PASSED' : 'FAILED'
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(passed ? successR : errorR, passed ? successG : errorG, passed ? successB : errorB)
  const rw = doc.getTextWidth(resultLabel) + 16
  doc.setDrawColor(passed ? successR : errorR, passed ? successG : errorG, passed ? successB : errorB)
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(pageWidth - margin - rw, scoreY + 9, rw, 18, 9, 9, 'FD')
  doc.text(resultLabel, pageWidth - margin - rw + (rw - doc.getTextWidth(resultLabel)) / 2, scoreY + 22)

  // ── QUESTIONS ──
  let yPos = scoreY + 52
  const bottomLimit = pageHeight - 20

  questions.forEach((q, idx) => {
    const selectedAnswer = selectedMap.get(q.id)
    const cleanedText = q.text.replace(/\\n/g, '\n').replace(/<[^>]*>/g, '').replace(/#{1,6}\s/g, '').replace(/\*{1,2}/g, '').replace(/`{1,3}/g, '')

    if (yPos > bottomLimit - 40) {
      doc.addPage()
      yPos = 20
    }

    doc.setFillColor(primaryR, primaryG, primaryB)
    doc.circle(margin + 5, yPos, 5, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    const qNum = `${idx + 1}`
    doc.text(qNum, margin + 5 - doc.getTextWidth(qNum) / 2, yPos + 3)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(textDarkR, textDarkG, textDarkB)
    const qLines = doc.splitTextToSize(cleanedText, contentWidth - 24)
    doc.text(qLines, margin + 16, yPos + 1)
    yPos += qLines.length * 4.5 + 6

    q.options.forEach((opt, i) => {
      if (yPos > bottomLimit - 30) {
        doc.addPage()
        yPos = 20
      }
      yPos = drawOption(opt, i, q.correctAnswer, selectedAnswer, yPos)
    })

    if (q.explanation) {
      if (yPos > bottomLimit - 30) {
        doc.addPage()
        yPos = 20
      }

      const expText = q.explanation.replace(/\\n/g, '\n').replace(/<[^>]*>/g, '').replace(/\*{1,2}/g, '').replace(/`{1,3}/g, '')

      doc.setFontSize(8.5)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(primaryR, primaryG, primaryB)
      doc.text('EXPLANATION', margin + 6, yPos + 4)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(textMutedR, textMutedG, textMutedB)

      const expLines = doc.splitTextToSize(expText, contentWidth - 16)
      const expH = Math.max(expLines.length * 3.2 + 14, 18)

      doc.setFillColor(246, 244, 252)
      doc.setDrawColor(primaryR, primaryG, primaryB)
      doc.roundedRect(margin, yPos, contentWidth, expH, 4, 4, 'FD')

      doc.text(expLines, margin + 6, yPos + 12)
      yPos += expH + 8
    }

    if (idx < questions.length - 1) {
      if (yPos > bottomLimit - 10) {
        doc.addPage()
        yPos = 20
      }
      doc.setDrawColor(230, 230, 235)
      doc.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 8
    }
  })

  // ── FOOTER ──
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setDrawColor(230, 230, 235)
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(textMutedR, textMutedG, textMutedB)
    doc.text(`Page ${i} of ${totalPages}`, margin, pageHeight - 6)

    doc.setTextColor(160, 150, 180)
    doc.text('Generated by DevPrep AI', pageWidth - margin - doc.getTextWidth('Generated by DevPrep AI'), pageHeight - 6)
  }

  const filename = `devprep-quiz-${title.replace(/\s+/g, '-').toLowerCase().slice(0, 30)}.pdf`
  doc.save(filename)
}
