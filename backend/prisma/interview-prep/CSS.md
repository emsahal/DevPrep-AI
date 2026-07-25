<!--LANG:roman-->

# CSS Interview Questions

## 1. What is the CSS box model?

**Asaan Urdu mein:**  
CSS box model har HTML element ko ek rectangular box ki tarah treat karta hai. Is box ke andar **content**, **padding**, **border**, aur **margin** hotay hain. Content area mein actual text ya image hoti hai, padding uske girdh space deta hai, border usko surround karta hai, aur margin doosray elements ke darmiyan outer space create karta hai. Ye hierarchy layout calculations ko asaan banati hai.

---

## 2. What is the difference between box-sizing: content-box and border-box?

**Asaan Urdu mein:**  
`content-box` default mode hai jismein width/height sirf content area ko count karta hai, padding aur border extra add hotay hain. `border-box` mein width/height mein content, padding, aur border sab shamil hotay hain, is se layout calculations simple ho jati hain, khaas tor par responsive design mein. Dono modes ko CSS mein `box-sizing` property se set kiya jata hai.

---

## 3. Explain specificity in CSS and how it's calculated.

**Asaan Urdu mein:**  
Specificity decide karta hai ke multiple CSS rules me se kaun sa rule element par apply hoga. Ye chaar parts se banta hai: inline styles, IDs, classes/attributes/pseudo‑classes, aur elements/pseudo‑elements. Har part ko numeric value milti hai, aur highest score wala rule jeet jata hai. Agar scores barabar ho to baad ka rule (source order) apply hota hai.

---

## 4. What is the difference between relative, absolute, fixed, and sticky positioning?

**Asaan Urdu mein:**  
`relative` element ko uski normal position se offset karta hai, lekin original jagah ka space bana rehta hai. `absolute` nearest positioned ancestor ke mutabiq place hota hai aur normal flow se bahar nikal jata hai. `fixed` viewport ke mutabiq fix rehta hai, scroll karne par bhi position same rehti hai. `sticky` scroll ke hisaab se `relative` se `fixed` me switch karta hai jab specified offset cross hota hai.

---

## 5. What is the difference between display: none and visibility: hidden?

**Asaan Urdu mein:**  
`display: none` element ko document flow se poori tarah hata deta hai, is ka koi space occupy nahi hota aur wo render bhi nahi hota. `visibility: hidden` element ko sirf nazar se chhupa deta hai, lekin uska space layout mein bana rehta hai. Hidden element events ya focus receive kar sakta hai, jabke `display:none` element bilkul inaccessible hota hai.

---

## 6. What are pseudo-classes and pseudo-elements? Give examples.

**Asaan Urdu mein:**  
Pseudo‑classes wo states ya positions target karte hain jo element naturally nahi hoti, jaise `:hover`, `:focus`, `:nth-child`. Unka syntax single colon hota hai. Pseudo‑elements element ke specific parts ko style karte hain, jaise `::before`, `::after`, `::first-line`, aur double colon use hota hai. Ye virtual fragments create karte hain ya existing content ko modify karte hain.

---

## 7. Explain Flexbox and its main properties.

**Asaan Urdu mein:**  
Flexbox ek one‑dimensional layout system hai jo items ko row ya column mein distribute karta hai. Container par `display: flex` set karne se `flex-direction`, `justify-content`, `align-items`, `flex-wrap`, aur `gap` jaise properties milti hain. Child items `flex-grow`, `flex-shrink`, `flex-basis`, aur `align-self` se apni size aur alignment control karte hain.

---

## 8. Explain CSS Grid and how it differs from Flexbox.

**Asaan Urdu mein:**  
CSS Grid two‑dimensional layout system hai jo rows aur columns dono ko ek saath handle karta hai. Flexbox sirf ek axis (row ya column) par focus karta hai, jabke Grid rows + columns ke saath complex page‑level layouts banane mein behtar hota hai. Grid ke `grid-template-columns`, `grid-template-rows`, aur `grid-area` properties layout ko define karte hain.

---

## 9. What is the CSS cascade and how does it work?

**Asaan Urdu mein:**  
Cascade wo algorithm hai jo conflicting CSS declarations ko resolve karta hai. Ye importance (`!important` vs normal), specificity, source order, aur origin (user‑agent, user, author) ko consider karta hai. Higher importance, higher specificity, aur later source order ke rules pehle wale ko override karte hain.

---

## 10. What are CSS combinators (descendant, child, sibling)?

**Asaan Urdu mein:**  
Combinators selectors ke darmiyan relationship define karte hain. Space (` `) descendant combinator kisi bhi nested element ko target karta hai. Greater‑than (`>`) direct child ko target karta hai. Plus (`+`) adjacent sibling ko, aur tilde (`~`) general sibling ko target karta hai. Ye relationships complex selectors banane mein madad deti hain.

---

## 11. What is the difference between em, rem, %, px, and vw/vh units?

