<!--LANG:roman-->

# Performance Interview Questions

## 1. What is the critical rendering path and how does it affect page load time?

**Asaan Urdu mein:**  
Critical rendering path wo steps ka silsila hai jo browser HTML, CSS, aur JavaScript ko screen pixels mein tabdeel karta hai – DOM, CSSOM, render tree, layout, aur paint. Har render‑blocking resource (jaise external CSS ya synchronous JS) First Meaningful Paint ko delay karta hai. Is path ko optimize karne ke liye render‑blocking resources ko kam karein, critical CSS ko inline karein, aur non‑critical JavaScript ko defer ya async banayein.

```javascript
// Defer non-critical JavaScript to avoid blocking rendering
// In HTML <head>:
{/* <script defer src="app.js"></script> */}
// `defer` downloads while HTML parses, executes after

// Inline critical CSS in <head> for instant paint
{/* <style>
  body { font-family: sans-serif; margin: 0; }
  .hero { background: blue; height: 100vh; }
</style> */}

// Detect LCP (Largest Contentful Paint) for measurement
new PerformanceObserver((list) => {
  const entries = list.getEntries();
  console.log('LCP:', entries[entries.length - 1].startTime);
}).observe({ type: 'largest-contentful-paint', buffered: true });
```

---

## 2. What is the difference between code splitting and lazy loading?

**Asaan Urdu mein:**  
Code splitting build‑time technique hai jisme bundle ko chhote chunks (jaise route‑wise) mein divide kiya jata hai. Lazy loading runtime practice hai jisme koi module tab tak load nahi hota jab tak uski zaroorat na ho. React mein `React.lazy()` aur dynamic `import()` dono milke lazy‑loaded code splitting ko enable karte hain – chunk sirf component render hone par fetch hota hai.

```javascript
// Before: single bundle imported eagerly
// import AdminPanel from './AdminPanel';

// After: code splitting + lazy loading
const AdminPanel = React.lazy(() => import('./AdminPanel'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      {user.isAdmin && <AdminPanel />}
      {/* AdminPanel chunk loads ONLY when user.isAdmin is true */}
    </Suspense>
  );
}
```

---

## 3. What is tree shaking and how does it reduce bundle size?

**Asaan Urdu mein:**  
Tree shaking ek build‑time optimization hai jahan bundlers (Webpack, Rollup, esbuild) ES module ke static import/export ko analyse kar ke unused exports ko bundle se hata dete hain. Ye sirf ES modules ke saath kaam karta hai; CommonJS `require()` ko tree‑shake nahi kiya ja sakta. Named imports tree shaking ko enable karte hain, jabke default imports kabhi‑kabhi unused code le aate hain.

```javascript
// utils.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const secretFn = () => 'sensitive';  // unused

// app.js — tree shaking removes `subtract` and `secretFn`
import { add } from './utils';
console.log(add(2, 3));

// Webpack production mode enables tree shaking by default
// Check bundle analyzer for dead code
// npx webpack --analyze
```

---

## 4. What is the difference between debouncing and throttling for performance optimization?

**Asaan Urdu mein:**  
Debouncing function ko tab tak delay karta hai jab tak koi quiet period na ho – jaise search‑as‑you‑type, jab user typing rok de to hi request bhejti hai. Throttling function ko har specified interval mein sirf ek baar chalne deta hai – scroll ya resize events ke liye useful. Debounce pauses ka intizaar karta hai, throttle execution rate ko limit karta hai.

```javascript
// Debounce: fires AFTER user stops typing
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
const onSearch = debounce((query) => fetchResults(query), 300);
searchInput.addEventListener('input', (e) => onSearch(e.target.value));

// Throttle: fires at most once every 100ms
function throttle(fn, limit) {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
window.addEventListener('scroll', throttle(() => console.log('scroll'), 100));
```

---

## 5. What are Core Web Vitals (LCP, FID/INP, CLS)?

