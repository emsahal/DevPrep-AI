import express from 'express'
import http from 'http'
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

// Allowed origins for CORS — also used by Socket.IO
const allowedOriginsSet = new Set(config.cors.allowedOrigins)

const io = new Server(server, {
  cors: {
    origin: Array.from(allowedOriginsSet),
    credentials: true,
    methods: ['GET', 'POST'],
  },
  transports: ['polling', 'websocket'],
  connectTimeout: 30000,
  pingTimeout: 25000,
  pingInterval: 10000,
  allowEIO3: true,
})

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

// ── CORS ─────────────────────────────────────────────────────────────────────
// Raw middleware runs before helmet, rateLimiter, auth, and error handlers.
// Sets headers directly — nothing in the chain can block or strip them.
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const origin = req.headers.origin as string | undefined
  if (origin && allowedOriginsSet.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }
  // Answer preflight immediately — never reaches helmet/routes
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }
  next()
})
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
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