**Asaan Urdu mein:**  
`px` absolute unit hai, device pixel par fixed. `em` parent element ke font‑size ke mutabiq hota hai, nesting ke saath compound hota hai. `rem` root (`html`) ke font‑size ke mutabiq hota hai, hamesha consistent rehta hai. `%` parent property ke relative hota hai. `vw`/`vh` viewport ki width/height ka percentage hota hai, responsive layouts ke liye useful.

---

## 12. What are CSS variables (custom properties) and how do you use them?

**Asaan Urdu mein:**  
CSS variables `--name` syntax se declare kiye jate hain aur `var(--name)` se access hotay hain. Ye cascade ke through inherit hotay hain, runtime mein update ho sakte hain, aur theme switching ya component customization ko asaan banate hain. Preprocessor variables ke opposite, ye browser mein directly work karte hain.

---

## 13. What is a media query and how do you write one for responsive design?

**Asaan Urdu mein:**  
Media query `@media` ke baad media type (screen, print) aur feature conditions (min‑width, orientation) likh kar CSS ko conditional apply karta hai. Ye responsive design ka backbone hai, jisse alag screen sizes ya devices ke liye alag layouts define kiye jate hain. Usually mobile‑first approach mein `min-width` queries use hoti hain.

---

## 14. What is the difference between mobile-first and desktop-first CSS approaches?

**Asaan Urdu mein:**  
Mobile‑first base styles choti screens ke liye likhi jati hain aur `min-width` media queries se larger screens ke liye enhancements add hoti hain. Desktop‑first base styles large screens ke liye hoti hain aur `max-width` queries se choti screens ke liye overrides ki jati hain. Mobile‑first progressive enhancement ko promote karta hai, jabke desktop‑first zyada overrides aur specificity issues la sakta hai.

---

## 15. Explain z-index and stacking contexts.

**Asaan Urdu mein:**  
`z-index` positioned elements (relative, absolute, fixed, sticky) ke vertical stacking order ko control karta hai. Lekin har stacking context apna independent `z-index` scale rakhta hai; ek higher `z-index` doosre context ke element ko override nahi karta. New stacking context tab banta hai jab element ke paas `z-index` (auto nahi), opacity < 1, transform, filter, etc. hota hai.

---

## 16. What causes a stacking context to be created?

**Asaan Urdu mein:**  
Stacking context tab banta hai jab element positioned ho aur `z-index` non‑auto ho, ya uska `opacity` < 1 ho, ya `transform`, `filter`, `perspective`, `clip-path` apply ho, ya `isolation: isolate` ho, ya `will-change` us property ko specify kare. Root `<html>` bhi ek default stacking context hota hai.

---

## 17. What is the difference between inline, inline-block, and block display?

**Asaan Urdu mein:**  
`block` elements poori width lete hain, new line se start hotay hain, aur width/height set ki ja sakti hai. `inline` elements text ke andar flow karte hain, width/height ignore hoti hai, sirf horizontal margin/padding work karta hai. `inline-block` inline flow jaisa hota hai lekin width, height, padding, margin sab apply hoti hain, is se side‑by‑side layout possible hota hai.

---

## 18. What are CSS transitions vs CSS animations?

**Asaan Urdu mein:**  
Transitions do-state changes (jaise `:hover`) ko smoothly animate karte hain, sirf start aur end values ki zaroorat hoti hai. Animations `@keyframes` ke through multi‑step sequences define karte hain, auto‑start, loop, pause, reverse wagaira possible hota hai. Simple state change ke liye transition, complex ya continuous motion ke liye animation use hoti hai.

---

## 19. What is the purpose of @keyframes?

**Asaan Urdu mein:**  
`@keyframes` animation ke different stages ko percentages ya `from`/`to` ke through define karta hai. Har stage mein CSS properties specify ki jati hain, browser unke beech interpolation karta hai. Phir `animation` property se is keyframe ko element par apply kiya jata hai, jisse animation run hoti hai.

---

## 20. What is the difference between :hover, :focus, and :active?

**Asaan Urdu mein:**  
`:hover` tab apply hota hai jab mouse pointer element ke upar ho. `:focus` tab hota hai jab element keyboard ya mouse se focus ho (e.g., tab navigation). `:active` temporarily tab hota hai jab element mouse button press ke dauran hota hai (mousedown se mouseup tak). Accessibility ke liye `:focus` styles hamesha visible hone chahiye.

---

## 21. What is BEM methodology and why is it used?

**Asaan Urdu mein:**  
BEM (Block Element Modifier) naming convention hai jo specificity aur naming collisions ko kam karta hai. Block component ka naam hota hai, Element uske child ko `__` se separate karta hai, Modifier state ya variant ko `--` se denote karta hai. Is se flat, predictable selectors milte hain jo maintainable aur scalable projects ke liye behtar hain.

---

## 22. What are CSS preprocessors (Sass/LESS) and their advantages?

