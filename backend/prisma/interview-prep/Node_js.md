<!--LANG:roman-->

# Node.js Interview Questions

## 1. What is Node.js and how does its event-driven architecture work?

**Asaan Urdu mein:**  
Node.js ek JavaScript runtime hai jo Chrome ke V8 engine par based hai. Yeh **event‑driven, non‑blocking I/O** model use karta hai. Event loop continuously events ko listen karta hai aur jab koi event fire hota hai to uska callback turant chalaya jata hai. I/O operations ke liye callbacks register karne ke baad code aage chalti rehti hai, isliye high concurrency achieve hoti hai.

---

## 2. What is the difference between synchronous and asynchronous programming in Node.js?

**Asaan Urdu mein:**  
Synchronous code execution ko block karta hai jab tak operation complete na ho jaye, isliye agla code wait karta hai. Asynchronous code operation ko start karta hai aur baad mein callback, promise ya async/await ke through result handle karta hai, bina thread ko block kiye. Node.js zyada tar async pattern prefer karta hai taake I/O‑heavy apps fast rahein.

---

## 3. Explain the Node.js event loop phases.

**Asaan Urdu mein:**  
Event loop ke **six phases** hote hain: timers → pending callbacks → idle/prepare → poll → check → close callbacks. Timers phase `setTimeout`/`setInterval` ko chalata hai, poll phase I/O events ko process karta hai, check phase `setImmediate` ko execute karta hai. Har phase ke beech `process.nextTick` aur Promise microtasks ko drain kiya jata hai.

---

## 4. What is the difference between process.nextTick and setImmediate?

**Asaan Urdu mein:**  
`process.nextTick` current operation ke turant baad, lekin agle event‑loop phase se pehle callback chalata hai. `setImmediate` agle iteration ke **check phase** mein callback schedule karta hai. Isliye `nextTick` callbacks hamesha `setImmediate` se pehle run hote hain.

---

## 5. What is the purpose of the package.json file?

**Asaan Urdu mein:**  
`package.json` Node.js project ka metadata file hai jisme project ka name, version, scripts, dependencies, aur entry point define hota hai. npm is file ko read karke correct package versions install karta hai aur custom commands (`npm start`, `npm test` etc.) ko run karta hai.

---

## 6. What is the difference between dependencies and devDependencies?

**Asaan Urdu mein:**  
`dependencies` wo packages hain jo production mein app ko chalane ke liye zaroori hain (e.g., Express). `devDependencies` sirf development ke dauran use hote hain—testing, linting, ya build tools. Production deploy par `npm install --production` sirf dependencies install karta hai, isse size kam hota hai.

---

## 7. What are streams in Node.js and what types exist?

**Asaan Urdu mein:**  
Streams data ko **piece‑by‑piece** read ya write karte hain, poora data memory mein load kiye baghair. Char types hain: Readable, Writable, Duplex (donon), aur Transform (Duplex jo data modify karta hai). Large files ya network data efficiently handle karne ke liye streams ka use hota hai.

---

## 8. What is the difference between require and import in Node.js?

**Asaan Urdu mein:**  
`require` CommonJS ka synchronous loader hai aur `module.exports` ke through export hota hai. `import` ES Modules ka asynchronous loader hai, static analysis pe kaam karta hai, aur `export`/`export default` ke through modules expose hoti hain. `.mjs` ya `"type":"module"` wali files ESM treat hoti hain.

---

## 9. What is middleware in the context of Node.js frameworks?

**Asaan Urdu mein:**  
Middleware ek function hota hai jo **request, response, aur next** ko receive karta hai. Yeh request/response ko modify kar sakta hai ya response send kar sakta hai. Multiple middleware functions ek pipeline banate hain; har ek `next()` call karne ke baad agla middleware execute hota hai. Logging, authentication, parsing, compression, error handling typical middleware hote hain.

---

## 10. How does Node.js handle child processes and clustering?

