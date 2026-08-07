import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { generateTopicContent } from './topic-content'

dotenv.config()

const prisma = new PrismaClient()

const technologies = [
  { name: 'HTML', slug: 'html', description: 'HyperText Markup Language - the standard language for creating web pages and web applications.', category: 'frontend', icon: 'file-type-html', color: '#e34f26', order: 1 },
  { name: 'CSS', slug: 'css', description: 'Cascading Style Sheets - styling language for describing the presentation of web documents.', category: 'frontend', icon: 'file-type-css', color: '#1572b6', order: 2 },
  { name: 'JavaScript', slug: 'javascript', description: 'High-level, interpreted programming language that conforms to the ECMAScript specification.', category: 'frontend', icon: 'file-type-js', color: '#f7df1e', order: 3 },
  { name: 'TypeScript', slug: 'typescript', description: 'Typed superset of JavaScript that compiles to plain JavaScript with static type checking.', category: 'frontend', icon: 'file-type-ts', color: '#3178c6', order: 4 },
  { name: 'React', slug: 'react', description: 'JavaScript library for building user interfaces with reusable, declarative components.', category: 'frontend', icon: 'react', color: '#61dafb', order: 5 },
  { name: 'Next.js', slug: 'nextjs', description: 'React framework for production-grade applications with SSR, SSG, and API routes.', category: 'frontend', icon: 'nextjs', color: '#ffffff', order: 6 },
  { name: 'Node.js', slug: 'nodejs', description: 'JavaScript runtime built on Chrome V8 engine for building scalable server-side applications.', category: 'backend', icon: 'nodejs', color: '#339933', order: 7 },
  { name: 'Express.js', slug: 'expressjs', description: 'Fast, unopinionated, minimalist web framework for Node.js with robust routing and middleware.', category: 'backend', icon: 'express', color: '#000000', order: 8 },
  { name: 'REST APIs', slug: 'rest-apis', description: 'Architectural style for designing networked applications with stateless HTTP operations.', category: 'backend', icon: 'api', color: '#ff6c2c', order: 9 },
  { name: 'GraphQL', slug: 'graphql', description: 'Query language for APIs that enables declarative data fetching and real-time subscriptions.', category: 'backend', icon: 'graphql', color: '#e535ab', order: 10 },
  { name: 'Authentication', slug: 'authentication', description: 'Process of verifying user identity and managing access control in web applications.', category: 'backend', icon: 'lock', color: '#ff6c2c', order: 11 },
  { name: 'MongoDB', slug: 'mongodb', description: 'NoSQL document database with flexible schema design and powerful aggregation pipeline.', category: 'database', icon: 'mongodb', color: '#47a248', order: 12 },
  { name: 'PostgreSQL', slug: 'postgresql', description: 'Advanced open-source relational database with ACID compliance and extensible features.', category: 'database', icon: 'postgresql', color: '#336791', order: 13 },
  { name: 'MySQL', slug: 'mysql', description: 'World\'s most popular open-source relational database management system for ACID transactions and web workloads.', category: 'database', icon: 'mysql', color: '#4479a1', order: 14 },
  { name: 'Redis', slug: 'redis', description: 'In-memory data structure store used as cache, message broker, and database with built-in replication.', category: 'database', icon: 'redis', color: '#dc382d', order: 15 },
  { name: 'Git', slug: 'git', description: 'Distributed version control system for tracking changes in source code during development.', category: 'devops', icon: 'git', color: '#f05032', order: 16 },
  { name: 'Docker', slug: 'docker', description: 'Platform for developing, shipping, and running applications in lightweight containers.', category: 'devops', icon: 'docker', color: '#2496ed', order: 17 },
  { name: 'CI/CD', slug: 'cicd', description: 'Continuous Integration and Continuous Deployment practices for automated software delivery.', category: 'devops', icon: 'cicd', color: '#2396ed', order: 18 },
  { name: 'Nginx', slug: 'nginx', description: 'High-performance web server, reverse proxy, and load balancer for modern web infrastructure.', category: 'devops', icon: 'nginx', color: '#009639', order: 19 },
  { name: 'PM2', slug: 'pm2', description: 'Production process manager for Node.js applications with clustering and monitoring.', category: 'devops', icon: 'pm2', color: '#2b037a', order: 20 },
  { name: 'Testing', slug: 'testing', description: 'Software testing methodologies including unit, integration, and end-to-end testing strategies.', category: 'other', icon: 'test', color: '#7c3aed', order: 21 },
  { name: 'Performance', slug: 'performance', description: 'Web performance optimization techniques for faster load times and better user experience.', category: 'other', icon: 'zap', color: '#eab308', order: 22 },
  { name: 'Security', slug: 'security', description: 'Web security principles and practices for protecting applications from vulnerabilities and attacks.', category: 'other', icon: 'shield', color: '#dc2626', order: 23 },
  { name: 'System Design', slug: 'system-design', description: 'Architecture and design of scalable, distributed systems for modern software applications.', category: 'other', icon: 'layout', color: '#0891b2', order: 24 },
  { name: 'DSA', slug: 'dsa', description: 'Data Structures and Algorithms for solving computational problems efficiently in interviews.', category: 'other', icon: 'code', color: '#7c3aed', order: 25 },
]

