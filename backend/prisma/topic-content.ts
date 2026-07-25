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

function codeLanguage(technologySlug: string) {
  if (technologySlug === 'html') return 'html'
  if (technologySlug === 'css') return 'css'
  if (technologySlug === 'typescript' || technologySlug === 'react' || technologySlug === 'nextjs') return 'tsx'
  if (technologySlug === 'postgresql') return 'sql'
  if (technologySlug === 'mongodb') return 'javascript'
  if (technologySlug === 'docker') return 'dockerfile'
  if (technologySlug === 'nginx') return 'nginx'
  return 'typescript'
}

function interviewQuestions(input: TopicContentInput) {
  return [
    `What problem does ${input.title} solve in a real ${input.technologyName} project?`,
    `Can you explain ${input.title} in simple words to a beginner?`,
    `What are the most important rules or steps to remember when using ${input.title}?`,
    `What common mistake do developers make with ${input.title}, and how would you avoid it?`,
    `How would you test or debug a feature that uses ${input.title}?`,
    `When would you choose this approach, and when would you use something else?`,
  ]
}

function englishExplanation(input: TopicContentInput) {
  return `${input.title} is an important ${input.technologyName} topic. In simple English, it means: ${input.description}

You should learn it because it helps you understand how real applications are built, debugged, and improved. Do not only memorize the name. Focus on what problem it solves, when you should use it, and what can go wrong if you use it incorrectly.

When reading this topic, keep three things in mind:

- **Purpose**: what this concept is used for in real projects.
- **Implementation**: how the code is written step by step.
- **Trade-offs**: mistakes, limitations, and better alternatives.

For interviews, you should be able to explain ${input.title} in your own words, write a small example, and discuss one practical edge case.`
}

function englishCodeExplanation(input: TopicContentInput) {
  return `The code example shows a small practical use of ${input.title}. Read it line by line instead of copying it blindly.

First, identify the main structure. Then notice which values are inputs, which part performs the main logic, and what output or behavior is expected. This is the same method you should use in interviews: explain the goal, explain the code flow, then explain why this approach is safe and readable.

If you want to practice further, change one input, add one edge case, and see how the code behaves. That will make the concept much easier to remember.`
}

function codeExample(input: TopicContentInput) {
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

export function generateTopicContent(input: TopicContentInput) {
  const detail = topicDetailDataset[input.slug]
  const language = codeLanguage(input.technologySlug)

  if (detail) {
    const romanUrduContent = `# ${input.title}

## Easy Explanation

${detail.explanation}

## Code Example

\`\`\`${language}
${detail.code}
\`\`\`

## Code Explanation

${detail.codeExplanation}

## Interview Questions

${interviewQuestions(input).map((question, index) => `${index + 1}. ${question}`).join('\n')}`

    const englishDetail = topicEnglishDataset[input.slug]
    const englishExplanationText = englishDetail?.explanation ?? englishExplanation(input)
    const englishCodeExplanationText = englishDetail?.codeExplanation ?? englishCodeExplanation(input)

    const englishContent = `# ${input.title}

## Easy Explanation

${englishExplanationText}

## Code Example

\`\`\`${language}
${detail.code}
\`\`\`

## Code Explanation

${englishCodeExplanationText}

## Interview Questions

${interviewQuestions(input).map((question, index) => `${index + 1}. ${question}`).join('\n')}`

    return `<!--LANG:roman-->
${romanUrduContent}
<!--LANG:english-->
${englishContent}`
  }

  return `# ${input.title}

## Code Example

\`\`\`${language}
${codeExample(input)}
\`\`\`

This code shows the main concept of ${input.title.toLowerCase()} in action.`
}
