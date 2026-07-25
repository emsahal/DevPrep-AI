<!--LANG:roman-->

# Security Interview Questions

## 1. What is Cross-Site Scripting (XSS) and how do you prevent it?

**Asaan Urdu mein:**  
XSS wo vulnerability hai jahan attacker malicious JavaScript ko web page mein inject karta hai jo dusre users dekhte hain. Ye tab hota hai jab user ka input bina sanitize kiye HTML mein embed ho jata hai. Isko rokne ke liye input validation, output encoding, aur **Content Security Policy** headers ka istemal karna chahiye.  

```javascript
// DO NOT do this (vulnerable):
app.get('/search', (req, res) => {
  res.send(`<h1>Results for ${req.query.q}</h1>`);
});

// DO this (safe - sanitize/escape output):
const escapeHtml = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
app.get('/search', (req, res) => {
  const safeQuery = escapeHtml(req.query.q);
  res.send(`<h1>Results for ${safeQuery}</h1>`);
});
```

---

## 2. What is Cross-Site Request Forgery (CSRF) and how do you prevent it?

**Asaan Urdu mein:**  
CSRF attacker ko victim ki authenticated session ka istemal kar ke unwanted actions karne par majboor karta hai. Ye malicious form ya link ke zariye hota hai. Prevention ke liye **anti‑CSRF tokens**, SameSite cookies, aur Origin/Referer header ki verification zaroori hai.  

```javascript
// Express.js CSRF protection using csurf (now csrf-csrf):
const { doubleCsrf } = require('csrf-csrf');
const { generateToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET,
  cookieName: 'csrf-token',
});

app.post('/transfer', doubleCsrfProtection, (req, res) => {
  const token = generateToken(req, res);
  res.json({ message: 'Transfer completed' });
});

// HTML form includes the token:
// <input type="hidden" name="_csrf" value="<%= csrfToken %>" />
```

---

## 3. What is SQL injection and how do you prevent it?

**Asaan Urdu mein:**  
SQL injection tab hoti hai jab user ka input seedha SQL query string mein concatenate ho jata hai, jis se attacker query ko manipulate kar sakta hai. Iska solution hai **parameterized queries** ya ORM ka istemal, aur input validation. Kabhi bhi raw string interpolation na karein.  

```javascript
// DO NOT do this (vulnerable):
const query = `SELECT * FROM users WHERE email = '${req.body.email}'`;

// DO this (safe - parameterized query):
const { Pool } = require('pg');
const pool = new Pool();
const result = await pool.query('SELECT * FROM users WHERE email = $1', [req.body.email]);

// With an ORM (Sequelize):
const user = await User.findOne({ where: { email: req.body.email } });
```

---

## 4. What is the difference between authentication and authorization vulnerabilities?

**Asaan Urdu mein:**  
Authentication vulnerabilities user ki identity verify karne mein kami hoti hain, jaise weak passwords ya session hijacking. Authorization vulnerabilities ye decide karte hain ke authenticated user ko kya karne ki ijazat hai, jaise IDOR ya privilege escalation. Dono ko alag‑alagay address karna zaroori hai.  

```javascript
// Authentication - verify who the user is:
const jwt = require('jsonwebtoken');
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch { res.status(401).json({ error: 'Unauthorized' }); }
}

// Authorization - verify what the user can do:
function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}
app.delete('/admin/users/:id', authenticate, authorize('admin'), deleteUser);
```

---

## 5. What is the same-origin policy and how does CORS relate to it?

**Asaan Urdu mein:**  
Same‑origin policy browsers ko rokta hai ke page sirf usi origin (protocol, domain, port) se request kare. **CORS** ek mechanism hai jo server ko headers ke through batata hai ke kaunse origins ko request karne ki ijazat hai, is tarah policy ko relax kiya jata hai.  

```javascript
// Server-side CORS configuration (Express.js):
const cors = require('cors');
app.use(cors({
  origin: 'https://trusted-frontend.com',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
```

---

## 6. What is Content Security Policy (CSP) and how does it help prevent attacks?

**Asaan Urdu mein:**  
CSP ek browser header hai jo specify karta hai ke page kis source se scripts, styles, images wagaira load kar sakta hai. Ye **XSS** aur data injection attacks ko rokta hai by allowing only trusted origins. Violations ko report karne ka option bhi hota hai.  

