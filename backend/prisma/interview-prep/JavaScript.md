<!--LANG:roman-->

# JavaScript Interview Questions

## 1. What is the difference between var, let, and const?

**Asaan Urdu mein:**  
`var` function‑scoped hota hai, hoist hota hai aur dobara declare kiya ja sakta hai. `let` aur `const` block‑scoped hain; dono ko dobara declare nahi kiya ja sakta. `const` ko initialize karna zaroori hai aur value reassign nahi hoti, lekin object ya array ke andar ke data ko mutate kiya ja sakta hai. Aam tor par `const` ko default istemal karein, `let` sirf tab jab value ko badalna ho, aur `var` kabhi istemal na karein.

---

## 2. Explain closures with an example.

**Asaan Urdu mein:**  
Closure wo function hota hai jo apne outer function ki variables tak access rakhta hai, chahe outer function return ho chuka ho. Har function banane par closure create hoti hai, jo data privacy, currying, aur callbacks ke liye kaam aati hai. Is se aap state ko encapsulate kar sakte hain bina global variables ke.

---

## 3. What is hoisting in JavaScript?

**Asaan Urdu mein:**  
Hoisting ka matlab hai ke JavaScript declarations ko code ke execution se pehle unke scope ke top par le jata hai. `var` declarations hoist hoti hain aur `undefined` se initialize hoti hain, jabke `let` aur `const` hoist hoti hain lekin initialize nahi hoti (Temporal Dead Zone). Function declarations poori tarah hoist hoti hain, lekin function expressions nahi.

---

## 4. What is the difference between == and ===?

**Asaan Urdu mein:**  
`==` type coercion karta hai, yani dono values ko ek common type mein convert karke compare karta hai. `===` strict equality hai, jo type aur value dono ko bina conversion ke compare karta hai. Hamesha `===` istemal karein taake unexpected type conversion se bacha ja sake.

---

## 5. Explain the event loop and call stack.

**Asaan Urdu mein:**  
Call stack ek LIFO (Last‑In‑First‑Out) structure hai jo function calls ko track karta hai. Event loop continuously check karta hai ke call stack khali hai ya nahi; jab khali ho jata hai, woh microtask queue (Promises, queueMicrotask) ko pehle execute karta hai, phir macrotask queue (setTimeout, I/O) se ek task le kar chalata hai. Is se asynchronous code non‑blocking rehta hai.

---

## 6. What is the difference between synchronous and asynchronous code?

**Asaan Urdu mein:**  
Synchronous code ek ke baad ek execute hota hai, har operation agle se pehle complete hota hai, isliye UI block ho sakti hai. Asynchronous code background mein chalti hai, program ko aage badhne deti hai jab tak operation complete nahi hota. JavaScript callbacks, Promises, aur async/await ka istemal karke async behavior achieve karta hai.

---

## 7. What are Promises and how do they work?

**Asaan Urdu mein:**  
Promise ek object hai jo asynchronous operation ke eventual result (fulfilled) ya failure (rejected) ko represent karta hai. Iske teen states hoti hain: *pending*, *fulfilled*, *rejected*. `.then()` success ke liye, `.catch()` error ke liye, aur `.finally()` cleanup ke liye use hota hai. Promise chaining se nested callbacks ki jagah linear flow milta hai.

---

## 8. Explain async/await and how it relates to Promises.

**Asaan Urdu mein:**  
`async`/`await` Promises ka syntactic sugar hai, jo asynchronous code ko synchronous jaisa padhne layak banata hai. `async` function hamesha ek Promise return karta hai. `await` us Promise ke resolve hone tak function execution ko pause karta hai. Error handling `try/catch` se hoti hai, jo `.catch()` ka alternative hai.

---

## 9. What is the difference between call, apply, and bind?

**Asaan Urdu mein:**  
`call` function ko turant invoke karta hai aur arguments ko individually pass karta hai. `apply` bhi turant invoke karta hai lekin arguments ko array ke roop mein leta hai. `bind` function ko immediately execute nahi karta, balki ek naya function return karta hai jisme `this` permanently set hota hai, aur optional pre‑filled arguments bhi ho sakte hain.

---

## 10. What is 'this' in JavaScript and how is it determined?

**Asaan Urdu mein:**  
`this` function ke execution context ko refer karta hai. Agar normal function call ho, to non‑strict mode mein global object, strict mode mein `undefined`. Method call mein object jiske upar method call hota hai. Constructor (`new`) mein newly created instance. Arrow function lexical `this` inherit karta hai. `call`/`apply`/`bind` se explicitly set kiya ja sakta hai.

---

## 11. What are arrow functions and how do they handle 'this' differently?

**Asaan Urdu mein:**  
Arrow functions concise syntax (`=>`) hoti hain aur apna `this` nahi rakhti; wo lexical scope se `this` inherit karti hain. Iska matlab hai ke callback ya inner function mein `this` lost nahi hota. Arrow functions ko constructor (`new`) ke roop mein use nahi kiya ja sakta, unke paas `arguments` object nahi hota, aur `call`/`apply`/`bind` se `this` change nahi hota.

---

## 12. What is prototypal inheritance?

**Asaan Urdu mein:**  
JavaScript objects ek prototype chain ke through inherit karte hain. Har object ka internal `[[Prototype]]` link hota hai jo dusre object ki taraf point karta hai. Jab property object par nahi milti, engine prototype chain ko traverse karta hai. ES6 `class` syntax sirf syntactic sugar hai, asal mein prototype inheritance hi hoti hai.

