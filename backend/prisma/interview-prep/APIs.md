<!--LANG:roman-->

# APIs Interview Questions

## 1. What is a REST API and what are its core principles?

**Asaan Urdu mein:**  
REST ek architectural style hai jo networked applications design karne ke liye use hoti hai. Ismein har request **stateless** hoti hai, yani sab info request mein hi hoti hai. Uniform interface ka matlab resources URLs se identify hote hain aur HTTP methods se manipulate kiye jate hain. Client‑server separation, cacheability, layered system aur optional code‑on‑demand bhi core principles hain.  

```javascript
// Express.js REST API example
const express = require('express');
const app = express();
app.use(express.json());

// RESTful resource: /api/users
app.get('/api/users', async (req, res) => {
  const users = await db.query('SELECT id, name, email FROM users');
  res.json(users.rows);
});

app.get('/api/users/:id', async (req, res) => {
  const { rows } = await db.query('SELECT id, name, email FROM users WHERE id = $1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'User not found' });
  res.json(rows[0]);
});

app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  const { rows } = await db.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email',
    [name, email]
  );
  res.status(201).json(rows[0]);
});

app.listen(3000);
```

---



---

## 2. What is the difference between REST and GraphQL?

**Asaan Urdu mein:**  
REST fixed endpoints per resource deta hai, isliye kabhi kabhi data zyada (over‑fetch) ya kam (under‑fetch) milta hai. GraphQL ek hi endpoint use karta hai aur client ko fields aur relations specify karne deta hai, isse sirf zaroori data hi aata hai. Simple CRUD ke liye REST aasan hai, jab complex nested queries chahiye to GraphQL behtar hota hai.  

```javascript
// REST: multiple endpoints, fixed responses
// GET /api/users/1  -> { id: 1, name: "Alice", email: "alice@x.com" }
// GET /api/users/1/posts -> [{ id: 1, title: "Hello", body: "..." }]

// GraphQL: single endpoint, client specifies shape
const typeDefs = `
  type User { id: ID! name: String! email: String! posts: [Post!]! }
  type Post { id: ID! title: String! body: String! }
  type Query { user(id: ID!): User }
`;

const resolvers = {
  Query: {
    user: async (_, { id }) => {
      const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
      const posts = await db.query('SELECT * FROM posts WHERE user_id = $1', [id]);
      return { ...user.rows[0], posts: posts.rows };
    }
  }
};

// Client query (single request):
// query { user(id: 1) { name posts { title } } }
// Response: { user: { name: "Alice", posts: [{ title: "Hello" }] } }
```

---



---

## 3. What are the common HTTP methods and what do they represent (GET, POST, PUT, PATCH, DELETE)?

**Asaan Urdu mein:**  
**GET** resource ko read karta hai, safe aur idempotent hota hai. **POST** naya resource create karta hai, idempotent nahi. **PUT** poora resource replace karta hai, idempotent hota hai. **PATCH** partial update karta hai, usually non‑idempotent. **DELETE** resource ko hata deta hai, idempotent. Ye methods CRUD operations ke saath map hoti hain.  

```javascript
const express = require('express');
const app = express();

// GET - Read (safe, idempotent)
app.get('/api/items/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'Item', stock: 10 });
});

// POST - Create (not idempotent)
app.post('/api/items', (req, res) => {
  const item = { id: Date.now(), ...req.body };
  res.status(201).json(item);
});

// PUT - Full replacement (idempotent)
app.put('/api/items/:id', (req, res) => {
  const updated = { id: req.params.id, name: req.body.name, stock: req.body.stock };
  res.json(updated);
});

// PATCH - Partial update
app.patch('/api/items/:id', (req, res) => {
  const updates = {};
  if (req.body.stock !== undefined) updates.stock = req.body.stock;
  res.json({ id: req.params.id, ...updates });
});

// DELETE - Remove (idempotent)
app.delete('/api/items/:id', (req, res) => {
  res.status(204).end();
});
```

---



---

## 4. What is the difference between PUT and PATCH?

**Asaan Urdu mein:**  
**PUT** poora resource replace karta hai; client ko poora representation bhejna padta hai, aur jo fields missing hain wo null ya default ho jati hain. **PATCH** sirf woh fields update karta hai jo client ne bheji hain, baaki unchanged rehte hain. PUT idempotent hai, jabke PATCH har call par alag effect ho sakta hai (jaise counter increment).  

```javascript
// Current resource: { id: 1, name: "Widget", price: 10, stock: 5 }

// PUT: replace entire resource (missing fields = reset)
app.put('/api/products/:id', (req, res) => {
  const product = {
    id: req.params.id,
    name: req.body.name,
    price: req.body.price,
    stock: req.body.stock
  };
  res.json(product);
});

// PATCH: only update sent fields
app.patch('/api/products/:id', async (req, res) => {
  const allowedFields = ['name', 'price', 'stock'];
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }
  const setClauses = Object.keys(updates).map((k, i) => `${k} = $${i + 1}`);
  const values = Object.values(updates);
  if (!setClauses.length) return res.status(400).end();

  const query = `UPDATE products SET ${setClauses.join(', ')} WHERE id = $${values.length + 1} RETURNING *`;
  const result = await db.query(query, [...values, req.params.id]);
  res.json(result.rows[0]);
});
```

---



---

## 5. What are HTTP status codes and what do the main categories (2xx, 3xx, 4xx, 5xx) mean?

**Asaan Urdu mein:**  
**2xx** success codes hain – 200 OK, 201 Created, 204 No Content. **3xx** redirection codes – 301 Moved Permanently, 302 Found, 304 Not Modified. **4xx** client error codes – 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 429 Too Many Requests. **5xx** server error codes – 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable.  

```javascript
app.get('/api/resource', (req, res) => {
  try {
    const data = getResource(req.query.id);
    if (!data) return res.status(404).json({ error: 'Resource not found' });
    res.status(200).json(data);
  } catch (err) {
    if (err.code === 'RATE_LIMIT') {
      return res.status(429).json({ error: 'Too many requests', retryAfter: 60 });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/resource', (req, res) => {
  if (!req.body.name) return res.status(400).json({ error: 'Name is required' });
  const created = createResource(req.body);
  res.status(201).json(created);
});

app.delete('/api/resource/:id', (req, res) => {
  deleteResource(req.params.id);
  res.status(204).end();
});

// 301: Permanent redirect
app.get('/old-path', (req, res) => {
  res.status(301).redirect('/new-path');
});
```

---



---

## 6. What is idempotency and which HTTP methods are idempotent?

**Asaan Urdu mein:**  
Idempotency ka matlab hai ke ek hi request ko bar bar bhejne par server ka result pehle request jaisa hi rahe (extra side‑effects nahi). **GET, HEAD, PUT, DELETE, OPTIONS, TRACE** idempotent hain. **POST, PATCH, CONNECT** nahi hain. Ye concept retry logic ko safe banata hai, khaas kar network failures ke waqt.  

```javascript
// GET: idempotent - no matter how many times called, same result
app.get('/api/orders/:id', (req, res) => {
  res.json({ id: 1, status: 'pending' });
});

// DELETE: idempotent - first call deletes, subsequent calls return 404
app.delete('/api/orders/:id', async (req, res) => {
  const result = await db.query('DELETE FROM orders WHERE id = $1 RETURNING id', [req.params.id]);
  res.status(204).end();
});

// POST: NOT idempotent - each call creates a new order
app.post('/api/orders', async (req, res) => {
  const { rows } = await db.query('INSERT INTO orders DEFAULT VALUES RETURNING id');
  res.status(201).json(rows[0]);
});

// Making POST idempotent with idempotency key
app.post('/api/payments', async (req, res) => {
  const idempotencyKey = req.headers['idempotency-key'];
  if (!idempotencyKey) return res.status(400).json({ error: 'Missing idempotency key' });

  const existing = await db.query('SELECT * FROM payments WHERE idempotency_key = $1', [idempotencyKey]);
  if (existing.rows.length) return res.status(200).json(existing.rows[0]);

  const { rows } = await db.query(
    'INSERT INTO payments (amount, idempotency_key) VALUES ($1, $2) RETURNING *',
    [req.body.amount, idempotencyKey]
  );
  res.status(201).json(rows[0]);
});
```

---



---

## 7. What is the difference between SOAP and REST?

**Asaan Urdu mein:**  
**SOAP** ek strict protocol hai jo XML envelope, WSDL aur WS‑Security use karta hai; transport‑agnostic hota hai (HTTP, SMTP, JMS). **REST** ek lightweight architectural style hai jo standard HTTP methods, JSON/XML, aur stateless communication par depend karta hai. SOAP heavy hai lekin built‑in error handling, security, aur transactional guarantees deta hai; REST simple, fast, aur scalable hota hai.  