```javascript
// Setting CSP header in Express.js:
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' https://apis.google.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data:; " +
    "report-uri /csp-violations;"
  );
  next();
});

// Reporting endpoint to log violations:
app.post('/csp-violations', (req, res) => {
  console.error('CSP Violation:', req.body);
  res.status(204).end();
});
```

---

## 7. What is the difference between HTTP and HTTPS, and why does it matter for security?

**Asaan Urdu mein:**  
HTTP data ko plain text mein bhejta hai, jis se eavesdropping aur MITM attacks asaan ho jate hain. **HTTPS** TLS/SSL ka use karke data encrypt karta hai, isse confidentiality aur integrity barqarar rehti hai. Sensitive information ke liye HTTPS zaroori hai.  

```javascript
// Redirect HTTP to HTTPS in Express.js:
app.use((req, res, next) => {
  if (!req.secure && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

// Create HTTPS server:
const https = require('https');
const fs = require('fs');
const options = {
  key: fs.readFileSync('/etc/ssl/private/key.pem'),
  cert: fs.readFileSync('/etc/ssl/certs/cert.pem'),
};
https.createServer(options, app).listen(443);
```

---

## 8. What is a man-in-the-middle attack?

**Asaan Urdu mein:**  
MITM attack mein attacker client aur server ke beech intercept karke data ko read ya modify karta hai. Ye ARP spoofing, rogue Wi‑Fi, ya DNS spoofing se ho sakta hai. **HTTPS** with proper certificate validation, HSTS, aur certificate pinning isse rokte hain.  

```javascript
// Certificate pinning example (using HPKP or built-in pinning):
// Node.js HTTPS client with certificate validation:
const https = require('https');
const options = {
  hostname: 'api.example.com',
  port: 443,
  ca: fs.readFileSync('server-cert.pem'), // Pin the server's CA cert
  rejectUnauthorized: true, // Fail on invalid certs
  checkServerIdentity: (hostname, cert) => {
    if (cert.fingerprint !== process.env.EXPECTED_FINGERPRINT) {
      return new Error('Certificate fingerprint mismatch');
    }
  }
};
```

---

## 9. What is the OWASP Top 10 and why is it important?

**Asaan Urdu mein:**  
OWASP Top 10 web application security ke sab se critical 10 risks ka list hai. Ye industry standard awareness guide hai jo developers ko sab se common aur impactful vulnerabilities pe focus karne mein madad karta hai. Isko samajh kar teams apni security priorities set kar sakti hain.  

```javascript
// OWASP Top 10 (2021) summary in code comments - scan your app:
const owaspChecklist = {
  A01_BrokenAccessControl: 'Enforce authorization checks on every request',
  A02_CryptographicFailures: 'Use TLS, encrypt sensitive data at rest',
  A03_Injection: 'Parameterized queries, input validation',
  A04_InsecureDesign: 'Threat modeling, rate limiting',
  A05_SecurityMisconfiguration: 'Hardened defaults, disable directory listing',
  A06_VulnerableComponents: 'Regular dependency updates (npm audit)',
  A07_AuthenticationFailures: 'MFA, password policies, session management',
  A08_IntegrityFailures: 'Verify software signatures, Subresource Integrity',
  A09_LoggingFailures: 'Centralized logging, alert on anomalies',
  A10_SSRF: 'Validate URLs, restrict outbound traffic',
};
```

---

## 10. How do you securely store passwords in a database?

**Asaan Urdu mein:**  
Passwords ko kabhi plain text mein store na karein. **bcrypt**, Argon2 ya scrypt jaise adaptive hashing algorithms ka use karein, har password ke liye unique salt ke sath. Ye algorithms computationally expensive hote hain, isliye brute‑force attacks mushkil ho jate hain.  

```javascript
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

// Register - hash password before storing:
async function registerUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  await db.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, hashedPassword]);
}

// Login - compare password with hash:
async function verifyPassword(email, password) {
  const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  const match = await bcrypt.compare(password, user.password_hash);
  return match;
}
```

---

## 11. What is clickjacking and how do you prevent it?