**Asaan Urdu mein:**  
`child_process` module se aap **spawn, exec, fork** ke through alag processes create kar sakte hain, jo CPU‑intensive tasks ko alag thread mein chalate hain. `cluster` module master process ko multiple worker processes fork karne deta hai jo same port share karte hain, isse multi‑core scaling milti hai.

---

## 11. What is the difference between spawn, exec, and fork in Node.js?

**Asaan Urdu mein:**  
`spawn` ek new process start karta hai aur **stream** based I/O deta hai—large data ke liye best. `exec` command ko run karta hai aur output ko **buffer** karta hai—short commands ke liye. `fork` special `spawn` hai jo Node.js process create karta hai aur IPC channel provide karta hai, isse parent‑child messaging possible hoti hai.

---

## 12. What is the Node.js Buffer class used for?

**Asaan Urdu mein:**  
`Buffer` binary data ko handle karta hai, especially jab streams, files, ya network sockets se data read/write hota hai. Yeh fixed size ka hota hai, V8 heap ke bahar allocate hota hai, aur efficient I/O, cryptography, ya protocol parsing ke liye use hota hai.

---

## 13. How does error handling work in Node.js (try/catch vs error-first callbacks)?

**Asaan Urdu mein:**  
Traditional Node APIs **error‑first callbacks** use karte hain—pehla argument error hota hai. `try/catch` synchronous errors ko catch karta hai, aur `async/await` ke saath promise rejections ko bhi handle karta hai. Streams aur events ke liye `error` event use hota hai. Unhandled errors process ko crash kar dete hain; global handlers (`uncaughtException`, `unhandledRejection`) sirf logging aur cleanup ke liye hoti hain.

---

## 14. What is the event emitter pattern in Node.js?

**Asaan Urdu mein:**  
EventEmitter ek core design pattern hai jahan objects **named events** emit karte hain aur listeners uss event ko react karte hain. Multiple listeners ek event ke liye register ho sakte hain, aur wo synchronously order mein call hote hain. HTTP server, streams, aur file watchers sab EventEmitter inherit karte hain.

---

## 15. What is the difference between blocking and non-blocking I/O?

**Asaan Urdu mein:**  
Blocking I/O JavaScript thread ko rok deta hai jab tak operation complete na ho; koi aur code execute nahi hota. Non‑blocking I/O operation ko start karta hai aur turant return hota hai; result later callback ya promise ke through aata hai. Node.js sab I/O ko non‑blocking banata hai taake thousands of connections handle kar sake.

---

## 16. How do you handle environment variables and configuration in Node.js apps?

**Asaan Urdu mein:**  
Environment variables `process.env` se read ki jati hain. Development mein `.env` file ko `dotenv` package se load karte hain. Configuration ko environment‑specific sections (dev, prod) mein split karte hain, defaults set karte hain, aur required variables ko startup pe validate karte hain. Secrets kabhi source code mein hard‑code nahi karte.

---

## 17. What is npm vs yarn vs pnpm, and how do they differ?

**Asaan Urdu mein:**  
`npm` Node ke saath aata hai aur flat `node_modules` structure use karta hai. `yarn` deterministic `yarn.lock` ke saath aata tha aur performance improve karta tha. `pnpm` content‑addressable storage use karta hai—har package version ka ek copy globally hota hai, hard‑links se projects ko link karta hai, isse disk space bacha jata hai aur strict module isolation milti hai.

---

## 18. What is the purpose of the package-lock.json file?

**Asaan Urdu mein:**  
`package-lock.json` har installed package ka exact version, integrity hash, aur dependency tree lock karta hai. Isse alag machines ya CI environments par **reproducible builds** milti hain; bina lockfile ke `npm install` har bar thode alag versions le sakta hai.

---

## 19. How does Node.js achieve concurrency despite being single-threaded?

**Asaan Urdu mein:**  
Node.js ka **event loop** non‑blocking I/O ko OS kernel ya libuv thread pool ko delegate karta hai. JavaScript code single thread par chalti hai, lekin I/O operations background mein hoti hain, callbacks aane par event loop unhe process karta hai. Is tarah hazaron concurrent connections handle ho jati hain.

---