```javascript
// SOAP-style (XML over HTTP)
const xml = `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetUser xmlns="http://example.com/users">
      <UserId>123</UserId>
    </GetUser>
  </soap:Body>
</soap:Envelope>`;

const soapResponse = await fetch('http://example.com/soap/users', {
  method: 'POST',
  headers: { 'Content-Type': 'text/xml', 'SOAPAction': 'GetUser' },
  body: xml
});

// REST-style (JSON over HTTP)
const restResponse = await fetch('http://example.com/api/users/123', {
  method: 'GET',
  headers: { 'Accept': 'application/json' }
});
const user = await restResponse.json();
```

---



---

## 8. What is API versioning and what strategies exist for it?

**Asaan Urdu mein:**  
API versioning se aap existing clients ko break kiye baghair API ko evolve kar sakte hain. Common strategies: **URI versioning** (`/v1/users`), **query parameter** (`?v=1`), **custom header** (`Accept: application/vnd.myapp.v1+json`), aur **content negotiation**. URI versioning sabse simple aur widely used hai; header‑based clean URLs deta hai lekin testing mein thoda mushkil hota hai. Breaking changes se bachne ke liye gradual deprecation zaroori hai.  

```javascript
const express = require('express');
const app = express();

// Strategy 1: URI versioning (most common)
app.get('/v1/users/:id', (req, res) => {
  const user = { id: req.params.id, name: 'Alice', email: 'alice@x.com' };
  res.json(user);
});

app.get('/v2/users/:id', (req, res) => {
  const user = { id: req.params.id, name: 'Alice', profile: { email: 'alice@x.com', avatar: '/img/a.png' } };
  res.json(user);
});

// Strategy 2: Header-based versioning (Accept header)
app.get('/api/users/:id', (req, res) => {
  const accept = req.headers['accept'] || '';
  if (accept.includes('vnd.myapp.v2')) {
    // Return V2 response...
  }
});

// Strategy 3: Query parameter versioning
app.get('/api/users/:id', (req, res) => {
  if (req.query.v === '2') {
    // Return V2 response...
  }
});

// Version management with deprecation headers
app.get('/v1/users/:id', (req, res) => {
  res.set('Sunset', 'Sat, 31 Dec 2025 23:59:59 GMT');
  res.set('Deprecation', 'true');
  res.json({ id: req.params.id, name: 'Alice' });
});
```

---



---

## 9. What is rate limiting and why is it important for APIs?

**Asaan Urdu mein:**  
Rate limiting ek client ko ek time window ke andar kitni requests bhej sakta hai, isko restrict karta hai. Ye API ko abuse, DoS attacks, aur accidental traffic spikes se protect karta hai, aur sab users ke beech resources ka fair distribution ensure karta hai. Common algorithms: Token Bucket, Leaky Bucket, Fixed Window, Sliding Window Log. Rate limit details `X-RateLimit-*` headers ke through client ko batayi jati hain.  

```javascript
const rateLimit = new Map(); // In production use Redis

const rateLimiter = (maxRequests, windowMs) => {
  return (req, res, next) => {
    const clientIp = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!rateLimit.has(clientIp)) rateLimit.set(clientIp, []);
    const timestamps = rateLimit.get(clientIp).filter(t => t > windowStart);
    timestamps.push(now);
    rateLimit.set(clientIp, timestamps);

    const remaining = Math.max(0, maxRequests - timestamps.length);
    res.set('X-RateLimit-Limit', maxRequests);
    res.set('X-RateLimit-Remaining', remaining);
    res.set('X-RateLimit-Reset', Math.ceil((windowStart + windowMs) / 1000));

    if (timestamps.length > maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    next();
  };
};

// Apply: 100 requests per 15 minutes
app.use('/api', rateLimiter(100, 15 * 60 * 1000));

// Using express-rate-limit package:
const rateLimitPkg = require('express-rate-limit');
const limiter = rateLimitPkg({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, try again later' }
});
app.use('/api', limiter);
```

---



---

## 10. What is pagination and what strategies exist (offset-based vs cursor-based)?

**Asaan Urdu mein:**  
Pagination large result sets ko chote pages mein divide karta hai. **Offset‑based** (`LIMIT 10 OFFSET 20`) simple hai lekin large offsets par slow hota hai aur rows insert/delete hone par inconsistent ho sakta hai. **Cursor‑based** (`WHERE id > last_seen_id LIMIT 10`) performant, consistent, aur scalable hota hai, isliye production APIs ke liye preferred hai.  

```javascript
// Offset-based pagination (simple but problematic for large offsets)
app.get('/api/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const { rows } = await db.query(
    'SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  const count = await db.query('SELECT COUNT(*) FROM users');

  res.json({
    data: rows,
    page,
    limit,
    total: parseInt(count.rows[0].count),
    totalPages: Math.ceil(parseInt(count.rows[0].count) / limit)
  });
});

// Cursor-based pagination (preferred for large/real-time data)
app.get('/api/users', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const cursor = req.query.cursor;

  let query;
  const params = [limit + 1];

  if (cursor) {
    query = 'SELECT * FROM users WHERE id > $2 ORDER BY id LIMIT $1';
    params.push(cursor);
  } else {
    query = 'SELECT * FROM users ORDER BY id LIMIT $1';
  }

  const { rows } = await db.query(query, params);
  const hasMore = rows.length > limit;
  if (hasMore) rows.pop();

  res.json({
    data: rows,
    nextCursor: hasMore ? rows[rows.length - 1].id : null
  });
});
```

---



---

## 11. What is the difference between synchronous and asynchronous APIs (webhooks)?

**Asaan Urdu mein:**  
**Synchronous APIs** request‑response pattern follow karte hain; client request bhejta hai aur server turant response deta hai. **Asynchronous APIs** (webhooks) server ko client ke registered URL par event hone par callback bhejne ki ijazat dete hain, isse polling ki zaroorat nahi padti. Webhooks real‑time notifications ke liye use hote hain, jaise payment confirmations ya CI/CD events.  

```javascript
// Synchronous API: client waits for response
app.post('/api/process-image', async (req, res) => {
  const result = await processImage(req.body.image);
  res.json({ status: 'done', result });
});

// Async pattern with job queue
app.post('/api/process-image', async (req, res) => {
  const jobId = crypto.randomUUID();
  await queue.add('image-processing', { jobId, image: req.body.image });
  res.status(202).json({ jobId, status: 'processing' });
});

// Client polls for status:
app.get('/api/jobs/:jobId', async (req, res) => {
  const job = await getJobStatus(req.params.jobId);
  res.json(job);
});

// Webhook: server calls client when done
app.post('/webhooks/image-processed', async (req, res) => {
  const { jobId, result } = req.body;
  console.log(`Job ${jobId} completed:`, result);
  res.status(200).send('OK');
});

// Example webhook server setup
app.post('/webhooks/payment-completed', (req, res) => {
  const event = req.body;
  const signature = req.headers['x-webhook-signature'];
  if (!verifySignature(JSON.stringify(event), signature, WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  console.log(`Payment ${event.id}: ${event.status}`);
  res.status(200).send('OK');
});
```

---



---

## 12. What is HATEOAS in the context of REST?

**Asaan Urdu mein:**  
**HATEOAS** ka matlab hai ke API responses mein related actions ke links shamil hon, taake client dynamically discover kar sake ke agla step kya hai. Ye REST ki ek constraint hai jo hypermedia (links) ko engine of application state banata hai. Real world mein bahut APIs isko fully implement nahi karti kyunki complexity zyada hoti hai.  

```javascript
// Non-HATEOAS response:
app.get('/api/orders/123', (req, res) => {
  res.json({
    id: 123,
    status: 'shipped',
    items: ['Widget', 'Gadget']
  });
});

// HATEOAS response: includes available actions
app.get('/api/orders/123', (req, res) => {
  const order = getOrder(123);
  const links = [
    { rel: 'self', method: 'GET', href: '/api/orders/123' },
    { rel: 'cancel', method: 'DELETE', href: '/api/orders/123' },
    { rel: 'items', method: 'GET', href: '/api/orders/123/items' }
  ];

  if (order.status === 'pending') {
    links.push({ rel: 'update', method: 'PUT', href: '/api/orders/123' });
    links.push({ rel: 'pay', method: 'POST', href: '/api/orders/123/payments' });
  }
  if (order.status === 'shipped') {
    links.push({ rel: 'track', method: 'GET', href: '/api/orders/123/tracking' });
  }

  res.json({ ...order, _links: links });
});
```

---



---

## 13. What is the purpose of API documentation tools like Swagger/OpenAPI?

