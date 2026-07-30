import { nvidiaAI } from '@/ai/nvidia.service'
import prisma from '@/utils/prisma'
import logger from '@/utils/logger'
import {
  RESUME_ANALYSIS_SYSTEM_PROMPT,
  JOB_ANALYSIS_SYSTEM_PROMPT,
  GAP_ANALYSIS_SYSTEM_PROMPT,
  RESUME_OPTIMIZATION_SYSTEM_PROMPT,
  COVER_LETTER_SYSTEM_PROMPT,
  getResumeAnalysisPrompt,
  getJobAnalysisPrompt,
  getGapAnalysisPrompt,
  getResumeOptimizationPrompt,
  getCoverLetterPrompt,
} from '@/ai/resume-optimizer.prompts'

interface AIResponse {
  content: string
  usage?: { promptTokens: number; completionTokens: number; totalTokens: number }
}

const FREE_CREDITS = 3
const CREDIT_COST_PER_OPTIMIZATION = 1

async function callAI(messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>, maxTokens = 4096): Promise<string> {
  const response: AIResponse = await nvidiaAI.generate(messages, { maxTokens, temperature: 0.3 })
  let content = response.content.trim()
  if (content.startsWith('```json')) content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '')
  if (content.startsWith('```')) content = content.replace(/^```\w*\s*/, '').replace(/\s*```$/, '')
  return content
}

async function checkCredits(userId: string): Promise<{ available: number; canProceed: boolean }> {
  const usageCount = await prisma.creditTransaction.count({
    where: { userId, type: 'usage' },
  })
  const purchaseCount = await prisma.creditTransaction.aggregate({
    where: { userId, type: 'purchase' },
    _sum: { amount: true },
  })
  const bonusCount = await prisma.creditTransaction.aggregate({
    where: { userId, type: 'bonus' },
    _sum: { amount: true },
  })
  const totalPurchased = purchaseCount._sum.amount || 0
  const totalBonus = bonusCount._sum.amount || 0
  const totalAvailable = FREE_CREDITS + totalPurchased + totalBonus - usageCount
  return { available: totalAvailable, canProceed: totalAvailable >= CREDIT_COST_PER_OPTIMIZATION }
}

async function deductCredit(userId: string, reference: string): Promise<void> {
  await prisma.creditTransaction.create({
    data: {
      userId,
      amount: -CREDIT_COST_PER_OPTIMIZATION,
      type: 'usage',
      reference,
    },
  })
}

export class ResumeOptimizerService {
  async getCredits(userId: string): Promise<{ available: number; totalUsed: number; freeCredits: number; purchasedCredits: number }> {
    const usageCount = await prisma.creditTransaction.count({ where: { userId, type: 'usage' } })
    const purchaseAgg = await prisma.creditTransaction.aggregate({ where: { userId, type: 'purchase' }, _sum: { amount: true } })
    const bonusAgg = await prisma.creditTransaction.aggregate({ where: { userId, type: 'bonus' }, _sum: { amount: true } })
    const totalPurchased = purchaseAgg._sum.amount || 0
    const totalBonus = bonusAgg._sum.amount || 0
    const used = usageCount
    const available = FREE_CREDITS + totalPurchased + totalBonus - used
    return { available, totalUsed: used, freeCredits: Math.max(0, FREE_CREDITS - used), purchasedCredits: totalPurchased + totalBonus }
  }

  async purchaseCredits(userId: string, amount: number): Promise<void> {
    await prisma.creditTransaction.create({
      data: { userId, amount, type: 'purchase', reference: 'pending_payment' },
    })
  }

  async uploadAndParseResume(userId: string, filePath: string, originalName: string): Promise<{ resumeId: string; parsedData: any; originalText: string }> {
    const fs = await import('fs/promises')
    const path = await import('path')
    const ext = path.extname(originalName).toLowerCase()
    let originalText = ''

    if (ext === '.pdf') {
      const { PDFParse } = await import('pdf-parse')
      const pdfBuffer = await fs.readFile(filePath)
      const pdfParser = new (PDFParse as any)({ data: new Uint8Array(pdfBuffer) })
      const pdfData = await pdfParser.getText() as any
      originalText = pdfData.text
    } else if (ext === '.docx') {
      const mammoth = await import('mammoth')
      const result = await mammoth.extractRawText({ path: filePath })
      originalText = result.value
    } else {
      originalText = await fs.readFile(filePath, 'utf-8')
    }

    const jsonContent = await callAI([
      { role: 'system', content: RESUME_ANALYSIS_SYSTEM_PROMPT },
      { role: 'user', content: getResumeAnalysisPrompt(originalText) },
    ])

    let parsedData: any
    try {
      parsedData = JSON.parse(jsonContent)
    } catch {
      parsedData = { rawText: originalText, parseError: 'AI returned invalid JSON' }
    }

    const resume = await prisma.resume.create({
      data: {
        userId,
        title: originalName,
        originalText,
        parsedData,
      },
    })

    try { await fs.unlink(filePath) } catch {}

    return { resumeId: resume.id, parsedData, originalText }
  }

