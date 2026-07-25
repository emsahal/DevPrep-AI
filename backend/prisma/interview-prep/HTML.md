<!--LANG:roman-->

# HTML Interview Questions

## 1. What is HTML and how is it different from HTML5?

**Asaan Urdu mein:**  
HTML (HyperText Markup Language) web pages banane ka bunyadi zubaan hai. HTML5 is ka aakhri major version hai jo semantic tags, native multimedia, canvas, form validation aur naye APIs (jaise localStorage, Web Workers) introduce karta hai. Is se code zyada readable, accessible aur interactive hota hai.  

```html
<!-- HTML5 semantic structure -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>HTML5 Page</title>
</head>
<body>
  <header>
    <nav>Navigation</nav>
  </header>
  <main>
    <article>
      <section>Content</section>
    </article>
  </main>
  <footer>Footer</footer>
</body>
</html>
```

---



---

## 2. What is the DOCTYPE declaration and why is it needed?

**Asaan Urdu mein:**  
`<!DOCTYPE html>` browser ko batata hai ke page ko standards mode mein render karo, quirks mode nahi. Yeh line HTML document ki sab se pehli line honi chahiye. Agar missing ho, browser purane browsers ki tarah behave karta hai aur layout inconsistencies aati hain.  

```html
<!-- Correct HTML5 DOCTYPE -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Standards Mode</title>
</head>
<body>
  <p>Browser renders in standards mode.</p>
</body>
</html>

<!-- Without DOCTYPE, quirks mode is triggered -->
<!-- This causes CSS box model differences and layout bugs -->
```

---



---

## 3. Explain the difference between block-level and inline elements.

**Asaan Urdu mein:**  
Block-level elements nayi line se start hoti hain aur poori width le leti hain (jaise `<div>`, `<p>`, `<h1>`). Inline elements text ke beech flow karti hain aur sirf zaroori width leti hain (jaise `<span>`, `<a>`, `<strong>`). Block elements ke andar inline ho sakte hain, lekin inline ke andar block nahi.  

```html
<div style="border: 1px solid red; margin: 4px;">
  Block: takes full width, starts new line
</div>
<span style="border: 1px solid blue;">
  Inline: flows in text, only as wide as content
</span>
<span style="border: 1px solid green;">
  Another inline — sits beside previous inline
</span>
```

---



---

## 4. What are semantic HTML elements? Give examples.

**Asaan Urdu mein:**  
Semantic elements ka matlab hai ke woh element ka maqsad browser aur developer dono ko clearly batate hain. Ye accessibility, SEO aur code readability ko behtar banate hain. Common examples: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`, `<figure>`, `<figcaption>`.  

```html
<body>
  <header>
    <h1>Site Title</h1>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <article>
      <h2>Blog Post Title</h2>
      <p>Content...</p>
      <section>
        <h3>Comments</h3>
      </section>
    </article>
    <aside>
      <h3>Related Posts</h3>
    </aside>
  </main>
  <footer>&copy; 2026</footer>
</body>
```

---



---

## 5. What is the difference between <div> and <span>?

**Asaan Urdu mein:**  
`<div>` ek block-level container hai jo nayi line se start hota hai aur poori width le leta hai. `<span>` ek inline container hai jo text ke beech flow karta hai. Layout sections ke liye `<div>` aur chhote text fragments ko style karne ke liye `<span>` istemal hota hai.  

```html
<div style="background: #f0f0f0; padding: 10px;">
  This div creates a block-level box.
  <span style="color: red; font-weight: bold;">
    This span is inline inside the div.
  </span>
  More text in the div block.
</div>
<div>Another block below the first one.</div>
```

---



---

## 6. What is the purpose of the <meta> tag?

**Asaan Urdu mein:**  
`<meta>` tag document ke metadata ko define karta hai—jaise character encoding, viewport settings, page description, keywords, author, Open Graph data, aur refresh/redirect instructions. Ye SEO, responsive design, aur social sharing ko improve karta hai.  

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Page description for SEO" />
  <meta name="keywords" content="html, meta, tutorial" />
  <meta name="author" content="Author Name" />
  <meta property="og:title" content="Title for Social Sharing" />
  <meta property="og:image" content="https://example.com/image.jpg" />
  <meta http-equiv="refresh" content="30" />
</head>
```

---



---

## 7. How do you make a website responsive using only HTML?

**Asaan Urdu mein:**  
Sirf HTML se poori responsiveness possible nahi, lekin `<meta name="viewport">` tag mobile devices ke liye zaroori hai. `<picture>` element aur `srcset` attributes responsive images ke liye use hote hain. Ye techniques images ko device width ke mutabiq load karte hain.  

```html
<!-- Essential meta tag for responsive -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- Responsive images with picture element -->
<picture>
  <source media="(min-width: 1024px)" srcset="large.jpg" />
  <source media="(min-width: 640px)" srcset="medium.jpg" />
  <img src="small.jpg" alt="Responsive image" />
</picture>

<!-- Responsive image with srcset -->
<img
  src="small.jpg"
  srcset="small.jpg 480w, medium.jpg 768w, large.jpg 1200w"
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="Responsive"
/>
```

---



---

## 8. What is the difference between HTML and XHTML?

**Asaan Urdu mein:**  
XHTML, HTML ka stricter XML‑based version hai. Isme har tag ko close karna zaroori hai, attributes ko quotes mein rakhna hota hai, aur nesting strict hoti hai. HTML browsers errors ko recover kar lete hain, lekin XHTML me error hone par page render nahi hota.  

```html
<!-- HTML (lenient) -->
<br>
<BR>
<input disabled>
<p><b>Nested</p></b>

<!-- XHTML (strict) -->
<br />
<br />
<input disabled="disabled" />
<p><b>Nested</b></p>
```

---



---

## 9. What are data-* attributes used for?

**Asaan Urdu mein:**  
`data-*` attributes custom data ko directly HTML element mein store karte hain. JavaScript se `element.dataset` ke through access hota hai. Ye state, identifiers, ya configuration values ke liye use hota hai, bina hidden inputs ya extra classes ke.  

```html
<button
  data-user-id="12345"
  data-role="admin"
  data-last-login="2026-07-25"
  onclick="handleClick(this)"
>
  User Profile
</button>

<script>
  function handleClick(el) {
    const userId = el.dataset.userId;    // "12345"
    const role = el.dataset.role;        // "admin"
    const lastLogin = el.dataset.lastLogin; // "2026-07-25"
    console.log(userId, role, lastLogin);
  }
</script>
```

---



---

## 10. What is the difference between id and class attributes?

**Asaan Urdu mein:**  
`id` page mein unique hota hai—sirf ek element ko assign kiya ja sakta hai. `class` multiple elements share kar sakte hain. CSS specificity mein `id` zyada specific hota hai. IDs ko unique elements (like header) ke liye, aur classes ko reusable styling ke liye use karo.  

```html
<!-- id: unique, class: reusable -->
<div id="header" class="box dark-bg">Header</div>
<div id="main-content" class="box light-bg">Main</div>
<div id="sidebar" class="box light-bg">Sidebar</div>

<style>
  #header { font-size: 24px; }             /* Specific to header */
  .box    { border: 1px solid #ccc; padding: 10px; }  /* Reusable */
  .dark-bg { background: #333; color: #fff; }
  .light-bg { background: #f5f5f5; }
</style>
```

---



---

## 11. Explain the HTML5 <canvas> element.

**Asaan Urdu mein:**  
`<canvas>` ek bitmap drawing surface provide karta hai jo JavaScript se manipulate hota hai. 2D API ya WebGL se shapes, text, images, animations draw ki ja sakti hain. Yeh pixel‑based hota hai, isliye SVG ke muqable mein zoom karne par quality loss hoti hai. Games, charts, aur image processing ke liye ideal hai.  

```html
<canvas id="myCanvas" width="400" height="300"></canvas>

<script>
  const ctx = document.getElementById('myCanvas').getContext('2d');

  // Draw a filled rectangle
  ctx.fillStyle = 'red';
  ctx.fillRect(20, 20, 100, 60);

  // Draw a circle
  ctx.beginPath();
  ctx.arc(200, 100, 40, 0, Math.PI * 2);
  ctx.fillStyle = 'blue';
  ctx.fill();

  // Draw text
  ctx.font = '24px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Hello Canvas', 50, 200);

  // Draw a line
  ctx.beginPath();
  ctx.moveTo(10, 250);
  ctx.lineTo(390, 250);
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 3;
  ctx.stroke();
</script>
```

---



---

## 12. What are void (self-closing) elements? Give examples.

**Asaan Urdu mein:**  
Void elements ke paas koi closing tag nahi hota aur woh child elements contain nahi kar sakte. Browser inhe automatically close samajhta hai. Common examples: `<br>`, `<hr>`, `<img>`, `<input>`, `<meta>`, `<link>`, `<area>`, `<base>`, `<col>`, `<embed>`, `<source>`, `<track>`, `<wbr>`.  

```html
<img src="photo.jpg" alt="Photo" />
<br />
<hr />
<input type="text" placeholder="Name" />
<meta charset="UTF-8" />
<link rel="stylesheet" href="styles.css" />
<source src="video.mp4" type="video/mp4" />
```

---



---

## 13. What is the difference between localStorage, sessionStorage, and cookies?

**Asaan Urdu mein:**  
`localStorage` data ko tab tak rakhta hai jab tak manually delete na kiya jaye—browser close hone par bhi rehte hain, capacity ~5‑10 MB. `sessionStorage` sirf current tab ke liye hota hai, tab close hone par clear ho jata hai. Cookies har HTTP request ke sath bheje jate hain, size ~4 KB, expiration set ki ja sakti hai, aur server‑side bhi access hota hai.  

```javascript
// localStorage — survives browser close
localStorage.setItem('theme', 'dark');
console.log(localStorage.getItem('theme')); // 'dark'
localStorage.removeItem('theme');
localStorage.clear();

// sessionStorage — cleared when tab closes
sessionStorage.setItem('cartItem', '123');
console.log(sessionStorage.getItem('cartItem')); // '123'

// Cookies — sent with every request
document.cookie = 'sessionId=abc123; path=/; max-age=86400'; // 1 day
document.cookie = 'theme=dark; path=/; Secure; HttpOnly';
console.log(document.cookie); // 'sessionId=abc123; theme=dark'
```