const learningPaths = [
  {
    title: 'Frontend Development',
    slug: 'frontend',
    description: 'Master modern frontend development with HTML, CSS, JavaScript, TypeScript, React, and Next.js. Build responsive, accessible, and performant web applications.',
    icon: 'layout',
    color: 'from-blue-500 to-cyan-500',
    category: 'development',
    difficulty: 'beginner',
    estimatedHours: 120,
    order: 1,
    technologies: ['html', 'css', 'javascript', 'typescript', 'react', 'nextjs'],
  },
  {
    title: 'Backend Development',
    slug: 'backend',
    description: 'Build robust server-side applications with Node.js, Express, REST APIs, GraphQL, and Authentication. Learn database design and API best practices.',
    icon: 'server',
    color: 'from-green-500 to-emerald-500',
    category: 'development',
    difficulty: 'intermediate',
    estimatedHours: 100,
    order: 2,
    technologies: ['nodejs', 'expressjs', 'rest-apis', 'graphql', 'authentication'],
  },
  {
    title: 'Full Stack Development',
    slug: 'full-stack',
    description: 'Become a complete full-stack developer. Combine frontend and backend skills to build end-to-end web applications with modern technologies.',
    icon: 'globe',
    color: 'from-purple-500 to-pink-500',
    category: 'development',
    difficulty: 'intermediate',
    estimatedHours: 200,
    order: 3,
    technologies: ['html', 'css', 'javascript', 'typescript', 'react', 'nextjs', 'nodejs', 'expressjs', 'rest-apis', 'mongodb', 'postgresql'],
  },
  {
    title: 'Database Administration (DBA)',
    slug: 'database-administration',
    description: 'Master core DBA skills across MySQL, PostgreSQL, MongoDB, and Redis. Learn server configuration, query optimization, backup & disaster recovery, replication, sharding, high availability, and database security.',
    icon: 'database',
    color: 'from-cyan-500 to-blue-600',
    category: 'database',
    difficulty: 'intermediate',
    estimatedHours: 140,
    order: 4,
    technologies: ['mysql', 'postgresql', 'mongodb', 'redis'],
  },
  {
    title: 'DevOps Engineering',
    slug: 'devops',
    description: 'Learn DevOps practices including version control with Git, containerization with Docker, CI/CD pipelines, Nginx configuration, and process management with PM2.',
    icon: 'terminal',
    color: 'from-orange-500 to-red-500',
    category: 'devops',
    difficulty: 'advanced',
    estimatedHours: 80,
    order: 5,
    technologies: ['git', 'docker', 'cicd', 'nginx', 'pm2'],
  },
  {
    title: 'System Design',
    slug: 'system-design',
    description: 'Learn to design scalable, reliable, and maintainable systems. Master architectural patterns, trade-offs, and design principles used at top tech companies.',
    icon: 'git-branch',
    color: 'from-indigo-500 to-violet-500',
    category: 'architecture',
    difficulty: 'advanced',
    estimatedHours: 60,
    order: 6,
    technologies: ['system-design'],
  },
  {
    title: 'Data Structures & Algorithms',
    slug: 'dsa',
    description: 'Master data structures and algorithms for technical interviews. Covers arrays, linked lists, trees, graphs, dynamic programming, and more.',
    icon: 'code',
    color: 'from-yellow-500 to-orange-500',
    category: 'algorithms',
    difficulty: 'intermediate',
    estimatedHours: 150,
    order: 7,
    technologies: ['dsa'],
  },
]

