<!--LANG:roman-->

<!--LANG:roman-->

# State Management Interview Questions

## 1. What is state management and why is it needed in large applications?

**Asaan Urdu mein:**  
State management ka matlab hai app ke data ko ek tarah se control karna taake har component usko asaani se read ya update kar sake. Bade apps mein kai components ko same data share karna hota hai, warna prop‑drilling, duplicate state aur bugs ka risk barhta hai. Redux, Zustand ya Context jaise tools ek single source of truth provide karte hain, jisse data predictable aur debug‑able rehta hai.  

```jsx
// Without state management — props drilled through 5 layers
function App() {
  const [user, setUser] = useState(null);
  return <Header user={user} setUser={setUser} />;
}
function Header({ user, setUser }) {
  return <Nav user={user} setUser={setUser} />;
}
function Nav({ user, setUser }) {
  return <Avatar user={user} setUser={setUser} />;
}
function Avatar({ user, setUser }) {
  return <button onClick={() => setUser(null)}>{user.name}</button>;
}

// With state management — direct access anywhere
function Avatar() {
  const user = useUserStore(s => s.user);
  const logout = useUserStore(s => s.logout);
  return <button onClick={logout}>{user.name}</button>;
}
```

---

## 2. What is the difference between local state, global state, and server state?

**Asaan Urdu mein:**  
Local state sirf ek component ke andar hoti hai – `useState` ya `useReducer` se. Global state poore app mein share hoti hai – Redux store ya React Context ke through. Server state wo data hota hai jo API se aata hai, usko cache, background refetch aur sync ki zaroorat hoti hai – React Query ya SWR use karte hain. Har ek ka apna concern hota hai aur alag tool best fit hota hai.  

```jsx
// Local state — only this form needs it
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return <form>...</form>;
}

// Global state — shared across app
const UserContext = createContext(null);
function App() {
  const [user, setUser] = useState(null);
  return <UserContext.Provider value={user}>...</UserContext.Provider>;
}

// Server state — synced with API
function Profile() {
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetch('/api/profile').then(r => r.json()),
  });
}
```

---

## 3. What is Redux and what are its core principles?

**Asaan Urdu mein:**  
Redux ek predictable state container hai JavaScript apps ke liye. Iske teen core principles hain: **Single source of truth** – poora state ek store mein hota hai; **State is read‑only** – sirf actions dispatch kar ke hi state change hoti hai; **Changes are made with pure functions** – reducers bina mutation ke naya state return karte hain. Ye principles bugs ko kam karte hain aur debugging ko asaan banate hain.  

```jsx
// Core principles in action
const initialState = { todos: [], filter: 'all' };

function todoReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_TODO':
      // Returns new state — never mutates
      return { ...state, todos: [...state.todos, action.payload] };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.payload ? { ...t, done: !t.done } : t
        ),
      };
    default:
      return state;
  }
}

const store = createStore(todoReducer);
store.dispatch({ type: 'ADD_TODO', payload: { id: 1, text: 'Learn Redux' } });
```

---

## 4. Explain the Redux data flow (actions, reducers, store).

**Asaan Urdu mein:**  
Redux ka data flow hamesha ek direction mein hota hai: UI component `dispatch` karta hai action, action reducer tak jata hai, reducer naya state calculate karta hai, store sab subscribers ko notify karta hai aur React UI ko re‑render karta hai. Isse state changes predictable aur traceable rehte hain.  

```jsx
// 1. Action creator
const addTodo = (text) => ({ type: 'ADD_TODO', payload: { id: Date.now(), text } });

// 2. Store creation
const store = createStore(todoReducer);

// 3. Dispatch
store.dispatch(addTodo('Buy milk'));

// 4. Component subscribes
function TodoApp() {
  const todos = useSelector(state => state.todos);
  const dispatch = useDispatch();

  const handleSubmit = (text) => dispatch(addTodo(text));

  return (
    <ul>
      {todos.map(t => <li key={t.id}>{t.text}</li>)}
    </ul>
  );
}
```

---

## 5. What is the difference between Redux and Context API?

**Asaan Urdu mein:**  
Context API React ka built‑in feature hai jo data ko component tree ke through pass karta hai – low‑frequency updates jaise theme ya locale ke liye theek. Redux ek external library hai jo store, middleware, devtools aur memoized selectors provide karta hai – high‑frequency aur complex state ke liye behtar. Context sab consumers ko re‑render karta hai jab koi bhi value change hoti hai, jabke Redux sirf un components ko re‑render karta hai jo us slice ko select karte hain.  

```jsx
// Context API — simple but re-renders all consumers
const ThemeContext = createContext('light');
function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <ThemedButton />
    </ThemeContext.Provider>
  );
}

// Redux — selective re-rendering with useSelector
function ThemedButton() {
  const theme = useSelector(state => state.theme); // only re-renders if theme changes
  const dispatch = useDispatch();
  return <button onClick={() => dispatch({ type: 'TOGGLE_THEME' })}>{theme}</button>;
}
```

---

## 6. What are Redux middleware and why are thunks or sagas used?