## 20. What are worker threads in Node.js and when should you use them?

**Asaan Urdu mein:**  
Worker threads separate JavaScript execution contexts hain—har ek ka apna V8 instance aur event loop hota hai. CPU‑intensive tasks (image processing, heavy calculations) ke liye use karte hain, taake main thread block na ho. Workers memory share kar sakte hain `SharedArrayBuffer` ya message passing ke through communicate karte hain.

---

## 21. What is the difference between CommonJS and ES Modules in Node.js?

**Asaan Urdu mein:**  
CommonJS (`require`, `module.exports`) synchronous loading use karta hai aur default `.js` files ke liye hota hai. ES Modules (`import`, `export`) asynchronous static analysis par kaam karta hai, `.mjs` ya `"type":"module"` ke saath enable hota hai. ESM top‑level `await`, strict named exports, aur better tree‑shaking support karta hai.

---

## 22. How would you debug a memory leak in a Node.js application?

**Asaan Urdu mein:**  
Chrome DevTools ya `--inspect` flag se **heap snapshots** le kar memory growth compare karte hain. Leaked objects (dangling listeners, global vars, unclosed timers) ko identify karte hain. `clinic`, `heapdump`, ya `memwatch-next` jaise tools automate detection karte hain. Regular `process.memoryUsage()` monitoring se early warning mil sakti hai.

---

## 23. What is the purpose of a reverse proxy (like Nginx) in front of a Node.js app?

**Asaan Urdu mein:**  
Reverse proxy SSL termination, load balancing, static file serving, rate limiting, aur request buffering handle karta hai—jo Node.js efficiently nahi karta. Nginx high concurrency ke saath static assets serve karta hai, aur multiple Node.js instances ko distribute karta hai, jabke Node.js sirf dynamic logic par focus karta hai.

---

## 24. How do you handle file uploads in Node.js?

**Asaan Urdu mein:**  
Express ke saath `multer` middleware ya raw Node.js ke liye `formidable` use karte hain. Yeh `multipart/form-data` ko parse karke files ko disk ya memory mein store karte hain. File size, type, aur count validation middleware options se set ki jati hai. Errors ko proper error‑handling middleware se catch karte hain.

---

## 25. What is the difference between process.env and a .env file?

**Asaan Urdu mein:**  
`process.env` runtime ke actual environment variables ko hold karta hai—OS ya container se set hote hain. `.env` ek local development file hai jisme key‑value pairs likhe hote hain; `dotenv` package is file ko read karke values ko `process.env` mein inject karta hai. Production mein `.env` file use nahi hoti, balki env vars deployment platform se set ki jati hain.

---

## 26. How does Node.js handle uncaught exceptions and unhandled promise rejections?

**Asaan Urdu mein:**  
Uncaught exceptions process ko turant crash kar dete hain; stack trace print hota hai. Node v15+ mein unhandled promise rejections bhi process ko exit kar dete hain. Global listeners `process.on('uncaughtException')` aur `process.on('unhandledRejection')` sirf logging aur cleanup ke liye hoti hain—recovery ki koshish nahi karni chahiye. Production mein process manager (PM2, Docker) se restart karna best practice hai.

---

## 27. What is REPL in Node.js?

**Asaan Urdu mein:**  
REPL (Read‑Eval‑Print Loop) ek interactive shell hai jo `node` command bina arguments ke chalane par start hota hai. Aap JavaScript expressions type kar ke turant result dekh sakte hain, auto‑completion, history, aur multi‑line editing ka support hota hai. Custom REPL servers bhi `repl` module se banaye ja sakte hain.

---

## 28. What is the libuv library's role in Node.js?

**Asaan Urdu mein:**  
`libuv` C library hai jo Node.js ka **event loop**, thread pool, aur cross‑platform async I/O abstractions provide karta hai. Yeh OS‑specific mechanisms (epoll, kqueue, IOCP) use karta hai, aur file system, DNS, crypto, aur compression jaise operations ko thread pool ke through async banata hai.

---

## 29. How would you scale a Node.js application horizontally?