**Asaan Urdu mein:**  
Core Web Vitals Google ke UX performance metrics hain. LCP (Largest Contentful Paint) page ke sabse bade visible element ke load hone ka time batata hai – ideally 2.5 s se kam. FID (First Input Delay) user ke pehle interaction ka delay measure karta tha, ab INP (Interaction to Next Paint) se replace ho gaya – 200 ms se kam target. CLS (Cumulative Layout Shift) visual stability ko measure karta hai – score 0.1 se kam hona chahiye. Ye metrics SEO ranking ko directly affect karte hain.

```javascript
// Programmatically measure Core Web Vitals
import { onCLS, onFID, onLCP, onINP } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  navigator.sendBeacon('/analytics', body);
}

// Register the metrics
onCLS(sendToAnalytics);
onFID(sendToAnalytics);  // legacy, use onINP
onLCP(sendToAnalytics);
onINP(sendToAnalytics);
```

---

## 6. What is memoization and how does it improve performance in React apps?

**Asaan Urdu mein:**  
Memoization ek technique hai jahan expensive function ke result ko uske inputs ke basis par cache kiya jata hai, taake same inputs aane par cached result return ho. React mein `React.memo` component ko tab tak re‑render hone se rokta hai jab tak props change na ho. `useMemo` computed values ko cache karta hai, aur `useCallback` function references ko stable rakhta hai – isse unnecessary re‑calculations aur re‑renders kam hote hain.

```javascript
// React.memo — prevents re-render if props haven't changed
const ExpensiveList = React.memo(({ items }) => {
  return items.map(item => <div key={item.id}>{item.name}</div>);
});

// useMemo — caches expensive computation
function Dashboard({ transactions }) {
  const total = useMemo(() =>
    transactions.reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );
  return <div>Total: ${total}</div>;
}

// useCallback — stable function reference
const handleClick = useCallback(() => setCount(c => c + 1), []);
```

---

## 7. What is the difference between client-side rendering, server-side rendering, and static generation in terms of performance?

**Asaan Urdu mein:**  
| Rendering Type | How it works | Performance impact |
|----------------|--------------|--------------------|
| **CSR** (Client‑Side Rendering) | Browser gets minimal HTML, JS renders UI | Slow first paint, fast subsequent navigation |
| **SSR** (Server‑Side Rendering) | Server renders HTML per request | Faster first paint, higher server load, slower TTFB |
| **SSG** (Static Generation) | HTML pre‑built at build time | Fastest TTFB & FCP, ideal for content that rarely changes |

Next.js in‑built support deta hai in teeno approaches.

```javascript
// Next.js examples:

// CSR — client fetches and renders
function Profile() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch('/api/user').then(setData); }, []);
  return data ? <div>{data.name}</div> : <Spinner />;
}

// SSG — pre-built at build time
export async function getStaticProps() {
  const data = await fetchCMS('pages/home');
  return { props: { data } };  // HTML built at build time
}

// SSR — rendered per request
export async function getServerSideProps() {
  const data = await fetchLatestData();
  return { props: { data } };  // Rendered on each request
}
```

---

## 8. How do you reduce the initial bundle size of a JavaScript application?

**Asaan Urdu mein:**  
Initial bundle ko chhota karne ke liye: route‑wise code‑splitting (`React.lazy`), tree‑shaking unused exports, heavy libraries ko dynamic import se lazy load karna, bade libraries ko lightweight alternatives (moment → dayjs) se replace karna, gzip/brotli compression enable karna, aur `webpack-bundle-analyzer` se bundle ka audit karna.

```javascript
// webpack.config.js — analyze bundle size
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  plugins: [new BundleAnalyzerPlugin()],
};

// Replace heavy libraries
// Instead of: import moment from 'moment';
import dayjs from 'dayjs';

// Dynamic import for heavy dependency
const loadChart = () => import('chart.js');
// Only loads when needed

// Production builds strip dead code automatically
// npm run build --production
```

---

## 9. What is caching and what are the different caching strategies (browser cache, CDN, service worker)?