**Asaan Urdu mein:**  
Middleware ek layer hoti hai jo action dispatch aur reducer ke beech intercept karti hai. Ye logging, crash reporting, ya async logic jaise kaam kar sakti hai. **Thunk** action creators ko function return karne ki ijazat deta hai, jisse async API calls handle hoti hain. **Saga** generator functions ka istemal karta hai, jo complex side‑effects ko readable aur testable banata hai.  

```jsx
// Redux Thunk — async action creator
const fetchUser = (id) => async (dispatch) => {
  dispatch({ type: 'FETCH_USER_START' });
  try {
    const user = await fetch(`/api/users/${id}`).then(r => r.json());
    dispatch({ type: 'FETCH_USER_SUCCESS', payload: user });
  } catch (err) {
    dispatch({ type: 'FETCH_USER_ERROR', payload: err.message });
  }
};

// Usage
dispatch(fetchUser(42));

// Redux Saga — generator-based
function* watchFetchUser() {
  yield takeEvery('FETCH_USER_REQUEST', function* (action) {
    try {
      const user = yield call(fetch, `/api/users/${action.payload}`);
      yield put({ type: 'FETCH_USER_SUCCESS', payload: user });
    } catch (err) {
      yield put({ type: 'FETCH_USER_ERROR', payload: err.message });
    }
  });
}
```

---

## 7. What is Redux Toolkit and how does it simplify Redux?

**Asaan Urdu mein:**  
Redux Toolkit (RTK) Redux ka official, opinionated wrapper hai jo boilerplate ko bahut kam karta hai. `createSlice` se actions aur reducers automatically generate hote hain, `configureStore` middleware aur devtools ko set up karta hai, aur `createAsyncThunk` async lifecycle ko handle karta hai. Saath hi, Immer ki wajah se mutable syntax likhna safe ho jata hai.  

```jsx
import { createSlice, configureStore, createAsyncThunk } from '@reduxjs/toolkit';

const fetchTodos = createAsyncThunk('todos/fetch', async () => {
  const res = await fetch('/api/todos');
  return res.json();
});

const todosSlice = createSlice({
  name: 'todos',
  initialState: { items: [], status: 'idle' },
  reducers: {
    toggleTodo: (state, action) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) todo.done = !todo.done; // Immer allows "mutating" syntax
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      });
  },
});

const store = configureStore({
  reducer: { todos: todosSlice.reducer },
  devTools: true, // enabled by default
});
```

---

## 8. What is the difference between Redux Toolkit's createSlice and traditional reducers?

**Asaan Urdu mein:**  
Traditional Redux mein action types, action creators, aur switch‑case reducers manually likhne padte hain – bahut boilerplate hota hai. `createSlice` sirf reducer functions likhne ki ijazat deta hai, phir automatically action type strings aur action creator functions generate karta hai. Saath hi, Immer ki madad se immutable updates ko “mutating” syntax se likha ja sakta hai.  

```jsx
// Traditional Redux — verbose
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';

const addTodoAction = (text) => ({ type: ADD_TODO, payload: { id: 1, text } });

function todosReducer(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [...state, { id: action.payload.id, text: action.payload.text }];
    case TOGGLE_TODO:
      return state.map(t => t.id === action.payload ? { ...t, done: !t.done } : t);
    default:
      return state;
  }
}

// Redux Toolkit — concise
const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push({ id: Date.now(), text: action.payload });
    },
    toggleTodo: (state, action) => {
      const todo = state.find(t => t.id === action.payload);
      if (todo) todo.done = !todo.done;
    },
  },
});

// Auto-generated: todosSlice.actions.addTodo, todosSlice.actions.toggleTodo
```

---

## 9. What is Zustand and how does it compare to Redux?

**Asaan Urdu mein:**  
Zustand ek lightweight state library hai jo hooks‑based API use karta hai, koi Provider ya boilerplate ki zaroorat nahi. Redux ke mukable mein, Zustand mein action types ya reducers nahi hote – store ek simple function hota hai jisme `set` ke through state update hoti hai. Small‑to‑medium apps ke liye yeh bahut fast aur simple solution hai.  

```jsx
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

function Counter() {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);

  return <button onClick={increment}>{count}</button>;
}

// Zustand also supports middleware:
// const useStore = create(persist(devtools(store), { name: 'my-store' }))
```

---

## 10. What is Recoil and how does its atom/selector model work?

**Asaan Urdu mein:**  
Recoil mein **atoms** chote‑chote state units hote hain jo kisi bhi component se read ya write kiye ja sakte hain. **Selectors** derived state hoti hain – wo atoms ya doosri selectors se data compute karte hain aur automatically dependencies track karte hain. Isse deep component trees mein bhi state management simple ho jata hai, bina extra provider nesting ke.  

```jsx
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';

// Atom — piece of state
const todoListState = atom({
  key: 'todoListState',
  default: [],
});

// Selector — derived state
const todoListStatsState = selector({
  key: 'todoListStatsState',
  get: ({ get }) => {
    const todoList = get(todoListState);
    const total = todoList.length;
    const completed = todoList.filter(t => t.isComplete).length;
    return { total, completed, percentCompleted: total ? Math.round(completed / total * 100) : 0 };
  },
});

function TodoStats() {
  const stats = useRecoilValue(todoListStatsState);
  return <div>{stats.percentCompleted}% complete</div>;
}

function TodoInput() {
  const [todos, setTodos] = useRecoilState(todoListState);
  const addTodo = () => setTodos([...todos, { id: Date.now(), text: 'New', isComplete: false }]);
  return <button onClick={addTodo}>Add</button>;
}
```