**Asaan Urdu mein:**  
Clickjacking user ko transparent iframe ke through galat button ya link click karne par majboor karta hai. Isko rokne ke liye **X‑Frame‑Options** header ko `DENY` ya `SAMEORIGIN` set karein, ya CSP ke `frame‑ancestors` directive ka istemal karein.  

```javascript
// Express.js middleware to prevent clickjacking:
app.use((req, res, next) => {
  // Option 1: X-Frame-Options header
  res.setHeader('X-Frame-Options', 'DENY'); // or 'SAMEORIGIN'

  // Option 2: CSP frame-ancestors (more flexible, modern)
  res.setHeader('Content-Security-Policy', "frame-ancestors 'none'"); // or 'self'

  next();
});

// HTML fallback (defense-in-depth):
// <style id="anti-clickjack">body{display:none!important;}</style>
// <script>if(self===top){document.getElementById('anti-clickjack').remove()}
// else{top.location=self.location}</script>
```

---

## 12. What is the purpose of security headers like X-Frame-Options and Strict-Transport-Security?

**Asaan Urdu mein:**  
Security headers browsers ko extra policies enforce karne ke liye batate hain. **X‑Frame‑Options** clickjacking rokta hai, **Strict‑Transport‑Security (HSTS)** browsers ko sirf HTTPS connections use karne par majboor karta hai, aur **X‑Content‑Type‑Options** MIME sniffing ko disable karta hai. Ye defense‑in‑depth ka hissa hain.  

```javascript
// Comprehensive security headers middleware:
const helmet = require('helmet');
app.use(helmet()); // Sets many headers by default

// Or manually:
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=()');
  res.removeHeader('X-Powered-By'); // Don't advertise server info
  next();
});
```

---

## 13. What is the difference between encryption, hashing, and encoding?

**Asaan Urdu mein:**  
**Encryption** data ko reversible way se ciphertext mein badalta hai, key ke through wapas original milta hai. **Hashing** ek‑way function hai jo fixed‑size digest deta hai, reverse impossible – passwords ke liye use hota hai. **Encoding** (jaise Base64) data ko transport‑friendly format mein convert karta hai, bina security ke, aur easily decode ho jata hai.  

```javascript
const crypto = require('crypto');

// Encryption (AES-256-GCM) - two-way with key:
function encrypt(text, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encrypted, tag: cipher.getAuthTag().toString('hex') };
}

// Hashing (SHA-256) - one-way:
function hash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Encoding (Base64) - reversible, no security:
function encode(data) {
  return Buffer.from(data).toString('base64');
}
```

---

## 14. What is a JWT vulnerability you should be aware of (e.g., algorithm confusion)?

**Asaan Urdu mein:**  
Algorithm confusion vulnerability tab hoti hai jab server token ke `alg` header ko trust karta hai. Attacker `RS256` ko `HS256` mein badal kar server ke public key ko secret ke roop mein use kar sakta hai. Isko prevent karne ke liye **expected algorithm** ko explicitly specify karein aur sirf trusted key se verify karein.  

```javascript
const jwt = require('jsonwebtoken');

// VULNERABLE - trusts the 'alg' header from the token:
function vulnerableVerify(token) {
  return jwt.verify(token, publicKey); // Attacker can switch to HS256
}

// SECURE - explicitly specify algorithm:
function secureVerify(token) {
  return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
}

// Generating a secure JWT:
function generateToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role },
    privateKey,
    { algorithm: 'RS256', expiresIn: '15m', audience: 'myapp', issuer: 'auth.myapp.com' }
  );
}
```

---

## 15. How do you prevent NoSQL injection in MongoDB queries?

**Asaan Urdu mein:**  
NoSQL injection hoti hai jab attacker `$gt`, `$ne` jaise operators ko query mein inject karta hai. Prevention ke liye **Mongoose** jaisa ODM use karein, schema validation enable karein, aur raw `$where` clauses se bachein. `express-mongo-sanitize` middleware bhi helpful hai.  

```javascript
const mongoose = require('mongoose');

// VULNERABLE - directly using user input:
router.post('/login', async (req, res) => {
  const user = await User.findOne({
    username: req.body.username, // { "$gt": "" } matches everything!
    password: req.body.password
  });
});

// SECURE - validate and sanitize input:
router.post('/login', async (req, res) => {
  if (typeof req.body.username !== 'string' || typeof req.body.password !== 'string') {
    return res.status(400).json({ error: 'Invalid input type' });
  }
  const user = await User.findOne({
    username: req.body.username.trim(),
    password: req.body.password
  });
});

// Also use express-mongo-sanitize:
const sanitizer = require('express-mongo-sanitize');
app.use(sanitizer()); // Strips $ and . from req.body/params/query
```

