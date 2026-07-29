<div align="center">
  <br />
    <a href="https://www.devpreps.tech" target="_blank">
      <img src="https://img.shields.io/badge/DevPrep_AI-Live_Demo-8B5CF6?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-React_JS-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="react.js" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Node_JS-black?style=for-the-badge&logoColor=white&logo=node.js&color=339933" alt="node.js" />
    <img src="https://img.shields.io/badge/-PostgreSQL-black?style=for-the-badge&logoColor=white&logo=postgresql&color=4169E1" alt="postgresql" />
    <img src="https://img.shields.io/badge/-Redis-black?style=for-the-badge&logoColor=white&logo=redis&color=DC382D" alt="redis" />
    <img src="https://img.shields.io/badge/-Socket.IO-black?style=for-the-badge&logoColor=white&logo=socket.io&color=010101" alt="socket.io" />
    <img src="https://img.shields.io/badge/-Material_UI-black?style=for-the-badge&logoColor=white&logo=mui&color=007FFF" alt="material ui" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-Prisma-black?style=for-the-badge&logoColor=white&logo=prisma&color=2D3748" alt="prisma" />
  </div>

  <h3 align="center">AI-Powered Software Engineering Interview Preparation Platform</h3>

  <div align="center">
    Build your interview skills with AI tutors, coding challenges, real-time duels, and personalized learning paths.
  </div>
</div>

<p align="center">
  <img src="./frontend/src/assets/homepage.png" alt="Homepage" width="80%" />
</p>

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Quick Start](#quick-start)
5. [Environment Variables](#environment-variables)
6. [Project Structure](#project-structure)
7. [Deployment](#deployment)

## Introduction

DevPrep AI is a full-stack interview preparation platform that helps software engineers prepare for technical interviews through interactive learning tools, AI-powered tutoring, real-time competitive duels, and gamified progress tracking. The platform combines curated learning content with spaced repetition, code analysis, and AI-driven explanations to accelerate interview readiness.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Material UI, Tailwind CSS, TanStack React Query, Zustand, Framer Motion, CodeMirror, Recharts
- **Backend:** Node.js, TypeScript, Express.js, Prisma, PostgreSQL, Redis, Socket.IO
- **AI:** NVIDIA AI API (OpenAI-compatible) for AI tutor, code analysis, and DSA checking
- **Real-time:** Socket.IO for duel matchmaking, coding battles, quiz battles, and flashcard sprints
- **DevOps:** Docker, Docker Compose, Nginx, Render (backend), Vercel (frontend)

## Features

- **AI Tutor**: Conversational AI assistant that explains concepts, generates examples, simplifies topics, creates practice questions, and supports chat history with session management
- **AI Code Analyzer**: Automated code review detecting bugs, logic errors, code smells, performance issues, and security vulnerabilities with time/space complexity analysis
- **Interactive Quizzes**: Multiple-choice quizzes per topic with difficulty levels, time limits, daily challenges, and detailed attempt tracking
- **Spaced Repetition Flashcards**: SM-2 algorithm-based flashcards with progress tracking across new/learning/reviewing/mastered states
- **Real-Time Duels**: Three duel modes — Quiz Battle, Flashcard Sprint, and Coding Battle — with Redis-based matchmaking and live Socket.IO progress
- **Gamification**: XP system with 50 levels, achievement badges, daily streaks with multipliers, and a weekly leaderboard
- **Learning Paths**: Curated roadmaps for Frontend, Backend, DevOps, and more, composed of technologies and topics
- **Technology Library**: Browse organized technologies with detailed topic content, markdown rendering, and code examples
- **Revision Notes**: Create, share, and bookmark personal notes, summaries, and cheat-sheets
- **Search & Bookmarks**: Full-text search across all content with personal bookmarking
- **Dashboard**: Personalized overview with progress tracking, recent activity, and AI-powered recommendations
- **Dark/Light Theme**: Full theming support with persistent user preferences
- **PDF Export**: Generate and download quiz results as formatted PDFs

## Quick Start

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (v22+)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (optional, for containerized setup)

### Clone the Repository

```bash
git clone git@github.com:yourusername/Interview-Preps.git
cd Interview-Preps
```

### Docker Setup (Recommended)

```bash
cp .env.docker .env
# Update NVIDIA_API_KEY (or GEMINI_API_KEY) in .env
docker-compose up --build
```

This starts PostgreSQL 16, Redis 7, the backend (port 5000), and the frontend with Nginx (port 80).

### Manual Setup

**Backend:**

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run dev
```

**Frontend:**

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

The frontend runs on [http://localhost:5173](http://localhost:5173) with an API proxy to the backend.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/interview_prep` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_ACCESS_SECRET` | Access token secret | (required) |
| `JWT_REFRESH_SECRET` | Refresh token secret | (required) |
| `NVIDIA_API_KEY` | NVIDIA AI API key | (required for AI) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | (optional) |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | (optional) |
| `FRONTEND_URL` | CORS origin | `http://localhost:5173` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

## Project Structure

```
Interview-Preps/
├── backend/
│   ├── prisma/               # Schema, migrations, seed scripts, interview prep docs
│   └── src/
│       ├── server.ts         # Entry point
│       ├── app.ts            # Express setup, middleware, Swagger docs
│       ├── routes/           # 18 route files
│       ├── controllers/      # 17 controllers
│       ├── services/         # Business logic (AI tutor, duel engine, gamification, etc.)
│       ├── ai/               # NVIDIA API integration, system prompts
│       ├── middleware/       # Auth, rate limiting, validation, error handling
│       ├── socket/           # Real-time duel WebSocket namespace
│       └── validators/       # Zod schemas
│
├── frontend/
│   └── src/
│       ├── features/         # Feature modules (auth, quizzes, flashcards, duel, etc.)
│       ├── components/       # Layout, common, and UI primitives
│       ├── pages/            # 24 page components
│       ├── services/         # 20 API service modules
│       ├── store/            # Zustand stores
│       └── hooks/            # Custom React hooks
│
├── docker-compose.yml
├── render.yaml               # Render deployment blueprint
└── .env.docker
```

## Deployment

- **Frontend**: [https://www.devpreps.tech](https://www.devpreps.tech) — hosted on Vercel
- **Backend API**: [https://devprep-ai-xxvk.onrender.com](https://devprep-ai-xxvk.onrender.com) — hosted on Render
- **API Health**: [https://devprep-ai-xxvk.onrender.com/api/health](https://devprep-ai-xxvk.onrender.com/api/health)
- **Backend**: Deploy on [Render](https://render.com) using `render.yaml` blueprint (auto-detected PostgreSQL, Redis, and web service)
- **Frontend**: Deploy on [Vercel](https://vercel.com) — configured with SPA rewrites via `vercel.json`
- **API Docs**: Available at `/api-docs` (Swagger UI) on the backend instance

## Dashboard

<p align="center">
  <img src="./frontend/src/assets/dashboard.png" alt="Dashboard" width="80%" />
</p>

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and grow. Any contributions you make are **greatly appreciated**.

- Fork the project
- Create your feature branch (`git checkout -b feature/AmazingFeature`)
- Commit your changes (`git commit -m 'Add some AmazingFeature'`)
- Push to the branch (`git push origin feature/AmazingFeature`)
- Open a Pull Request

Feel free to open issues for bugs, feature requests, or questions.

## Author

**Sahal Sajeed** — [sahaal.vercel.app](https://sahaal.vercel.app)

If you find this project useful, consider giving it a ⭐ and sharing it with others!
