<!--LANG:roman-->

# System Design Interview Questions

## 1. How would you design a URL shortening service like Bitly?

**Asaan Urdu mein:**  
URL shortener ka kaam lambi URLs ko chhote, unique codes mein map karna hota hai. Hum auto‑increment ID ko Base62 encoding se short code banate hain ya phir MD5/SHA‑256 ka truncated version use kar sakte hain. Mapping relational DB mein short code ko primary key bana kar store karte hain. Read‑heavy traffic ke liye Redis cache popular mappings ko rakhta hai. Redirects ke liye HTTP 301 (permanent) ya 302 (temporary) use karte hain.

```javascript
// Base62 short code generation from auto-incrementing ID:
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function encodeBase62(num) {
  let short = '';
  while (num > 0) {
    short = BASE62[num % 62] + short;
    num = Math.floor(num / 62);
  }
  return short || '0';
}

// API endpoints:
app.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  const id = await redis.incr('url_counter'); // Distributed counter
  const shortCode = encodeBase62(id);
  await db.query('INSERT INTO urls (short_code, long_url) VALUES ($1, $2)', [shortCode, longUrl]);
  await redis.set(`url:${shortCode}`, longUrl);
  res.json({ shortUrl: `https://short.url/${shortCode}` });
});

app.get('/:code', async (req, res) => {
  let longUrl = await redis.get(`url:${req.params.code}`);
  if (!longUrl) {
    const row = await db.query('SELECT long_url FROM urls WHERE short_code = $1', [req.params.code]);
    if (!row) return res.status(404).end();
    longUrl = row.long_url;
    await redis.set(`url:${req.params.code}`, longUrl, 'EX', 86400);
  }
  await redis.incr(`click:${req.params.code}`);
  res.redirect(301, longUrl);
});
```

---



---

## 2. How would you design a rate limiter?

**Asaan Urdu mein:**  
Rate limiter har client (IP, API key, user) ki request frequency ko control karta hai. Token bucket burst allow karta hai, leaky bucket traffic ko smooth karta hai, aur sliding window precise counting deta hai. Distributed implementation ke liye Redis sorted sets ya counters with TTL use karte hain. Limit exceed hone par HTTP 429 aur Retry‑After header bhejte hain.

```javascript
// Sliding window counter rate limiter with Redis:
const redis = require('redis');
const client = redis.createClient();

async function rateLimit(key, maxRequests, windowSeconds) {
  const window = Math.floor(Date.now() / 1000 / windowSeconds) * windowSeconds;
  const redisKey = `ratelimit:${key}:${window}`;
  const count = await client.incr(redisKey);
  if (count === 1) await client.expire(redisKey, windowSeconds);
  return count <= maxRequests;
}

// Express middleware:
const rateLimiter = (maxReqs = 100, windowSecs = 60) => async (req, res, next) => {
  const key = req.headers['x-api-key'] || req.ip;
  const allowed = await rateLimit(key, maxReqs, windowSecs);
  if (!allowed) {
    return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
  }
  next();
};

// Token bucket implementation (allows bursts):
function tokenBucket(capacity, refillRate, refillIntervalMs) {
  let tokens = capacity;
  let lastRefill = Date.now();
  return () => {
    const now = Date.now();
    const elapsed = now - lastRefill;
    tokens = Math.min(capacity, tokens + (elapsed / refillIntervalMs) * refillRate);
    lastRefill = now;
    if (tokens >= 1) { tokens--; return true; }
    return false;
  };
}
```

---



---

## 3. How would you design a scalable notification system?

**Asaan Urdu mein:**  
Notification system emails, SMS, push notifications ko asynchronously deliver karta hai. Producer service ek message queue (Kafka ya RabbitMQ) mein notification event push karta hai. Consumer service us queue ko read karke third‑party providers ko send karta hai, retry aur dead‑letter queues ke saath. Batching aur rate‑limiting se spam flag hone se bachate hain.

```javascript
// Notification service producer:
const amqp = require('amqplib');

async function sendNotification(userId, type, payload) {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertQueue('notifications', { durable: true });
  
  const notification = {
    userId,
    type, // 'email' | 'sms' | 'push'
    payload,
    priority: payload.priority || 'normal',
    timestamp: Date.now()
  };
  ch.sendToQueue('notifications', Buffer.from(JSON.stringify(notification)), { persistent: true });
}

// Consumer with retry logic:
async function processNotifications() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertQueue('notifications', { durable: true });
  await ch.assertQueue('dlq', { durable: true }); // Dead letter queue
  
  ch.consume('notifications', async (msg) => {
    const { type, payload } = JSON.parse(msg.content.toString());
    try {
      if (type === 'email') await emailProvider.send(payload);
      if (type === 'sms') await smsProvider.send(payload);
      if (type === 'push') await pushProvider.send(payload);
      ch.ack(msg);
    } catch (err) {
      const retryCount = (msg.properties.headers?.['x-retry'] || 0);
      if (retryCount < 3) {
        ch.sendToQueue('notifications', msg.content, {
          headers: { 'x-retry': retryCount + 1 },
          expiration: Math.pow(2, retryCount) * 60000 // Exponential backoff
        });
      } else {
        ch.sendToQueue('dlq', msg.content); // Dead letter
      }
      ch.ack(msg);
    }
  });
}
```

---



---

## 4. How would you design a chat application (like WhatsApp)?

**Asaan Urdu mein:**  
Real‑time messaging ke liye WebSockets (Socket.io) use karte hain. Har message ko DB (Cassandra/DynamoDB) mein persist karte hain aur Redis pub/sub se cross‑server fan‑out karte hain. Presence tracking heartbeat ke through hoti hai. Group chats ke liye write‑time fan‑out ya read‑time fan‑out dono strategies apply ki ja sakti hain.

```javascript
// WebSocket chat server using Socket.io:
const io = require('socket.io')(server);
const redis = require('redis');
const pub = redis.createClient();
const sub = redis.createClient();

io.on('connection', (socket) => {
  socket.on('join', (roomId) => socket.join(roomId));
  
  socket.on('message', async (msg) => {
    const message = {
      id: uuidv4(),
      sender: socket.userId,
      text: msg.text,
      roomId: msg.roomId,
      timestamp: Date.now()
    };
    // Persist to database
    await db.query('INSERT INTO messages (id, sender, text, room_id, ts) VALUES ($1,$2,$3,$4,$5)',
      [message.id, message.sender, message.text, message.roomId, message.timestamp]);
    // Publish to Redis for cross-server fan-out
    pub.publish(`room:${msg.roomId}`, JSON.stringify(message));
    io.to(msg.roomId).emit('message', message);
  });

  // Presence tracking
  socket.on('presence', async (status) => {
    await redis.set(`presence:${socket.userId}`, status);
    socket.broadcast.emit('presence', { userId: socket.userId, status });
  });
});

// Subscribe to Redis channels for horizontal scaling:
sub.on('message', (channel, data) => {
  const roomId = channel.split(':')[1];
  io.to(roomId).emit('message', JSON.parse(data));
});
```

---



---

## 5. What is the difference between horizontal and vertical scaling in system design?

**Asaan Urdu mein:**  
Vertical scaling ek machine ki CPU, RAM ya storage ko badhata hai – simple lekin hardware limit hoti hai aur single point of failure hota hai. Horizontal scaling multiple machines add karta hai, load balancer ke through traffic distribute hota hai, isse fault tolerance aur near‑unlimited capacity milti hai. Cloud era mein stateless design ke saath horizontal scaling preferred hai.

| Aspect               | Vertical Scaling                              | Horizontal Scaling                              |
|----------------------|-----------------------------------------------|-------------------------------------------------|
| **Resource Change** | Upgrade single server (CPU, RAM, SSD)        | Add more servers to a pool                      |
| **Complexity**       | Low (no code change)                         | Higher (load balancer, distributed state)       |
| **Fault Tolerance**  | Single point of failure                       | Redundant nodes, self‑healing                  |
| **Scalability Limit**| Hardware ceiling                              | Near‑infinite (add nodes)                      |
| **Typical Use**      | Small apps, legacy monoliths                 | Large web services, microservices               |

```javascript
// Vertical scaling: upgrade server specs
// $ t2.micro -> t2.large -> t2.xlarge
// Pros: No code changes, simple
// Cons: Downtime for upgrades, hardware limits, no fault tolerance