---

## 11. What is the difference between client state and server cache state (React Query/SWR)?

**Asaan Urdu mein:**  
**Client state** wo data hota hai jo sirf browser mein rehta hai – UI flags, form inputs, modal visibility wagaira. **Server cache state** server se aane wale data ka local copy hota hai, jo performance ke liye cache kiya jata hai, background refetch hota hai, aur optimistic updates support karta hai. React Query ya SWR in server‑cached data ko efficiently manage karte hain.  

```jsx
// Client state — local-only
function Modal() {
  const [isOpen, setIsOpen] = useState(false);
  return <button onClick={() => setIsOpen(true)}>Open</button>;
}

// Server cache state — synced with API
function UserProfile({ userId }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json()),
    staleTime: 5 * 60 * 1000, // considered fresh for 5 min
    cacheTime: 30 * 60 * 1000, // keep in cache for 30 min
  });

  if (isLoading) return <Skeleton />;
  if (error) return <Error message={error.message} />;
  return <div>{data.name}</div>;
}
```

---

## 12. What is React Query (TanStack Query) used for?

**Asaan Urdu mein:**  
TanStack Query (pehle React Query) server state ko manage karta hai – data fetching, caching, background refetch, pagination, infinite scroll, optimistic updates, aur request deduplication sab automatically hota hai. Isse `useEffect`‑based manual fetching ki zaroorat kam ho jati hai, aur code ka boilerplate bahut reduce hota hai.  

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function Posts() {
  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(r => r.json()),
  });

  const addPost = useMutation({
    mutationFn: (newPost) => fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(newPost),
      headers: { 'Content-Type': 'application/json' },
    }).then(r => r.json()),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  if (isFetching) return <Spinner />;
  return (
    <div>
      {data?.map(post => <div key={post.id}>{post.title}</div>)}
      <button onClick={() => addPost.mutate({ title: 'New Post' })}>Add</button>
    </div>
  );
}
```

---

## 13. What is optimistic UI update and how is it implemented in state management?

**Asaan Urdu mein:**  
Optimistic UI update ka matlab hai ki server se response ka intezar kiye baghair UI ko turant update kar dena. Agar server error aata hai to UI ko pehle ki state par rollback karna padta hai. React Query `onMutate` mein temporary change apply karta hai, aur `onError` mein previous cache restore karta hai. Redux ya Zustand mein bhi state ko pehle update karke error aane par revert kiya jata hai.  

```jsx
// React Query optimistic update
const toggleTodo = useMutation({
  mutationFn: (todo) => fetch(`/api/todos/${todo.id}`, { method: 'PATCH', body: JSON.stringify({ done: !todo.done }) }),
  onMutate: async (todo) => {
    // Optimistically toggle
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    const previous = queryClient.getQueryData(['todos']);
    queryClient.setQueryData(['todos'], (old) =>
      old?.map(t => t.id === todo.id ? { ...t, done: !t.done } : t)
    );
    return { previous };
  },
  onError: (err, todo, context) => {
    // Rollback on error
    queryClient.setQueryData(['todos'], context.previous);
  },
});
```

---

## 14. What is the difference between normalized and denormalized state shape?

**Asaan Urdu mein:**  
**Normalized** state entities ko flat dictionaries (ID‑keyed) mein store karta hai, duplication se bachata hai aur updates ko simple banata hai. **Denormalized** state nested objects ki tarah hoti hai – jaise API response, lekin isme same data kai jagah repeat ho sakta hai, jis se stale data ka risk badh jata hai. Normalization ke liye selectors ko use karke data ko wapas nested form mein assemble karna padta hai.  

```jsx
// Denormalized — nested, duplicates data
const state = {
  posts: [
    { id: 1, title: 'Post', author: { id: 1, name: 'Alice' }, comments: [{ id: 1, text: 'Great!' }] },
  ],
};

// Normalized — flat, no duplication
const normalized = {
  posts: { 1: { id: 1, title: 'Post', authorId: 1, commentIds: [1] } },
  authors: { 1: { id: 1, name: 'Alice' } },
  comments: { 1: { id: 1, text: 'Great!', postId: 1 } },
};

// Selector to denormalize
const selectPost = (state, postId) => {
  const post = state.posts[postId];
  return {
    ...post,
    author: state.authors[post.authorId],
    comments: post.commentIds.map(id => state.comments[id]),
  };
};
```

---

## 15. What is the concept of a single source of truth in state management?

**Asaan Urdu mein:**  
Single source of truth ka matlab hai ke poora application state ek hi central store mein hota hai. Isse har component ko ek hi jagah se data read ya update karna hota hai, jisse state ka synchronization issue nahi hota. Agar koi component state change karta hai, to sabhi components jo us state ko subscribe karte hain, instantly updated view dekhte hain.  

```jsx
// ✅ Single source of truth
const store = createStore(rootReducer);
// All components read from the same store
function Header() {
  const user = useSelector(s => s.auth.user);
}
function Sidebar() {
  const user = useSelector(s => s.auth.user);
}
function Profile() {
  const user = useSelector(s => s.auth.user);
}
// When user is updated, all three components see the same data

