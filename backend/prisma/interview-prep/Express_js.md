<!--LANG:roman-->

<!--LANG:roman-->

# Express.js Interview Questions

## 1. What is Express.js and why is it used with Node.js?

**Asaan Urdu mein:**  
Express.js ek **lightweight** aur **unopinionated** web framework hai jo Node.js ke upar chalti hai. Ye raw HTTP module ki complex handling ko abstract kar ke routing, middleware aur response rendering ko asaan banata hai. Developers ko low‑level networking code ki fikr nahi hoti, sirf business logic likhne ka waqt milta hai. Is se APIs aur web servers jaldi aur kam code se ban jate hain.

---

## 2. What is middleware in Express and how does the next() function work?

**Asaan Urdu mein:**  
Middleware ek function hota hai jo `req`, `res` aur `next` tak access rakhta hai. Ye request ko modify kar sakta, koi logic chala sakta, response bhej sakta ya `next()` call karke agle middleware ko control de sakta hai. Agar `next()` na bulaya jaye to request hang ho jati hai. `next(err)` se error‑handling middleware ko trigger kiya jata hai. Middleware registration ke order ka bahut aham role hota hai.

---

## 3. What is the difference between application-level and router-level middleware?

**Asaan Urdu mein:**  
Application‑level middleware `app.use()` ya `app.METHOD()` ke through poore app par lagta hai, yani sab routes ko affect karta hai. Router‑level middleware `router.use()` ya `router.METHOD()` se specific router instance ke andar hi apply hota hai, is se feature‑wise modularity milti hai. Router‑level middleware sirf us router ke routes ko affect karta hai, baaki app ko untouched rehta hai.

---

## 4. How do you handle errors globally in an Express application?

**Asaan Urdu mein:**  
Express me global error handling ke liye **four‑parameter** middleware `(err, req, res, next)` define karte hain. Kisi bhi middleware ya route me `next(err)` call karne se ye error handler automatically execute hota hai. Async errors ko catch karne ke liye `express-async-errors` ya manual `try/catch` + `next(err)` istemal karte hain. Error handler ko stack ke **last** me rakhna zaroori hota hai.

```javascript
const express = require('express');
const app = express();
require('express-async-errors');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Example route
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) throw new AppError('User not found', 404);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// 404 handler
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  console.error(`[Error] ${status}: ${err.message}`);
  res.status(status).json({
    success: false,
    error: err.isOperational ? err.message : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(3000);
```

---

## 5. What is the purpose of express.Router()?

**Asaan Urdu mein:**  
`express.Router()` ek **modular** aur **mountable** route handler create karta hai jo related routes ko ek group me rakhta hai. Har router apna middleware, parameters aur error handling define kar sakta hai. Ye routers `app.use()` ke through main app me mount kiye jate hain, jis se feature‑wise separation aur code organization behtar hoti hai.

```javascript
const express = require('express');
const app = express();
const productRouter = express.Router();

productRouter.use((req, res, next) => {
  console.log(`[Products] ${req.method} ${req.url}`);
  next();
});

productRouter.get('/', (req, res) => {
  res.json({ products: ['Laptop', 'Phone'] });
});

productRouter.get('/:id', (req, res) => {
  res.json({ productId: req.params.id });
});

app.use('/products', productRouter);
app.listen(3000);
```

---

## 6. How do you implement route parameters and query parameters in Express?

**Asaan Urdu mein:**  
Route parameters `:param` ko URL path me define karte hain aur `req.params` se access karte hain (e.g., `/users/:id`). Query parameters `?key=value` URL ke end me hote hain aur `req.query` se milte hain. Route params usually required identifiers ke liye, jabke query params optional filtering, sorting ya pagination ke liye use hote hain. Validation aur default values bhi dono tarah se set ki ja sakti hain.

```javascript
const express = require('express');
const app = express();

app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ message: `Fetching user ${userId}` });
});

app.get('/api/users', (req, res) => {
  const { page = 1, limit = 10, sort = 'createdAt' } = req.query;
  res.json({ page, limit, sort });
});

app.listen(3000);
```

---

## 7. What is CORS and how do you enable it in Express?

**Asaan Urdu mein:**  
CORS (Cross‑Origin Resource Sharing) ek security mechanism hai jo browser ko batata hai ke kaunse origins server ke resources ko access kar sakte hain. Express me `cors` package ka middleware use karke allowed origins, methods, headers aur credentials configure karte hain. Agar CORS enable na kiya jaye to browsers cross‑origin AJAX requests ko block kar dete hain.

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

const corsOptions = {
  origin: ['https://myapp.com', 'https://admin.myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  maxAge: 86400
};

app.use(cors(corsOptions));

app.get('/api/public', cors(), (req, res) => {
  res.json({ message: 'Open to all origins' });
});

app.get('/api/restricted', (req, res, next) => {
  const whitelist = ['https://myapp.com'];
  const origin = req.headers.origin;
  if (whitelist.includes(origin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    next();
  } else {
    res.status(403).json({ error: 'Not allowed by CORS' });
  }
});

app.listen(3000);
```

---

## 8. How would you structure a large Express application (MVC pattern)?

**Asaan Urdu mein:**  
MVC pattern me **Models** data layer, **Views** presentation (usually templating), aur **Controllers** request‑response logic ko separate karta hai. Express projects me `controllers`, `models`, `routes`, `middleware`, `services` aur `config` folders banate hain. Har feature (e.g., users, products) apna module folder rakhta hai jisme controller, service, model, route aur validation hoti hain. `app.js` sirf middleware aur router mounting handle karta hai, is se code maintainable aur scalable banta hai.

```javascript
// Project structure (simplified)
project/
├── src/
│   ├── config/
│   ├── middleware/
│   ├── modules/
│   │   ├── users/
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js
│   │   │   ├── user.model.js
│   │   │   └── user.routes.js
│   │   └── products/...
│   └── app.js
├── server.js
└── package.json

// src/app.js
const express = require('express');
const userRoutes = require('./modules/users/user.routes');
const productRoutes = require('./modules/products/product.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use(errorHandler);
module.exports = app;
```

---

## 9. What is the difference between app.use() and app.get()/app.post()?

**Asaan Urdu mein:**  
`app.use()` **middleware** ko mount karta hai jo specified path ke liye **sabhi HTTP methods** (GET, POST, PUT, DELETE, etc.) par run hota hai. `app.get()`, `app.post()` etc. sirf us particular method ke liye route handler define karte hain. Middleware jaise logging, authentication, body‑parsing ke liye `app.use()` use hota hai, jabke specific CRUD operations ke liye method‑specific functions istemal hote hain.

| Feature                | `app.use()`                              | `app.get()/app.post()`                |
|------------------------|------------------------------------------|---------------------------------------|
| Matches                | All HTTP verbs (GET, POST, …)           | Only the specified verb               |
| Typical use            | Logging, auth, body parsing, static files | CRUD route handlers                  |
| Path matching          | Prefix match (`/api` matches `/api/users`) | Exact match (`/api/users` only)      |

---

## 10. How do you validate request bodies in Express (e.g., with Joi or express-validator)?

**Asaan Urdu mein:**  
Validation ke liye **express-validator** ya **Joi** jaise libraries ka middleware use karte hain. Pehle schema ya rule define karte hain, phir request aane par usko validate karte hain. Agar validation fail ho jaye to 400 Bad Request ke sath error messages bhejte hain, is se malformed data business logic tak nahi pahunchta. Joi schema ko `req.body` ke sath replace karke sanitized data bhi mil jata hai.

```javascript
const express = require('express');
const { body, validationResult } = require('express-validator');
const Joi = require('joi');
const app = express();

app.use(express.json());

// express-validator example
const userRules = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password min 8 chars')
];
app.post('/users/ev', userRules, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.json({ success: true, data: req.body });
});

// Joi example
const schema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required()
});
app.post('/users/joi', (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details });
  }
  req.body = value;
  next();
}, (req, res) => {
  res.json({ success: true, data: req.body });
});