**Asaan Urdu mein:**  
Horizontal scaling ke liye multiple Node.js instances chalaye jate hain—`cluster` module ya process manager (PM2) se same machine ke multiple CPU cores par workers spawn karte hain. Multi‑server scaling ke liye Nginx/HAProxy jaise reverse proxy se traffic distribute karte hain, aur Redis ya database ke shared session store use karte hain. Docker/Kubernetes se auto‑scaling aur health checks automate hoti hain.

---

## 30. What is the difference between a callback, a promise, and async/await in Node.js code?

**Asaan Urdu mein:**  
Callback ek function hota hai jo async operation ke baad call hota hai—nested callbacks se “callback hell” hota hai. Promise `.then()`/`.catch()` chaining provide karta hai, error handling behtar hoti hai. `async/await` promises ka syntactic sugar hai—code synchronous jaisa lagta hai, `try/catch` se errors handle hote hain. Modern Node.js mein async/await preferred hai.

---

## 31. What is the difference between a callback, a promise, and async/await in Node.js code?

**Asaan Urdu mein:**  
Callback ek function hota hai jo async operation ke baad call hota hai—nested callbacks se “callback hell” hota hai. Promise `.then()`/`.catch()` chaining provide karta hai, error handling behtar hoti hai. `async/await` promises ka syntactic sugar hai—code synchronous jaisa lagta hai, `try/catch` se errors handle hote hain. Modern Node.js mein async/await preferred hai.

---

<!--LANG:english-->

# Node.js Interview Questions  

## 1. What is **Node.js** and how does its **event‑driven architecture** work?  

---  

💡 **Key points to cover**  
- **Node.js** is a **JavaScript runtime** built on **Chrome’s V8 engine**.  
- It uses a **single‑threaded, non‑blocking I/O model**.  
- The **event loop** continuously checks a queue of callbacks and executes them.  
- **Event emitters** allow you to react to asynchronous events (e.g., `request`, `data`).  

---  

## 2. What is the difference between **synchronous** and **asynchronous** programming in **Node.js**?  

---  

| Aspect | **Synchronous** | **Asynchronous** |
|--------|----------------|------------------|
| Execution flow | Blocks the thread until the operation finishes | Returns immediately; callback/promise resolves later |
| Typical use | CPU‑bound calculations, simple scripts | I/O‑bound tasks (file read, network request) |
| Code readability | Straight‑line code | Can become nested (callback hell) – mitigated by **Promises**/`async‑await` |
| Error handling | `try/catch` works directly | Errors propagate via callbacks or promise rejections |

---  

## 3. Explain the **Node.js event loop** phases.  

---  

💡 **Main phases**  
- **timers** – executes callbacks scheduled by `setTimeout`/`setInterval`.  
- **pending callbacks** – handles I/O callbacks deferred to the next loop.  
- **idle, prepare** – internal use only.  
- **poll** – retrieves new I/O events; executes I/O callbacks.  
- **check** – runs `setImmediate` callbacks.  
- **close callbacks** – e.g., `socket.on('close')`.  

---  

## 4. What is the difference between **process.nextTick** and **setImmediate**?  

---  

| Aspect | **process.nextTick** | **setImmediate** |
|--------|----------------------|-------------------|
| Timing | Executes **before** the event loop continues to the next phase | Executes **at the start** of the **check** phase |
| Use case | To run code **immediately after** the current operation, but before I/O | To schedule work **after** I/O events have been processed |
| Queue type | **Next‑tick queue** (higher priority) | **Check queue** (lower priority) |
| Risk | Can starve I/O if overused | Safer for long‑running tasks |  

---  

## 5. What is the purpose of the **package.json** file?  

---  

💡 **Typical contents**  
- **Metadata**: name, version, description, author, license.  
- **Scripts**: shortcuts for `npm run`.  
- **Dependencies** & **devDependencies**.  
- **Engines**: Node version constraints.  
- **Main** entry point.  

---  

## 6. What is the difference between **dependencies** and **devDependencies**?  

---  

