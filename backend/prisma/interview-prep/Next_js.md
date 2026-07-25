<!--LANG:roman-->

<!--LANG:roman-->

# Next.js Interview Questions

## 1. What is Next.js and what problems does it solve over plain React?

**Asaan Urdu mein:**  
Next.js ek React framework hai jo server‑side rendering (SSR), static site generation (SSG), file‑based routing, API routes, aur image optimization jaise features out‑of‑the‑box deta hai. Plain React sirf client‑side rendering karta hai, isliye SEO aur initial load performance mein kami hoti hai. Next.js in problems ko bina extra configuration ke solve karta hai, code‑splitting aur routing ko bhi automate karta hai.  

```jsx
// pages/index.js — file-based routing means this is /
export default function Home({ posts }) {
  return (
    <main>
      <h1>Blog</h1>
      {posts.map(post => <article key={post.id}>{post.title}</article>}
    </main>
  );
}

// getServerSideProps runs on each request, rendering on the server
export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();
  return { props: { posts } };
}
```

---

## 2. What is the difference between the App Router and Pages Router?

**Asaan Urdu mein:**  
Pages Router (`pages/`) purane Next.js versions ka hissa hai aur `getServerSideProps` ya `getStaticProps` jaise exports par depend karta hai. App Router (`app/`) Next.js 13+ mein aata hai, React Server Components, nested layouts, streaming, aur simplified data fetching ko support karta hai. Dono ka syntax alag hota hai, lekin dono hi routing ka kaam karte hain.  

```jsx
// Pages Router: pages/blog/[slug].js
export async function getServerSideProps({ params }) {
  const data = await fetch(`/api/blog/${params.slug}`).then(r => r.json());
  return { props: { data } };
}
export default function Blog({ data }) { return <article>{data.title}</article>; }

// App Router: app/blog/[slug]/page.js — Server Component by default
export default async function Blog({ params }) {
  const data = await fetch(`https://api.example.com/blog/${params.slug}`);
  const post = await data.json();
  return <article>{post.title}</article>;
}
```

---

## 3. What is Server-Side Rendering (SSR) in Next.js?

**Asaan Urdu mein:**  
SSR ka matlab hai ke React components ko har request par server pe HTML mein render kiya jata hai, phir client ko poora page bheja jata hai. Isse SEO improve hoti hai aur user ko content jaldi milta hai. Pages Router mein `getServerSideProps` se SSR hota hai, jabke App Router mein `cache: 'no-store'` ya `dynamic = 'force-dynamic'` use kiya jata hai.  

```jsx
// App Router — SSR by adding no-store
export default async function Dashboard() {
  const data = await fetch('https://api.example.com/dashboard', {
    cache: 'no-store', // forces SSR — fetch on every request
  });
  const stats = await data.json();
  return <div>Users: {stats.users}</div>;
}

// Equivalent Pages Router
export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/dashboard');
  const stats = await res.json();
  return { props: { stats } };
}
```

---

## 4. What is Static Site Generation (SSG) and when should you use it?

**Asaan Urdu mein:**  
SSG ka matlab hai ke HTML build time par generate hoti hai, na ke har request par. Yeh pages CDN se serve kiye jate hain, isliye load speed bohat fast hoti hai. Blog posts, documentation, ya marketing pages jo rarely change hote hain, unke liye SSG best choice hai.  

```jsx
// App Router — default is static
export default async function About() {
  const data = await fetch('https://api.example.com/about', {
    cache: 'force-cache', // default — fetch at build time, static output
  });
  return <div>{data.content}</div>;
}

// Pages Router
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/about');
  const content = await res.json();
  return { props: { content } };
}
```

---

## 5. What is Incremental Static Regeneration (ISR)?

**Asaan Urdu mein:**  
ISR aapko static pages ko rebuild kiye baghair update karne ki sahulat deta hai. Aap `revalidate` interval set karte hain; us interval ke baad pehla request background mein page regenerate karta hai, aur agle requests fresh content lete hain. Isse SSG ki speed aur SSR ki freshness dono milti hain.  

```jsx
// App Router — ISR with revalidate
export default async function Product({ params }) {
  const data = await fetch(`https://api.example.com/products/${params.id}`, {
    next: { revalidate: 60 }, // regenerate at most every 60 seconds
  });
  const product = await data.json();
  return <div>{product.name} — ${product.price}</div>;
}

