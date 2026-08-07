import { topicDetailDataset } from './topic-detail-dataset'
import { topicEnglishDataset } from './topic-english-dataset'

interface TopicContentInput {
  slug: string
  title: string
  description: string
  difficulty: string
  technologyName: string
  technologySlug: string
  category: string
}

function codeLanguage(technologySlug: string): string {
  if (technologySlug === 'html') return 'html'
  if (technologySlug === 'css') return 'css'
  if (technologySlug === 'typescript' || technologySlug === 'react' || technologySlug === 'nextjs') return 'tsx'
  if (technologySlug === 'postgresql' || technologySlug === 'mysql') return 'sql'
  if (technologySlug === 'mongodb') return 'javascript'
  if (technologySlug === 'docker') return 'dockerfile'
  if (technologySlug === 'nginx') return 'nginx'
  return 'typescript'
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

function capitalizeFirst(text: string): string {
  // Skip leading markdown formatting markers (backticks, asterisks, etc.)
  // so the first visible letter gets capitalized.
  const match = text.match(/^[^a-zA-Z]*([a-zA-Z])/)
  if (!match) return text
  const prefixLen = match[0].length - 1
  return text.slice(0, prefixLen) + match[1].toUpperCase() + text.slice(match[0].length)
}

function formatBulletList(items: string[]): string {
  return items
    .map((item) => {
      const trimmed = item.trim()
      return `  - ${capitalizeFirst(trimmed)}`
    })
    .join('\n')
}

function highlightInlineCode(text: string): string {
  const keywords = [
    'const',
    'let',
    'var',
    'function',
    'return',
    'if',
    'else',
    'for',
    'while',
    'try',
    'catch',
    'throw',
    'async',
    'await',
    'import',
    'export',
    'from',
    'interface',
    'type',
    'extends',
    'implements',
    'class',
    'new',
    'this',
    'super',
    'public',
    'private',
    'protected',
    'readonly',
    'static',
    'console.log',
    'fetch',
    'JSON.parse',
    'JSON.stringify',
    'Promise',
    'map',
    'filter',
    'reduce',
    'find',
    'includes',
    'push',
    'pop',
    'shift',
    'unshift',
    'slice',
    'splice',
    'useState',
    'useEffect',
    'useMemo',
    'useCallback',
    'useRef',
    'useContext',
    'useReducer',
    'createContext',
    'React',
    'JSX',
    'props',
    'state',
    'component',
    'hook',
  ]

  let result = text
  for (const kw of keywords) {
    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g')
    result = result.replace(regex, `\`${kw}\``)
  }
  return result
}

function toBullets(text: string, maxBullets = 5): string {
  const sentences = splitSentences(text)
  const bullets = sentences.slice(0, maxBullets).map((s) => capitalizeFirst(s))
  return formatBulletList(bullets)
}

function makeExplanation(text: string): string {
  const sentences = splitSentences(text)
  const intro = sentences.slice(0, 2).map((s) => capitalizeFirst(s)).join(' ')
  const bullets = toBullets(sentences.slice(2).join(' '), 4)
  return `${intro}\n\n${bullets}`
}

function makeCodeExplanation(text: string): string {
  return toBullets(text, 5)
}

function interviewQuestions(input: TopicContentInput): string {
  const questions = [
    `What problem does ${input.title} solve in a real ${input.technologyName} project?`,
    `Can you explain ${input.title} in simple words to a beginner?`,
    `What are the most important rules to remember when using ${input.title}?`,
    `What common mistake do developers make with ${input.title}?`,
    `How would you test a feature that uses ${input.title}?`,
  ]
  return formatBulletList(questions)
}

function englishExplanation(input: TopicContentInput): string {
  const base = `${input.title} is a core ${input.technologyName} concept. ${input.description}. It helps you build real applications and solve practical problems. Learn when to use it and what pitfalls to avoid.`
  return makeExplanation(base)
}

function englishCodeExplanation(input: TopicContentInput): string {
  const base = `The code demonstrates ${input.title.toLowerCase()} in practice. Identify the main structure first. Note which values are inputs and which are outputs. Follow the logic flow step by step. Explain the goal, the flow, and why this approach works. Try changing one input to see how behavior changes.`
  return makeCodeExplanation(base)
}

function romanUrduExplanation(input: TopicContentInput): string {
  const base = `${input.title} ${input.technologyName} ka ek zaroori concept hai. ${input.description}. Yeh aapko real apps banane aur problems solve karne mein madad karta hai. Seekhein ke kab use karna hai aur kya galtiyan avoid karni hain.`
  return makeExplanation(base)
}

function romanUrduCodeExplanation(input: TopicContentInput): string {
  const base = `Yeh code ${input.title.toLowerCase()} ka practical example dikhata hai. Pehle main structure samjhein. Phir inputs aur outputs identify karein. Logic flow step by step follow karein. Goal, flow, aur approach explain karein. Ek input change karke dekhein behavior kaise badalta hai.`
  return makeCodeExplanation(base)
}

function buildContent(
  title: string,
  explanation: string,
  code: string,
  codeExplanation: string,
  questions: string,
  language: string
): string {
  return `# ${title}

## Easy Explanation

${explanation}

## Code Example

\`\`\`${language}
${code}
\`\`\`

## Code Explanation

${codeExplanation}

## Interview Questions

${questions}`
}

function formatDetailContent(
  detail: { explanation?: string; code: string; codeExplanation?: string },
  input: TopicContentInput,
  language: string
): string {
  const romanDetail = topicDetailDataset[input.slug]
  const explanation = romanDetail?.explanation ? makeExplanation(romanDetail.explanation) : romanUrduExplanation(input)
  const codeExplanation = romanDetail?.codeExplanation ? makeCodeExplanation(romanDetail.codeExplanation) : romanUrduCodeExplanation(input)
  const questions = interviewQuestions(input)

  return buildContent(input.title, explanation, detail.code, codeExplanation, questions, language)
}

function englishContent(
  detail: { explanation?: string; code: string; codeExplanation?: string },
  input: TopicContentInput,
  language: string
): string {
  const englishDetail = topicEnglishDataset[input.slug]
  const explanation = englishDetail?.explanation ? makeExplanation(englishDetail.explanation) : englishExplanation(input)
  const codeExplanation = englishDetail?.codeExplanation ? makeCodeExplanation(englishDetail.codeExplanation) : englishCodeExplanation(input)
  const questions = interviewQuestions(input)

  return buildContent(input.title, explanation, detail.code, codeExplanation, questions, language)
}

function fallbackContent(input: TopicContentInput, language: string): string {
  const code = codeExample(input)
  const explanation = englishExplanation(input)
  const codeExplanation = englishCodeExplanation(input)
  const questions = interviewQuestions(input)

  return buildContent(input.title, explanation, code, codeExplanation, questions, language)
}

function codeExample(input: TopicContentInput): string {
  const lower = input.title.toLowerCase()

  if (input.technologySlug === 'html' && lower.includes('form')) {
    return `<form action="/signup" method="post">
  <fieldset>
    <legend>Create account</legend>

    <label for="email">Email address</label>
    <input id="email" name="email" type="email" autocomplete="email" required />

    <label for="password">Password</label>
    <input id="password" name="password" type="password" minlength="8" required />

    <button type="submit">Create account</button>
  </fieldset>
</form>`
  }

  if (input.technologySlug === 'html') {
    return `<main>
  <article>
    <h1>${input.title}</h1>
    <p>${input.description}</p>
  </article>
</main>`
  }

  if (input.technologySlug === 'css') {
    return `.topic-card {
  display: grid;
  gap: 1rem;
  padding: clamp(1rem, 2vw, 2rem);
  border: 1px solid color-mix(in srgb, currentColor 18%, transparent);
}

@media (min-width: 768px) {
  .topic-card {
    grid-template-columns: minmax(0, 1fr) auto;
  }
}`
  }

  if (input.technologySlug === 'javascript' && lower.includes('async')) {
    return `async function loadTopic(slug) {
  const response = await fetch(\`/api/topics/\${slug}\`);

  if (!response.ok) {
    throw new Error(\`Topic request failed: \${response.status}\`);
  }

  return response.json();
}`
  }

  if (input.technologySlug === 'typescript') {
    return `type TopicDifficulty = 'beginner' | 'intermediate' | 'advanced';

interface Topic {
  slug: string;
  title: string;
  difficulty: TopicDifficulty;
}

function canStart(topic: Topic, completedSlugs: Set<string>) {
  return topic.difficulty === 'beginner' || completedSlugs.size > 0;
}`
  }

  if (input.technologySlug === 'react') {
    return `import { useMemo, useState } from 'react';

export function TopicChecklist({ items }: { items: string[] }) {
  const [done, setDone] = useState<string[]>([]);
  const progress = useMemo(() => done.length / items.length, [done.length, items.length]);

  return <p>{Math.round(progress * 100)}% complete</p>;
}`
  }

  if (input.technologySlug === 'nodejs' || input.technologySlug === 'expressjs') {
    return `import express from 'express';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: '${input.technologySlug}' });
});`
  }

  if (input.technologySlug === 'rest-apis') {
    return `GET /api/topics/html-forms-input
Accept: application/json

HTTP/1.1 200 OK
Content-Type: application/json

{
  "slug": "html-forms-input",
  "title": "HTML Forms & Input"
}`
  }

  if (input.technologySlug === 'postgresql') {
    return `CREATE TABLE topics (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);`
  }

  if (input.technologySlug === 'docker') {
    return `FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
CMD ["node", "dist/server.js"]`
  }

  return `function explain${input.technologyName.replace(/[^a-zA-Z0-9]/g, '')}Topic(topic: string) {
  return {
    topic,
    goal: 'Understand the concept, apply it in code, and explain the trade-offs.',
    nextStep: 'Build a small example and test the edge cases.',
  };
}`
}

export function generateTopicContent(input: TopicContentInput): string {
  const detail = topicDetailDataset[input.slug]
  const language = codeLanguage(input.technologySlug)

  if (detail) {
    const romanUrduContent = formatDetailContent(detail, input, language)
    const englishContentText = englishContent(detail, input, language)

    return `<!--LANG:roman-->
${romanUrduContent}
<!--LANG:english-->
${englishContentText}`
  }

  return fallbackContent(input, language)
}