| Aspect | **dependencies** | **devDependencies** |
|--------|------------------|---------------------|
| Installation target | Included when the package is **installed** (`npm install`) | Only installed in **development** (`npm install --only=dev`) |
| Runtime vs build | Required **at runtime** (e.g., Express) | Needed for **build, test, lint** (e.g., Mocha, Babel) |
| Production deployment | Usually **kept** | Often **pruned** (`npm prune --production`) |

---  

## 7. What are **streams** in **Node.js** and what types exist?  

---  

💡 **Stream categories**  
- **Readable** – data can be read (e.g., `fs.createReadStream`).  
- **Writable** – data can be written (e.g., `fs.createWriteStream`).  
- **Duplex** – both readable & writable (e.g., `net.Socket`).  
- **Transform** – a duplex stream that **modifies** data (e.g., `zlib.createGzip`).  

---  

## 8. What is the difference between **require** and **import** in **Node.js**?  

---  

| Aspect | **require** (CommonJS) | **import** (ES Modules) |
|--------|-----------------------|--------------------------|
| Syntax | `const foo = require('foo');` | `import foo from 'foo';` |
| Loading | **Synchronous** at runtime | **Static**, hoisted, can be **asynchronous** |
| File extension | Usually `.js` (CommonJS) | Usually `.mjs` or `"type":"module"` in `package.json` |
| Export style | `module.exports = ...` | `export default ...` / `export const ...` |
| Interop | Can import ES modules with `import()` | Can import CommonJS with `createRequire` or default interop |  

---  

## 9. What is **middleware** in the context of **Node.js** frameworks?  

---  

💡 **Core ideas**  
- Functions that **process** the request‑response cycle.  
- Receive `(req, res, next)` and either **handle** the request or call `next()` to pass control.  
- Common uses: **logging**, **authentication**, **body parsing**, **error handling**.  

---  

## 10. How does **Node.js** handle **child processes** and **clustering**?  

---  

💡 **Mechanisms**  
- **child_process** module: `spawn`, `exec`, `fork` to run separate processes.  
- **Cluster** module: creates a **master** process that forks **worker** processes sharing the same server port.  
- Workers run on **multiple CPU cores**, improving throughput.  

---  

## 11. What is the difference between **spawn**, **exec**, and **fork** in **Node.js**?  

---  

| Feature | **spawn** | **exec** | **fork** |
|---------|-----------|----------|----------|
| Return type | `ChildProcess` with **streams** (`stdout`, `stderr`) | `ChildProcess` with a **buffered** callback (`error, stdout, stderr`) | `ChildProcess` with **IPC channel** (for Node scripts) |
| Use case | Long‑running processes, large output | Simple commands, small output | Running another **Node.js** module and communicating via `process.send` |
| Buffer limit | No inherent limit (streamed) | Default **200 KB** buffer (configurable) | Same as `spawn` (streamed) |
| Shell | By default **no** shell (faster) | Executes via **shell** (`/bin/sh`) | Same as `spawn` (no shell) |

---  

## 12. What is the **Node.js Buffer** class used for?  

---  

💡 **Key purposes**  
- Handles **binary data** (e.g., file I/O, network streams).  
- Provides methods to **read/write** integers, strings, and perform **encoding conversions**.  
- Useful for **cryptographic** operations and **data manipulation** before sending over sockets.  

---  

## 13. How does error handling work in **Node.js** (`try/catch` vs **error‑first callbacks**)?  

---  

💡 **Guidelines**  
- **Synchronous** code: use `try/catch`.  
- **Asynchronous** APIs: follow the **error‑first callback** pattern (`function(err, result)`).  
- With **Promises**/`async‑await`, `try/catch` works for rejected promises.  
- Always **propagate** errors to the next middleware or `process.on('uncaughtException')`.  

---  

## 14. What is the **event emitter** pattern in **Node.js**?  

---  

💡 **Components**  
- **EventEmitter** class (`require('events')`).  
- `emitter.on(event, listener)` to **subscribe**.  
- `emitter.emit(event, …args)` to **trigger**.  
- Supports **once**, **removeListener**, and **listenerCount**.  