---



---

## 14. What is the purpose of the <iframe> tag and what are its security concerns?

**Asaan Urdu mein:**  
`<iframe>` doosre HTML page ko current page ke andar embed karta hai—YouTube videos, payment forms, ya third‑party widgets ke liye use hota hai. Security concerns mein clickjacking, XSS, aur data leakage shamil hain. `sandbox`, `allow` attributes, aur server‑side `X-Frame-Options` header se in risks ko mitigate kiya ja sakta hai.  

```html
<!-- Secure iframe with sandbox -->
<iframe
  src="https://example.com/widget"
  width="400"
  height="300"
  sandbox="allow-scripts allow-same-origin"
  allow="microphone 'none'; camera 'none'"
  referrerpolicy="no-referrer"
  loading="lazy"
></iframe>

<!-- Security headers the embedded page should set:
     X-Frame-Options: DENY or SAMEORIGIN
     Content-Security-Policy: frame-ancestors 'none' or 'self'
-->
```

---



---

## 15. What is the difference between <script>, <script async>, and <script defer>?

**Asaan Urdu mein:**  
Normal `<script>` HTML parsing ko block karta hai jab tak script download aur execute na ho jaye. `async` script parallel download hoti hai aur jaise hi ready ho jati hai execute hoti hai—parsing temporarily block hoti hai, order guarantee nahi hoti. `defer` parallel download hoti hai, lekin HTML parsing ke baad, DOM ready hone ke baad, DOM order mein execute hoti hai.  

```html
<!-- Blocking: pauses parsing to fetch and execute -->
<script src="critical.js"></script>

<!-- Async: fetches in parallel, executes immediately when ready -->
<script async src="analytics.js"></script>

<!-- Defer: fetches in parallel, executes in order after parsing -->
<script defer src="vendor.js"></script>
<script defer src="app.js"></script>

<!-- Execution order for defer:
     1. HTML parsing completes
     2. vendor.js executes (first in DOM order)
     3. app.js executes (second in DOM order)
-->
```

---



---

## 16. What are HTML entities and why are they used?

**Asaan Urdu mein:**  
HTML entities reserved characters (jaise `<`, `>`, `&`) ko encode karte hain taake wo browser ko tag ke roop mein na samjhe. Ye special symbols (©, €, →) ya whitespace (`&nbsp;`) display karne ke liye bhi use hoti hain. Entities ke bina markup galat interpret ho sakta hai.  

```html
<p>Use &amp;lt; for &lt; and &amp;gt; for &gt;</p>
<p>Copyright: &copy; 2026</p>
<p>Euro: &euro;100</p>
<p>Space: Hello&nbsp;World (non-breaking space)</p>
<p>Quotes: &quot;Hello&quot; and &apos;World&apos;</p>
<p>Arrow: &rarr; Next</p>

<!-- Rendered output:
     Use &lt; for < and &gt; for >
     Copyright: © 2026
     Euro: €100
     Space: Hello World (non-breaking)
     Quotes: "Hello" and 'World'
     Arrow: → Next
-->
```

---



---

## 17. Explain form validation attributes in HTML5 (required, pattern, min, max).

**Asaan Urdu mein:**  
HTML5 built‑in validation attributes bina JavaScript ke kaam karte hain. `required` field ko empty submit hone se rokti hai. `pattern` regex ke through value ko check karta hai. `min`/`max` numeric ya date range set karte hain. `minlength`/`maxlength` text length limit karte hain. Browser automatically error messages aur `:invalid` styling show karta hai.  

```html
<form onsubmit="event.preventDefault(); alert('Valid!')">
  <label>Name (required):</label>
  <input type="text" required minlength="2" maxlength="50" />

  <label>Age (10-99):</label>
  <input type="number" min="10" max="99" required />

  <label>ZIP Code (5 digits):</label>
  <input type="text" pattern="[0-9]{5}" title="Enter 5-digit ZIP" required />

  <label>Email:</label>
  <input type="email" required />

  <label>Password (8+ chars, 1 number):</label>
  <input type="password"
    pattern="(?=.*\d)(?=.*[a-zA-Z]).{8,}"
    title="8+ chars with at least 1 number"
    required />

  <button type="submit">Submit</button>
</form>
```

---



---

## 18. What is the difference between GET and POST in an HTML form?

**Asaan Urdu mein:**  
`GET` form data ko URL ke query string (`?key=value`) mein append karta hai—size limit hoti hai, data visible hota hai, aur bookmarkable hota hai. `POST` data ko request body mein bhejta hai—size limit nahi, data URL mein nahi dikhta, aur typically data create/update/delete ke liye use hota hai.  

```html
<!-- GET: visible in URL, limited size, bookmarkable -->
<form action="/search" method="get">
  <input name="q" type="text" placeholder="Search..." />
  <button type="submit">Search</button>
</form>
<!-- URL becomes: /search?q=hello -->

<!-- POST: hidden in body, no size limit, not cached -->
<form action="/users" method="post">
  <input name="name" type="text" required />
  <input name="email" type="email" required />
  <button type="submit">Create User</button>
</form>
<!-- Data sent in request body, not URL -->
```

---



---

## 19. What is the purpose of the alt attribute on <img>?

**Asaan Urdu mein:**  
`alt` attribute image load na hone par fallback text provide karta hai aur screen readers ke liye description deta hai—accessibility (a11y) ke liye zaroori. Search engines bhi alt text ko index karte hain, isliye SEO improve hoti hai. Decorative images ke liye `alt=""` use karna chahiye.  

```html
<!-- Informative image: describe content -->
<img src="chart.png" alt="Bar chart showing Q2 revenue up 25%" />

<!-- Decorative image: empty alt (screen readers skip) -->
<img src="divider-line.png" alt="" role="presentation" />

<!-- Image link: describe destination -->
<a href="/product">
  <img src="product.jpg" alt="View product details" />
</a>

<!-- Broken image fallback: shows alt text -->
<img src="missing.jpg" alt="Company logo" />
<!-- Renders as a broken icon + "Company logo" -->
```

---



---

## 20. What is the difference between SVG and Canvas?

**Asaan Urdu mein:**  
SVG vector‑based hota hai—shapes retain their definition, resolution‑independent, DOM‑accessible, aur CSS/JS se style/animate kiye ja sakte hain. Canvas pixel‑based hota hai—drawings rasterized hote hain, DOM se directly interact nahi hota, lekin bahut saare objects ke liye performance behtar hoti hai. SVG static graphics, icons, charts ke liye; Canvas games, animations, image processing ke liye.  

```html
<!-- SVG: vector, retains shapes, DOM accessible -->
<svg width="200" height="200" viewBox="0 0 200 200">
  <circle cx="100" cy="80" r="40" fill="blue"
    onclick="alert('Clicked!')" />
  <rect x="60" y="130" width="80" height="40" fill="green" />
  <text x="100" y="190" text-anchor="middle">SVG</text>
</svg>

<canvas id="c" width="200" height="200"></canvas>
<script>
  // Canvas: pixel-based, no DOM, must redraw
  const ctx = document.getElementById('c').getContext('2d');
  ctx.fillStyle = 'blue';
  ctx.beginPath();
  ctx.arc(100, 80, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'green';
  ctx.fillRect(60, 130, 80, 40);
  ctx.fillStyle = 'black';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Canvas', 100, 190);
</script>
```

---



---

## 21. What is the viewport meta tag and why is it important?

**Asaan Urdu mein:**  
Viewport `<meta>` tag mobile devices ko batata hai ke page ko device ki width ke hisaab se render karo. Iske bina browsers page ko desktop width (≈980 px) par zoom out kar dete hain, jis se text chhota aur unreadable hota hai. `width=device-width` aur `initial-scale=1.0` responsive design ke liye essential hain.  

```html
<!-- Required for responsive design -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- With viewport meta: page matches device width, text readable -->
<!-- Without viewport meta: mobile browser shows zoomed-out desktop view -->

<!-- Additional options -->
<meta name="viewport" content="width=device-width, initial-scale=1.0,
  maximum-scale=5.0, user-scalable=yes" />
```

---



---

## 22. Explain the difference between <article> and <section>.

**Asaan Urdu mein:**  
`<article>` ek self‑contained, independent content block hota hai—blog post, news story, ya forum post—jo alag se distribute kiya ja sakta hai. `<section>` related content ko heading ke saath group karta hai, lekin zaroori nahi ke woh khud se independent ho. `<article>` ke andar multiple `<section>` ho sakte hain.  

```html
<article>
  <h2>Blog Post Title</h2>
  <p>Published July 25, 2026</p>

  <section>
    <h3>Introduction</h3>
    <p>Opening paragraph...</p>
  </section>

  <section>
    <h3>Main Content</h3>
    <p>Body of the article...</p>

    <article>
      <h4>Related Tip</h4>
      <p>A self-contained tip within the article.</p>
    </article>
  </section>

  <section>
    <h3>Conclusion</h3>
    <p>Final thoughts...</p>
  </section>
</article>

<!-- <article> could be taken alone; <section> needs context -->
```

---



---

## 23. What is progressive rendering?

**Asaan Urdu mein:**  
Progressive rendering ka maksad content ko jaldi se dikhana hota hai, poori page load hone ka intezar na karna. Techniques: lazy‑load images, prioritize above‑fold CSS/JS, server‑side streaming (flush early), preload critical resources, aur defer non‑critical scripts. Is se perceived performance improve hoti hai.  

```html
<!-- 1. Lazy load below-fold images -->
<img src="hero.jpg" alt="Hero" loading="eager" />
<img src="below-fold.jpg" alt="Below fold" loading="lazy" />

<!-- 2. Inline critical CSS, defer non-critical -->
<style>
  /* Critical above-fold styles inlined in <head> */
  body { margin: 0; font-family: sans-serif; }
</style>
<link rel="stylesheet" href="full.css" media="print"
  onload="this.media='all'" />

<!-- 3. Defer non-critical scripts -->
<script defer src="analytics.js"></script>

<!-- 4. Preload key resources -->
<link rel="preload" href="hero.jpg" as="image" />
<link rel="preload" href="critical.css" as="style" />
```