// Pages Router
export async function getStaticProps({ params }) {
  const res = await fetch(`/api/products/${params.id}`);
  const product = await res.json();
  return { props: { product }, revalidate: 60 };
}
```

---

## 6. What is the difference between getStaticProps, getServerSideProps, and getStaticPaths?

**Asaan Urdu mein:**  
`getStaticProps` build time par data fetch karta hai (SSG). `getServerSideProps` har request par data fetch karta hai (SSR). `getStaticPaths` dynamic routes ke liye pre‑rendered paths define karta hai, taake SSG ke sath dynamic pages generate ho saken.  

```jsx
// getStaticPaths + getStaticProps — pre-render specific blog posts at build time
export async function getStaticPaths() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  return {
    paths: posts.map(p => ({ params: { slug: p.slug } })),
    fallback: 'blocking', // or true/false
  };
}

export async function getStaticProps({ params }) {
  const post = await fetch(`https://api.example.com/posts/${params.slug}`)
    .then(r => r.json());
  return { props: { post }, revalidate: 300 };
}

// getServerSideProps — always server-render
export async function getServerSideProps({ params, req }) {
  const session = await getSession(req);
  return { props: { session } };
}
```

---

## 7. What are Server Components vs Client Components in the App Router?

**Asaan Urdu mein:**  
Server Components sirf server par run hoti hain, unka client bundle size zero hota hai, aur wo directly database ya file system access kar sakti hain. Inmein React hooks ya event handlers allowed nahi hain. Client Components `'use client'` directive se mark ki jati hain, browser mein run hoti hain, aur `useState`, `useEffect` jaise hooks use kar sakti hain.  

```jsx
// app/page.js — Server Component (default)
import db from '@/lib/db';
import LikeButton from './LikeButton';

export default async function Article({ params }) {
  const article = await db.articles.findUnique(params.id); // direct DB
  return (
    <article>
      <h1>{article.title}</h1>
      <p>{article.body}</p>
      <LikeButton id={article.id} /> {/* Client component imported */}
    </article>
  );
}

// app/LikeButton.js — Client Component
'use client';
export default function LikeButton({ id }) {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>
    {liked ? 'Unlike' : 'Like'}
  </button>;
}
```

---

## 8. How does file-based routing work in Next.js?

**Asaan Urdu mein:**  
Folder aur file ka structure URL path define karta hai. `app/blog/page.js` `/blog` banta hai, `app/blog/[slug]/page.js` `/blog/:slug` banta hai. Special files jaise `page.js`, `layout.js`, `loading.js`, `error.js` ka reserved meaning hota hai. Yeh approach manual routing ko eliminate karti hai.  

```
app/
├── page.js          → /
├── about/
│   └── page.js      → /about
├── blog/
│   ├── page.js      → /blog
│   └── [slug]/
│       └── page.js  → /blog/:slug
├── dashboard/
│   ├── layout.js    → layout for /dashboard/*
│   └── settings/
│       └── page.js  → /dashboard/settings
└── api/
    └── users/
        └── route.js → /api/users
```

---

## 9. What is the purpose of the 'use client' directive?

**Asaan Urdu mein:**  
`'use client'` directive se component ko Client Component mark kiya jata hai, yani wo browser mein run hoti hai. Isse component React hooks (`useState`, `useEffect`) aur browser APIs (DOM events) use kar sakti hai. Agar directive na ho, to component Server Component hoti hai aur interactivity allowed nahi hoti.  

```jsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0); // ❌ forbidden without 'use client'
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

---

## 10. What are dynamic routes in Next.js and how are they implemented?

**Asaan Urdu mein:**  
Dynamic routes folder names mein brackets (`[slug]`, `[id]`) use karte hain, jo URL ke variable segments ko capture karte hain. `params` prop ke through in values ko access kiya jata hai. Catch‑all (`[...slug]`) aur optional catch‑all (`[[...slug]]`) bhi available hain, jo multiple segments ko handle karte hain.  

```jsx
// app/products/[category]/[productId]/page.js
export default async function ProductPage({ params }) {
  // params = { category: 'electronics', productId: '42' }
  const { category, productId } = await params;
  const product = await fetch(
    `https://api.example.com/${category}/${productId}`
  ).then(r => r.json());
  return <h1>{product.name}</h1>;
}

// catch-all: app/blog/[...slug]/page.js → /blog/2024/jan/post-1
// params.slug = ['2024', 'jan', 'post-1']
```

---

## 11. What is middleware in Next.js and what is it used for?

**Asaan Urdu mein:**  
Middleware har request se pehle Edge runtime par run hota hai. Isse aap URL rewrite, redirect, custom headers add, ya authentication check kar sakte hain. Middleware file project ke root mein `middleware.ts` ya `middleware.js` hoti hai, aur `matcher` se specify kiya jata hai ke kaunse routes par apply hoga.  

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value;

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Add custom header
  const response = NextResponse.next();
  response.headers.set('x-custom-header', 'hello');
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
```

---

## 12. How does Next.js handle image optimization (next/image)?

**Asaan Urdu mein:**  
`next/image` component automatically images ko WebP/AVIF format mein convert, size adjust, lazy‑load, aur layout shift avoid karta hai by requiring explicit `width` and `height`. Images Next.js ke built‑in optimizer se serve hoti hain, jo CDN caching aur on‑the‑fly resizing provide karta hai.  

```jsx
import Image from 'next/image';

export default function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero banner"
      width={1200}
      height={600}
      priority // skip lazy loading for above-the-fold images
      className="rounded-lg"
    />
  );
}
```

---

## 13. What is the difference between next/link and a regular anchor tag?

**Asaan Urdu mein:**  
`next/link` client‑side navigation enable karta hai—page reload nahi hoti, React state preserve hoti hai, aur link prefetch hota hai jab viewport mein aata hai. Regular `<a>` tag full page reload cause karta hai, jis se state loss aur flash hota hai. External URLs ke liye `<a>` hi use hota hai.  

```jsx
import Link from 'next/link';

export default function Nav() {
  return (
    <nav>
      {/* Client-side navigation — no full reload */}
      <Link href="/about">About</Link>
      <Link href="/blog/post-1" prefetch={false}>Post</Link>

      {/* External links still use <a> */}
      <a href="https://example.com" target="_blank">External</a>
    </nav>
  );
}
```

---

## 14. What are API routes / route handlers in Next.js?

**Asaan Urdu mein:**  
API routes (`pages/api/*`) aur route handlers (`app/api/*/route.ts`) aapko serverless endpoints create karne ki sahulat dete hain. Yeh endpoints HTTP methods (GET, POST, etc.) handle karte hain aur client side se direct fetch kiye ja sakte hain. App Router mein `route.js` ya `route.ts` file ka naam use hota hai.  

```jsx
// App Router: app/api/users/route.js
export async function GET() {
  const users = await db.users.findMany();
  return Response.json(users);
}