// Horizontal scaling: add more servers behind a load balancer
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers for horizontal scaling across CPU cores
  for (let i = 0; i < numCPUs; i++) cluster.fork();
  
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Forking replacement...`);
    cluster.fork(); // Self-healing
  });
} else {
  // Each worker runs the same Express app
  const app = require('./app');
  app.listen(3000);
}

// For true horizontal scaling across machines:
// - Make app stateless (session in Redis, not in-memory)
// - Use a load balancer (Nginx, ALB) to distribute traffic
// - Share state via external stores (Redis, DB)
```

---



---

## 6. What is the CAP theorem and how does it apply to distributed systems?

**Asaan Urdu mein:**  
CAP theorem kehta hai ke distributed system ek waqt mein **Consistency**, **Availability**, ya **Partition Tolerance** teen mein se sirf do guarantee kar sakta hai. Network partition hamesha ho sakta hai, isliye systems ya to CP (consistency over availability) ya AP (availability over consistency) choose karte hain. NoSQL databases is trade‑off ko illustrate karte hain.

| Model | Guarantees | Typical Use |
|-------|-------------|-------------|
| **CP** | Strong consistency, partition tolerant, may reject requests during partition | Financial transactions, inventory |
| **AP** | High availability, partition tolerant, eventual consistency | Social feeds, product catalogs |

```javascript
// CP system (Consistency + Partition Tolerance): Traditional RDBMS, HBase
// - Waits for all replicas to agree before responding
// - May reject requests during partition
// - Use case: Financial transactions, inventory management

// AP system (Availability + Partition Tolerance): Cassandra, DynamoDB
// - Responds immediately even if replicas disagree
// - Uses eventual consistency
// - Use case: Social media feeds, product catalogs

// Example: AP design for a product catalog
const product = await cache.get(productId).catch(() => null);
if (product) return res.json(product); // Serve stale data while DB is partitioned
const fresh = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
cache.set(productId, fresh);
res.json(fresh);

// Example: CP design for a bank transfer
try {
  await db.query('BEGIN');
  await db.query('UPDATE accounts SET balance = balance - 100 WHERE id = $1', [from]);
  await db.query('UPDATE accounts SET balance = balance + 100 WHERE id = $1', [to]);
  await db.query('COMMIT'); // All-or-nothing - partition causes reject
} catch (e) {
  await db.query('ROLLBACK');
  res.status(503).json({ error: 'Service unavailable, try again' });
}
```

---



---

## 7. What is the difference between SQL and NoSQL databases, and when would you choose one over the other?

**Asaan Urdu mein:**  
SQL databases (PostgreSQL, MySQL) fixed schema, ACID transactions, aur complex joins support karte hain – data integrity ke liye best. NoSQL (MongoDB, Cassandra, Redis) flexible schema, horizontal scaling, aur specific access patterns ke liye optimized hoti hain. Jab complex relational queries aur strong consistency chahiye ho to SQL, aur jab high write throughput, schema flexibility ya hierarchical data chahiye ho to NoSQL use karte hain.

| Feature                | **SQL**                              | **NoSQL**                                 |
|------------------------|--------------------------------------|-------------------------------------------|
| Schema                 | Fixed, relational                    | Flexible, document/column/key-value       |
| Transactions           | Full ACID                            | Limited (often eventual consistency)      |
| Scaling                | Vertical (with sharding add‑on)      | Horizontal (native)                        |
| Query Capability      | Joins, complex aggregations          | Simple lookups, map‑reduce, denormalized   |
| Typical Use Cases      | Finance, ERP, reporting              | Catalogs, logs, real‑time feeds            |

```javascript
// SQL - structured schema with relationships:
const user = await db.query(`
  SELECT u.*, o.total 
  FROM users u 
  JOIN orders o ON o.user_id = u.id 
  WHERE u.email = $1
`, [email]);

// NoSQL (MongoDB) - embedded documents:
const order = await db.collection('orders').insertOne({
  userId: user._id,
  items: [
    { productId: 'p1', name: 'Laptop', price: 999 },
    { productId: 'p2', name: 'Mouse', price: 25 }
  ],
  total: 1024,
  status: 'pending',
  createdAt: new Date()
});
// No joins needed - all order data in one document

// Decision guide:
// SQL when: complex queries, joins, ACID compliance, structured data
// NoSQL when: flexible schema, high write throughput, simple queries at scale
// Often hybrid: SQL for core transactions + Redis for caching/real-time
```

---



---

## 8. How would you design a caching layer for a high-traffic web application?

**Asaan Urdu mein:**  
Multi‑tier cache use karte hain: browser cache (Cache‑Control), CDN for static assets, aur application‑level cache (Redis/Memcached) for dynamic data. **Cache‑aside** pattern sabse common hai – pehle cache check, miss par DB se fetch, phir cache populate. TTLs set karte hain, consistent hashing se distributed cache balance hota hai, aur data update hone par cache invalidate karte hain.

```javascript
// Cache-aside pattern with Redis:
const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });

async function getProduct(productId) {
  // Step 1: Check cache
  const cached = await client.get(`product:${productId}`);
  if (cached) return JSON.parse(cached);

  // Step 2: Cache miss - load from DB
  const product = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
  if (!product) return null;

  // Step 3: Populate cache with TTL
  await client.setEx(`product:${productId}`, 3600, JSON.stringify(product));
  return product;
}

// Cache invalidation on update:
async function updateProduct(productId, updates) {
  // Update database
  await db.query('UPDATE products SET name = $1, price = $2 WHERE id = $3',
    [updates.name, updates.price, productId]);
  // Invalidate cache
  await client.del(`product:${productId}`);
}

// Write-through cache (always keep cache fresh):
async function createProduct(product) {
  const result = await db.query('INSERT INTO products ... RETURNING *', [...]);
  await client.setEx(`product:${result.id}`, 3600, JSON.stringify(result));
  return result;
}
```

---



---

## 9. What is database sharding and when is it needed?

**Asaan Urdu mein:**  
Sharding horizontal partitioning hai jisme data ko multiple servers (shards) mein distribute karte hain based on a **shard key**. Jab single server ki storage ya write throughput limit cross ho jati hai, tab sharding zaroori hoti hai. Common strategies: range‑based, hash‑based, ya geographic sharding. Sharding se cross‑shard queries costly ho jate hain, aur rebalancing complex hota hai.

```javascript
// Hash-based sharding implementation:
function getShard(key, totalShards) {
  const hash = require('crypto').createHash('md5').update(key).digest('hex');
  const shardNum = parseInt(hash.substring(0, 8), 16) % totalShards;
  return `shard_${shardNum}`;
}

// Shard routing in application:
const shards = {
  shard_0: new Pool({ host: 'db0.example.com', database: 'shard0' }),
  shard_1: new Pool({ host: 'db1.example.com', database: 'shard1' }),
  shard_2: new Pool({ host: 'db2.example.com', database: 'shard2' }),
};

async function getUser(userId) {
  const shardKey = String(userId);
  const shard = getShard(shardKey, 3);
  return shards[shard].query('SELECT * FROM users WHERE id = $1', [userId]);
}

// Considerations:
// - Choose shard key carefully (must distribute evenly, must be in most queries)
// - Cross-shard queries are expensive (use scatter‑gather or avoid)
// - Rebalancing shards when adding/removing nodes is complex
// - Consider using managed solutions (Vitess, CockroachDB, Spanner)
```

---



---

## 10. What is database replication and what are its trade‑offs?

**Asaan Urdu mein:**  
Replication primary (master) se ek ya zyada replicas (slaves) tak data copy karta hai. Reads ko replicas pe offload kar ke throughput badhata hai, aur failover se high availability milti hai. Trade‑offs: replication lag (eventual consistency), write amplification, multi‑master conflicts, aur operational complexity.

```javascript
// PostgreSQL replication setup (replica reads only):
const { Pool } = require('pg');

// Primary pool (handles writes):
const primary = new Pool({ host: 'primary-db.example.com', database: 'myapp' });

// Replica pool (handles reads - can have multiple):
const replica = new Pool({ host: 'replica-db.example.com', database: 'myapp' });

// Query router - send writes to primary, reads to replica:
async function query(sql, params, isWrite = false) {
  const pool = isWrite ? primary : replica;
  return pool.query(sql, params);
}

// Example usage:
const user = await query('SELECT * FROM users WHERE id = $1', [id]); // Replica
await query('UPDATE users SET name = $1 WHERE id = $2', [name, id], true); // Primary

// Trade-offs:
// - Replication lag: replica may be seconds behind primary
// - Read-after-write: after a write, read from primary to see your own updates
// - Failover: promote replica to primary on crash (can lose in‑flight data)
```

