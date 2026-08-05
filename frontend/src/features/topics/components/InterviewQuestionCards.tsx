import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface InterviewQuestionCardsProps {
  questions: string[]
}

export function InterviewQuestionCards({ questions }: InterviewQuestionCardsProps) {
  return (
    <section className="mt-8">
      <h2
        className="mb-3 scroll-mt-24 border-t pt-6 text-xl font-bold"
        style={{ borderColor: 'var(--color-border-muted)', color: 'var(--color-primary)' }}
      >
        Interview Questions
      </h2>

      <Card className="w-full border-[var(--color-border-muted)] bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)]">
        <CardHeader>
          <CardTitle className="text-base">Commonly asked in real-world technical interviews.</CardTitle>
          <CardDescription className="text-sm text-[var(--color-on-surface-variant)]">
            These questions are designed to assess your problem-solving skills, coding proficiency, and understanding of data structures and algorithms.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ol className="space-y-3">
            {questions.map((question, index) => (
              <li key={index} className="flex gap-3 text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                <span
                  className="shrink-0 font-semibold"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {index + 1}.
                </span>
                <span>{question}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </section>
  )
}