**Asaan Urdu mein:**  
Preprocessors jaise Sass ya LESS CSS ko extend karte hain variables, nesting, mixins, functions, aur partials ke saath. Ye repetition kam karte hain, code ko modular banate hain, aur logic (loops, conditionals) add karte hain. Compile hone ke baad plain CSS generate hota hai, is se development fast hoti hai aur maintainability behtar hoti hai.

---

## 23. What is critical CSS and why does it matter for performance?

**Asaan Urdu mein:**  
Critical CSS page ke above‑the‑fold content ko style karne ke liye zaroori minimal CSS hota hai. Isko `<head>` mein inline rakhne se render‑blocking CSS request eliminate hoti hai, browser turant visible content paint kar sakta hai. Is se First Contentful Paint (FCP) aur Largest Contentful Paint (LCP) improve hote hain, jo performance metrics hain.

---

## 24. How does CSS specificity conflict get resolved with !important?

**Asaan Urdu mein:**  
`!important` normal declarations ko override karta hai, chahe specificity kam hi kyu na ho. Agar multiple `!important` rules conflict karte hain, to higher specificity jeet ti hai; agar specificity barabar ho to source order decide karta hai. Overuse se cascade toot jati hai, is liye `!important` ko sirf zaroori cases mein hi use karna chahiye.

---

## 25. What is the difference between min-width/max-width and width in responsive design?

**Asaan Urdu mein:**  
`width` fixed size set karta hai, jo container ya viewport ke hisaab se change nahi hoti. `min-width` element ko kam se kam itni width dene ka guarantee deta hai, lekin space milne par expand ho sakta hai. `max-width` element ko maximum width tak limit karta hai, lekin choti screens par shrink ho jata hai. Fluid layouts ke liye `max-width` ya `min-width` ke saath percentages ya `fr` units use ki jati hain.

---

## 26. Explain CSS float and clearfix technique.

**Asaan Urdu mein:**  
`float` originally images ke around text wrap karne ke liye tha, lekin pehle layout ke liye misuse hota tha. Floated element normal flow se bahar nikal jata hai, baaki content uske around flow karta hai. Parent ki height collapse hone se bachane ke liye clearfix technique `::after` pseudo‑element ke saath `content:""` aur `clear:both` use ki jati hai, ya `overflow:auto` se new block formatting context create hota hai.

---

## 27. What is CSS containment (contain property)?

**Asaan Urdu mein:**  
`contain` browser ko batata hai ke ek subtree doosre page parts se independent hai, jis se layout, paint, aur style calculations optimize hoti hain. Values `layout`, `paint`, `size`, ya shorthand `content` (layout + paint + style) specify ki jati hain. Ye large widgets ya off‑screen components ki performance improve karta hai.

---

## 28. What are CSS Grid template areas?

**Asaan Urdu mein:**  
`grid-template-areas` ek visual, ASCII‑art jaisa syntax hai jismein rows ko strings ke through define kiya jata hai aur har cell ko ek naam diya jata hai. Elements `grid-area: name` se us area mein place hotay hain. Ye complex layouts ko readable banata hai aur line numbers ki jagah meaningful names use karne ki suvidha deta hai.

---

## 29. What is the difference between rem and em when nested?

**Asaan Urdu mein:**  
`rem` hamesha root (`html`) ke font‑size se calculate hota hai, isliye nesting se koi effect nahi hota. `em` parent element ke computed font‑size par depend karta hai, isliye nested `em` values compound hoti hain (1.5em inside 1.5em = 2.25em of root). Predictable sizing ke liye `rem` preferred hai, jabke `em` contextual scaling ke liye useful ho sakta hai.

---

## 30. What is a CSS reset/normalize and why use one?

**Asaan Urdu mein:**  
Reset sab browsers ke default margins, paddings, aur other styles ko zero kar deta hai, taake ek clean slate mil sake. Normalize.css default styles ko preserve karta hai lekin inconsistencies ko fix karta hai, is se cross‑browser consistency milti hai without wiping useful defaults. Reset aggressive hota hai, normalize moderate aur safer.

---

## 31. How do you center a div both vertically and horizontally?

**Asaan Urdu mein:**  
Known size element ke liye absolute positioning ke saath `top:50%`, `left:50%`, aur `transform:translate(-50%,-50%)` use hota hai. Unknown size ke liye Flexbox (`display:flex; align-items:center; justify-content:center`) ya CSS Grid (`place-items:center`) sabse robust solutions hain. Ye methods modern browsers mein widely supported hain.

---

## 32. What is the CSS 'currentColor' keyword?

**Asaan Urdu mein:**  
`currentColor` current element ke computed `color` value ko refer karta hai. Ye kisi bhi property jo color accept karti hai (border, background, box‑shadow, SVG fill) mein use ho sakta hai. Is se components automatically parent text color ke mutabiq adapt kar lete hain, bina extra variables ke.

---

## 33. What are CSS container queries?