app.listen(3000);
```

---

## 11. How do you implement authentication middleware in Express?

**Asaan Urdu mein:**  
Authentication middleware request ke `Authorization` header se JWT ya token nikalta hai, usko verify karta hai, aur decoded user info ko `req.user` me attach karta hai. Agar token missing ya invalid ho to 401 Unauthorized response bhejta hai. Authorization middleware `req.user.role` check karke specific permissions enforce karta hai. JWT verification ke liye `jsonwebtoken` library ka istemal hota hai.

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
app.use(express.json());

const SECRET = process.env.JWT_SECRET || 'secret';

// Authentication middleware
function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token' });
  }
  const token = auth.split(' ')[1];
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Authorization middleware
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthenticated' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

// Register & login routes (simplified)
app.post('/auth/register', async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  // Save user ... (omitted)
  res.status(201).json({ message: 'User created' });
});

app.post('/auth/login', async (req, res) => {
  // Validate credentials ... (omitted)
  const token = jwt.sign({ id: 1, role: 'user' }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Protected routes
app.get('/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});

app.get('/admin', authenticate, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin area' });
});

app.listen(3000);
```

---

## 12. What is the difference between synchronous and asynchronous error handling in Express middleware?

**Asaan Urdu mein:**  
Synchronous errors (throw ya `next(err)`) automatically Express ke error‑handling middleware tak pahunch jate hain. Asynchronous errors (Promises, async/await) ko manually `next(err)` se forward karna padta hai, warna unka rejection unhandled rehta hai. `express-async-errors` package ya custom `catchAsync` wrapper in async errors ko automatically catch kar leta hai, is se code clean rehta hai.

```javascript
const express = require('express');
require('express-async-errors');
const app = express();

// Sync error (auto caught)
app.get('/sync', (req, res) => {
  throw new Error('Sync error');
});

// Async error (auto caught by package)
app.get('/async', async (req, res) => {
  await Promise.reject(new Error('Async error'));
});

// Manual wrapper alternative
const catchAsync = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/wrapped', catchAsync(async (req, res) => {
  await Promise.reject(new Error('Wrapped async error'));
}));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ message: err.message });
});

app.listen(3000);
```

---

## 13. How do you serve static files in Express?

**Asaan Urdu mein:**  
Static files serve karne ke liye `express.static()` middleware use hota hai. Ye ek folder ko URL path ke sath map karta hai, jisse images, CSS, JS files directly browser ko mil jati hain. Multiple folders, custom URL prefixes aur cache control options bhi set kiye ja sakte hain. Production me Nginx jaise reverse proxy se static serving zyada efficient hoti hai.

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Serve 'public' at root
app.use(express.static('public'));

// Serve 'uploads' under /files
app.use('/files', express.static('uploads'));

// Custom options
app.use('/static', express.static('public', {
  dotfiles: 'ignore',
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.pdf')) res.setHeader('Content-Disposition', 'inline');
  }
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000);
```

---

## 14. What is rate limiting and how would you implement it in Express?

**Asaan Urdu mein:**  
Rate limiting ek client ko ek specific time window me limited requests bhejne ki ijazat deta hai, jisse brute‑force attacks aur API abuse roka jata hai. `express-rate-limit` package se IP ya custom key ke basis par limits set ki jati hain. Distributed environments ke liye Redis store use kiya jata hai, taki multiple server instances me limit sync rahe.

```javascript
const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();

// Global limiter: 100 req / 15 min
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests' }
}));

// Strict limiter for login
app.use('/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: req => `${req.ip}-${req.body.email || ''}`,
  message: { error: 'Login attempts exceeded' }
}));

app.get('/', (req, res) => res.send('Home'));
app.listen(3000);
```

---

## 15. How do you handle file uploads in Express (e.g., multer)?

**Asaan Urdu mein:**  
File uploads ke liye **multer** middleware use hota hai jo `multipart/form-data` ko parse karta hai. Disk storage me files ko folder me save kiya ja sakta hai, ya memory storage me buffer ke roop me cloud services ko directly bheja ja sakta hai. Multer file size, type aur count ki validation bhi support karta hai, aur errors ko custom handler se manage kiya jata hai.

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${unique}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    cb(null, allowed.includes(file.mimetype));
  }
});

app.post('/upload/single', upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ file: req.file });
});

app.post('/upload/multiple', upload.array('photos', 5), (req, res) => {
  res.json({ files: req.files });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  if (err) return res.status(400).json({ error: err.message });
  next();
});

app.listen(3000);
```

---

## 16. What is the purpose of helmet.js in an Express app?

**Asaan Urdu mein:**  
`helmet` ek security middleware collection hai jo automatically **HTTP headers** set karta hai, jaise `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Content-Security-Policy` etc. Ye headers common web vulnerabilities (XSS, clickjacking, MIME sniffing) se bachav karte hain. Default configuration kaafi secure hoti hai, aur zaroorat ke mutabiq individual headers customize kiye ja sakte hain.

```javascript
const express = require('express');
const helmet = require('helmet');
const app = express();

app.use(helmet()); // Default secure headers

// Custom CSP example
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'cdn.example.com'],
      imgSrc: ["'self'", 'data:']
    }
  }
}));

app.get('/', (req, res) => {
  res.send('Helmet active – check response headers');
});

app.listen(3000);
```

---