**Asaan Urdu mein:**  
**OpenAPI** (pehle Swagger) ek language‑agnostic specification hai jo REST APIs ko machine‑readable format (JSON/YAML) mein describe karta hai. Isse interactive documentation (Swagger UI), client SDK generation, aur validation possible hota hai. Tools automatically endpoints, request/response schemas, authentication, aur parameters ko document karte hain.  

```javascript
// OpenAPI 3.0 specification file (openapi.yaml)
// Usually written in YAML, but here's the equivalent structure:

const openApiDoc = {
  openapi: '3.0.0',
  info: { title: 'User API', version: '1.0.0' },
  paths: {
    '/api/users/{id}': {
      get: {
        summary: 'Get user by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'User found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' }
                  }
                }
              }
            }
          },
          '404': { description: 'User not found' }
        }
      },
      delete: {
        summary: 'Delete user',
        security: [{ bearerAuth: [] }],
        responses: {
          '204': { description: 'User deleted' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  }
};

// Using swagger-jsdoc to generate from comments
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: { openapi: '3.0.0', info: { title: 'My API', version: '1.0.0' } },
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

---



---

## 14. What is the difference between a GraphQL query and a mutation?

**Asaan Urdu mein:**  
**Query** data fetch karne ke liye hoti hai aur resolvers parallel execute ho sakte hain; side‑effects nahi hone chahiye. **Mutation** data modify (create, update, delete) karne ke liye hoti hai aur sequentially execute hoti hai, taake order ka effect predictable ho. Mutations usually modified data ko return karti hain taake client cache update kar sake.  

```javascript
const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = gql`
  type User { id: ID! name: String! email: String! }
  type Query {
    users: [User!]!
    user(id: ID!): User
  }
  type Mutation {
    createUser(name: String!, email: String!): User!
    updateUser(id: ID!, name: String): User
    deleteUser(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      const { rows } = await db.query('SELECT * FROM users');
      return rows;
    },
    user: async (_, { id }) => {
      const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
      return rows[0];
    }
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      const { rows } = await db.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [name, email]
      );
      return rows[0];
    },
    updateUser: async (_, { id, name }) => {
      const { rows } = await db.query(
        'UPDATE users SET name = COALESCE($1, name) WHERE id = $2 RETURNING *',
        [name, id]
      );
      return rows[0];
    },
    deleteUser: async (_, { id }) => {
      await db.query('DELETE FROM users WHERE id = $1', [id]);
      return true;
    }
  }
};
```

---



---

## 15. What is over-fetching and under-fetching, and how does GraphQL solve it?

**Asaan Urdu mein:**  
**Over‑fetching** tab hota hai jab API client ko usse zyada data bhejti hai jo use nahi chahiye (e.g., REST `/users/1` sab fields return karta hai). **Under‑fetching** tab hota hai jab required data alag alag endpoints se fetch karna padta hai, jis se multiple requests hoti hain. **GraphQL** client ko exact fields aur nested relations specify karne deta hai, isliye ek hi request mein sirf zaroori data milta hai, over aur under‑fetching dono solve ho jate hain.  

```javascript
// REST over-fetching: get user returns ALL fields
// GET /api/users/1
{
  "id": 1, "name": "Alice", "email": "alice@x.com",
  "phone": "555-0100", "address": "123 Main St",
  "birthDate": "1990-01-01", "createdAt": "2020-01-01"
}

// REST under-fetching: need user + posts + followers
const user = await fetch('/api/users/1').then(r => r.json());
const posts = await fetch('/api/users/1/posts').then(r => r.json());
const followers = await fetch('/api/users/1/followers').then(r => r.json());

// GraphQL: single request, exactly what's needed
const query = `
  query {
    user(id: 1) {
      name
      posts { title, createdAt }
      followers { name }
    }
  }
`;

const { data } = await fetch('/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query })
}).then(r => r.json());
// Response contains only requested fields
```

---



---

## 16. What is CORS and why does it matter for APIs?

**Asaan Urdu mein:**  
**CORS** (Cross‑Origin Resource Sharing) browser ki security mechanism hai jo alag origin (protocol, domain, port) se requests ko restrict karta hai. API ko `Access-Control-Allow-Origin` jaise headers set karne hote hain taake legitimate front‑end apps cross‑origin calls kar saken. Agar CORS sahi se configure na ho, browsers API calls ko block kar dete hain.  

```javascript
const express = require('express');
const app = express();

// Manual CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://myapp.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});

// Using the cors package
const cors = require('cors');

// Allow all (public API)
app.use(cors());

// Specific origin with credentials
app.use(cors({
  origin: ['https://myapp.com', 'https://admin.myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}));

// Dynamic origin based on request
app.use(cors({
  origin: (origin, callback) => {
    const allowed = ['https://myapp.com', 'https://staging.myapp.com'];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
```

---



---

## 17. How do you handle error responses consistently in an API?

**Asaan Urdu mein:**  
Ek **standard error format** (`{ error, code, details? }`) define karen, phir global error‑handling middleware use karen. Custom `AppError` class se status code aur error code attach karen, aur har route mein `throw new AppError(...)` karein. Correlation ID request ke saath log karen taake debugging asaan ho.  

```javascript
// Custom error class
class AppError extends Error {
  constructor(message, statusCode, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

// Global error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const response = {
    error: err.message || 'Internal server error',
    code: err.code || 'INTERNAL_ERROR',
    requestId: req.id
  };
  if (err.validationErrors) response.details = err.validationErrors;
  console.error(`[${req.id}] ${statusCode} ${err.code}: ${err.message}`);
  res.status(statusCode).json(response);
});

// Async handler wrapper
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Example controller
app.get('/api/users/:id', asyncHandler(async (req, res) => {
  const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
  if (!rows.length) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  res.json(rows[0]);
}));
```

---



---

## 18. What is the difference between a public API and a private/internal API?

**Asaan Urdu mein:**  
**Public API** external developers ke liye hoti hai; isme strong authentication (API keys, OAuth), rate limiting, detailed documentation, versioning, aur SLA required hoti hai. **Private/internal API** sirf organization ke services ke beech use hoti hai, usually simple auth (service tokens, mTLS), kam rate limits, aur public documentation ki zaroorat nahi.  

```javascript
// Public API: strict auth, rate limiting, full validation
const publicApi = express.Router();

publicApi.use(rateLimiter(100, 15 * 60 * 1000));

publicApi.use(async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return res.status(401).json({ error: 'API key required' });

  const key = await db.query('SELECT * FROM api_keys WHERE key = $1 AND active = true', [apiKey]);
  if (!key.rows.length) return res.status(403).json({ error: 'Invalid API key' });

  req.clientId = key.rows[0].client_id;
  next();
});

publicApi.get('/v1/products', async (req, res) => {
  const { rows } = await db.query('SELECT id, name, price FROM products WHERE active = true');
  res.json(rows);
});

// Internal API: simple auth, no rate limiting, full data
const internalApi = express.Router();

internalApi.use(async (req, res, next) => {
  const token = req.headers['x-service-token'];
  if (token !== INTERNAL_SERVICE_TOKEN) return res.status(403).end();
  next();
});

internalApi.get('/products', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM products');
  res.json(rows);
});
```

---



---

## 19. What is an API gateway and what role does it play in microservices?

**Asaan Urdu mein:**  
**API gateway** ek single entry point hota hai jo requests ko appropriate microservice tak route karta hai. Ye authentication, rate limiting, load balancing, caching, request transformation, aur monitoring jaise cross‑cutting concerns handle karta hai. Gateway clients ko backend services se alag karta hai aur multiple services ka response ek hi response mein aggregate kar sakta hai (BFF pattern).  

```javascript
// Simplified API gateway using Express http-proxy-middleware
const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const app = express();

// Common gateway middleware
app.use(rateLimiter(1000, 15 * 60 * 1000));
app.use(authenticateRequest);

// Route to user service
app.use('/api/users', createProxyMiddleware({
  target: 'http://user-service:3001',
  changeOrigin: true
}));

// Route to order service
app.use('/api/orders', createProxyMiddleware({
  target: 'http://order-service:3002',
  changeOrigin: true
}));

// Route to payment service
app.use('/api/payments', createProxyMiddleware({
  target: 'http://payment-service:3003',
  changeOrigin: true
}));

// Aggregation: combine multiple service responses
app.get('/api/dashboard', async (req, res) => {
  const [user, orders, notifications] = await Promise.all([
    fetch('http://user-service:3001/users/me').then(r => r.json()),
    fetch('http://order-service:3002/orders?limit=5').then(r => r.json()),
    fetch('http://notification-service:3004/notifications').then(r => r.json()),
  ]);

  res.json({ user, recentOrders: orders, notifications });
});
```

---

## 20



---

## 20. What is gRPC and how does it differ from REST?