**Asaan Urdu mein:**  
Container queries parent container ke size ke hisaab se child ko style karne ki ability deti hain, viewport ke bajaye. `container-type: inline-size` se container ko queryable banaya jata hai, aur `@container (min-width: …)` ya `@container (max-width: …)` se conditions define hoti hain. Is se reusable components har jagah same tarah responsive ho jate hain.

---

## 34. What is the difference between transform and position for animations, performance-wise?

**Asaan Urdu mein:**  
`transform` (aur `opacity`) GPU‑only properties hain, jo layout ya paint phase ko trigger nahi karti, is liye 60fps smooth animations milti hain. `top`, `left`, `width`, `height` jaise positional properties layout recalculation aur repaint cause karte hain, jo performance ko degrade karte hain. Animations ke liye hamesha `transform` prefer karna chahiye.

---

## 35. What is the purpose of will-change in CSS?

**Asaan Urdu mein:**  
`will-change` browser ko hint deta hai ke koi element future mein specific property (jaise `transform` ya `opacity`) ko change karega, is se browser pehle se layer create ya optimizations kar leta hai. Ye sirf short‑term aur known animations ke liye use karna chahiye; overuse memory waste karta hai aur performance ko hurt kar sakta hai.

---

## 36. Explain CSS specificity with inline styles, IDs, classes, and elements ranking.

**Asaan Urdu mein:**  
Specificity hierarchy: **inline styles** (1,0,0,0) sabse high, phir **IDs** (0,1,0,0), phir **classes/attributes/pseudo‑classes** (0,0,1,0), aur **elements/pseudo‑elements** (0,0,0,1). Universal selector `*` aur combinators koi weight nahi dete. `!important` is hierarchy ko bypass karta hai, lekin multiple `!important` rules ke liye phir specificity aur source order apply hoti hai.

---

## 37. What is the difference between absolute and relative units for accessibility?

**Asaan Urdu mein:**  
Absolute units (`px`, `pt`) user ke browser settings ya zoom ko ignore karte hain, is se accessibility suffer hoti hai. Relative units (`rem`, `em`, `%`, `vw`) user ke default font‑size ya viewport size ke mutabiq scale hoti hain, is se visually impaired users ke liye content resize karna asaan hota hai. Text aur layout ke liye `rem` aur `%` prefer ki jati hain.

---

## 38. How does CSS handle overflow with overflow, overflow-x, and overflow-y?

**Asaan Urdu mein:**  
`overflow` control karta hai ke element ke content jo bounds se bahar jata hai usko kaise handle kiya jaye: `visible` (default) overflow ko show karta hai, `hidden` clip karta hai, `scroll` hamesha scrollbars dikhata hai, aur `auto` zaroorat par scrollbars dikhata hai. `overflow-x` aur `overflow-y` horizontal aur vertical axes ko alag‑alagh control karte hain. Non‑visible values new block formatting context create karte hain.

---

## 39. What are attribute selectors in CSS?

**Asaan Urdu mein:**  
Attribute selectors elements ko unke HTML attributes ke basis par target karte hain. `[attr]` sirf attribute existence check karta hai, `[attr="value"]` exact match, `[attr^="value"]` starts with, `[attr$="value"]` ends with, `[attr*="value"]` contains substring, aur `[attr~="value"]` space‑separated word match karta hai. Forms, links, data attributes, aur accessibility states ko style karne ke liye useful hain.

---

## 40. What is the difference between CSS Grid's fr unit and percentage-based columns?

**Asaan Urdu mein:**  
`fr` unit available free space ko proportionally distribute karta hai, fixed tracks aur gaps ko subtract karne ke baad. Percentages container ki width ke relative hoti hain aur gaps ko manually account karna padta hai, warna overflow ho sakta hai. `fr` flexible layouts ko simpler banata hai aur complex calculations ki zaroorat kam karta hai.

<!--LANG:english-->

# CSS Interview Questions

## 1. What is the CSS box model?

💡 The **CSS box model** describes how the size of an element is calculated.

- **Content** – the actual text, image, or other media.  
- **Padding** – space *inside* the element, surrounding the content.  
- **Border** – the line that wraps the padding and content.  
- **Margin** – space *outside* the element, separating it from other elements.

```
total width  = margin‑left + border‑left + padding‑left + content‑width + padding‑right + border‑right + margin‑right
total height = analogous calculation for height
```

---

## 2. What is the difference between `box-sizing: content-box` and `box-sizing: border-box`?

| Property | **content-box** (default) | **border-box** |
|----------|---------------------------|----------------|
| **Definition** | Width/height apply **only** to the **content** area. Padding & border are added outside the declared size. | Width/height include **content + padding + border**. The element’s outer size stays exactly as declared. |
| **Typical Use** | Legacy layouts, when you want explicit control over padding/border size. | Modern responsive design – easier to size elements without extra calculations. |
| **Impact on Layout** | May cause overflow if padding/border push the element beyond its container. | Prevents overflow; element fits neatly into its container. |
| **Performance** | No difference; just a calculation method. | Same. |