const topicTemplates: Record<string, Array<{ title: string; slug: string; description: string; difficulty: string; order: number }>> = {
  html: [
    { title: 'Introduction to HTML', slug: 'intro-to-html', description: 'Learn the basics of HTML, the foundation of web pages.', difficulty: 'beginner', order: 1 },
    { title: 'HTML Elements & Tags', slug: 'html-elements-tags', description: 'Understanding HTML elements, tags, and attributes.', difficulty: 'beginner', order: 2 },
    { title: 'HTML Forms & Input', slug: 'html-forms-input', description: 'Building forms with various input types and validation.', difficulty: 'beginner', order: 3 },
    { title: 'Semantic HTML', slug: 'semantic-html', description: 'Using semantic elements for better accessibility and SEO.', difficulty: 'beginner', order: 4 },
    { title: 'HTML5 APIs', slug: 'html5-apis', description: 'Exploring modern HTML5 APIs like Canvas, Geolocation, and Web Storage.', difficulty: 'intermediate', order: 5 },
    { title: 'Accessible HTML', slug: 'accessible-html', description: 'Creating accessible web content with ARIA and best practices.', difficulty: 'intermediate', order: 6 },
  ],
  css: [
    { title: 'CSS Fundamentals', slug: 'css-fundamentals', description: 'Learn CSS selectors, properties, and the box model.', difficulty: 'beginner', order: 1 },
    { title: 'CSS Layouts', slug: 'css-layouts', description: 'Master Flexbox, Grid, and positioning in CSS.', difficulty: 'beginner', order: 2 },
    { title: 'Responsive Design', slug: 'responsive-design', description: 'Building responsive websites with media queries and mobile-first design.', difficulty: 'intermediate', order: 3 },
    { title: 'CSS Animations', slug: 'css-animations', description: 'Creating animations and transitions with CSS.', difficulty: 'intermediate', order: 4 },
    { title: 'CSS Preprocessors', slug: 'css-preprocessors', description: 'Using Sass/SCSS for more maintainable stylesheets.', difficulty: 'intermediate', order: 5 },
    { title: 'Modern CSS Features', slug: 'modern-css-features', description: 'CSS custom properties, container queries, and new selectors.', difficulty: 'advanced', order: 6 },
  ],
  javascript: [
    { title: 'JavaScript Basics', slug: 'javascript-basics', description: 'Variables, data types, operators, and control flow.', difficulty: 'beginner', order: 1 },
    { title: 'Functions & Scope', slug: 'functions-scope', description: 'Function declarations, expressions, closures, and scope.', difficulty: 'beginner', order: 2 },
    { title: 'Objects & Arrays', slug: 'objects-arrays', description: 'Working with objects, arrays, and built-in methods.', difficulty: 'beginner', order: 3 },
    { title: 'DOM Manipulation', slug: 'dom-manipulation', description: 'Interacting with the Document Object Model.', difficulty: 'intermediate', order: 4 },
    { title: 'Asynchronous JavaScript', slug: 'async-javascript', description: 'Callbacks, Promises, async/await, and event loop.', difficulty: 'intermediate', order: 5 },
    { title: 'ES6+ Features', slug: 'es6-features', description: 'Modern JavaScript features: destructuring, spread, modules, and more.', difficulty: 'intermediate', order: 6 },
    { title: 'Error Handling & Debugging', slug: 'error-handling-debugging', description: 'Try/catch, error types, and debugging techniques.', difficulty: 'intermediate', order: 7 },
    { title: 'JavaScript Design Patterns', slug: 'js-design-patterns', description: 'Common patterns: Module, Observer, Singleton, Factory.', difficulty: 'advanced', order: 8 },
  ],
  typescript: [
    { title: 'TypeScript Basics', slug: 'typescript-basics', description: 'Types, interfaces, and basic TypeScript setup.', difficulty: 'beginner', order: 1 },
    { title: 'Advanced Types', slug: 'advanced-types', description: 'Generics, unions, intersections, and conditional types.', difficulty: 'intermediate', order: 2 },
    { title: 'TypeScript with React', slug: 'typescript-react', description: 'Using TypeScript effectively in React applications.', difficulty: 'intermediate', order: 3 },
    { title: 'TypeScript Utility Types', slug: 'typescript-utility-types', description: 'Partial, Pick, Omit, Record, and other utility types.', difficulty: 'intermediate', order: 4 },
    { title: 'TypeScript Decorators', slug: 'typescript-decorators', description: 'Class and property decorators in TypeScript.', difficulty: 'advanced', order: 5 },
    { title: 'TypeScript Configuration', slug: 'typescript-configuration', description: 'tsconfig options, strict mode, and project references.', difficulty: 'advanced', order: 6 },
  ],
  react: [
    { title: 'React Fundamentals', slug: 'react-fundamentals', description: 'JSX, components, props, and the React ecosystem.', difficulty: 'beginner', order: 1 },
    { title: 'State & Hooks', slug: 'state-hooks', description: 'useState, useEffect, useRef, and custom hooks.', difficulty: 'beginner', order: 2 },
    { title: 'React Component Patterns', slug: 'react-component-patterns', description: 'Compound components, render props, HOCs, and hooks patterns.', difficulty: 'intermediate', order: 3 },
    { title: 'State Management', slug: 'state-management', description: 'Context API, Zustand, Redux, and state management patterns.', difficulty: 'intermediate', order: 4 },
    { title: 'React Performance', slug: 'react-performance', description: 'Memoization, virtualization, code splitting, and optimization.', difficulty: 'advanced', order: 5 },
    { title: 'Testing React Apps', slug: 'testing-react', description: 'Unit testing, integration testing, and E2E testing with React.', difficulty: 'advanced', order: 6 },
    { title: 'React Router & Navigation', slug: 'react-router', description: 'Client-side routing, nested routes, and navigation guards.', difficulty: 'intermediate', order: 7 },
    { title: 'Server Components & Suspense', slug: 'server-components', description: 'React Server Components, Suspense, and streaming SSR.', difficulty: 'advanced', order: 8 },
  ],
  nextjs: [
    { title: 'Next.js Basics', slug: 'nextjs-basics', description: 'Pages, routing, and the Next.js project structure.', difficulty: 'beginner', order: 1 },
    { title: 'Data Fetching', slug: 'nextjs-data-fetching', description: 'SSR, SSG, ISR, and client-side data fetching.', difficulty: 'intermediate', order: 2 },
    { title: 'API Routes', slug: 'nextjs-api-routes', description: 'Building API endpoints within Next.js.', difficulty: 'intermediate', order: 3 },
    { title: 'Next.js Middleware & Auth', slug: 'nextjs-middleware-auth', description: 'Middleware, authentication, and authorization patterns.', difficulty: 'intermediate', order: 4 },
    { title: 'Next.js Performance', slug: 'nextjs-performance', description: 'Image optimization, caching, and performance best practices.', difficulty: 'advanced', order: 5 },
    { title: 'Deploying Next.js', slug: 'deploying-nextjs', description: 'Deployment strategies for Vercel, Docker, and self-hosted.', difficulty: 'advanced', order: 6 },
  ],
  nodejs: [
    { title: 'Node.js Fundamentals', slug: 'nodejs-fundamentals', description: 'Event loop, modules, npm, and Node.js architecture.', difficulty: 'beginner', order: 1 },
    { title: 'File System & Streams', slug: 'file-system-streams', description: 'Working with files, streams, and buffers in Node.js.', difficulty: 'intermediate', order: 2 },
    { title: 'Node.js with Express', slug: 'nodejs-express', description: 'Building web servers and APIs with Express.js.', difficulty: 'intermediate', order: 3 },
    { title: 'Error Handling & Logging', slug: 'nodejs-error-handling', description: 'Error handling patterns and logging with Winston/Pino.', difficulty: 'intermediate', order: 4 },
    { title: 'Node.js Performance', slug: 'nodejs-performance', description: 'Cluster mode, worker threads, and performance optimization.', difficulty: 'advanced', order: 5 },
    { title: 'Node.js Security', slug: 'nodejs-security', description: 'Security best practices: Helmet, CORS, rate limiting, and input validation.', difficulty: 'advanced', order: 6 },
  ],
  expressjs: [
    { title: 'Express.js Basics', slug: 'expressjs-basics', description: 'Routing, middleware, and request/response handling.', difficulty: 'beginner', order: 1 },
    { title: 'Express Middleware', slug: 'expressjs-middleware', description: 'Creating custom middleware and using popular middleware packages.', difficulty: 'intermediate', order: 2 },
    { title: 'RESTful APIs with Express', slug: 'restful-apis-express', description: 'Building RESTful APIs following best practices.', difficulty: 'intermediate', order: 3 },
    { title: 'Express Error Handling', slug: 'expressjs-error-handling', description: 'Centralized error handling and validation.', difficulty: 'intermediate', order: 4 },
    { title: 'Express Security', slug: 'expressjs-security', description: 'Securing Express apps: Helmet, CORS, and input sanitization.', difficulty: 'advanced', order: 5 },
    { title: 'Testing Express Apps', slug: 'testing-express', description: 'Unit and integration testing for Express applications.', difficulty: 'advanced', order: 6 },
  ],
  'rest-apis': [
    { title: 'REST API Design Principles', slug: 'rest-api-design', description: 'HTTP methods, status codes, and RESTful conventions.', difficulty: 'beginner', order: 1 },
    { title: 'API Versioning & Documentation', slug: 'api-versioning', description: 'Versioning strategies and OpenAPI/Swagger documentation.', difficulty: 'intermediate', order: 2 },
    { title: 'Pagination & Filtering', slug: 'pagination-filtering', description: 'Implementing pagination, sorting, and filtering in REST APIs.', difficulty: 'intermediate', order: 3 },
    { title: 'Rate Limiting & Throttling', slug: 'rate-limiting', description: 'API rate limiting strategies and implementation.', difficulty: 'intermediate', order: 4 },
    { title: 'API Security Best Practices', slug: 'api-security', description: 'Authentication, authorization, and API security patterns.', difficulty: 'advanced', order: 5 },
    { title: 'GraphQL vs REST', slug: 'graphql-vs-rest', description: 'Comparing GraphQL and REST for API design.', difficulty: 'advanced', order: 6 },
  ],
  graphql: [
    { title: 'GraphQL Basics', slug: 'graphql-basics', description: 'Schema, queries, mutations, and resolvers.', difficulty: 'beginner', order: 1 },
    { title: 'GraphQL Schemas & Types', slug: 'graphql-schemas-types', description: 'Defining types, inputs, enums, and interfaces.', difficulty: 'intermediate', order: 2 },
    { title: 'GraphQL with Node.js', slug: 'graphql-nodejs', description: 'Building GraphQL servers with Apollo Server and Express.', difficulty: 'intermediate', order: 3 },
    { title: 'GraphQL Subscriptions', slug: 'graphql-subscriptions', description: 'Real-time data with GraphQL subscriptions.', difficulty: 'advanced', order: 4 },
    { title: 'GraphQL Performance', slug: 'graphql-performance', description: 'DataLoader, batching, and caching strategies.', difficulty: 'advanced', order: 5 },
  ],
  authentication: [
    { title: 'Authentication Basics', slug: 'auth-basics', description: 'Session-based vs token-based authentication.', difficulty: 'beginner', order: 1 },
    { title: 'JWT Authentication', slug: 'jwt-authentication', description: 'JSON Web Tokens: implementation and best practices.', difficulty: 'intermediate', order: 2 },
    { title: 'OAuth 2.0 & Social Login', slug: 'oauth-social-login', description: 'Implementing OAuth 2.0 and social authentication providers.', difficulty: 'intermediate', order: 3 },
    { title: 'Role-Based Access Control', slug: 'role-based-access', description: 'Implementing RBAC and permission systems.', difficulty: 'intermediate', order: 4 },
    { title: 'Security Best Practices', slug: 'auth-security', description: 'Password hashing, MFA, and security headers.', difficulty: 'advanced', order: 5 },
  ],
  mongodb: [
    { title: 'MongoDB Basics', slug: 'mongodb-basics', description: 'Documents, collections, and CRUD operations.', difficulty: 'beginner', order: 1 },
    { title: 'Schema Design & Data Modeling', slug: 'mongodb-schema-design', description: 'Embedding vs referencing, schema validation, and anti-patterns.', difficulty: 'intermediate', order: 2 },
    { title: 'Indexing & Aggregation Framework', slug: 'mongodb-indexing', description: 'Compound indexes, execution plans, and aggregation pipelines.', difficulty: 'intermediate', order: 3 },
    { title: 'MongoDB Replica Sets & High Availability', slug: 'mongodb-replication', description: 'Primary/Secondary nodes, election process, read preferences, and write concerns.', difficulty: 'advanced', order: 4 },
    { title: 'MongoDB Sharding & Cluster Administration', slug: 'mongodb-sharding', description: 'Shard keys, mongos routing, chunk balancing, and horizontal scaling.', difficulty: 'advanced', order: 5 },
    { title: 'MongoDB Security, Backup & Maintenance', slug: 'mongodb-security-backup', description: 'RBAC, WiredTiger storage engine tuning, mongodump/mongorestore, and Ops Manager.', difficulty: 'advanced', order: 6 },
  ],
  postgresql: [
    { title: 'PostgreSQL Architecture & Core SQL', slug: 'postgresql-basics', description: 'Process architecture, MVCC, WAL, tables, and constraints.', difficulty: 'beginner', order: 1 },
    { title: 'Advanced SQL & Window Functions', slug: 'advanced-sql', description: 'Joins, subqueries, CTEs, window functions, and JSONB queries.', difficulty: 'intermediate', order: 2 },
    { title: 'Database Design & Indexing Strategies', slug: 'database-design', description: 'Normalization, B-Tree, GIN, GiST indexes, and partial indexes.', difficulty: 'intermediate', order: 3 },
    { title: 'Query Tuning & EXPLAIN ANALYZE', slug: 'postgresql-performance', description: 'Reading execution plans, autovacuum tuning, connection pooling (PgBouncer), and work_mem.', difficulty: 'advanced', order: 4 },
    { title: 'PostgreSQL Replication & High Availability', slug: 'postgresql-replication', description: 'Streaming replication, logical replication, Patroni, and failover management.', difficulty: 'advanced', order: 5 },
    { title: 'PostgreSQL Security, Backup & Disaster Recovery', slug: 'postgresql-security', description: 'Roles, pg_dump, WAL archiving, pg_basebackup, PITR (Point-In-Time Recovery), and SSL.', difficulty: 'advanced', order: 6 },
  ],
  mysql: [
    { title: 'MySQL Architecture & Fundamentals', slug: 'mysql-architecture', description: 'InnoDB storage engine, buffer pool, redo log, undo log, and connection management.', difficulty: 'beginner', order: 1 },
    { title: 'SQL Query Optimization & Indexing', slug: 'mysql-optimization', description: 'EXPLAIN plans, composite indexes, B-tree indexes, query cache, and slow query log analysis.', difficulty: 'intermediate', order: 2 },
    { title: 'MySQL Transactions & Concurrency', slug: 'mysql-transactions', description: 'ACID properties, isolation levels, row-level locking, deadlocks, and MVCC in InnoDB.', difficulty: 'intermediate', order: 3 },
    { title: 'MySQL Replication & High Availability', slug: 'mysql-replication', description: 'Source-replica replication, GTID-based replication, MySQL InnoDB Cluster, and Orchestrator.', difficulty: 'advanced', order: 4 },
    { title: 'MySQL Backup, Recovery & Disaster Planning', slug: 'mysql-backup-recovery', description: 'Physical vs logical backups (mysqldump, Percona XtraBackup), point-in-time recovery with binary logs.', difficulty: 'advanced', order: 5 },
    { title: 'MySQL Security & Server Administration', slug: 'mysql-security-admin', description: 'User privilege management, SSL/TLS, data encryption at rest, memory tuning, and monitoring.', difficulty: 'advanced', order: 6 },
  ],
  redis: [
    { title: 'Redis Fundamentals & Data Structures', slug: 'redis-basics', description: 'Strings, Hashes, Lists, Sets, Sorted Sets, Bitmaps, and HyperLogLogs.', difficulty: 'beginner', order: 1 },
    { title: 'Caching Strategies & Eviction Policies', slug: 'caching-strategies', description: 'Cache-aside, write-through, TTL, LRU/LFU eviction policies, and cache stampede protection.', difficulty: 'intermediate', order: 2 },
    { title: 'Redis Persistence & Memory Management', slug: 'redis-persistence', description: 'RDB snapshots, AOF log rewriting, memory optimization, and maxmemory policies.', difficulty: 'intermediate', order: 3 },
    { title: 'Redis High Availability & Replication', slug: 'redis-replication', description: 'Master-Replica replication, Redis Sentinel failover, and automatic leader election.', difficulty: 'advanced', order: 4 },
    { title: 'Redis Cluster & Horizontal Scaling', slug: 'redis-cluster', description: 'Hash slots, sharding, resharding, client-side routing, and cluster administration.', difficulty: 'advanced', order: 5 },
  ],
  git: [
    { title: 'Git Basics', slug: 'git-basics', description: 'init, add, commit, branch, and merge.', difficulty: 'beginner', order: 1 },
    { title: 'Branching Strategies', slug: 'branching-strategies', description: 'Git flow, trunk-based development, and feature branches.', difficulty: 'intermediate', order: 2 },
    { title: 'Collaboration with Git', slug: 'git-collaboration', description: 'Pull requests, code review, and conflict resolution.', difficulty: 'intermediate', order: 3 },
    { title: 'Advanced Git', slug: 'advanced-git', description: 'Rebase, cherry-pick, bisect, and Git hooks.', difficulty: 'advanced', order: 4 },
    { title: 'GitOps & Automation', slug: 'gitops-automation', description: 'CI/CD integration, Git hooks, and automated workflows.', difficulty: 'advanced', order: 5 },
  ],
  docker: [
    { title: 'Docker Basics', slug: 'docker-basics', description: 'Images, containers, Dockerfile, and Docker Compose.', difficulty: 'beginner', order: 1 },
    { title: 'Dockerfile Best Practices', slug: 'dockerfile-best-practices', description: 'Multi-stage builds, layer optimization, and security.', difficulty: 'intermediate', order: 2 },
    { title: 'Docker Compose', slug: 'docker-compose', description: 'Orchestrating multi-container applications.', difficulty: 'intermediate', order: 3 },
    { title: 'Docker Networking', slug: 'docker-networking', description: 'Network drivers, DNS, and service discovery.', difficulty: 'intermediate', order: 4 },
    { title: 'Docker in Production', slug: 'docker-production', description: 'Docker Swarm, Kubernetes basics, and production best practices.', difficulty: 'advanced', order: 5 },
  ],
  cicd: [
    { title: 'CI/CD Fundamentals', slug: 'cicd-fundamentals', description: 'Continuous integration and deployment concepts.', difficulty: 'beginner', order: 1 },
    { title: 'GitHub Actions', slug: 'github-actions', description: 'Building CI/CD pipelines with GitHub Actions.', difficulty: 'intermediate', order: 2 },
    { title: 'Testing in CI/CD', slug: 'testing-cicd', description: 'Automated testing strategies in CI/CD pipelines.', difficulty: 'intermediate', order: 3 },
    { title: 'Deployment Strategies', slug: 'deployment-strategies', description: 'Blue-green, canary, and rolling deployments.', difficulty: 'advanced', order: 4 },
    { title: 'Monitoring & Rollback', slug: 'monitoring-rollback', description: 'Monitoring deployments and rollback strategies.', difficulty: 'advanced', order: 5 },
  ],
  nginx: [
    { title: 'Nginx Basics', slug: 'nginx-basics', description: 'Installation, configuration, and basic server setup.', difficulty: 'beginner', order: 1 },
    { title: 'Nginx as Reverse Proxy', slug: 'nginx-reverse-proxy', description: 'Configuring Nginx as a reverse proxy and load balancer.', difficulty: 'intermediate', order: 2 },
    { title: 'Nginx Performance Tuning', slug: 'nginx-performance', description: 'Caching, compression, and performance optimization.', difficulty: 'intermediate', order: 3 },
    { title: 'Nginx Security', slug: 'nginx-security', description: 'SSL/TLS, rate limiting, and security headers.', difficulty: 'advanced', order: 4 },
  ],
  pm2: [
    { title: 'PM2 Basics', slug: 'pm2-basics', description: 'Process management, startup, and basic commands.', difficulty: 'beginner', order: 1 },
    { title: 'PM2 Clustering', slug: 'pm2-clustering', description: 'Cluster mode, load balancing, and zero-downtime deployments.', difficulty: 'intermediate', order: 2 },
    { title: 'PM2 Monitoring', slug: 'pm2-monitoring', description: 'Logs, metrics, and application monitoring with PM2.', difficulty: 'intermediate', order: 3 },
    { title: 'PM2 in Production', slug: 'pm2-production', description: 'Ecosystem files, deployment, and CI/CD integration.', difficulty: 'advanced', order: 4 },
  ],
  testing: [
    { title: 'Testing Fundamentals', slug: 'testing-fundamentals', description: 'Unit, integration, and E2E testing concepts.', difficulty: 'beginner', order: 1 },
    { title: 'Unit Testing', slug: 'unit-testing', description: 'Writing unit tests with Jest and Vitest.', difficulty: 'intermediate', order: 2 },
    { title: 'Integration Testing', slug: 'integration-testing', description: 'Testing APIs and database interactions.', difficulty: 'intermediate', order: 3 },
    { title: 'E2E Testing', slug: 'e2e-testing', description: 'End-to-end testing with Playwright and Cypress.', difficulty: 'advanced', order: 4 },
    { title: 'TDD & BDD', slug: 'tdd-bdd', description: 'Test-driven development and behavior-driven development.', difficulty: 'advanced', order: 5 },
  ],
  performance: [
    { title: 'Web Performance Basics', slug: 'web-performance-basics', description: 'Core Web Vitals, metrics, and measurement tools.', difficulty: 'beginner', order: 1 },
    { title: 'Frontend Optimization', slug: 'frontend-optimization', description: 'Code splitting, lazy loading, and bundle optimization.', difficulty: 'intermediate', order: 2 },
    { title: 'Backend Performance', slug: 'backend-performance', description: 'Database optimization, caching, and async processing.', difficulty: 'intermediate', order: 3 },
    { title: 'Network Optimization', slug: 'network-optimization', description: 'CDN, HTTP/2, compression, and resource prioritization.', difficulty: 'advanced', order: 4 },
    { title: 'Performance Monitoring', slug: 'performance-monitoring', description: 'APM tools, profiling, and continuous monitoring.', difficulty: 'advanced', order: 5 },
  ],
  security: [
    { title: 'Web Security Fundamentals', slug: 'web-security-fundamentals', description: 'OWASP Top 10, threat modeling, and security principles.', difficulty: 'beginner', order: 1 },
    { title: 'Common Vulnerabilities', slug: 'common-vulnerabilities', description: 'XSS, CSRF, SQL Injection, and SSRF prevention.', difficulty: 'intermediate', order: 2 },
    { title: 'Secure Authentication', slug: 'secure-authentication', description: 'Password hashing, session management, and MFA.', difficulty: 'intermediate', order: 3 },
    { title: 'API Security', slug: 'api-security-advanced', description: 'Rate limiting, input validation, and secure API design.', difficulty: 'intermediate', order: 4 },
    { title: 'Infrastructure Security', slug: 'infrastructure-security', description: 'Network security, encryption, and compliance.', difficulty: 'advanced', order: 5 },
  ],
  'system-design': [
    { title: 'System Design Fundamentals', slug: 'system-design-fundamentals', description: 'Scalability, reliability, and trade-offs in system design.', difficulty: 'beginner', order: 1 },
    { title: 'Load Balancing & Caching', slug: 'load-balancing-caching', description: 'Load balancers, CDNs, and caching strategies.', difficulty: 'intermediate', order: 2 },
    { title: 'Database Design Patterns', slug: 'database-patterns', description: 'Sharding, replication, and database partitioning.', difficulty: 'intermediate', order: 3 },
    { title: 'Microservices Architecture', slug: 'microservices-architecture', description: 'Service decomposition, communication, and orchestration.', difficulty: 'intermediate', order: 4 },
    { title: 'Design URL Shortener', slug: 'design-url-shortener', description: 'Designing a scalable URL shortening service.', difficulty: 'intermediate', order: 5 },
    { title: 'Design Chat System', slug: 'design-chat-system', description: 'Designing a real-time messaging system.', difficulty: 'intermediate', order: 6 },
    { title: 'Design Rate Limiter', slug: 'design-rate-limiter', description: 'Designing a distributed rate limiting system.', difficulty: 'intermediate', order: 7 },
    { title: 'Design News Feed', slug: 'design-news-feed', description: 'Designing a social media news feed system.', difficulty: 'advanced', order: 8 },
    { title: 'Design Distributed Database', slug: 'design-distributed-db', description: 'Designing a distributed key-value store.', difficulty: 'advanced', order: 9 },
    { title: 'CAP Theorem & Consistency', slug: 'cap-theorem', description: 'Understanding CAP theorem and consistency models.', difficulty: 'advanced', order: 10 },
  ],
  dsa: [
    { title: 'Arrays & Strings', slug: 'arrays-strings', description: 'Array manipulation, two pointers, sliding window, and string algorithms.', difficulty: 'beginner', order: 1 },
    { title: 'Linked Lists', slug: 'linked-lists', description: 'Singly, doubly, and circular linked lists operations.', difficulty: 'beginner', order: 2 },
    { title: 'Stacks & Queues', slug: 'stacks-queues', description: 'Stack and queue implementations and applications.', difficulty: 'beginner', order: 3 },
    { title: 'Hash Tables', slug: 'hash-tables', description: 'Hash maps, sets, and collision resolution strategies.', difficulty: 'intermediate', order: 4 },
    { title: 'Trees & Binary Search Trees', slug: 'trees-bst', description: 'Tree traversals, BST operations, and balanced trees.', difficulty: 'intermediate', order: 5 },
    { title: 'Heaps & Priority Queues', slug: 'heaps-priority-queues', description: 'Min/max heaps, heap sort, and priority queue applications.', difficulty: 'intermediate', order: 6 },
    { title: 'Graphs', slug: 'graphs', description: 'BFS, DFS, shortest path, and topological sort.', difficulty: 'intermediate', order: 7 },
    { title: 'Dynamic Programming', slug: 'dynamic-programming', description: 'Memoization, tabulation, and common DP patterns.', difficulty: 'advanced', order: 8 },
    { title: 'Greedy Algorithms', slug: 'greedy-algorithms', description: 'Greedy approach and optimization problems.', difficulty: 'advanced', order: 9 },
    { title: 'Recursion & Backtracking', slug: 'recursion-backtracking', description: 'Recursive problem-solving and backtracking algorithms.', difficulty: 'advanced', order: 10 },
    { title: 'Sorting & Searching', slug: 'sorting-searching', description: 'Comparison-based sorts, binary search, and search algorithms.', difficulty: 'intermediate', order: 11 },
    { title: 'Bit Manipulation', slug: 'bit-manipulation', description: 'Bitwise operators and common bit manipulation techniques.', difficulty: 'advanced', order: 12 },
  ],
}

