import fs from 'fs'
import path from 'path'

const PREP_DIR = path.resolve(__dirname, '../../prisma/interview-prep')

function extractEnglish(content: string): string {
  const marker = '<!--LANG:english-->'
  const idx = content.indexOf(marker)
  if (idx === -1) return content
  return content.slice(idx + marker.length).trim()
}

export class InterviewPrepService {
  async getTopics() {
    const files = fs.readdirSync(PREP_DIR).filter(f => f.endsWith('.md') && f !== 'README.md')
    return files.map(f => {
      const name = f.replace(/\.md$/, '').replace(/_/g, ' ')
      const slug = f.replace(/\.md$/, '')
      const content = fs.readFileSync(path.join(PREP_DIR, f), 'utf8')
      const englishContent = extractEnglish(content)
      const qCount = (englishContent.match(/^## \d+\./gm) || []).length
      return { slug, name, questionCount: qCount }
    }).sort((a, b) => a.name.localeCompare(b.name))
  }

  async getBySlug(slug: string) {
    const filePath = path.join(PREP_DIR, `${slug}.md`)
    if (!fs.existsSync(filePath)) return null
    const content = fs.readFileSync(filePath, 'utf8')
    const name = slug.replace(/_/g, ' ')
    const englishContent = extractEnglish(content)
    const questions = englishContent.split(/^## \d+\./m).slice(1).map((block, i) => {
      return { number: i + 1, content: block.trim() }
    })
    return { slug, name, content, questionCount: questions.length }
  }
}

export const interviewPrepService = new InterviewPrepService()
