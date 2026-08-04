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

// Known tech terms that should preserve their specific casing
const TECH_TERM_MAP: Record<string, string> = {
  'javascript': 'JavaScript',
  'typescript': 'TypeScript',
  'react.js': 'React.js',
  'react': 'React',
  'node.js': 'Node.js',
  'next.js': 'Next.js',
  'vue.js': 'Vue.js',
  'mongodb': 'MongoDB',
  'postgresql': 'PostgreSQL',
  'graphql': 'GraphQL',
  'rest': 'REST',
  'api': 'API',
  'apis': 'APIs',
  'css': 'CSS',
  'html': 'HTML',
  'aws': 'AWS',
  'gcp': 'GCP',
  'ci/cd': 'CI/CD',
  'devops': 'DevOps',
  'ui/ux': 'UI/UX',
}

const LOWERCASE_WORDS = new Set(['a', 'an', 'the', 'and', 'or', 'of', 'in', 'at', 'for', 'to', 'with', 'on', 'by'])

/**
 * Converts a string to proper Title Case, respecting tech terms and lowercase prepositions/articles.
 */
function titleCaseStr(str: string): string {
  if (!str || typeof str !== 'string') return str
  return str
    .split(' ')
    .map((word, index) => {
      if (!word) return word
      const lower = word.toLowerCase()
      // Check known tech terms first
      if (TECH_TERM_MAP[lower]) return TECH_TERM_MAP[lower]
      // Keep lowercase prepositions/articles unless it's the first word
      if (index > 0 && LOWERCASE_WORDS.has(lower)) return lower
      // Capitalize first letter, keep rest lowercase
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}

/**
 * Applies Title Case normalization to specific resume fields:
 * experience[].role, skills[].category, projects[].name
 */
function applyTitleCaseToResumeData(data: any): any {
  if (!data) return data

  if (Array.isArray(data.experience)) {
    for (const exp of data.experience) {
      if (exp.role && typeof exp.role === 'string') {
        exp.role = titleCaseStr(exp.role)
      }
    }
  }

  if (Array.isArray(data.skills)) {
    for (const sk of data.skills) {
      if (sk.category && typeof sk.category === 'string') {
        sk.category = titleCaseStr(sk.category)
      }
    }
  }

  if (Array.isArray(data.projects)) {
    for (const proj of data.projects) {
      if (proj.name && typeof proj.name === 'string') {
        proj.name = titleCaseStr(proj.name)
      }
    }
  }

  return data
}

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

  async uploadAndParseResume(userId: string, filePath: string, originalName: string): Promise<{ resumeId: string; parsedData: any; originalText: string; originalName: string }> {
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
        originalFilePath: filePath,
        parsedData,
      },
    })

    return { resumeId: resume.id, parsedData, originalText, originalName }
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

    const interviewChance = Math.max(0, Math.min(100,
      Math.round(
        (gapData.atsScore ?? 0) * 0.35 +
        (gapData.resumeMatchPercentage ?? 0) * 0.25 +
        (gapData.keywordMatchPercentage ?? 0) * 0.2 -
        (gapData.missingSkills?.length ?? 0) * 3
      )
    ))

    const companyName = jobData.companyName ?? null

    await prisma.resume.update({
      where: { id: resumeId },
      data: {
        atsScore: gapData.atsScore ?? 0,
        matchScore: gapData.resumeMatchPercentage ?? 0,
        missingSkills: gapData.missingSkills ?? [],
        missingKeywords: gapData.missingKeywords ?? [],
        suggestions: { ...gapData, _jobAnalysis: jobData },
        jobTitle: jobData.jobTitle ?? null,
        jobDescription,
        interviewChance,
      },
    })

    return {
      jobAnalysis: jobData,
      gapAnalysis: gapData,
      interviewChance,
      companyName,
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

    const originalParsed = resume.parsedData as any || {}
    const merged = {
      ...originalParsed,
      ...optimizedData,
      personalInfo: originalParsed.personalInfo || optimizedData.personalInfo || {},
    }

    applyTitleCaseToResumeData(merged)

    const sections: string[] = []
    if (merged.summary) sections.push(merged.summary)
    if (merged.experience?.length) {
      sections.push(...merged.experience.map((exp: any) =>
        `${exp.role} at ${exp.company} (${exp.dateRange})\n${(exp.bullets || []).map((b: string) => `• ${b}`).join('\n')}`
      ))
    }
    if (merged.projects?.length) {
      sections.push(...merged.projects.map((proj: any) =>
        `Project: ${proj.name}\n${(proj.bullets || []).map((b: string) => `• ${b}`).join('\n')}`
      ))
    }
    if (merged.education?.length) {
      sections.push('EDUCATION\n' + merged.education.map((edu: any) =>
        `${edu.degree} at ${edu.institution} (${edu.dateRange})`
      ).join('\n'))
    }
    if (merged.skills?.length) {
      sections.push('SKILLS\n' + merged.skills.map((sk: any) =>
        `${sk.category}: ${(sk.items || []).join(', ')}`
      ).join('\n'))
    }
    if (merged.certifications?.length) {
      sections.push('CERTIFICATIONS\n' + merged.certifications.join('\n'))
    }
    if (merged.technicalSkills?.length) {
      sections.push('TECHNICAL SKILLS\n' + merged.technicalSkills.join(', '))
    }
    const optimizedContent = sections.join('\n\n')

    await prisma.resume.update({
      where: { id: resumeId },
      data: {
        optimizedText: optimizedContent,
        optimizedData: merged,
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

  async getOriginalFilePath(resumeId: string, userId: string): Promise<string> {
    const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId } })
    if (!resume) throw new Error('Resume not found')
    if (!resume.originalFilePath) throw new Error('Original file not available (PDF uploads cannot preserve original styling)')
    const fs = await import('fs')
    if (!fs.existsSync(resume.originalFilePath)) throw new Error('Original file no longer exists on server')
    return resume.originalFilePath
  }

  async generatePdf(resumeId: string, userId: string, fontName: string = 'Times New Roman'): Promise<Buffer> {
    const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId } })
    if (!resume) throw new Error('Resume not found')

    const data = resume.optimizedData || resume.parsedData || { originalText: resume.originalText }
    const { pdfGeneratorService } = await import('@/services/pdf-generator.service')
    return pdfGeneratorService.generateResumePdf(data, fontName)
  }

  async deleteResume(resumeId: string, userId: string): Promise<void> {
    const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId } })
    await prisma.coverLetter.deleteMany({ where: { resumeId } })
    await prisma.resume.deleteMany({ where: { id: resumeId, userId } })
    if (resume?.originalFilePath) {
      try { const fs = await import('fs/promises'); await fs.unlink(resume.originalFilePath) } catch {}
    }
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