**Asaan Urdu mein:**  
gRPC ek high‑performance RPC framework hai jo data ko serialize karne ke liye Protocol Buffers aur transport ke liye HTTP/2 ka istemal karta hai. Ye bidirectional streaming, flow control aur strongly‑typed contracts ko `.proto` files mein define karta hai. REST ke muqable mein (jo text‑based JSON/XML, HTTP/1.1 aur request‑response model use karta hai) gRPC binary hota hai, zyada tezi se data transfer karta hai, strict typing enforce karta hai aur multiple languages ke liye client/server code automatically generate karta hai.

```javascript
// proto/user.proto (contract definition)
// syntax = "proto3";
// package user;
// service UserService {
//   rpc GetUser (GetUserRequest) returns (User);
//   rpc ListUsers (ListUsersRequest) returns (stream User);
// }
// message GetUserRequest { int32 id = 1; }
// message User { int32 id = 1; string name = 2; string email = 3; }

// gRPC server (Node.js)
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('user.proto');
const proto = grpc.loadPackageDefinition(packageDef).user;

const server = new grpc.Server();
server.addService(proto.UserService.service, {
  GetUser: async (call, callback) => {
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [call.request.id]);
    if (!rows.length) return callback({ code: grpc.status.NOT_FOUND });
    callback(null, rows[0]);
  },
  ListUsers: async (call) => {
    const { rows } = await db.query('SELECT * FROM users');
    for (const user of rows) {
      call.write(user); // Streaming response
    }
    call.end();
  }
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
});

// REST equivalent for comparison:
// GET /api/users/1 -> JSON response
// gRPC advantages: binary (smaller), streaming, typed, auto-generated clients
```

---



---

## 21. What is the difference between long polling, WebSockets, and Server-Sent Events?

**Asaan Urdu mein:**  
Long polling mein client request bhejta hai aur server us request ko tab tak hold rakhta hai jab tak naya data na mil jaye, phir response bhejta hai aur client turant dobara request karta hai. WebSocket ek full‑duplex, persistent connection establish karta hai jisme client aur server dono ek hi time par data bhej‑sakte hain, isliye real‑time bidirectional communication ke liye best hai. Server‑Sent Events (SSE) sirf server‑to‑client direction mein kaam karta hai, HTTP ke upar simple text stream provide karta hai, auto‑reconnect hota hai lekin binary data ya client‑to‑server messages ko support nahi karta.

```javascript
// Long polling: client repeatedly requests, server holds until data
app.get('/api/poll', async (req, res) => {
  const timeout = setTimeout(() => {
    res.json({ data: null, timeout: true }); // Return empty after 30s
  }, 30000);

  // Wait for new data (e.g., via event emitter)
  const onNewData = (data) => {
    clearTimeout(timeout);
    res.json({ data, timeout: false });
  };
  eventEmitter.once('new-data', onNewData);
});

// Server-Sent Events (SSE): one-way server-to-client
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const interval = setInterval(() => {
    // Each message starts with "data: " and ends with "\n\n"
    res.write(`data: ${JSON.stringify({ time: new Date() })}\n\n`);
  }, 1000);

  req.on('close', () => clearInterval(interval));
});

// Client-side SSE:
const source = new EventSource('/api/events');
source.onmessage = (event) => console.log('SSE:', JSON.parse(event.data));

// WebSocket: full-duplex bidirectional
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    // Server receives message
    const data = JSON.parse(msg);
    // Broadcast to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ user: data.user, message: data.message }));
      }
    });
  });
});
// Client: new WebSocket('ws://localhost:8080');
```

---



---

## 22. How would you secure a public-facing API?

**Asaan Urdu mein:**  
Public API ko secure karne ke liye sabse pehle TLS/HTTPS enforce karna zaroori hai, taake data encryption ho. Authentication ke liye API keys, JWT ya OAuth2 ka istemal karein, aur rate limiting se brute‑force attacks ko roken. Input validation aur sanitization se injection attacks se bacha ja sakta hai, CORS ko sahi tarah configure karein, aur HMAC based request signing ya IP whitelisting bhi add kar sakte hain. Security headers (Helmet), logging, monitoring aur WAF se overall protection mazboot hoti hai, lekin kabhi bhi internal IDs, stack traces ya sensitive data response mein expose na karein.

```javascript
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { expressjwt } = require('express-jwt');
const app = express();

// 1. TLS handled by reverse proxy (nginx, load balancer)

// 2. Security headers
app.use(helmet()); // Content-Security-Policy, X-Content-Type-Options, etc.

// 3. Rate limiting
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
}));

// 4. Authentication (JWT)
app.use('/api', expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  credentialsRequired: false // Optional auth for some endpoints
}));

// 5. Input validation
const { body, validationResult } = require('express-validator');
app.post('/api/users',
  body('email').isEmail().normalizeEmail(),
  body('name').trim().isLength({ min: 1, max: 100 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
);

// 6. CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 7. Request logging (but never log tokens/bodies fully)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// 8. Never expose stack traces
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: 'Internal server error',
    requestId: req.id
    // No stack trace, no internal details
  });
});
```

---



---

## 23. What is content negotiation in HTTP APIs?

**Asaan Urdu mein:**  
Content negotiation ka matlab hai ke client aur server mil kar decide karte hain ke data kis format mein exchange hoga. Client `Accept` header ke through response format (jaise `application/json`, `application/xml`) aur `Content-Type` header ke through request body ka format batata hai. Server available formats me se sabse suitable choose karta hai aur ussi format mein response bhejta hai. Is tarah ek hi endpoint JSON, XML, CSV ya koi aur format serve kar sakta hai, jo APIs ko flexible banata hai.

```javascript
const express = require('express');
const app = express();

// Content negotiation based on Accept header
app.get('/api/users/:id', (req, res) => {
  const user = { id: 1, name: 'Alice', email: 'alice@x.com' };

  res.format({
    'application/json': () => {
      res.json(user);
    },
    'application/xml': () => {
      res.type('application/xml');
      res.send(`<user><id>${user.id}</id><name>${user.name}</name><email>${user.email}</email></user>`);
    },
    'text/csv': () => {
      res.type('text/csv');
      res.send('id,name,email\n1,Alice,alice@x.com');
    },
    'default': () => {
      res.status(406).json({ error: 'Not acceptable', supportedTypes: ['application/json', 'application/xml'] });
    }
  });
});

// Client sends: Accept: application/xml
// Server responds with XML

// Input content negotiation
app.post('/api/users', (req, res) => {
  const contentType = req.headers['content-type'];
  let data;

  if (contentType === 'application/json') {
    data = req.body; // Already parsed by express.json()
  } else if (contentType === 'application/xml') {
    // Parse XML body manually
    data = parseXml(req.body);
  } else {
    return res.status(415).json({ error: 'Unsupported media type' });
  }

  res.status(201).json(data);
});

// Wildcard Accept header handling
req.headers.accept = 'application/json; q=1.0, application/xml; q=0.5';
// q=1.0 is highest priority (JSON preferred)
```

---



---

## 24. What is the difference between a stateless and stateful API design?

**Asaan Urdu mein:**  
Stateless API (jaise REST) har request mein sab required information (authentication token, parameters) include karta hai, isliye server ko client ka koi session store karna nahi padta; is se horizontal scaling aur failure tolerance asaan ho jati hai. Stateful API server side par session ya state (memory, Redis, DB) store karta hai, jise sticky sessions ya shared storage ki zaroorat hoti hai, aur multiple steps ya real‑time interactions ke liye use hota hai. Modern microservices aur cloud environments mein scalability ke liye stateless design ko tarjeeh di jati hai, jabke kuch complex workflows ke liye stateful approach zaroori ho sakti hai.

```javascript
// Stateless API: no server-side session, JWT carries all context
app.post('/api/orders', authenticateJWT, async (req, res) => {
  // All context from JWT token
  const userId = req.user.userId;
  const { items, shippingAddress } = req.body;

  const order = await createOrder(userId, items, shippingAddress);
  res.status(201).json(order);
});

app.get('/api/orders/:id', authenticateJWT, async (req, res) => {
  const order = await getOrder(req.params.id, req.user.userId); // Authorize by user
  res.json(order);
});
// Each request is self-contained; no session lookup needed
// Can scale to N servers behind a load balancer

// Stateful API: server stores session/state
app.post('/api/checkout/start', async (req, res) => {
  // Start multi-step checkout, save state in Redis
  const sessionId = crypto.randomUUID();
  const cart = await getCart(req.cookies.sessionId);

  await redis.set(`checkout:${sessionId}`, JSON.stringify({
    step: 1, cart, userId: req.user.userId, shipping: null, payment: null
  }), 'EX', 3600);

  res.json({ sessionId, step: 1, cart });
});

app.post('/api/checkout/shipping', async (req, res) => {
  const sessionData = await redis.get(`checkout:${req.body.sessionId}`);
  if (!sessionData) return res.status(400).json({ error: 'Checkout session expired' });

  const session = JSON.parse(sessionData);
  session.step = 2;
  session.shipping = req.body.address;
  await redis.set(`checkout:${req.body.sessionId}`, JSON.stringify(session), 'EX', 3600);

  res.json({ step: 2 });
});
// Stateful requires shared state (Redis) across servers or sticky sessions
```