// ❌ Multiple sources — data gets out of sync
// Header has its own copy, Sidebar has another
function Header() { const [user] = useState(null); }
function Sidebar() { /* different user state */ }
```

---

## 16. How do you handle derived/computed state efficiently?

**Asaan Urdu mein:**  
Derived state wo data hota hai jo existing state se calculate hota hai – jaise filtered list ya total count. Directly render mein calculate karne se har render par computation hoti hai. `useMemo` ya **Reselect** ke `createSelector` se memoization hoti hai – sirf inputs change hone par hi calculation dobara hoti hai. Selectors ko compose karke complex derived data ko efficiently manage kiya ja sakta hai.  

```jsx
import { createSelector } from '@reduxjs/toolkit';

// Before — computed every render
function TodoList({ todos, filter }) {
  const filtered = todos.filter(t => filter === 'all' || t.status === filter);
  const stats = { total: todos.length, completed: todos.filter(t => t.done).length };
  // ...
}

// After — memoized selectors
const selectTodos = state => state.todos;
const selectFilter = state => state.filter;

const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => todos.filter(t => filter === 'all' || t.status === filter)
);

const selectStats = createSelector(
  [selectTodos],
  (todos) => ({ total: todos.length, completed: todos.filter(t => t.done).length })
);

function TodoList() {
  const filtered = useSelector(selectFilteredTodos); // only re-computes when todos/filter change
  const stats = useSelector(selectStats);
}
```

---

## 17. What is the difference between MobX and Redux in terms of reactivity?

**Asaan Urdu mein:**  
**Redux** immutable state use karta hai – har update par naya object create hota hai, aur React reference comparison se re‑render decide karta hai. **MobX** mutable state ko observable banata hai, aur automatically track karta hai ke kaunse component ne kaunse observable ko read kiya; sirf woh components re‑render hote hain jab unke specific observables change hote hain. MobX kam boilerplate deta hai, lekin large apps mein reasoning thodi mushkil ho sakti hai.  

```jsx
// MobX — mutable, automatic tracking
class TodoStore {
  @observable todos = [];
  @observable filter = 'all';

  @computed get filteredTodos() {
    return this.todos.filter(t => this.filter === 'all' || t.status === this.filter);
  }

  @action addTodo(text) {
    this.todos.push({ id: Date.now(), text, done: false }); // direct mutation
  }
}

const store = new TodoStore();

const TodoListView = observer(() => (
  <div>
    {store.filteredTodos.map(t => <div key={t.id}>{t.text}</div>)}
  </div>
));

// Redux — immutable, explicit
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };
    // ...
  }
}
```

---

## 18. What is prop drilling and how does global state management solve it?

**Asaan Urdu mein:**  
Prop drilling ka matlab hai data ko beech‑beech ke components ke through pass karna jo khud us data ko use nahi karte – sirf niche ke component tak pahunchane ke liye. Global state management (Redux, Zustand, Context) har component ko directly required slice of state access karne ki ijazat deta hai, isliye bekaar ke intermediate props ki zaroorat nahi rehti.  

```jsx
// ❌ Prop drilling
function App() {
  const [user, setUser] = useState(null);
  return <Page user={user} onLogin={setUser} />;
}
function Page({ user, onLogin }) {
  return <Header user={user} onLogin={onLogin} />;
}
function Header({ user, onLogin }) {
  return <UserMenu user={user} onLogin={onLogin} />;
}
function UserMenu({ user, onLogin }) {
  return user ? <LogoutButton onLogout={() => onLogin(null)} /> : <LoginForm onLogin={onLogin} />;
}

// ✅ Global state (Zustand)
const useAuth = create((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// App → Page → Header → UserMenu — all skip the middle components
function UserMenu() {
  const user = useAuth(s => s.user); // direct access
  const logout = useAuth(s => s.logout);
  return user ? <button onClick={logout}>Logout</button> : <LoginForm />;
}
```

---

## 19. How do you persist state across page reloads (redux-persist, localStorage)?

**Asaan Urdu mein:**  
State persistence ka matlab hai store ko localStorage (ya IndexedDB) mein save karna aur page reload par wapas load karna. `redux-persist` Redux ke liye automatic persisting aur rehydration provide karta hai. Zustand ke liye `persist` middleware use hota hai. Simple cases mein manually `useEffect` ke through state ko JSON stringify karke localStorage mein store kiya ja sakta hai. Sensitive data ko kabhi persist na karein.  

```jsx
// Redux Persist
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'theme'], // only persist these slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({ reducer: persistedReducer });
const persistor = persistStore(store);

// Provider wrap
<PersistGate loading={<LoadingScreen />} persistor={persistor}>
  <App />
</PersistGate>

// Zustand Persist
const useStore = create(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'app-settings' }
  )
);

