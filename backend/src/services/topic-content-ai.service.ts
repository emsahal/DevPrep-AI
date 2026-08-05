import { nvidiaAI } from '@/ai/nvidia.service'
import logger from '@/utils/logger'

export interface TopicGenerationInput {
  id: string
  slug: string
  title: string
  description: string
  difficulty: string
  category: string
  technologyName?: string
}

const DIFFICULTY_GUIDE: Record<string, string> = {
  beginner:
    'The learner is a beginner. Explain with a simple real-world analogy, define every term you use, and avoid jargon.',
  intermediate:
    'The learner has basic knowledge. Explain the mechanism, common patterns, and trade-offs, and use technical terms freely.',
  advanced:
    'The learner is advanced. Go deep into internals, edge cases, performance implications, and production concerns. Assume strong fundamentals.',
}

const LANGUAGE_LABEL: Record<'roman' | 'english', string> = {
  roman:
    'Roman Urdu — everyday Urdu written in the Latin/Roman alphabet, mixing Urdu and English words naturally (e.g. "Aap is concept ko aise samajh sakte hain"). Use Urdu words wherever a learner would naturally say them, but keep code/technical terms in English.',
  english: 'English — clean, professional, interview-grade English.',
}

const LANGUAGE_HEADING: Record<'roman' | 'english', string> = {
  roman: 'Roman Urdu',
  english: 'English',
}

function buildSystemPrompt(input: TopicGenerationInput, language: 'roman' | 'english'): string {
  const difficultyGuide = DIFFICULTY_GUIDE[input.difficulty] || DIFFICULTY_GUIDE.beginner
  return `You are an expert senior software engineer and technical interviewer who writes clear, interview-grade study material.

GUIDELINES:
- Difficulty level: ${difficultyGuide}
- Write ONLY in ${LANGUAGE_HEADING[language]}. ${LANGUAGE_LABEL[language]}
- **Easy Explanation**: write at least 2–3 short, readable paragraphs that introduce the concept with a real-world analogy. After the paragraphs, add a numbered list ("1. ", "2. ", "3. ") of 3–5 key points.
- **Code Explanation**: walk through the code using a numbered list ("1. ", "2. ", "3. ").
- Use **bold** for key terms on first mention. Never use tables or "***".
- Structure the output EXACTLY with these sections, using these exact headings:
  ## Easy Explanation
  ## Code Example
  ## Code Explanation
  ## Interview Questions
- The Code Example must be a single fenced code block with a language tag (e.g. \`\`\`javascript), containing a short self-contained example related to the topic.
- The Interview Questions section must list EXACTLY 5 interview questions, each on its own line starting with "- ". Questions must be relevant to the topic and to the learner's difficulty level.
- Keep every point concise (max ~25 words). Avoid filler.
- Output ONLY the sections above. No preamble, no title heading, no footer.`
}

function buildUserPrompt(input: TopicGenerationInput, language: 'roman' | 'english'): string {
  return `TOPIC: ${input.title}
CATEGORY: ${input.category}
TECHNOLOGY: ${input.technologyName || ''}
DIFFICULTY: ${input.difficulty}
DESCRIPTION: ${input.description}

Write the full study content in ${LANGUAGE_HEADING[language]} following the exact structure from the system prompt, with exactly 5 interview questions.`
}

function countInterviewQuestions(content: string): number {
  let count = 0
  let inSection = false
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (/^#{1,6}\s+interview questions$/i.test(trimmed)) {
      inSection = true
      continue
    }
    if (inSection && /^#{1,6}\s/.test(trimmed)) break
    if (inSection && /^-\s+/.test(trimmed)) count++
  }
  return count
}

export class TopicContentAIService {
  async generateLanguage(input: TopicGenerationInput, language: 'roman' | 'english'): Promise<string> {
    const system = buildSystemPrompt(input, language)
    const user = buildUserPrompt(input, language)
    const res = await nvidiaAI.generate(
      [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      { temperature: 0.5, maxTokens: 8192 }
    )
    return res.content.trim()
  }

  async generateTopicContent(input: TopicGenerationInput): Promise<{ roman: string; english: string }> {
    const [roman, english] = await Promise.all([
      this.generateLanguage(input, 'roman'),
      this.generateLanguage(input, 'english'),
    ])
    return { roman, english }
  }

  buildBilingualContent(input: TopicGenerationInput, roman: string, english: string): string {
    return `# ${input.title}

<!--LANG:roman-->

# ${input.title}

${roman}

<!--LANG:english-->

# ${input.title}

${english}`
  }

  validate(roman: string, english: string): string[] {
    const errors: string[] = []
    for (const [lang, content] of [
      ['roman', roman],
      ['english', english],
    ] as const) {
      if (!/^#{1,6}\s+easy explanation$/im.test(content)) errors.push(`${lang}: missing "Easy Explanation" section`)
      if (!/^#{1,6}\s+code example$/im.test(content)) errors.push(`${lang}: missing "Code Example" section`)
      if (!/^#{1,6}\s+code explanation$/im.test(content)) errors.push(`${lang}: missing "Code Explanation" section`)
      if (!/^#{1,6}\s+interview questions$/im.test(content)) errors.push(`${lang}: missing "Interview Questions" section`)
      if (countInterviewQuestions(content) < 5) errors.push(`${lang}: fewer than 5 interview questions found`)
    }
    return errors
  }

  async generateAndValidate(input: TopicGenerationInput): Promise<{ roman: string; english: string; errors: string[] }> {
    const { roman, english } = await this.generateTopicContent(input)
    const errors = this.validate(roman, english)
    return { roman, english, errors }
  }
}

export const topicContentAI = new TopicContentAIService()