---



---

## 11. How would you design a news feed system (like Twitter/Facebook)?

**Asaan Urdu mein:**  
News feed ke liye **fan‑out on write** (push) approach use karte hain – jab user post karta hai to uske followers ke feed lists (Redis lists) mein push kar dete hain. Celebrities jinke followers millions hain, unke liye **fan‑out on read** (pull) use karte hain – timeline ko runtime pe query karte hain. Pagination cursor‑based hoti hai, aur ranking recency ya engagement score se hoti hai.

```javascript
// Fan-out on write (push model) for regular users:
async function createPost(userId, content) {
  const post = await db.query(
    'INSERT INTO posts (user_id, content, created_at) VALUES ($1, $2, NOW()) RETURNING *',
    [userId, content]
  );

  // Push post to all followers' feed lists
  const followers = await db.query('SELECT follower_id FROM follows WHERE user_id = $1', [userId]);
  const pipeline = redis.pipeline();
  for (const { follower_id } of followers.rows) {
    pipeline.lPush(`feed:${follower_id}`, JSON.stringify(post));
    pipeline.lTrim(`feed:${follower_id}`, 0, 500); // Keep last 500 posts
  }
  await pipeline.exec();
}

// Fan-out on read (pull model) for celebrities:
async function getFeed(userId, cursor, limit = 20) {
  const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
  
  if (user.is_celebrity) {
    // Pull from followed celebrities' posts at read time
    const posts = await db.query(`
      SELECT p.* FROM posts p
      JOIN follows f ON f.user_id = p.user_id
      WHERE f.follower_id = $1 AND p.id < $2
      ORDER BY p.created_at DESC LIMIT $3
    `, [userId, cursor || '999999999', limit]);
    return posts.rows;
  }

  // Push model: read pre‑computed feed from cache
  const raw = await redis.lRange(`feed:${userId}`, 0, limit);
  return raw.map(JSON.parse);
}
```

---



---

## 12. What is a load balancer and what algorithms do load balancers commonly use?

**Asaan Urdu mein:**  
Load balancer incoming traffic ko multiple backend servers pe distribute karta hai taake throughput badhe, latency kam ho, aur overload na ho. Common algorithms: **Round Robin**, **Least Connections**, **IP Hash** (sticky sessions), **Weighted Round Robin**, aur **Random**. Algorithm choice workload pattern aur server heterogeneity pe depend karta hai.

| Algorithm            | How it works                              | When to use |
|----------------------|-------------------------------------------|-------------|
| **Round Robin**      | Cycles through servers sequentially       | Uniform traffic |
| **Least Connections**| Picks server with fewest active connections| Varying request lengths |
| **IP Hash**          | Hashes client IP → same server (session stickiness) | Stateful apps |
| **Weighted RR**      | Assigns weights, servers with higher capacity get more traffic | Heterogeneous servers |
| **Random**           | Picks a server randomly (good for large pools) | Simple setups |

```javascript
// Round-robin load balancer simulation:
class LoadBalancer {
  constructor(servers) {
    this.servers = servers;
    this.counter = 0;
  }

  roundRobin() {
    const server = this.servers[this.counter % this.servers.length];
    this.counter++;
    return server;
  }

  leastConnections(connections) {
    return this.servers.reduce((min, s) => connections[s] < connections[min] ? s : min);
  }

  ipHash(ip) {
    const hash = require('crypto').createHash('md5').update(ip).digest('hex');
    const index = parseInt(hash.substring(0, 8), 16) % this.servers.length;
    return this.servers[index];
  }
}

// Nginx upstream configurations:
// Round Robin (default):
// upstream backend {
//     server app1:3000;
//     server app2:3000;
// }

// Least Connections:
// upstream backend {
//     least_conn;
//     server app1:3000;
//     server app2:3000;
// }

// IP Hash (sticky sessions):
// upstream backend {
//     ip_hash;
//     server app1:3000;
//     server app2:3000;
// }
```

---



---

## 13. What is a message queue and when would you use one (Kafka, RabbitMQ)?

**Asaan Urdu mein:**  
Message queue services asynchronous communication enable karti hain – producer messages ko queue mein push karta hai, consumer independently process karta hai. Use cases: service decoupling (order → inventory), load leveling, background workers, aur event‑driven architectures. Kafka high‑throughput streaming ke liye, RabbitMQ reliable delivery aur complex routing ke liye behtar hai.

```javascript
// RabbitMQ - reliable task distribution:
const amqp = require('amqplib');

async function processOrder(order) {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertQueue('orders', { durable: true });
  
  // Producer: send order to queue
  ch.sendToQueue('orders', Buffer.from(JSON.stringify(order)), { persistent: true });
}

// Consumer: process orders from queue (multiple workers can consume)
async function startOrderWorker() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertQueue('orders', { durable: true });
  ch.prefetch(1); // One message at a time per worker
  
  ch.consume('orders', async (msg) => {
    const order = JSON.parse(msg.content.toString());
    try {
      await fulfillOrder(order);
      ch.ack(msg); // Acknowledge successful processing
    } catch (err) {
      ch.nack(msg, false, true); // Requeue on failure
    }
  });
}

// Kafka - high-throughput event streaming:
// const { Kafka } = require('kafkajs');
// const kafka = new Kafka({ brokers: ['kafka:9092'] });
// const producer = kafka.producer();
// await producer.send({
//   topic: 'user-events',
//   messages: [{ key: userId, value: JSON.stringify({ type: 'page_view', url }) }],
// });
```

---



---

## 14. How would you design an e‑commerce checkout system that avoids overselling inventory?

**Asaan Urdu mein:**  
Overselling se bachne ke liye **optimistic locking** (version number) ya **pessimistic locking** (SELECT FOR UPDATE) use karte hain. Checkout ke dauran inventory ko temporarily reserve karte hain (TTL ≈ 15 min). Payments ko idempotent banate hain taake duplicate charges na ho. Order state machine (pending → confirmed → shipped) se consistency maintain hoti hai. Flash sales ke liye purchase requests queue mein serialize karte hain.

```javascript
// Optimistic locking - prevent overselling:
async function purchaseItem(userId, productId, quantity) {
  const result = await db.query(`
    UPDATE inventory 
    SET quantity = quantity - $1, version = version + 1
    WHERE product_id = $2 AND version = $3 AND quantity >= $1
    RETURNING version
  `, [quantity, productId, currentVersion]);

  if (result.rows.length === 0) {
    // Version mismatch or insufficient stock - retry or reject
    throw new Error('Item unavailable, please retry');
  }
  await createOrder(userId, productId, quantity);
}

// Pessimistic locking (SELECT FOR UPDATE):
async function checkoutLocking(cartItems) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    // Lock the inventory rows
    const result = await client.query(
      'SELECT quantity FROM inventory WHERE product_id = $1 FOR UPDATE',
      [cartItems[0].productId]
    );
    if (result.rows[0].quantity < cartItems[0].quantity) {
      throw new Error('Insufficient stock');
    }
    await client.query(
      'UPDATE inventory SET quantity = quantity - $1 WHERE product_id = $2',
      [cartItems[0].quantity, cartItems[0].productId]
    );
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
```

---



---

## 15. What is eventual consistency vs strong consistency?

**Asaan Urdu mein:**  
**Strong consistency** ka matlab hai ke sab nodes turant latest write ko dekhte hain – read hamesha sabse recent value return karta hai. Iske liye coordination latency aur partition ke dauran availability kam ho sakti hai. **Eventual consistency** temporary stale reads allow karta hai, lekin time ke saath sab replicas converge karte hain – higher availability aur lower latency milti hai. Banking ko strong chahiye, social feeds ko eventual.

```javascript
// Strong consistency - read after write always sees the update:
// Requires quorum reads/writes:
// Write: W = all nodes must ack
// Read: R = all nodes must respond with same value
// N = 3, W = 3, R = 3 → full consistency, lowest availability

async function strongWrite(key, value) {
  const promises = replicas.map(r => r.set(key, value));
  await Promise.all(promises); // Wait for ALL replicas
}

async function strongRead(key) {
  const results = await Promise.all(replicas.map(r => r.get(key)));
  // Verify all replicas return the same value
  if (new Set(results).size !== 1) throw new Error('Inconsistent state');
  return results[0];
}

// Eventual consistency - accept stale reads:
// N = 3, W = 1 (write to any one node), R = 1 (read from any node)

async function eventualWrite(key, value) {
  await replicas[0].set(key, value); // Write to one replica
  // Background: async replication to other nodes
}

async function eventualRead(key) {
  return replicas[Math.floor(Math.random() * replicas.length)].get(key);
  // May return stale data - eventually consistent
}

// DynamoDB default: eventual consistency with option for strong consistency
// DynamoDB: ConsistentRead: true → strong, ConsistentRead: false → eventual
```

