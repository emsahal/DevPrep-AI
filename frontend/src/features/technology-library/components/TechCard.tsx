import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, ArrowRight } from 'lucide-react'
import type { TechItem } from '@/services/technologyService'

interface TechCardProps {
  tech: TechItem
}

export function TechCard({ tech }: TechCardProps) {
  return (
    <Link to={`/library/${tech.slug}`}>
      <Card className="group h-full cursor-pointer transition-all hover:shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{tech.name}</CardTitle>
              <CardDescription className="mt-1 line-clamp-2">
                {tech.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="capitalize text-xs">
              {tech.category}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>{tech.topicCount} topics</span>
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Browse Topics <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