💡 **Tip:** Set `* { box-sizing: border-box; }` to make layout calculations predictable.

---

## 3. Explain specificity in CSS and how it's calculated.

💡 **Specificity** determines which rule wins when multiple selectors target the same element.

| Selector type | Specificity value (a,b,c,d) |
|----------------|-----------------------------|
| Inline styles (`style=`) | **1,0,0,0** |
| IDs (`#header`) | **0,1,0,0** |
| Classes, attributes, pseudo‑classes (`.nav`, `[type="text"]`, `:hover`) | **0,0,1,0** |
| Elements & pseudo‑elements (`div`, `::before`) | **0,0,0,1** |
| Universal selector (`*`), combinators (`> + ~`) | **0,0,0,0** |

The browser compares the four‑part value from left to right; the highest value wins. If values are equal, the later rule in the stylesheet wins.

---

## 4. What is the difference between **relative**, **absolute**, **fixed**, and **sticky** positioning?

| Position | Reference point | Behavior |
|----------|----------------|----------|
| **relative** | The element’s **original** place in the normal flow. | Offsets (`top`, `left`, …) move it **relative** to that spot, but the space it would have occupied remains. |
| **absolute** | Nearest **positioned ancestor** (`relative`, `absolute`, `fixed`, `sticky`). If none, the **initial containing block** (viewport). | Removed from normal flow; positioned using offsets. |
| **fixed** | The **viewport** (browser window). | Stays in the same place even when the page scrolls. |
| **sticky** | Acts like **relative** until a scroll threshold is reached, then behaves like **fixed**. | Requires a scroll container and a defined `top/right/bottom/left` offset. |

💡 **Tip:** Use `sticky` for headers that should stay visible after scrolling past them.

---

## 5. What is the difference between `display: none` and `visibility: hidden`?

| Property | `display: none` | `visibility: hidden` |
|----------|----------------|----------------------|
| **Layout impact** | Element is **removed** from the document flow; surrounding elements re‑flow. | Element **occupies space** but is not rendered. |
| **Accessibility** | Not read by screen readers (treated as absent). | Still read by some assistive technologies (depends on implementation). |
| **Animation** | Cannot be transitioned (no element to animate). | Can be faded with `opacity` or transitioned `visibility`. |
| **Use case** | Completely hide an element and collapse its space. | Hide content while preserving layout (e.g., tooltip placeholders). |

---

## 6. What are pseudo‑classes and pseudo‑elements? Give examples.

- **Pseudo‑classes** target an element **based on its state**.  
  - `:hover` – when the mouse is over the element.  
  - `:focus` – when the element receives keyboard focus.  
  - `:nth-child(2n)` – every even child.  

- **Pseudo‑elements** style **a part of an element**.  
  - `::before` / `::after` – insert generated content before/after the element’s content.  
  - `::first-line` – style the first line of a block of text.  
  - `::selection` – style the portion of text the user selects.

💡 **Tip:** Use double colon (`::`) for pseudo‑elements (CSS3) and single colon (`:`) for pseudo‑classes (CSS2 compatibility).

---

## 7. Explain Flexbox and its main properties.

**Flexbox** (`display: flex`) creates a one‑dimensional layout (row or column).

| Property | Purpose |
|----------|---------|
| `flex-direction` | Sets main axis: `row`, `row-reverse`, `column`, `column-reverse`. |
| `justify-content` | Aligns items **along the main axis** (`flex-start`, `center`, `space-between`, …). |
| `align-items` | Aligns items **along the cross axis** (`stretch`, `center`, `flex-start`, …). |
| `flex-wrap` | Controls whether items wrap onto multiple lines (`nowrap`, `wrap`, `wrap-reverse`). |
| `align-content` | Aligns **multiple lines** when wrapping (`stretch`, `center`, …). |
| `flex` (shorthand) | Sets `flex-grow`, `flex-shrink`, `flex-basis` for individual items. |
| `order` | Changes visual order without altering source order. |

💡 **Tip:** Flexbox excels for navigation bars, card grids, and any layout where items share a single axis.

---

## 8. Explain CSS Grid and how it differs from Flexbox.

| Aspect | **CSS Grid** | **Flexbox** |
|--------|--------------|-------------|
| **Dimension** | Two‑dimensional (rows **and** columns). | One‑dimensional (either row **or** column). |
| **Container vs Item** | Grid defines explicit tracks; children are placed into cells. | Flex container controls layout of its direct children. |
| **Placement** | Can position items by line numbers, names, or `grid-area`. | Items flow automatically; manual placement via `order`. |
| **Use cases** | Complex page layouts, magazine‑style designs. | UI components, toolbars, simple rows/columns. |
| **Gap handling** | `grid-gap` (or `gap`) works for both rows & columns. | `gap` works only in newer browsers for flex containers. |

💡 **Tip:** Combine both – use Grid for the overall page skeleton, Flexbox for component internals.