// Manual localStorage
function usePersistedState(key, initial) {
  const [state, setState] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
```

---

## 20. What is the difference between synchronous and asynchronous actions in Redux?

**Asaan Urdu mein:**  
**Synchronous actions** plain objects hote hain jo turant reducer tak jate hain aur state instantly update hoti hai. **Asynchronous actions** (API calls, timeouts) ko handle karne ke liye middleware (thunk, saga, RTK Query) ki zaroorat hoti hai – middleware async work karta hai, phir alag‑alag synchronous actions (`pending`, `fulfilled`, `rejected`) dispatch karta hai.  

```jsx
// Synchronous action — reducer processes immediately
dispatch({ type: 'INCREMENT' });
dispatch({ type: 'SET_USER', payload: { name: 'Alice' } });

// Asynchronous action — requires thunk middleware
const fetchUser = (id) => async (dispatch) => {
  // 1. Dispatch pending (sync)
  dispatch({ type: 'FETCH_USER/pending' });

  try {
    const res = await fetch(`/api/users/${id}`);
    const data = await res.json();
    // 2. Dispatch fulfilled (sync) after async work
    dispatch({ type: 'FETCH_USER/fulfilled', payload: data });
  } catch (err) {
    // 3. Dispatch rejected on error
    dispatch({ type: 'FETCH_USER/rejected', payload: err.message });
  }
};

// RTK Query makes this even simpler:
const { data, isLoading } = useGetUserQuery(id);
```

---

<!--LANG:english-->

# State Management Interview Questions

## 1. What is state management and why is it needed in large applications?

State management is the pattern of controlling how data flows through an application. In large apps, many components need to share and synchronize data — managing this with only local component state leads to prop drilling, duplication, and bugs. A state management solution (Redux, Zustand, Context) provides a single, predictable way to read and write shared state.

```jsx
// Without state management — props drilled through 5 layers
function App() {
  const [user, setUser] = useState(null);
  return <Header user={user} setUser={setUser} />;
}
function Header({ user, setUser }) {
  return <Nav user={user} setUser={setUser} />;
}
function Nav({ user, setUser }) {
  return <Avatar user={user} setUser={setUser} />;
}
function Avatar({ user, setUser }) {
  return <button onClick={() => setUser(null)}>{user.name}</button>;
}

// With state management — direct access anywhere
function Avatar() {
  const user = useUserStore(s => s.user);
  const logout = useUserStore(s => s.logout);
  return <button onClick={logout}>{user.name}</button>;
}
```

---

## 2. What is the difference between local state, global state, and server state?

Local state is component-specific (useState, useReducer). Global state is shared across multiple unrelated components (Redux store, Context). Server state is data fetched from an API that needs caching, background refetching, and synchronization (React Query, SWR). Each has different concerns and should use different tools.

```jsx
// Local state — only this form needs it
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return <form>...</form>;
}

// Global state — shared across app
const UserContext = createContext(null);
function App() {
  const [user, setUser] = useState(null);
  return <UserContext.Provider value={user}>...</UserContext.Provider>;
}

// Server state — synced with API
function Profile() {
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetch('/api/profile').then(r => r.json()),
  });
}
```

---

## 3. What is Redux and what are its core principles?

Redux is a predictable state container for JavaScript apps. Its three principles: 1) **Single source of truth** — the entire state lives in one store. 2) **State is read-only** — the only way to change state is by dispatching an action. 3) **Changes are made with pure functions** — reducers take previous state + action and return next state without mutations.

```jsx
// Core principles in action
const initialState = { todos: [], filter: 'all' };

function todoReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_TODO':
      // Returns new state — never mutates
      return { ...state, todos: [...state.todos, action.payload] };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.payload ? { ...t, done: !t.done } : t
        ),
      };
    default:
      return state;
  }
}

const store = createStore(todoReducer);
store.dispatch({ type: 'ADD_TODO', payload: { id: 1, text: 'Learn Redux' } });
```

---

## 4. Explain the Redux data flow (actions, reducers, store).

Redux follows a strict unidirectional flow: 1) Component calls `store.dispatch(action)`. 2) The action (a plain object with `type` and optional `payload`) is sent to the reducer. 3) The reducer computes the new state. 4) The store notifies subscribers, React re-renders. Data flows in one direction — UI → action → reducer → store → UI.

```jsx
// 1. Action creator
const addTodo = (text) => ({ type: 'ADD_TODO', payload: { id: Date.now(), text } });

// 2. Store creation
const store = createStore(todoReducer);

// 3. Dispatch
store.dispatch(addTodo('Buy milk'));

// 4. Component subscribes
function TodoApp() {
  const todos = useSelector(state => state.todos);
  const dispatch = useDispatch();

  const handleSubmit = (text) => dispatch(addTodo(text));

  return (
    <ul>
      {todos.map(t => <li key={t.id}>{t.text}</li>)}
    </ul>
  );
}
```

---

## 5. What is the difference between Redux and Context API?

Context API is built into React and passes data through the component tree — it's best for low-frequency updates (theme, locale). Redux is an external library with a store, middleware, devtools, and performance optimizations (memoized selectors). Context re-renders all consumers when any value changes; Redux uses subscriptions so only affected components re-render.

```jsx
// Context API — simple but re-renders all consumers
const ThemeContext = createContext('light');
function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <ThemedButton />
    </ThemeContext.Provider>
  );
}