export async function POST(request) {
  const body = await request.json();
  const user = await db.users.create({ data: body });
  return Response.json(user, { status: 201 });
}

// Dynamic: app/api/users/[id]/route.js
export async function GET(request, { params }) {
  const user = await db.users.findUnique(await params.id);
  if (!user) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(user);
}
```

---

## 15. How does Next.js handle code splitting automatically?

**Asaan Urdu mein:**  
Next.js har page ke liye alag JavaScript chunk generate karta hai, jo sirf us page ke navigate hone par load hota hai. App Router mein Server Components client bundle mein nahi aate, aur Client Components route segment ke hisaab se split hote hain. Agar aapko extra split chahiye, to `next/dynamic` se lazy load kar sakte hain.  

```jsx
// Each page gets its own bundle automatically
// pages/index.js → chunk for /
// pages/about.js → chunk for /about

// Manual dynamic import for components within a page
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  ssr: false, // don't render on server
  loading: () => <p>Loading chart...</p>,
});

export default function Dashboard() {
  return <HeavyChart />; // loaded only when this page renders
}
```

---

## 16. What is the purpose of the _app.js and _document.js files (Pages Router)?

**Asaan Urdu mein:**  
`_app.js` har page ko wrap karta hai—global layout, providers (theme, auth), aur state persistence ke liye use hota hai. `_document.js` sirf server side par HTML document structure customize karta hai (doctype, `<html>`, `<body>`), jaise custom fonts ya third‑party scripts add karne ke liye.  

```jsx
// pages/_app.js — wraps every page
import { SessionProvider } from 'next-auth/react';
import '@/styles/globals.css';

export default function App({ Component, pageProps, router }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} key={router.asPath} />
      </Layout>
    </SessionProvider>
  );
}

// pages/_document.js — server-only HTML customization
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link href="https://fonts.googleapis.com/..." rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

---

## 17. What is streaming SSR and how does Next.js support it with Suspense?

**Asaan Urdu mein:**  
Streaming SSR HTML ko chunks mein client ko bhejta hai jab wo ready hoti hai, poori page render hone ka intezar nahi karta. `Suspense` ke saath, aap parts ko progressive load kar sakte hain—pehle visible content, phir slower components. Next.js App Router is feature ko native support karta hai.  

```jsx
import { Suspense } from 'react';

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* This blocks the initial HTML until ready */}
      <Suspense fallback={<Skeleton />}>
        <SlowComponent /> {/* streams in when ready */}
      </Suspense>
      <Suspense fallback={<p>Loading comments...</p>}>
        <Comments />
      </Suspense>
    </div>
  );
}

async function SlowComponent() {
  await new Promise(r => setTimeout(r, 3000)); // simulates slow data
  return <div>Slow content</div>;
}
```