## 17. How do you set up logging in an Express application (e.g., morgan, winston)?

**Asaan Urdu mein:**  
Logging ke liye **morgan** HTTP request logs ke liye aur **winston** application‑level logs ke liye use hota hai. Morgan ko console ya file stream ke sath configure kiya jata hai, jabke Winston multiple transports (console, file, external services) aur log levels (info, error, debug) support karta hai. Morgan ka output Winston ke stream me pipe karke centralized logging milti hai.

```javascript
const express = require('express');
const morgan = require('morgan');
const winston = require('winston');
const fs = require('fs');
const path = require('path');
const app = express();

// Winston setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
  ]
});

// Morgan to console
app.use(morgan('dev'));

// Morgan to Winston
app.use(morgan('combined', {
  stream: { write: msg => logger.info(msg.trim()) }
}));

app.get('/', (req, res) => {
  logger.info('Home accessed');
  res.send('Logging demo');
});

app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ error: 'Server error' });
});

app.listen(3000);
```

---

## 18. How would you implement pagination in an Express REST API?

**Asaan Urdu mein:**  
Pagination ke liye `page` aur `limit` query parameters lete hain, `skip = (page‑1) * limit` calculate karte hain, aur database query me `skip`/`limit` apply karte hain. Response me total records, total pages, current page aur next/prev links bhi bhejte hain. Cursor‑based pagination large datasets ke liye efficient hoti hai.

```javascript
const express = require('express');
const app = express();

const users = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`
}));

app.get('/api/users', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  const results = users.slice(skip, skip + limit);
  const total = users.length;
  const totalPages = Math.ceil(total / limit);

  res.json({
    data: results,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      next: page < totalPages ? `/api/users?page=${page + 1}&limit=${limit}` : null,
      prev: page > 1 ? `/api/users?page=${page - 1}&limit=${limit}` : null
    }
  });
});

app.listen(3000);
```

---

## 19. What is the difference between res.send(), res.json(), and res.end()?

**Asaan Urdu mein:**  
`res.send()` data type ke hisaab se **Content‑Type** automatically set karta hai (string → text/html, object/array → application/json, Buffer → octet‑stream). `res.json()` hamesha data ko **JSON** stringify karta hai aur `application/json` header set karta hai. `res.end()` sirf response ko **close** karta hai, optional raw data bhej sakta hai, lekin koi header auto set nahi hoti. Is liye `res.send()` aur `res.json()` zyada convenient hain.

---

## 20. How do you handle environment-specific configuration in Express apps?

**Asaan Urdu mein:**  
`NODE_ENV` variable ke through **development**, **staging**, **production**, ya **test** environments ko differentiate karte hain. Ek central `config` module har environment ke liye alag settings (port, DB URL, log level, CORS origin, JWT secret) define karta hai. Development me `.env` files se values load karte hain, production me environment variables ya secret managers se. Configuration ko app ke start me load karke globally use karte hain.

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const config = {
  development: { port: 3000, corsOrigin: '*', jwtSecret: 'dev-secret' },
  production: { port: process.env.PORT, corsOrigin: 'https://myapp.com', jwtSecret: process.env.JWT_SECRET }
};

const env = process.env.NODE_ENV || 'development';
const cfg = config[env];

const app = express();
app.use(cors({ origin: cfg.corsOrigin, credentials: true }));

app.get('/config', (req, res) => {
  res.json({ environment: env, port: cfg.port });
});

if (env !== 'test') {
  app.listen(cfg.port, () => console.log(`Running ${env} on ${cfg.port}`));
}

module.exports = app;
```

---

<!--LANG:english-->

# Express.js Interview Questions

## 1. What is Express.js and why is it used with Node.js?

Express.js is a lightweight, unopinionated web application framework for Node.js that simplifies building web servers and APIs. It provides a robust set of features for request handling, middleware integration, routing, and template rendering. Express abstracts away Node.js's raw HTTP module complexities, allowing developers to focus on application logic rather than low-level networking code.

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// Minimal Express server
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]);
});

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

// Without Express (raw Node.js):
// const http = require('http');
// http.createServer((req, res) => {
//   if (req.url === '/' && req.method === 'GET') {
//     res.end('Hello from raw Node.js!');
//   }
// }).listen(3001);
```

---

## 2. What is middleware in Express and how does the next() function work?

Middleware is a function with access to `req`, `res`, and `next`. It can execute code, modify `req`/`res`, end the response, or call `next()` to pass control to the next middleware in the pipeline. If `next()` is never called, the request hangs. If an error is passed to `next(err)`, Express skips to the error-handling middleware. Middleware runs in the order it is registered.

```javascript
const express = require('express');
const app = express();

// Custom middleware — logs each request
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Pass to the next middleware
};

// Middleware that adds a custom property
const addTimestamp = (req, res, next) => {
  req.requestTime = Date.now();
  next();
};

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token === 'Bearer valid-token') {
    req.user = { id: 1, role: 'admin' };
    next();
  } else {
    next(new Error('Authentication failed')); // Skips to error handler
  }
};

// Register middleware (order matters!)
app.use(logger);
app.use(addTimestamp);

app.get('/', (req, res) => {
  res.json({
    message: 'Home page',
    requestTime: req.requestTime
  });
});

app.get('/protected', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Error-handling middleware (4 parameters)
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(401).json({ error: err.message });
});

app.listen(3000);
```

---

## 3. What is the difference between application-level and router-level middleware?

Application-level middleware is bound to the `app` instance via `app.use()` or `app.METHOD()`, affecting all routes. Router-level middleware is bound to a `Router` instance via `router.use()` or `router.METHOD()`, scoping middleware to a specific set of routes. Router-level middleware allows modular organization — each router handles its own middleware stack without affecting other parts of the application.

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// --- Application-level middleware (applies to ALL routes) ---
app.use(express.json()); // Parses JSON bodies for every route
app.use(express.static('public')); // Serves static files globally

app.use((req, res, next) => {
  console.log(`[App] Global: ${req.method} ${req.url}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// --- Router-level middleware (scoped to specific routes) ---
const userRouter = express.Router();

// Middleware only for /users routes
userRouter.use((req, res, next) => {
  console.log(`[User Router] Processing user request`);
  req.userContext = { timestamp: Date.now() };
  next();
});

userRouter.get('/', (req, res) => {
  res.json({ users: ['Alice', 'Bob'], context: req.userContext });
});

userRouter.get('/:id', (req, res) => {
  res.json({ userId: req.params.id, context: req.userContext });
});

const adminRouter = express.Router();

adminRouter.use((req, res, next) => {
  console.log(`[Admin Router] Admin-specific middleware`);
  if (req.headers['x-admin-key'] !== 'secret') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});