---

## 9. What is the CSS cascade and how does it work?

The **cascade** resolves conflicts between multiple style rules.

1. **Origin** – User Agent → User → Author (with `!important` overriding normal rules).  
2. **Importance** – Normal rules vs `!important`.  
3. **Specificity** – Higher specificity wins (see Q3).  
4. **Source order** – Later rules override earlier ones when all else is equal.

The final computed style is the result of this ordered evaluation.

---

## 10. What are CSS combinators (descendant, child, sibling)?

| Combinator | Syntax | Meaning |
|------------|--------|----------|
| **Descendant** | `A B` | Selects any **B** inside **A**, at any depth. |
| **Child** | `A > B` | Selects **B** that is a **direct child** of **A**. |
| **Adjacent sibling** | `A + B` | Selects **B** that **immediately follows** **A**. |
| **General sibling** | `A ~ B` | Selects **all B** that follow **A** on the same level. |

💡 **Tip:** Use the most specific combinator you need to keep selectors performant.

---

## 11. What is the difference between **em**, **rem**, **%**, **px**, and **vw/vh** units?

| Unit | Relative to | Typical use |
|------|-------------|------------|
| **em** | Font size of the **current element**. | Scalable typography, padding/margin that follows parent font size. |
| **rem** | Font size of the **root (`<html>`)** element. | Consistent scaling across the whole page. |
| **%** | Parent element’s **dimension** (width for horizontal, height for vertical). | Fluid layouts, width of containers. |
| **px** | Absolute pixel value (device‑dependent). | Precise control, icons, borders. |
| **vw / vh** | **Viewport** width/height (1 vw = 1 % of viewport width). | Responsive typography, full‑screen sections. |

💡 **Tip:** Combine `rem` for base sizing with `vw` for fluid scaling.

---

## 12. What are CSS variables (custom properties) and how do you use them?

```css
:root {
  --primary-color: #0066ff;
  --spacing: 1.5rem;
}

/* Usage */
.button {
  background: var(--primary-color);
  padding: var(--spacing);
}
```

- Declared with `--` prefix, usually on `:root` for global scope.  
- Accessed via `var(--name, fallback)`.  
- **Inheritance:** Custom properties cascade like normal properties, making them powerful for theming.

---

## 13. What is a media query and how do you write one for responsive design?

💡 **Media queries** apply styles based on viewport characteristics.

```css
@media (min-width: 768px) {
  .sidebar { display: block; }
}
```

- Common breakpoints: `320px` (mobile), `768px` (tablet), `1024px` (desktop).  
- Can combine features: `@media (min-width: 768px) and (orientation: landscape) { … }`.

---

## 14. What is the difference between **mobile‑first** and **desktop‑first** CSS approaches?

| Approach | Order of Queries | Philosophy |
|----------|------------------|------------|
| **Mobile‑first** | Base styles target **small screens**; `@media (min-width: …)` adds enhancements for larger screens. | Prioritizes performance on low‑end devices; progressive enhancement. |
| **Desktop‑first** | Base styles target **large screens**; `@media (max-width: …)` overrides for smaller screens. | Historically common; can lead to loading unnecessary styles on mobile. |

💡 **Tip:** Mobile‑first is generally recommended for modern, performance‑focused sites.

---

## 15. Explain **z-index** and stacking contexts.

- **z-index** controls the stack order of **positioned** elements (`position` not `static`). Higher values appear on top.  
- A **stacking context** is a self‑contained layer where z-index is evaluated locally. It is created by:
  - `position` other than `static` with `z-index` other than `auto`.  
  - `opacity < 1`, `transform`, `filter`, `perspective`, `isolation: isolate`, `mix-blend-mode`, `will-change`, `contain`, etc.  

Elements in different stacking contexts cannot intermix; the entire context is stacked as a single unit.

---

## 16. What causes a stacking context to be created?

| Trigger | Example |
|---------|---------|
| `position` with `z-index` other than `auto` | `position: relative; z-index: 2;` |
| `opacity` less than `1` | `opacity: 0.9;` |
| `transform` (any value) | `transform: rotate(10deg);` |
| `filter` | `filter: blur(2px);` |
| `perspective` | `perspective: 500px;` |
| `isolation: isolate` | `isolation: isolate;` |
| `contain` with layout/paint/size | `contain: layout paint;` |
| `will-change` for properties that create a new layer | `will-change: transform;` |

---

## 17. What is the difference between **inline**, **inline‑block**, and **block** display?

| Display | Layout behavior |
|---------|-----------------|
| **inline** | Flows with text, **no width/height**; respects left‑to‑right flow. |
| **inline‑block** | Behaves like **inline** (flows with text) **but** can have explicit **width/height** and vertical margins/paddings. |
| **block** | Starts on a **new line**, expands to fill the container’s width, respects width/height, margins, and paddings. |

💡 **Tip:** Use `inline-block` for navigation links that need padding and a set width without breaking the line.