**Asaan Urdu mein:**  
Caching resources ki copies ko store karke future requests ko tez banata hai. Browser cache `Cache-Control` headers (`max-age`, `no-cache`, `immutable`) se local storage manage karta hai. CDN cache static assets ko globally edge servers par replicate karta hai, latency kam karta hai. Service Worker cache (Cache API) programmatic control deta hai – offline‑first ya stale‑while‑revalidate strategies implement ki ja sakti hain.

```javascript
// Browser caching via HTTP headers (server-side)
// Cache-Control: public, max-age=31536000, immutable

// Service Worker — Cache First strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Return cached response, or fetch from network
      return cached || fetch(event.request).then((response) => {
        return caches.open('v1').then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

// Stale-While-Revalidate
// Cache-Control: stale-while-revalidate=86400
```

---

## 10. What is a memory leak and how would you detect one in a web application?

**Asaan Urdu mein:**  
Memory leak tab hota hai jab app aise objects ko reference karta rahe jo ab zaroori nahi, isse garbage collector unhe free nahi kar pata. Common leaks: abandoned timers, detached DOM nodes, closures that hold large data, global variables. Chrome DevTools ke **Memory** panel se heap snapshots lein, allocation timeline record karein, aur time ke sath retained size ka growth dekhein.

```javascript
// Common memory leak: setInterval with no cleanup
function startPolling() {
  const data = [];
  setInterval(() => {
    data.push({ time: Date.now() });  // grows unbounded!
  }, 1000);
}

// Fix: clear interval and bound size
function startPollingFixed() {
  const data = [];
  const id = setInterval(() => {
    if (data.length > 100) data.shift();  // cap size
    data.push({ time: Date.now() });
  }, 1000);
  return () => clearInterval(id);  // cleanup on unmount
}

// Detect: Chrome DevTools > Memory > Take heap snapshot
// Compare snapshots before/after user actions
```

---

## 11. What is the difference between reflow and repaint, and how do they impact performance?

**Asaan Urdu mein:**  
| Concept | What it does | Performance cost |
|---------|--------------|------------------|
| **Reflow** (layout) | Element positions & geometries recalculate jab DOM/CSS layout‑affecting changes hoti hain | Expensive, may affect many descendants |
| **Repaint** | Pixels redraw hoti hain without layout change (e.g., `color`, `background-color`) | Cheaper, but still consumes paint time |
| **Relation** | Reflow always triggers a repaint; repaint does **not** trigger reflow | Minimize reflows, use `transform`/`opacity` for animations |

```javascript
// Bad: causes multiple reflows
element.style.width = '100px';
element.style.height = '100px';
element.style.margin = '10px';

// Good: single reflow via class
element.classList.add('box');
// .box { width: 100px; height: 100px; margin: 10px; }

// Use transform instead of position changes (no reflow)
element.style.transform = 'translateY(100px)';  // composite only

// Batch reads before writes
requestAnimationFrame(() => {
  const rect = element.getBoundingClientRect();  // read
  requestAnimationFrame(() => {
    element.style.width = rect.width * 2 + 'px';  // write
  });
});
```

---

## 12. How would you optimize images for faster page load?

**Asaan Urdu mein:**  
Images ko optimize karne ke liye: modern formats (WebP, AVIF) use karein, compression tools (sharp, imagemin) se size kam karein, `srcset`/`sizes` ke saath responsive images deliver karein, native lazy‑loading (`loading="lazy"`), CDN ke through proper `Cache‑Control` headers set karein, `<picture>` element se art‑direction provide karein, aur bahut choti icons ko base64 inline embed karein.

```javascript
// Responsive images with WebP fallback
// <picture>
//   <source srcset="hero.avif" type="image/avif" />
//   <source srcset="hero.webp" type="image/webp" />
//   <img src="hero.jpg" alt="Hero" loading="lazy"
//        srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1200.jpg 1200w"
//        sizes="(max-width: 600px) 100vw, 50vw" />
// </picture>

// Build-time compression with sharp (Node.js)
const sharp = require('sharp');
await sharp('input.jpg')
  .resize(800)
  .webp({ quality: 80 })
  .toFile('output.webp');
```