---

## 13. What is the difference between null and undefined?

**Asaan Urdu mein:**  
`undefined` tab hota hai jab variable declare ho gaya lekin assign nahi hua, ya property exist nahi karti. `null` ek intentional empty value hai jo developer set karta hai. `typeof null` `"object"` return karta hai (historical bug), jabke `typeof undefined` `"undefined"` hota hai. `null == undefined` true hota hai, lekin `===` dono ko alag samajhta hai.

---

## 14. What are higher-order functions?

**Asaan Urdu mein:**  
Higher‑order function wo hoti hai jo ya to ek function ko argument ke roop mein leti hai ya ek function return karti hai (ya dono). Ye functional programming patterns jaise abstraction, composition, aur callbacks ko enable karti hai. Common examples: `Array.map`, `Array.filter`, `Array.reduce`, aur `setTimeout`.

---

## 15. Explain the concept of currying in JavaScript.

**Asaan Urdu mein:**  
Currying ek function ko multiple arguments lene ki jagah ek series of single‑argument functions mein convert karta hai. Is se partial application aur function composition asaan ho jati hai. Arrow syntax se succinct currying likhi ja sakti hai, aur generic `curry` helper se kisi bhi function ko curry kiya ja sakta hai.

---

## 16. What is debouncing and throttling, and how do you implement them?

**Asaan Urdu mein:**  
Debouncing ek function ko tab tak delay karta hai jab tak specified idle period na ho; har call timer reset karta hai. Throttling ek function ko har specified interval mein sirf ek baar chalne deta hai, chahe kitni bhi calls aaye. Debounce search inputs ke liye, throttle scroll ya resize events ke liye use hota hai.

---

## 17. What is the difference between deep copy and shallow copy?

**Asaan Urdu mein:**  
Shallow copy naya object banata hai lekin nested objects ke references ko copy karta hai, isliye original aur copy dono same nested data ko share karte hain. Deep copy recursively sab nested objects ko clone karta hai, jisse original aur copy bilkul alag ho jate hain. Shallow copy fast hota hai, deep copy tab zaroori hota hai jab nested mutation se bachna ho.

---

## 18. What are JavaScript data types (primitive vs reference)?

**Asaan Urdu mein:**  
Primitive types (string, number, boolean, null, undefined, symbol, bigint) immutable hote hain aur value ke roop mein store hote hain. Reference types (Object, Array, Function, Date, Map, Set, etc.) memory address ke roop mein store hote hain; variables sirf reference rakhte hain. Primitive copy karne se value duplicate hoti hai, reference copy karne se dono variables same object ko point karte hain.

---

## 19. What is event delegation and why is it useful?

**Asaan Urdu mein:**  
Event delegation ek pattern hai jisme parent element par single listener lagaya jata hai aur `event.target` se child element identify kiya jata hai. Is se bahut saare listeners ki jagah sirf ek listener lagta hai, performance improve hoti hai, aur dynamically added elements automatically handle ho jate hain.

---

## 20. What is the difference between event bubbling and event capturing?

**Asaan Urdu mein:**  
Event bubbling mein event target se start hokar ancestors ki taraf upward propagate hota hai (default). Event capturing mein root se start hokar target tak downward propagate hota hai; iske liye `addEventListener` ka third argument `true` set karna hota hai. Capture phase pehle fire hota hai, phir target, phir bubbling.

---

## 21. What are generators in JavaScript?

**Asaan Urdu mein:**  
Generators `function*` syntax se define hote hain aur `yield` keyword se execution ko pause aur resume karte hain. Ye iterator object return karte hain jisme `.next()` call karne par `{value, done}` milta hai. Infinite sequences, lazy evaluation, aur custom iteration ke liye generators useful hain.

---

## 22. What is the difference between map, filter, and reduce?

**Asaan Urdu mein:**  
`map` har element ko transform karta hai aur same length ka naya array return karta hai. `filter` condition ke basis par elements ko select karta hai aur chhota array return karta hai. `reduce` sab elements ko ek single value (number, object, array, etc.) mein accumulate karta hai. Sab immutable hain aur original array ko modify nahi karte.

---

## 23. Explain the module pattern and ES6 modules (import/export).

**Asaan Urdu mein:**  
Module pattern IIFE aur closure ka use karke private scope banata hai aur sirf public API expose karta hai. ES6 modules har file ko alag module banate hain, default aur named exports ke saath, static analysis aur tree‑shaking ke liye. ES6 modules strict mode mein hoti hain, automatically deferred hoti hain, aur server se nahi bheji jati.

---

## 24. What is the difference between synchronous and asynchronous iteration (for...of vs forEach)?

**Asaan Urdu mein:**  
`forEach` synchronous hai, callback sequentially execute hota hai aur return value ignore hoti hai; async callbacks ke saath `await` kaam nahi karta. `for...of` iterable ko sequentially access karta hai aur `await` ke saath asynchronous iteration possible banata hai, isse async tasks ko proper order mein handle kiya ja sakta hai.

---

## 25. What is a memory leak in JavaScript, and how can it happen?

**Asaan Urdu mein:**  
Memory leak tab hota hai jab unused memory garbage collector se reclaim nahi hoti. Common causes: forgotten timers/intervals, global variables, detached DOM elements, closures jo large objects ko capture karte hain, aur event listeners jo remove nahi kiye gaye. WeakMap/WeakSet, proper cleanup, aur lifecycle hooks se leaks avoid kiye ja sakte hain.