---



---

## 16. How would you design a file storage system like Google Drive or Dropbox?

**Asaan Urdu mein:**  
File upload ko **chunked** (fixed size parts) karte hain taake resumable uploads ho sake. Metadata relational DB mein store hoti hai, actual blobs object storage (S3/GCS) mein. Content‑addressed storage (hash) se deduplication hoti hai. Sync engine CRDTs ya operational transforms se conflicts resolve karta hai, aur versioning diff‑based storage space save karta hai.

```javascript
// Chunked upload implementation:
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({ region: 'us-east-1' });
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

// Initiate multipart upload:
async function initiateUpload(fileName, totalChunks) {
  const uploadId = uuidv4();
  await db.query(
    'INSERT INTO file_uploads (id, name, total_chunks, status) VALUES ($1, $2, $3, $4)',
    [uploadId, fileName, totalChunks, 'initiated']
  );
  return uploadId;
}

// Upload each chunk:
async function uploadChunk(uploadId, chunkIndex, chunkBuffer) {
  const key = `chunks/${uploadId}/${chunkIndex}`;
  await s3.send(new PutObjectCommand({
    Bucket: 'uploads-bucket',
    Key: key,
    Body: chunkBuffer
  }));
  await db.query(
    'UPDATE file_uploads SET uploaded_chunks = array_append(uploaded_chunks, $1) WHERE id = $2',
    [chunkIndex, uploadId]
  );
}

// Complete upload - merge chunks:
async function completeUpload(uploadId, fileName, userId) {
  const fileId = uuidv4();
  const contentHash = await computeHash(uploadId); // SHA-256 for dedup
  // Check if this file already exists (deduplication)
  const existing = await db.query('SELECT id FROM files WHERE content_hash = $1', [contentHash]);
  if (existing.rows.length > 0) {
    // Just create a reference to existing file
    await createFileReference(fileId, fileName, existing.rows[0].id, userId);
    return fileId;
  }
  await s3.send(new PutObjectCommand({
    Bucket: 'files-bucket',
    Key: fileId,
    CopySource: `uploads-bucket/chunks/${uploadId}/merged`
  }));
  await db.query(
    'INSERT INTO files (id, name, content_hash, owner_id, size, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
    [fileId, fileName, contentHash, userId, totalSize]
  );
  return fileId;
}
```

---



---

## 17. What is the difference between synchronous and asynchronous communication between microservices?

**Asaan Urdu mein:**  
**Synchronous** (HTTP/REST, gRPC) mein caller response ka intezar karta hai – simple but caller ko downstream failure ka impact hota hai. **Asynchronous** (message queues, event streams) mein producer event fire karta hai aur aage ki processing alag service handle karti hai – better resilience and scalability, lekin eventual consistency aur error handling ka extra logic zaroori hota hai.

```javascript
// Synchronous communication (HTTP/REST):
// Service A calls Service B and waits for response
async function createOrder(userId, items) {
  // Blocking call to Payment Service
  const paymentResult = await axios.post('http://payment-service/charge', {
    userId, amount: calculateTotal(items)
  });
  if (paymentResult.status !== 'success') throw new Error('Payment failed');
  
  // Blocking call to Inventory Service
  await axios.post('http://inventory-service/reserve', { items });
  
  return { orderId: uuidv



---

## 18. How would you handle rate limiting and abuse prevention in a public API?

**Asaan Urdu mein:**  
Har API key ke liye Redis mein sliding‑window counter lagaya jata hai taake request ki frequency track ho sake. Free tier ko 100 requests per hour aur pro tier ko 10,000 requests per hour limit di jati hai, aur uske sath IP‑based fallback limit bhi set ki jati hai. Sensitive endpoints jaise login ya registration par captcha lagaya jata hai taake bots ko roka ja sake. Cloudflare WAF ya custom anomaly detection tools se unusual traffic patterns ko monitor karke alerts generate kiye jate hain. Jab limit cross ho jaye to 429 status code ke sath `Retry-After` header bheja jata hai.

```javascript
// Multi-tier rate limiter:
class TieredRateLimiter {
  constructor(redisClient) {
    this.redis = redisClient;
    this.tiers = {
      free: { limit: 100, window: 3600 },     // 100 req/hr
      pro: { limit: 10000, window: 3600 },    // 10000 req/hr
      enterprise: { limit: 100000, window: 3600 }
    };
  }

  async checkLimit(apiKey, ip) {
    const tier = await this.getTier(apiKey);
    const { limit, window } = this.tiers[tier];
    
    // Check per-API-key limit
    const keyCount = await this.slidingWindowCounter(`apikey:${apiKey}`, window);
    if (keyCount >= limit) return { allowed: false, tier };
    
    // Fallback per-IP limit (stricter)
    const ipLimit = tier === 'free' ? 10 : 100;
    const ipCount = await this.slidingWindowCounter(`ip:${ip}`, 60);
    if (ipCount >= ipLimit) return { allowed: false, tier: 'ip_limited' };
    
    return { allowed: true, tier, remaining: limit - keyCount - 1 };
  }

  async slidingWindowCounter(key, windowSec) {
    const now = Math.floor(Date.now() / 1000);
    const windowKey = `rl:${key}:${Math.floor(now / windowSec)}`;
    const count = await this.redis.incr(windowKey);
    if (count === 1) await this.redis.expire(windowKey, windowSec);
    return count;
  }
}

// Express middleware:
app.use(async (req, res, next) => {
  const result = await limiter.checkLimit(req.headers['x-api-key'], req.ip);
  res.setHeader('X-RateLimit-Limit', result.limit);
  res.setHeader('X-RateLimit-Remaining', result.remaining);
  if (!result.allowed) {
    res.setHeader('Retry-After', Math.ceil(result.window));
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
  next();
});
```

---



---

## 19. How would you estimate capacity/back-of-the-envelope numbers for a system design interview?

**Asaan Urdu mein:**  
Sab se pehle Daily Active Users (DAU) ka andaaza lagate hain, phir har user ki average writes aur reads per day se requests per second nikalte hain. Har write ko hum 1 KB storage assume karte hain, is se daily storage aur yearly storage ka calculation hota hai. Example ke taur par 50 million DAU aur 5 writes per user per day se lagbhag 2,900 writes/second milte hain, jo 250 GB per day ya 90 TB per year banta hai. In numbers ko use kar ke sharding strategy, caching layer size, aur network bandwidth ki requirement justify ki jati hai.

```javascript
// Back-of-the-envelope calculator:
class CapacityEstimator {
  constructor(dau) {
    this.dau = dau;
  }

  requestsPerSecond(dailyRequestsPerUser) {
    const totalDaily = this.dau * dailyRequestsPerUser;
    return Math.ceil(totalDaily / (24 * 60 * 60));
  }

  storagePerDay(bytesPerRequest, writesPerUser) {
    const dailyWrites = this.dau * writesPerUser;
    return (dailyWrites * bytesPerRequest) / (1024 * 1024 * 1024); // GB
  }

  bandwidth(bytesPerResponse, readsPerUser) {
    const rps = this.requestsPerSecond(readsPerUser);
    return (rps * bytesPerResponse) / (1024 * 1024); // MB/s
  }
}

// Twitter-like app estimation:
const twt = new CapacityEstimator(50_000_000); // 50M DAU
console.log('Writes/sec:', twt.requestsPerSecond(5));     // ~2900 writes/sec
console.log('Reads/sec:', twt.requestsPerSecond(100));    // ~58,000 reads/sec
console.log('Storage/day:', twt.storagePerDay(1024, 5));  // ~238 GB/day
console.log('Bandwidth:', twt.bandwidth(2048, 100));      // ~116 MB/s

// Memory for caching:
// Cache 20% of reads in Redis (hot data)
const cacheMemory = (0.2 * 58000 * 2048) / (1024 * 1024); // ~23 MB/s (throughput)
const cacheStorage = 0.2 * (238 * 1024 * 1024 * 1024);     // Hot data: ~51 GB (storage)
// ~51 GB Redis cluster needed for hot data
```

---



---

## 20. What is a content delivery network (CDN) and how does it fit into system architecture?

**Asaan Urdu mein:**  
CDN ek globally distributed proxy servers ka network hota hai jo static assets (images, CSS, JS, videos) ko user ke sab se qareeb location se cache karke serve karta hai. Is se latency kam hoti hai, origin servers ka load kam hota hai, aur DDoS attacks ka impact bhi absorb ho jata hai. Architecture mein CDN sab se outer caching layer hoti hai, load balancer ke pehle, aur phir application servers aate hain. Dynamic APIs ke liye bhi short‑TTL caching ya edge computing (Cloudflare Workers, Lambda@Edge) use ki ja sakti hai. Content update hone par CDN cache ko purge karna zaroori hota hai taake fresh data serve ho.

```javascript
// CDN cache configuration via Cache-Control headers:
app.use('/static', express.static('public', {
  maxAge: '30d',
  immutable: true, // File never changes (content-hashed filenames)
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
  }
}));