<!--LANG:english-->



# APIs Interview Questions

## 1. What is a REST API and what are its core principles?

REST (Representational State Transfer) is an architectural style for designing networked applications. Its core principles are: statelessness (each request contains all info needed), uniform interface (resources identified by URL, manipulated via representations), client-server separation, cacheability, layered system, and optionally code on demand. REST APIs use standard HTTP methods and status codes.

```javascript
// Express.js REST API example
const express = require('express');
const app = express();
app.use(express.json());

// RESTful resource: /api/users
app.get('/api/users', async (req, res) => {
  const users = await db.query('SELECT id, name, email FROM users');
  res.json(users.rows);
});

app.get('/api/users/:id', async (req, res) => {
  const { rows } = await db.query('SELECT id, name, email FROM users WHERE id = $1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'User not found' });
  res.json(rows[0]);
});

app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  const { rows } = await db.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email',
    [name, email]
  );
  res.status(201).json(rows[0]);
});

app.listen(3000);
```

---

## 2. What is the difference between REST and GraphQL?

REST exposes fixed endpoints per resource (e.g., `/api/users`, `/api/users/:id/posts`) and often returns over-fetched or under-fetched data. GraphQL exposes a single endpoint where the client specifies exactly which fields and relations it needs in a query, eliminating over/under-fetching. REST is simpler for basic CRUD; GraphQL is better for complex, nested data requirements.

```javascript
// REST: multiple endpoints, fixed responses
// GET /api/users/1  -> { id: 1, name: "Alice", email: "alice@x.com" }
// GET /api/users/1/posts -> [{ id: 1, title: "Hello", body: "..." }]

// GraphQL: single endpoint, client specifies shape
const typeDefs = `
  type User { id: ID! name: String! email: String! posts: [Post!]! }
  type Post { id: ID! title: String! body: String! }
  type Query { user(id: ID!): User }
`;

const resolvers = {
  Query: {
    user: async (_, { id }) => {
      const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
      const posts = await db.query('SELECT * FROM posts WHERE user_id = $1', [id]);
      return { ...user.rows[0], posts: posts.rows };
    }
  }
};

// Client query (single request):
// query { user(id: 1) { name posts { title } } }
// Response: { user: { name: "Alice", posts: [{ title: "Hello" }] } }
```

---

## 3. What are the common HTTP methods and what do they represent (GET, POST, PUT, PATCH, DELETE)?

GET retrieves a resource (idempotent, safe). POST creates a new resource (non-idempotent). PUT replaces an entire resource (idempotent). PATCH applies partial modifications (non-idempotent). DELETE removes a resource (idempotent). Each method maps to CRUD operations: Create (POST), Read (GET), Update (PUT/PATCH), Delete (DELETE).

```javascript
const express = require('express');
const app = express();

// GET - Read (safe, idempotent)
app.get('/api/items/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'Item', stock: 10 });
});

// POST - Create (not idempotent)
app.post('/api/items', (req, res) => {
  const item = { id: Date.now(), ...req.body };
  res.status(201).json(item);
});

// PUT - Full replacement (idempotent)
app.put('/api/items/:id', (req, res) => {
  // Client sends full representation
  const updated = { id: req.params.id, name: req.body.name, stock: req.body.stock };
  res.json(updated);
});

// PATCH - Partial update
app.patch('/api/items/:id', (req, res) => {
  // Client sends only fields to change
  const updates = {}; // { stock: 5 }
  if (req.body.stock !== undefined) updates.stock = req.body.stock;
  res.json({ id: req.params.id, ...updates });
});

// DELETE - Remove (idempotent)
app.delete('/api/items/:id', (req, res) => {
  res.status(204).end();
});
```

---

## 4. What is the difference between PUT and PATCH?

PUT replaces the entire resource — the client sends the full representation, and missing fields are reset to defaults or null. PATCH applies a partial update — the client sends only the fields to change. PUT is idempotent (calling it multiple times has the same effect), while PATCH may not be (e.g., incrementing a counter).

```javascript
// Current resource: { id: 1, name: "Widget", price: 10, stock: 5 }

// PUT: replace entire resource (missing fields = reset)
app.put('/api/products/:id', (req, res) => {
  // Client MUST send: { name: "Widget", price: 10, stock: 5 }
  // If client sends only { price: 15 }, stock becomes undefined/null
  const product = {
    id: req.params.id,
    name: req.body.name,
    price: req.body.price,
    stock: req.body.stock
  };
  // Result with { price: 15 }: { id:1, name: undefined, price: 15, stock: undefined }
  res.json(product);
});

// PATCH: only update sent fields
app.patch('/api/products/:id', (req, res) => {
  // Client sends only { price: 15 }
  const allowedFields = ['name', 'price', 'stock'];
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }
  // Build SET clause dynamically
  const setClauses = Object.keys(updates).map((k, i) => `${k} = $${i + 1}`);
  const values = Object.values(updates);
  if (!setClauses.length) return res.status(400).end();

  // UPDATE products SET price = $1 WHERE id = $2 RETURNING *
  const query = `UPDATE products SET ${setClauses.join(', ')} WHERE id = $${values.length + 1} RETURNING *`;
  const result = await db.query(query, [...values, req.params.id]);
  // Result: { id:1, name: "Widget", price: 15, stock: 5 }
  res.json(result.rows[0]);
});
```

---

## 5. What are HTTP status codes and what do the main categories (2xx, 3xx, 4xx, 5xx) mean?

2xx (Success): 200 OK, 201 Created, 204 No Content. 3xx (Redirection): 301 Moved Permanently, 302 Found, 304 Not Modified. 4xx (Client Error): 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 429 Too Many Requests. 5xx (Server Error): 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable.

```javascript
app.get('/api/resource', (req, res) => {
  try {
    const data = getResource(req.query.id);
    if (!data) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.status(200).json(data); // OK
  } catch (err) {
    if (err.code === 'RATE_LIMIT') {
      return res.status(429).json({ error: 'Too many requests', retryAfter: 60 });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/resource', (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const created = createResource(req.body);
  res.status(201).json(created); // Created
});

app.delete('/api/resource/:id', (req, res) => {
  deleteResource(req.params.id);
  res.status(204).end(); // No Content
});

// 301: Permanent redirect
app.get('/old-path', (req, res) => {
  res.status(301).redirect('/new-path');
});
```

---

## 6. What is idempotency and which HTTP methods are idempotent?

Idempotency means making the same request multiple times produces the same result as making it once (no additional side effects). GET, HEAD, PUT, DELETE, OPTIONS, and TRACE are idempotent. POST, PATCH, and CONNECT are not idempotent. This is critical for retry logic — clients can safely retry idempotent requests on network failures.

```javascript
// GET: idempotent - no matter how many times called, same result
app.get('/api/orders/:id', (req, res) => {
  res.json({ id: 1, status: 'pending' });
});

// DELETE: idempotent - first call deletes, subsequent calls return 404
app.delete('/api/orders/:id', async (req, res) => {
  const result = await db.query('DELETE FROM orders WHERE id = $1 RETURNING id', [req.params.id]);
  // First call: deletes row, returns { id: 1 }
  // Second call: no row to delete, returns empty set
  // Both return 204 No Content
  res.status(204).end();
});

// POST: NOT idempotent - each call creates a new order
app.post('/api/orders', async (req, res) => {
  const { rows } = await db.query('INSERT INTO orders DEFAULT VALUES RETURNING id');
  // Each call creates a new order with a different ID
  res.status(201).json(rows[0]);
});

// Making POST idempotent with idempotency key
app.post('/api/payments', async (req, res) => {
  const idempotencyKey = req.headers['idempotency-key'];
  if (!idempotencyKey) return res.status(400).json({ error: 'Missing idempotency key' });

  const existing = await db.query('SELECT * FROM payments WHERE idempotency_key = $1', [idempotencyKey]);
  if (existing.rows.length) {
    return res.status(200).json(existing.rows[0]); // Return existing, don't process again
  }

  const { rows } = await db.query(
    'INSERT INTO payments (amount, idempotency_key) VALUES ($1, $2) RETURNING *',
    [req.body.amount, idempotencyKey]
  );
  res.status(201).json(rows[0]);
});
```

---

## 7. What is the difference between SOAP and REST?

