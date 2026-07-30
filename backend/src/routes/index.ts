import { Router } from 'express'
import authRoutes from './auth.routes'
import dashboardRoutes from './dashboard.routes'
import learningPathRoutes from './learning-path.routes'
import technologyRoutes from './technology.routes'
import topicRoutes from './topic.routes'
import aiTutorRoutes from './ai-tutor.routes'
import codeAnalyzerRoutes from './code-analyzer.routes'
import quizRoutes from './quiz.routes'
import flashcardRoutes from './flashcard.routes'
import revisionRoutes from './revision.routes'
import searchRoutes from './search.routes'
import bookmarkRoutes from './bookmark.routes'
import interviewPrepRoutes from './interview-prep.routes'
import gamificationRoutes from './gamification.routes'
import notificationRoutes from './notification.routes'
import dsaCheckRoutes from './dsa-check.routes'
import resumeOptimizerRoutes from './resume-optimizer.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/learning-paths', learningPathRoutes)
router.use('/technologies', technologyRoutes)
router.use('/topics', topicRoutes)
router.use('/ai-tutor', aiTutorRoutes)
router.use('/code-analyzer', codeAnalyzerRoutes)
router.use('/quizzes', quizRoutes)
router.use('/flashcards', flashcardRoutes)
router.use('/revision', revisionRoutes)
router.use('/search', searchRoutes)
router.use('/bookmarks', bookmarkRoutes)
router.use('/interview-prep', interviewPrepRoutes)
router.use('/gamification', gamificationRoutes)
router.use('/notifications', notificationRoutes)
router.use('/dsa-check', dsaCheckRoutes)
router.use('/resume-optimizer', resumeOptimizerRoutes)

export default router