---

## 13. What is lazy loading and how is it implemented for images and components?

**Asaan Urdu mein:**  
Lazy loading off‑screen resources ko tab tak postpone karta hai jab tak unki zaroorat na ho, isse initial page weight aur bandwidth dono kam hoti hain. Images ke liye native `loading="lazy"` attribute ya Intersection Observer API istemal hoti hai. Components ke liye React ka `React.lazy()` aur dynamic `import()` use hota hai. Intersection Observer viewport entry detect kar ke custom lazy loading logic chalata hai.

```javascript
// Native lazy loading for images
<img src="photo.jpg" loading="lazy" alt="Photo" />

// Intersection Observer for custom lazy loading
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});
document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));

// React component lazy loading
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
<Suspense fallback={<Spinner />}>
  {show && <HeavyComponent />}
</Suspense>
```

---

## 14. What is the purpose of a CDN and how does it improve performance?

**Asaan Urdu mein:**  
CDN (Content Delivery Network) static assets ko globally distributed edge servers par cache karta hai, taake user ke nazdeek server se content serve ho. Isse latency kam hoti hai, origin server ka load kam hota hai, DDoS protection milti hai, aur aksar on‑the‑fly optimizations (compression, image resizing) hoti hain. Cloudflare, Fastly, AWS CloudFront jaise popular CDNs is kaam karte hain.

```javascript
// CDN URL structure
// https://cdn.example.com/assets/main.a1b2c3.js

// CloudFront distribution setup (pseudo)
// Origin: your-server.com
// Behaviors: /static/* -> cache 1 year
// Edge locations: 400+ points of presence globally

// Service Worker with CDN fallback
self.addEventListener('fetch', (event) => {
  const cdnUrl = event.request.url.replace(
    'my-server.com',
    'd1x3v9f8q7.cloudfront.net'
  );
  event.respondWith(
    fetch(cdnUrl).catch(() => fetch(event.request))
  );
});
```

---

## 15. How do you measure and profile performance in a React application?

**Asaan Urdu mein:**  
React DevTools ka **Profiler** component render timings record karta hai, unnecessary re‑renders ko pinpoint karta hai, aur commit phases ko visualize karta hai. Runtime profiling ke liye `console.time()`, `performance.mark()/measure()` use hota hai, aur `why-did-you-render` library extra insights deti hai. Production monitoring ke liye `web-vitals` library LCP/FID/CLS track karti hai, aur CI pipelines mein Lighthouse CI performance budgets enforce kar sakti hai.

```javascript
// React DevTools Profiler — wrap section to profile
import { Profiler } from 'react';

function onRender(id, phase, actualDuration) {
  console.log(`${id} (${phase}): ${actualDuration}ms`);
}

<Profiler id="Dashboard" onRender={onRender}>
  <Dashboard />
</Profiler>

// Performance marks for custom measurement
performance.mark('render-start');
// ... render code ...
performance.mark('render-end');
performance.measure('render', 'render-start', 'render-end');
console.log(performance.getEntriesByType('measure'));

// Lighthouse CI — automated performance budgets
// lighthouse --budget=budget.json --view
```

---

## 16. What is the difference between HTTP/1.1, HTTP/2, and HTTP/3 in terms of performance?

**Asaan Urdu mein:**  

| Protocol | Key Feature | Performance Effect |
|----------|------------|-------------------|
| **HTTP/1.1** | One request per TCP connection (≈6 per origin) | Head‑of‑line blocking, many connections needed |
| **HTTP/2** | Multiplexed streams on a single connection, header compression (HPACK), server push | Fewer connections, but still TCP‑level blocking |
| **HTTP/3** | QUIC over UDP, 0‑RTT handshake, no TCP head‑of‑line blocking | Faster connection setup, better loss recovery |