---  

## 15. What is the difference between **blocking** and **non‑blocking I/O**?  

---  

| Aspect | **Blocking I/O** | **Non‑blocking I/O** |
|--------|------------------|----------------------|
| Thread usage | Holds the **event loop** until operation finishes | Returns immediately; callback/promise resolves later |
| Performance | Poor scalability under high concurrency | Enables high throughput with a single thread |
| Example in Node | `fs.readFileSync` | `fs.readFile` (or `fs.promises.readFile`) |
| Typical use | Startup scripts, CLI tools | Server‑side request handling |  

---  

## 16. How do you handle **environment variables** and **configuration** in **Node.js** apps?  

---  

💡 **Best practices**  
- Use **process.env** to read variables.  
- Store secrets in a **.env** file and load with **dotenv** (`require('dotenv').config()`).  
- Validate with **Joi**, **zod**, or **convict**.  
- Keep **environment‑specific** config separate (e.g., `config/production.json`).  

---  

## 17. What is **npm** vs **yarn** vs **pnpm**, and how do they differ?  

---  

| Feature | **npm** | **yarn** | **pnpm** |
|---------|---------|----------|----------|
| Lockfile | `package-lock.json` | `yarn.lock` | `pnpm-lock.yaml` |
| Installation speed | Improved in v7+, but slower than Yarn/PNPM | Faster due to parallelism & caching | Fastest; uses **content‑addressable store** |
| Disk usage | Duplicates `node_modules` per project | Similar to npm | **Dedupes** packages globally, saves space |
| Workspaces | Supported (npm v7) | Strong workspace support | Native workspace support with strict linking |
| Plug‑and‑play | No | Yarn 2+ offers **Zero‑Installs** | No (but efficient) |

---  

## 18. What is the purpose of the **package-lock.json** file?  

---  

💡 **Reasons**  
- Guarantees **exact versions** of all transitive dependencies.  
- Enables **deterministic builds** across machines.  
- Speeds up subsequent installs by caching the resolved tree.  

---  

## 19. How does **Node.js** achieve concurrency despite being **single‑threaded**?  

---  

💡 **Mechanisms**  
- **Event loop** + **non‑blocking I/O**.  
- **libuv** thread pool (default 4 threads) for file system, DNS, compression, etc.  
- **Worker threads** for CPU‑bound parallelism.  
- **Cluster** module to spawn multiple processes.  

---  

## 20. What are **worker threads** in **Node.js** and when should you use them?  

---  

💡 **When to choose**  
- Heavy **CPU‑bound** tasks (e.g., image processing, encryption).  
- Need to share **memory** via `SharedArrayBuffer`.  
- Prefer **threads** over spawning separate processes for lower overhead.  

---  

## 21. What is the difference between **CommonJS** and **ES Modules** in **Node.js**?  

---  

| Aspect | **CommonJS** | **ES Modules** |
|--------|--------------|----------------|
| File extension | `.js` (default) | `.mjs` or `"type":"module"` in `package.json` |
| Syntax | `require`, `module.exports` | `import`, `export` |
| Loading | **Synchronous** at runtime | **Static** (hoisted) & can be **asynchronous** (`import()`) |
| Interop | Can `require` ES modules with `createRequire` | Can import CommonJS default via `import pkg from 'pkg'` (default interop) |
| Tree‑shaking | Not supported | Supported by bundlers (e.g., Webpack, Rollup) |  

---  

## 22. How would you debug a **memory leak** in a **Node.js** application?  

---  

💡 **Typical steps**  
- Run with `--inspect` and connect Chrome DevTools.  
- Use `process.memoryUsage()` to monitor **heap** growth.  
- Take **heap snapshots** (`node --heap-prof`) and compare.  
- Look for **detached DOM nodes**, **event listeners**, or **global references**.  
- Use **clinic.js** or **memwatch-next** for deeper analysis.  

---  

## 23. What is the purpose of a **reverse proxy** (like **Nginx**) in front of a **Node.js** app?  

---  