---

## 18. How do you handle environment variables in Next.js?

**Asaan Urdu mein:**  
Next.js `.env.local`, `.env.development`, aur `.env.production` files ko support karta hai. `NEXT_PUBLIC_` prefix wali variables client side par expose hoti hain, baaki sirf server side par available hoti hain. Inhe `process.env.VARIABLE_NAME` se access kiya jata hai.  

```
# .env.local (not committed to git)
DATABASE_URL=postgres://...
NEXT_PUBLIC_GA_ID=UA-XXXXX-Y

# .env.development — development only
API_URL=http://localhost:3000

# .env.production — production only
API_URL=https://api.example.com
```

```jsx
// Server-only (never exposed to client)
export async function GET() {
  const db = new PrismaClient(process.env.DATABASE_URL);
  // ...
}

// Public (available in browser)
export default function Analytics() {
  return <script src={`https://ga.com?id=${process.env.NEXT_PUBLIC_GA_ID}`} />;
}
```

---

## 19. What is the difference between Next.js layouts and templates in the App Router?

**Asaan Urdu mein:**  
`layout.js` parent route ke liye persistent UI (sidebar, nav) define karta hai—child route change hone par layout unmount nahi hota, isliye state preserve rehti hai. `template.js` har navigation par naya instance create karta hai, isliye `useEffect` ya animations har page change par fire hoti hain.  

```jsx
// app/dashboard/layout.js — persists across /dashboard/* pages
export default function DashboardLayout({ children }) {
  return (
    <div>
      <nav>Sidebar (stays mounted)</nav>
      <main>{children}</main>
    </div>
  );
}

// app/dashboard/template.js — remounts on every navigation
'use client';
export default function Template({ children }) {
  useEffect(() => {
    console.log('page changed'); // fires on every navigation
    // good for page-view analytics
  }, []);
  return <div className="page">{children}</div>;
}
```

---

## 20. How does caching work in the Next.js App Router (fetch caching, route caching)?

**Asaan Urdu mein:**  
`fetch` ke `cache` option se response caching control hoti hai: `force-cache` (default, static), `no-store` (dynamic). `next.revalidate` ISR enable karta hai. Router cache browser mein rendered route segments ko store karta hai—static pages ke liye 5 minutes, dynamic pages ke liye 30 seconds tak.  

```jsx
// Static — cached at build time
const data = await fetch(url, { cache: 'force-cache' });

// Dynamic — never cached
const data = await fetch(url, { cache: 'no-store' });

// ISR — cached, revalidated every 60s
const data = await fetch(url, { next: { revalidate: 60 } });

// Tag-based revalidation
const data = await fetch(url, { next: { tags: ['posts'] } });
// Later, in a route handler or middleware:
// revalidateTag('posts')
```

---

## 21. What is next/font and why is it used for font optimization?

**Asaan Urdu mein:**  
`next/font` automatically fonts ko download, self‑host, aur subset karta hai, taake external network request na ho. Yeh `font-display: optional` set karta hai, layout shift kam hota hai, aur proper preload links generate karta hai.  

```jsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const mono = Roboto_Mono({ subsets: ['latin'], weight: '400' });

export default function Layout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <h1 style={{ fontFamily: mono.style.fontFamily }}>Monospace heading</h1>
        {children}
      </body>
    </html>
  );
}
```

---

## 22. How do you implement authentication in a Next.js application?

**Asaan Urdu mein:**  
Common approach NextAuth.js (Auth.js) hai—social providers ya credentials ke liye. Middleware se protected routes define kiye jate hain. App Router mein Server Components `getServerSession` se session check karte hain, aur client side login forms `'use client'` ke saath banaye jate hain.  

```jsx
// app/api/auth/[...nextauth]/route.js (NextAuth.js)
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

const handler = NextAuth({
  providers: [
    GithubProvider({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET }),
  ],
});

export { handler as GET, handler as POST };

// middleware.ts — protect routes
export { default } from 'next-auth/middleware';
export const config = { matcher: ['/dashboard/:path*'] };