---

## 16. What is rate limiting used for from a security perspective?

**Asaan Urdu mein:**  
Rate limiting se ek client ko ek specific time window mein kitni requests bhejne ki ijazat hai, wo control hoti hai. Ye brute‑force login attempts, credential stuffing, DDoS traffic, aur API abuse ko rokta hai. 429 status code aur `Retry-After` header return karna best practice hai.  

```javascript
const rateLimit = require('express-rate-limit');

// Global rate limiter (100 requests per minute):
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use(globalLimiter);

// Strict rate limiter for login endpoints:
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' }
});
app.post('/login', loginLimiter, handleLogin);
```

---

## 17. What is dependency vulnerability scanning and why is it important?

**Asaan Urdu mein:**  
Dependency scanning tools aapke third‑party libraries ko CVE, Snyk, ya npm audit jaise databases ke against check karte hain. Modern apps bahut saare open‑source packages use karte hain, jo vulnerable ho sakte hain. CI/CD pipeline mein regular scans integrate karne se vulnerable code production mein jaane se roka ja sakta hai.  

```javascript
// Package.json scripts for vulnerability scanning:
{
  "scripts": {
    "audit": "npm audit --production",
    "audit-fix": "npm audit fix --production",
    "snyk": "snyk test",
    "outdated": "npm outdated"
  }
}

// CI/CD pipeline step (GitHub Actions):
// - name: Dependency vulnerability scan
//   run: |
//     npm audit --production || true
//     npx snyk test --fail-on=high

// Automated Dependabot config (.github/dependabot.yml):
// version: 2
// updates:
//   - package-ecosystem: "npm"
//     directory: "/"
//     schedule:
//       interval: "weekly"
//     open-pull-requests-limit: 10
```

---

## 18. What is the principle of least privilege?

**Asaan Urdu mein:**  
Least privilege ka matlab hai ke har user, process, ya service ko sirf woh permissions di jayein jo uske kaam ke liye zaroori hain. Isse breach hone par damage limited rehta hai. Database users, IAM roles, file permissions, aur API tokens sab mein ye principle apply karna chahiye.  

```javascript
// Database user with minimal permissions:
// CREATE USER 'app_user'@'%' IDENTIFIED BY 'strong_password';
// GRANT SELECT, INSERT, UPDATE ON myapp.* TO 'app_user'@'%';
// Do NOT grant DROP, ALTER, or CREATE to application user

// AWS IAM policy with least privilege:
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject", "s3:PutObject"],
    "Resource": "arn:aws:s3:::myapp-uploads/*"
  }]
}

// Express.js route-level authorization:
router.get('/api/orders/:id', authenticate, (req, res) => {
  const order = await Order.findOne({ id: req.params.id, userId: req.user.id });
  if (!order) return res.status(404).json({ error: 'Not found' });
});
```

---

## 19. How do you securely handle file uploads to prevent malicious file execution?

**Asaan Urdu mein:**  
File uploads ko type, size, aur content ke liye validate karein. Files ko web root ke bahar store karein, random filenames use karein, aur malware scanning implement karein. Serve karte waqt `Content‑Disposition: attachment` header set karein aur path traversal se bachne ke liye checks lagayein.  

```javascript
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: '/uploads', // Outside web root!
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = ['.jpg', '.png', '.pdf', '.docx'];
    if (!allowed.includes(ext)) return cb(new Error('Invalid file type'));
    cb(null, crypto.randomBytes(16).toString('hex') + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const mimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!mimeTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid MIME type'), false);
    }
    cb(null, true);
  }
});

// Serve files via controlled endpoint (not directly from /uploads):
app.get('/files/:filename', (req, res) => {
  const filePath = path.join('/uploads', req.params.filename);
  // Prevent path traversal:
  if (req.params.filename.includes('..')) return res.status(400).end();
  res.setHeader('Content-Disposition', 'attachment; filename="download"');
  res.sendFile(filePath);
});
```

---

## 20. What is a DDoS attack and what are common mitigation strategies?