---

## 18. What are **CSS transitions** vs **CSS animations**?

| Feature | **Transition** | **Animation** |
|---------|----------------|----------------|
| **Trigger** | Starts on a **state change** (e.g., `:hover`). | Runs **independently** of user interaction; can be infinite. |
| **Keyframes** | Not needed; just `transition: property duration timing;`. | Requires `@keyframes` definition. |
| **Control** | Simple start/end. | Complex sequences, multiple steps, direction, iteration count. |
| **Use case** | Hover effects, simple fades. | Loading spinners, complex motion sequences. |

---

## 19. What is the purpose of `@keyframes`?

`@keyframes` defines **named animation sequences** that can be applied with `animation-name`. It allows you to specify intermediate states (0 % → 100 %) for properties that cannot be transitioned (e.g., `transform`, `opacity` in complex patterns).

```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
```

---

## 20. What is the difference between `:hover`, `:focus`, and `:active`?

| Pseudo‑class | When it applies |
|--------------|-----------------|
| `:hover` | When the pointing device is **over** the element. |
| `:focus` | When the element receives **keyboard focus** (e.g., tabbing). |
| `:active` | While the element is being **activated** (mouse button down or key press). |

💡 **Accessibility tip:** Always provide a visible `:focus` style for keyboard users.

---

## 21. What is **BEM** methodology and why is it used?

- **BEM** = **Block __ Element -- Modifier**.  
- **Block**: independent component (e.g., `.card`).  
- **Element**: part of a block (`.card__title`).  
- **Modifier**: variant or state (`.card--featured`, `.card__title--large`).  

**Why use BEM?**

- Predictable naming → easier maintenance.  
- Avoids selector conflicts.  
- Works well with CSS preprocessors and component‑based frameworks.

---

## 22. What are CSS preprocessors (Sass/LESS) and their advantages?

- **Preprocessors** add programming‑like features to CSS: variables, nesting, mixins, functions, and imports.  
- **Advantages**:  
  - DRY code (`@mixin`, `@extend`).  
  - Better organization (partials, modules).  
  - Calculations (`calc()`, arithmetic).  
  - Conditional logic (`@if`, `@for`).  

They compile to standard CSS before deployment.

---

## 23. What is **critical CSS** and why does it matter for performance?

**Critical CSS** is the subset of styles required to render **above‑the‑fold** content. By inlining this CSS in the `<head>` and deferring the rest, the browser can paint the initial view faster, reducing **First Contentful Paint (FCP)** and improving perceived performance.

---

## 24. How does CSS specificity conflict get resolved with `!important`?

- `!important` **overrides** normal specificity rules.  
- If multiple rules have `!important`, the one with **higher specificity** wins.  
- If still equal, later source order wins.  

💡 **Caution:** Overusing `!important` makes maintenance hard; prefer proper specificity.

---

## 25. What is the difference between **min‑width / max‑width** and **width** in responsive design?

| Property | Effect |
|----------|--------|
| `width` | Sets a **fixed** size (unless using percentages). |
| `min-width` | Guarantees the element **won’t shrink** below this value. |
| `max-width` | Guarantees the element **won’t grow** beyond this value. |

**Responsive pattern:** `width: 100%; max-width: 1200px;` lets an element expand to fill its container but never exceed 1200 px.

---

## 26. Explain **CSS float** and **clearfix** technique.

- **Float** (`float: left/right`) removes an element from normal flow and pushes it to the side, allowing text to wrap around it.  
- **Clearfix** restores normal flow for the parent container, preventing it from collapsing when its children are floated.

```css
/* Classic clearfix */
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
```

---

## 27. What is **CSS containment** (`contain` property)?

`contain` tells the browser that an element’s layout, style, or paint is **independent** of the rest of the page, enabling performance optimizations.

- `contain: layout;` – size calculations are isolated.  
- `contain: paint;` – painting is isolated.  
- `contain: size;` – size is known ahead of time.  
- `contain: strict;` – all three plus style containment.

---

## 28. What are **CSS Grid template areas**?

`grid-template-areas` lets you name sections of the grid for semantic placement.