// API responses with CDN-friendly caching:
app.get('/api/products/:id', async (req, res) => {
  const product = await getProduct(req.params.id);
  res.setHeader('Cache-Control', 'public, max-age=60'); // CDN caches for 60s
  res.json(product);
});

// Purge CDN cache when data changes (e.g., Cloudflare API):
// async function purgeCDN(urls) {
//   await fetch('https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache', {
//     method: 'POST',
//     headers: { Authorization: `Bearer ${CF_TOKEN}` },
//     body: JSON.stringify({ files: urls })
//   });
// }

// CDN architecture flow:
// User → CDN Edge (cache hit → serve immediately)
//                   ↓ (cache miss → fetch from origin)
//              Load Balancer
//                   ↓
//              Application Server
//                   ↓
//              Database
```

<!--LANG:english-->



# System Design Interview Questions

## 1. How would you design a URL shortening service like Bitly?

A URL shortener maps long URLs to short, unique codes (e.g., `bit.ly/abc123`). Use Base62 encoding of an auto-incrementing ID or hash (MD5/SHA-256 truncated) to generate short codes. Store mappings in a relational DB with the short code as primary key. For read-heavy traffic (redirects >> creates), cache popular mappings in Redis. Use HTTP 301 (permanent) redirects for cacheability and 302 (temporary) for analytics tracking.

```javascript
// Base62 short code generation from auto-incrementing ID:
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function encodeBase62(num) {
  let short = '';
  while (num > 0) {
    short = BASE62[num % 62] + short;
    num = Math.floor(num / 62);
  }
  return short || '0';
}

// API endpoints:
app.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  const id = await redis.incr('url_counter'); // Distributed counter
  const shortCode = encodeBase62(id);
  await db.query('INSERT INTO urls (short_code, long_url) VALUES ($1, $2)', [shortCode, longUrl]);
  await redis.set(`url:${shortCode}`, longUrl);
  res.json({ shortUrl: `https://short.url/${shortCode}` });
});

app.get('/:code', async (req, res) => {
  let longUrl = await redis.get(`url:${req.params.code}`);
  if (!longUrl) {
    const row = await db.query('SELECT long_url FROM urls WHERE short_code = $1', [req.params.code]);
    if (!row) return res.status(404).end();
    longUrl = row.long_url;
    await redis.set(`url:${req.params.code}`, longUrl, 'EX', 86400);
  }
  await redis.incr(`click:${req.params.code}`);
  res.redirect(301, longUrl);
});
```

---

## 2. How would you design a rate limiter?

A rate limiter restricts request frequency per client (user, IP, or API key). Common algorithms: token bucket (allows bursts), leaky bucket (smooths traffic), sliding window log (precise), and sliding window counter (efficient). Use Redis sorted sets or counters with TTL for distributed rate limiting. Return HTTP 429 with Retry-After header when limit is exceeded.

```javascript
// Sliding window counter rate limiter with Redis:
const redis = require('redis');
const client = redis.createClient();

async function rateLimit(key, maxRequests, windowSeconds) {
  const window = Math.floor(Date.now() / 1000 / windowSeconds) * windowSeconds;
  const redisKey = `ratelimit:${key}:${window}`;
  const count = await client.incr(redisKey);
  if (count === 1) await client.expire(redisKey, windowSeconds);
  return count <= maxRequests;
}

// Express middleware:
const rateLimiter = (maxReqs = 100, windowSecs = 60) => async (req, res, next) => {
  const key = req.headers['x-api-key'] || req.ip;
  const allowed = await rateLimit(key, maxReqs, windowSecs);
  if (!allowed) {
    return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
  }
  next();
};

// Token bucket implementation (allows bursts):
function tokenBucket(capacity, refillRate, refillIntervalMs) {
  let tokens = capacity;
  let lastRefill = Date.now();
  return () => {
    const now = Date.now();
    const elapsed = now - lastRefill;
    tokens = Math.min(capacity, tokens + (elapsed / refillIntervalMs) * refillRate);
    lastRefill = now;
    if (tokens >= 1) { tokens--; return true; }
    return false;
  };
}
```

---

## 3. How would you design a scalable notification system?

A notification system sends emails, SMS, and push notifications to users. Use a message queue (Kafka/RabbitMQ) to decouple notification generation from delivery. Fan-out notifications to multiple channels via a template service. Handle third-party provider failures with retry queues and dead-letter queues. Batch notifications and rate-limit delivery to avoid being flagged as spam.

```javascript
// Notification service producer:
const amqp = require('amqplib');

async function sendNotification(userId, type, payload) {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertQueue('notifications', { durable: true });
  
  const notification = {
    userId,
    type, // 'email' | 'sms' | 'push'
    payload,
    priority: payload.priority || 'normal',
    timestamp: Date.now()
  };
  ch.sendToQueue('notifications', Buffer.from(JSON.stringify(notification)), { persistent: true });
}

// Consumer with retry logic:
async function processNotifications() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertQueue('notifications', { durable: true });
  await ch.assertQueue('dlq', { durable: true }); // Dead letter queue
  
  ch.consume('notifications', async (msg) => {
    const { type, payload } = JSON.parse(msg.content.toString());
    try {
      if (type === 'email') await emailProvider.send(payload);
      if (type === 'sms') await smsProvider.send(payload);
      if (type === 'push') await pushProvider.send(payload);
      ch.ack(msg);
    } catch (err) {
      const retryCount = (msg.properties.headers?.['x-retry'] || 0);
      if (retryCount < 3) {
        ch.sendToQueue('notifications', msg.content, {
          headers: { 'x-retry': retryCount + 1 },
          expiration: Math.pow(2, retryCount) * 60000 // Exponential backoff
        });
      } else {
        ch.sendToQueue('dlq', msg.content); // Dead letter
      }
      ch.ack(msg);
    }
  });
}
```

---

## 4. How would you design a chat application (like WhatsApp)?

A chat app requires real-time messaging via WebSockets for bidirectional communication. Use a message queue for reliable delivery and persistence. Store messages in a time-series DB (Cassandra or DynamoDB) for chat history. Track online presence with heartbeat pings. For group chats, use fan-out on write (store once per group, mark per-user read offset) or fan-out on read.

```javascript
// WebSocket chat server using Socket.io:
const io = require('socket.io')(server);
const redis = require('redis');
const pub = redis.createClient();
const sub = redis.createClient();

io.on('connection', (socket) => {
  socket.on('join', (roomId) => socket.join(roomId));
  
  socket.on('message', async (msg) => {
    const message = {
      id: uuidv4(),
      sender: socket.userId,
      text: msg.text,
      roomId: msg.roomId,
      timestamp: Date.now()
    };
    // Persist to database
    await db.query('INSERT INTO messages (id, sender, text, room_id, ts) VALUES ($1,$2,$3,$4,$5)',
      [message.id, message.sender, message.text, message.roomId, message.timestamp]);
    // Publish to Redis for cross-server fan-out
    pub.publish(`room:${msg.roomId}`, JSON.stringify(message));
    io.to(msg.roomId).emit('message', message);
  });

  // Presence tracking
  socket.on('presence', async (status) => {
    await redis.set(`presence:${socket.userId}`, status);
    socket.broadcast.emit('presence', { userId: socket.userId, status });
  });
});