async function main() {
  console.log('Seeding database...')

  for (const tech of technologies) {
    await prisma.technology.upsert({
      where: { slug: tech.slug },
      update: tech,
      create: tech,
    })
  }
  console.log('Technologies seeded')

  for (const [slug, topics] of Object.entries(topicTemplates)) {
    const tech = await prisma.technology.findUnique({ where: { slug } })
    if (!tech) continue
    for (const topic of topics) {
      await prisma.topic.upsert({
        where: { slug: topic.slug },
        update: {
          ...topic,
          category: tech.category,
          technologyId: tech.id,
          content: generateTopicContent({
            slug: topic.slug,
            title: topic.title,
            description: topic.description,
            difficulty: topic.difficulty,
            technologyName: tech.name,
            technologySlug: tech.slug,
            category: tech.category,
          }),
        },
        create: {
          ...topic,
          category: tech.category,
          technologyId: tech.id,
          content: generateTopicContent({
            slug: topic.slug,
            title: topic.title,
            description: topic.description,
            difficulty: topic.difficulty,
            technologyName: tech.name,
            technologySlug: tech.slug,
            category: tech.category,
          }),
        },
      })
    }
  }
  console.log('Topics seeded')

  for (const path of learningPaths) {
    const { technologies: techSlugs, ...pathData } = path
    const techs = await prisma.technology.findMany({
      where: { slug: { in: techSlugs } },
    })
    const techMap = new Map(techs.map((t) => [t.slug, t.id]))

    let topicCount = 0
    for (const slug of techSlugs) {
      const count = await prisma.topic.count({
        where: { technology: { slug } },
      })
      topicCount += count
    }

    const lp = await prisma.learningPath.upsert({
      where: { slug: pathData.slug },
      update: { ...pathData, topicCount },
      create: { ...pathData, topicCount },
    })

    for (let i = 0; i < techSlugs.length; i++) {
      const techId = techMap.get(techSlugs[i])
      if (techId) {
        await prisma.learningPathTechnology.upsert({
          where: {
            learningPathId_technologyId: {
              learningPathId: lp.id,
              technologyId: techId,
            },
          },
          update: { order: i },
          create: {
            learningPathId: lp.id,
            technologyId: techId,
            order: i,
          },
        })
      }
    }
  }
  console.log('Learning paths seeded')

  try {
    const Redis = (await import('ioredis')).default
    const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      retryStrategy: () => null,
    })
    redis.on('error', () => undefined)
    await redis.connect()
    const keys = await redis.keys('learning-path*')
    if (keys.length > 0) {
      await redis.del(...keys)
      console.log(`Cleared ${keys.length} cached learning path entries.`)
    }
    await redis.disconnect()
  } catch {
    console.log('Redis cache not cleared because Redis is unavailable.')
  }

  console.log('Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