adminRouter.get('/dashboard', (req, res) => {
  res.json({ dashboard: 'admin data' });
});

// Mount routers
app.use('/users', userRouter);
app.use('/admin', adminRouter);

app.listen(PORT);
```

---

## 4. How do you handle errors globally in an Express application?

Express error-handling middleware is defined with four parameters `(err, req, res, next)`. When any middleware calls `next(err)`, Express skips all regular middleware and goes directly to error-handling middleware. It's important to define the error handler last in the middleware stack. Async error handling requires wrapping or using a library like `express-async-errors` to catch promise rejections.

```javascript
const express = require('express');
const app = express();

// To handle async errors without wrapping
require('express-async-errors');

// Simulated services
class UserService {
  async findById(id) {
    if (id === '404') throw new Error('User not found');
    if (id === '500') throw new Error('Database error');
    return { id: 1, name: 'Alice' };
  }
}

const userService = new UserService();

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Routes
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    res.json(user);
  } catch (err) {
    next(err); // Pass to error handler
  }
});

// Sync route error
app.get('/error', (req, res) => {
  throw new AppError('Forced error', 500);
});

// 404 handler for unknown routes
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Global error handler (must be last with 4 params)
app.use((err, req, res, next) => {
  // Determine status code
  const statusCode = err.statusCode || 500;

  // Log for debugging
  console.error(`[Error] ${statusCode}: ${err.message}`);

  res.status(statusCode).json({
    success: false,
    error: err.isOperational ? err.message : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(3000);
```

---

## 5. What is the purpose of express.Router()?

`express.Router()` creates a modular, mountable route handler that groups related routes into a single mini-application. Routers can have their own middleware, parameters, and error handling. They are mounted on the main app using `app.use()`, allowing clean separation by feature or resource (e.g., user routes, product routes, admin routes).

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// --- Product Router ---
const productRouter = express.Router();

// Middleware specific to products
productRouter.use((req, res, next) => {
  console.log(`[Products] ${req.method} /products${req.url}`);
  next();
});

productRouter.get('/', (req, res) => {
  res.json({ products: ['Laptop', 'Phone', 'Tablet'] });
});

productRouter.get('/:id', (req, res) => {
  res.json({ product: { id: req.params.id, name: 'Product ' + req.params.id } });
});

productRouter.post('/', (req, res) => {
  res.status(201).json({ message: 'Product created', product: req.body });
});

// --- Order Router ---
const orderRouter = express.Router();

orderRouter.get('/', (req, res) => {
  res.json({ orders: ['Order1', 'Order2'] });
});

orderRouter.post('/', (req, res) => {
  res.status(201).json({ message: 'Order placed' });
});

// --- Mount routers on the app ---
app.use('/products', productRouter);
app.use('/orders', orderRouter);

// --- Nested router example ---
const reviewRouter = express.Router({ mergeParams: true });
reviewRouter.get('/', (req, res) => {
  res.json({ reviews: [`Reviews for product ${req.params.productId}`] });
});

productRouter.use('/:productId/reviews', reviewRouter);

app.listen(PORT);
```

---

## 6. How do you implement route parameters and query parameters in Express?

Route parameters are defined with `:paramName` in the route path, accessed via `req.params`. They match specific path segments. Query parameters follow the `?key=value` syntax in the URL and are accessed via `req.query`. Both can have default values and validation. Route params are for required identifiers, while query params are for optional filtering, sorting, and pagination.

```javascript
const express = require('express');
const app = express();

// --- ROUTE PARAMETERS ---
// URL: /users/123
// req.params = { id: '123' }
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ message: `Fetching user ${userId}`, params: req.params });
});

// Multiple route parameters
// URL: /posts/2024/06/post-title
app.get('/posts/:year/:month/:slug', (req, res) => {
  res.json({
    year: req.params.year,
    month: req.params.month,
    slug: req.params.slug
  });
});

// --- QUERY PARAMETERS ---
// URL: /api/users?page=2&limit=10&sort=name&role=admin
app.get('/api/users', (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'desc',
    role,
    search
  } = req.query;

  // Build filter object
  const filter = {};
  if (role) filter.role = role;
  if (search) filter.name = { $regex: search, $options: 'i' };

  res.json({
    params: req.params,
    query: req.query,
    parsed: {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: `${sort}:${order}`,
      filter
    }
  });
});

// --- ROUTE PARAM VALIDATION with regex ---
app.get('/products/:id(\\d+)', (req, res) => {
  res.json({ productId: parseInt(req.params.id) });
});

// Optional route param
app.get('/books/:title?', (req, res) => {
  if (req.params.title) {
    res.json({ book: req.params.title });
  } else {
    res.json({ books: ['Book1', 'Book2'] });
  }
});

app.listen(3000);
```

---

## 7. What is CORS and how do you enable it in Express?

CORS (Cross-Origin Resource Sharing) is a security mechanism that controls which origins (domains) can access server resources from a browser. Express enables CORS using the `cors` middleware package, allowing configuration of allowed origins, methods, headers, and credentials. Without CORS, browsers block cross-origin requests from JavaScript (the same-origin policy).

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// --- OPTION 1: Allow all origins (not for production) ---
// app.use(cors());

// --- OPTION 2: Allow specific origin(s) ---
const corsOptions = {
  origin: ['https://myapp.com', 'https://admin.myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies/auth headers
  maxAge: 86400       // Cache preflight for 24 hours
};

app.use(cors(corsOptions));

// --- OPTION 3: Dynamic origin based on request ---
const dynamicCors = cors({
  origin: (origin, callback) => {
    const whitelist = ['https://myapp.com', 'https://staging.myapp.com'];

    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
});

app.get('/api/public', cors(), (req, res) => {
  res.json({ message: 'Public endpoint — open to all origins' });
});

app.get('/api/restricted', dynamicCors, (req, res) => {
  res.json({ message: 'Restricted endpoint' });
});

// --- Manual CORS headers (without cors package) ---
app.get('/api/manual', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://myapp.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.json({ message: 'Manual CORS headers' });
});

// Handle preflight OPTIONS request
app.options('/api/manual', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://myapp.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.status(204).end();
});

app.listen(3000);
```

---

## 8. How would you structure a large Express application (MVC pattern)?

A large Express app is structured following MVC (Model-View-Controller) with separation into `controllers` (route handlers), `models` (data logic), `routes` (URL definitions), `middleware` (reusable functions), `services` (business logic), and `config` (configuration). Routes are kept thin, controllers handle request/response, services contain business logic, and models handle data access. Each feature is grouped into its own directory module.

```javascript
// --- Project Structure ---
/*
project/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── env.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── modules/
│   │   ├── users/
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js
│   │   │   ├── user.model.js
│   │   │   ├── user.routes.js
│   │   │   └── user.validation.js
│   │   └── products/
│   │       ├── product.controller.js
│   │       ├── product.service.js
│   │       ├── product.model.js
│   │       ├── product.routes.js
│   │       └── product.validation.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   └── catchAsync.js
│   └── app.js
├── server.js
└── package.json
*/

// --- src/app.js ---
const express = require('express');
const userRoutes = require('./modules/users/user.routes');
const productRoutes = require('./modules/products/product.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use(errorHandler);

module.exports = app;

// --- src/modules/users/user.controller.js ---
const userService = require('./user.service');

exports.getAll = async (req, res, next) => {
  try {
    const users = await userService.findAll(req.query);
    res.json({ success: true, data: users, count: users.length });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// --- src/modules/users/user.service.js ---
const User = require('./user.model');

exports.findAll = async (query) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = query;
  return User.find()
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));
};

exports.findById = async (id) => {
  return User.findById(id);
};

// --- src/modules/users/user.routes.js ---
const router = require('express').Router();
const userController = require('./user.controller');
const auth = require('../../middleware/auth');

router.get('/', auth('admin'), userController.getAll);
router.get('/:id', auth(), userController.getById);

module.exports = router;

// --- src/middleware/auth.js ---
module.exports = (role) => {
  return (req, res, next) => {
    // Auth logic
    next();
  };
};

// --- src/middleware/errorHandler.js ---
module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
};

// --- server.js ---
const app = require('./src/app');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## 9. What is the difference between app.use() and app.get()/app.post()?

`app.use()` mounts middleware functions that run for every HTTP method on the specified path (or all paths if no path is given). `app.get()`, `app.post()`, `app.put()`, `app.delete()` mount route handlers that only match a specific HTTP method. `app.use()` is for middleware (logging, auth, parsing) while the method-specific functions are for route handlers.

```javascript
const express = require('express');
const app = express();

// app.use() — matches ALL HTTP methods
app.use('/api', (req, res, next) => {
  console.log(`[Middleware] ${req.method} /api${req.url}`);
  next();
});

app.use(express.json()); // Parses JSON for ALL methods

// app.get() — matches only GET requests
app.get('/api/users', (req, res) => {
  res.json({ users: ['Alice', 'Bob'] });
});

// app.post() — matches only POST requests
app.post('/api/users', (req, res) => {
  res.status(201).json({ created: req.body });
});

// app.put() — matches only PUT requests
app.put('/api/users/:id', (req, res) => {
  res.json({ updated: req.params.id, data: req.body });
});

// app.delete() — matches only DELETE requests
app.delete('/api/users/:id', (req, res) => {
  res.json({ deleted: req.params.id });
});

// app.use() with path prefix catches ALL verbs at that path
// GET /api/users -> user middleware runs -> user get handler runs
// POST /api/users -> user middleware runs -> user post handler runs
// GET /api/products -> user middleware does NOT run (prefix /api matches, but /api/products doesn't have a GET handler here)

// Important: app.use('/path') matches any URL starting with /path
// app.get('/path') matches exactly /path
app.use('/test', (req, res) => {
  res.send('Matched by app.use — any method at /test, /test/foo, etc.');
});

app.get('/test', (req, res) => {
  res.send('Matched by app.get — only GET at exactly /test');
});

// Response behavior: app.use('/test') will catch GET /test/foo
// app.get('/test') will NOT catch GET /test/foo

app.listen(3000);
```

---

## 10. How do you validate request bodies in Express (e.g., with Joi or express-validator)?

Request validation is done using packages like Joi, express-validator, or Zod. Validation middleware checks `req.body`, `req.params`, and `req.query` against a schema before the route handler runs. If validation fails, middleware returns a 400 error with descriptive messages. This ensures data integrity and prevents malformed input from reaching business logic.

```javascript
const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Joi = require('joi');
const app = express();

app.use(express.json());

// --- express-validator approach ---
const userValidationRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  body('age')
    .optional()
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be between 0 and 150'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must have uppercase, lowercase, and number'),
  body('role')
    .isIn(['user', 'admin', 'moderator'])
    .withMessage('Invalid role')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(e => ({
        field: e.path,
        message: e.msg
      }))
    });
  }
  next();
};

app.post('/users/express-validator', userValidationRules, validate, (req, res) => {
  res.json({ success: true, user: req.body });
});

// --- Joi approach ---
const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(0).max(150).optional(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain uppercase, lowercase, and number'
    }),
  role: Joi.string().valid('user', 'admin', 'moderator').default('user')
});

const validateJoi = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }

    req.body = value; // Use sanitized values
    next();
  };
};

app.post('/users/joi', validateJoi(userSchema), (req, res) => {
  res.json({ success: true, user: req.body });
});

// --- Param and Query validation ---
app.get('/products/:id',
  param('id').isMongoId().withMessage('Invalid product ID'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive integer'),
  validate,
  (req, res) => {
    res.json({ productId: req.params.id, page: req.query.page || 1 });
  }
);

app.listen(3000);
```

---

## 11. How do you implement authentication middleware in Express?

Authentication middleware validates credentials (usually a JWT or session token) from the request headers, decodes/verifies it, attaches the user to `req.user`, and calls `next()`. If authentication fails, the middleware returns 401. Authentication can be combined with authorization to check user roles/permissions. Common strategies include JWT, session-based auth with Passport.js, and API keys.

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

const SECRET = process.env.JWT_SECRET || 'your-secret-key';
const users = []; // In-memory store for demo

// --- AUTHENTICATION MIDDLEWARE ---
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// --- AUTHORIZATION MIDDLEWARE ---
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// --- ROUTES ---
// Register
app.post('/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: users.length + 1,
    email,
    name,
    password: hashedPassword,
    role: 'user'
  };
  users.push(user);

  res.status(201).json({ message: 'User created', userId: user.id });
});

// Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token, expiresIn: 3600 });
});

