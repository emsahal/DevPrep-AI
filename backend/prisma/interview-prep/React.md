<!--LANG:roman-->

# React Interview Questions

## 1. What is the Virtual DOM and how does it improve performance?

**Asaan Urdu mein:**  
Virtual DOM ek halka JavaScript object hota hai jo real DOM ka snapshot rakhta hai. Jab state change hoti hai, React naya Virtual DOM tree banata hai aur purane se diff karta hai. Sirf zaroori changes real DOM par apply hote hain, isse costly direct DOM manipulations kam hoti hain aur UI fast re-render hoti hai.  

```jsx
function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      {/* React only updates the text node, not the whole div */}
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  );
}
```

---



---

## 2. What is the difference between state and props?

**Asaan Urdu mein:**  
Props parent se child ko read‑only data bhejte hain, unhein child modify nahi kar sakta. State component ke andar mutable hoti hai aur `setState` ya `useState` se update hoti hai. Props data flow ko control karte hain, jabke state component ka internal state hota hai.  

```jsx
function Parent() {
  const [count, setCount] = useState(0); // state — mutable, local
  return <Child label="Clicks" value={count} />; // props — read-only for Child
}

function Child({ label, value }) {
  // props cannot be reassigned here
  return <p>{label}: {value}</p>;
}
```

---



---

## 3. What are React hooks and why were they introduced?

**Asaan Urdu mein:**  
Hooks functions hain jo functional components ko **state**, **lifecycle**, aur **context** jaise features use karne ki ijazat dete hain. React 16.8 mein introduce hue taake class components ki zaroorat kam ho, wrapper hell (HOCs, render props) se bacha ja sake, aur reusable logic ko custom hooks ke through clean banaya ja sake.  

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return <p>{seconds}s elapsed</p>;
}
```

---



---

## 4. Explain useState and useEffect with examples.

**Asaan Urdu mein:**  
`useState` ek state variable aur uske setter ko return karta hai, jisse component re‑render hota hai jab value change hoti hai. `useEffect` side‑effects (data fetch, subscriptions, DOM updates) ko render ke baad chalata hai; dependency array se control hota hai ke effect kab dobara run ho.  

```jsx
function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;
    fetch(`/api/search?q=${query}`)
      .then(r => r.json())
      .then(setResults);
  }, [query]); // re-runs only when query changes

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>
    </div>
  );
}
```

---



---

## 5. What is the difference between useEffect and useLayoutEffect?

**Asaan Urdu mein:**  
`useEffect` asynchronous tarike se browser paint ke baad chalti hai, isliye UI briefly flash ho sakti hai. `useLayoutEffect` synchronous hoti hai—DOM mutations ke baad lekin paint se pehle—jo layout measurement ya immediate DOM changes ke liye behtar hai.  

```jsx
function Tooltip({ targetRef }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const rect = targetRef.current.getBoundingClientRect();
    setPos({ x: rect.right + 8, y: rect.top });
  }, [targetRef]); // runs before paint — no flicker

  return <div style={{ left: pos.x, top: pos.y }}>tooltip</div>;
}
```

---



---

## 6. What is the Context API and when should you use it over Redux?

**Asaan Urdu mein:**  
Context API ek simple way hai data ko component tree ke through prop‑drilling ke baghair pass karne ki. Low‑frequency, simple global state (theme, locale, auth) ke liye use hoti hai. Redux tab behtar hai jab middleware, devtools, normalized state, ya high‑frequency updates ki zaroorat ho.  

```jsx
const ThemeContext = React.createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedButton />
    </ThemeContext.Provider>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}
```

---



---

## 7. What is prop drilling and how can you avoid it?

**Asaan Urdu mein:**  
Prop drilling ka matlab hai data ko bekaar intermediate components ke through pass karna, jo us data ko use nahi karte. Isse bachne ke liye Context API, component composition, ya global state libraries (Zustand, Redux) ka istemal kiya jata hai.  

```jsx
// Before: prop drilling through UserAvatar → ProfilePic → Avatar (all pass `user`)
function UserAvatar({ user }) {
  return <ProfilePic user={user} />;
}
function ProfilePic({ user }) {
  return <Avatar user={user} />;
}
function Avatar({ user }) {
  return <img src={user.avatar} alt={user.name} />;
}

// After: composition avoids drilling
function UserAvatar({ user }) {
  return <ProfilePic><Avatar user={user} /></ProfilePic>;
}
function ProfilePic({ children }) {
  return <div className="pic">{children}</div>;
}
```

---



---

## 8. What are controlled vs uncontrolled components?

**Asaan Urdu mein:**  
Controlled component ka value React state se control hota hai; har change par state update hoti hai aur UI sync rehti hai. Uncontrolled component apna internal DOM state rakhta hai, jise `ref` se read kiya jata hai. Controlled zyada validation aur predictability deta hai, uncontrolled simple one‑time reads ke liye theek hai.  

```jsx
// Controlled
function ControlledForm() {
  const [name, setName] = useState('');
  return <input value={name} onChange={e => setName(e.target.value)} />;
}

// Uncontrolled
function UncontrolledForm() {
  const inputRef = useRef(null);
  const handleSubmit = () => alert(inputRef.current.value);
  return <input ref={inputRef} defaultValue="initial" />;
}
```

---



---

## 9. What is the purpose of keys in lists in React?

**Asaan Urdu mein:**  
Keys React ko batate hain ke list items kaunse uniquely identify hote hain, taake reconciliation ke dauran sirf changed items ko update kiya ja sake. Stable, unique keys (jaise database ID) DOM node reuse ko efficient banate hain; index as key se reordering bugs ho sakte hain.  

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li> // ✅ unique, stable key
      ))}
    </ul>
  );
}
```

---



---

## 10. What is the difference between class components and functional components?

**Asaan Urdu mein:**  
Class components ES6 classes par based hoti hain, `this.state` aur lifecycle methods (`componentDidMount`) use karte hain. Functional components sirf functions hote hain; hooks (`useState`, `useEffect`) ke through state aur side‑effects handle karte hain. Functional components kam verbose, better tree‑shaking, aur modern React ka preferred style hain.  

