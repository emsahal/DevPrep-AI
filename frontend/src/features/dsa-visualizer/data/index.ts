import { level1Questions } from './level1'
import { level2Questions } from './level2'
import { level3Questions } from './level3'
import { level4Questions } from './level4'
import { level5Questions } from './level5'
import type { QuestionData } from '../types'

export const allQuestions: QuestionData[] = [
  ...level1Questions,
  ...level2Questions,
  ...level3Questions,
  ...level4Questions,
  ...level5Questions,
]

export function getQuestionById(id: string): QuestionData | undefined {
  return allQuestions.find(q => q.id === id)
}

export function getQuestionsByLevel(level: number): QuestionData[] {
  return allQuestions.filter(q => q.level === level)
}

export function getQuestionsByTopic(topic: string): QuestionData[] {
  return allQuestions.filter(q => q.topic.toLowerCase() === topic.toLowerCase())
}

export function getQuestionsByLevelAndTopic(level: number, topic: string): QuestionData[] {
  return allQuestions.filter(q => q.level === level && q.topic.toLowerCase() === topic.toLowerCase())
}

export { level1Questions, level2Questions, level3Questions, level4Questions, level5Questions }
