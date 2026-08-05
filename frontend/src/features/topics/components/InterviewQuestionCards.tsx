import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const AVATAR_POOL = [
  { name: 'Ayesha Khan', url: 'https://i.pravatar.cc/100?img=47' },
  { name: 'Ali Raza', url: 'https://i.pravatar.cc/100?img=12' },
  { name: 'Sara Ahmed', url: 'https://i.pravatar.cc/100?img=32' },
  { name: 'Hassan Malik', url: 'https://i.pravatar.cc/100?img=11' },
  { name: 'Zainab Ali', url: 'https://i.pravatar.cc/100?img=5' },
  { name: 'Usman Tariq', url: 'https://i.pravatar.cc/100?img=68' },
]

function initials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
}

interface InterviewQuestionCardsProps {
  questions: string[]
}

export function InterviewQuestionCards({ questions }: InterviewQuestionCardsProps) {
  return (
    <section className="space-y-4">
      <h2
        className="mt-8 mb-3 scroll-mt-24 border-t pt-6 text-xl font-bold"
        style={{ borderColor: 'var(--color-border-muted)', color: 'var(--color-primary)' }}
      >
        Interview Questions
      </h2>

      {questions.map((question, index) => (
        <Card
          key={index}
          className="w-full border-[var(--color-border-muted)] bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)]"
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold"
                style={{ background: 'rgba(208,188,255,0.12)', color: 'var(--color-primary)' }}
              >
                {index + 1}
              </span>
              <CardTitle className="text-base leading-tight">Interview Question {index + 1}</CardTitle>
            </div>
            <CardDescription>Commonly asked in real-world technical interviews.</CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
              {question}
            </p>
          </CardContent>

          <CardFooter>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {Array.from({ length: 3 }, (_, i) => AVATAR_POOL[(index * 3 + i) % AVATAR_POOL.length]).map(
                  (attendee, i) => (
                    <Avatar
                      key={i}
                      className="h-7 w-7 border-2"
                      style={{ borderColor: 'var(--color-surface-container-lowest)' }}
                    >
                      <AvatarImage alt={attendee.name} src={attendee.url} />
                      <AvatarFallback className="text-[9px]">{initials(attendee.name)}</AvatarFallback>
                    </Avatar>
                  )
                )}
              </div>
              <span className="text-[11px]" style={{ color: 'var(--color-outline)' }}>
                Practiced by 3 engineers
              </span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </section>
  )
}
