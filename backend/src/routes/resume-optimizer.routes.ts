import { Router } from 'express'
import { resumeOptimizerController } from '@/controllers/resume-optimizer.controller'
import { authenticate } from '@/middleware/auth'
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${uuidv4()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.docx', '.doc']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowed.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'))
    }
  },
})

const router = Router()

router.get('/credits', authenticate, resumeOptimizerController.getCredits.bind(resumeOptimizerController))
router.post('/credits/purchase', authenticate, resumeOptimizerController.purchaseCredits.bind(resumeOptimizerController))
router.post('/upload', authenticate, upload.single('resume'), resumeOptimizerController.uploadResume.bind(resumeOptimizerController))
router.post('/analyze-job', authenticate, resumeOptimizerController.analyzeJob.bind(resumeOptimizerController))
router.post('/optimize', authenticate, resumeOptimizerController.optimizeResume.bind(resumeOptimizerController))
router.post('/cover-letter', authenticate, resumeOptimizerController.generateCoverLetter.bind(resumeOptimizerController))
router.get('/resumes', authenticate, resumeOptimizerController.getUserResumes.bind(resumeOptimizerController))
router.get('/resumes/:id', authenticate, resumeOptimizerController.getResume.bind(resumeOptimizerController))
router.get('/resumes/:id/download', authenticate, resumeOptimizerController.downloadOriginal.bind(resumeOptimizerController))
router.get('/resumes/:id/pdf', authenticate, resumeOptimizerController.downloadPdf.bind(resumeOptimizerController))
router.delete('/resumes/:id', authenticate, resumeOptimizerController.deleteResume.bind(resumeOptimizerController))
router.get('/pricing', resumeOptimizerController.getPricing.bind(resumeOptimizerController))

export default router