```javascript
// HTTP/1.1 — multiple connections needed
// Connection 1: GET /style.css
// Connection 2: GET /script.js
// Connection 3: GET /image.png

// HTTP/2 — single connection multiplexed
// Connection: GET /style.css, GET /script.js, GET /image.png

// HTTP/3 — QUIC over UDP (no TCP head-of-line blocking)

// Enable HTTP/2 on server (Node.js)
const http2 = require('http2');
const server = http2.createSecureServer({ cert, key });
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.end('Hello');
});
```

---

## 17. What is preloading, prefetching, and preconnect in the context of resource hints?

**Asaan Urdu mein:**  
`preload` browser ko batata hai ke koi critical resource (font, hero image) ko parser discover karne se pehle hi fetch kar le. `prefetch` future navigation ke liye low‑priority resources ko download karta hai. `preconnect` DNS, TCP, aur TLS handshake ko pehle se establish karta hai, taake actual request jaldi start ho sake. Ye hints parallelism badhate hain aur perceived performance ko improve karte hain.

```javascript
// Preload — critical resources needed early
{/* <link rel="preload" href="fonts/inter.woff2" as="font" crossorigin /> */}
{/* <link rel="preload" href="hero.webp" as="image" /> */}

// Prefetch — resources for next page
{/* <link rel="prefetch" href="/products.js" as="script" /> */}
{/* <link rel="prefetch" href="/next-page.css" as="style" /> */}

// Preconnect — warm up connections early
{/* <link rel="preconnect" href="https://api.example.com" /> */}
{/* <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /> */}

// Dynamic preloading in JavaScript
const link = document.createElement('link');
link.rel = 'preload';
link.href = '/critical.css';
link.as = 'style';
document.head.appendChild(link);
```

---

## 18. How would you optimize a slow database query?

**Asaan Urdu mein:**  
Slow query ko optimize karne ke liye: appropriate indexes (single‑column, composite, covering) add karein, `EXPLAIN ANALYZE` se full table scans identify karein, `SELECT *` ki jagah required columns hi select karein, pagination (`LIMIT`/`OFFSET` ya keyset pagination) use karein, aggregation ko database side pe shift karein, aur frequent queries ko Redis ya Memcached se cache karein.

```javascript
// Slow query — full table scan
// SELECT * FROM orders WHERE status = 'pending';

// Optimized — add index, select only needed columns
// CREATE INDEX idx_orders_status ON orders(status);
// SELECT id, user_id, total FROM orders WHERE status = 'pending';
// Or composite: CREATE INDEX idx_orders_status_created ON orders(status, created_at);

// Application-level caching with Redis
const cache = require('./redis');
async function getPopularProducts() {
  const cached = await cache.get('popular:products');
  if (cached) return JSON.parse(cached);

  const products = await db.query(`
    SELECT id, name, sales_count
    FROM products
    ORDER BY sales_count DESC
    LIMIT 20
  `);

  await cache.set('popular:products', JSON.stringify(products), 'EX', 300);
  return products;
}
```

---

## 19. What is virtualization/windowing (e.g., react-window) and when is it useful?

**Asaan Urdu mein:**  
Virtualization (windowing) sirf viewport ke andar visible rows/items ko render karta hai, baaki items ko DOM se hata deta hai. `react-window` ya `react-virtualized` viewport calculation karke visible items ko render karta hai aur scroll ke saath DOM nodes recycle hoti hain. Yeh technique large lists (thousands ya lakhs items), tables, feeds, aur chat logs ke liye bahut useful hai – DOM node count, memory, aur paint time dramatically kam hota hai.

```javascript
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={600}          // visible height
      itemCount={items.length} // total items: 100,000
      itemSize={50}         // row height in px
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
// Renders ~13 DOM nodes instead of 100,000
```

---

## 20. How do web workers help with performance?

**Asaan Urdu mein:**  
Web Workers JavaScript ko background thread mein chalate hain, jis se heavy computations (image processing, data transformation, encryption) UI thread ko block nahi karte. Main thread aur worker `postMessage()`/`onmessage` ke through communicate karte hain. Workers DOM access nahi kar sakte, isliye sirf pure computation ke liye best hain. OffscreenCanvas aur WebAssembly workers ke saath milke graphics aur compute‑intensive workloads ko aur tez bana dete hain.