```jsx
// Class component
class CounterClass extends React.Component {
  state = { count: 0 };
  render() {
    return <button onClick={() => this.setState({ count: this.state.count + 1 })}>
      {this.state.count}
    </button>;
  }
}

// Functional component
function CounterFunc() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

---



---

## 11. What is the React component lifecycle (mount, update, unmount)?

**Asaan Urdu mein:**  
Mounting: constructor → render → `componentDidMount`.  
Updating: new props ya state change → render → `componentDidUpdate`.  
Unmounting: `componentWillUnmount`.  
Hooks ke saath, `useEffect` ka cleanup function mount, update, aur unmount phases ko combine karta hai.  

```jsx
useEffect(() => {
  // On mount
  const sub = api.subscribe(id, callback);
  return () => {
    // On unmount (cleanup)
    sub.unsubscribe();
  };
}, [id]); // Re-runs when id changes (update)
```

---



---

## 12. What is memoization in React (React.memo, useMemo, useCallback)?

**Asaan Urdu mein:**  
`React.memo` ek component ko wrap karta hai taake props same rehne par re‑render skip ho jaye (shallow compare). `useMemo` computed value ko cache karta hai, `useCallback` function reference ko cache karta hai. Ye sab unnecessary renders aur expensive calculations ko avoid karte hain, lekin profiling ke baad hi use karna chahiye.  

```jsx
const ExpensiveList = React.memo(({ items }) => (
  <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>
));

function App() {
  const [count, setCount] = useState(0);
  const items = useMemo(() => Array.from({ length: 1000 }, (_, i) => `Item ${i}`), []);
  const increment = useCallback(() => setCount(c => c + 1), []);

  return (
    <>
      <ExpensiveList items={items} />
      <button onClick={increment}>{count}</button>
    </>
  );
}
```

---



---

## 13. What are custom hooks and when should you create one?

**Asaan Urdu mein:**  
Custom hooks reusable stateful logic ko extract karte hain. Jab koi logic (form handling, data fetching, event listeners, subscriptions) multiple components mein repeat hoti ho, tab custom hook banana chahiye. Hook ka naam `use` se start hona chahiye aur wo dusre hooks ko call kar sakta hai.  

```jsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

// Usage
function MyComponent() {
  const width = useWindowWidth();
  return <p>Window width: {width}px</p>;
}
```

---



---

## 14. What is the difference between useMemo and useCallback?

**Asaan Urdu mein:**  
`useMemo` ek **value** (result of computation) ko cache karta hai. `useCallback` ek **function** ko cache karta hai. Internally, `useCallback(fn, deps)` bas `useMemo(() => fn, deps)` ke barabar hai.  

```jsx
function App({ items, onItemClick }) {
  // useMemo: caches computed value
  const total = useMemo(() => items.reduce((s, i) => s + i.price, 0), [items]);

  // useCallback: caches function reference
  const handleClick = useCallback((id) => {
    onItemClick(id);
  }, [onItemClick]);

  return <div>Total: ${total}</div>;
}
```

---



---

## 15. What is React Fiber and why was it introduced?

**Asaan Urdu mein:**  
React Fiber React ka naya reconciliation engine hai (React 16). Ye rendering ko **incremental** chunks mein todta hai, priority ke hisaab se schedule karta hai, aur concurrent features (Suspense, transitions) ko enable karta hai. Isse UI responsive rehti hai aur urgent vs non‑urgent updates alag handle ho sakte hain.  

```jsx
// React 18 with useTransition — made possible by Fiber's scheduling
function Search() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    // Urgent: update input
    setQuery(e.target.value);
    // Non-urgent: defer filtering large list
    startTransition(() => setSearchQuery(e.target.value));
  };

  return <input value={query} onChange={handleChange} />;
}
```

---



---

## 16. What is server-side rendering and how does React support it?

**Asaan Urdu mein:**  
SSR React components ko server par HTML string mein render karta hai, jo client ko pehle se populated markup ke roop mein milta hai. Isse SEO aur initial load performance behtar hoti hai. React `renderToString` (ya React 18 mein `renderToPipeableStream`) provide karta hai; Next.js, Remix jaise frameworks isko simplify karte hain.  

```jsx
// Server-side (Node.js with Express)
import { renderToString } from 'react-dom/server';
import App from './App';

app.get('/', (req, res) => {
  const html = renderToString(<App />);
  res.send(`
    <html><body>
      <div id="root">${html}</div>
      <script src="/bundle.js"></script>
    </body></html>
  `);
});
```

---



---

## 17. What are error boundaries in React?

**Asaan Urdu mein:**  
Error boundaries wo class components hain jo apne child tree mein JavaScript errors ko catch karte hain, unko log karte hain, aur fallback UI dikhate hain. Ye runtime errors (render, lifecycle) ko isolate karte hain, lekin event handlers, async code, ya SSR errors ko catch nahi karte. Hook version abhi nahi hai.  

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    logErrorToService(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong: {this.state.error.message}</h1>;
    }
    return this.props.children;
  }
}

<ErrorBoundary><MyComponent /></ErrorBoundary>
```

---



---

## 18. What is the difference between React portals and normal rendering?

**Asaan Urdu mein:**  
Portals component ke children ko DOM ke kisi alag node (usually body ke andar) mein render karte hain, jabke normal rendering parent hierarchy ke andar hi hoti hai. Portals modals, tooltips, dropdowns ke liye useful hain jo overflow‑hidden ya z‑index constraints se bahar nikalna chahte hain.  

```jsx
function Modal({ children }) {
  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">{children}</div>
    </div>,
    document.getElementById('modal-root')
  );
}

function App() {
  return (
    <div style={{ overflow: 'hidden' }}>
      <Modal>I render outside the parent tree!</Modal>
    </div>
  );
}
```

---



---

## 19. What is reconciliation in React?

**Asaan Urdu mein:**  
Reconciliation React ka algorithm hai jo naya Virtual DOM tree ko purane se diff karta hai aur minimal DOM mutations decide karta hai. Same type ka element update hota hai, alag type ka replace hota hai, aur keys se items ko efficiently move ya reorder kiya jata hai.  

```jsx
// When this re-renders:
function List({ items }) {
  return (
    <ul>
      {items.map(item => <li key={item.id}>{item.text}</li>)}
    </ul>
  );
}

// React reconciles by:
// 1. Comparing <ul> → same type, update in place
// 2. Using keys to match items — moves DOM nodes instead of recreating
```

---



---

## 20. What is the significance of the key prop and why shouldn't you use array index as key?

**Asaan Urdu mein:**  
Key prop list items ko uniquely identify karta hai, jis se React ko pata chalta hai ke kaunse items move, add, ya delete hue. Array index ko key ke roop mein use karna problematic hota hai jab items reorder ya delete hote hain, kyunki React galat component state ko reuse kar sakta hai. Hamesha stable ID use karein.  

```jsx
// 🚫 Bad: index as key (bug with reordering)
{todos.map((todo, i) => <TodoItem key={i} todo={todo} />)}

// ✅ Good: unique id
{todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
```

---



---