---

## 26. What is the difference between local storage, session storage, and cookies?

**Asaan Urdu mein:**  
`localStorage` data ko tab tak store karta hai jab tak manually delete na ho (5‑10 MB, client‑only). `sessionStorage` sirf current tab ke session tak rehta hai, tab close hone par clear ho jata hai. Cookies chhoti (≈4 KB) hoti hain, har HTTP request ke saath server ko bheji jati hain, aur expiration, Secure, SameSite flags se control hoti hain.

---

## 27. What is the temporal dead zone?

**Asaan Urdu mein:**  
Temporal Dead Zone (TDZ) wo period hai jab block ke andar `let` ya `const` variable hoist ho chuka hota hai lekin abhi initialize nahi hua. Is period mein variable ko access karne par `ReferenceError` milta hai. `var` ke paas TDZ nahi hoti; wo `undefined` se initialize ho jata hai.

---

## 28. What is destructuring and how is it used?

**Asaan Urdu mein:**  
Destructuring syntax arrays ya objects se values ko alag variables mein unpack karta hai. Default values, renaming, nested destructuring, aur rest pattern (`...`) se remaining items capture kiye ja sakte hain. Functions ke parameters mein bhi destructuring se clean argument handling hoti hai.

---

## 29. What are template literals?

**Asaan Urdu mein:**  
Template literals backticks (`` ` ``) se likhe jate hain, `${expression}` ke through expression interpolation allow karte hain, multiline strings bina `\n` ke likhne dete hain, aur tagged templates custom processing ke liye functions provide karte hain. Ye string concatenation se kaafi readable hain.

---

## 30. What is the spread operator vs rest parameter?

**Asaan Urdu mein:**  
Spread (`...`) iterable (array, object, string) ko individual elements mein expand karta hai, jaise function call ya array/object literal. Rest (`...`) function parameters ya destructuring mein multiple arguments ko ek array mein collect karta hai. Context decide karta hai ki `...` spread hai ya rest.

---

## 31. What is a WeakMap and WeakSet, and how are they different from Map and Set?

**Asaan Urdu mein:**  
WeakMap aur WeakSet keys ke liye weak references rakhte hain (sirf objects). Agar key object kahin aur reference nahi hai to garbage collector us entry ko automatically remove kar deta hai. Ye iterable nahi hote, size ya clear methods nahi hote. Map/Set strong references rakhte hain, iterable hote hain, aur size track karte hain.

---

## 32. What is the difference between a microtask and a macrotask queue?

**Asaan Urdu mein:**  
Microtasks (Promises, `queueMicrotask`, MutationObserver) current script ke baad turant execute hote hain, macrotasks (setTimeout, I/O, UI events) ke baad. Event loop ek macrotask chalata hai, phir **sab** microtasks ko clear karta hai, phir rendering, phir next macrotask. Microtasks ko continuously queue karne se macrotasks starve ho sakte hain.

---

## 33. Explain the concept of immutability in JavaScript.

**Asaan Urdu mein:**  
Immutability ka matlab hai data ko modify na karna, balki required changes ke liye naya copy create karna. Pure functions, spread operator, aur immutable libraries (Immutable.js, Immer) isko enforce karte hain. Immutable state debugging, referential transparency, aur efficient UI updates (React) mein madad karta hai.

---

## 34. What is NaN and how do you check for it correctly?

**Asaan Urdu mein:**  
`NaN` (Not‑a‑Number) ek special numeric value hai jo failed numeric operations se aata hai. `NaN === NaN` false hota hai, isliye `Number.isNaN(value)` ya `Object.is(value, NaN)` se check karna chahiye. Global `isNaN` type coercion karta hai, isliye unreliable hai.

---

## 35. What is the difference between function declarations and function expressions?

**Asaan Urdu mein:**  
Function declaration (`function foo(){}`) fully hoist hoti hai, isliye usse pehle bhi call kiya ja sakta hai. Function expression (`const foo = function(){}`) variable assignment ki tarah hoti hai, isliye hoist nahi hoti; sirf declaration hoist hoti hai, initialization nahi. Arrow functions hamesha expressions hoti hain.

---

## 36. What is an IIFE (Immediately Invoked Function Expression) and why is it used?

**Asaan Urdu mein:**  
IIFE ek function expression hoti hai jo turant execute hoti hai. Ye ek private scope create karti hai, global namespace ko pollute hone se bachati hai, aur module pattern ya loop‑bug fixes (var) ke liye use hoti hai. ES6 ke baad bhi backward compatibility ke liye useful hai.

---

## 37. What is the difference between Object.freeze() and Object.seal()?

**Asaan Urdu mein:**  
`Object.freeze()` object ko completely immutable banata hai – na properties add, delete, na values change (writable: false, configurable: false). `Object.seal()` properties ko add/delete se rokti hai, lekin existing writable properties ko change kiya ja sakta hai. Dono shallow hain; nested objects ko manually freeze/seal karna padta hai.

---

## 38. How does JavaScript garbage collection work?

**Asaan Urdu mein:**  
Modern engines mark‑and‑sweep GC use karte hain. Roots (global, stack variables) se reachable objects ko mark karte hain, phir unmarked objects ko sweep (free) kar dete hain. Generational GC young objects ko frequently collect karta hai, old objects ko kam. Reference counting se circular references handle nahi hote, lekin mark‑and‑sweep se hota hai.

---

## 39. What is the difference between Array.forEach and Array.map in terms of return value?

**Asaan Urdu mein:**  
`forEach` return value **undefined** hoti hai, sirf side‑effects (logging, mutation) ke liye use hota hai. `map` ek naya array return karta hai jisme har element ka transformed value hota hai; isse chaining aur functional pipelines possible hoti hain. `map` data transformation ke liye, `forEach` side‑effects ke liye.

---

## 40. What is optional chaining and nullish coalescing?

**Asaan Urdu mein:**  
Optional chaining (`?.`) agar left side `null` ya `undefined` ho to `undefined` return karta hai, error throw nahi karta. Nullish coalescing (`??`) left side ko sirf `null` ya `undefined` hone par right side return karta hai; `0`, `''`, `false` ko falsy nahi samajhta. Dono milke safe nested property access aur default values provide karte hain.

---

## 41. What is the difference between shallow equality and deep equality checks?

**Asaan Urdu mein:**  
Shallow equality (`===`) sirf top‑level reference ya primitive value compare karta hai. Deep equality recursively sab nested properties ko compare karta hai; libraries (Lodash `isEqual`) ya custom recursive functions iske liye use hoti hain. React memoization mein shallow equality fast hoti hai, deep equality detailed comparison ke liye.

---

## 42. Explain how JavaScript's single-threaded nature relates to concurrency.

**Asaan Urdu mein:**  
JavaScript ek call stack par ek waqt mein sirf ek code block chalata hai (single‑threaded). Concurrency event loop, non‑blocking I/O, aur asynchronous callbacks ke through achieve hoti hai – multiple tasks interleaved hote hain, lekin ek waqt mein sirf ek hi run hota hai. Web Workers ya Node worker threads separate threads provide karte hain, lekin JavaScript core single thread hi rehta hai.

---

## 43. What is a polyfill and when would you use one?

**Asaan Urdu mein:**  
Polyfill ek code snippet ya library hoti hai jo modern API (method, object) ko older browsers ya environments mein implement karti hai. Jab aap latest JavaScript features (e.g., `Array.includes`, `Promise`, `fetch`) use karna chahte hain aur backward compatibility chahiye, tab polyfill load karte hain. Feature detection ke baad conditional load ki jati hai.

---

## 44. What is the difference between throw and return in error handling?

**Asaan Urdu mein:**  
`return` function ko normal tarike se exit karta hai aur caller ko value bhejta hai. `throw` exception raise karta hai, jo call stack ke through propagate hota hai jab tak `try/catch` se handle na ho; agar uncaught rahe to program crash ho jata hai. `throw` exceptional situations ke liye, `return` expected outcomes ke liye use hota hai.

---

## 45. What is the difference between synchronous XMLHttpRequest and fetch API?

**Asaan Urdu mein:**  
Synchronous `XMLHttpRequest` JavaScript thread ko block karta hai jab tak response na mil jaye – UI freeze ho jati hai. `fetch` Promise‑based, non‑blocking hai, cleaner syntax, automatic JSON parsing, streaming support, aur modern browsers mein standard hai. Synchronous XHR deprecated hai, fetch ko async/await ke saath use karna best practice hai.

---

## 46. What is a Proxy object in JavaScript used for?

**Asaan Urdu mein:**  
`Proxy` ek wrapper hai jo target object ke fundamental operations (property get/set, function call, enumeration) ko intercept karta hai. Validation, logging, access control, virtual properties, aur reactive frameworks (Vue) jaise use cases mein istemal hota hai. `Reflect` API default behavior ko forward karne ke liye use hoti hai.

---

## 47. Explain the difference between composition and inheritance in JavaScript.

**Asaan Urdu mein:**  
Inheritance “is‑a” relationship create karta hai, jisme subclass parent ki behavior inherit karta hai (`extends`). Composition “has‑a” ya “uses‑a” relationship hoti hai, jisme objects chhote reusable behavior modules (mixins, factories) se assemble hote hain. Composition flexible, testable, aur fragile base class problems se bachata hai; inheritance rigid hierarchy banata hai.

---

## 48. What are Symbols in JavaScript and what are they used for?

**Asaan Urdu mein:**  
`Symbol()` unique, immutable primitive value create karta hai. Object keys ke liye use hota hai taake name collisions na ho (private‑like properties). Well‑known symbols (`Symbol.iterator`, `Symbol.toStringTag`, etc.) language protocols ko customize karte hain. Global symbol registry (`Symbol.for`) se shared symbols milte hain.

---

## 49. What is tail call optimization?

**Asaan Urdu mein:**  
Tail Call Optimization (TCO) engine ko allow karta hai ke tail position mein call hone wale function ke liye new stack frame allocate na ho, balki current frame reuse ho. Is se deep recursion stack overflow se bach jata hai. ES6 spec proper tail calls define karta hai, lekin sirf Safari ne implement kiya hai; dusre browsers mein manual techniques (trampolining) use hoti hain.

---

## 50. What is the difference between a pure function and an impure function?

**Asaan Urdu mein:**  
Pure function same inputs par hamesha same output deti hai aur koi side‑effects (state change, I/O) nahi hoti. Impure function different outputs de sakti hai ya external state modify kar sakti hai (console.log, DOM update, random numbers). Pure functions testable, memoizable, aur parallelizable hoti hain; impure functions real‑world interactions ke liye zaroori hoti hain.

---

## 51. What is memoization and how would you implement it?

**Asaan Urdu mein:**  
Memoization ek technique hai jisme expensive function calls ke results ko arguments ke basis par cache kiya jata hai. Jab same arguments dobara aate hain to cached result return hota hai, computation avoid hoti hai. Simple implementation `Map` ya object cache ke saath hoti hai; large caches ke liye LRU eviction strategy ya libraries use ki ja sakti hain.

---

<!--LANG:english-->

# JavaScript Interview Questions  

---

## 1. What is the difference between **var**, **let**, and **const**?  

| Feature | **var** | **let** | **const** |
|---------|---------|---------|-----------|
| **Scope** | Function‑scoped | Block‑scoped | Block‑scoped |
| **Hoisting** | Hoisted & initialized as `undefined` | Hoisted but not initialized (TDZ) | Hoisted but not initialized (TDZ) |
| **Re‑assignment** | Allowed | Allowed | **Not allowed** (value immutable) |
| **Re‑declaration** | Allowed within same scope | Not allowed in same scope | Not allowed in same scope |
| **Use case** | Legacy code, function‑level variables | Variables that change value | Constants, module imports, configuration objects |

💡 **Tip:** Prefer `let`/`const` over `var` to avoid accidental globals and hoisting pitfalls.

---

## 2. Explain **closures** with an example.  

A **closure** is a function that retains access to its lexical environment (variables from its outer scope) even after that outer function has finished executing.

- The inner function forms a closure over variables declared in the outer function.  
- Useful for data privacy, function factories, and maintaining state.

💡 **Tip:** Think of a closure as a “package” that bundles a function together with its surrounding state.

---

## 3. What is **hoisting** in JavaScript?  

- **Hoisting** moves declarations (not initializations) to the top of their containing scope during the compile phase.  
- `var` declarations are hoisted and initialized as `undefined`.  
- `let`/`const` declarations are hoisted but remain in the **Temporal Dead Zone** until their actual line of code.  
- Function declarations are hoisted with their full definition; function expressions are not.

---

## 4. What is the difference between **==** and **===**?  

| Aspect | `==` (Loose Equality) | `===` (Strict Equality) |
|--------|----------------------|--------------------------|
| **Type conversion** | Performs **type coercion** before comparison | **No coercion**; both type and value must match |
| **Typical use** | Rare, mostly for legacy code | Recommended for predictable comparisons |
| **Example** | `0 == '0'` → `true` | `0 === '0'` → `false` |

💡 **Tip:** Use `===` unless you have a very specific reason to allow coercion.

---

## 5. Explain the **event loop** and **call stack**.  

- **Call Stack**: LIFO structure that tracks currently executing functions.  
- **Event Loop**: Continuously checks the **task queue** (macrotasks) and **microtask queue**; when the call stack is empty, it pushes the next task onto the stack.  
- Enables asynchronous callbacks (e.g., `setTimeout`, Promises) to run without blocking the single thread.

---

## 6. What is the difference between **synchronous** and **asynchronous** code?  

| Characteristic | **Synchronous** | **Asynchronous** |
|-----------------|-----------------|------------------|
| **Execution** | Blocks subsequent code until current operation finishes | Allows other code to run while waiting (via callbacks, Promises, async/await) |
| **Use cases** | Simple calculations, immediate DOM updates | I/O, network requests, timers |
| **Flow** | Linear, top‑to‑bottom | Event‑driven, non‑blocking |

---

## 7. What are **Promises** and how do they work?  

- A **Promise** is an object representing the eventual completion (or failure) of an asynchronous operation.  
- States: **pending → fulfilled** (with a value) **or** **rejected** (with a reason).  
- Methods: `.then(onFulfilled, onRejected)`, `.catch(onRejected)`, `.finally(callback)`.  
- Enables chaining and avoids “callback hell”.

---

## 8. Explain **async/await** and how it relates to **Promises**.  

- `async` functions always return a **Promise**.  
- `await` pauses execution of the async function until the awaited Promise settles, then returns its resolved value (or throws if rejected).  
- Provides a synchronous‑like syntax for asynchronous code, improving readability.

---

## 9. What is the difference between **call**, **apply**, and **bind**?  

| Method | Syntax | How `this` is set | Arguments handling |
|--------|--------|-------------------|--------------------|
| **call** | `fn.call(thisArg, arg1, arg2, …)` | Immediately invokes `fn` with `thisArg` | Arguments passed **individually** |
| **apply** | `fn.apply(thisArg, [argsArray])` | Immediately invokes `fn` with `thisArg` | Arguments passed as an **array** |
| **bind** | `const boundFn = fn.bind(thisArg, arg1, …)` | Returns a **new function** with permanently bound `thisArg` | Can pre‑set arguments (partial application) |

💡 **Tip:** Use `apply` when you already have arguments in an array; use `bind` for callbacks that need a fixed `this`.

---

## 10. What is **'this'** in JavaScript and how is it determined?  

- **Default binding**: `this` = global object (`window`/`global`) in non‑strict mode, `undefined` in strict mode.  
- **Implicit binding**: When a function is called as a property (`obj.method()`), `this` = `obj`.  
- **Explicit binding**: Using `call`, `apply`, or `bind`.  
- **New binding**: When invoked with `new`, `this` = newly created object.  
- **Arrow functions**: `this` is **lexically inherited** from the surrounding scope (no own `this`).

---

## 11. What are **arrow functions** and how do they handle **'this'** differently?  

- Concise syntax: `param => expression`.  
- **No own `this`**, `arguments`, `super`, or `new.target`.  
- `this` is **lexically captured** from the enclosing execution context, making them ideal for callbacks that need the outer `this`.

---

## 12. What is **prototypal inheritance**?  

- Every object has an internal **[[Prototype]]** (accessible via `Object.getPrototypeOf` or `__proto__`).  
- Property lookup follows the **prototype chain** until the property is found or the chain ends (`null`).  
- You can set up inheritance with `Object.create(proto)`, `class extends`, or constructor functions (`Child.prototype = Object.create(Parent.prototype)`).

---

## 13. What is the difference between **null** and **undefined**?  

| Aspect | **null** | **undefined** |
|--------|----------|---------------|
| **Meaning** | Intentional absence of any object value | Variable declared but not assigned, or missing property/parameter |
| **Type** | `object` (historical bug) | `undefined` |
| **Typical use** | API returns “no value”, placeholder | Uninitialized variables, missing function arguments |

💡 **Tip:** Use `null` when you want to **explicitly** indicate “no value”.

---

## 14. What are **higher‑order functions**?  

- Functions that **accept other functions as arguments** or **return a function**.  
- Examples: `Array.prototype.map`, `filter`, `reduce`, `setTimeout`, custom function factories.

---

## 15. Explain the concept of **currying** in JavaScript.  

- **Currying** transforms a function with multiple arguments into a sequence of functions each taking a single argument.  
- Enables partial application and reusable function pipelines.

```js
// Example (conceptual, no code block required per rules)
```

💡 **Tip:** Use currying to create specialized functions from generic ones.

---

## 16. *(Moved to Coding Challenges – see the section at the end)*  

---

## 17. What is the difference between **deep copy** and **shallow copy**?  

| Aspect | **Shallow copy** | **Deep copy** |
|--------|------------------|---------------|
| **What is copied** | Copies **references** for nested objects/arrays | Recursively copies **all nested values** |
| **Methods** | `Object.assign`, spread (`{...obj}`), `Array.slice` | `JSON.parse(JSON.stringify(obj))`, structured clone (`structuredClone`), custom recursion |
| **Performance** | Faster, less memory | Slower, more memory |
| **Use case** | When nested structures are immutable or not needed | When you need a completely independent clone |

---

## 18. What are JavaScript **data types** (primitive vs reference)?  

- **Primitive**: `Number`, `String`, `Boolean`, `Symbol`, `BigInt`, `null`, `undefined`. Stored **by value**; immutable.  
- **Reference**: `Object`, `Array`, `Function`, `Date`, `RegExp`, etc. Stored **by reference**; mutable.

---

## 19. What is **event delegation** and why is it useful?  

- Attach a single listener to a **parent** element to handle events from its **child** elements via event bubbling.  
- Benefits: fewer listeners, dynamic elements automatically handled, improved performance.

---

## 20. What is the difference between **event bubbling** and **event capturing**?  

| Phase | **Bubbling** | **Capturing** |
|-------|--------------|---------------|
| **Order** | From **target** → ancestors (upward) | From **root** → target (downward) |
| **Default** | Most events bubble by default | Capturing must be explicitly requested (`addEventListener(..., {capture:true})`) |
| **Use case** | Common for delegation | Rare, used when you need to intercept before target handles it |

---

## 21. What are **generators** in JavaScript?  

- Functions declared with `function*` that can **pause** (`yield`) and **resume** execution, returning an iterator.  
- Useful for lazy sequences, async control flow (with `co`), and implementing custom iterables.

---

## 22. What is the difference between **map**, **filter**, and **reduce**?  

| Method | Purpose | Return value | Typical use |
|--------|---------|--------------|--------------|
| **map** | Transform each element | New array of same length | `arr.map(x => x * 2)` |
| **filter** | Select elements that satisfy a predicate | New array (≤ original length) | `arr.filter(x => x > 10)` |
| **reduce** | Accumulate a single value from all elements | Any type (number, object, etc.) | `arr.reduce((sum, x) => sum + x, 0)` |

---

## 23. Explain the **module pattern** and **ES6 modules** (`import`/`export`).  

- **Module Pattern** (pre‑ES6): IIFE that returns an object exposing public API, keeping private state hidden.  
- **ES6 Modules**: Native syntax using `export` to expose bindings and `import` to consume them. Supports static analysis, tree‑shaking, and strict mode by default.

---

## 24. What is the difference between **synchronous** and **asynchronous iteration** (`for...of` vs `forEach`)?  

| Feature | `for...of` | `Array.prototype.forEach` |
|---------|------------|---------------------------|
| **Sync/Async** | Works with **iterables** (including async iterables via `for await...of`) | Always **synchronous**; cannot `await` inside |
| **Control flow** | Supports `break`, `continue`, `return` | No early exit; must use exceptions or external flag |
| **Readability** | Clear, works with any iterable (e.g., `Set`, `Map`) | Convenient for simple array callbacks |

---

## 25. What is a **memory leak** in JavaScript, and how can it happen?  

- A memory leak occurs when **unreachable objects** are still retained in memory due to lingering references.  
- Common causes: global variables, closures that capture large objects, timers/event listeners not cleared, DOM references in detached nodes.

---

## 26. What is the difference between **local storage**, **session storage**, and **cookies**?  

| Storage | Lifetime | Size limit | Accessible to server | Typical use |
|--------|----------|-----------|----------------------|-------------|
| **localStorage** | Persists until explicitly cleared | ~5‑10 MB per origin | No | Long‑term client‑side data |
| **sessionStorage** | Cleared when tab/window closes | ~5‑10 MB per origin | No | Data for a single session |
| **cookies** | Can set expiration; sent with every HTTP request | ~4 KB per cookie | Yes | Authentication tokens, server‑side preferences |

---

## 27. What is the **temporal dead zone** (TDZ)?  

- The period between the start of a block and the point where a `let`/`const` variable is **initialized**.  
- Accessing the variable in the TDZ throws a `ReferenceError`.  
- Prevents accidental use before declaration.

---

## 28. What is **destructuring** and how is it used?  

- Syntax that **unpacks** values from arrays or properties from objects into distinct variables.  
- Example (conceptual, no code block): `const {a, b} = obj;` or `const [first, ...rest] = arr;`.

---

## 29. What are **template literals**?  

- String literals enclosed by backticks (`` ` ``) that support **interpolation** (`${expr}`) and **multiline** text.  
- Useful for building dynamic strings, HTML snippets, and tagged templates.