**Asaan Urdu mein:**  
DDoS attack mein bahut saare compromised devices se target server par traffic flood hota hai, jis se service unavailable ho jati hai. Mitigation ke liye rate limiting, CDN/edge filtering (Cloudflare, AWS Shield), anycast DNS, auto‑scaling, aur WAF ka istemal hota hai. Layered defense se attack ko absorb ya block kiya ja sakta hai.  

```javascript
// Application-level DDoS mitigation middleware:
const rateLimit = require('express-rate-limit');

// Aggressive rate limiter per IP:
const ddosProtection = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 30, // 30 requests per 10 seconds
  message: { error: 'Traffic threshold exceeded' }
});
app.use(ddosProtection);

// Slowloris protection - set timeouts:
const server = app.listen(3000);
server.timeout = 30000; // 30 seconds
server.headersTimeout = 6000;
server.requestTimeout = 10000;

// Infrastructure: Cloudflare CDN, AWS WAF, auto‑scaling groups,
// and anycast DNS to absorb and filter traffic at edge.
```

---

<!--LANG:english-->

# Security Interview Questions

## 1. What is Cross-Site Scripting (XSS) and how do you prevent it?

---

💡 **Key points**

- **XSS** is a client‑side code injection attack where malicious scripts are executed in a victim’s browser.  
- **Types:** Reflected, Stored, and DOM‑based XSS.  

**Prevention techniques**

- **Input validation** – whitelist allowed characters.  
- **Output encoding** – use `HTML entity encoding` or frameworks that auto‑escape.  
- **Content Security Policy (CSP)** – restrict script sources.  
- **HttpOnly cookies** – prevent JavaScript access to session cookies.  

---

## 2. What is Cross-Site Request Forgery (CSRF) and how do you prevent it?

---

💡 **Key points**

- **CSRF** tricks an authenticated user’s browser into sending unwanted requests to a trusted site.  

**Mitigation strategies**

- **Anti‑CSRF tokens** (synchronizer token pattern).  
- **SameSite cookie attribute** (`Lax` or `Strict`).  
- **Double submit cookie** pattern.  
- **Check Referer/Origin headers** for sensitive actions.  

---

## 3. What is SQL injection and how do you prevent it?

---

💡 **Key points**

- **SQL injection** occurs when untrusted input is concatenated into SQL statements, allowing attackers to alter queries.  

**Prevention checklist**

- Use **prepared statements / parameterized queries**.  
- Employ **ORMs** that abstract raw SQL.  
- Whitelist and strictly validate input.  
- Apply **least‑privilege** database accounts.  
- Regularly run **static analysis** and **runtime query monitoring**.  

---

## 4. What is the difference between authentication and authorization vulnerabilities?

---

| Aspect                     | **Authentication**                              | **Authorization**                               |
|---------------------------|-------------------------------------------------|-------------------------------------------------|
| **Purpose**               | Verifies *who* a user is.                       | Determines *what* a verified user can do.       |
| **Common flaws**          | Credential stuffing, password reuse, weak hash | Insecure Direct Object References (IDOR), privilege escalation |
| **Typical controls**      | Multi‑factor authentication, strong password policies, password hashing (e.g., **bcrypt**) | Role‑Based Access Control (RBAC), Attribute‑Based Access Control (ABAC), proper ACL checks |
| **Testing focus**         | Login flow, session management                 | Access checks on every protected resource      |
| **Impact of breach**      | Account takeover                               | Data leakage or unauthorized actions across the system |

---

## 5. What is the same-origin policy and how does CORS relate to it?

---

💡 **Same‑Origin Policy (SOP)**  
- Browser security model that restricts scripts on a page from interacting with resources from a different **origin** (scheme + host + port).  

**Cross‑Origin Resource Sharing (CORS)**  
- A **relaxation** of SOP via HTTP headers (`Access-Control-Allow-Origin`, etc.).  
- Server explicitly lists trusted origins; browsers enforce the policy.  

**Key considerations**

- Never use `*` for sensitive endpoints.  
- Validate `Origin`/`Referer` headers on the server side.  
- Combine CORS with **CSRF** protections for defense‑in‑depth.  

---

## 6. What is Content Security Policy (CSP) and how does it help prevent attacks?

---