---



---

## 24. What are Web Components?

**Asaan Urdu mein:**  
Web Components browser‑native APIs ka set hain jo reusable custom HTML elements banate hain. Inmein **Custom Elements** (naye tags define karna), **Shadow DOM** (style aur markup encapsulation), **HTML Templates** (`<template>` markup ke liye) aur **HTML Imports** (ya ES modules) shamil hain. Framework‑agnostic aur reusability ke liye powerful hain.  

```html
<!-- Define a custom element -->
<user-card user-id="123"></user-card>

<template id="user-card-template">
  <style>
    .card { border: 1px solid #ccc; padding: 10px; border-radius: 8px; }
    .name { font-size: 18px; font-weight: bold; }
  </style>
  <div class="card">
    <div class="name"></div>
    <div class="email"></div>
  </div>
</template>

<script>
  class UserCard extends HTMLElement {
    constructor() {
      super();
      const template = document.getElementById('user-card-template');
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
      const userId = this.getAttribute('user-id');
      fetch('/api/users/' + userId)
        .then(r => r.json())
        .then(user => {
          this.shadowRoot.querySelector('.name').textContent = user.name;
          this.shadowRoot.querySelector('.email').textContent = user.email;
        });
    }
  }

  customElements.define('user-card', UserCard);
</script>
```

---



---

## 25. What is the difference between HTML5 <audio>/<video> tags and older plugin‑based media?

**Asaan Urdu mein:**  
HTML5 `<audio>` aur `<video>` native browser elements hain—bina Flash ya Silverlight jaise plugins ke kaam karte hain. Built‑in controls, accessibility, aur mobile‑friendliness provide karte hain. Plugins ko alag installation, security issues, aur poor mobile support hoti thi; aaj ke browsers unko support nahi karte.  

```html
<!-- HTML5 Video (native) -->
<video controls width="640" poster="thumbnail.jpg">
  <source src="video.mp4" type="video/mp4" />
  <source src="video.webm" type="video/webm" />
  <p>Your browser doesn't support HTML5 video.</p>
</video>

<!-- HTML5 Audio -->
<audio controls>
  <source src="audio.mp3" type="audio/mpeg" />
  <source src



---

## 26. How does the browser render an HTML page (critical rendering path)?

**Asaan Urdu mein:**  
Browser sab se pehle HTML ko parse karke DOM (Document Object Model) banata hai. Phir CSS ko parse karke CSSOM (CSS Object Model) taiyar hota hai. DOM aur CSSOM mil kar Render Tree create karte hain, jahan har element ka size aur position decide hoti hai. Layout stage mein elements ki exact jagah aur dimensions nikalti hain, aur Paint stage mein pixels screen par draw hote hain. `<script>` tags (jab tak async ya defer na ho) DOM parsing ko rok sakte hain, is liye script loading ko dhyan se handle karna zaroori hai.

```
<!-- Critical Rendering Path -->
<!DOCTYPE html>
<html>
<head>
  <!-- CSS blocks rendering, but not DOM parsing -->
  <link rel="stylesheet" href="styles.css" />

  <!-- Inline CSS avoids network request -->
  <style>
    body { font-family: sans-serif; }
  </style>
</head>
<body>
  <!-- HTML parser builds DOM tree -->
  <h1>Hello</h1>

  <!-- Script without async/defer blocks DOM parsing -->
  <script src="app.js"></script>

  <!-- After script executes, DOM parsing continues -->
  <p>World</p>
</body>
</html>

<!-- Rendering steps:
     1. Parse HTML → DOM Tree
     2. Parse CSS → CSSOM
     3. DOM + CSSOM → Render Tree
     4. Layout (positions & sizes)
     5. Paint (pixels to screen)
-->
```

---



---

## 27. What is the difference between rel='noopener' and rel='noreferrer'?

**Asaan Urdu mein:**  
`rel='noopener'` target page ko `window.opener` ka access dene se rokti hai, is se tab‑napping attacks kam hotay hain aur performance behtar hoti hai. `rel='noreferrer'` yehi kaam karta hai aur saath hi HTTP Referer header ko bhi hide karta hai, is liye ye zyada secure hai. `rel='noreferrer'` ek superset hai, is liye external links ke liye hamesha `rel="noopener noreferrer"` istemal karna behtar practice hai. Same‑origin links ke liye ye attributes zaroori nahi.

```
<!-- Security best practice for external links -->
<a href="https://example.com" target="_blank"
  rel="noopener noreferrer">
  External Link (Safe)
</a>

<!-- Without these, the target page can:
     - Access window.opener.location (tab-napping)
     - Redirect your page to a phishing site
     - See the referrer URL
-->

<!-- For same-origin links, you can skip it -->
<a href="/about">Internal Link</a>
```

---



---

## 28. What accessibility (a11y) attributes do you commonly use in HTML?

**Asaan Urdu mein:**  
Common ARIA attributes mein `aria-label` hota hai jo screen reader ko visible label ke baghair naam deta hai, aur `aria-labelledby` kisi existing element ko label ke roop mein refer karta hai. `aria-describedby` additional description provide karta hai, jabke `aria-hidden` decorative elements ko hide karta hai. `role` element ka purpose define karta hai, `aria-expanded` toggle state batata hai, aur `aria-live` dynamic content ke updates ko announce karne ke liye use hota hai. Keyboard navigation ke liye `tabindex` bhi bohat zaroori hai.

```
<!-- Button with icon only: aria-label provides accessible name -->
<button aria-label="Close dialog">
  <span aria-hidden="true">&times;</span>
</button>

<!-- Region landmarks -->
<nav aria-label="Main navigation">...</nav>
<main role="main">...</main>

<!-- Dynamic content updates -->
<div aria-live="polite" aria-atomic="true">
  New notifications: 3
</div>

<!-- Expandable sections -->
<button aria-expanded="false" aria-controls="details">
  Show Details
</button>
<div id="details" hidden>
  <p>Hidden content revealed on click.</p>
</div>

<!-- Form fields with errors -->
<label for="email">Email</label>
<input id="email" aria-required="true"
  aria-invalid="true"
  aria-describedby="email-error" />
<span id="email-error" role="alert">Invalid email format</span>

<!-- Skip navigation link -->
<a href="#main-content" class="skip-link">Skip to main content</a>
```

---



---

## 29. What is the difference between an HTML attribute and a DOM property?

**Asaan Urdu mein:**  
HTML attributes markup mein likhe jate hain aur hamesha string ki form mein rehte hain; ye initial values ko represent karte hain. DOM properties JavaScript objects ki tarah hoti hain aur element ke current state ko reflect karti hain. Jab aap `input.value` change karte hain to property updated hoti hai, lekin `getAttribute('value')` ab bhi original markup value return karta hai. Kuch attributes ke naam DOM mein alag hote hain, jaise `class` → `className`, `for` → `htmlFor`, `tabindex` → `tabIndex`.

```
<input type="text" value="Initial" id="myInput" />

<script>
  const input = document.getElementById('myInput');

  // Attribute: from HTML markup, always a string
  console.log(input.getAttribute('value')); // "Initial"
  console.log(input.getAttribute('type'));  // "text"

  // Property: current DOM state
  console.log(input.value); // "Initial" (but changes as user types)

  // Change the property
  input.value = 'New value';

  // Attribute still shows original
  console.log(input.getAttribute('value')); // "Initial"
  console.log(input.value); // "New value"

  // Some attributes have different names:
  // HTML: class        DOM: className
  // HTML: for          DOM: htmlFor
  // HTML: tabindex     DOM: tabIndex
  // HTML: colspan      DOM: colSpan
</script>
```

---



---

## 30. What is the shadow DOM?

**Asaan Urdu mein:**  
Shadow DOM ek browser API hai jo component ke andar DOM structure aur CSS ko encapsulate karta hai, taake styles bahar na leak ho aur bahar ke styles andar affect na karen. Ye ek `shadow root` create karta hai jo host element se alag hota hai, isliye main document ke CSS uske andar ka content nahi dekh sakte. Shadow DOM ke andar likhi styling sirf usi component tak limited rehti hai, jo Web Components aur native elements jaise `<input>` ya `<video>` mein istemal hoti hai. Slot mechanism se light DOM ka content shadow DOM ke andar project kiya ja sakta hai.

```
<div id="host"></div>

<script>
  const host = document.getElementById('host');
  const shadow = host.attachShadow({ mode: 'open' });

  // Styles inside shadow don't affect outside
  shadow.innerHTML = `
    <style>
      /* This style only applies within the shadow DOM */
      .card {
        background: #333;
        color: white;
        padding: 20px;
        border-radius: 8px;
        font-family: sans-serif;
      }
      /* Doesn't affect <p> outside */
      p { margin: 0; }
    </style>
    <div class="card">
      <p>Shadow DOM content</p>
      <slot></slot> <!-- Projects light DOM content here -->
    </div>
  `;

  // Host element's children are projected into <slot>
  host.innerHTML = '<p>This is projected via slot</p>';
</script>
```

---



---

## 31. What is the difference between <link> and <a> tags?

**Asaan Urdu mein:**  
`<link>` ek void element hai jo sirf `<head>` mein rakha jata hai aur external resources (CSS, preload, favicon, canonical) ke saath relationship define karta hai; ye koi visible UI create nahi karta. `<a>` ek inline element hai jo `<body>` mein hota hai aur user ko clickable hyperlink provide karta hai, jisse navigation hoti hai. Is liye `<link>` resource loading ke liye hota hai, jabke `<a>` user interaction aur page navigation ke liye istemal hota hai. Dono ka purpose bilkul alag hai.

```
<!-- <link> in <head>: declares resource relationships -->
<head>
  <link rel="stylesheet" href="styles.css" />
  <link rel="preload" href="hero.jpg" as="image" />
  <link rel="icon" href="/favicon.ico" type="image/x-icon" />
  <link rel="canonical" href="https://example.com/page" />