---

## 30. What is the **spread operator** vs **rest parameter**?  

| Feature | **Spread** (`...iterable`) | **Rest** (`...params`) |
|---------|---------------------------|------------------------|
| **Context** | Expands an iterable into individual elements (e.g., function call, array literal) | Gathers remaining arguments into an array within a function definition |
| **Typical use** | `newArr = [...oldArr, 4]` | `function fn(...args) {}` |
| **Placement** | In **expressions** | In **function signatures** |

---

## 31. What is a **WeakMap** and **WeakSet**, and how are they different from **Map** and **Set**?  

| Structure | **WeakMap** | **WeakSet** | **Map** / **Set** |
|-----------|-------------|-------------|-------------------|
| **Key type** | Objects only (weakly held) | Objects only (weakly held) | Any value (strong reference) |
| **Garbage collection** | Entries are removed when key objects become unreachable | Same as WeakMap | Entries persist until explicitly removed |
| **Iteration** | Not iterable (no `for...of`) | Not iterable | Iterable (`for...of`) |
| **Use case** | Private data storage, caching without preventing GC | Tracking object membership without preventing GC | General collection of values |

---

## 32. What is the difference between a **microtask** and a **macrotask** queue?  

| Queue | **Microtasks** | **Macrotasks** |
|------|----------------|----------------|
| **Typical sources** | Promise callbacks (`.then`, `.catch`), `queueMicrotask`, `MutationObserver` | `setTimeout`, `setInterval`, I/O, UI rendering, `setImmediate` (Node) |
| **Execution order** | Process **all** microtasks **after** the current call stack before the next macrotask | Run one macrotask, then drain microtasks, then render, then next macrotask |
| **Impact** | Allows fine‑grained async steps; can starve UI if overused | Represents larger, scheduled tasks |