// Subscribe to Redis channels for horizontal scaling:
sub.on('message', (channel, data) => {
  const roomId = channel.split(':')[1];
  io.to(roomId).emit('message', JSON.parse(data));
});
```

---

## 5. What is the difference between horizontal and vertical scaling in system design?

Vertical scaling adds resources (CPU, RAM, disk) to a single machine — simpler but has hard limits and a single point of failure. Horizontal scaling adds more machines to a pool — requires load balancing but offers near-limitless scalability and fault tolerance. Modern cloud systems favor horizontal scaling with stateless design so any instance can handle any request.

```javascript
// Vertical scaling: upgrade server specs
// $ t2.micro -> t2.large -> t2.xlarge
// Pros: No code changes, simple
// Cons: Downtime for upgrades, hardware limits, no fault tolerance

// Horizontal scaling: add more servers behind a load balancer
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers for horizontal scaling across CPU cores
  for (let i = 0; i < numCPUs; i++) cluster.fork();
  
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Forking replacement...`);
    cluster.fork(); // Self-healing
  });
} else {
  // Each worker runs the same Express app
  const app = require('./app');
  app.listen(3000);
}

// For true horizontal scaling across machines:
// - Make app stateless (session in Redis, not in-memory)
// - Use a load balancer (Nginx, ALB) to distribute traffic
// - Share state via external stores (Redis, DB)
```

---

## 6. What is the CAP theorem and how does it apply to distributed systems?

CAP theorem states a distributed system can only guarantee two of three: Consistency (all nodes see same data), Availability (every request gets a response), and Partition Tolerance (system works despite network failures). Since network partitions are inevitable (P is required), systems choose CP (consistency over availability - wait for partition to heal) or AP (availability over consistency - accept stale reads). NoSQL databases exemplify this trade-off.

```javascript
// CP system (Consistency + Partition Tolerance): Traditional RDBMS, HBase
// - Waits for all replicas to agree before responding
// - May reject requests during partition
// - Use case: Financial transactions, inventory management

// AP system (Availability + Partition Tolerance): Cassandra, DynamoDB
// - Responds immediately even if replicas disagree
// - Uses eventual consistency
// - Use case: Social media feeds, product catalogs

// Example: AP design for a product catalog
const product = await cache.get(productId).catch(() => null);
if (product) return res.json(product); // Serve stale data while DB is partitioned
const fresh = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
cache.set(productId, fresh);
res.json(fresh);

// Example: CP design for a bank transfer
try {
  await db.query('BEGIN');
  await db.query('UPDATE accounts SET balance = balance - 100 WHERE id = $1', [from]);
  await db.query('UPDATE accounts SET balance = balance + 100 WHERE id = $1', [to]);
  await db.query('COMMIT'); // All-or-nothing - partition causes reject
} catch (e) {
  await db.query('ROLLBACK');
  res.status(503).json({ error: 'Service unavailable, try again' });
}
```

---

## 7. What is the difference between SQL and NoSQL databases, and when would you choose one over the other?

SQL databases (PostgreSQL, MySQL) use structured schemas, support ACID transactions, and excel at complex joins and relationships. NoSQL databases (MongoDB, Cassandra, Redis) offer flexible schemas, horizontal scaling, and are optimized for specific access patterns. Choose SQL when data integrity and complex queries matter (finance, ERP). Choose NoSQL for high-throughput, flexible-schema, or hierarchical data (catalogs, logs, real-time feeds).

```javascript
// SQL - structured schema with relationships:
const user = await db.query(`
  SELECT u.*, o.total 
  FROM users u 
  JOIN orders o ON o.user_id = u.id 
  WHERE u.email = $1
`, [email]);

// NoSQL (MongoDB) - embedded documents:
const order = await db.collection('orders').insertOne({
  userId: user._id,
  items: [
    { productId: 'p1', name: 'Laptop', price: 999 },
    { productId: 'p2', name: 'Mouse', price: 25 }
  ],
  total: 1024,
  status: 'pending',
  createdAt: new Date()
});
// No joins needed - all order data in one document

// Decision guide:
// SQL when: complex queries, joins, ACID compliance, structured data
// NoSQL when: flexible schema, high write throughput, simple queries at scale
// Often hybrid: SQL for core transactions + Redis for caching/real-time
```

---

## 8. How would you design a caching layer for a high-traffic web application?

Use a multi-tier cache: browser cache (Cache-Control headers), CDN cache for static assets, and application cache (Redis/Memcached) for dynamic data. Cache-aside pattern is common: check cache first, on miss load from DB and populate cache. Set appropriate TTLs, use consistent hashing for distributed caching, and implement cache invalidation on data updates to prevent stale reads.

```javascript
// Cache-aside pattern with Redis:
const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });

async function getProduct(productId) {
  // Step 1: Check cache
  const cached = await client.get(`product:${productId}`);
  if (cached) return JSON.parse(cached);

  // Step 2: Cache miss - load from DB
  const product = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
  if (!product) return null;

  // Step 3: Populate cache with TTL
  await client.setEx(`product:${productId}`, 3600, JSON.stringify(product));
  return product;
}

// Cache invalidation on update:
async function updateProduct(productId, updates) {
  // Update database
  await db.query('UPDATE products SET name = $1, price = $2 WHERE id = $3',
    [updates.name, updates.price, productId]);
  // Invalidate cache
  await client.del(`product:${productId}`);
}

// Write-through cache (always keep cache fresh):
async function createProduct(product) {
  const result = await db.query('INSERT INTO products ... RETURNING *', [...]);
  await client.setEx(`product:${result.id}`, 3600, JSON.stringify(result));
  return result;
}
```

---

## 9. What is database sharding and when is it needed?

Sharding (horizontal partitioning) splits a large database across multiple servers, where each shard holds a subset of rows based on a shard key. It is needed when data exceeds a single server's storage capacity or write throughput. Common strategies: range-based, hash-based, or geographic sharding. Sharding adds complexity for cross-shard queries and rebalancing.

```javascript
// Hash-based sharding implementation:
function getShard(key, totalShards) {
  const hash = require('crypto').createHash('md5').update(key).digest('hex');
  const shardNum = parseInt(hash.substring(0, 8), 16) % totalShards;
  return `shard_${shardNum}`;
}

// Shard routing in application:
const shards = {
  shard_0: new Pool({ host: 'db0.example.com', database: 'shard0' }),
  shard_1: new Pool({ host: 'db1.example.com', database: 'shard1' }),
  shard_2: new Pool({ host: 'db2.example.com', database: 'shard2' }),
};

async function getUser(userId) {
  const shardKey = String(userId);
  const shard = getShard(shardKey, 3);
  return shards[shard].query('SELECT * FROM users WHERE id = $1', [userId]);
}

// Considerations:
// - Choose shard key carefully (must distribute evenly, must be in most queries)
// - Cross-shard queries are expensive (use scatter-gather or avoid)
// - Rebalancing shards when adding/removing nodes is complex
// - Consider using managed solutions (Vitess, CockroachDB, Spanner)
```

---

## 10. What is database replication and what are its trade-offs?

Replication copies data from a primary (master) to one or more replicas (slaves). It improves read throughput, provides failover for high availability, and enables disaster recovery. Trade-offs: replication lag (eventual consistency), write amplification on master, conflict resolution challenges in multi-master setups, and increased operational complexity.

```javascript
// PostgreSQL replication setup (replica reads only):
const { Pool } = require('pg');

// Primary pool (handles writes):
const primary = new Pool({ host: 'primary-db.example.com', database: 'myapp' });

// Replica pool (handles reads - can have multiple):
const replica = new Pool({ host: 'replica-db.example.com', database: 'myapp' });

// Query router - send writes to primary, reads to replica:
async function query(sql, params, isWrite = false) {
  const pool = isWrite ? primary : replica;
  return pool.query(sql, params);
}

// Example usage:
const user = await query('SELECT * FROM users WHERE id = $1', [id]); // Replica
await query('UPDATE users SET name = $1 WHERE id = $2', [name, id], true); // Primary

// Trade-offs:
// - Replication lag: replica may be seconds behind primary
// - Read-after-write: after a write, read from primary to see your own updates
// - Failover: promote replica to primary on crash (can lose in-flight data)
```

---

## 11. How would you design a news feed system (like Twitter/Facebook)?

Use fan-out on write for most users: pre-compute feeds and push to followers' inboxes on post creation. For celebrities (millions of followers), use fan-out on read: pull from the celebrity's timeline on demand (hybrid approach). Store feed in Redis lists for fast retrieval. Use pagination with cursor-based IDs. Rank by recency or engagement score.