// Redux — selective re-rendering with useSelector
function ThemedButton() {
  const theme = useSelector(state => state.theme); // only re-renders if theme changes
  const dispatch = useDispatch();
  return <button onClick={() => dispatch({ type: 'TOGGLE_THEME' })}>{theme}</button>;
}
```

---

## 6. What are Redux middleware and why are thunks or sagas used?

Middleware sits between dispatching an action and the moment it reaches the reducer. It intercepts actions for logging, crash reporting, async handling, etc. Thunks (redux-thunk) allow action creators to return functions instead of objects, enabling async logic. Sagas (redux-saga) use generator functions for more complex side effects.

```jsx
// Redux Thunk — async action creator
const fetchUser = (id) => async (dispatch) => {
  dispatch({ type: 'FETCH_USER_START' });
  try {
    const user = await fetch(`/api/users/${id}`).then(r => r.json());
    dispatch({ type: 'FETCH_USER_SUCCESS', payload: user });
  } catch (err) {
    dispatch({ type: 'FETCH_USER_ERROR', payload: err.message });
  }
};

// Usage
dispatch(fetchUser(42));

// Redux Saga — generator-based
function* watchFetchUser() {
  yield takeEvery('FETCH_USER_REQUEST', function* (action) {
    try {
      const user = yield call(fetch, `/api/users/${action.payload}`);
      yield put({ type: 'FETCH_USER_SUCCESS', payload: user });
    } catch (err) {
      yield put({ type: 'FETCH_USER_ERROR', payload: err.message });
    }
  });
}
```

---

## 7. What is Redux Toolkit and how does it simplify Redux?

Redux Toolkit (RTK) is the official, opinionated way to write Redux logic. It eliminates boilerplate by providing `createSlice` (auto-generates actions and reducers), `configureStore` (sets up middleware and devtools), `createAsyncThunk` (handles async lifecycle), and built-in Immer for immutable updates.

```jsx
import { createSlice, configureStore, createAsyncThunk } from '@reduxjs/toolkit';

const fetchTodos = createAsyncThunk('todos/fetch', async () => {
  const res = await fetch('/api/todos');
  return res.json();
});

const todosSlice = createSlice({
  name: 'todos',
  initialState: { items: [], status: 'idle' },
  reducers: {
    toggleTodo: (state, action) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) todo.done = !todo.done; // Immer allows "mutating" syntax
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      });
  },
});

const store = configureStore({
  reducer: { todos: todosSlice.reducer },
  devTools: true, // enabled by default
});
```

---

## 8. What is the difference between Redux Toolkit's createSlice and traditional reducers?

Traditional Redux requires manually defining action types as string constants, action creators as functions, and switch-case reducers — lots of boilerplate. `createSlice` auto-generates action creators and action types from the reducer functions you write. It also integrates Immer for simpler immutable updates.

```jsx
// Traditional Redux — verbose
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';

const addTodoAction = (text) => ({ type: ADD_TODO, payload: { id: 1, text } });

function todosReducer(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [...state, { id: action.payload.id, text: action.payload.text }];
    case TOGGLE_TODO:
      return state.map(t => t.id === action.payload ? { ...t, done: !t.done } : t);
    default:
      return state;
  }
}

// Redux Toolkit — concise
const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push({ id: Date.now(), text: action.payload });
    },
    toggleTodo: (state, action) => {
      const todo = state.find(t => t.id === action.payload);
      if (todo) todo.done = !todo.done;
    },
  },
});

// Auto-generated: todosSlice.actions.addTodo, todosSlice.actions.toggleTodo
```

---

## 9. What is Zustand and how does it compare to Redux?

Zustand is a minimalist state management library with a hook-based API, no boilerplate, and no providers. Unlike Redux, there's no wrapping with Provider, no action type constants, and no reducers — you write a store as a plain function with `set`. It's ideal for smaller to medium apps that don't need Redux's ecosystem.

```jsx
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

function Counter() {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);

  return <button onClick={increment}>{count}</button>;
}

// Zustand also supports middleware:
// const useStore = create(persist(devtools(store), { name: 'my-store' }))
```

---

## 10. What is Recoil and how does its atom/selector model work?

Recoil introduces atoms (units of state) and selectors (derived state). Atoms can be read/written from any component. Selectors compute derived state from atoms or other selectors, automatically tracking dependencies and only re-computing when inputs change. Recoil avoids the provider tree nesting issues of Context.

```jsx
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';

// Atom — piece of state
const todoListState = atom({
  key: 'todoListState',
  default: [],
});

// Selector — derived state
const todoListStatsState = selector({
  key: 'todoListStatsState',
  get: ({ get }) => {
    const todoList = get(todoListState);
    const total = todoList.length;
    const completed = todoList.filter(t => t.isComplete).length;
    return { total, completed, percentCompleted: total ? Math.round(completed / total * 100) : 0 };
  },
});