// app/dashboard/page.js — server component, check session
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await getServerSession();
  if (!session) redirect('/api/auth/signin');
  return <p>Welcome, {session.user.name}</p>;
}
```

---

## 23. What is the difference between client-side navigation and full page reloads in Next.js?

**Asaan Urdu mein:**  
Client‑side navigation (`next/link` ya `router.push`) sirf page data aur JavaScript load karta hai, poora page reload nahi hota—React state preserve hoti hai aur transition fast hoti hai. Full page reload (`<a>` ya browser refresh) sab assets dobara download hoti hain, state lose hoti hai, aur white flash hota hai.  

```jsx
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const router = useRouter();

  return (
    <div>
      {/* Client-side navigation — fast, state preserved */}
      <Link href="/dashboard">Dashboard</Link>
      <button onClick={() => router.push('/settings')}>Settings</button>
      <button onClick={() => router.back()}>Back</button>

      {/* Full page reload — slow, state lost */}
      <a href="/about">About (reloads page)</a>
    </div>
  );
}
```

---

## 24. What are Route Groups and Parallel Routes in the App Router?

**Asaan Urdu mein:**  
Route Groups (folders like `(marketing)`) URL ko affect nahi karte, sirf file structure ko organize karte hain. Parallel Routes (`@slot` folders) ek hi layout ke andar multiple UI sections render karte hain, har ek ka apna loading/error state hota hai—dashboards ya complex pages ke liye useful.  

```jsx
// Route Groups — URL unaffected by group name
// app/(marketing)/about/page.js → /about
// app/(dashboard)/settings/page.js → /settings

// Parallel Routes — render multiple slots
// app/dashboard/layout.js
export default function DashboardLayout({ children, analytics, team }) {
  return (
    <div className="dashboard">
      <main>{children}</main>       {/* default slot */}
      <aside>{analytics}</aside>    {/* @analytics slot */}
      <aside>{team}</aside>         {/* @team slot */}
    </div>
  );
}

// app/dashboard/@analytics/page.js → rendered in analytics slot
// app/dashboard/@team/page.js → rendered in team slot
```

---

## 25. How do you handle SEO in a Next.js application?

**Asaan Urdu mein:**  
App Router mein `Metadata` API se title, description, Open Graph, Twitter cards, canonical URLs, aur JSON‑LD set kiye jate hain. Pages Router ke liye `next/head` use hota hai. Server‑rendered HTML mein metadata include hoti hai, jo crawlers ke liye SEO friendly hoti hai.  

```jsx
// app/blog/[slug]/page.js — Metadata API (App Router)
export async function generateMetadata({ params }) {
  const post = await fetch(`https://api.example.com/posts/${params.slug}`)
    .then(r => r.json());

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
    },
    alternates: {
      canonical: `/blog/${params.slug}`,
    },
  };
}

export default async function BlogPost({ params }) {
  const post = await fetch(...).then(r => r.json());
  return <article>{post.content}</article>;
}
```

---

## 26. What is the difference between edge runtime and Node.js runtime in Next.js?

**Asaan Urdu mein:**  
Edge Runtime lightweight V8 isolates par chalti hai—fast cold start lekin limited APIs (no `fs`, limited Node modules). Node.js Runtime full Node environment provide karta hai—slow start lekin sabhi Node APIs aur heavy computation ke liye suitable. Edge ko middleware, personalization, ya A/B testing ke liye use karte hain; Node ko database access ya heavy server logic ke liye.  

```jsx
// edge runtime — runs on CDN edge (Edge Functions)
// middleware.ts
export const config = { runtime: 'edge' };
export function middleware(request) {
  const country = request.geo?.country || 'US';
  return NextResponse.rewrite(new URL(`/${country}${request.nextUrl.pathname}`, request.url));
}

// node.js runtime — full Node.js capabilities
// app/api/process/route.js
export const runtime = 'nodejs';
export async function POST(request) {
  const data = await request.json();
  const result = heavyComputation(data); // full Node.js
  return Response.json(result);
}
```

---

## 27. How does revalidation work with ISR (time-based vs on-demand)?

**Asaan Urdu mein:**  
Time‑based ISR (`revalidate: 60`) har 60 seconds ke baad first request page ko background mein regenerate karta hai. On‑demand revalidation `revalidatePath('/blog/post-1')` ya `revalidateTag('posts')` se manually cache invalidate ki jati hai—usually CMS webhook ke baad.  

```jsx
// Time-based ISR
const data = await fetch(url, { next: { revalidate: 60 } });

// On-demand revalidation — in a Route Handler
// app/api/revalidate/route.js
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request) {
  const body = await request.json();
  
  // Revalidate a specific path
  revalidatePath(`/blog/${body.slug}`);
  
  // Or revalidate all fetches with a tag
  revalidateTag('posts');

  return Response.json({ revalidated: true });
}