// Protected routes
app.get('/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});

app.get('/admin/dashboard', authenticate, authorize('admin'), (req, res) => {
  res.json({ message: 'Welcome admin!', data: { users, stats: {} } });
});

app.get('/moderator/data', authenticate, authorize('admin', 'moderator'), (req, res) => {
  res.json({ message: 'Moderator access granted' });
});

app.listen(3000);
```

---

## 12. What is the difference between synchronous and asynchronous error handling in Express middleware?

Synchronous errors thrown in route handlers or middleware are caught automatically by Express and passed to the error handler. Asynchronous errors (from promises or callbacks) must be explicitly forwarded using `next(err)` — otherwise they result in unhandled promise rejections. Modern Express apps use `express-async-errors` or a wrapper function to automatically catch async errors.

```javascript
const express = require('express');
const app = express();

require('express-async-errors'); // Auto-catches async errors

// --- SYNCHRONOUS ERROR HANDLING ---
// These are automatically caught by Express
app.get('/sync-error', (req, res) => {
  throw new Error('Sync error — Express catches this automatically');
});

app.get('/sync-error-next', (req, res, next) => {
  const err = new Error('Sync error via next()');
  err.statusCode = 400;
  next(err);
});

// --- ASYNCHRONOUS ERROR HANDLING ---
// Without express-async-errors, these need explicit next()

// WRONG — unhandled promise rejection
app.get('/async-wrong', async (req, res) => {
  // If this rejects, Express won't catch it without express-async-errors
  await someAsyncFunction(); // Potential unhandled rejection
});

// RIGHT — with express-async-errors
app.get('/async-right-with-pkg', async (req, res) => {
  await someRejectingFunction();
  res.json({ ok: true });
});

// Manual wrapper (alternative to express-async-errors)
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

app.get('/async-catch-async', catchAsync(async (req, res) => {
  await someRejectingFunction();
  res.json({ ok: true });
}));

// --- Callback-based async errors ---
app.get('/callback-error', (req, res, next) => {
  require('fs').readFile('/nonexistent', (err, data) => {
    if (err) return next(err); // Must explicitly forward
    res.send(data);
  });
});

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  res.status(err.statusCode || 500).json({
    error: {
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

function someRejectingFunction() {
  return Promise.reject(new Error('Async operation failed'));
}

app.listen(3000);
```

---

## 13. How do you serve static files in Express?

Express serves static files using the `express.static()` middleware, which maps a directory on disk to a URL path. You can serve multiple directories, set cache control headers, and disable directory listing. Files in the static directory are accessed directly by their filename. For production, static files should be served by a reverse proxy like Nginx for better performance.

```javascript
const express = require('express');
const path = require('path');
const app = express();

// --- Basic static file serving ---
// All files in 'public' are served at the root URL
// e.g., public/image.jpg -> /image.jpg
app.use(express.static('public'));

// --- Static files with a URL prefix ---
// Files in 'uploads' are served under /files
// e.g., uploads/report.pdf -> /files/report.pdf
app.use('/files', express.static('uploads'));

// --- Multiple static directories ---
// If the same filename exists in both, the first one wins
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'assets')));

// --- With custom options ---
const staticOptions = {
  dotfiles: 'ignore',    // Do not serve dotfiles
  etag: true,            // Enable ETag for caching
  maxAge: '1d',          // Cache-Control max-age
  setHeaders: (res, path) => {
    // Set custom headers for specific file types
    if (path.endsWith('.wasm')) {
      res.setHeader('Content-Type', 'application/wasm');
    }
    if (path.endsWith('.pdf')) {
      res.setHeader('Content-Disposition', 'inline');
    }
  }
};

app.use('/static', express.static('public', staticOptions));

// --- Serve index.html at root ---
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Download file instead of displaying ---
app.get('/download/:file', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.file);
  res.download(filePath, (err) => {
    if (err) {
      res.status(404).json({ error: 'File not found' });
    }
  });
});