function TodoStats() {
  const stats = useRecoilValue(todoListStatsState);
  return <div>{stats.percentCompleted}% complete</div>;
}

function TodoInput() {
  const [todos, setTodos] = useRecoilState(todoListState);
  const addTodo = () => setTodos([...todos, { id: Date.now(), text: 'New', isComplete: false }]);
  return <button onClick={addTodo}>Add</button>;
}
```

---

## 11. What is the difference between client state and server cache state (React Query/SWR)?

Client state is data that lives only in the browser — UI state (modals open, form inputs), that doesn't need to be persisted on a server. Server cache state is a mirror of server data stored client-side for performance. Libraries like React Query and SWR manage server cache by deduplicating requests, caching responses, background refetching, and optimistic updates.

```jsx
// Client state — local-only
function Modal() {
  const [isOpen, setIsOpen] = useState(false);
  return <button onClick={() => setIsOpen(true)}>Open</button>;
}

// Server cache state — synced with API
function UserProfile({ userId }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json()),
    staleTime: 5 * 60 * 1000, // considered fresh for 5 min
    cacheTime: 30 * 60 * 1000, // keep in cache for 30 min
  });

  if (isLoading) return <Skeleton />;
  if (error) return <Error message={error.message} />;
  return <div>{data.name}</div>;
}
```

---

## 12. What is React Query (TanStack Query) used for?

TanStack Query handles server state management — fetching, caching, synchronizing, and updating server data in React apps. It eliminates the need to write useEffect-based data fetching, reduces boilerplate, and provides features like automatic background refetching, pagination, infinite queries, optimistic updates, and request deduplication.

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function Posts() {
  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(r => r.json()),
  });

  const addPost = useMutation({
    mutationFn: (newPost) => fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(newPost),
      headers: { 'Content-Type': 'application/json' },
    }).then(r => r.json()),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  if (isFetching) return <Spinner />;
  return (
    <div>
      {data?.map(post => <div key={post.id}>{post.title}</div>)}
      <button onClick={() => addPost.mutate({ title: 'New Post' })}>Add</button>
    </div>
  );
}
```

---

## 13. What is optimistic UI update and how is it implemented in state management?

Optimistic UI updates immediately reflect a change in the UI before the server confirms it. If the server fails, the UI rolls back. This makes the app feel instant. In React Query, this is done with `onMutate` (apply change) and `onError` (rollback). In Redux/Zustand, it's done by updating state optimistically and reverting on error.

```jsx
// React Query optimistic update
const toggleTodo = useMutation({
  mutationFn: (todo) => fetch(`/api/todos/${todo.id}`, { method: 'PATCH', body: JSON.stringify({ done: !todo.done }) }),
  onMutate: async (todo) => {
    // Optimistically toggle
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    const previous = queryClient.getQueryData(['todos']);
    queryClient.setQueryData(['todos'], (old) =>
      old?.map(t => t.id === todo.id ? { ...t, done: !t.done } : t)
    );
    return { previous };
  },
  onError: (err, todo, context) => {
    // Rollback on error
    queryClient.setQueryData(['todos'], context.previous);
  },
});
```

---

## 14. What is the difference between normalized and denormalized state shape?

Normalized state stores entities in a flat dictionary keyed by ID, avoiding duplication. Denormalized state nests related data directly (like a API JSON response). Normalization makes updates simpler and avoids stale/inconsistent data, but requires selectors to reconstruct the nested view. Redux recommends normalized state.

```jsx
// Denormalized — nested, duplicates data
const state = {
  posts: [
    { id: 1, title: 'Post', author: { id: 1, name: 'Alice' }, comments: [{ id: 1, text: 'Great!' }] },
  ],
};

// Normalized — flat, no duplication
const normalized = {
  posts: { 1: { id: 1, title: 'Post', authorId: 1, commentIds: [1] } },
  authors: { 1: { id: 1, name: 'Alice' } },
  comments: { 1: { id: 1, text: 'Great!', postId: 1 } },
};

// Selector to denormalize
const selectPost = (state, postId) => {
  const post = state.posts[postId];
  return {
    ...post,
    author: state.authors[post.authorId],
    comments: post.commentIds.map(id => state.comments[id]),
  };
};
```

---

## 15. What is the concept of a single source of truth in state management?

A single source of truth means all application state is stored in one central location (a single store), making it predictable and debuggable. Any piece of data exists in exactly one place, and there's only one way to read it and one way to update it. This prevents synchronization bugs where multiple copies of the same data get out of sync.

```jsx
// ✅ Single source of truth
const store = createStore(rootReducer);
// All components read from the same store
function Header() {
  const user = useSelector(s => s.auth.user);
}
function Sidebar() {
  const user = useSelector(s => s.auth.user);
}
function Profile() {
  const user = useSelector(s => s.auth.user);
}
// When user is updated, all three components see the same data

// ❌ Multiple sources — data gets out of sync
// Header has its own copy, Sidebar has another
function Header() { const [user] = useState(null); }
function Sidebar() { /* different user state */ }
```

---

## 16. How do you handle derived/computed state efficiently?