---

## 33. Explain the concept of **immutability** in JavaScript.  

- **Immutability** means data structures cannot be changed after creation.  
- Instead of modifying, you **create new copies** with the desired changes (e.g., using spread, `Object.assign`, libraries like Immutable.js).  
- Benefits: easier reasoning, reliable state management (Redux), avoidance of side‑effects.

---

## 34. What is **NaN** and how do you check for it correctly?  

- `NaN` stands for **Not‑a‑Number**; it is the result of undefined or erroneous numeric operations.  
- `NaN !== NaN` (self‑inequality).  
- Correct check: `Number.isNaN(value)` (ES6) or `isNaN(value)` (coerces to number, less reliable).

---

## 35. What is the difference between **function declarations** and **function expressions**?  

| Aspect | **Function Declaration** | **Function Expression** |
|--------|--------------------------|--------------------------|
| **Hoisting** | Fully hoisted (available before definition) | Hoisted **only** as a variable (if `var`) – the function itself is not initialized |
| **Naming** | Must have a name (optional for named function expressions) | Can be anonymous or named |
| **Use cases** | Define reusable functions at the top level | Pass as arguments, IIFEs, conditional definitions |

---

## 36. What is an **IIFE** (Immediately Invoked Function Expression) and why is it used?  

- An **IIFE** is a function that runs as soon as it is defined: `(function(){ … })();`.  
- Provides **scope isolation**, avoiding polluting the global namespace, and can create private variables (pre‑ES6 modules).