## 21. What is lazy loading in React (React.lazy and Suspense)?

**Asaan Urdu mein:**  
`React.lazy` dynamic `import()` ka use karke component ko runtime par load karta hai, jis se bundle size chhota hota hai. `Suspense` ek fallback UI (spinner, placeholder) render karta hai jab tak lazy component load nahi hota. Ye sirf default exports ke saath kaam karta hai.  

```jsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

---



---

## 22. What is the difference between synthetic events and native DOM events in React?

**Asaan Urdu mein:**  
Synthetic events React ka cross‑browser wrapper hota hai, jo native event properties ko normalize karta hai aur performance ke liye pooling use karta hai. Native events browser ke asli events hote hain. Synthetic events async use karne ke liye `event.persist()` karna padta hai, warna pool reuse ho jata hai.  

```jsx
function Handler() {
  const handleClick = (e) => {
    // e is a SyntheticEvent — normalized across browsers
    console.log(e.type, e.currentTarget);

    // ❌ This won't work — event is pooled
    // setTimeout(() => console.log(e.type), 100);

    // ✅ Call persist for async access
    e.persist();
    setTimeout(() => console.log(e.type), 100);
  };

  return <button onClick={handleClick}>Click</button>;
}
```

---



---

## 23. How do you optimize performance in a large React application?

**Asaan Urdu mein:**  
- `React.memo`, `useMemo`, `useCallback` se unnecessary renders avoid karein.  
- `React.lazy` aur code‑splitting se bundle size kam karein.  
- Long lists ke liye virtualization (e.g., `react-virtual`).  
- State ko sahi jagah lift karein, frequent updates ko isolate karein.  
- `useTransition` se non‑urgent updates defer karein.  
- React DevTools se profiling karte hue bottlenecks identify karein.  

```jsx
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(vItem => (
          <div
            key={vItem.key}
            style={{
              position: 'absolute',
              top: 0,
              transform: `translateY(${vItem.start}px)`,
            }}
          >
            {items[vItem.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---



---

## 24. What is the difference between useReducer and useState?

**Asaan Urdu mein:**  
`useState` simple, independent state values ke liye best hai. `useReducer` complex state logic (multiple sub‑values, actions) ke liye use hota hai, jahan next state previous state par depend karta hai. Reducer function se state transitions predictable aur testable ho jate hain.  

```jsx
// useState — simple
const [count, setCount] = useState(0);

// useReducer — complex state logic
const initialState = { count: 0, step: 1 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { ...state, count: state.count + state.step };
    case 'decrement': return { ...state, count: state.count - state.step };
    case 'setStep':   return { ...state, step: action.payload };
    default: return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <input type="number" value={state.step}
        onChange={e => dispatch({ type: 'setStep', payload: +e.target.value })} />
    </>
  );
}
```

---



---

## 25. What is React StrictMode and what does it do?

**Asaan Urdu mein:**  
`StrictMode` development‑only wrapper hai jo potential problems ko highlight karta hai: double rendering of components/effects, deprecated APIs warnings, unsafe lifecycle checks. Ye production build ko affect nahi karta.  

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// In development, effects run twice to help find missing cleanup:
useEffect(() => {
  console.log('mount'); // runs twice in StrictMode
  return () => console.log('cleanup');
}, []);
```

---



---

## 26. What is the difference between forwardRef and normal ref usage?

**Asaan Urdu mein:**  
Normal `ref` directly DOM node ya class instance ko reference karta hai. Functional components ke paas instance nahi hota, isliye `forwardRef` parent ko child ke inner DOM node tak pahunch deta hai. Reusable UI components (custom inputs) ke liye `forwardRef` zaroori hota hai.  

```jsx
// Without forwardRef — ref doesn't work on function components
function FancyInput(props) {
  return <input {...props} />;
}

// With forwardRef
const FancyInput = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});

function Parent() {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus(); // works!
  }, []);
  return <FancyInput ref={inputRef} />;
}
```

---



---

## 27. What are higher-order components (HOCs) and how do they compare to hooks?

**Asaan Urdu mein:**  
HOC ek function hota hai jo component ko argument ke roop mein leta hai aur enhanced component return karta hai. Hooks ke aane se stateful logic ko reuse karna HOC ki jagah hooks se asaan ho gaya; hooks wrapper hell ko avoid karte hain aur composition ko simple banate hain.  

```jsx
// HOC pattern
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const user = useAuth(); // still uses hooks internally
    return <WrappedComponent {...props} user={user} />;
  };
}

// Hook equivalent — cleaner
function ProfilePage() {
  const user = useAuth();
  return <Profile user={user} />;
}
```

---



---

## 28. What is the render props pattern?

**Asaan Urdu mein:**  
Render props ek pattern hai jahan component ek function (usually `children` ya specific prop) accept karta hai jo JSX return karta hai. Parent ko rendering control milti hai, jabke child state/logic manage karta hai. Hooks ke aane se ye pattern kam use hota hai.  

```jsx
// Render props pattern
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const handleMove = (e) => setPos({ x: e.clientX, y: e.clientY });
  return <div onMouseMove={handleMove}>{render(pos)}</div>;
}

// Usage
<MouseTracker render={({ x, y }) => <p>Mouse: {x}, {y}</p>} />

// Modern hook equivalent
function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return pos;
}
```

---



---

## 29. How does React batch state updates?

**Asaan Urdu mein:**  
React ek synchronous event handler ke andar multiple state updates ko ek single re‑render mein batch karta hai. React 17 tak ye sirf React events ke andar hota tha; React 18 ne automatic batching introduce kiya, jo promises, timeouts, native events ko bhi batch karta hai. `flushSync` se manual flush bhi possible hai.  

```jsx
function BatchExample() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const handleClick = () => {
    // Both updates are batched — only one re-render
    setA(a + 1);
    setB(b + 1);
  };

  // To flush updates synchronously (React 18):
  const handleClickFlush = () => {
    ReactDOM.flushSync(() => setA(c => c + 1)); // forces render
    ReactDOM.flushSync(() => setB(c => c + 1)); // another render
  };

  return <button onClick={handleClick}>a: {a}, b: {b}</button>;
}
```

---



---

## 30. What is the difference between React 18's concurrent rendering and legacy rendering?

**Asaan Urdu mein:**  
Legacy rendering synchronous hoti hai—render start hone ke baad main thread block ho jata hai. Concurrent rendering React 18 mein work ko pause, resume, ya abandon kiya ja sakta hai; isse `useTransition`, `useDeferredValue`, aur automatic batching possible hote hain. Opt‑in ke liye `createRoot` use hota hai.  

```jsx
// Legacy (React 17)
ReactDOM.render(<App />, document.getElementById('root'));