// Triggered by CMS webhook:
// POST /api/revalidate { "slug": "my-post" }
```

---

## 28. What is the purpose of loading.js and error.js special files in the App Router?

**Asaan Urdu mein:**  
`loading.js` ek automatic Suspense boundary create karta hai—page data load hone tak fallback UI (skeleton) dikhata hai. `error.js` ek error boundary hoti hai—agar component tree mein error aata hai to custom error UI render hoti hai. Dono files us route segment ke liye apply hoti hain.  

```jsx
// app/dashboard/loading.js — shows while dashboard data loads
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="h-64 bg-gray-200 rounded" />
    </div>
  );
}

// app/dashboard/error.js — catches errors in dashboard
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

---

## 29. How do you deploy a Next.js application (Vercel vs self-hosted)?

**Asaan Urdu mein:**  
Vercel Next.js ke liye optimal platform hai—zero configuration, automatic ISR, Edge Functions, preview deployments per branch, aur built‑in analytics. Self‑hosting (Docker ya Node server) aapko infrastructure control deta hai, lekin aapko manual setup, ISR handling, aur caching configure karni padti hai. `next start` ya Docker image se self‑host kiya jata hai.  

```Dockerfile
# Dockerfile for self-hosting
FROM node:20-alpine AS runner
WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
# Build for standalone output
next build

# Start production server (self-hosted)
node .next/standalone/server.js

# Vercel deployment — just push to Git, Vercel auto-detects Next.js
```

---

## 30. What is the difference between static and dynamic rendering in the App Router?

**Asaan Urdu mein:**  
Static rendering build time par page HTML generate karta hai—cache hoti hai aur CDN se serve hoti hai. Dynamic rendering request time par hoti hai—har request ke liye fresh HTML generate hoti hai. App Router default static hoti hai (`cache: 'force-cache'`), lekin agar aap `cookies()`, `headers()`, ya `cache: 'no-store'` use karte hain to dynamic ho jati hai.  

```jsx
// Static rendering — generated at build time
export default async function About() {
  // no dynamic APIs used → static
  const res = await fetch('https://api.example.com/about', { cache: 'force-cache' });
  const data = await res.json();
  return <div>{data.content}</div>;
}

// Dynamic rendering — generated per request
export default async function Dashboard() {
  // cookies() is a dynamic API → forces dynamic rendering
  const cookieStore = await cookies();
  const res = await fetch('https://api.example.com/dashboard', { cache: 'no-store' });
  const data = await res.json();
  return <div>{data.message}</div>;
}

// Forced static or dynamic
export const dynamic = 'force-static';   // force static
export const dynamic = 'force-dynamic';  // force dynamic
```

---

## 31. What is the purpose of the _app.js and _document.js files (Pages Router)?

**Asaan Urdu mein:**  
`_app.js` har page ko wrap karta hai—global layout, providers (theme, auth), aur state persistence ke liye use hota hai. `_document.js` sirf server side par HTML document structure customize karta hai (doctype, `<html>`, `<body>`), jaise custom fonts ya third‑party scripts add karne ke liye.  