---

## 37. What is the difference between **Object.freeze()** and **Object.seal()**?  

| Feature | **Object.freeze()** | **Object.seal()** |
|---------|--------------------|-------------------|
| **Can add properties?** | **No** (object is non‑extensible) | **No** (object is non‑extensible) |
| **Can delete properties?** | **No** | **No** |
| **Can modify existing properties?** | **No** (properties become read‑only) | **Yes**, if property is writable |
| **Use case** | Create truly immutable objects | Prevent addition/removal but allow value changes |

---

## 38. How does JavaScript **garbage collection** work?  

- Uses a **mark‑and‑sweep** algorithm:  
  1. **Mark** reachable objects starting from roots (global objects, call stack, closures).  
  2. **Sweep** unmarked objects, reclaiming memory.  
- Modern engines also employ **generational** and **incremental** GC to improve performance.

---

## 39. What is the difference between **Array.forEach** and **Array.map** in terms of return value?  

| Method | Return value | Typical purpose |
|--------|--------------|-----------------|
| **forEach** | `undefined` | Execute a side‑effect for each element |
| **map** | New array with transformed elements | Produce a derived array |

---

## 40. What is **optional chaining** and **nullish coalescing**?  

| Feature | **Optional chaining (`?.`)** | **Nullish coalescing (`??`)** |
|---------|-----------------------------|------------------------------|
| **Purpose** | Safely access nested properties without throwing if a reference is `null`/`undefined` | Provide a fallback **only** when left‑hand side is `null` or `undefined` (not falsy) |
| **Example** | `obj?.prop?.[0]` | `value ?? defaultValue` |