```javascript
// Fan-out on write (push model) for regular users:
async function createPost(userId, content) {
  const post = await db.query(
    'INSERT INTO posts (user_id, content, created_at) VALUES ($1, $2, NOW()) RETURNING *',
    [userId, content]
  );

  // Push post to all followers' feed lists
  const followers = await db.query('SELECT follower_id FROM follows WHERE user_id = $1', [userId]);
  const pipeline = redis.pipeline();
  for (const { follower_id } of followers.rows) {
    pipeline.lPush(`feed:${follower_id}`, JSON.stringify(post));
    pipeline.lTrim(`feed:${follower_id}`, 0, 500); // Keep last 500 posts
  }
  await pipeline.exec();
}

// Fan-out on read (pull model) for celebrities:
async function getFeed(userId, cursor, limit = 20) {
  const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
  
  if (user.is_celebrity) {
    // Pull from followed celebrities' posts at read time
    const posts = await db.query(`
      SELECT p.* FROM posts p
      JOIN follows f ON f.user_id = p.user_id
      WHERE f.follower_id = $1 AND p.id < $2
      ORDER BY p.created_at DESC LIMIT $3
    `, [userId, cursor || '999999999', limit]);
    return posts.rows;
  }

  // Push model: read pre-computed feed from cache
  const raw = await redis.lRange(`feed:${userId}`, 0, limit);
  return raw.map(JSON.parse);
}
```

---

## 12. What is a load balancer and what algorithms do load balancers commonly use?

A load balancer distributes incoming traffic across multiple backend servers to maximize throughput, minimize response time, and avoid overload. Common algorithms: Round Robin (even distribution), Least Connections (route to least busy server), IP Hash (session persistence), Weighted Round Robin (heterogeneous servers), and Random (simple, sufficient for large pools).

```javascript
// Round-robin load balancer simulation:
class LoadBalancer {
  constructor(servers) {
    this.servers = servers;
    this.counter = 0;
  }

  roundRobin() {
    const server = this.servers[this.counter % this.servers.length];
    this.counter++;
    return server;
  }

  leastConnections(connections) {
    return this.servers.reduce((min, s) => connections[s] < connections[min] ? s : min);
  }

  ipHash(ip) {
    const hash = require('crypto').createHash('md5').update(ip).digest('hex');
    const index = parseInt(hash.substring(0, 8), 16) % this.servers.length;
    return this.servers[index];
  }
}

// Nginx upstream configurations:
// Round Robin (default):
// upstream backend {
//     server app1:3000;
//     server app2:3000;
// }

// Least Connections:
// upstream backend {
//     least_conn;
//     server app1:3000;
//     server app2:3000;
// }

// IP Hash (sticky sessions):
// upstream backend {
//     ip_hash;
//     server app1:3000;
//     server app2:3000;
// }
```

---

## 13. What is a message queue and when would you use one (Kafka, RabbitMQ)?

A message queue enables asynchronous communication between services by buffering messages. Producers send messages to a queue; consumers process them independently. Use cases: decoupling services (order service -> inventory service), load leveling (handle traffic spikes), task distribution (worker pools), and event-driven architectures. Kafka excels at high-throughput event streaming; RabbitMQ at reliable message delivery with complex routing.

```javascript
// RabbitMQ - reliable task distribution:
const amqp = require('amqplib');

async function processOrder(order) {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertQueue('orders', { durable: true });
  
  // Producer: send order to queue
  ch.sendToQueue('orders', Buffer.from(JSON.stringify(order)), { persistent: true });
}

// Consumer: process orders from queue (multiple workers can consume)
async function startOrderWorker() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertQueue('orders', { durable: true });
  ch.prefetch(1); // One message at a time per worker
  
  ch.consume('orders', async (msg) => {
    const order = JSON.parse(msg.content.toString());
    try {
      await fulfillOrder(order);
      ch.ack(msg); // Acknowledge successful processing
    } catch (err) {
      ch.nack(msg, false, true); // Requeue on failure
    }
  });
}

// Kafka - high-throughput event streaming:
// const { Kafka } = require('kafkajs');
// const kafka = new Kafka({ brokers: ['kafka:9092'] });
// const producer = kafka.producer();
// await producer.send({
//   topic: 'user-events',
//   messages: [{ key: userId, value: JSON.stringify({ type: 'page_view', url }) }],
// });
```

---

## 14. How would you design an e-commerce checkout system that avoids overselling inventory?

Use optimistic locking with version numbers or pessimistic locking (SELECT FOR UPDATE) on inventory rows. Reserve inventory temporarily during checkout with a TTL (e.g., 15-minute hold). Process payments idempotently to prevent duplicate charges. Use a state machine for order states (pending -> confirmed -> shipped -> delivered). For flash sales, use a queue to serialize purchase requests.

```javascript
// Optimistic locking - prevent overselling:
async function purchaseItem(userId, productId, quantity) {
  const result = await db.query(`
    UPDATE inventory 
    SET quantity = quantity - $1, version = version + 1
    WHERE product_id = $2 AND version = $3 AND quantity >= $1
    RETURNING version
  `, [quantity, productId, currentVersion]);

  if (result.rows.length === 0) {
    // Version mismatch or insufficient stock - retry or reject
    throw new Error('Item unavailable, please retry');
  }
  await createOrder(userId, productId, quantity);
}

// Pessimistic locking (SELECT FOR UPDATE):
async function checkoutLocking(cartItems) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    // Lock the inventory rows
    const result = await client.query(
      'SELECT quantity FROM inventory WHERE product_id = $1 FOR UPDATE',
      [cartItems[0].productId]
    );
    if (result.rows[0].quantity < cartItems[0].quantity) {
      throw new Error('Insufficient stock');
    }
    await client.query(
      'UPDATE inventory SET quantity = quantity - $1 WHERE product_id = $2',
      [cartItems[0].quantity, cartItems[0].productId]
    );
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
```

---

## 15. What is eventual consistency vs strong consistency?

Strong consistency guarantees all nodes see the latest write immediately (all reads return the most recent value). It requires coordination and reduces availability during partitions. Eventual consistency allows temporary staleness but guarantees all replicas will converge over time. It provides higher availability and lower latency. Choose based on requirements: banking = strong, social feeds = eventual.

```javascript
// Strong consistency - read after write always sees the update:
// Requires quorum reads/writes:
// Write: W = all nodes must ack
// Read: R = all nodes must respond with same value
// N = 3, W = 3, R = 3 → full consistency, lowest availability

async function strongWrite(key, value) {
  const promises = replicas.map(r => r.set(key, value));
  await Promise.all(promises); // Wait for ALL replicas
}

async function strongRead(key) {
  const results = await Promise.all(replicas.map(r => r.get(key)));
  // Verify all replicas return the same value
  if (new Set(results).size !== 1) throw new Error('Inconsistent state');
  return results[0];
}

// Eventual consistency - accept stale reads:
// N = 3, W = 1 (write to any one node), R = 1 (read from any node)

async function eventualWrite(key, value) {
  await replicas[0].set(key, value); // Write to one replica
  // Background: async replication to other nodes
}

async function eventualRead(key) {
  return replicas[Math.floor(Math.random() * replicas.length)].get(key);
  // May return stale data - eventually consistent
}

// DynamoDB default: eventual consistency with option for strong consistency
// DynamoDB: ConsistentRead: true → strong, ConsistentRead: false → eventual
```

---

## 16. How would you design a file storage system like Google Drive or Dropbox?

Use chunked uploads (split files into fixed-size chunks) for resumable uploads. Store file metadata (name, size, version, permissions) in a relational DB. Store actual file blobs in object storage (S3, GCS) with deduplication (content-addressed storage). Use a sync engine with CRDTs or operational transforms for conflict resolution. Version files with diff-based storage to save space.