</head>

<!-- <a> in <body>: creates clickable navigation -->
<body>
  <a href="/about">About Us</a>
  <a href="mailto:hello@example.com">Email</a>
  <a href="#section2">Jump to Section 2</a>
  <a href="/download.pdf" download>Download PDF</a>
</body>
```

---



---

## 32. How do you optimize images for the web in HTML?

**Asaan Urdu mein:**  
Images ko optimize karne ke liye modern formats jaise WebP ya AVIF use karen aur `<picture>` ke through fallback provide karen. Har image ke `width` aur `height` attributes set karen taake layout shift na ho. `loading="lazy"` lagayen taake off‑screen images tab tak load na hon jab tak user scroll na kare. Responsive images ke liye `srcset` aur `sizes` ka istemal karen, aur server side compression se file size kam rakhen. Critical LCP images ke liye `fetchpriority="high"` add karna faydemand hota hai.

```
<!-- Modern responsive image with WebP fallback -->
<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img
    src="hero.jpg"
    alt="Hero banner"
    width="1200"
    height="600"
    fetchpriority="high"
    decoding="async"
  />
</picture>

<!-- Responsive image with srcset -->
<img
  src="small.jpg"
  srcset="small.jpg 480w, medium.jpg 768w, large.jpg 1200w"
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="Responsive product image"
  width="800"
  height="600"
  loading="lazy"
/>

<!-- Decorative with lazy loading -->
<img src="footer-bg.webp" alt="" loading="lazy" />
```

---



---

## 33. What is the difference between defer and async loading of scripts, with examples of when to use each?

**Asaan Urdu mein:**  
`async` scripts background mein download hoti hain aur jaise hi download complete hota hai turant execute hoti hain, is se parsing temporarily block hoti hai aur execution order guarantee nahi hoti. `defer` scripts bhi background download hoti hain, lekin woh HTML parsing ke poora hone ke baad, DOM ready hone ke baad, aur original order mein execute hoti hain. `defer` tab use karen jab script ko DOM structure ya dusri scripts par depend karna ho (jaise React, Vue, jQuery plugins). `async` un independent scripts ke liye behtar hai jo page ke layout ya doosri scripts ko affect nahi karti, jaise analytics, ads, ya chat widgets.

```
<!-- DEFER: DOM-dependent, needs order -->
<script defer src="lib.js"></script>
<script defer src="app.js"></script>
<!-- Both download during parsing, execute in order after DOM is ready -->
<!-- Use: main app bundles, React/Vue/Angular, jQuery plugins -->

<!-- ASYNC: independent, no DOM dependencies -->
<script async src="analytics.js"></script>
<script async src="ads.js"></script>
<!-- Both download during parsing, execute whenever ready (order varies) -->
<!-- Use: analytics, ads, tracking pixels, chat widgets -->

<!-- BLOCKING: only for critical inline scripts -->
<script>
  // Critical CSS or data needed before rendering
  document.documentElement.classList.add('js-enabled');
</script>
```

---



---

## 34. What is the difference between contenteditable and a form input?

**Asaan Urdu mein:**  
`contenteditable` kisi bhi HTML element ko rich‑text editing ki ability deta hai—users bold, italic, images wagaira insert kar sakte hain, lekin ye automatically form submission ya native validation nahi deta. `<input>` (aur `<textarea>`) plain text entry ke liye design kiye gaye hain, built‑in validation, keyboard types, aur form ke saath submit hone ki capability rakhte hain. Simple data collection ke liye `<input>` use karna behtar hai, jabki complex formatted content ke liye `contenteditable` suitable hai. Dono ko directly secure nahi mana jata; server side sanitization hamesha zaroori hai.

```
<!-- Form input: structured, submit-able -->
<input type="text" name="username" required minlength="3"
  placeholder="Enter username" />
<textarea name="bio" rows="4" cols="50"></textarea>

<!-- contenteditable: rich text, no form integration -->
<div
  contenteditable="true"
  role="textbox"
  aria-multiline="true"
  style="border: 1px solid #ccc; min-height: 100px; padding: 8px;"
>
  <p>You can type <b>bold</b> or <i>italic</i> text here.</p>
</div>

<!-- Getting contenteditable value -->
<script>
  const editor = document.querySelector('[contenteditable]');
  // .textContent for plain text, .innerHTML for formatted
  const plain = editor.textContent;
  const formatted = editor.innerHTML;
</script>
```

---



---

## 35. Explain lazy loading of images using the loading attribute.

**Asaan Urdu mein:**  
`loading="lazy"` attribute browser ko batata hai ke off‑screen images ko tab tak load na kiya jaye jab tak user unke kareeb scroll na kare; is se initial page load ka size kam hota hai aur performance improve hoti hai. `loading="eager"` default behavior hai jo images ko turant load karta hai, khas taur par above‑fold images ke liye. Native lazy loading se extra JavaScript (Intersection Observer) ki zaroorat nahi hoti aur sab modern browsers isko support karte hain. Hamesha images ke `width` aur `height` ya `aspect-ratio` set karen taake layout shift na ho.

```
<!-- Eager (default): loads immediately -->
<img src="hero.jpg" alt="Hero" loading="eager" fetchpriority="high" />

<!-- Lazy: loads when near viewport -->
<img src="gallery-1.jpg" alt="Photo 1" loading="lazy" width="400" height="300" />
<img src="gallery-2.jpg" alt="Photo 2" loading="lazy" width="400" height="300" />
<img src="gallery-3.jpg" alt="Photo 3" loading="lazy" width="400" height="300" />

<!-- Iframe lazy loading (browser 96+) -->
<iframe src="widget.html" loading="lazy"></iframe>

<!-- Always set dimensions to prevent layout shift with lazy images -->
<style>
  img { width: 100%; height: auto; aspect-ratio: 4 / 3; }
</style>
```

---



---

## 36. What is the purpose of the <base> tag?

**Asaan Urdu mein:**  
`<base>` tag document ke `<head>` mein rakha jata hai aur uske baad aane wali sab relative URLs (links, images, scripts, forms) ke base URL ko define karta hai. Is se aap ek common root set kar sakte hain, jo especially tab useful hota hai jab page multiple sub‑paths ya reverse proxy ke through serve ho raha ho. Absolute URLs par koi asar nahi padta; sirf relative URLs `<base>` ki value ke mutabiq resolve hote hain. `<base>` ko sirf ek hi bar, aur sab se pehle use karna chahiye.

```
<head>
  <!-- All relative URLs will resolve against this base -->
  <base href="https://example.com/app/" />

  <!-- This resolves to https://example.com/app/styles.css -->
  <link rel="stylesheet" href="styles.css" />

  <!-- This resolves to https://example.com/app/images/logo.png -->
  <img src="images/logo.png" alt="Logo" />
</head>
<body>
  <!-- This links to https://example.com/app/dashboard -->
  <a href="dashboard">Dashboard</a>

  <!-- Absolute URLs are unaffected -->
  <a href="https://other.com/page">External</a>
</body>
```

---



---

## 37. What are microdata and structured data in HTML (schema.org)?

**Asaan Urdu mein:**  
Microdata HTML ka ek specification hai jo `itemscope`, `itemtype`, aur `itemprop` attributes ke through machine‑readable data embed karta hai. Schema.org ek vocabulary provide karta hai (jaise `Person`, `Product`, `Article`) jo search engines ko content ko samajhne aur rich snippets dikhane mein madad karta hai. Microdata page ke HTML mein hi hota hai, lekin aaj kal Google JSON‑LD ko preferred format manta hai, phir bhi microdata abhi bhi kaafi sites mein use hota hai. Structured data se SEO improve hoti hai aur users ko enhanced search results milte hain.

```
<!-- Microdata with schema.org -->
<div itemscope itemtype="https://schema.org/Product">
  <img itemprop="image" src="phone.jpg" alt="Smartphone" />
  <h2 itemprop="name">Smartphone X</h2>
  <p itemprop="description">Latest model with 5G support.</p>
  <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
    <span itemprop="priceCurrency" content="USD">$</span>
    <span itemprop="price">799.99</span>
    <meta itemprop="availability" content="https://schema.org/InStock" />
  </div>
  <div itemprop="aggregateRating" itemscope
    itemtype="https://schema.org/AggregateRating">
    <span itemprop="ratingValue">4.5</span> stars
    (<span itemprop="reviewCount">128</span> reviews)
  </div>
</div>

<!-- JSON-LD alternative (recommended by Google) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Smartphone X",
  "description": "Latest model with 5G support.",
  "offers": {
    "@type": "Offer",
    "price": "799.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
</script>
```

---



---

## 38. What is the difference between HTML5 form input types like email, tel, and url versus text?

**Asaan Urdu mein:**  
HTML5 ke specific input types built‑in validation aur mobile keyboards ko optimize karte hain. `type="email"` email format ki validation karta hai aur mobile par @ key ke saath keyboard show hota hai. `type="tel"` phone number entry ke liye numeric keypad provide karta hai, lekin koi validation default nahi hoti (aap pattern se add kar sakte hain). `type="url"` URL format validate karta hai aur .com, / keys ke saath keyboard deta hai. `type="text"` koi special validation ya keyboard nahi deta, is liye generic text entry ke liye use hota hai. Ye sab accessibility aur user experience ko behtar banate hain.

```
<!-- type="text": default, no special behavior -->
<input type="text" name="username" placeholder="Username" />

<!-- type="email": validates @ format, shows @-keyboard on mobile -->
<input type="email" name="email" required multiple
  placeholder="you@example.com" />

<!-- type="tel": shows phone keypad on mobile, no validation -->
<input type="tel" name="phone" pattern="[0-9]{10}"
  placeholder="1234567890" />

<!-- type="url": validates URL, shows .com keyboard on mobile -->
<input type="url" name="website" placeholder="https://example.com" />

<!-- type="number": shows numeric keypad, has min/max/step -->
<input type="number" name="age" min="1" max="120" step="1" />

<!-- Mobile keyboard examples:
     email: shows @ key
     tel: numeric keypad
     url: shows / and .com keys
     number: numeric keypad with sign
-->
```

---



---

## 39. How would you embed a responsive video in HTML/CSS?

**Asaan Urdu mein:**  
Responsive video embed karne ke liye ek wrapper div banaya jata hai jiska `position: relative` hota hai aur `padding-bottom` 56.25% (16:9) set kiya jata hai, jo aspect ratio maintain karta hai. Inside iframe ko `position: absolute`, `top:0`, `left:0`, `width:100%`, `height:100%` diya jata hai, taake wo wrapper ke size ke mutabiq stretch ho. Is technique se video screen size ke hisaab se resize hota hai bina distortion ke. Different aspect ratios ke liye padding value change ki ja sakti hai (4:3 → 75%, 1:1 → 100% etc.).

```
<!-- Responsive video embed (16:9 aspect ratio) -->
<div class="video-wrapper">
  <iframe
    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
    title="Video"
    allowfullscreen
  ></iframe>
</div>

<style>
  .video-wrapper {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%; /* 16:9 aspect ratio (9/16 = 0.5625) */
    height: 0;
    overflow: hidden;
  }

  .video-wrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }

  /* For max-width constraint */
  .video-container {
    max-width: 800px;
    margin: 0 auto;
  }