---

## 41. What is the difference between **shallow equality** and **deep equality** checks?  

| Check | **Shallow Equality** | **Deep Equality** |
|------|----------------------|-------------------|
| **What is compared** | References (for objects/arrays) or primitive values | Recursively compares all nested values |
| **Typical operators** | `===` | `JSON.stringify(a) === JSON.stringify(b)` (quick) or custom recursive function / libraries like `lodash.isEqual` |
| **Performance** | Fast | Slower (depends on depth/size) |

---

## 42. Explain how JavaScript's **single‑threaded** nature relates to **concurrency**.  

- JavaScript runs on a **single call stack**, but the **event loop** enables concurrency by offloading I/O, timers, and other tasks to the browser/Node APIs.  
- While only one piece of JavaScript executes at a time, asynchronous callbacks allow the program to **appear concurrent** without true parallel execution (unless using Web Workers).

---

## 43. What is a **polyfill** and when would you use one?  

- A **polyfill** is code (usually a library) that **adds** missing functionality to older environments, mimicking newer APIs (e.g., `Array.from`, `Promise`).  
- Use when you need to support browsers that lack native implementations of required features.

---

## 44. What is the difference between **throw** and **return** in error handling?  

| Aspect | **throw** | **return** |
|--------|-----------|------------|
| **Effect** | Raises an **exception**, unwinding the call stack until caught | Ends the function normally, optionally passing an error object |
| **Control flow** | Must be caught with `try…catch`; otherwise terminates execution | Caller must check the returned value for errors |
| **Typical use** | Unexpected or unrecoverable errors | Expected error conditions (e.g., validation) |