// Concurrent (React 18)
createRoot(document.getElementById('root')).render(<App />);

// useTransition — mark non-urgent state update
function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    setQuery(e.target.value); // urgent: update input
    startTransition(() => {
      // non-urgent: can be paused if urgent work comes in
      setResults(filterExpensive(e.target.value));
    });
  };

  return <div>{isPending && <Spinner />}<Results data={results} /></div>;
}
```

---



---

## 31. What is hydration in the context of React SSR?

**Asaan Urdu mein:**  
Hydration wo process hai jahan client‑side React server‑rendered HTML ke upar event listeners attach karta hai aur Virtual DOM ko us HTML ke saath sync karta hai. Server aur client ke markup ka exact match hona zaroori hai; mismatch hone par hydration error aata hai aur React fallback to client rendering karta hai.  

```jsx
// Server: renders HTML
const html = renderToString(<App />);

// Client: hydrates instead of rendering from scratch
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
// React attaches event listeners to existing server HTML
```

---



---

## 32. What is the purpose of useId in React 18?

**Asaan Urdu mein:**  
`useId` stable, unique IDs generate karta hai jo accessibility attributes (`aria-`, `htmlFor`) ke liye use hoti hain. SSR ke dauran bhi same IDs generate hoti hain, isliye hydration mismatches nahi hote. Random IDs ki jagah ye deterministic IDs provide karta hai.  

```jsx
function EmailField() {
  const id = useId(); // generates unique ID like :r1:

  return (
    <div>
      <label htmlFor={id}>Email</label>
      <input id={id} type="email" />
    </div>
  );
}

// Always produces the same ID on server and client for SSR hydration.
```

---



---

## 33. What are compound components in React?

**Asaan Urdu mein:**  
Compound components aise groups hote hain jo implicit state share karte hain (usually Context) bina explicit props pass kiye. Jaise HTML ka `<select>` + `<option>` pattern. Parent component state provide karta hai, aur children us state ko consume karte hain.  

```jsx
const TabsContext = createContext();

function Tabs({ defaultIndex, children }) {
  const [active, setActive] = useState(defaultIndex);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      {children}
    </TabsContext.Provider>
  );
}

function Tab({ index, children }) {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button className={active === index ? 'active' : ''}
      onClick={() => setActive(index)}>
      {children}
    </button>
  );
}

function TabPanel({ index, children }) {
  const { active } = useContext(TabsContext);
  return active === index ? <div>{children}</div> : null;
}

// Usage
<Tabs defaultIndex={0}>
  <Tab index={0}>First</Tab>
  <Tab index={1}>Second</Tab>
  <TabPanel index={0}>Content 1</TabPanel>
  <TabPanel index={1}>Content 2</TabPanel>
</Tabs>
```

---



---

## 34. What is the difference between useEffect cleanup and componentWillUnmount?

**Asaan Urdu mein:**  
`useEffect` ka cleanup function har re‑render (effect dobara run hone se pehle) aur component unmount hone par execute hota hai. `componentWillUnmount` sirf unmount ke waqt chalta hai. Isliye `useEffect` ek hi place se mount, update, aur unmount logic ko handle karta hai.  

```jsx
// Class: separate lifecycle methods
componentDidMount() { sub.subscribe(id, cb); }
componentDidUpdate(prevProps) {
  if (prevProps.id !== this.props.id) {
    sub.unsubscribe();
    sub.subscribe(this.props.id, cb);
  }
}
componentWillUnmount() { sub.unsubscribe(); }

// Function: one effect handles all three
useEffect(() => {
  sub.subscribe(id, cb);      // mount + each update
  return () => sub.unsubscribe(); // cleanup before next effect + unmount
}, [id]);
```

---



---

## 35. How do you handle side effects and data fetching in React functional components?

**Asaan Urdu mein:**  
Side effects (data fetch, subscriptions) ko `useEffect` ke andar rakhen. AbortController se stale requests cancel karen. Production apps ke liye TanStack Query ya SWR jaise libraries use karen jo caching, revalidation, aur deduplication handle karti hain. Custom hooks se fetching logic reuse hoti hai.  

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setError(null);

    fetch(url, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error('Fetch failed');
        return r.json();
      })
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') setError(err);
      });

    return () => controller.abort(); // cleanup stale requests
  }, [url]);

  return { data, error };
}

function UserProfile({ userId }) {
  const { data, error } = useFetch(`/api/users/${userId}`);
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>Loading...</p>;
  return <p>{data.name}</p>;
}
```

---



---

## 36. What is the difference between React.PureComponent and React.Component?

**Asaan Urdu mein:**  
`React.Component` har parent re‑render par apna render method chalata hai. `React.PureComponent` automatically `shouldComponentUpdate` implement karta hai with shallow prop/state comparison, isliye unchanged props/state par render skip hota hai. Functional equivalent `React.memo` hai.  

```jsx
// Class: always re-renders
class List extends React.Component {
  render() { return <ul>{this.props.items.map(i => <li>{i}</li>)}</ul>; }
}

// PureComponent: skips re-render if props haven't changed (shallow compare)
class PureList extends React.PureComponent {
  render() { return <ul>{this.props.items.map(i => <li>{i}</li>)}</ul>; }
}

// Functional equivalent
const MemoizedList = React.memo(({ items }) => (
  <ul>{items.map(i => <li>{i}</li>)}</ul>
));
```

---



---

## 37. What is the significance of the dependency array in useEffect?

**Asaan Urdu mein:**  
Dependency array React ko batata hai ke effect kab dobara run karna hai. `[]` sirf mount/unmount par chalti hai. `[a, b]` tab run hoti hai jab `a` ya `b` change hoti hain. Array na dene se effect har render ke baad chalti hai, jo performance ya stale closures ka sabab ban sakta hai.  

```jsx
function Timer({ step }) {
  const [count, setCount] = useState(0);

  // ❌ Missing dep: stale closure over `step`
  useEffect(() => {
    const id = setInterval(() => setCount(c => c + step), 1000);
    return () => clearInterval(id);
  }, []); // `step` is missing — always uses initial value

  // ✅ Correct deps
  useEffect(() => {
    const id = setInterval(() => setCount(c => c + step), 1000);
    return () => clearInterval(id);
  }, [step]);

  return <p>{count}</p>;
}
```

---



---

## 38. What are React Server Components and how do they differ from client components?

**



---

## 39. How does React handle conditional rendering?