💡 **CSP** is an HTTP response header (`Content‑Security‑Policy`) that defines approved sources for content (scripts, styles, images, etc.).  

**Security benefits**

- Mitigates **XSS** by blocking inline scripts and untrusted domains.  
- Reduces impact of **data injection** attacks.  

**Typical directives**

- `script-src 'self' https://trusted.cdn.com`  
- `object-src 'none'`  
- `upgrade-insecure-requests`  

**Implementation tip:** Start with a **report‑only** policy to monitor violations before enforcing.  

---

## 7. What is the difference between HTTP and HTTPS, and why does it matter for security?

---

| Feature                | **HTTP**                                 | **HTTPS** (HTTP + TLS)                     |
|-----------------------|------------------------------------------|-------------------------------------------|
| **Transport security** | Plaintext – data can be sniffed         | Encrypted with **TLS** – confidentiality & integrity |
| **Port**               | 80                                       | 443                                       |
| **Certificate**        | None                                     | X.509 certificate authenticates server   |
| **Vulnerabilities mitigated** | None specific                         | Man‑in‑the‑middle, eavesdropping, tampering |
| **Performance impact** | Slightly lower latency                  | Minor overhead (TLS handshake) – mitigated by session resumption & HTTP/2 |
| **Browser behavior**  | May show “Not Secure” warnings for sensitive pages | Trusted by browsers; enables **HSTS**, **Secure cookies** |

**Why it matters:** Without HTTPS, credentials, session tokens, and personal data travel in clear text, exposing users to interception and tampering.  

---

## 8. What is a man-in-the-middle attack?

---

💡 **Definition**  
An attacker intercepts and possibly alters communication between two parties who believe they are directly connected.  

**Common vectors**

- **Wi‑Fi eavesdropping** on unsecured networks.  
- **SSL stripping** (downgrading HTTPS to HTTP).  
- **Compromised routers** or DNS hijacking.  

**Defenses**

- Enforce **HTTPS** with **HSTS**.  
- Use **certificate pinning** for critical apps.  
- Validate **certificate chains** and **public key fingerprints**.  

---

## 9. What is the OWASP Top 10 and why is it important?

---

💡 **OWASP Top 10** is a regularly updated list of the most critical web application security risks (e.g., Injection, Broken Authentication, Sensitive Data Exposure).  

**Importance**

- Provides a **baseline** for security testing and remediation.  
- Guides **secure development** standards and compliance frameworks.  
- Helps prioritize **risk mitigation** efforts across teams.  

---

## 10. How do you securely store passwords in a database?

---

💡 **Best‑practice workflow**

1. **Salt** each password with a unique, cryptographically random value.  
2. Hash using a **slow, adaptive algorithm** such as **bcrypt**, **scrypt**, or **Argon2**.  
3. Store only the **salt + hash** (never the plaintext).  
4. Periodically **re‑hash** with stronger parameters as hardware improves.  

**Additional tips**

- Enforce **minimum password complexity** and length.  
- Implement **rate limiting** on login attempts.  

---

## 11. What is clickjacking and how do you prevent it?

---

💡 **Clickjacking** tricks users into clicking hidden UI elements by overlaying transparent frames.  

**Prevention mechanisms**

- Set **X‑Frame‑Options: DENY** or **SAMEORIGIN** header.  
- Use **Content‑Security‑Policy: frame‑ancestors** directive.  
- Implement **frame busting** JavaScript (as a secondary measure).  

---

## 12. What is the purpose of security headers like X-Frame-Options and Strict-Transport-Security?

---

💡 **X‑Frame‑Options**  
- Controls whether a page can be framed, mitigating clickjacking (`DENY`, `SAMEORIGIN`, `ALLOW-FROM`).  

**Strict‑Transport‑Security (HSTS)**  
- Informs browsers to always use **HTTPS** for the domain for a specified period (`max‑age`).  
- Prevents protocol‑downgrade attacks and cookie stripping.  

**Other useful headers**

- `X‑Content‑Type‑Options: nosniff` – stops MIME‑type sniffing.  
- `Referrer-Policy` – limits referrer information leakage.  

---

## 13. What is the difference between encryption, hashing, and encoding?

---

