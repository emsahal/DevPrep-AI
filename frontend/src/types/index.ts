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

export interface ResumeData {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    linkedin?: string
    github?: string
    portfolio?: string
  }
  summary: string
  experience: ResumeExperience[]
  projects: ResumeProject[]
  education: ResumeEducation[]
  skills: ResumeSkillCategory[]
  certifications: string[]
  achievements: string[]
  technicalSkills: string[]
  softSkills: string[]
  strengths: string[]
  weaknesses: string[]
  yearsOfExperience: number
  industries: string[]
}

export interface ResumeExperience {
  company: string
  role: string
  dateRange: string
  location: string
  bullets: string[]
}

export interface ResumeProject {
  name: string
  bullets: string[]
}

export interface ResumeEducation {
  institution: string
  degree: string
  dateRange: string
  location: string
}

export interface ResumeSkillCategory {
  category: string
  items: string[]
}

export interface JobAnalysis {
  requiredSkills: string[]
  responsibilities: string[]
  technologies: string[]
  seniorityLevel: string
  keywords: string[]
  softSkills: string[]
  qualifications: string[]
  yearsOfExperience: number
  education: string
  niceToHave: string[]
  companyName: string
  jobTitle: string
}

export interface GapAnalysis {
  matchingSkills: string[]
  missingSkills: string[]
  missingKeywords: string[]
  resumeMatchPercentage: number
  atsScore: number
  keywordMatchPercentage: number
  strengthAreas: string[]
  weakAreas: string[]
  strongSections: string[]
  weakSections: string[]
  improvementSuggestions: string[]
  sectionOrderSuggestions: string[]
}

export interface OptimizedResume {
  summary: string
  experience: ResumeExperience[]
  projects: ResumeProject[]
  skills: ResumeSkillCategory[]
  certifications: string[]
  sectionOrder: string[]
}

export interface CoverLetterData {
  greeting: string
  introduction: string
  bodyParagraphs: string[]
  closing: string
  signature: string
  fullLetter: string
  id?: string
}

export interface ResumeUploadResult {
  resumeId: string
  parsedData: ResumeData
  originalText: string
}

export interface CreditInfo {
  available: number
  totalUsed: number
  freeCredits: number
  purchasedCredits: number
}

export interface PricingPlan {
  freeCredits: number
  costPerOptimization: number
  plans: { credits: number; price: number }[]
}

export type ResumeTemplate = 'classic' | 'modern' | 'ats-professional' | 'executive' | 'minimal'