</style>

<!-- Alternative aspect ratios:
     4:3  → padding-bottom: 75%
     21:9 → padding-bottom: 42.86%
     1:1  → padding-bottom: 100%
-->
<div class="video-container">
  <div class="video-wrapper">
    <iframe ...></iframe>
  </div>
</div>
```

---



---

## 40. What is the difference between reflow and repaint, and how does HTML structure affect it?

**Asaan Urdu mein:**  
Reflow (layout) tab hota hai jab DOM ya CSSOM mein koi change element ke size, position, ya geometry ko affect karta hai; browser ko poora layout dobara calculate karna padta hai, jo costly hota hai. Repaint sirf visual style changes (color, background, visibility) ke liye hota hai; layout same rehta hai, is liye ye reflow se kam expensive hota hai. Deeply nested ya complex HTML structures, heavy selectors, aur frequent DOM manipulations reflows ko aur bhi slow kar dete hain. Isliye DOM depth ko flatten karen, changes ko batch karen, aur animations ke liye `transform`/`opacity` use karen taake sirf compositing ho, reflow ya repaint na ho.

```
<!-- Deep nesting causes more expensive reflows -->
<!-- AVOID: deeply nested tables -->
<table><tr><td><table><tr><td>Deep</td></tr></table></td></tr></table>

<!-- PREFER: flatter, semantic structure -->
<div class="card">
  <div class="card-header">Title</div>
  <div class="card-body">Content</div>
</div>

<script>
  // BAD: causes 3 reflows
  const el = document.getElementById('box');
  el.style.width = '100px';   // reflow
  el.style.height = '100px';  // reflow
  el.style.margin = '10px';   // reflow

  // GOOD: batch changes, causes 1 reflow
  el.style.cssText = 'width:100px; height:100px; margin:10px;';

  // BETTER: use class
  el.classList.add('box-styles');

  // Use transform instead of position changes (only compositing)
  el.style.transform = 'translateX(100px)'; // no reflow, no repaint
  el.style.left = '100px'; // causes reflow
</script>

<!-- Strategies:
     - Flatten DOM tree
     - Avoid inline styles
     - Use transform/opacity for animations
     - Contain deeply nested parts
-->
```

<!--LANG:english-->



# HTML Interview Questions

## 1. What is HTML and how is it different from HTML5?

HTML (HyperText Markup Language) is the standard language for creating web pages. HTML5 is the latest major version that introduced semantic elements, native multimedia support, canvas, form validation, and new APIs like localStorage and Web Workers.

```
<!-- HTML5 semantic structure -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>HTML5 Page</title>
</head>
<body>
  <header>
    <nav>Navigation</nav>
  </header>
  <main>
    <article>
      <section>Content</section>
    </article>
  </main>
  <footer>Footer</footer>
</body>
</html>
```

---

## 2. What is the DOCTYPE declaration and why is it needed?

The DOCTYPE declaration (`<!DOCTYPE html>`) tells the browser to render the page in standards mode, not quirks mode. It must be the very first line in an HTML document. Without it, browsers fall back to quirks mode which mimics old browser behavior and causes inconsistent layouts.

```
<!-- Correct HTML5 DOCTYPE -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Standards Mode</title>
</head>
<body>
  <p>Browser renders in standards mode.</p>
</body>
</html>

<!-- Without DOCTYPE, quirks mode is triggered -->
<!-- This causes CSS box model differences and layout bugs -->
```

---

## 3. Explain the difference between block-level and inline elements.

Block-level elements start on a new line and take the full width available (e.g., `<div>`, `<p>`, `<h1>`). Inline elements flow within text and only take the space needed (e.g., `<span>`, `<a>`, `<strong>`). Block elements can contain inline elements, but not vice versa.

```
<div style="border: 1px solid red; margin: 4px;">
  Block: takes full width, starts new line
</div>
<span style="border: 1px solid blue;">
  Inline: flows in text, only as wide as content
</span>
<span style="border: 1px solid green;">
  Another inline — sits beside previous inline
</span>
```

---

## 4. What are semantic HTML elements? Give examples.

Semantic elements clearly describe their meaning to both the browser and developer. Examples include `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`, `<figure>`, and `<figcaption>`. They improve accessibility, SEO, and code readability compared to generic `<div>` tags.

```
<body>
  <header>
    <h1>Site Title</h1>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <article>
      <h2>Blog Post Title</h2>
      <p>Content...</p>
      <section>
        <h3>Comments</h3>
      </section>
    </article>
    <aside>
      <h3>Related Posts</h3>
    </aside>
  </main>
  <footer>&copy; 2026</footer>
</body>
```

---

## 5. What is the difference between <div> and <span>?

`<div>` is a block-level container that starts on a new line and takes full width. `<span>` is an inline container that flows within text. Use `<div>` for layout sections and `<span>` for styling inline text fragments.

```
<div style="background: #f0f0f0; padding: 10px;">
  This div creates a block-level box.
  <span style="color: red; font-weight: bold;">
    This span is inline inside the div.
  </span>
  More text in the div block.
</div>
<div>Another block below the first one.</div>
```

---

## 6. What is the purpose of the <meta> tag?

The `<meta>` tag provides metadata about the HTML document. It's used for specifying character encoding, viewport settings for responsive design, page descriptions for SEO, Open Graph data for social sharing, and refresh/redirect instructions.

```
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Page description for SEO" />
  <meta name="keywords" content="html, meta, tutorial" />
  <meta name="author" content="Author Name" />
  <meta property="og:title" content="Title for Social Sharing" />
  <meta property="og:image" content="https://example.com/image.jpg" />
  <meta http-equiv="refresh" content="30" />
</head>
```

---

## 7. How do you make a website responsive using only HTML?

You cannot make a site fully responsive with HTML alone — you need CSS media queries. However, HTML provides the viewport meta tag which is essential for responsive design, and you can use the `<picture>` element with `<source>` tags for responsive images.

```
<!-- Essential meta tag for responsive -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- Responsive images with picture element -->
<picture>
  <source media="(min-width: 1024px)" srcset="large.jpg" />
  <source media="(min-width: 640px)" srcset="medium.jpg" />
  <img src="small.jpg" alt="Responsive image" />
</picture>

<!-- Responsive image with srcset -->
<img
  src="small.jpg"
  srcset="small.jpg 480w, medium.jpg 768w, large.jpg 1200w"
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="Responsive"
/>
```

---

## 8. What is the difference between HTML and XHTML?

XHTML is a stricter version of HTML based on XML syntax. In XHTML, all tags must be properly closed, attribute values must be quoted, elements must be properly nested, and tag names must be lowercase. XHTML documents that have errors won't render at all, while HTML browsers try to recover from errors.

```
<!-- HTML (lenient) -->
<br>
<BR>
<input disabled>
<p><b>Nested</p></b>

<!-- XHTML (strict) -->
<br />
<br />
<input disabled="disabled" />
<p><b>Nested</b></p>
```

---

## 9. What are data-* attributes used for?

`data-*` attributes store custom data directly in HTML elements. They're accessible via `element.dataset` in JavaScript. Use them for storing state, identifiers, or configuration values that don't have a standard attribute, avoiding the need for hidden inputs or JSON in classes.

```
<button
  data-user-id="12345"
  data-role="admin"
  data-last-login="2026-07-25"
  onclick="handleClick(this)"
>
  User Profile
</button>

<script>
  function handleClick(el) {
    const userId = el.dataset.userId;    // "12345"
    const role = el.dataset.role;        // "admin"
    const lastLogin = el.dataset.lastLogin; // "2026-07-25"
    console.log(userId, role, lastLogin);
  }
</script>
```

---

## 10. What is the difference between id and class attributes?

An `id` must be unique within a page — only one element can have a given ID. `class` can be shared by multiple elements. IDs have higher CSS specificity (0,1,0,0 vs 0,0,1,0 per class). Use IDs for unique elements and classes for reusable styling patterns.

```
<!-- id: unique, class: reusable -->
<div id="header" class="box dark-bg">Header</div>
<div id="main-content" class="box light-bg">Main</div>
<div id="sidebar" class="box light-bg">Sidebar</div>