**Asaan Urdu mein:**  
React conditional rendering ke liye normal JavaScript ke conditionals ka istemal karta hai—ternary operator, `&&`, if/else ya switch statements. JSX sirf JavaScript hi hota hai, is liye koi khaas syntax nahi hota, bas koi bhi expression jo value return kare, wo render ho jata hai. `&&` ka use bohat common hai lekin `0`, `NaN` ya `''` jaisi falsy values galti se UI mein appear ho sakti hain. Is liye hamesha condition ko dhyan se likhna chahiye, warna unwanted output mil sakta hai. Complex logic ke liye IIFE ya separate functions bhi use ki ja sakti hain.

```jsx
function Greeting({ user, notifications }) {
  return (
    <div>
      {/* Ternary */}
      {user ? <p>Welcome, {user.name}!</p> : <button>Login</button>}

      {/* Logical AND — careful with falsy values */}
      {notifications.length > 0 && (
        <p>{notifications.length} unread</p>
      )}

      {/* IIFE for complex logic */}
      {(() => {
        switch (user.role) {
          case 'admin': return <AdminPanel />;
          case 'editor': return <EditorPanel />;
          default: return <ReaderView />;
        }
      })()}
    </div>
  );
}
```

---



---

## 40. What is the difference between shallow rendering and full DOM rendering in testing?

**Asaan Urdu mein:**  
Shallow rendering component ko sirf ek level tak render karta hai, is se child components mount nahi hote aur test fast aur isolated rehta hai. Full DOM rendering, jaise ke `render` React Testing Library se, poora component tree banata hai aur ek virtual DOM (jsdom) ki zaroorat hoti hai. Shallow rendering zyada tar Enzyme ke legacy mode mein use hoti thi, jabke aaj kal React Testing Library ke saath full rendering preferred hai. Full rendering se UI behavior, events aur side‑effects ko as‑real‑as‑possible test kiya ja sakta hai. Dono approaches ka apna use‑case hota hai, lekin modern projects mein full DOM ko zyada tarah se adopt kiya jata hai.

```jsx
// Shallow rendering (Enzyme — legacy)
import { shallow } from 'enzyme';
const wrapper = shallow(<MyComponent />);
console.log(wrapper.find('ChildComponent').length); // 1 — but Child isn't rendered

// Full DOM rendering (React Testing Library — modern)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('increments count', async () => {
  render(<Counter />);
  await userEvent.click(screen.getByText('+'));
  expect(screen.getByText('1')).toBeInTheDocument();
});
```

<!--LANG:english-->



# React Interview Questions

## 1. What is the Virtual DOM and how does it improve performance?

The Virtual DOM is a lightweight JavaScript representation of the real DOM. When state changes, React creates a new Virtual DOM tree, diffs it against the previous one (reconciliation), and applies only the minimal necessary updates to the real DOM. This batched approach avoids costly direct DOM manipulations.

```jsx
function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      {/* React only updates the text node, not the whole div */}
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  );
}
```

---

## 2. What is the difference between state and props?

Props (properties) are read-only data passed from a parent component to a child. State is internal, mutable data managed within a component. Props cannot be modified by the child, while state can be updated using setState or useState.

```jsx
function Parent() {
  const [count, setCount] = useState(0); // state — mutable, local
  return <Child label="Clicks" value={count} />; // props — read-only for Child
}

function Child({ label, value }) {
  // props cannot be reassigned here
  return <p>{label}: {value}</p>;
}
```

---

## 3. What are React hooks and why were they introduced?

Hooks are functions that let you use React features (state, lifecycle, context) in functional components. They were introduced in React 16.8 to replace class components, eliminate wrapper hell from HOCs/render props, and make logic reuse cleaner through custom hooks.

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return <p>{seconds}s elapsed</p>;
}
```

---

## 4. Explain useState and useEffect with examples.

useState declares state with a getter and setter. useEffect runs side effects after render — data fetching, subscriptions, or DOM updates. The dependency array controls when the effect re-runs.

```jsx
function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;
    fetch(`/api/search?q=${query}`)
      .then(r => r.json())
      .then(setResults);
  }, [query]); // re-runs only when query changes

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>
    </div>
  );
}
```

---

## 5. What is the difference between useEffect and useLayoutEffect?

useEffect fires asynchronously after the browser paints, so the screen may flash briefly. useLayoutEffect fires synchronously after DOM mutations but before the browser paints, making it suitable for measuring layout or applying DOM mutations that must be visible on the same frame.

```jsx
function Tooltip({ targetRef }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const rect = targetRef.current.getBoundingClientRect();
    setPos({ x: rect.right + 8, y: rect.top });
  }, [targetRef]); // runs before paint — no flicker

  return <div style={{ left: pos.x, top: pos.y }}>tooltip</div>;
}
```

---

## 6. What is the Context API and when should you use it over Redux?

Context API provides a way to pass data through the component tree without prop drilling. It's best for low-frequency, low-complexity global state like theme, locale, or auth. Redux is better when you need middleware, devtools, normalized state, or high-frequency updates across many consumers.

```jsx
const ThemeContext = React.createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedButton />
    </ThemeContext.Provider>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}
```

---

## 7. What is prop drilling and how can you avoid it?

Prop drilling is passing data through multiple intermediate components that don't need it, just to reach a deeply nested child. You can avoid it with Context API, component composition (lifting children up), or a global state library like Zustand or Redux.

```jsx
// Before: prop drilling through UserAvatar → ProfilePic → Avatar (all pass `user`)
function UserAvatar({ user }) {
  return <ProfilePic user={user} />;
}
function ProfilePic({ user }) {
  return <Avatar user={user} />;
}
function Avatar({ user }) {
  return <img src={user.avatar} alt={user.name} />;
}

// After: composition avoids drilling
function UserAvatar({ user }) {
  return <ProfilePic><Avatar user={user} /></ProfilePic>;
}
function ProfilePic({ children }) {
  return <div className="pic">{children}</div>;
}
```

---

## 8. What are controlled vs uncontrolled components?

Controlled components have their value managed by React state — every state change updates the input value. Uncontrolled components store their own internal DOM state, accessed via a ref. Controlled gives you full control and validation; uncontrolled is simpler for one-off reads.

```jsx
// Controlled
function ControlledForm() {
  const [name, setName] = useState('');
  return <input value={name} onChange={e => setName(e.target.value)} />;
}

// Uncontrolled
function UncontrolledForm() {
  const inputRef = useRef(null);
  const handleSubmit = () => alert(inputRef.current.value);
  return <input ref={inputRef} defaultValue="initial" />;
}
```

---

## 9. What is the purpose of keys in lists in React?

Keys help React identify which items have changed, been added, or removed during reconciliation. A stable, unique key (like an ID) lets React reuse DOM nodes efficiently. Without keys, React may re-render all items; using array index as a key can cause bugs with reordering.

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li> // ✅ unique, stable key
      ))}
    </ul>
  );
}
```