Derived state is data computed from existing state — like a filtered list or a total count. Computing it during render (without memoization) recalculates on every render. Using `useMemo` or Reselect's `createSelector` memoizes the computation, only re-running when inputs change. Selectors also compose, building complex derived data efficiently.

```jsx
import { createSelector } from '@reduxjs/toolkit';

// Before — computed every render
function TodoList({ todos, filter }) {
  const filtered = todos.filter(t => filter === 'all' || t.status === filter);
  const stats = { total: todos.length, completed: todos.filter(t => t.done).length };
  // ...
}

// After — memoized selectors
const selectTodos = state => state.todos;
const selectFilter = state => state.filter;

const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => todos.filter(t => filter === 'all' || t.status === filter)
);

const selectStats = createSelector(
  [selectTodos],
  (todos) => ({ total: todos.length, completed: todos.filter(t => t.done).length })
);

function TodoList() {
  const filtered = useSelector(selectFilteredTodos); // only re-computes when todos/filter change
  const stats = useSelector(selectStats);
}
```

---

## 17. What is the difference between MobX and Redux in terms of reactivity?

Redux uses **external** immutability: state is replaced with new objects, and React detects changes via reference comparisons. MobX uses **internal** reactivity: state is mutable, and MobX tracks which observables each component accesses, automatically re-rendering when those specific observables change. MobX requires less boilerplate but can be harder to reason about in large apps.

```jsx
// MobX — mutable, automatic tracking
class TodoStore {
  @observable todos = [];
  @observable filter = 'all';

  @computed get filteredTodos() {
    return this.todos.filter(t => this.filter === 'all' || t.status === this.filter);
  }

  @action addTodo(text) {
    this.todos.push({ id: Date.now(), text, done: false }); // direct mutation
  }
}

const store = new TodoStore();

const TodoListView = observer(() => (
  <div>
    {store.filteredTodos.map(t => <div key={t.id}>{t.text}</div>)}
  </div>
));

// Redux — immutable, explicit
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };
    // ...
  }
}
```

---

## 18. What is prop drilling and how does global state management solve it?

Prop drilling is passing data through many intermediate components that don't need the data, just to reach a deeply nested consumer. Global state management (Redux, Zustand, Context) solves this by giving any component direct access to state without going through the component tree hierarchy — components subscribe to exactly the slice of state they need.

```jsx
// ❌ Prop drilling
function App() {
  const [user, setUser] = useState(null);
  return <Page user={user} onLogin={setUser} />;
}
function Page({ user, onLogin }) {
  return <Header user={user} onLogin={onLogin} />;
}
function Header({ user, onLogin }) {
  return <UserMenu user={user} onLogin={onLogin} />;
}
function UserMenu({ user, onLogin }) {
  return user ? <LogoutButton onLogout={() => onLogin(null)} /> : <LoginForm onLogin={onLogin} />;
}

// ✅ Global state (Zustand)
const useAuth = create((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// App → Page → Header → UserMenu — all skip the middle components
function UserMenu() {
  const user = useAuth(s => s.user); // direct access
  const logout = useAuth(s => s.logout);
  return user ? <button onClick={logout}>Logout</button> : <LoginForm />;
}
```

---

## 19. How do you persist state across page reloads (redux-persist, localStorage)?

State persistence saves the store to localStorage (or other storage) and rehydrates it on page load. `redux-persist` automates this for Redux. For Zustand, the `persist` middleware handles it. Manual localStorage works for simpler cases. Persist only non-sensitive state — never tokens or secrets.

```jsx
// Redux Persist
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'theme'], // only persist these slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({ reducer: persistedReducer });
const persistor = persistStore(store);

// Provider wrap
<PersistGate loading={<LoadingScreen />} persistor={persistor}>
  <App />
</PersistGate>

// Zustand Persist
const useStore = create(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'app-settings' }
  )
);

// Manual localStorage
function usePersistedState(key, initial) {
  const [state, setState] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
```

---

## 20. What is the difference between synchronous and asynchronous actions in Redux?

Synchronous actions dispatch a plain object that the reducer processes immediately. Asynchronous actions (like API calls) require middleware (thunks, sagas, or RTK Query). The middleware intercepts the async action, performs the side effect, and dispatches synchronous actions for the different states (pending, fulfilled, rejected).

```jsx
// Synchronous action — reducer processes immediately
dispatch({ type: 'INCREMENT' });
dispatch({ type: 'SET_USER', payload: { name: 'Alice' } });

// Asynchronous action — requires thunk middleware
const fetchUser = (id) => async (dispatch) => {
  // 1. Dispatch pending (sync)
  dispatch({ type: 'FETCH_USER/pending' });

  try {
    const res = await fetch(`/api/users/${id}`);
    const data = await res.json();
    // 2. Dispatch fulfilled (sync) after async work
    dispatch({ type: 'FETCH_USER/fulfilled', payload: data });
  } catch (err) {
    // 3. Dispatch rejected on error
    dispatch({ type: 'FETCH_USER/rejected', payload: err.message });
  }
};

// RTK Query makes this even simpler:
const { data, isLoading } = useGetUserQuery(id);
```

---