<style>
  #header { font-size: 24px; }             /* Specific to header */
  .box    { border: 1px solid #ccc; padding: 10px; }  /* Reusable */
  .dark-bg { background: #333; color: #fff; }
  .light-bg { background: #f5f5f5; }
</style>
```

---

## 11. Explain the HTML5 <canvas> element.

`<canvas>` provides a bitmap drawing surface via JavaScript. You draw shapes, text, images, and animations using the Canvas 2D API (or WebGL for 3D). Unlike SVG which retains vector shapes, canvas is pixel-based. It's ideal for games, data visualization, image processing, and real-time graphics.

```
<canvas id="myCanvas" width="400" height="300"></canvas>

<script>
  const ctx = document.getElementById('myCanvas').getContext('2d');

  // Draw a filled rectangle
  ctx.fillStyle = 'red';
  ctx.fillRect(20, 20, 100, 60);

  // Draw a circle
  ctx.beginPath();
  ctx.arc(200, 100, 40, 0, Math.PI * 2);
  ctx.fillStyle = 'blue';
  ctx.fill();

  // Draw text
  ctx.font = '24px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Hello Canvas', 50, 200);

  // Draw a line
  ctx.beginPath();
  ctx.moveTo(10, 250);
  ctx.lineTo(390, 250);
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 3;
  ctx.stroke();
</script>
```

---

## 12. What are void (self-closing) elements? Give examples.

Void elements cannot have children and close themselves — they have no closing tag. Common examples include `<br>`, `<hr>`, `<img>`, `<input>`, `<meta>`, `<link>`, `<area>`, `<base>`, `<col>`, `<embed>`, `<source>`, `<track>`, and `<wbr>`.

```
<img src="photo.jpg" alt="Photo" />
<br />
<hr />
<input type="text" placeholder="Name" />
<meta charset="UTF-8" />
<link rel="stylesheet" href="styles.css" />
<source src="video.mp4" type="video/mp4" />
```

---

## 13. What is the difference between localStorage, sessionStorage, and cookies?

localStorage persists until explicitly deleted, survives browser closes (no expiration), and has ~5-10MB capacity. sessionStorage persists only for the current tab/session and clears when the tab closes. Cookies are sent with every HTTP request (affects performance), limited to ~4KB, and can have expiration dates set server-side.

```
// localStorage — survives browser close
localStorage.setItem('theme', 'dark');
console.log(localStorage.getItem('theme')); // 'dark'
localStorage.removeItem('theme');
localStorage.clear();

// sessionStorage — cleared when tab closes
sessionStorage.setItem('cartItem', '123');
console.log(sessionStorage.getItem('cartItem')); // '123'

// Cookies — sent with every request
document.cookie = 'sessionId=abc123; path=/; max-age=86400'; // 1 day
document.cookie = 'theme=dark; path=/; Secure; HttpOnly';
console.log(document.cookie); // 'sessionId=abc123; theme=dark'
```

---

## 14. What is the purpose of the <iframe> tag and what are its security concerns?

`<iframe>` embeds another HTML page within the current page — commonly used for YouTube embeds, payment forms, or third-party widgets. Security concerns: clickjacking (attacker overlays invisible iframe), XSS (if embedded content is compromised), and data leakage. Mitigate using `sandbox`, `allow` attributes, and the `X-Frame-Options` header.

```
<!-- Secure iframe with sandbox -->
<iframe
  src="https://example.com/widget"
  width="400"
  height="300"
  sandbox="allow-scripts allow-same-origin"
  allow="microphone 'none'; camera 'none'"
  referrerpolicy="no-referrer"
  loading="lazy"
></iframe>

<!-- Security headers the embedded page should set:
     X-Frame-Options: DENY or SAMEORIGIN
     Content-Security-Policy: frame-ancestors 'none' or 'self'
-->
```

---

## 15. What is the difference between <script>, <script async>, and <script defer>?

A normal `<script>` blocks HTML parsing while it downloads and executes. `async` downloads in parallel and executes as soon as it's ready (blocking parsing at execution time, order not guaranteed). `defer` downloads in parallel and executes in order after HTML parsing completes. Use `defer` for scripts that depend on DOM or have dependencies; use `async` for independent scripts like analytics.

```
<!-- Blocking: pauses parsing to fetch and execute -->
<script src="critical.js"></script>

<!-- Async: fetches in parallel, executes immediately when ready -->
<script async src="analytics.js"></script>

<!-- Defer: fetches in parallel, executes in order after parsing -->
<script defer src="vendor.js"></script>
<script defer src="app.js"></script>

<!-- Execution order for defer:
     1. HTML parsing completes
     2. vendor.js executes (first in DOM order)
     3. app.js executes (second in DOM order)
-->
```

---

## 16. What are HTML entities and why are they used?

HTML entities encode reserved characters (like `<`, `>`, `&`) and display special symbols that aren't on the keyboard. They start with `&` and end with `;`. Without entities, the browser would interpret `<` as the start of an HTML tag.

```
<p>Use &amp;lt; for &lt; and &amp;gt; for &gt;</p>
<p>Copyright: &copy; 2026</p>
<p>Euro: &euro;100</p>
<p>Space: Hello&nbsp;World (non-breaking space)</p>
<p>Quotes: &quot;Hello&quot; and &apos;World&apos;</p>
<p>Arrow: &rarr; Next</p>

<!-- Rendered output:
     Use &lt; for < and &gt; for >
     Copyright: © 2026
     Euro: €100
     Space: Hello World (non-breaking)
     Quotes: "Hello" and 'World'
     Arrow: → Next
-->
```

---

## 17. Explain form validation attributes in HTML5 (required, pattern, min, max).

HTML5 provides built-in form validation without JavaScript. `required` prevents submission if the field is empty. `pattern` validates against a regex. `min`/`max` set numeric/date ranges. `minlength`/`maxlength` control text length. Browsers show validation messages and style invalid inputs with `:invalid` pseudo-class.

```
<form onsubmit="event.preventDefault(); alert('Valid!')">
  <label>Name (required):</label>
  <input type="text" required minlength="2" maxlength="50" />

  <label>Age (10-99):</label>
  <input type="number" min="10" max="99" required />

  <label>ZIP Code (5 digits):</label>
  <input type="text" pattern="[0-9]{5}" title="Enter 5-digit ZIP" required />

  <label>Email:</label>
  <input type="email" required />

  <label>Password (8+ chars, 1 number):</label>
  <input type="password"
    pattern="(?=.*\d)(?=.*[a-zA-Z]).{8,}"
    title="8+ chars with at least 1 number"
    required />

  <button type="submit">Submit</button>
</form>
```

---

## 18. What is the difference between GET and POST in an HTML form?

GET appends form data to the URL as query parameters (`?key=value`), has size limits (~2048 chars), and data is visible in the URL. POST sends data in the request body, has no size limit, and data is not visible in the URL. Use GET for idempotent searches and POST for actions that modify data (create, update, delete).

```
<!-- GET: visible in URL, limited size, bookmarkable -->
<form action="/search" method="get">
  <input name="q" type="text" placeholder="Search..." />
  <button type="submit">Search</button>
</form>
<!-- URL becomes: /search?q=hello -->

<!-- POST: hidden in body, no size limit, not cached -->
<form action="/users" method="post">
  <input name="name" type="text" required />
  <input name="email" type="email" required />
  <button type="submit">Create User</button>
</form>
<!-- Data sent in request body, not URL -->
```

---

## 19. What is the purpose of the alt attribute on <img>?

The `alt` attribute provides fallback text when an image fails to load, and screen readers use it for accessibility (a11y). It also helps SEO — search engines index alt text. For decorative images, use `alt=""` (empty alt) to tell screen readers to skip them.

```
<!-- Informative image: describe content -->
<img src="chart.png" alt="Bar chart showing Q2 revenue up 25%" />

<!-- Decorative image: empty alt (screen readers skip) -->
<img src="divider-line.png" alt="" role="presentation" />

<!-- Image link: describe destination -->
<a href="/product">
  <img src="product.jpg" alt="View product details" />
</a>

<!-- Broken image fallback: shows alt text -->
<img src="missing.jpg" alt="Company logo" />
<!-- Renders as a broken icon + "Company logo" -->
```

---

## 20. What is the difference between SVG and Canvas?

SVG is vector-based (retains shape data, resolution-independent, editable via DOM) — good for static graphics, icons, and responsive charts. Canvas is pixel-based (no DOM, better performance for many objects) — good for games, animations, and image processing. SVG elements can have event handlers; canvas pixels cannot.

```
<!-- SVG: vector, retains shapes, DOM accessible -->
<svg width="200" height="200" viewBox="0 0 200 200">
  <circle cx="100" cy="80" r="40" fill="blue"
    onclick="alert('Clicked!')" />
  <rect x="60" y="130" width="80" height="40" fill="green" />
  <text x="100" y="190" text-anchor="middle">SVG</text>
</svg>

<canvas id="c" width="200" height="200"></canvas>
<script>
  // Canvas: pixel-based, no DOM, must redraw
  const ctx = document.getElementById('c').getContext('2d');
  ctx.fillStyle = 'blue';
  ctx.beginPath();
  ctx.arc(100, 80, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'green';
  ctx.fillRect(60, 130, 80, 40);
  ctx.fillStyle = 'black';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Canvas', 100, 190);
</script>
```

---

## 21. What is the viewport meta tag and why is it important?

The viewport `<meta>` tag controls how a page is displayed on mobile devices. Without it, mobile browsers render the page at a desktop width (usually 980px) and then shrink it, making text tiny. `width=device-width` sets the viewport to the device's width, and `initial-scale=1.0` prevents default zoom.

```
<!-- Required for responsive design -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- With viewport meta: page matches device width, text readable -->
<!-- Without viewport meta: mobile browser shows zoomed-out desktop view -->

<!-- Additional options -->
<meta name="viewport" content="width=device-width, initial-scale=1.0,
  maximum-scale=5.0, user-scalable=yes" />
```

---

## 22. Explain the difference between <article> and <section>.

`<article>` represents a self-contained, independent piece of content that could be distributed separately (blog post, news story, forum post). `<section>` groups related content with a heading. An `<article>` can contain multiple `<section>` elements, and vice versa. Use `<article>` when the content makes sense on its own.

```
<article>
  <h2>Blog Post Title</h2>
  <p>Published July 25, 2026</p>

  <section>
    <h3>Introduction</h3>
    <p>Opening paragraph...</p>
  </section>

  <section>
    <h3>Main Content</h3>
    <p>Body of the article...</p>

    <article>
      <h4>Related Tip</h4>
      <p>A self-contained tip within the article.</p>
    </article>
  </section>

  <section>
    <h3>Conclusion</h3>
    <p>Final thoughts...</p>
  </section>
</article>

<!-- <article> could be taken alone; <section> needs context -->
```

---

## 23. What is progressive rendering?

Progressive rendering prioritizes displaying content as quickly as possible rather than waiting for the full page to load. Techniques include: lazy loading images (load above-fold first), prioritizing visible content CSS/JS, using multiple HTML fragments sent progressively (Flush early), and server-side streaming.

```
<!-- 1. Lazy load below-fold images -->
<img src="hero.jpg" alt="Hero" loading="eager" />
<img src="below-fold.jpg" alt="Below fold" loading="lazy" />

<!-- 2. Inline critical CSS, defer non-critical -->
<style>
  /* Critical above-fold styles inlined in <head> */
  body { margin: 0; font-family: sans-serif; }
</style>
<link rel="stylesheet" href="full.css" media="print"
  onload="this.media='all'" />

<!-- 3. Defer non-critical scripts -->
<script defer src="analytics.js"></script>

<!-- 4. Preload key resources -->
<link rel="preload" href="hero.jpg" as="image" />
<link rel="preload" href="critical.css" as="style" />
```

---

## 24. What are Web Components?

Web Components are a set of browser-native APIs for creating reusable custom HTML elements. They consist of Custom Elements (define new HTML tags), Shadow DOM (encapsulated DOM & styles), HTML Templates (`<template>` for markup), and HTML Imports (or ES modules). They're framework-agnostic.

```
<!-- Define a custom element -->
<user-card user-id="123"></user-card>

<template id="user-card-template">
  <style>
    .card { border: 1px solid #ccc; padding: 10px; border-radius: 8px; }
    .name { font-size: 18px; font-weight: bold; }
  </style>
  <div class="card">
    <div class="name"></div>
    <div class="email"></div>
  </div>
</template>

<script>
  class UserCard extends HTMLElement {
    constructor() {
      super();
      const template = document.getElementById('user-card-template');
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
      const userId = this.getAttribute('user-id');
      fetch('/api/users/' + userId)
        .then(r => r.json())
        .then(user => {
          this.shadowRoot.querySelector('.name').textContent = user.name;
          this.shadowRoot.querySelector('.email').textContent = user.email;
        });
    }
  }

  customElements.define('user-card', UserCard);
</script>
```

---

## 25. What is the difference between HTML5 <audio>/<video> tags and older plugin-based media?

HTML5 `<audio>` and `<video>` are native browser elements that work without plugins like Flash or Silverlight. They provide built-in controls, accessibility support, and better performance. Plugins required separate installations, had security vulnerabilities, and are no longer supported by modern browsers. HTML5 media is mobile-friendly and uses `<source>` for format fallbacks.

```
<!-- HTML5 Video (native) -->
<video controls width="640" poster="thumbnail.jpg">
  <source src="video.mp4" type="video/mp4" />
  <source src="video.webm" type="video/webm" />
  <p>Your browser doesn't support HTML5 video.</p>
</video>

<!-- HTML5 Audio -->
<audio controls>
  <source src="audio.mp3" type="audio/mpeg" />
  <source src="audio.ogg" type="audio/ogg" />
  <p>Your browser doesn't support HTML5 audio.</p>
</audio>

<!-- Old Flash method (no longer supported) -->
<object type="application/x-shockwave-flash" data="player.swf">
  <param name="movie" value="video.flv" />
</object>
```

---

## 26. How does the browser render an HTML page (critical rendering path)?

The critical rendering path is: 1) HTML is parsed into the DOM (Document Object Model). 2) CSS is parsed into the CSSOM (CSS Object Model). 3) DOM + CSSOM combine to form the Render Tree. 4) Layout determines element positions/sizes. 5) Paint draws pixels to the screen. JavaScript can block DOM parsing via `<script>` tags (unless async/defer).

```
<!-- Critical Rendering Path -->
<!DOCTYPE html>
<html>
<head>
  <!-- CSS blocks rendering, but not DOM parsing -->
  <link rel="stylesheet" href="styles.css" />

  <!-- Inline CSS avoids network request -->
  <style>
    body { font-family: sans-serif; }
  </style>
</head>
<body>
  <!-- HTML parser builds DOM tree -->
  <h1>Hello</h1>

  <!-- Script without async/defer blocks DOM parsing -->
  <script src="app.js"></script>

  <!-- After script executes, DOM parsing continues -->
  <p>World</p>
</body>
</html>

<!-- Rendering steps:
     1. Parse HTML → DOM Tree
     2. Parse CSS → CSSOM
     3. DOM + CSSOM → Render Tree
     4. Layout (positions & sizes)
     5. Paint (pixels to screen)
-->
```

---

## 27. What is the difference between rel='noopener' and rel='noreferrer'?

`rel='noopener'` prevents the opened page from accessing `window.opener`, mitigating tab-napping attacks and improving performance (the opener's process is isolated). `rel='noreferrer'` does the same plus hides the Referer header from the target. `rel='noreferrer'` is the superset — always use both (`rel='noopener noreferrer'`) for external links with `target='_blank'`.

```
<!-- Security best practice for external links -->
<a href="https://example.com" target="_blank"
  rel="noopener noreferrer">
  External Link (Safe)
</a>

<!-- Without these, the target page can:
     - Access window.opener.location (tab-napping)
     - Redirect your page to a phishing site
     - See the referrer URL
-->

<!-- For same-origin links, you can skip it -->
<a href="/about">Internal Link</a>
```

---

## 28. What accessibility (a11y) attributes do you commonly use in HTML?

Key ARIA attributes include `aria-label` (label for screen readers when no visible label), `aria-labelledby` (link to labeling element), `aria-describedby` (description), `aria-hidden` (hide decorative elements), `role` (define element purpose), `aria-expanded` (toggle state), `aria-live` (dynamic content updates), and `tabindex` (keyboard navigation order).

```
<!-- Button with icon only: aria-label provides accessible name -->
<button aria-label="Close dialog">
  <span aria-hidden="true">&times;</span>
</button>

<!-- Region landmarks -->
<nav aria-label="Main navigation">...</nav>
<main role="main">...</main>

<!-- Dynamic content updates -->
<div aria-live="polite" aria-atomic="true">
  New notifications: 3
</div>

<!-- Expandable sections -->
<button aria-expanded="false" aria-controls="details">
  Show Details
</button>
<div id="details" hidden>
  <p>Hidden content revealed on click.</p>
</div>

<!-- Form fields with errors -->
<label for="email">Email</label>
<input id="email" aria-required="true"
  aria-invalid="true"
  aria-describedby="email-error" />
<span id="email-error" role="alert">Invalid email format</span>

<!-- Skip navigation link -->
<a href="#main-content" class="skip-link">Skip to main content</a>
```

---

## 29. What is the difference between an HTML attribute and a DOM property?

HTML attributes are defined in the markup and are always strings. DOM properties are JavaScript object properties on the element node. Attributes are initialized from HTML and stay unchanged unless explicitly updated. Properties reflect the current state. For example, `input.getAttribute('value')` returns the initial HTML value, while `input.value` returns the current typed value.

```
<input type="text" value="Initial" id="myInput" />

<script>
  const input = document.getElementById('myInput');

  // Attribute: from HTML markup, always a string
  console.log(input.getAttribute('value')); // "Initial"
  console.log(input.getAttribute('type'));  // "text"

  // Property: current DOM state
  console.log(input.value); // "Initial" (but changes as user types)

  // Change the property
  input.value = 'New value';

  // Attribute still shows original
  console.log(input.getAttribute('value')); // "Initial"
  console.log(input.value); // "New value"

  // Some attributes have different names:
  // HTML: class        DOM: className
  // HTML: for          DOM: htmlFor
  // HTML: tabindex     DOM: tabIndex
  // HTML: colspan      DOM: colSpan
</script>
```

---

## 30. What is the shadow DOM?

The Shadow DOM is a browser API that encapsulates DOM structure and CSS within a component, preventing style leakage in or out. It creates a 'shadow root' attached to an element, which is separate from the main document DOM. The main document CSS cannot affect shadow DOM content, and shadow DOM styles don't leak outside. Used in Web Components and native elements like `<input>` and `<video>`.

```
<div id="host"></div>

<script>
  const host = document.getElementById('host');
  const shadow = host.attachShadow({ mode: 'open' });

  // Styles inside shadow don't affect outside
  shadow.innerHTML = `
    <style>
      /* This style only applies within the shadow DOM */
      .card {
        background: #333;
        color: white;
        padding: 20px;
        border-radius: 8px;
        font-family: sans-serif;
      }
      /* Doesn't affect <p> outside */
      p { margin: 0; }
    </style>
    <div class="card">
      <p>Shadow DOM content</p>
      <slot></slot> <!-- Projects light DOM content here -->
    </div>
  `;

  // Host element's children are projected into <slot>
  host.innerHTML = '<p>This is projected via slot</p>';
</script>
```

---

## 31. What is the difference between <link> and <a> tags?

`<link>` is a void element placed in `<head>` that declares relationships with external resources (CSS, preload, favicon) — it doesn't create visible content. `<a>` (anchor) is an inline element placed in `<body>` that creates a clickable hyperlink for navigation. `<link>` is for resource loading; `<a>` is for user interaction.

```
<!-- <link> in <head>: declares resource relationships -->
<head>
  <link rel="stylesheet" href="styles.css" />
  <link rel="preload" href="hero.jpg" as="image" />
  <link rel="icon" href="/favicon.ico" type="image/x-icon" />
  <link rel="canonical" href="https://example.com/page" />
</head>

<!-- <a> in <body>: creates clickable navigation -->
<body>
  <a href="/about">About Us</a>
  <a href="mailto:hello@example.com">Email</a>
  <a href="#section2">Jump to Section 2</a>
  <a href="/download.pdf" download>Download PDF</a>
</body>
```

---

## 32. How do you optimize images for the web in HTML?

Optimize via: 1) Use modern formats (WebP, AVIF) with `<picture>` for fallback. 2) Set explicit `width` and `height` to prevent layout shift. 3) Use `loading='lazy'` for below-fold images. 4) Use `srcset`/`sizes` for responsive images. 5) Compress images server-side. 6) Use `fetchpriority='high'` for LCP images.

```
<!-- Modern responsive image with WebP fallback -->
<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img
    src="hero.jpg"
    alt="Hero banner"
    width="1200"
    height="600"
    fetchpriority="high"
    decoding="async"
  />
</picture>

<!-- Responsive image with srcset -->
<img
  src="small.jpg"
  srcset="small.jpg 480w, medium.jpg 768w, large.jpg 1200w"
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="Responsive product image"
  width="800"
  height="600"
  loading="lazy"
/>

<!-- Decorative with lazy loading -->
<img src="footer-bg.webp" alt="" loading="lazy" />
```

---

## 33. What is the difference between defer and async loading of scripts, with examples of when to use each?

Both `async` and `defer` download scripts without blocking HTML parsing. `async` executes the moment it downloads (blocks parsing briefly, order not guaranteed). `defer` waits until HTML is fully parsed and executes scripts in DOM order. Use `defer` for scripts that depend on DOM structure or other scripts (e.g., React, Vue, jQuery). Use `async` for independent scripts like analytics or ads.

```
<!-- DEFER: DOM-dependent, needs order -->
<script defer src="lib.js"></script>
<script defer src="app.js"></script>
<!-- Both download during parsing, execute in order after DOM is ready -->
<!-- Use: main app bundles, React/Vue/Angular, jQuery plugins -->

<!-- ASYNC: independent, no DOM dependencies -->
<script async src="analytics.js"></script>
<script async src="ads.js"></script>
<!-- Both download during parsing, execute whenever ready (order varies) -->
<!-- Use: analytics, ads, tracking pixels, chat widgets -->

<!-- BLOCKING: only for critical inline scripts -->
<script>
  // Critical CSS or data needed before rendering
  document.documentElement.classList.add('js-enabled');
</script>
```

---

## 34. What is the difference between contenteditable and a form input?

`contenteditable` makes any HTML element editable (rich text, bold, formatting). Form `<input>` is for plain text entry with browser-native validation, submission in forms, and consistent behavior. Use `<input>` for form data, `contenteditable` for rich text editors (like comments with formatting). Neither is inherently secure for user input.

```
<!-- Form input: structured, submit-able -->
<input type="text" name="username" required minlength="3"
  placeholder="Enter username" />
<textarea name="bio" rows="4" cols="50"></textarea>

<!-- contenteditable: rich text, no form integration -->
<div
  contenteditable="true"
  role="textbox"
  aria-multiline="true"
  style="border: 1px solid #ccc; min-height: 100px; padding: 8px;"
>
  <p>You can type <b>bold</b> or <i>italic</i> text here.</p>
</div>

<!-- Getting contenteditable value -->
<script>
  const editor = document.querySelector('[contenteditable]');
  // .textContent for plain text, .innerHTML for formatted
  const plain = editor.textContent;
  const formatted = editor.innerHTML;
</script>
```

---

## 35. Explain lazy loading of images using the loading attribute.

The `loading='lazy'` attribute defers loading offscreen images until the user scrolls near them (defer distance depends on connection speed and image size). `loading='eager'` loads immediately (default for above-fold images). Native lazy loading eliminates the need for Intersection Observer-based solutions and is supported in all modern browsers.

```
<!-- Eager (default): loads immediately -->
<img src="hero.jpg" alt="Hero" loading="eager" fetchpriority="high" />

<!-- Lazy: loads when near viewport -->
<img src="gallery-1.jpg" alt="Photo 1" loading="lazy" width="400" height="300" />
<img src="gallery-2.jpg" alt="Photo 2" loading="lazy" width="400" height="300" />
<img src="gallery-3.jpg" alt="Photo 3" loading="lazy" width="400" height="300" />

<!-- Iframe lazy loading (browser 96+) -->
<iframe src="widget.html" loading="lazy"></iframe>

<!-- Always set dimensions to prevent layout shift with lazy images -->
<style>
  img { width: 100%; height: auto; aspect-ratio: 4 / 3; }
</style>
```

---

## 36. What is the purpose of the <base> tag?

`<base>` sets the base URL for all relative URLs in the document (in `<a>`, `<img>`, `<link>`, `<form>`). It must be placed in `<head>` before any elements that use relative URLs. Use it when the page is accessed from multiple URLs or behind a reverse proxy.

```
<head>
  <!-- All relative URLs will resolve against this base -->
  <base href="https://example.com/app/" />

  <!-- This resolves to https://example.com/app/styles.css -->
  <link rel="stylesheet" href="styles.css" />

  <!-- This resolves to https://example.com/app/images/logo.png -->
  <img src="images/logo.png" alt="Logo" />
</head>
<body>
  <!-- This links to https://example.com/app/dashboard -->
  <a href="dashboard">Dashboard</a>

  <!-- Absolute URLs are unaffected -->
  <a href="https://other.com/page">External</a>
</body>
```

---

## 37. What are microdata and structured data in HTML (schema.org)?

Microdata is an HTML specification for embedding machine-readable data using `itemscope`, `itemtype`, and `itemprop` attributes. Schema.org provides vocabulary (types like `Person`, `Article`, `Product`). Search engines use structured data for rich snippets (star ratings, prices, recipes). JSON-LD is the modern alternative, but microdata is still widely used.

```
<!-- Microdata with schema.org -->
<div itemscope itemtype="https://schema.org/Product">
  <img itemprop="image" src="phone.jpg" alt="Smartphone" />
  <h2 itemprop="name">Smartphone X</h2>
  <p itemprop="description">Latest model with 5G support.</p>
  <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
    <span itemprop="priceCurrency" content="USD">$</span>
    <span itemprop="price">799.99</span>
    <meta itemprop="availability" content="https://schema.org/InStock" />
  </div>
  <div itemprop="aggregateRating" itemscope
    itemtype="https://schema.org/AggregateRating">
    <span itemprop="ratingValue">4.5</span> stars
    (<span itemprop="reviewCount">128</span> reviews)
  </div>
</div>

<!-- JSON-LD alternative (recommended by Google) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Smartphone X",
  "description": "Latest model with 5G support.",
  "offers": {
    "@type": "Offer",
    "price": "799.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
</script>
```

---

## 38. What is the difference between HTML5 form input types like email, tel, and url versus text?

HTML5-specific input types provide built-in validation, mobile-friendly keyboards, and accessibility cues. `email` validates email format and shows @-keyboard on mobile. `tel` shows numeric keypad on mobile (no validation). `url` validates URL format and shows .com-keyboard. `text` offers no validation and shows standard keyboard.

```
<!-- type="text": default, no special behavior -->
<input type="text" name="username" placeholder="Username" />

<!-- type="email": validates @ format, shows @-keyboard on mobile -->
<input type="email" name="email" required multiple
  placeholder="you@example.com" />

<!-- type="tel": shows phone keypad on mobile, no validation -->
<input type="tel" name="phone" pattern="[0-9]{10}"
  placeholder="1234567890" />

<!-- type="url": validates URL, shows .com keyboard on mobile -->
<input type="url" name="website" placeholder="https://example.com" />

<!-- type="number": shows numeric keypad, has min/max/step -->
<input type="number" name="age" min="1" max="120" step="1" />

<!-- Mobile keyboard examples:
     email: shows @ key
     tel: shows numeric keypad
     url: shows / and .com keys
     number: shows numeric keypad with negative sign
-->
```

---

## 39. How would you embed a responsive video in HTML/CSS?

The most common approach is the 'padding-bottom' technique: wrap the video in a container with `position: relative` and `padding-bottom: 56.25%` (16:9 aspect ratio). The iframe gets `position: absolute`, `width: 100%`, `height: 100%`. This maintains aspect ratio while scaling with the container.

```
<!-- Responsive video embed (16:9 aspect ratio) -->
<div class="video-wrapper">
  <iframe
    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
    title="Video"
    allowfullscreen
  ></iframe>
</div>

<style>
  .video-wrapper {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%; /* 16:9 aspect ratio (9/16 = 0.5625) */
    height: 0;
    overflow: hidden;
  }

  .video-wrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }

  /* For max-width constraint */
  .video-container {
    max-width: 800px;
    margin: 0 auto;
  }
</style>

<!-- Alternative aspect ratios:
     4:3  → padding-bottom: 75%
     21:9 → padding-bottom: 42.86%
     1:1  → padding-bottom: 100%
-->
<div class="video-container">
  <div class="video-wrapper">
    <iframe ...></iframe>
  </div>
</div>
```

---

## 40. What is the difference between reflow and repaint, and how does HTML structure affect it?

Reflow (layout) recalculates element positions and sizes when the DOM or CSSOM changes — it's expensive. Repaint redraws pixels when visual styles change (color, background) without affecting layout — it's cheaper than reflow. Deep/complex HTML structures (deeply nested tables, complex selectors) make reflows slower. Minimize DOM depth and batch DOM changes to reduce reflows.

```
<!-- Deep nesting causes more expensive reflows -->
<!-- AVOID: deeply nested tables -->
<table><tr><td><table><tr><td>Deep</td></tr></table></td></tr></table>

<!-- PREFER: flatter, semantic structure -->
<div class="card">
  <div class="card-header">Title</div>
  <div class="card-body">Content</div>
</div>

<script>
  // BAD: causes 3 reflows
  const el = document.getElementById('box');
  el.style.width = '100px';   // reflow
  el.style.height = '100px';  // reflow
  el.style.margin = '10px';   // reflow

  // GOOD: batch changes, causes 1 reflow
  el.style.cssText = 'width:100px; height:100px; margin:10px;';

  // BETTER: use class
  el.classList.add('box-styles');

  // Use transform instead of position changes (only compositing)
  el.style.transform = 'translateX(100px)'; // no reflow, no repaint
  el.style.left = '100px'; // causes reflow
</script>

<!-- Strategies:
     - Flatten DOM tree
     - Avoid inline styles
     - Use transform/opacity for animations
     - Contain deeply nested parts
-->
```

---