  async analyzeJobDescription(resumeId: string, jobDescription: string): Promise<any> {
    const resume = await prisma.resume.findUnique({ where: { id: resumeId } })
    if (!resume) throw new Error('Resume not found')

    const jobJson = await callAI([
      { role: 'system', content: JOB_ANALYSIS_SYSTEM_PROMPT },
      { role: 'user', content: getJobAnalysisPrompt(jobDescription) },
    ])

    let jobData: any
    try {
      jobData = JSON.parse(jobJson)
    } catch {
      jobData = { rawText: jobDescription, parseError: 'AI returned invalid JSON' }
    }

    const resumeJson = JSON.stringify(resume.parsedData || resume.originalText)

    const gapJson = await callAI([
      { role: 'system', content: GAP_ANALYSIS_SYSTEM_PROMPT },
      { role: 'user', content: getGapAnalysisPrompt(resumeJson, jobJson) },
    ])

    let gapData: any
    try {
      gapData = JSON.parse(gapJson)
    } catch {
      gapData = { resumeMatchPercentage: 0, atsScore: 0, missingSkills: [], missingKeywords: [], improvementSuggestions: [] }
    }

    await prisma.resume.update({
      where: { id: resumeId },
      data: {
        atsScore: gapData.atsScore ?? 0,
        matchScore: gapData.resumeMatchPercentage ?? 0,
        missingSkills: gapData.missingSkills ?? [],
        missingKeywords: gapData.missingKeywords ?? [],
        suggestions: gapData,
      },
    })

    return {
      jobAnalysis: jobData,
      gapAnalysis: gapData,
    }
  }

  async optimizeResume(resumeId: string): Promise<any> {
    const resume = await prisma.resume.findUnique({ where: { id: resumeId } })
    if (!resume) throw new Error('Resume not found')

    const credits = await checkCredits(resume.userId)
    if (!credits.canProceed) {
      throw new Error('Insufficient credits. Please purchase more credits.')
    }

    const resumeJson = JSON.stringify(resume.parsedData || resume.originalText)
    const suggestions = resume.suggestions as any || {}
    const gapInfo = suggestions as any || {}

    const optimizationJson = await callAI([
      { role: 'system', content: RESUME_OPTIMIZATION_SYSTEM_PROMPT },
      { role: 'user', content: getResumeOptimizationPrompt(resumeJson, JSON.stringify(gapInfo), JSON.stringify(gapInfo)) },
    ], 6144)

    let optimizedData: any
    try {
      optimizedData = JSON.parse(optimizationJson)
    } catch {
      optimizedData = { parseError: 'AI returned invalid JSON' }
    }

    const optimizedContent = optimizedData.summary + '\n\n' +
      (optimizedData.experience || []).map((exp: any) =>
        `${exp.role} at ${exp.company} (${exp.dateRange})\n${(exp.bullets || []).map((b: string) => `• ${b}`).join('\n')}`
      ).join('\n\n')

    await prisma.resume.update({
      where: { id: resumeId },
      data: {
        optimizedText: optimizedContent,
        optimizedData,
      },
    })

    await deductCredit(resume.userId, resumeId)

    return { optimizedData, optimizedContent }
  }

  async generateCoverLetter(resumeId: string, companyName?: string, jobTitle?: string): Promise<any> {
    const resume = await prisma.resume.findUnique({ where: { id: resumeId } })
    if (!resume) throw new Error('Resume not found')

    const resumeJson = JSON.stringify(resume.optimizedData || resume.parsedData || resume.originalText)
    const suggestions = resume.suggestions as any || {}

    const coverLetterJson = await callAI([
      { role: 'system', content: COVER_LETTER_SYSTEM_PROMPT },
      { role: 'user', content: getCoverLetterPrompt(resumeJson, JSON.stringify(suggestions), companyName || '', jobTitle || '') },
    ], 4096)

    let coverLetterData: any
    try {
      coverLetterData = JSON.parse(coverLetterJson)
    } catch {
      coverLetterData = { fullLetter: coverLetterJson }
    }

    const coverLetter = await prisma.coverLetter.create({
      data: {
        userId: resume.userId,
        resumeId,
        content: coverLetterData.fullLetter || coverLetterJson,
        company: companyName || null,
        jobTitle: jobTitle || null,
      },
    })

    return { ...coverLetterData, id: coverLetter.id }
  }

  async getResume(resumeId: string): Promise<any> {
    return prisma.resume.findUnique({ where: { id: resumeId }, include: { coverLetters: true } })
  }

  async getUserResumes(userId: string): Promise<any[]> {
    return prisma.resume.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, include: { _count: { select: { coverLetters: true } } } })
  }

  async deleteResume(resumeId: string, userId: string): Promise<void> {
    await prisma.coverLetter.deleteMany({ where: { resumeId } })
    await prisma.resume.deleteMany({ where: { id: resumeId, userId } })
  }

  async getPricing(): Promise<{ freeCredits: number; costPerOptimization: number; plans: { credits: number; price: number }[] }> {
    return {
      freeCredits: FREE_CREDITS,
      costPerOptimization: CREDIT_COST_PER_OPTIMIZATION,
      plans: [
        { credits: 5, price: 499 },
        { credits: 15, price: 999 },
        { credits: 40, price: 1999 },
        { credits: 100, price: 3999 },
      ],
    }
  }
}

export const resumeOptimizerService = new ResumeOptimizerService()
