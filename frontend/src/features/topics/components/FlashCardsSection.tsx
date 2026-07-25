import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import type { TopicFlashCard } from '@/services/topicService'

interface FlashCardsSectionProps {
  cards: TopicFlashCard[]
}

export function FlashCardsSection({ cards }: FlashCardsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  if (cards.length === 0) {
    return (
      <p className="py-4 text-sm text-muted-foreground">
        No flashcards available for this topic yet.
      </p>
    )
  }

  const card = cards[currentIndex]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {cards.length}
        </p>
        <Badge variant="outline" className="capitalize text-xs">
          {card.difficulty}
        </Badge>
      </div>

      <Card
        className="min-h-[200px] cursor-pointer transition-all hover:shadow-md"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <CardContent className="flex items-center justify-center p-8 text-center">
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              {isFlipped ? 'Answer' : 'Question'}
            </p>
            <p className="text-lg font-medium">
              {isFlipped ? card.back : card.front}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Click to {isFlipped ? 'see question' : 'reveal answer'}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCurrentIndex((i) => Math.max(0, i - 1))
            setIsFlipped(false)
          }}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setIsFlipped(!isFlipped)
          }}
        >
          <RotateCcw className="mr-1 h-4 w-4" /> Flip
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCurrentIndex((i) => Math.min(cards.length - 1, i + 1))
            setIsFlipped(false)
          }}
          disabled={currentIndex === cards.length - 1}
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
