import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, ArrowRight } from 'lucide-react'
import type { LearningPathListItem } from '@/services/learningPathService'

interface LearningPathCardProps {
  path: LearningPathListItem
}

export function LearningPathCard({ path }: LearningPathCardProps) {
  return (
    <Link to={`/learning-paths/${path.slug}`}>
      <Card className="group h-full cursor-pointer transition-all hover:shadow-md">
        <CardHeader>
          <div className={`h-2 w-full rounded-full bg-gradient-to-r ${path.color}`} />
          <div className="mt-4 flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{path.title}</CardTitle>
              <CardDescription className="mt-1 line-clamp-2">
                {path.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {path.technologies.slice(0, 4).map((tech) => (
              <Badge key={tech.id} variant="secondary" className="text-xs">
                {tech.name}
              </Badge>
            ))}
            {path.technologies.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{path.technologies.length - 4}
              </Badge>
            )}
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{path.topicCount} topics</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{path.estimatedHours}h</span>
            </div>
            <Badge variant="outline" className="text-xs capitalize">
              {path.difficulty}
            </Badge>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Start Learning <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