```jsx
// pages/_app.js — wraps every page
import { SessionProvider } from 'next-auth/react';
import '@/styles/globals.css';

export default function App({ Component, pageProps, router }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} key={router.asPath} />
      </Layout>
    </SessionProvider>
  );
}

// pages/_document.js — server-only HTML customization
import { Html,

<!--LANG:english-->

# Next.js Interview Questions  

---

## 1. What is **Next.js** and what problems does it solve over plain **React**?

💡 **Key points to cover**  
- Server‑side rendering & static generation out of the box  
- File‑based routing & API routes  
- Built‑in image & font optimization  
- Zero‑config performance optimizations (code‑splitting, prefetching)  

---

## 2. What is the difference between the **App Router** and **Pages Router**?

| Feature | **App Router** | **Pages Router** |
|---------|----------------|-----------------|
| **File location** | `app/` directory | `pages/` directory |
| **Routing style** | Nested, layout‑driven routes | Flat file‑based routes |
| **Data fetching** | `fetch`, `async` Server Components | `getStaticProps`, `getServerSideProps`, `getStaticPaths` |
| **Component type** | Supports **Server** & **Client** components via `use client` | Primarily **Client** components (except API routes) |
| **Streaming & Suspense** | Built‑in streaming SSR | Not natively supported |
| **Parallel & Route Groups** | ✅ | ❌ |
| **Edge runtime** | First‑class support | Supported via custom config |

---

## 3. What is **Server‑Side Rendering (SSR)** in **Next.js**?

💡 **SSR** renders a page on the server **on each request**, sending fully populated HTML to the client.  
- Improves SEO & initial load time  
- Uses `getServerSideProps` (Pages Router) or Server Components (App Router)  

---

## 4. What is **Static Site Generation (SSG)** and when should you use it?

💡 **SSG** generates HTML at **build time**. Use when:  

- Content is **static** or changes infrequently  
- You want the fastest possible page loads  
- SEO is a priority  

---

## 5. What is **Incremental Static Regeneration (ISR)**?

💡 **ISR** lets you **re‑generate** static pages **after** the build, on a per‑page basis, using a `revalidate` interval or on‑demand triggers.  

---

## 6. What is the difference between **`getStaticProps`**, **`getServerSideProps`**, and **`getStaticPaths`**?

| Function | When it runs | Primary use case | Return shape |
|----------|--------------|------------------|--------------|
| **`getStaticProps`** | Build time (or ISR) | Fetch data for **SSG** pages | `{ props, revalidate? }` |
| **`getServerSideProps`** | Every request | Fetch data for **SSR** pages | `{ props }` |
| **`getStaticPaths`** | Build time | Define dynamic routes for **SSG** | `{ paths, fallback }` |

---

## 7. What are **Server Components** vs **Client Components** in the **App Router**?

💡 **Server Components** (`.tsx` without `use client`) run only on the server, can fetch data directly, and never ship JS to the browser.  
💡 **Client Components** (`'use client'`) run in the browser, can use state/hooks, and are bundled into client‑side JS.  

---

## 8. How does **file‑based routing** work in **Next.js**?

- Every file inside `pages/` (or `app/` for the new router) becomes a route.  
- `[param]` creates a **dynamic segment**.  
- `index.js` maps to the folder root.  

---

## 9. What is the purpose of the **`'use client'`** directive?

💡 Marks a component as a **Client Component**, enabling browser‑only features (state, effects, event handlers).  

---

## 10. What are **dynamic routes** in **Next.js** and how are they implemented?

- Use square‑bracket syntax: `pages/posts/[id].js` or `app/posts/[id]/page.tsx`.  
- Combine with `getStaticPaths` (SSG) or `getServerSideProps` (SSR) to fetch data.  

---

## 11. What is **middleware** in **Next.js** and what is it used for?

- Runs **before** a request is processed.  
- Ideal for redirects, authentication, geolocation, A/B testing.  
- Defined in `middleware.ts` (or `middleware.js`) at the project root.  

---

## 12. How does **Next.js** handle **image optimization** (`next/image`)?

- Automatic resizing, lazy‑loading, and WebP conversion.  
- Uses the built‑in **Image Optimizer** server or Vercel Edge.  

---

## 13. What is the difference between **`next/link`** and a regular anchor tag?

| Aspect | **`next/link`** | **`<a>` tag** |
|--------|----------------|--------------|
| **Navigation** | Client‑side route change (no full reload) | Full page reload |
| **Prefetch** | Automatic prefetch of linked page | None |
| **SEO** | Preserves SPA behavior while staying crawlable | Same, but slower UX |
| **Usage** | `<Link href="/about"><a>About</a></Link>` (v13+ can omit `<a>`) | `<a href="/about">About</a>` |

---

## 14. What are **API routes / route handlers** in **Next.js**?

- Files inside `pages/api/` (Pages Router) or `app/api/` (App Router).  
- Export a function (`GET`, `POST`, etc.) that runs on the server.  

---

## 15. How does **Next.js** handle **code splitting** automatically?

- Splits each page into its own bundle.  
- Dynamically imports components (`next/dynamic`) for further granularity.  

---

## 16. What is the purpose of the **`_app.js`** and **`_document.js`** files (Pages Router)?

- **`_app.js`**: Wraps all pages; ideal for global CSS, layout, state providers.  
- **`_document.js`**: Customizes the HTML document (e.g., `<html>`, `<head>`); runs only on the server.  

---

## 17. What is **streaming SSR** and how does **Next.js** support it with **Suspense**?

- Streams HTML to the client **as soon as parts are ready**, reducing Time‑to‑First‑Byte.  
- Uses React **Suspense** boundaries in Server Components to pause/resume rendering.  

---

## 18. How do you handle **environment variables** in **Next.js**?

- Prefix public variables with `NEXT_PUBLIC_`.  
- Store secrets in `.env.local`, `.env.production`, etc.  
- Access via `process.env.VAR_NAME`.  

---

## 19. What is the difference between **Next.js layouts** and **templates** in the **App Router**?

| Concept | **Layout** | **Template** |
|---------|------------|--------------|
| **Purpose** | Persistent UI (nav, footer) shared across routes | Defines a **page skeleton** that can be swapped per route |
| **File location** | `layout.tsx` inside a folder | `template.tsx` inside a folder |
| **Re‑use** | Re‑used for all nested routes | Specific to a route group |
| **Data fetching** | Can contain `fetch` calls (Server Component) | Typically static markup |  

---

## 20. How does **caching** work in the **Next.js App Router** (**fetch caching**, **route caching**)?

- `fetch` respects `Cache-Control` headers; can use `next: { revalidate: X }`.  
- Route segment caching can be controlled via `export const revalidate = X;`.  

---

## 21. What is **`next/font`** and why is it used for **font optimization**?

- Provides **zero‑runtime** font loading.  
- Generates `@font-face` CSS at build time, subsets fonts, and inlines critical CSS.  

---

## 22. How do you implement **authentication** in a **Next.js** application?

💡 **Implementation tips**  
- Use **NextAuth.js**, **Auth0**, or custom JWT middleware.  
- Protect routes via **middleware** or **Server Components** that check session.  
- Store tokens in **httpOnly cookies** for security.  

---

## 23. What is the difference between **client‑side navigation** and **full page reloads** in **Next.js**?

| Aspect | **Client‑side navigation** (`next/link`) | **Full page reload** (`<a>` without `next/link`) |
|--------|------------------------------------------|---------------------------------------------------|
| **Network** | Fetches only JSON/data for the new page | Requests the entire HTML document |
| **State** | Preserves React state (e.g., Redux) | Resets all client state |
| **Performance** | Faster, smoother transitions | Slower, full reload |
| **SEO** | Same SEO outcome, better UX | Same SEO, poorer UX |

---

## 24. What are **Route Groups** and **Parallel Routes** in the **App Router**?

- **Route Groups** (`(group)/`) allow grouping routes without affecting the URL.  
- **Parallel Routes** (`@slot/`) enable rendering multiple UI slots side‑by‑side (e.g., sidebar + main).  

---

## 25. How do you handle **SEO** in a **Next.js** application?

💡 **SEO checklist**  
- Use `<Head>` to set meta tags, title, canonical URLs.  
- Generate **sitemaps** (`next-sitemap`).  
- Implement **structured data** (`JSON‑LD`).  
- Leverage **SSR/SSG** for crawlable content.  

---

## 26. What is the difference between **edge runtime** and **Node.js runtime** in **Next.js**?

| Feature | **Edge Runtime** | **Node.js Runtime** |
|---------|------------------|----------------------|
| **Location** | Edge network (Vercel Edge, Cloudflare) | Traditional server or serverless functions |
| **Cold start** | Near‑zero | Higher latency |
| **APIs** | Limited (Web Streams, fetch) | Full Node.js APIs |
| **Use case** | Low‑latency auth, geo‑targeting | Heavy server‑side logic, file system access |

---

## 27. How does **revalidation** work with **ISR** (**time‑based** vs **on‑demand**)?

- **Time‑based**: `revalidate` seconds in `getStaticProps`.  
- **On‑demand**: Call `/api/revalidate` (or `res.revalidate`) to manually purge the cache.  

---

## 28. What is the purpose of **`loading.js`** and **`error.js`** special files in the **App Router**?

- **`loading.js`**: Renders a fallback UI while a route or component is loading (Suspense).  
- **`error.js`**: Displays an error boundary UI when a route throws.  

---

## 29. How do you deploy a **Next.js** application (**Vercel** vs **self‑hosted**)?

💡 **Deployment tips**  
- **Vercel**: One‑click deploy, automatic edge functions, built‑in image/font optimization.  
- **Self‑hosted**: Use `next build && next start` or Docker; configure Node/Edge runtime manually; handle image optimization via `next/image` loader or external service.  

---

## 30. What is the difference between **static** and **dynamic rendering** in the **App Router**?

| Rendering mode | **Static** | **Dynamic** |
|----------------|------------|-------------|
| **When it runs** | Build time (or ISR) | On each request (SSR) |
| **Data fetching** | `fetch` with `revalidate` or no fetch | `fetch` without caching, or Server Components with live data |
| **Use case** | Blog posts, marketing pages | User‑specific dashboards, auth‑protected pages |

---

## 31. What is the purpose of the **`_app.js`** and **`_document.js`** files (Pages Router)?

*(Repeated from #16 – see that answer for details.)*  

---

## 💻 Coding Challenges  

### 22. How do you implement **authentication** in a **Next.js** application?

*(Implementation details go here – e.g., code snippets using NextAuth.js, middleware, etc.)*  

### 29. How do you deploy a **Next.js** application (**Vercel** vs **self‑hosted**)?

*(Implementation steps, Dockerfile example, Vercel CLI commands, etc.)*