```javascript
// Chunked upload implementation:
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({ region: 'us-east-1' });
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

// Initiate multipart upload:
async function initiateUpload(fileName, totalChunks) {
  const uploadId = uuidv4();
  await db.query(
    'INSERT INTO file_uploads (id, name, total_chunks, status) VALUES ($1, $2, $3, $4)',
    [uploadId, fileName, totalChunks, 'initiated']
  );
  return uploadId;
}

// Upload each chunk:
async function uploadChunk(uploadId, chunkIndex, chunkBuffer) {
  const key = `chunks/${uploadId}/${chunkIndex}`;
  await s3.send(new PutObjectCommand({
    Bucket: 'uploads-bucket',
    Key: key,
    Body: chunkBuffer
  }));
  await db.query(
    'UPDATE file_uploads SET uploaded_chunks = array_append(uploaded_chunks, $1) WHERE id = $2',
    [chunkIndex, uploadId]
  );
}

// Complete upload - merge chunks:
async function completeUpload(uploadId, fileName, userId) {
  const fileId = uuidv4();
  const contentHash = await computeHash(uploadId); // SHA-256 for dedup
  // Check if this file already exists (deduplication)
  const existing = await db.query('SELECT id FROM files WHERE content_hash = $1', [contentHash]);
  if (existing.rows.length > 0) {
    // Just create a reference to existing file
    await createFileReference(fileId, fileName, existing.rows[0].id, userId);
    return fileId;
  }
  await s3.send(new PutObjectCommand({
    Bucket: 'files-bucket',
    Key: fileId,
    CopySource: `uploads-bucket/chunks/${uploadId}/merged`
  }));
  await db.query(
    'INSERT INTO files (id, name, content_hash, owner_id, size, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
    [fileId, fileName, contentHash, userId, totalSize]
  );
  return fileId;
}
```

---

## 17. What is the difference between synchronous and asynchronous communication between microservices?

Synchronous communication (HTTP/REST, gRPC) has the caller wait for a response. It's simpler but creates temporal coupling and cascading failures. Asynchronous communication (message queues, event streams) decouples services — the producer emits events without waiting. This improves resilience and scalability but adds complexity in error handling and eventual consistency.

```javascript
// Synchronous communication (HTTP/REST):
// Service A calls Service B and waits for response
async function createOrder(userId, items) {
  // Blocking call to Payment Service
  const paymentResult = await axios.post('http://payment-service/charge', {
    userId, amount: calculateTotal(items)
  });
  if (paymentResult.status !== 'success') throw new Error('Payment failed');
  
  // Blocking call to Inventory Service
  await axios.post('http://inventory-service/reserve', { items });
  
  return { orderId: uuidv4(), status: 'confirmed' };
}
// Problem: Payment Service down → Order Service fails too

// Asynchronous communication (message queue):
async function createOrderAsync(userId, items) {
  const order = { orderId: uuidv4(), userId, items, status: 'pending' };
  await db.query('INSERT INTO orders ...', [...order]);
  
  // Emit events - don't wait for response
  await eventBus.publish('order.created', order);
  // Payment Service and Inventory Service consume independently
  return order; // Return immediately - eventual consistency
}

// Consumer in Inventory Service:
eventBus.subscribe('order.created', async (event) => {
  try {
    await reserveInventory(event.items);
    await eventBus.publish('inventory.reserved', { orderId: event.orderId });
  } catch (err) {
    await eventBus.publish('order.failed', { orderId: event.orderId, reason: 'Out of stock' });
  }
});
```

---

## 18. How would you handle rate limiting and abuse prevention in a public API?

Use a sliding window counter stored in Redis per API key. Return proper 429 status codes with Retry-After headers. Implement tiers: free (100 req/hr), pro (10000 req/hr). Add IP-based limits as a fallback. Use captchas for sensitive endpoints (login, registration). Monitor for anomalous patterns using tools like Cloudflare WAF or custom anomaly detection.

```javascript
// Multi-tier rate limiter:
class TieredRateLimiter {
  constructor(redisClient) {
    this.redis = redisClient;
    this.tiers = {
      free: { limit: 100, window: 3600 },     // 100 req/hr
      pro: { limit: 10000, window: 3600 },    // 10000 req/hr
      enterprise: { limit: 100000, window: 3600 }
    };
  }

  async checkLimit(apiKey, ip) {
    const tier = await this.getTier(apiKey);
    const { limit, window } = this.tiers[tier];
    
    // Check per-API-key limit
    const keyCount = await this.slidingWindowCounter(`apikey:${apiKey}`, window);
    if (keyCount >= limit) return { allowed: false, tier };
    
    // Fallback per-IP limit (stricter)
    const ipLimit = tier === 'free' ? 10 : 100;
    const ipCount = await this.slidingWindowCounter(`ip:${ip}`, 60);
    if (ipCount >= ipLimit) return { allowed: false, tier: 'ip_limited' };
    
    return { allowed: true, tier, remaining: limit - keyCount - 1 };
  }

  async slidingWindowCounter(key, windowSec) {
    const now = Math.floor(Date.now() / 1000);
    const windowKey = `rl:${key}:${Math.floor(now / windowSec)}`;
    const count = await this.redis.incr(windowKey);
    if (count === 1) await this.redis.expire(windowKey, windowSec);
    return count;
  }
}

// Express middleware:
app.use(async (req, res, next) => {
  const result = await limiter.checkLimit(req.headers['x-api-key'], req.ip);
  res.setHeader('X-RateLimit-Limit', result.limit);
  res.setHeader('X-RateLimit-Remaining', result.remaining);
  if (!result.allowed) {
    res.setHeader('Retry-After', Math.ceil(result.window));
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
  next();
});
```

---

## 19. How would you estimate capacity/back-of-the-envelope numbers for a system design interview?

Estimate daily active users (DAU), then compute reads and writes per second. Calculate storage per request and multiply by retention period. Use powers of two approximations: 1K = 10^3, 1M = 10^6, 1B = 10^9. Assume: 50M DAU, each user makes 5 write requests/day → ~2900 writes/sec. For storage: each write is 1KB → ~250 GB/day → ~90 TB/year. Use these numbers to justify sharding, caching, and infrastructure choices.

```javascript
// Back-of-the-envelope calculator:
class CapacityEstimator {
  constructor(dau) {
    this.dau = dau;
  }

  requestsPerSecond(dailyRequestsPerUser) {
    const totalDaily = this.dau * dailyRequestsPerUser;
    return Math.ceil(totalDaily / (24 * 60 * 60));
  }

  storagePerDay(bytesPerRequest, writesPerUser) {
    const dailyWrites = this.dau * writesPerUser;
    return (dailyWrites * bytesPerRequest) / (1024 * 1024 * 1024); // GB
  }

  bandwidth(bytesPerResponse, readsPerUser) {
    const rps = this.requestsPerSecond(readsPerUser);
    return (rps * bytesPerResponse) / (1024 * 1024); // MB/s
  }
}

// Twitter-like app estimation:
const twt = new CapacityEstimator(50_000_000); // 50M DAU
console.log('Writes/sec:', twt.requestsPerSecond(5));     // ~2900 writes/sec
console.log('Reads/sec:', twt.requestsPerSecond(100));    // ~58,000 reads/sec
console.log('Storage/day:', twt.storagePerDay(1024, 5));  // ~238 GB/day
console.log('Bandwidth:', twt.bandwidth(2048, 100));      // ~116 MB/s

// Memory for caching:
// Cache 20% of reads in Redis (hot data)
const cacheMemory = (0.2 * 58000 * 2048) / (1024 * 1024); // ~23 MB/s (throughput)
const cacheStorage = 0.2 * (238 * 1024 * 1024 * 1024);     // Hot data: ~51 GB (storage)
// ~51 GB Redis cluster needed for hot data
```

---

## 20. What is a content delivery network (CDN) and how does it fit into system architecture?

A CDN is a globally distributed network of proxy servers that cache and serve static content (images, CSS, JS, videos) from locations nearest to users. It reduces latency, offloads origin servers, and absorbs DDoS attacks. CDN fits as the outermost caching layer before the load balancer. For dynamic content, CDNs can cache API responses with short TTLs or use edge computing (Cloudflare Workers, Lambda@Edge).

```javascript
// CDN cache configuration via Cache-Control headers:
app.use('/static', express.static('public', {
  maxAge: '30d',
  immutable: true, // File never changes (content-hashed filenames)
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
  }
}));

// API responses with CDN-friendly caching:
app.get('/api/products/:id', async (req, res) => {
  const product = await getProduct(req.params.id);
  res.setHeader('Cache-Control', 'public, max-age=60'); // CDN caches for 60s
  res.json(product);
});

// Purge CDN cache when data changes (e.g., Cloudflare API):
// async function purgeCDN(urls) {
//   await fetch('https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache', {
//     method: 'POST',
//     headers: { Authorization: `Bearer ${CF_TOKEN}` },
//     body: JSON.stringify({ files: urls })
//   });
// }

// CDN architecture flow:
// User → CDN Edge (cache hit → serve immediately)
//                   ↓ (cache miss → fetch from origin)
//              Load Balancer
//                   ↓
//              Application Server
//                   ↓
//              Database
```

---