💡 **Benefits**  
- Handles **TLS termination**, **gzip compression**, **caching**.  
- Provides **load balancing** across multiple Node instances.  
- Serves **static assets** efficiently.  
- Acts as a **security layer** (rate limiting, IP filtering).  

---  

## 24. How do you handle **file uploads** in **Node.js**?  

---  

💡 **Common approaches**  
- Use middleware like **multer** (for Express) to parse `multipart/form-data`.  
- Stream directly to storage (e.g., **AWS S3**, **Google Cloud Storage**) to avoid buffering whole file in memory.  
- Validate file size, type, and sanitize filenames.  

---  

## 25. What is the difference between **process.env** and a **.env** file?  

---  

| Aspect | **process.env** | **.env file** |
|--------|----------------|---------------|
| Source | Environment variables set by the OS or Docker/K8s | Plain‑text file loaded at runtime (e.g., via **dotenv**) |
| Scope | Global for the running process | Not automatically loaded; must be parsed |
| Security | Safer when injected by CI/CD pipelines | Must be excluded from VCS (`.gitignore`) |
| Usage | `process.env.PORT` | `require('dotenv').config(); process.env.PORT` |  

---  

## 26. How does **Node.js** handle **uncaught exceptions** and **unhandled promise rejections**?  

---  

💡 **Handling strategies**  
- `process.on('uncaughtException', handler)` – last‑ditch for sync errors (restart process).  
- `process.on('unhandledRejection', handler)` – catch rejected promises not awaited.  
- Prefer **domain** or **try/catch** with `async/await`.  
- Use a **process manager** (PM2, forever) to auto‑restart on fatal errors.  

---  

## 27. What is **REPL** in **Node.js**?  

---  

💡 **Features**  
- Interactive **Read‑Eval‑Print Loop** (`node` command).  
- Supports **multiline input**, **.save**, **.load**, and **custom context**.  
- Useful for quick experiments, debugging, and exploring APIs.  

---  

## 28. What is the **libuv** library's role in **Node.js**?  

---  

💡 **Responsibilities**  
- Provides the **event loop**, **thread pool**, and **cross‑platform abstractions** (file system, DNS, networking).  
- Enables **asynchronous I/O** on Windows, macOS, and Linux.  

---  

## 29. How would you **scale** a **Node.js** application **horizontally**?  

---  

💡 **Scaling tactics**  
- Deploy multiple **instances** behind a **load balancer** (NGINX, HAProxy, cloud LB).  
- Use the **Cluster** module or **PM2** to fork workers on each CPU core.  
- Store **state** in external services (Redis, databases) to keep instances stateless.  
- Implement **container orchestration** (Docker + Kubernetes).  

---  

## 30. What is the difference between a **callback**, a **promise**, and **async/await** in **Node.js** code?  

---  

| Concept | **Callback** | **Promise** | **async/await** |
|---------|--------------|------------|----------------|
| Syntax | `fn(arg, (err, result) => {})` | `fn(arg).then(...).catch(...)` | `const result = await fn(arg);` |
| Readability | Can become **callback hell** | Linear chaining, easier to read | Looks like **synchronous** code, error handling with `try/catch` |
| Error propagation | First argument convention (`err`) | Rejection path (`catch`) | `try/catch` around `await` |
| Composability | Manual nesting | `Promise.all`, `race`, etc. | Same as promises (since `await` works on promises) |

---  

## 31. What is the difference between a **callback**, a **promise**, and **async/await** in **Node.js** code?  

---  

| Concept | **Callback** | **Promise** | **async/await** |
|---------|--------------|------------|----------------|
| Syntax | `fn(arg, (err, data) => {})` | `fn(arg).then(...).catch(...)` | `const data = await fn(arg);` |
| Flow control | Nested functions | Chainable `.then()` | Straight‑line `await` statements |
| Error handling | `err` argument | `.catch()` | `try/catch` |
| Debugging | Stack traces can be fragmented | Better stack traces | Same as promises, with async stack traces |

---  

## 💻 Coding Challenges  

*No coding‑implementation questions were present in the original list.*  

---
