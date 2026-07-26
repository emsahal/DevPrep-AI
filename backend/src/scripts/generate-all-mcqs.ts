import prisma from '../utils/prisma'
import { nvidiaAI } from '../ai/nvidia.service'
import logger from '../utils/logger'

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function parseAIQuestions(content: string, questionCount: number) {
  const cleaned = content
    .replace(/^```(?:json)?\n?/i, '')
    .replace(/\n?```$/i, '')
    .trim()

  const parsed = JSON.parse(cleaned)
  if (!Array.isArray(parsed)) throw new Error('Not an array')

  return parsed.slice(0, questionCount).map((q, index) => {
    if (
      typeof q.text !== 'string' ||
      !Array.isArray(q.options) ||
      q.options.length !== 4 ||
      typeof q.correctAnswer !== 'number'
    ) {
      throw new Error(`Invalid question at index ${index}`)
    }

    return {
      text: q.text,
      options: q.options.map(String),
      correctAnswer: Math.min(Math.max(q.correctAnswer, 0), 3),
      explanation: String(q.explanation || 'Review the topic explanation for the reasoning.'),
      difficulty: typeof q.difficulty === 'string' ? q.difficulty : undefined,
    }
  })
}

async function main() {
  console.log('🤖 Starting Bulk MCQ Generation for all topics...')
  await prisma.$connect()

  const quizzes = await prisma.quiz.findMany({
    include: {
      questions: { orderBy: { order: 'asc' } },
      topic: { select: { id: true, title: true } },
    },
  })

  console.log(`Loaded ${quizzes.length} total quizzes from database.`)

  let processedCount = 0

  for (const quiz of quizzes) {
    const isPlaceholder =
      quiz.questions.length > 0 &&
      (quiz.questions[0].text.includes('mainly about?') || quiz.questions[0].text.includes('In simple words'))

    if (!isPlaceholder) {
      console.log(`⏭️ Skipping "${quiz.title}" (already contains real questions).`)
      continue
    }

    if (!quiz.topic) {
      console.log(`⚠️ Skipping "${quiz.title}" (no topic relation found).`)
      continue
    }

    console.log(`\n⚙️ Generating 15 real interview MCQs for: "${quiz.topic.title}"...`)

    try {
      const difficultyInstruction =
        quiz.difficulty === 'mixed'
          ? 'Mix easy, intermediate, and hard questions.'
          : `All questions should be ${quiz.difficulty} level.`

      const prompt = `You are an expert technical interviewer and software staff engineer.
Generate exactly 15 high-quality multiple-choice questions (MCQs) for the topic "${quiz.topic.title}".
These questions must be realistic, challenging, and suitable for technical interview preparation at top tech companies.

CRITICAL INSTRUCTIONS:
1. NO PLACEHOLDERS: Do not use template questions. Every question must be distinct and explore specific technical mechanics of "${quiz.topic.title}".
2. REAL-WORLD CODE: Include code snippets or mock output scenarios in at least 5 questions.
3. MULTI-LINE CODE BLOCKS: Any code snippet, code block, or execution code must be enclosed in standard triple-backtick markdown blocks with the correct language identifier (e.g. \`\`\`javascript or \`\`\`python).
4. CODE INDENTATION: Code within blocks must use proper indentation (4 spaces per block level) and be formatted across multiple lines for readability. Do NOT write code in a single line.
5. TOPIC DEPTH: Cover deep, practical concepts (syntax, execution steps, performance characteristics, memory, common edge cases, errors).
6. QUALITY OPTIONS: Ensure options are realistic distractors.
7. EXPLANATIONS: Provide clear, technical, step-by-step explanations of why the correct option is right.

${difficultyInstruction}

IMPORTANT: Return ONLY a valid JSON array. Do not wrap it in markdown code blocks. No text before or after the JSON.
Format:
[
  {
    "text": "Detailed, specific question testing a concept or code snippet.",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": 0,
    "explanation": "Thorough technical explanation...",
    "difficulty": "intermediate"
  }
]`

      const response = await nvidiaAI.generate(
        [{ role: 'user', content: prompt }],
        { temperature: 0.75, maxTokens: 8192 }
      )

      const parsedQuestions = parseAIQuestions(response.content, 15)

      // Transaction to replace database questions
      await prisma.$transaction(async (tx) => {
        await tx.question.deleteMany({ where: { quizId: quiz.id } })
        await tx.question.createMany({
          data: parsedQuestions.map((q, idx) => ({
            quizId: quiz.id,
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            order: idx + 1,
          })),
        })
      })

      processedCount++
      console.log(`✅ Saved 15 real MCQs for: "${quiz.topic.title}"!`)

      // Grace period to respect API limits
      console.log('Sleeping for 2 seconds to avoid rate limits...')
      await sleep(2000)
    } catch (error: any) {
      console.error(`❌ Failed to generate questions for "${quiz.topic.title}":`, error.message)
      await sleep(5000) // Sleep longer on error
    }
  }

  console.log(`\n🎉 Process complete! Upgraded ${processedCount} quizzes to real MCQs.`)
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error('Fatal error in generator script:', e)
  await prisma.$disconnect()
  process.exit(1)
})