---

## 10. What is the difference between class components and functional components?

Class components use ES6 classes, manage state with `this.state` / `this.setState`, and handle lifecycle via methods like `componentDidMount`. Functional components are plain functions, use hooks for state and effects, are less verbose, and have better tree-shaking and minification.

```jsx
// Class component
class CounterClass extends React.Component {
  state = { count: 0 };
  render() {
    return <button onClick={() => this.setState({ count: this.state.count + 1 })}>
      {this.state.count}
    </button>;
  }
}

// Functional component
function CounterFunc() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

---

## 11. What is the React component lifecycle (mount, update, unmount)?

Mounting: constructor → render → componentDidMount. Updating: new props/setState → render → componentDidUpdate. Unmounting: componentWillUnmount. With hooks, useEffect combines mount/update/unmount behavior through its dependency array and cleanup function.

```jsx
useEffect(() => {
  // On mount
  const sub = api.subscribe(id, callback);
  return () => {
    // On unmount (cleanup)
    sub.unsubscribe();
  };
}, [id]); // Re-runs when id changes (update)
```

---

## 12. What is memoization in React (React.memo, useMemo, useCallback)?

React.memo wraps a component to skip re-rendering if props haven't changed (shallow compare). useMemo caches a computed value between renders. useCallback caches a function reference. All three avoid wasted work but should only be used when profiling shows a bottleneck.

```jsx
const ExpensiveList = React.memo(({ items }) => (
  <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>
));

function App() {
  const [count, setCount] = useState(0);
  const items = useMemo(() => Array.from({ length: 1000 }, (_, i) => `Item ${i}`), []);
  const increment = useCallback(() => setCount(c => c + 1), []);

  return (
    <>
      <ExpensiveList items={items} />
      <button onClick={increment}>{count}</button>
    </>
  );
}
```

---

## 13. What are custom hooks and when should you create one?

Custom hooks extract reusable stateful logic from components. Create one when you find the same logic repeated across components — form handling, data fetching, event listeners, or subscriptions. Custom hooks start with `use` and can call other hooks.

```jsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

// Usage
function MyComponent() {
  const width = useWindowWidth();
  return <p>Window width: {width}px</p>;
}
```

---

## 14. What is the difference between useMemo and useCallback?

useMemo caches the result of a computation (returns a value). useCallback caches a function definition (returns a function). Internally, `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`.

```jsx
function App({ items, onItemClick }) {
  // useMemo: caches computed value
  const total = useMemo(() => items.reduce((s, i) => s + i.price, 0), [items]);

  // useCallback: caches function reference
  const handleClick = useCallback((id) => {
    onItemClick(id);
  }, [onItemClick]);

  return <div>Total: ${total}</div>;
}
```

---

## 15. What is React Fiber and why was it introduced?

React Fiber is the reimplementation of React's reconciliation engine, introduced in React 16. It enables incremental rendering — breaking work into chunks and spreading it across multiple frames based on priority. This allows concurrent features like Suspense, transitions, and urgent vs. non-urgent updates to coexist smoothly.

```jsx
// React 18 with useTransition — made possible by Fiber's scheduling
function Search() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    // Urgent: update input
    setQuery(e.target.value);
    // Non-urgent: defer filtering large list
    startTransition(() => setSearchQuery(e.target.value));
  };

  return <input value={query} onChange={handleChange} />;
}
```

---

## 16. What is server-side rendering and how does React support it?

SSR renders React components to HTML on the server, sending fully populated HTML to the client. This improves SEO and perceived performance. React supports SSR via `renderToString` (or `renderToPipeableStream` in React 18). Next.js and Remix provide frameworks built on top of this.

```jsx
// Server-side (Node.js with Express)
import { renderToString } from 'react-dom/server';
import App from './App';

app.get('/', (req, res) => {
  const html = renderToString(<App />);
  res.send(`
    <html><body>
      <div id="root">${html}</div>
      <script src="/bundle.js"></script>
    </body></html>
  `);
});
```

---

## 17. What are error boundaries in React?

Error boundaries are class components that catch JavaScript errors in their child component tree, log them, and display a fallback UI. They do not catch errors in event handlers, async code, or SSR. There is no hook equivalent yet — you must use `componentDidCatch` and `getDerivedStateFromError`.

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    logErrorToService(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong: {this.state.error.message}</h1>;
    }
    return this.props.children;
  }
}

<ErrorBoundary><MyComponent /></ErrorBoundary>
```

---

## 18. What is the difference between React portals and normal rendering?

Portals render a component's children into a different DOM node outside the parent hierarchy, while normal rendering nests within the parent DOM. Portals are useful for modals, tooltips, and dropdowns that need to break out of overflow:hidden or z-index stacking contexts.

```jsx
function Modal({ children }) {
  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">{children}</div>
    </div>,
    document.getElementById('modal-root')
  );
}

function App() {
  return (
    <div style={{ overflow: 'hidden' }}>
      <Modal>I render outside the parent tree!</Modal>
    </div>
  );
}
```

---

## 19. What is reconciliation in React?

Reconciliation is React's algorithm that diffs the new Virtual DOM tree with the previous one and determines the minimal set of DOM mutations. It uses heuristics: same type = update in place; different type = rebuild; keys = move instead of destroy/create.

```jsx
// When this re-renders:
function List({ items }) {
  return (
    <ul>
      {items.map(item => <li key={item.id}>{item.text}</li>)}
    </ul>
  );
}

// React reconciles by:
// 1. Comparing <ul> → same type, update in place
// 2. Using keys to match items — moves DOM nodes instead of recreating
```

---

## 20. What is the significance of the key prop and why shouldn't you use array index as key?

The key prop uniquely identifies list items for reconciliation. Using array index as a key when items can be reordered, added, or removed leads to bugs — React may reuse component state for the wrong item. Use a stable, unique identifier like a database ID.

```jsx
// 🚫 Bad: index as key (bug with reordering)
{todos.map((todo, i) => <TodoItem key={i} todo={todo} />)}

// ✅ Good: unique id
{todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}

// When removing the first item with index keys, React reuses
// the component instance and its state for what is now the wrong todo.
```

---

## 21. What is lazy loading in React (React.lazy and Suspense)?

React.lazy enables dynamic import of components at runtime, splitting the bundle. Suspense renders a fallback while the lazy component loads. This reduces the initial bundle size. React.lazy only works with default exports.

```jsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

---

## 22. What is the difference between synthetic events and native DOM events in React?

Synthetic events are React's cross-browser wrapper around native events. They normalize properties across browsers and are pooled (reused) for performance. Native events are the standard DOM events. Synthetic events cannot be used asynchronously unless `event.persist()` is called.

```jsx
function Handler() {
  const handleClick = (e) => {
    // e is a SyntheticEvent — normalized across browsers
    console.log(e.type, e.currentTarget);

    // ❌ This won't work — event is pooled
    // setTimeout(() => console.log(e.type), 100);

    // ✅ Call persist for async access
    e.persist();
    setTimeout(() => console.log(e.type), 100);
  };

  return <button onClick={handleClick}>Click</button>;
}
```

---

## 23. How do you optimize performance in a large React application?

Key optimizations: use `React.memo` and `useMemo`/`useCallback` for expensive computations, implement code splitting with `React.lazy`, virtualize long lists, avoid unnecessary re-renders by lifting state down, use `useTransition` for non-urgent updates, and profile with React DevTools.

```jsx
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(vItem => (
          <div
            key={vItem.key}
            style={{
              position: 'absolute',
              top: 0,
              transform: `translateY(${vItem.start}px)`,
            }}
          >
            {items[vItem.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 24. What is the difference between useReducer and useState?

useState is best for simple, independent state values. useReducer is better for complex state logic involving multiple sub-values or when the next state depends on the previous state in non-trivial ways. useReducer also makes state changes more predictable and testable with a reducer function.

```jsx
// useState — simple
const [count, setCount] = useState(0);

// useReducer — complex state logic
const initialState = { count: 0, step: 1 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { ...state, count: state.count + state.step };
    case 'decrement': return { ...state, count: state.count - state.step };
    case 'setStep':   return { ...state, step: action.payload };
    default: return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <input type="number" value={state.step}
        onChange={e => dispatch({ type: 'setStep', payload: +e.target.value })} />
    </>
  );
}
```

---

## 25. What is React StrictMode and what does it do?

StrictMode is a development-only wrapper that highlights potential problems. It double-invokes renders, effects, and constructors to detect impure logic, warns about deprecated APIs, and checks for unsafe lifecycle methods. It does not affect production builds.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// In development, effects run twice to help find missing cleanup:
useEffect(() => {
  console.log('mount'); // runs twice in StrictMode
  return () => console.log('cleanup');
}, []);
```

---

## 26. What is the difference between forwardRef and normal ref usage?

A normal ref directly accesses a DOM node or class component instance. forwardRef lets parent components pass a ref through to a child's DOM node, which is necessary for functional components since they don't have instances. It's used for reusable components like inputs or buttons.

```jsx
// Without forwardRef — ref doesn't work on function components
function FancyInput(props) {
  return <input {...props} />;
}

// With forwardRef
const FancyInput = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});

function Parent() {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus(); // works!
  }, []);
  return <FancyInput ref={inputRef} />;
}
```

---

## 27. What are higher-order components (HOCs) and how do they compare to hooks?

An HOC is a function that takes a component and returns a new component with enhanced behavior. Before hooks, HOCs were the main pattern for reusing stateful logic. Hooks are now preferred because they avoid wrapper hell, are easier to compose, and don't have naming collisions.

```jsx
// HOC pattern
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const user = useAuth(); // still uses hooks internally
    return <WrappedComponent {...props} user={user} />;
  };
}

// Hook equivalent — cleaner
function ProfilePage() {
  const user = useAuth();
  return <Profile user={user} />;
}
```

---

## 28. What is the render props pattern?

Render props is a pattern where a component accepts a function as its children (or a prop) that returns JSX, giving the parent control over rendering while the component manages the state/logic. Like HOCs, this pattern has largely been replaced by hooks.

```jsx
// Render props pattern
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const handleMove = (e) => setPos({ x: e.clientX, y: e.clientY });
  return <div onMouseMove={handleMove}>{render(pos)}</div>;
}

// Usage
<MouseTracker render={({ x, y }) => <p>Mouse: {x}, {y}</p>} />

// Modern hook equivalent
function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return pos;
}
```

---

## 29. How does React batch state updates?

React batches multiple state updates within the same synchronous event handler into a single re-render for performance. In React 17 and earlier, batching only happened inside React event handlers. React 18 introduced automatic batching for all updates, including promises, timeouts, and native events.

```jsx
function BatchExample() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const handleClick = () => {
    // Both updates are batched — only one re-render
    setA(a + 1);
    setB(b + 1);
  };

  // To flush updates synchronously (React 18):
  const handleClickFlush = () => {
    ReactDOM.flushSync(() => setA(c => c + 1)); // forces render
    ReactDOM.flushSync(() => setB(c => c + 1)); // another render
  };

  return <button onClick={handleClick}>a: {a}, b: {b}</button>;
}
```

---

## 30. What is the difference between React 18's concurrent rendering and legacy rendering?

Legacy rendering is synchronous — once a render starts, it blocks the main thread until done. Concurrent rendering in React 18 can pause, resume, or abandon work. It enables `useTransition` for marking non-urgent updates, `useDeferredValue`, and automatic batching. Concurrent rendering is opt-in via `createRoot`.

```jsx
// Legacy (React 17)
ReactDOM.render(<App />, document.getElementById('root'));

// Concurrent (React 18)
createRoot(document.getElementById('root')).render(<App />);

// useTransition — mark non-urgent state update
function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    setQuery(e.target.value); // urgent: update input
    startTransition(() => {
      // non-urgent: can be paused if urgent work comes in
      setResults(filterExpensive(e.target.value));
    });
  };

  return <div>{isPending && <Spinner />}<Results data={results} /></div>;
}
```

---

## 31. What is hydration in the context of React SSR?

Hydration is the process where React attaches event listeners and reconciles the client-side Virtual DOM with the server-rendered HTML. React expects the initial HTML structure to match exactly what was rendered on the server. Mismatches cause hydration errors and React falls back to client-side rendering.

```jsx
// Server: renders HTML
const html = renderToString(<App />);

// Client: hydrates instead of rendering from scratch
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
// React attaches event listeners to existing server HTML
```

---

## 32. What is the purpose of useId in React 18?

useId generates unique, stable IDs for accessibility attributes (like `aria-describedby` or `htmlFor`). It's critical for SSR because it produces consistent IDs across server and client, preventing hydration mismatches. Unlike random IDs, useId is guaranteed to be unique within a tree.

```jsx
function EmailField() {
  const id = useId(); // generates unique ID like :r1:

  return (
    <div>
      <label htmlFor={id}>Email</label>
      <input id={id} type="email" />
    </div>
  );
}