```javascript
// worker.js — runs on background thread
self.onmessage = (event) => {
  const { data } = event;
  // Heavy computation — doesn't block UI
  const result = processLargeArray(data);
  self.postMessage(result);
};

function processLargeArray(items) {
  return items
    .map(x => expensiveCalculation(x))
    .filter(x => x > 100);
}

// main.js — sends work to worker
const worker = new Worker('worker.js');

worker.postMessage(largeDataSet);  // send data

worker.onmessage = (event) => {
  console.log('Result:', event.data);  // receive processed data
};

// Cleanup
// worker.terminate();
```

---

<!--LANG:english-->

# Performance Interview Questions  

## 1. What is the **critical rendering path** and how does it affect page load time?

💡 The critical rendering path is the sequence of steps the browser takes to turn HTML, CSS, and JavaScript into pixels on the screen.  

- **HTML parsing → CSSOM construction → DOM tree → Render tree → Layout → Paint**  
- Anything that blocks or lengthens these steps (e.g., large CSS files, synchronous scripts) directly **increases First Contentful Paint (FCP)** and overall page‑load time.  

**Tips**  
- Minimize render‑blocking resources.  
- Use `async`/`defer` for scripts.  
- Inline critical CSS and defer non‑critical CSS.

---

## 2. What is the difference between **code splitting** and **lazy loading**?

| Feature | **Code Splitting** | **Lazy Loading** |
|---------|-------------------|-------------------|
| **Goal** | Break the bundle into smaller chunks at build time. | Load a chunk only when it’s needed at runtime. |
| **When it happens** | During bundling (e.g., using Webpack’s `splitChunks`). | At the moment a component, route, or asset is requested. |
| **Typical APIs** | `import()` dynamic import, `require.ensure`. | React `React.lazy`, `Suspense`; IntersectionObserver for images. |
| **Benefit** | Reduces initial bundle size for every user. | Defers loading of rarely‑used code, saving bandwidth. |

💡 Combine both: split your codebase into logical chunks and lazy‑load the ones not required on the first render.

---

## 3. What is **tree shaking** and how does it reduce bundle size?

- **Tree shaking** is a dead‑code elimination technique used by modern bundlers (e.g., Webpack, Rollup).  
- It works only with **ES6 module syntax** (`import`/`export`) because the static structure allows the bundler to determine which exports are never used.  

**Result:** Unused functions, classes, or constants are omitted from the final bundle, often shaving **10‑30 %** off the size.

**Tips**  
- Prefer named exports over default exports.  
- Enable `mode: "production"` in Webpack to activate built‑in minification and tree shaking.

---

## 4. What is the difference between **debouncing** and **throttling** for performance optimization?

| Aspect | **Debouncing** | **Throttling** |
|--------|----------------|----------------|
| **Definition** | Delays execution until a pause of *X* ms occurs. | Guarantees execution at most once every *X* ms. |
| **Use‑case** | Search‑box autocomplete, window‑resize events. | Scroll‑position updates, rate‑limited API calls. |
| **Behavior** | Fires **once** after the last event. | Fires **repeatedly** at a fixed interval while events continue. |

💡 Choose **debounce** when you need the *final* state; choose **throttle** when you need periodic updates.

---

## 5. What are **Core Web Vitals** (**LCP**, **FID/INP**, **CLS**)?

- **LCP (Largest Contentful Paint):** Time until the largest visible element loads. Aim < 2.5 s.  
- **FID (First Input Delay) / INP (Interaction to Next Paint):** Measures latency of the first user interaction. Aim < 100 ms (FID) or < 200 ms (INP).  
- **CLS (Cumulative Layout Shift):** Quantifies unexpected layout shifts. Aim < 0.1.  

**Tips**  
- Optimize LCP by serving critical images and CSS early.  
- Reduce main‑thread work to improve FID/INP.  
- Reserve space for images/ads to keep CLS low.

---

## 6. What is **memoization** and how does it improve performance in **React** apps?