// Directory structure:
// project/
// ├── public/
// │   ├── index.html
// │   ├── style.css
// │   └── images/
// │       └── logo.png
// ├── uploads/
// │   └── report.pdf
// └── app.js

app.listen(3000);
```

---

## 14. What is rate limiting and how would you implement it in Express?

Rate limiting restricts the number of requests a client can make within a time window to protect against abuse, brute-force attacks, and API overuse. It's implemented using the `express-rate-limit` package, which tracks requests by IP (or custom key) and returns 429 Too Many Requests when the limit is exceeded. Advanced setups use Redis for distributed rate limiting across multiple server instances.

```javascript
const express = require('express');
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');
const app = express();

// --- Basic rate limiter (in-memory) ---
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // Limit each IP to 100 requests per window
  standardHeaders: true,     // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,      // Disable X-RateLimit-* headers
  message: {
    error: 'Too many requests, please try again later',
    retryAfter: '15 minutes'
  }
});

app.use(globalLimiter);

// --- Strict limiter for auth endpoints ---
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: false,
  message: { error: 'Too many login attempts, account locked for 15 minutes' },
  keyGenerator: (req) => {
    // Rate limit by IP and username combination
    return `${req.ip}-${req.body?.email || 'unknown'}`;
  }
});

app.use('/auth/login', authLimiter);

// --- API endpoint rate limiter ---
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  message: { error: 'API rate limit exceeded' }
});

app.use('/api', apiLimiter);

// --- Redis-backed rate limiter (for distributed apps) ---
// npm install rate-limit-redis ioredis
/*
const redisClient = new Redis();
const redisLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(redisLimiter);
*/

// --- Custom rate limit handler ---
const customHandler = (req, res, next, options) => {
  res.status(429).json({
    error: 'Rate limit exceeded',
    retryAfter: Math.ceil(options.windowMs / 1000) + ' seconds'
  });
};

const customLimiter = rateLimit({
  windowMs: 60000,
  max: 10,
  handler: customHandler
});

app.use('/critical', customLimiter);

app.get('/', (req, res) => res.json({ message: 'Welcome' }));
app.get('/api/data', (req, res) => res.json({ data: 'sensitive data' }));

app.listen(3000);
```

---

## 15. How do you handle file uploads in Express (e.g., multer)?

File uploads in Express are handled using the `multer` middleware, which parses `multipart/form-data` requests. Multer can store files on disk, in memory as buffers, or stream directly to cloud storage. It handles file validation (size, type), renaming, and error handling. Multiple files, single files, and mixed fields are all supported.

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());

// --- Disk storage configuration ---
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// --- File filter for type validation ---
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

const upload = multer({
  storage: diskStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5                    // Max 5 files
  },
  fileFilter
});

// --- Single file upload ---
app.post('/upload/single', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({
    message: 'File uploaded successfully',
    file: {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path
    },
    body: req.body
  });
});

// --- Multiple files upload ---
app.post('/upload/multiple', upload.array('photos', 5), (req, res) => {
  res.json({
    message: `${req.files.length} files uploaded`,
    files: req.files.map(f => ({
      filename: f.filename,
      size: f.size,
      type: f.mimetype
    }))
  });
});

// --- Multiple fields ---
app.post('/upload/fields', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'gallery', maxCount: 3 },
  { name: 'document', maxCount: 1 }
]), (req, res) => {
  res.json({
    avatar: req.files['avatar']?.[0]?.filename,
    gallery: req.files['gallery']?.map(f => f.filename),
    document: req.files['document']?.[0]?.filename
  });
});

// --- Memory storage (for cloud uploads) ---
const memoryStorage = multer.memoryStorage();
const uploadMemory = multer({ storage: memoryStorage });

app.post('/upload/memory', uploadMemory.single('file'), async (req, res) => {
  // req.file.buffer contains the file in memory
  // Upload to S3, Cloudinary, etc.
  // await s3.upload({ Body: req.file.buffer, Key: req.file.originalname });

  res.json({
    message: 'File processed in memory',
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});

// --- Error handling for multer errors ---
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large (max 5MB)' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files' });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

app.listen(3000);
```