---

## 45. What is the difference between **synchronous XMLHttpRequest** and **fetch API**?  

| Feature | **XMLHttpRequest (XHR)** | **fetch** |
|---------|--------------------------|-----------|
| **API style** | Callback‑based (event handlers) | Promise‑based (cleaner async/await) |
| **Response handling** | Requires manual parsing (`responseText`, `responseXML`) | Returns a `Response` object with methods like `.json()`, `.text()` |
| **Streaming** | Limited | Supports streaming bodies (`ReadableStream`) |
| **CORS** | Requires explicit `withCredentials` handling | Simpler CORS handling, but no built‑in timeout (needs `AbortController`) |

---

## 46. What is a **Proxy** object in JavaScript used for?  

- A **Proxy** wraps a target object and intercepts fundamental operations (`get`, `set`, `apply`, `construct`, etc.).  
- Enables custom behavior such as validation, property tracing, virtualized objects, and API mocking.

---

## 47. Explain the difference between **composition** and **inheritance** in JavaScript.  

| Concept | **Composition** | **Inheritance** |
|---------|----------------|-----------------|
| **Idea** | Build complex objects by **combining** smaller, reusable pieces (functions/objects) | Create a **hierarchy** where a child **extends** a parent prototype |
| **Flexibility** | High; objects can change behavior at runtime | More rigid; tied to prototype chain |
| **Common pattern** | Mixins, higher‑order functions | `class extends`, prototype chaining |
| **Preferred when** | Want to avoid deep hierarchies and promote code reuse | Modeling “is‑a” relationships |

---

## 48. What are **Symbols** in JavaScript and what are they used for?  

- A **Symbol** is a unique, immutable primitive value created via `Symbol(description)`.  
- Used as **non‑enumerable property keys**, to avoid name collisions, and for well‑known symbols (e.g., `Symbol.iterator`) that customize built‑in behavior.

---

## 49. What is **tail call optimization**?  

- An engine optimization where a **function call in tail position** (the last action of a function) reuses the current stack frame instead of creating a new one.  
- Allows certain recursive algorithms to run without growing the call stack. (Supported in strict mode on some engines.)

---

## 50. What is the difference between a **pure function** and an **impure function**?  

| Property | **Pure Function** | **Impure Function** |
|----------|-------------------|---------------------|
| **Side effects** | None (does not modify external state) | May modify globals, I/O, mutate arguments |
| **Determinism** | Returns same output for same inputs | Output may vary even with same inputs |
| **Testability** | Easy to unit‑test | Harder to test due to external dependencies |

---

## 51. *(Moved to Coding Challenges – see the section at the end)*  

---

## 💻 Coding Challenges  

### 16. What is **debouncing** and **throttling**, and how do you implement them?  

**Debouncing** – ensures a function is invoked **only after** a specified period of inactivity.  
**Throttling** – guarantees a function is called **at most once** in a given time window.

```js
// Debounce
function debounce(fn, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

// Throttle
function throttle(fn, limit) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}
```

💡 **Tip:** Use `debounce` for resize/search input events; use `throttle` for scroll or mouse‑move listeners.

---

### 51. What is **memoization** and how would you implement it?  

**Memoization** caches the results of expensive function calls based on their arguments, returning the cached result on subsequent calls with the same inputs.

```js
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Example usage
const fib = memoize(function (n) {
  return n < 2 ? n : fib(n - 1) + fib(n - 2);
});
```

💡 **Tip:** For functions with **primitive** arguments, a simple `Map` works; for complex objects, consider a **WeakMap** or custom hashing.