- **Memoization** caches the result of a pure function based on its inputs.  
- In React, `React.memo`, `useMemo`, and `useCallback` prevent unnecessary re‑renders or recalculations.  

**When to use**  
- Expensive calculations inside render.  
- Component props that rarely change but cause deep re‑renders.  

💡 Over‑using memoization can add overhead; profile before applying.

---

## 7. What is the difference between **client‑side rendering (CSR)**, **server‑side rendering (SSR)**, and **static generation (SSG)** in terms of performance?

| Approach | How it works | First‑paint performance |
|-----------|--------------|--------------------------|
| **CSR** (Client‑Side Rendering) | Browser receives minimal HTML; JavaScript fetches data and builds UI. | Slow initial paint, fast subsequent navigation (SPA). |
| **SSR** (Server‑Side Rendering) | Server renders HTML per request and sends fully‑formed markup. | Faster first paint, higher server load, slightly slower TTFB. |
| **SSG** (Static Generation) | HTML is pre‑built at build time and served as static files. | Fastest TTFB & FCP; ideal for content that rarely changes. |

💡 **Next.js** provides built‑in support for all three approaches, letting you pick the best strategy per page.

---

## 8. How do you reduce the **initial bundle size** of a JavaScript application?

- **Code splitting** (dynamic `import()`).  
- **Tree shaking** (use ES6 modules).  
- **Remove dead code** (linting, `eslint-plugin-unused-imports`).  
- **Compress assets** (`gzip`, `brotli`).  
- **Use lighter libraries** or replace with native APIs.  
- **Lazy‑load** non‑essential components and assets.  

💡 Run `webpack-bundle-analyzer` to visualize bundle composition and target the biggest offenders.

---

## 9. What is **caching** and what are the different caching strategies (**browser cache**, **CDN**, **service worker**)?

| Strategy | Where it lives | Typical use‑case |
|----------|----------------|-----------------|
| **Browser cache** | HTTP cache headers (`Cache‑Control`, `ETag`). | Static assets (CSS, JS, images). |
| **CDN** | Edge servers worldwide. | Deliver large files globally, reduce latency. |
| **Service worker** | Client‑side script controlling fetch events. | Offline support, stale‑while‑revalidate, runtime caching. |

**Tips**  
- Set long `max‑age` for immutable assets (hash‑named files).  
- Use `stale‑while‑revalidate` to serve cached content while updating in the background.

---

## 10. What is a **memory leak** and how would you detect one in a web application?

- A **memory leak** occurs when objects that are no longer needed remain reachable, preventing garbage collection.  
- Common sources: lingering DOM references, timers/intervals not cleared, closures holding large data.  

**Detection**  
- Chrome DevTools → **Performance** > **Memory** > **Heap snapshot**.  
- Look for continuously growing **Detached DOM trees** or **Listeners**.  

💡 Always clean up in `useEffect` return functions, `componentWillUnmount`, and clear timers.

---

## 11. What is the difference between **reflow** and **repaint**, and how do they impact performance?

| Concept | What happens | Cost |
|---------|--------------|------|
| **Reflow** (layout) | Browser recalculates element positions & geometries after DOM/CSS changes that affect layout. | Expensive; can affect many descendants. |
| **Repaint** | Browser redraws pixels without changing layout (e.g., `color`, `background-color`). | Cheaper but still consumes paint time. |
| **Relation** | **Reflow always triggers a repaint**; repaint **does not** trigger reflow. | Minimize reflows; use `transform`/`opacity` for animations. |

**Tips**  
- Batch DOM reads **before** writes.  
- Prefer CSS classes over inline style changes.  
- Use `will-change` sparingly to hint the compositor.

---

## 12. How would you **optimize images** for faster page load?

- Serve **next‑gen formats** (`WebP`, `AVIF`).  
- Use **responsive images** (`srcset`, `<picture>`).  
- Apply **lazy loading** (`loading="lazy"`).  
- Compress images (lossless or lossy) with tools like `imagemin`.  
- Set proper **width/height** attributes to avoid layout shifts.  