---

## 16. What is the purpose of helmet.js in an Express app?

Helmet.js is a security middleware that sets various HTTP headers to protect Express apps from well-known web vulnerabilities. It adds headers like `X-Content-Type-Options` (prevents MIME sniffing), `X-Frame-Options` (prevents clickjacking), `Strict-Transport-Security` (enforces HTTPS), `X-XSS-Protection` (enables XSS filter), and `Content-Security-Policy` (controls resource loading). It's an easy way to add basic security without manual header management.

```javascript
const express = require('express');
const helmet = require('helmet');
const app = express();

// --- Default helmet (recommended for most apps) ---
app.use(helmet());

// --- Customize individual headers ---
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.example.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'images.example.com'],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
      connectSrc: ["'self'", 'api.example.com'],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'same-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  permittedPolicies: {},
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true
}));

// --- Check which headers helmet adds ---
app.get('/debug', (req, res) => {
  res.json({
    message: 'Helmet security headers are set on all responses',
    note: 'Check response headers in browser devtools'
  });
});

// Example response headers after helmet:
// Content-Security-Policy: default-src 'self'
// X-Content-Type-Options: nosniff
// X-Frame-Options: DENY
// Strict-Transport-Security: max-age=15552000; includeSubDomains
// X-DNS-Prefetch-Control: off
// X-Download-Options: noopen
// X-Permitted-Cross-Domain-Policies: none
// X-XSS-Protection: 0
// Referrer-Policy: strict-origin-when-cross-origin

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <style>body { font-family: Arial; }</style>
      </head>
      <body>
        <h1>Helmet.js Active</h1>
        <p>Security headers are protecting this page.</p>
        <script>console.log('Script works with CSP');</script>
      </body>
    </html>
  `);
});

app.listen(3000);
```

---

## 17. How do you set up logging in an Express application (e.g., morgan, winston)?

Logging in Express combines HTTP request logging with application logging. Morgan handles HTTP request/response logging (method, URL, status, response time). Winston provides structured application logging with multiple transports (console, file, external services), log levels, and formatting. They're often used together — Morgan's output can be piped through Winston for unified log management.

```javascript
const express = require('express');
const morgan = require('morgan');
const winston = require('winston');
const path = require('path');
const fs = require('fs');
const app = express();

// --- WINSTON LOGGER SETUP ---
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}${stack ? '\n' + stack : ''}${Object.keys(meta).length ? '\n' + JSON.stringify(meta, null, 2) : ''}`;
    })
  ),
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // File transport for errors
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880,
      maxFiles: 10
    })
  ]
});

// --- MORGAN HTTP LOGGING ---

// Option 1: Morgan to console
app.use(morgan('dev'));

// Option 2: Morgan with custom format
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Option 3: Morgan stream to Winston
const morganStream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

app.use(morgan('combined', { stream: morganStream }));

// --- ROUTES WITH WINSTON LOGGING ---
app.get('/', (req, res) => {
  logger.info('Home page accessed', {
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });
  res.json({ message: 'Welcome' });
});

app.get('/error', (req, res, next) => {
  const err = new Error('Test error');
  logger.error('Error route triggered', {
    error: err.message,
    stack: err.stack
  });
  next(err);
});

app.get('/users/:id', (req, res) => {
  logger.debug(`Fetching user ${req.params.id}`);
  // Simulate user fetch
  res.json({ userId: req.params.id });
});

// --- Global error handler with logging ---
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  res.status(err.statusCode || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
});

app.listen(3000, () => {
  logger.info(`Server started on port 3000 in ${process.env.NODE_ENV || 'development'} mode`);
});
```

---

## 18. How would you implement pagination in an Express REST API?

Pagination is implemented by extracting `page` and `limit` query parameters, calculating the `skip` value, and returning results along with metadata like total count, total pages, and links to next/previous pages. The API response should include a standardized pagination format. Server-side sorting and filtering are typically combined with pagination for efficiency.

```javascript
const express = require('express');
const app = express();

// Sample data
const allUsers = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  createdAt: new Date(2024, 0, i + 1).toISOString()
}));

// --- Pagination middleware ---
const paginate = (model) => {
  return (req, res, next) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;
    const skip = (page - 1) * limit;

    req.pagination = { page, limit, sort, order, skip };
    next();
  };
};

// --- Users endpoint with pagination ---
app.get('/api/users', paginate(), (req, res) => {
  const { page, limit, sort, order, skip } = req.pagination;

  // Sort the data
  const sorted = [...allUsers].sort((a, b) => {
    if (a[sort] < b[sort]) return -1 * order;
    if (a[sort] > b[sort]) return 1 * order;
    return 0;
  });

  // Apply pagination
  const results = sorted.slice(skip, skip + limit);
  const total = allUsers.length;
  const totalPages = Math.ceil(total / limit);

  res.json({
    success: true,
    data: results,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      next: page < totalPages
        ? `/api/users?page=${page + 1}&limit=${limit}`
        : null,
      prev: page > 1
        ? `/api/users?page=${page - 1}&limit=${limit}`
        : null
    }
  });
});

// --- Filtered pagination ---
app.get('/api/users/search', paginate(), (req, res) => {
  const { page, limit, skip } = req.pagination;
  const { q, role } = req.query;

  let filtered = [...allUsers];

  // Apply filters
  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(u =>
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    );
  }
  if (role) {
    filtered = filtered.filter(u => u.role === role);
  }

  const results = filtered.slice(skip, skip + limit);
  const total = filtered.length;

  res.json({
    success: true,
    data: results,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      returnedCount: results.length
    }
  });
});

// --- Posts with cursor-based pagination ---
app.get('/api/posts', async (req, res) => {
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const cursor = req.query.cursor; // last _id from previous page

  // MongoDB example with cursor-based pagination
  /*
  const query = cursor ? { _id: { $gt: cursor } } : {};
  const posts = await Post.find(query)
    .sort({ _id: 1 })
    .limit(limit);

  const lastPost = posts[posts.length - 1];
  res.json({
    data: posts,
    nextCursor: posts.length === limit ? lastPost._id : null,
    hasMore: posts.length === limit
  });
  */

  // Simulated cursor pagination
  const startIndex = cursor ? parseInt(cursor) : 0;
  const items = allUsers.slice(startIndex, startIndex + limit);

  res.json({
    data: items,
    nextCursor: items.length === limit ? String(startIndex + limit) : null,
    hasMore: items.length === limit
  });
});

app.listen(3000);
```