```css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-areas:
    "header header"
    "nav    main"
    "footer footer";
}
.header  { grid-area: header; }
.nav     { grid-area: nav; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

This improves readability and makes rearranging layouts straightforward.

---

## 29. What is the difference between **rem** and **em** when nested?

| Unit | Calculation | Nesting effect |
|------|-------------|-----------------|
| **rem** | Always based on **root** (`<html>`) font size. | **Unaffected** by parent font size; consistent across nesting. |
| **em** | Based on the **computed font size of the parent**. | **Compounds** with each nesting level, potentially leading to large values. |

💡 **Tip:** Use `rem` for global sizing, `em` for component‑specific scaling (e.g., button padding relative to its own font size).

---

## 30. What is a **CSS reset/normalize** and why use one?

- **Reset**: Strips all default browser styles (e.g., `margin: 0; padding: 0;`).  
- **Normalize**: Makes browsers render elements **consistently** while preserving useful defaults.  

Using either reduces cross‑browser inconsistencies and provides a clean baseline for custom styling.

---

## 31. How do you center a div both vertically and horizontally?

💡 The most robust method uses **Flexbox**:

```css
.parent {
  display: flex;
  justify-content: center;   /* horizontal */
  align-items: center;      /* vertical */
  height: 100vh;             /* full‑height container */
}
```

Alternative: `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);`.

---

## 32. What is the CSS `'currentColor'` keyword?

`currentColor` refers to the **computed `color` value** of the element. It can be used for any property that accepts a color, enabling consistent theming without duplication.

```css
.icon {
  color: #0066ff;
  border: 2px solid currentColor; /* same as #0066ff */
}
```

---

## 33. What are **CSS container queries**?

Container queries let a component adapt its styles based on the **size of its own container** rather than the viewport.

```css
@container (min-width: 400px) {
  .card { grid-template-columns: 1fr 1fr; }
}
```

They enable truly **modular responsive design**, especially for reusable UI components.

---

## 34. What is the difference between **transform** and **position** for animations, performance‑wise?

| Technique | Performance impact |
|-----------|--------------------|
| **transform** (e.g., `translate`, `scale`) | Triggers **GPU compositing**; cheap, runs on the compositor thread; no layout/reflow. |
| **position** (`top`, `left`) | Causes **layout recalculation** and **repaint**; more expensive, can jank on large pages. |

💡 **Tip:** Prefer `transform` for moving elements; use `position` only when you need to affect document flow.

---

## 35. What is the purpose of **`will-change`** in CSS?

`will-change` hints to the browser that an element’s property (e.g., `transform`, `opacity`) will change soon, allowing it to **pre‑optimize** (create a new layer). Use sparingly to avoid memory bloat.

```css
.button {
  will-change: transform;
}
```

---

## 36. Explain CSS specificity with **inline styles**, **IDs**, **classes**, and **elements** ranking.

| Selector type | Specificity (a,b,c,d) |
|---------------|-----------------------|
| Inline style (`style=`) | **1,0,0,0** |
| ID (`#header`) | **0,1,0,0** |
| Class (`.nav`), attribute (`[type="text"]`), pseudo‑class (`:hover`) | **0,0,1,0** |
| Element (`div`), pseudo‑element (`::before`) | **0,0,0,1** |

Higher values win; if equal, later declaration wins.

---

## 37. What is the difference between **absolute** and **relative** units for accessibility?

| Unit type | Accessibility impact |
|-----------|-----------------------|
| **Absolute** (`px`, `pt`) | Fixed size; does **not** scale with user’s browser zoom or OS text‑size settings. |
| **Relative** (`em`, `rem`, `%`) | Scales with the **root or parent font size**, respecting user preferences and improving readability. |

💡 **Tip:** Use `rem` for typographic scaling to support users who increase default font size.

---

## 38. How does CSS handle overflow with `overflow`, `overflow-x`, and `overflow-y`?

- `overflow` sets both axes (`visible`, `hidden`, `scroll`, `auto`).  
- `overflow-x` controls **horizontal** overflow.  
- `overflow-y` controls **vertical** overflow.  

If one axis is set to `scroll` and the other to `auto`, scrollbars appear only where needed.

---

## 39. What are **attribute selectors** in CSS?

Attribute selectors match elements based on the presence or value of an HTML attribute.

| Syntax | Meaning |
|--------|---------|
| `[type]` | Elements with a `type` attribute. |
| `[type="text"]` | Exact match. |
| `[type~="email"]` | Attribute value is a **space‑separated list** containing `email`. |
| `[type^="btn"]` | Value **starts with** `btn`. |
| `[type$="end"]` | Value **ends with** `end`. |
| `[type*="mid"]` | Value **contains** `mid`. |

Useful for styling form controls, data attributes, etc.

---

## 40. What is the difference between **CSS Grid's `fr` unit** and **percentage‑based columns**?

| Unit | Behavior |
|------|----------|
| `fr` (fraction) | Distributes **available free space** proportionally after accounting for fixed tracks (e.g., `1fr 2fr` → 1/3 vs 2/3 of remaining space). |
| `%` | Calculates width **relative to the grid container’s size**, regardless of other tracks. May cause overflow if total exceeds 100 %. |

`fr` is more flexible for fluid grids, while `%` is useful for precise, static ratios.

---

## 💻 Coding Challenges

### 13. Write a media query for responsive design (mobile‑first)

```css
/* Base (mobile) styles */
.container {
  padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
  }
}
```

### 31. Center a div both vertically and horizontally

```css
.parent {
  display: flex;
  justify-content: center;   /* horizontal */
  align-items: center;       /* vertical */
  height: 100vh;            /* full‑height container */
}

.child {
  width: 200px;
  height: 150px;
  background: #f0f0f0;
}
```