SOAP (Simple Object Access Protocol) is a protocol with strict standards (XML envelope, WSDL, WS-Security) and is transport-agnostic (HTTP, SMTP, JMS). REST is an architectural style using standard HTTP methods, JSON/XML, and stateless communication. SOAP is heavier but offers built-in error handling, security, and transactional guarantees. REST is simpler, faster, and more scalable.

```javascript
// SOAP-style (XML over HTTP)
const xml = `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetUser xmlns="http://example.com/users">
      <UserId>123</UserId>
    </GetUser>
  </soap:Body>
</soap:Envelope>`;

const soapResponse = await fetch('http://example.com/soap/users', {
  method: 'POST',
  headers: { 'Content-Type': 'text/xml', 'SOAPAction': 'GetUser' },
  body: xml
});

// REST-style (JSON over HTTP)
const restResponse = await fetch('http://example.com/api/users/123', {
  method: 'GET',
  headers: { 'Accept': 'application/json' }
});
const user = await restResponse.json();

// Key differences in code:
// SOAP: XML envelope, predefined contract (WSDL), transport independent
// REST: Simple URL, JSON body, uses HTTP semantics (GET=read, POST=create)
```

---

## 8. What is API versioning and what strategies exist for it?

API versioning allows you to evolve your API without breaking existing clients. Common strategies: URI versioning (`/v1/users`), query parameter (`?v=1`), custom header (`Accept: application/vnd.myapp.v1+json`), and content negotiation. URI versioning is simplest and most common. Header-based versioning keeps URLs clean but is harder to test. Avoid breaking changes; deprecate old versions gradually.

```javascript
const express = require('express');
const app = express();

// Strategy 1: URI versioning (most common)
app.get('/v1/users/:id', (req, res) => {
  const user = { id: req.params.id, name: 'Alice', email: 'alice@x.com' };
  res.json(user);
});

app.get('/v2/users/:id', (req, res) => {
  // V2 adds "profile" field, removes "email"
  const user = { id: req.params.id, name: 'Alice', profile: { email: 'alice@x.com', avatar: '/img/a.png' } };
  res.json(user);
});

// Strategy 2: Header-based versioning (Accept header)
app.get('/api/users/:id', (req, res) => {
  const accept = req.headers['accept'] || '';
  if (accept.includes('vnd.myapp.v2')) {
    // Return V2 response...
  }
});

// Strategy 3: Query parameter versioning
app.get('/api/users/:id', (req, res) => {
  if (req.query.v === '2') {
    // Return V2 response...
  }
});

// Version management with deprecation headers
app.get('/v1/users/:id', (req, res) => {
  res.set('Sunset', 'Sat, 31 Dec 2025 23:59:59 GMT');
  res.set('Deprecation', 'true');
  res.json({ id: req.params.id, name: 'Alice' });
});
```

---

## 9. What is rate limiting and why is it important for APIs?

Rate limiting restricts how many requests a client can make within a time window, protecting the API from abuse, DoS attacks, and accidental traffic spikes. It ensures fair resource distribution among all consumers. Common algorithms: Token Bucket, Leaky Bucket, Fixed Window, and Sliding Window Log. Rate limit info is typically communicated via `X-RateLimit-*` headers.

```javascript
const rateLimit = new Map(); // In production use Redis

const rateLimiter = (maxRequests, windowMs) => {
  return (req, res, next) => {
    const clientIp = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!rateLimit.has(clientIp)) {
      rateLimit.set(clientIp, []);
    }

    const timestamps = rateLimit.get(clientIp).filter(t => t > windowStart);
    timestamps.push(now);
    rateLimit.set(clientIp, timestamps);

    const remaining = Math.max(0, maxRequests - timestamps.length);

    res.set('X-RateLimit-Limit', maxRequests);
    res.set('X-RateLimit-Remaining', remaining);
    res.set('X-RateLimit-Reset', Math.ceil((windowStart + windowMs) / 1000));

    if (timestamps.length > maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    next();
  };
};

// Apply: 100 requests per 15 minutes
app.use('/api', rateLimiter(100, 15 * 60 * 1000));

// With express-rate-limit package:
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, try again later' }
});
app.use('/api', limiter);
```

---

## 10. What is pagination and what strategies exist (offset-based vs cursor-based)?

Pagination splits large result sets into pages. Offset-based (`LIMIT 10 OFFSET 20`) is simple but slow for large offsets and inconsistent if rows are inserted/deleted between requests. Cursor-based (`WHERE id > last_seen_id LIMIT 10`) is more performant for large datasets, consistent with real-time data, and scalable. Cursor-based is preferred for production APIs.

```javascript
// Offset-based pagination (simple but problematic for large offsets)
app.get('/api/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const { rows } = await db.query(
    'SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  const count = await db.query('SELECT COUNT(*) FROM users');

  res.json({
    data: rows,
    page,
    limit,
    total: parseInt(count.rows[0].count),
    totalPages: Math.ceil(parseInt(count.rows[0].count) / limit)
  });
});

// Cursor-based pagination (preferred for large/real-time data)
app.get('/api/users', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const cursor = req.query.cursor; // last seen id or encoded timestamp

  let query;
  const params = [limit + 1]; // Fetch one extra to know if there's a next page

  if (cursor) {
    query = 'SELECT * FROM users WHERE id > $2 ORDER BY id LIMIT $1';
    params.push(cursor);
  } else {
    query = 'SELECT * FROM users ORDER BY id LIMIT $1';
  }

  const { rows } = await db.query(query, params);
  const hasMore = rows.length > limit;
  if (hasMore) rows.pop();

  res.json({
    data: rows,
    nextCursor: hasMore ? rows[rows.length - 1].id : null
  });
});
```

---

## 11. What is the difference between synchronous and asynchronous APIs (webhooks)?

Synchronous APIs return the response immediately after processing (e.g., REST request-response). Asynchronous APIs (webhooks) send a callback to a registered URL when an event occurs, allowing the server to notify the client without polling. Webhooks are used for event-driven workflows like payment confirmations, CI/CD pipelines, or email delivery status.

```javascript
// Synchronous API: client waits for response
app.post('/api/process-image', async (req, res) => {
  // Image processing takes 30 seconds -- client blocks
  const result = await processImage(req.body.image);
  res.json({ status: 'done', result });
});

// Better: async pattern with a job queue
app.post('/api/process-image', async (req, res) => {
  // Return immediately with a job ID
  const jobId = crypto.randomUUID();
  await queue.add('image-processing', { jobId, image: req.body.image });
  res.status(202).json({ jobId, status: 'processing' }); // 202 Accepted
});

// Client polls for status:
app.get('/api/jobs/:jobId', async (req, res) => {
  const job = await getJobStatus(req.params.jobId);
  res.json(job);
});

// Webhook: server calls client when done
app.post('/webhooks/image-processed', async (req, res) => {
  // Called by our server when image processing completes
  const { jobId, result } = req.body;
  console.log(`Job ${jobId} completed:`, result);
  res.status(200).send('OK'); // Acknowledge receipt
});

// Example webhook server setup
app.post('/webhooks/payment-completed', (req, res) => {
  const event = req.body;
  // Verify signature for security
  const signature = req.headers['x-webhook-signature'];
  if (!verifySignature(JSON.stringify(event), signature, WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  console.log(`Payment ${event.id}: ${event.status}`);
  res.status(200).send('OK');
});
```

---

## 12. What is HATEOAS in the context of REST?

HATEOAS (Hypermedia As The Engine Of Application State) means API responses include links to related actions, allowing clients to discover available operations dynamically without external documentation. It's a key constraint of REST that turns the API into a navigable hypermedia system. In practice, few APIs fully implement HATEOAS due to complexity.

```javascript
// Non-HATEOAS response:
app.get('/api/orders/123', (req, res) => {
  res.json({
    id: 123,
    status: 'shipped',
    items: ['Widget', 'Gadget']
  });
});

// HATEOAS response: includes available actions
app.get('/api/orders/123', (req, res) => {
  const order = getOrder(123);
  const links = [
    { rel: 'self', method: 'GET', href: '/api/orders/123' },
    { rel: 'cancel', method: 'DELETE', href: '/api/orders/123' },
    { rel: 'items', method: 'GET', href: '/api/orders/123/items' }
  ];

  // Add conditional actions based on state
  if (order.status === 'pending') {
    links.push({ rel: 'update', method: 'PUT', href: '/api/orders/123' });
    links.push({ rel: 'pay', method: 'POST', href: '/api/orders/123/payments' });
  }
  if (order.status === 'shipped') {
    links.push({ rel: 'track', method: 'GET', href: '/api/orders/123/tracking' });
  }

  res.json({ ...order, _links: links });
});

// Client navigates dynamically:
// 1. GET /api/orders/123 -> sees "pay" link
// 2. POST /api/orders/123/payments -> no documentation needed
```