---

## 19. What is the difference between res.send(), res.json(), and res.end()?

`res.send()` automatically determines the Content-Type based on the data (string -> HTML, Buffer -> octet-stream, object -> JSON) and sets the appropriate headers. `res.json()` explicitly converts the argument to JSON using `JSON.stringify()` and sets `application/json` Content-Type. `res.end()` ends the response without sending any data (or with a Buffer/string) — it's used when you need to end the response quickly with no body.

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// --- res.send() — auto-detects content type ---
app.get('/send/string', (req, res) => {
  res.send('Hello World');            // Content-Type: text/html
});

app.get('/send/object', (req, res) => {
  res.send({ message: 'Hello' });    // Content-Type: application/json
});

app.get('/send/array', (req, res) => {
  res.send([1, 2, 3]);               // Content-Type: application/json
});

app.get('/send/buffer', (req, res) => {
  res.send(Buffer.from('Hello'));    // Content-Type: application/octet-stream
});

app.get('/send/boolean', (req, res) => {
  res.send(true);                     // Content-Type: text/html
});

app.get('/send/status', (req, res) => {
  res.status(201).send('Created');    // Chainable
});

// --- res.json() — explicitly returns JSON ---
app.get('/json', (req, res) => {
  res.json({
    success: true,
    data: {
      id: 1,
      name: 'Alice',
      nested: { key: 'value' }
    }
  });
  // Always Content-Type: application/json
});

app.get('/json/pretty', (req, res) => {
  // In development, you can enable pretty-printing
  app.set('json spaces', 2);
  res.json({ message: 'Pretty printed' });
});

app.get('/json/array', (req, res) => {
  res.json([1, 2, 3]); // Explicitly JSON array
});

// --- res.end() — ends quickly with optional data ---
app.get('/end', (req, res) => {
  // Minimal response, no auto content-type
  res.end(); // 200 with empty body
});

app.get('/end/message', (req, res) => {
  res.end('Quick response');
  // Content-Type is NOT set — just raw bytes
});

// --- Practical differences ---
app.get('/compare', (req, res) => {
  // These three are equivalent for objects:
  res.send({ user: 'Alice' });     // Good — auto detects
  // res.json({ user: 'Alice' });  // Better — explicit intent
  // res.end(JSON.stringify({ user: 'Alice' })); // Works but manual
});

// --- res.json() handles null and undefined differently ---
app.get('/json/null', (req, res) => {
  res.json(null);  // Sends 'null' as JSON
});

app.get('/send/null', (req, res) => {
  res.send(null);  // Sends empty body (no content)
});

app.listen(3000);
```

---

## 20. How do you handle environment-specific configuration in Express apps?

Environment-specific configuration uses the `NODE_ENV` environment variable to load different settings for development, staging, production, and testing. Configuration is centralized in a config module that reads from environment variables with sensible defaults, `.env` files for development, and platform-specific mechanisms (Kubernetes Secrets, AWS Parameter Store) for production. Files like `.env.development`, `.env.production`, and `.env.test` contain environment-specific values.

```javascript
const express = require('express');
const path = require('path');
const app = express();

// --- Configuration Module (config/index.js) ---
const config = {
  development: {
    port: 3000,
    dbUrl: 'mongodb://localhost:27017/myapp_dev',
    redisUrl: 'redis://localhost:6379',
    logLevel: 'debug',
    corsOrigin: '*',
    jwtSecret: 'dev-secret-key',
    jwtExpiresIn: '24h'
  },
  staging: {
    port: process.env.PORT || 3000,
    dbUrl: process.env.DATABASE_URL || 'mongodb://staging-db:27017/myapp',
    redisUrl: process.env.REDIS_URL || 'redis://staging-redis:6379',
    logLevel: 'info',
    corsOrigin: 'https://staging.myapp.com',
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: '1h'
  },
  production: {
    port: parseInt(process.env.PORT, 10) || 3000,
    dbUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    logLevel: 'warn',
    corsOrigin: 'https://myapp.com',
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: '1h'
  },
  test: {
    port: 0,
    dbUrl: 'mongodb://localhost:27017/myapp_test',
    redisUrl: 'redis://localhost:6379/1',
    logLevel: 'silent',
    corsOrigin: '*',
    jwtSecret: 'test-secret'
  }
};

const env = process.env.NODE_ENV || 'development';
const appConfig = config[env];

console.log(`Loading ${env} configuration`);
console.log(`CORS origin: ${appConfig.corsOrigin}`);

// Validate required production config
if (env === 'production') {
  const required = ['DATABASE_URL', 'REDIS_URL', 'JWT_SECRET'];
  for (const key of required) {
    if (!process.env[key]) {
      console.error(`Missing required env var: ${key}`);
      process.exit(1);
    }
  }
}

// --- Load .env files based on environment ---
// npm install dotenv
if (env !== 'production') {
  require('dotenv').config({
    path: path.join(__dirname, `.env.${env}`)
  });
}

// .env.development:
// PORT=4000
// DATABASE_URL=mongodb://localhost:27017/myapp_dev

// .env.test:
// DATABASE_URL=mongodb://localhost:27017/myapp_test

// --- Apply configuration ---
app.set('port', appConfig.port);
app.set('env', env);

// CORS based on environment
const cors = require('cors');
app.use(cors({
  origin: appConfig.corsOrigin,
  credentials: true
}));

// Morgan logging level
const morgan = require('morgan');
if (env === 'development') {
  app.use(morgan('dev'));
} else if (env === 'production') {
  app.use(morgan('combined'));
}

// Error handling in different environments
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    ...(env === 'development' && {
      stack: err.stack,
      error: err
    })
  });
});

// --- Routes ---
app.get('/config', (req, res) => {
  res.json({
    environment: env,
    port: appConfig.port,
    dbUrl: appConfig.dbUrl.replace(/\/\/.*@/, '//***@'), // Mask credentials
    logLevel: appConfig.logLevel,
    nodeVersion: process.version
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Express App',
    environment: env,
    time: new Date().toISOString()
  });
});

// Start server only if not in test
if (env !== 'test') {
  app.listen(appConfig.port, () => {
    console.log(`Server running in ${env} mode on port ${appConfig.port}`);
  });
}

module.exports = app; // Export for testing
```

---