// Always produces the same ID on server and client for SSR hydration.
```

---

## 33. What are compound components in React?

Compound components are components that work together implicitly sharing state via Context or cloning. Think `<select>` and `<option>` in HTML — they share state without explicit props. A common pattern is using `React.Children.map` or Context to pass internal state to children.

```jsx
const TabsContext = createContext();

function Tabs({ defaultIndex, children }) {
  const [active, setActive] = useState(defaultIndex);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      {children}
    </TabsContext.Provider>
  );
}

function Tab({ index, children }) {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button className={active === index ? 'active' : ''}
      onClick={() => setActive(index)}>
      {children}
    </button>
  );
}

function TabPanel({ index, children }) {
  const { active } = useContext(TabsContext);
  return active === index ? <div>{children}</div> : null;
}

// Usage
<Tabs defaultIndex={0}>
  <Tab index={0}>First</Tab>
  <Tab index={1}>Second</Tab>
  <TabPanel index={0}>Content 1</TabPanel>
  <TabPanel index={1}>Content 2</TabPanel>
</Tabs>
```

---

## 34. What is the difference between useEffect cleanup and componentWillUnmount?

useEffect's cleanup function runs on every re-render (before the effect re-runs) AND on unmount. componentWillUnmount only runs once on unmount. The cleanup replaces both `componentWillUnmount` and the pre-update phase of `componentDidUpdate`.

```jsx
// Class: separate lifecycle methods
componentDidMount() { sub.subscribe(id, cb); }
componentDidUpdate(prevProps) {
  if (prevProps.id !== this.props.id) {
    sub.unsubscribe();
    sub.subscribe(this.props.id, cb);
  }
}
componentWillUnmount() { sub.unsubscribe(); }

// Function: one effect handles all three
useEffect(() => {
  sub.subscribe(id, cb);      // mount + each update
  return () => sub.unsubscribe(); // cleanup before next effect + unmount
}, [id]);
```

---

## 35. How do you handle side effects and data fetching in React functional components?

Data fetching is typically done inside useEffect with cleanups for aborting stale requests. For production, use libraries like TanStack Query or SWR that handle caching, revalidation, and deduplication. Custom hooks encapsulate fetching logic for reuse.

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setError(null);

    fetch(url, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error('Fetch failed');
        return r.json();
      })
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') setError(err);
      });

    return () => controller.abort(); // cleanup stale requests
  }, [url]);

  return { data, error };
}

function UserProfile({ userId }) {
  const { data, error } = useFetch(`/api/users/${userId}`);
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>Loading...</p>;
  return <p>{data.name}</p>;
}
```

---

## 36. What is the difference between React.PureComponent and React.Component?

React.Component always re-renders when its parent re-renders. React.PureComponent implements `shouldComponentUpdate` with a shallow prop and state comparison, skipping re-renders if nothing changed. The functional equivalent is `React.memo`. PureComponent only works with class components.

```jsx
// Class: always re-renders
class List extends React.Component {
  render() { return <ul>{this.props.items.map(i => <li>{i}</li>)}</ul>; }
}

// PureComponent: skips re-render if props haven't changed (shallow compare)
class PureList extends React.PureComponent {
  render() { return <ul>{this.props.items.map(i => <li>{i}</li>)}</ul>; }
}

// Functional equivalent
const MemoizedList = React.memo(({ items }) => (
  <ul>{items.map(i => <li>{i}</li>)}</ul>
));
```

---

## 37. What is the significance of the dependency array in useEffect?

The dependency array tells React when to re-run the effect. An empty array `[]` runs only on mount/unmount. With values `[a, b]`, the effect re-runs when `a` or `b` change. Omitting the array runs the effect after every render. Incorrect deps cause stale closures or missing updates.

```jsx
function Timer({ step }) {
  const [count, setCount] = useState(0);

  // ❌ Missing dep: stale closure over `step`
  useEffect(() => {
    const id = setInterval(() => setCount(c => c + step), 1000);
    return () => clearInterval(id);
  }, []); // `step` is missing — always uses initial value

  // ✅ Correct deps
  useEffect(() => {
    const id = setInterval(() => setCount(c => c + step), 1000);
    return () => clearInterval(id);
  }, [step]);

  return <p>{count}</p>;
}
```

---

## 38. What are React Server Components and how do they differ from client components?

React Server Components (RSC) render exclusively on the server, sending only the resulting HTML to the client. They can access databases and files directly, have zero bundle size impact, and cannot use state, effects, or event handlers. Client components (marked with `'use client'`) run in the browser and can use all React features.

```jsx
// ServerComponent.js — no 'use client' directive
// Runs on server, has no JS bundle
export default async function Post({ id }) {
  const post = await db.posts.find(id); // direct DB access
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}

// ClientComponent.js — 'use client' directive
'use client';
export default function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>
    {liked ? 'Unlike' : 'Like'}
  </button>;
}
```

---

## 39. How does React handle conditional rendering?

React uses regular JavaScript conditionals: ternary operators, `&&`, if/else, or switch statements. Nothing special in the framework — JSX is just JavaScript, so any expression that returns a value works. `&&` is common but falsy values like `0` or `NaN` render unintentionally.

```jsx
function Greeting({ user, notifications }) {
  return (
    <div>
      {/* Ternary */}
      {user ? <p>Welcome, {user.name}!</p> : <button>Login</button>}

      {/* Logical AND — careful with falsy values */}
      {notifications.length > 0 && (
        <p>{notifications.length} unread</p>
      )}

      {/* IIFE for complex logic */}
      {(() => {
        switch (user.role) {
          case 'admin': return <AdminPanel />;
          case 'editor': return <EditorPanel />;
          default: return <ReaderView />;
        }
      })()}
    </div>
  );
}
```

---

## 40. What is the difference between shallow rendering and full DOM rendering in testing?

Shallow rendering renders a component one level deep, without mounting children. It's fast and isolates the component under test. Full DOM rendering (e.g., using `render` from React Testing Library) renders the full component tree and requires a DOM environment (jsdom). Full rendering is preferred for testing behavior, while shallow was popular with Enzyme.

```jsx
// Shallow rendering (Enzyme — legacy)
import { shallow } from 'enzyme';
const wrapper = shallow(<MyComponent />);
console.log(wrapper.find('ChildComponent').length); // 1 — but Child isn't rendered

// Full DOM rendering (React Testing Library — modern)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('increments count', async () => {
  render(<Counter />);
  await userEvent.click(screen.getByText('+'));
  expect(screen.getByText('1')).toBeInTheDocument();
});
```

---