---

## 13. What is the purpose of API documentation tools like Swagger/OpenAPI?

OpenAPI (formerly Swagger) is a standard, language-agnostic specification for describing REST APIs. It provides a machine-readable definition (JSON/YAML) of endpoints, request/response schemas, authentication, and parameters. Tools like Swagger UI generate interactive documentation, code generators create client SDKs, and validators ensure API consistency.

```javascript
// OpenAPI 3.0 specification file (openapi.yaml)
// Usually written in YAML, but here's the equivalent structure:

const openApiDoc = {
  openapi: '3.0.0',
  info: { title: 'User API', version: '1.0.0' },
  paths: {
    '/api/users/{id}': {
      get: {
        summary: 'Get user by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'User found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' }
                  }
                }
              }
            }
          },
          '404': { description: 'User not found' }
        }
      },
      delete: {
        summary: 'Delete user',
        security: [{ bearerAuth: [] }],
        responses: {
          '204': { description: 'User deleted' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  }
};

// Using swagger-jsdoc to generate from comments
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: { openapi: '3.0.0', info: { title: 'My API', version: '1.0.0' } },
  apis: ['./routes/*.js'] // Reads JSDoc comments
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

---

## 14. What is the difference between a GraphQL query and a mutation?

In GraphQL, queries are for fetching data and run in parallel (resolvers can be executed simultaneously). Mutations are for modifying data (create, update, delete) and run sequentially (one after another). By convention, queries should be idempotent and side-effect-free. Mutations return the modified data so the client can update its cache.

```javascript
const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = gql`
  type User { id: ID! name: String! email: String! }
  type Query {
    users: [User!]!
    user(id: ID!): User
  }
  type Mutation {
    createUser(name: String!, email: String!): User!
    updateUser(id: ID!, name: String): User
    deleteUser(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      const { rows } = await db.query('SELECT * FROM users');
      return rows;
    },
    user: async (_, { id }) => {
      const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
      return rows[0];
    }
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      const { rows } = await db.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [name, email]
      );
      return rows[0];
    },
    updateUser: async (_, { id, name }) => {
      const { rows } = await db.query(
        'UPDATE users SET name = COALESCE($1, name) WHERE id = $2 RETURNING *',
        [name, id]
      );
      return rows[0];
    },
    deleteUser: async (_, { id }) => {
      await db.query('DELETE FROM users WHERE id = $1', [id]);
      return true;
    }
  }
};

// Client query:
// query { users { name email } }

// Client mutation:
// mutation { createUser(name: "Bob", email: "bob@x.com") { id name } }
```

---

## 15. What is over-fetching and under-fetching, and how does GraphQL solve it?

Over-fetching is when an API returns more data than the client needs (e.g., REST `/users/1` returns all fields when only `name` is needed). Under-fetching is when an API doesn't return enough data, forcing the client to make multiple requests (e.g., get user + get posts + get followers). GraphQL solves both by letting the client specify exactly which fields and nested relations it needs in a single request.

```javascript
// REST over-fetching: get user returns ALL fields
// GET /api/users/1
{
  "id": 1, "name": "Alice", "email": "alice@x.com",
  "phone": "555-0100", "address": "123 Main St",   // Not needed
  "birthDate": "1990-01-01", "createdAt": "2020-01-01"  // Not needed
}

// REST under-fetching: need user + posts + followers
const user = await fetch('/api/users/1').then(r => r.json());
const posts = await fetch('/api/users/1/posts').then(r => r.json()); // Extra request
const followers = await fetch('/api/users/1/followers').then(r => r.json()); // Extra request

// GraphQL: single request, exactly what's needed
const query = `
  query {
    user(id: 1) {
      name
      posts { title, createdAt }
      followers { name }
    }
  }
`;

const { data } = await fetch('/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query })
}).then(r => r.json());
// Response: only "name", "posts" with "title"+"createdAt", "followers" with "name"
// No over-fetching (no email/phone/address), no under-fetching (posts+followers in one call)
```

---

## 16. What is CORS and why does it matter for APIs?

CORS (Cross-Origin Resource Sharing) is a browser security mechanism that restricts web pages from making requests to a different origin (protocol, domain, port) than the one that served the page. APIs must include CORS headers (`Access-Control-Allow-Origin`, etc.) to explicitly permit cross-origin requests. Without proper CORS configuration, browsers block legitimate API calls from frontend apps.

```javascript
const express = require('express');
const app = express();

// Manual CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://myapp.com'); // or '*' for public APIs
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight for 24h

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

// Using the cors package
const cors = require('cors');

// Allow all (public API)
app.use(cors());

// Specific origin with credentials
app.use(cors({
  origin: ['https://myapp.com', 'https://admin.myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}));

// Dynamic origin based on request
app.use(cors({
  origin: (origin, callback) => {
    const allowed = ['https://myapp.com', 'https://staging.myapp.com'];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
```

---

## 17. How do you handle error responses consistently in an API?

Consistent error handling uses a standard error response format (e.g., `{ error: string, code: string, details?: any }`), a global error middleware, and proper HTTP status codes. Define an AppError class with status and code, throw it anywhere, and let centralized middleware format the response. Include a correlation ID for debugging.

```javascript
// Custom error class
class AppError extends Error {
  constructor(message, statusCode, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

// Usage: throw new AppError('User not found', 404, 'USER_NOT_FOUND');

// Global error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const response = {
    error: err.message || 'Internal server error',
    code: err.code || 'INTERNAL_ERROR',
    requestId: req.id // correlation ID from middleware
  };

  // Add validation errors in development
  if (err.validationErrors) {
    response.details = err.validationErrors;
  }

  // Log internally
  console.error(`[${req.id}] ${statusCode} ${err.code}: ${err.message}`);

  res.status(statusCode).json(response);
});

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Controller using consistent errors
app.get('/api/users/:id', asyncHandler(async (req, res) => {
  const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
  if (!rows.length) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }
  res.json(rows[0]);
}));

// Validation with consistent errors
app.post('/api/users', asyncHandler(async (req, res) => {
  const errors = [];
  if (!req.body.name) errors.push({ field: 'name', message: 'Name is required' });
  if (!req.body.email) errors.push({ field: 'email', message: 'Email is required' });

  if (errors.length) {
    const err = new AppError('Validation failed', 400, 'VALIDATION_ERROR');
    err.validationErrors = errors;
    throw err;
  }

  const { rows } = await db.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [req.body.name, req.body.email]);
  res.status(201).json(rows[0]);
}));
```

---

## 18. What is the difference between a public API and a private/internal API?

A public API is exposed to external consumers (third-party developers, partners) and requires robust authentication (API keys, OAuth), rate limiting, documentation, versioning, and SLAs. A private/internal API is used within an organization's services, typically on a private network, and may use simpler auth (service tokens, mTLS) with less strict rate limits and no public documentation.

```javascript
// Public API: strict auth, rate limiting, full validation
const publicApi = express.Router();

publicApi.use(rateLimiter(100, 15 * 60 * 1000)); // 100 req/15min

publicApi.use(async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return res.status(401).json({ error: 'API key required' });

  const key = await db.query('SELECT * FROM api_keys WHERE key = $1 AND active = true', [apiKey]);
  if (!key.rows.length) return res.status(403).json({ error: 'Invalid API key' });

  req.clientId = key.rows[0].client_id;
  next();
});

publicApi.get('/v1/products', async (req, res) => {
  // Public API returns limited fields
  const { rows } = await db.query('SELECT id, name, price FROM products WHERE active = true');
  res.json(rows);
});

// Internal API: simple auth, no rate limiting, full data
const internalApi = express.Router();

internalApi.use(async (req, res, next) => {
  const token = req.headers['x-service-token'];
  if (token !== INTERNAL_SERVICE_TOKEN) return res.status(403).end();
  next();
});

internalApi.get('/products', async (req, res) => {
  // Internal API returns all fields including sensitive data
  const { rows } = await db.query('SELECT * FROM products');
  res.json(rows);
});
```

---

## 19. What is an API gateway and what role does it play in microservices?

An API gateway is a single entry point that routes requests to appropriate microservices, handling cross-cutting concerns like authentication, rate limiting, load balancing, caching, request transformation, and monitoring. It decouples clients from backend services and can aggregate responses from multiple services into one response (backend for frontend pattern).

