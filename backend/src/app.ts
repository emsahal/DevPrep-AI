import express from 'express'
import http from 'http'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { config } from './config'
import routes from './routes'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'
import { rateLimiter } from './middleware/rateLimiter'
import logger from './utils/logger'
import { setupDuelSocket } from './socket/duel.socket'

const app = express()
const server = http.createServer(app)

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin || config.cors.allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(null, false)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

const io = new Server(server, { cors: corsOptions })

setupDuelSocket(io)

app.set('trust proxy', 1)

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Interview Preparation Platform API',
      version: '1.0.0',
      description: 'API for AI-powered Software Engineering Interview Preparation Platform',
    },
    servers: [{ url: `/api`, description: 'API server' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
})

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors(corsOptions))
app.use(morgan(config.isDev ? 'dev' : 'combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())
app.use(rateLimiter())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Interview Prep API Docs',
}))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api', routes)

app.use(notFoundHandler)
app.use(errorHandler)

export { app, server, io }