💡 Combine with a CDN that performs on‑the‑fly image optimization.

---

## 13. What is **lazy loading** and how is it implemented for **images** and **components**?

- **Lazy loading** defers the download of resources until they are needed.  

**Images**  
```html
<img src="hero.jpg" loading="lazy" alt="Hero">
```  

**Components (React)**  
```jsx
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```  

**Tips**  
- Use IntersectionObserver for custom image lazy loading.  
- Avoid lazy‑loading above‑the‑fold content.

---

## 14. What is the purpose of a **CDN** and how does it improve performance?

- **Content Delivery Network** caches static assets on edge servers close to the user.  
- Reduces **latency**, offloads origin server, and provides **automatic failover**.  

**Benefits**  
- Faster TTFB and download speeds.  
- Lower bandwidth costs on origin.  
- Built‑in DDoS mitigation.

---

## 15. How do you **measure and profile performance** in a **React** application?

- **React DevTools** → Profiler tab (record renders, identify wasted renders).  
- **Chrome Performance panel** (record timeline, look for long tasks > 50 ms).  
- **Web Vitals** library (`reportWebVitals`) for LCP, CLS, etc.  
- **Custom hooks** (`usePerformance`) to log render durations.  

💡 Combine component‑level profiling with network‑level metrics for a full picture.

---

## 16. What is the difference between **HTTP/1.1**, **HTTP/2**, and **HTTP/3** in terms of performance?

| Protocol | Key Characteristics | Performance impact |
|----------|-------------------|-------------------|
| **HTTP/1.1** | One request per TCP connection (≈6 per origin). | Head‑of‑line blocking; many connections needed. |
| **HTTP/2** | Multiplexed streams on a single connection, header compression, server push. | Fewer connections, but still TCP‑level blocking. |
| **HTTP/3** | QUIC over UDP, 0‑RTT handshake, no TCP head‑of‑line blocking. | Faster connection setup, better loss recovery, lower latency. |

**Tips**  
- Enable HTTP/2/3 on the server (e.g., via TLS termination).  
- Use `preload` and `push` wisely; over‑pushing can hurt performance.

---

## 17. What are **preloading**, **prefetching**, and **preconnect** in the context of **resource hints**?

- **`<link rel="preload">`** – Fetches a resource **immediately** with high priority (e.g., critical CSS).  
- **`<link rel="prefetch">`** – Fetches a resource **in idle time** for future navigation.  
- **`<link rel="preconnect">`** – Opens early TCP/TLS connections to a third‑party origin.  

💡 Use `preload` for above‑the‑fold assets, `prefetch` for next‑page resources, and `preconnect` for CDNs or analytics domains.

---

## 18. How would you **optimize a slow database query**?

- **Add appropriate indexes** on columns used in `WHERE`, `JOIN`, `ORDER BY`.  
- **Analyze the query plan** (`EXPLAIN`) to spot full table scans.  
- **Rewrite** inefficient joins or sub‑queries (e.g., use `EXISTS` instead of `IN`).  
- **Cache** frequent read results (Redis, Memcached).  
- **Paginate** large result sets; avoid `SELECT *`.  

💡 Periodically **vacuum** and **re‑index** to keep statistics fresh.

---

## 19. What is **virtualization/windowing** (e.g., **react-window**) and when is it useful?

- **Virtualization** renders only the items visible in the viewport, replacing off‑screen items with placeholders.  
- **When useful:** Long lists or tables (thousands of rows) where rendering every DOM node would cause jank.  

**Benefits**  
- Reduces memory usage and paint time.  
- Keeps UI responsive during scrolling.

---

## 20. How do **web workers** help with performance?

- **Web workers** run JavaScript in a separate thread, off‑loading heavy computation from the main UI thread.  
- They communicate via **postMessage** (structured cloning).  

**Typical uses**  
- Image processing, data parsing, complex calculations, background syncing.  

💡 Keep data transferred small; avoid frequent messaging that can negate the benefit.

---  

## 💻 Coding Challenges  

*(No coding‑implementation questions were present in the original set.)*