```javascript
// Simplified API gateway using Express http-proxy-middleware
const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const app = express();

// Common gateway middleware
app.use(rateLimiter(1000, 15 * 60 * 1000));
app.use(authenticateRequest);

// Route to user service
app.use('/api/users', createProxyMiddleware({
  target: 'http://user-service:3001',
  changeOrigin: true
}));

// Route to order service
app.use('/api/orders', createProxyMiddleware({
  target: 'http://order-service:3002',
  changeOrigin: true
}));

// Route to payment service
app.use('/api/payments', createProxyMiddleware({
  target: 'http://payment-service:3003',
  changeOrigin: true
}));

// Aggregation: combine multiple service responses
app.get('/api/dashboard', async (req, res) => {
  const [user, orders, notifications] = await Promise.all([
    fetch('http://user-service:3001/users/me').then(r => r.json()),
    fetch('http://order-service:3002/orders?limit=5').then(r => r.json()),
    fetch('http://notification-service:3004/notifications').then(r => r.json()),
  ]);

  res.json({ user, recentOrders: orders, notifications });
});

// Gateway handles:
// - Authentication (JWT verification)
// - Rate limiting
// - Request logging
// - Response transformation
// - Circuit breaking
// - Load balancing
```

---

## 20. What is gRPC and how does it differ from REST?

gRPC is a high-performance RPC framework using Protocol Buffers for serialization and HTTP/2 for transport. It supports bidirectional streaming, flow control, and typed contracts defined in `.proto` files. Unlike REST (text-based JSON/XML, HTTP/1.1, request-response), gRPC is binary, faster, enforces strict typing, and generates client/server code automatically for multiple languages.

```javascript
// proto/user.proto (contract definition)
// syntax = "proto3";
// package user;
// service UserService {
//   rpc GetUser (GetUserRequest) returns (User);
//   rpc ListUsers (ListUsersRequest) returns (stream User);
// }
// message GetUserRequest { int32 id = 1; }
// message User { int32 id = 1; string name = 2; string email = 3; }

// gRPC server (Node.js)
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('user.proto');
const proto = grpc.loadPackageDefinition(packageDef).user;

const server = new grpc.Server();
server.addService(proto.UserService.service, {
  GetUser: async (call, callback) => {
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [call.request.id]);
    if (!rows.length) return callback({ code: grpc.status.NOT_FOUND });
    callback(null, rows[0]);
  },
  ListUsers: async (call) => {
    const { rows } = await db.query('SELECT * FROM users');
    for (const user of rows) {
      call.write(user); // Streaming response
    }
    call.end();
  }
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
});

// REST equivalent for comparison:
// GET /api/users/1 -> JSON response
// gRPC advantages: binary (smaller), streaming, typed, auto-generated clients
```

---

## 21. What is the difference between long polling, WebSockets, and Server-Sent Events?

Long polling: client sends a request, server holds the connection until new data exists, then responds; client immediately re-requests. WebSocket: full-duplex persistent connection between client and server for real-time bidirectional communication. SSE (Server-Sent Events): unidirectional (server to client) over HTTP, simpler than WebSocket, auto-reconnects, but limited to text data and no binary support.

```javascript
// Long polling: client repeatedly requests, server holds until data
app.get('/api/poll', async (req, res) => {
  const timeout = setTimeout(() => {
    res.json({ data: null, timeout: true }); // Return empty after 30s
  }, 30000);

  // Wait for new data (e.g., via event emitter)
  const onNewData = (data) => {
    clearTimeout(timeout);
    res.json({ data, timeout: false });
  };
  eventEmitter.once('new-data', onNewData);
});

// Server-Sent Events (SSE): one-way server-to-client
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const interval = setInterval(() => {
    // Each message starts with "data: " and ends with "\n\n"
    res.write(`data: ${JSON.stringify({ time: new Date() })}\n\n`);
  }, 1000);

  req.on('close', () => clearInterval(interval));
});

// Client-side SSE:
const source = new EventSource('/api/events');
source.onmessage = (event) => console.log('SSE:', JSON.parse(event.data));

// WebSocket: full-duplex bidirectional
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    // Server receives message
    const data = JSON.parse(msg);
    // Broadcast to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ user: data.user, message: data.message }));
      }
    });
  });
});
// Client: new WebSocket('ws://localhost:8080');
```

---

## 22. How would you secure a public-facing API?

Secure a public API with: TLS/HTTPS (mandatory), authentication (API keys, JWT, OAuth2), rate limiting, input validation/sanitization, CORS configuration, IP whitelisting (if applicable), request signing (HMAC), and security headers (Helmet). Implement logging, monitoring, and a Web Application Firewall (WAF). Never expose internal IDs, stack traces, or sensitive data in responses.

```javascript
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { expressjwt } = require('express-jwt');
const app = express();

// 1. TLS handled by reverse proxy (nginx, load balancer)

// 2. Security headers
app.use(helmet()); // Content-Security-Policy, X-Content-Type-Options, etc.

// 3. Rate limiting
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
}));

// 4. Authentication (JWT)
app.use('/api', expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  credentialsRequired: false // Optional auth for some endpoints
}));

// 5. Input validation
const { body, validationResult } = require('express-validator');
app.post('/api/users',
  body('email').isEmail().normalizeEmail(),
  body('name').trim().isLength({ min: 1, max: 100 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
);

// 6. CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 7. Request logging (but never log tokens/bodies fully)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// 8. Never expose stack traces
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: 'Internal server error',
    requestId: req.id
    // No stack trace, no internal details
  });
});
```

---

## 23. What is content negotiation in HTTP APIs?

Content negotiation allows a client and server to agree on the format of exchanged data. The client indicates preferences via `Accept` header (response format: `application/json`, `application/xml`) and `Content-Type` header (request format). The server selects the best supported format and responds accordingly. This enables the same API endpoint to serve JSON, XML, or other formats.

```javascript
const express = require('express');
const app = express();

// Content negotiation based on Accept header
app.get('/api/users/:id', (req, res) => {
  const user = { id: 1, name: 'Alice', email: 'alice@x.com' };

  res.format({
    'application/json': () => {
      res.json(user);
    },
    'application/xml': () => {
      res.type('application/xml');
      res.send(`<user><id>${user.id}</id><name>${user.name}</name><email>${user.email}</email></user>`);
    },
    'text/csv': () => {
      res.type('text/csv');
      res.send('id,name,email\n1,Alice,alice@x.com');
    },
    'default': () => {
      res.status(406).json({ error: 'Not acceptable', supportedTypes: ['application/json', 'application/xml'] });
    }
  });
});

// Client sends: Accept: application/xml
// Server responds with XML

// Input content negotiation
app.post('/api/users', (req, res) => {
  const contentType = req.headers['content-type'];
  let data;

  if (contentType === 'application/json') {
    data = req.body; // Already parsed by express.json()
  } else if (contentType === 'application/xml') {
    // Parse XML body manually
    data = parseXml(req.body);
  } else {
    return res.status(415).json({ error: 'Unsupported media type' });
  }

  res.status(201).json(data);
});

// Wildcard Accept header handling
req.headers.accept = 'application/json; q=1.0, application/xml; q=0.5';
// q=1.0 is highest priority (JSON preferred)
```

---

## 24. What is the difference between a stateless and stateful API design?

A stateless API (RESTful) does not store any client context on the server — each request contains all necessary information (authentication token, parameters), making it horizontally scalable and resilient to server failures. A stateful API stores session data on the server (memory, Redis, DB), requiring sticky sessions or shared state storage. Stateless is preferred for microservices and modern cloud architectures.

```javascript
// Stateless API: no server-side session, JWT carries all context
app.post('/api/orders', authenticateJWT, async (req, res) => {
  // All context from JWT token
  const userId = req.user.userId;
  const { items, shippingAddress } = req.body;

  const order = await createOrder(userId, items, shippingAddress);
  res.status(201).json(order);
});

app.get('/api/orders/:id', authenticateJWT, async (req, res) => {
  const order = await getOrder(req.params.id, req.user.userId); // Authorize by user
  res.json(order);
});
// Each request is self-contained; no session lookup needed
// Can scale to N servers behind a load balancer

// Stateful API: server stores session/state
app.post('/api/checkout/start', async (req, res) => {
  // Start multi-step checkout, save state in Redis
  const sessionId = crypto.randomUUID();
  const cart = await getCart(req.cookies.sessionId);

  await redis.set(`checkout:${sessionId}`, JSON.stringify({
    step: 1, cart, userId: req.user.userId, shipping: null, payment: null
  }), 'EX', 3600);

  res.json({ sessionId, step: 1, cart });
});

app.post('/api/checkout/shipping', async (req, res) => {
  const sessionData = await redis.get(`checkout:${req.body.sessionId}`);
  if (!sessionData) return res.status(400).json({ error: 'Checkout session expired' });

  const session = JSON.parse(sessionData);
  session.step = 2;
  session.shipping = req.body.address;
  await redis.set(`checkout:${req.body.sessionId}`, JSON.stringify(session), 'EX', 3600);

  res.json({ step: 2 });
});
// Stateful requires shared state (Redis) across servers or sticky sessions
```

---