| Property                | **Encryption**                                 | **Hashing**                                 | **Encoding**                                 |
|------------------------|-----------------------------------------------|--------------------------------------------|---------------------------------------------|
| **Goal**               | Confidentiality – reversible transformation   | Integrity – one‑way fingerprint            | Data representation – reversible for transport |
| **Key usage**          | Requires **secret key** (symmetric) or **public/private key pair** (asymmetric) | No key; deterministic output               | No key; defined algorithm (e.g., Base64)   |
| **Typical algorithms**| AES, RSA, ChaCha20                            | SHA‑256, bcrypt, Argon2                    | Base64, URL‑encoding, UTF‑8                  |
| **Verification**       | Decrypt with correct key                     | Compare hash values (e.g., password check) | Decode back to original format              |
| **Security purpose**   | Protect data at rest/in transit               | Detect tampering, store passwords securely | Ensure safe transport over text‑based protocols |

---

## 14. What is a JWT vulnerability you should be aware of (e.g., algorithm confusion)?

---

💡 **Algorithm confusion** occurs when a server accepts a token signed with `none` or a weak algorithm (e.g., **HS256**) while the client expects **RS256**.  

**Mitigation**

- **Whitelist** allowed algorithms; reject `none`.  
- Verify the **`alg`** header matches the expected signing method.  
- Use **asymmetric keys** for high‑value tokens.  
- Rotate signing keys regularly.  

---

## 15. How do you prevent NoSQL injection in MongoDB queries?

---

💡 **NoSQL injection** exploits unsanitized input in query objects.  

**Defensive steps**

- Use **parameterized query builders** (e.g., Mongoose schema validation).  
- **Whitelist** allowed fields and operators.  
- Avoid directly concatenating user input into query objects.  
- Enable **MongoDB’s built‑in query sanitization** (e.g., `$eq` only).  
- Perform **runtime monitoring** for anomalous query patterns.  

---

## 16. What is rate limiting used for from a security perspective?

---

💡 **Rate limiting** caps the number of requests a client can make within a time window.  

**Security benefits**

- Thwarts **brute‑force credential guessing**.  
- Mitigates **credential stuffing** and **API abuse**.  
- Reduces impact of **DoS/DDoS** at the application layer.  

**Implementation tips**

- Apply per‑IP, per‑user, and per‑endpoint limits.  
- Return `429 Too Many Requests` with `Retry-After` header.  

---

## 17. What is dependency vulnerability scanning and why is it important?

---

💡 **Dependency scanning** automatically inspects third‑party libraries for known CVEs.  

**Why it matters**

- Modern apps rely heavily on open‑source packages; vulnerabilities can be inherited.  
- Early detection prevents **supply‑chain attacks**.  
- Helps maintain **compliance** (e.g., PCI, GDPR).  

**Tools**: Dependabot, Snyk, OWASP Dependency‑Check, GitHub Advanced Security.  

---

## 18. What is the principle of least privilege?

---

💡 **Least privilege** means granting users, processes, and services only the permissions they need to perform their tasks.  

**Practical application**

- Use **role‑based access control (RBAC)** with minimal scopes.  
- Apply **container‑level** and **OS‑level** isolation (e.g., Linux capabilities, SELinux).  
- Regularly audit and revoke unused privileges.  

---

## 19. How do you securely handle file uploads to prevent malicious file execution?

---

💡 **Secure upload checklist**

- **Validate file type** using MIME type and magic numbers.  
- Store files **outside the web root** or in a dedicated storage service (e.g., S3).  
- Rename files to a **random, non‑executable** name.  
- Set **strict file permissions** (`chmod 0644`).  
- Scan files with an **antivirus/clamAV** engine.  
- Serve files via a **content‑delivery endpoint** that sets `Content‑Disposition: attachment`.  

---

## 20. What is a DDoS attack and what are common mitigation strategies?

---

💡 **Distributed Denial‑of‑Service (DDoS)** overwhelms a target with traffic from many compromised sources.  

**Mitigation tactics**

- **Traffic scrubbing** services (e.g., Cloudflare, Akamai).  
- **Rate limiting** and **connection throttling** at the edge.  
- Deploy **anycast** routing to distribute load.  
- Implement **auto‑scaling** to absorb spikes.  
- Maintain **redundant infrastructure** and **failover** mechanisms.  

---

## 💻 Coding Challenges

*No coding‑implementation questions were present in this set.*
