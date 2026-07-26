export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface Topic {
  id: string
  title: string
  slug: string
  description: string
  content: string
  category: string
  technologyId: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  order: number
  createdAt: string
  updatedAt: string
}

export interface Technology {
  id: string
  name: string
  slug: string
  description: string
  category: string
  icon: string
  order: number
}

export interface Quiz {
  id: string
  title: string
  description: string
  topicId: string
  questions: Question[]
  difficulty: string
  timeLimit: number
}

export interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface FlashCard {
  id: string
  front: string
  back: string
  topicId: string
  difficulty: string
}

export interface LearningPath {
  id: string
  title: string
  description: string
  icon: string
  color: string
  topics: string[]
  progress: number
}

export interface AIRequest {
  prompt: string
  context?: string
  type: 'explain' | 'simplify' | 'examples' | 'summary' | 'compare' | 'questions' | 'notes'
}

export interface AIResponse {
  content: string
  sources?: string[]
}

export interface CodeAnalysisRequest {
  code: string
  language: string
}

export interface CodeAnalysisResponse {
  explanation: string
  bugs: string[]
  logicErrors: string[]
  codeSmells: string[]
  refactoring: string[]
  improvements: string[]
  performance: string[]
  security: string[]
  testCases: string[]
  documentation: string
  timeComplexity: string
  spaceComplexity: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

export interface UserStats {
  totalPoints: number
  weeklyPoints: number
  xp: number
  level: number
  title: string
  currentStreak: number
  longestStreak: number
  nextLevelXp: number
  currentLevelXp: number
  badges: UserBadge[]
}

export interface UserBadge {
  key: string
  name: string
  description: string
  iconUrl: string | null
  unlockedAt: string
}

export interface BadgeDef {
  key: string
  name: string
  description: string
  iconUrl: string | null
  criteria: Record<string, unknown>
}

export interface LeaderboardEntry {
  userId: string
  name: string
  avatar: string | null
  points: number
  level: number
}

export interface PointTransaction {
  id: string
  userId: string
  amount: number
  reason: string
  referenceType: string | null
  referenceId: string | null
  multiplier: number
  streakDays: number
  createdAt: string
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  currentUser: { rank: number; points: number } | null
}
