import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Difficulty = 'beginner' | 'intermediate' | 'advanced'

interface QuestionData {
  text: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizData {
  title: string
  description: string
  difficulty: Difficulty
  timeLimit: number
  passingScore: number
  questions: QuestionData[]
}

interface FlashCardData {
  front: string
  back: string
  difficulty: Difficulty
}

const quizTemplates: Record<string, QuizData[]> = {
  html: [
    {
      title: 'HTML Fundamentals',
      description: 'Test your knowledge of basic HTML concepts and elements',
      difficulty: 'beginner',
      timeLimit: 300,
      passingScore: 70,
      questions: [
        { text: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], correctAnswer: 0, explanation: 'HTML stands for Hyper Text Markup Language, the standard language for creating web pages.' },
        { text: 'Which tag is used for the largest heading?', options: ['<heading>', '<h6>', '<h1>', '<head>'], correctAnswer: 2, explanation: '<h1> defines the most important heading. Heading levels range from h1 to h6.' },
        { text: 'What is the correct HTML for creating a hyperlink?', options: ['<a url="https://example.com">Click</a>', '<a href="https://example.com">Click</a>', '<link href="https://example.com">Click</link>', '<hyperlink>https://example.com</hyperlink>'], correctAnswer: 1, explanation: 'The <a> tag with href attribute creates hyperlinks.' },
        { text: 'Which HTML element defines the document type?', options: ['<DOCTYPE>', '<html>', '<!DOCTYPE html>', '<type>'], correctAnswer: 2, explanation: '<!DOCTYPE html> declares the document type and HTML version.' },
        { text: 'Which tag is used for an unordered list?', options: ['<list>', '<ol>', '<ul>', '<li>'], correctAnswer: 2, explanation: '<ul> defines an unordered (bulleted) list. <ol> is for ordered lists.' },
        { text: 'What attribute is used to specify alternative text for an image?', options: ['title', 'alt', 'src', 'href'], correctAnswer: 1, explanation: 'The alt attribute provides alternative text for images, important for accessibility and SEO.' },
        { text: 'Which HTML tag is used for inserting a line break?', options: ['<lb>', '<break>', '<br>', '<newline>'], correctAnswer: 2, explanation: '<br> inserts a single line break. It is an empty element with no closing tag.' },
        { text: 'What does the <div> tag represent?', options: ['A division or section', 'A hyperlink', 'An image', 'A form input'], correctAnswer: 0, explanation: '<div> is a block-level container used to group elements for styling or layout.' },
      ],
    },
    {
      title: 'HTML Forms & Semantics',
      description: 'Advanced HTML concepts including forms and semantic elements',
      difficulty: 'intermediate',
      timeLimit: 420,
      passingScore: 70,
      questions: [
        { text: 'Which input type creates a dropdown list?', options: ['<input type="dropdown">', '<select>', '<input type="list">', '<dropdown>'], correctAnswer: 1, explanation: 'The <select> element creates a dropdown list. <input type="dropdown"> does not exist.' },
        { text: 'What is the purpose of the <fieldset> element?', options: ['To create a field for text input', 'To group related form elements', 'To set a field value', 'To create a legend'], correctAnswer: 1, explanation: '<fieldset> groups related form elements and draws a box around them.' },
        { text: 'Which semantic element represents the main content of a page?', options: ['<section>', '<article>', '<main>', '<content>'], correctAnswer: 2, explanation: '<main> represents the dominant content of the document. There should be only one <main> per page.' },
        { text: 'What does ARIA stand for?', options: ['Accessible Rich Internet Applications', 'Advanced Resource Integration API', 'Automated Responsive Interface Architecture', 'Accessible Routing Interface Application'], correctAnswer: 0, explanation: 'ARIA provides attributes to make web content more accessible to people with disabilities.' },
        { text: 'Which element is best for navigation links?', options: ['<div class="nav">', '<navigation>', '<nav>', '<menu>'], correctAnswer: 2, explanation: 'The <nav> semantic element is specifically designed for navigation links.' },
      ],
    },
  ],
  css: [
    {
      title: 'CSS Basics & Selectors',
      description: 'Test your understanding of CSS selectors and properties',
      difficulty: 'beginner',
      timeLimit: 300,
      passingScore: 70,
      questions: [
        { text: 'What does CSS stand for?', options: ['Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'], correctAnswer: 1, explanation: 'CSS stands for Cascading Style Sheets, used to style HTML documents.' },
        { text: 'Which property changes the text color?', options: ['font-color', 'text-color', 'color', 'foreground'], correctAnswer: 2, explanation: 'The color property sets the text color of an element.' },
        { text: 'How do you select an element with id "header"?', options: ['.header', '#header', '*header', 'header'], correctAnswer: 1, explanation: 'The # symbol selects elements by id. The . symbol selects by class.' },
        { text: 'What is the box model composed of?', options: ['Margin, Border, Padding, Content', 'Margin, Padding, Width, Height', 'Content, Style, Layout, Design', 'Border, Margin, Width, Height'], correctAnswer: 0, explanation: 'The CSS box model consists of: content, padding, border, and margin (outside to inside when writing).' },
        { text: 'Which value positions an element relative to its normal position?', options: ['absolute', 'fixed', 'relative', 'static'], correctAnswer: 2, explanation: 'position: relative positions an element relative to its normal position, offset by top/right/bottom/left.' },
      ],
    },
    {
      title: 'CSS Layouts & Responsive Design',
      description: 'Advanced CSS layout techniques',
      difficulty: 'intermediate',
      timeLimit: 420,
      passingScore: 70,
      questions: [
        { text: 'Which display value enables Flexbox?', options: ['block', 'inline', 'flex', 'grid'], correctAnswer: 2, explanation: 'display: flex enables the Flexbox layout model.' },
        { text: 'Which property creates space between flex items?', options: ['spacing', 'gap', 'margin', 'padding'], correctAnswer: 1, explanation: 'The gap property creates space between flex or grid items.' },
        { text: 'What does grid-template-columns: repeat(3, 1fr) do?', options: ['Creates 3 columns with equal width', 'Repeats 3 times', 'Creates 1 column 3fr wide', 'Creates 3 rows'], correctAnswer: 0, explanation: 'repeat(3, 1fr) creates three equal-width columns using fractional units.' },
        { text: 'Which media feature checks device width?', options: ['device-width', 'max-device-width', 'min-width', 'width'], correctAnswer: 2, explanation: 'min-width and max-width in media queries check the viewport width for responsive design.' },
        { text: 'What is the mobile-first approach?', options: ['Design for desktop first', 'Write base styles for mobile, add breakpoints for larger screens', 'Use only mobile devices', 'Write separate CSS files'], correctAnswer: 1, explanation: 'Mobile-first starts with base styles for small screens, then adds min-width media queries for larger screens.' },
      ],
    },
  ],
  javascript: [
    {
      title: 'JavaScript Fundamentals',
      description: 'Core JavaScript concepts and syntax',
      difficulty: 'beginner',
      timeLimit: 300,
      passingScore: 70,
      questions: [
        { text: 'Which method adds an element to the end of an array?', options: ['push()', 'pop()', 'shift()', 'unshift()'], correctAnswer: 0, explanation: 'push() adds one or more elements to the end of an array and returns the new length.' },
        { text: 'What does typeof null return?', options: ['null', 'undefined', 'object', 'boolean'], correctAnswer: 2, explanation: 'typeof null returns "object". This is a known JavaScript bug from its first implementation.' },
        { text: 'Which keyword declares a block-scoped variable?', options: ['var', 'let', 'const', 'Both let and const'], correctAnswer: 3, explanation: 'Both let and const are block-scoped. var is function-scoped.' },
        { text: 'What is the result of "5" + 3?', options: ['8', '53', 'undefined', 'TypeError'], correctAnswer: 1, explanation: 'When using + with a string, JavaScript converts the number to a string and concatenates, resulting in "53".' },
        { text: 'Which method converts JSON to a JavaScript object?', options: ['JSON.stringify()', 'JSON.parse()', 'JSON.convert()', 'Object.fromJSON()'], correctAnswer: 1, explanation: 'JSON.parse() converts a JSON string into a JavaScript object.' },
      ],
    },
    {
      title: 'Advanced JavaScript',
      description: 'Closures, promises, and ES6+ features',
      difficulty: 'intermediate',
      timeLimit: 420,
      passingScore: 70,
      questions: [
        { text: 'What is a closure?', options: ['A function that closes the browser', 'A function with access to its outer function scope', 'A closed source code', 'A JavaScript library'], correctAnswer: 1, explanation: 'A closure is a function that retains access to its outer (enclosing) function scope even after the outer function has returned.' },
        { text: 'What does Promise.all() do?', options: ['Runs promises in sequence', 'Waits for all promises to resolve', 'Races promises', 'Cancels all promises'], correctAnswer: 1, explanation: 'Promise.all() takes an array of promises and returns a single promise that resolves when all input promises resolve.' },
        { text: 'What is the event loop?', options: ['A loop that creates events', 'A mechanism handling async callbacks', 'A browser API', 'A DOM event'], correctAnswer: 1, explanation: 'The event loop is JavaScripts mechanism for handling asynchronous callbacks by managing the call stack and callback queue.' },
        { text: 'What does the spread operator (...) do?', options: ['Spreads array/object elements', 'Creates a loop', 'Defines variable arguments', 'Concatenates strings'], correctAnswer: 0, explanation: 'The spread operator expands iterables (arrays, objects) into individual elements.' },
        { text: 'What is destructuring used for?', options: ['Destroying variables', 'Extracting values from arrays/objects', 'Restructuring code', 'Creating destructors'], correctAnswer: 1, explanation: 'Destructuring allows unpacking values from arrays or properties from objects into distinct variables.' },
      ],
    },
    {
      title: 'JavaScript Design Patterns',
      description: 'Common design patterns in JavaScript',
      difficulty: 'advanced',
      timeLimit: 300,
      passingScore: 75,
      questions: [
        { text: 'Which pattern ensures a class has only one instance?', options: ['Factory', 'Observer', 'Singleton', 'Module'], correctAnswer: 2, explanation: 'The Singleton pattern restricts a class to a single instance and provides global access to it.' },
        { text: 'What does the Observer pattern define?', options: ['One-to-one dependency', 'One-to-many dependency', 'Many-to-many dependency', 'No dependency'], correctAnswer: 1, explanation: 'The Observer pattern defines a one-to-many dependency where multiple observers are notified of state changes.' },
        { text: 'Which pattern provides a way to create objects without specifying the exact class?', options: ['Factory', 'Singleton', 'Decorator', 'Proxy'], correctAnswer: 0, explanation: 'The Factory pattern provides an interface for creating objects without specifying their concrete classes.' },
      ],
    },
  ],
  typescript: [
    {
      title: 'TypeScript Basics',
      description: 'Types, interfaces, and basic TypeScript features',
      difficulty: 'beginner',
      timeLimit: 300,
      passingScore: 70,
      questions: [
        { text: 'Which keyword defines a custom type in TypeScript?', options: ['interface', 'type', 'class', 'Both interface and type'], correctAnswer: 3, explanation: 'Both interface and type can define custom types. interface extends and merges, while type creates aliases.' },
        { text: 'What does the ? symbol mean in a property definition?', options: ['Required property', 'Optional property', 'Nullable property', 'Private property'], correctAnswer: 1, explanation: 'The ? makes a property optional, meaning it can be undefined when using the type.' },
        { text: 'How do you define an array of numbers?', options: ['Array<number>', 'number[]', 'Both are valid', 'None of these'], correctAnswer: 2, explanation: 'Both T[] and Array<T> syntaxes are valid for defining arrays in TypeScript.' },
        { text: 'What is the type of any?', options: ['Unknown type', 'Top type that disables type checking', 'Bottom type', 'Never type'], correctAnswer: 1, explanation: 'any disables type checking for a variable, allowing any operations without compilation errors.' },
        { text: 'Which utility type makes all properties optional?', options: ['Required<T>', 'Partial<T>', 'Pick<T>', 'Omit<T>'], correctAnswer: 1, explanation: 'Partial<T> creates a type with all properties of T set to optional.' },
      ],
    },
    {
      title: 'Advanced TypeScript',
      description: 'Generics, decorators, and utility types',
      difficulty: 'intermediate',
      timeLimit: 420,
      passingScore: 70,
      questions: [
        { text: 'What are generics used for?', options: ['Creating reusable components', 'Generating code', 'Generic functions only', 'Runtime type checking'], correctAnswer: 0, explanation: 'Generics create reusable components that work with multiple types while maintaining type safety.' },
        { text: 'What does the keyof keyword do?', options: ['Creates a key', 'Gets the keys of an object type', 'Returns object keys at runtime', 'Creates a key-value pair'], correctAnswer: 1, explanation: 'keyof T yields a union of the keys (property names) of type T.' },
        { text: 'What is a type guard?', options: ['A runtime check that narrows types', 'A security feature', 'A type definition', 'A compile-time check'], correctAnswer: 0, explanation: 'A type guard is a runtime expression that narrows down the type within a conditional block.' },
        { text: 'What does the satisfies operator do?', options: ['Validates a types structure', 'Assigns a type', 'Creates a type alias', 'Checks runtime type'], correctAnswer: 0, explanation: 'satisfies checks that an expressions type matches a type without affecting the inferred type.' },
        { text: 'How do decorators work in TypeScript?', options: ['At compile time only', 'At runtime using metadata', 'They are not supported', 'Only on classes'], correctAnswer: 1, explanation: 'Decorators are functions that run at runtime, modifying classes, methods, or properties using metadata.' },
      ],
    },
  ],
  react: [
    {
      title: 'React Fundamentals',
      description: 'Components, JSX, and basic React concepts',
      difficulty: 'beginner',
      timeLimit: 300,
      passingScore: 70,
      questions: [
        { text: 'What is JSX?', options: ['A JavaScript XML syntax extension', 'A templating engine', 'A CSS framework', 'A build tool'], correctAnswer: 0, explanation: 'JSX is a syntax extension for JavaScript that looks like HTML and is used in React.' },
        { text: 'What hook manages local state in a functional component?', options: ['useEffect', 'useState', 'useReducer', 'useContext'], correctAnswer: 1, explanation: 'useState is the primary hook for managing local state in functional components.' },
        { text: 'What does useEffect handle?', options: ['State management', 'Side effects like data fetching', 'Event handling', 'Component styling'], correctAnswer: 1, explanation: 'useEffect handles side effects such as data fetching, subscriptions, and DOM manipulation.' },
        { text: 'How do you pass data from parent to child?', options: ['Using state', 'Using props', 'Using refs', 'Using context'], correctAnswer: 1, explanation: 'Props (properties) pass data from parent components to child components.' },
        { text: 'What is the virtual DOM?', options: ['A reduced version of the real DOM', 'A representation of the UI in memory', 'A browser API', 'A testing tool'], correctAnswer: 1, explanation: 'The virtual DOM is a lightweight JavaScript representation of the UI kept in memory, synced with the real DOM via reconciliation.' },
      ],
    },
    {
      title: 'React Hooks & Patterns',
      description: 'Advanced hooks and component patterns',
      difficulty: 'intermediate',
      timeLimit: 420,
      passingScore: 70,
      questions: [
        { text: 'Which hook replaces componentDidMount?', options: ['useState', 'useEffect with empty deps', 'useRef', 'useLayoutEffect'], correctAnswer: 1, explanation: 'useEffect with an empty dependency array [] runs once after mount, similar to componentDidMount.' },
        { text: 'What is the purpose of useRef?', options: ['To create state', 'To persist values across renders without re-rendering', 'To fetch data', 'To handle form inputs'], correctAnswer: 1, explanation: 'useRef creates a mutable object that persists across renders without causing re-renders when changed.' },
        { text: 'What is the rules of hooks?', options: ['Call hooks inside loops', 'Call hooks at the top level and only in React functions', 'Call hooks conditionally', 'Call hooks outside components'], correctAnswer: 1, explanation: 'Hooks must be called at the top level of React functions, not inside conditions, loops, or nested functions.' },
        { text: 'What does React.memo do?', options: ['Memoizes state', 'Memoizes a component to skip re-renders', 'Memoizes hooks', 'Memoizes effects'], correctAnswer: 1, explanation: 'React.memo is a higher-order component that memoizes the render, skipping re-renders if props have not changed.' },
        { text: 'What is the context API used for?', options: ['Server-side rendering', 'Prop drilling through deep trees', 'State management without props', 'Both B and C'], correctAnswer: 3, explanation: 'Context provides a way to pass data through the component tree without passing props manually at every level, solving prop drilling.' },
      ],
    },
    {
      title: 'React Performance & Testing',
      description: 'Performance optimization and testing strategies',
      difficulty: 'advanced',
      timeLimit: 360,
      passingScore: 75,
      questions: [
        { text: 'What is code splitting?', options: ['Splitting code into smaller bundles loaded on demand', 'Separating CSS from JS', 'Splitting components into files', 'Code review splitting'], correctAnswer: 0, explanation: 'Code splitting breaks the bundle into smaller chunks loaded lazily, reducing initial load time.' },
        { text: 'Which hook is used for performance optimization?', options: ['useMemo and useCallback', 'useState', 'useEffect', 'useRef'], correctAnswer: 0, explanation: 'useMemo memoizes values and useCallback memoizes functions to prevent unnecessary re-computations.' },
        { text: 'What is React.lazy used for?', options: ['Lazy state initialization', 'Lazy loading components', 'Lazy event handling', 'Lazy rendering'], correctAnswer: 1, explanation: 'React.lazy enables dynamic import-based code splitting, loading components lazily.' },
      ],
    },
  ],
  nodejs: [
    {
      title: 'Node.js Fundamentals',
      description: 'Node.js core concepts and architecture',
      difficulty: 'beginner',
      timeLimit: 300,
      passingScore: 70,
      questions: [
        { text: 'What is Node.js?', options: ['A JavaScript framework', 'A JavaScript runtime built on Chromes V8 engine', 'A database', 'A CSS preprocessor'], correctAnswer: 1, explanation: 'Node.js is a JavaScript runtime built on Chromes V8 JavaScript engine for server-side applications.' },
        { text: 'What is the event loop?', options: ['A loop in the DOM', 'Node.js mechanism for handling async operations', 'A CSS animation', 'A database query'], correctAnswer: 1, explanation: 'The event loop allows Node.js to perform non-blocking I/O operations despite being single-threaded.' },
        { text: 'Which module is used for file system operations?', options: ['http', 'fs', 'path', 'os'], correctAnswer: 1, explanation: 'The fs (file system) module provides APIs for interacting with the file system.' },
        { text: 'What is npm?', options: ['Node Performance Manager', 'Node Package Manager', 'Network Protocol Manager', 'Node Process Manager'], correctAnswer: 1, explanation: 'npm is the default package manager for Node.js, managing dependencies and scripts.' },
        { text: 'What does process.nextTick() do?', options: ['Runs callback after current operation', 'Runs callback in next iteration', 'Creates a timer', 'Waits for next tick'], correctAnswer: 0, explanation: 'process.nextTick() registers a callback to run after the current operation completes, before the event loop continues.' },
      ],
    },
    {
      title: 'Node.js Advanced Concepts',
      description: 'Streams, error handling, and performance',
      difficulty: 'advanced',
      timeLimit: 420,
      passingScore: 70,
      questions: [
        { text: 'What are streams in Node.js?', options: ['HTTP requests', 'Data flow for reading/writing piece by piece', 'Database connections', 'File types'], correctAnswer: 1, explanation: 'Streams process data piece by piece without loading everything into memory, ideal for large datasets.' },
        { text: 'What is the cluster module used for?', options: ['Connecting databases', 'Creating child processes for load balancing', 'Managing files', 'Handling errors'], correctAnswer: 1, explanation: 'The cluster module creates child processes that share server ports for load balancing across CPU cores.' },
        { text: 'What is middleware in Express?', options: ['Database ORM', 'Functions with access to request/response cycle', 'Environment variables', 'Error handlers'], correctAnswer: 1, explanation: 'Middleware functions have access to the request and response objects and can modify them or end the request-response cycle.' },
        { text: 'How do you handle uncaught exceptions?', options: ['process.on(uncaughtException)', 'try/catch blocks', 'Error middleware', 'Promise.catch()'], correctAnswer: 0, explanation: 'process.on(uncaughtException) is a global handler for uncaught exceptions, but best practice is to let the process exit and restart.' },
        { text: 'What is the purpose of the buffer class?', options: ['Data caching', 'Handling binary data', 'Memory management', 'String operations'], correctAnswer: 1, explanation: 'Buffer handles raw binary data in Node.js, especially when reading files or network packets.' },
      ],
    },
  ],
  'rest-apis': [
    {
      title: 'REST API Design Principles',
      description: 'HTTP methods, status codes, and RESTful design',
      difficulty: 'beginner',
      timeLimit: 300,
      passingScore: 70,
      questions: [
        { text: 'What HTTP method is used to retrieve a resource?', options: ['POST', 'GET', 'PUT', 'DELETE'], correctAnswer: 1, explanation: 'GET retrieves a resource from the server without side effects (idempotent).' },
        { text: 'What does 404 status code mean?', options: ['OK', 'Created', 'Not Found', 'Internal Server Error'], correctAnswer: 2, explanation: '404 indicates the requested resource was not found on the server.' },
        { text: 'Which method is idempotent?', options: ['POST', 'GET', 'PATCH', 'Both GET and PUT'], correctAnswer: 3, explanation: 'GET, PUT, DELETE, and HEAD are idempotent meaning multiple identical requests have the same effect as one.' },
        { text: 'What is HATEOAS?', options: ['A caching strategy', 'A principle where APIs provide related links', 'An authentication method', 'A database system'], correctAnswer: 1, explanation: 'HATEOAS includes links in API responses to guide clients to related resources.' },
        { text: 'What is the correct status for successful resource creation?', options: ['200 OK', '201 Created', '202 Accepted', '204 No Content'], correctAnswer: 1, explanation: '201 Created is returned when a POST request successfully creates a new resource.' },
      ],
    },
  ],
}

const flashCardTemplates: Record<string, FlashCardData[]> = {
  html: [
    { front: 'What is HTML?', back: 'HyperText Markup Language - the standard language for creating web pages and web applications.', difficulty: 'beginner' },
    { front: 'What is the difference between div and span?', back: 'div is a block-level element that takes full width. span is an inline element that only takes content width.', difficulty: 'beginner' },
    { front: 'What are semantic HTML elements?', back: 'Elements with meaning like <header>, <nav>, <main>, <article>, <section>, <footer>. They improve accessibility and SEO.', difficulty: 'intermediate' },
    { front: 'What is the box model?', back: 'Every element is a box with: content, padding, border, and margin areas. Total width = content + padding + border + margin.', difficulty: 'beginner' },
    { front: 'What attributes does the <a> tag use?', back: 'href (URL), target (_self/_blank/_parent/_top), rel (noreferrer noopener), download, and title.', difficulty: 'beginner' },
    { front: 'What is the purpose of aria-label?', back: 'Provides an accessible label for elements when visible text is not present, used by screen readers.', difficulty: 'intermediate' },
    { front: 'What is the <template> element?', back: 'Holds HTML fragments not rendered on page load. Can be cloned and inserted dynamically via JavaScript.', difficulty: 'intermediate' },
    { front: 'What are data-* attributes?', back: 'Custom attributes that store private data on elements. Accessible via dataset property in JavaScript.', difficulty: 'intermediate' },
  ],
  css: [
    { front: 'What is the cascade in CSS?', back: 'The algorithm determining which styles apply when multiple rules target the same element. Order: importance, specificity, source order.', difficulty: 'beginner' },
    { front: 'What is specificity?', back: 'How CSS decides which rule wins: inline styles (1000) > IDs (100) > classes/attributes (10) > elements (1).', difficulty: 'beginner' },
    { front: 'What is the difference between flex and grid?', back: 'Flexbox is one-dimensional (row OR column). Grid is two-dimensional (rows AND columns simultaneously).', difficulty: 'intermediate' },
    { front: 'What are CSS custom properties?', back: 'Variables defined with -- prefix (e.g., --primary-color). Accessed via var() function. Can be scoped and overridden.', difficulty: 'intermediate' },
    { front: 'What is the stacking context?', back: 'A three-dimensional conceptualization of elements along the z-axis. Created by position, opacity, transforms, etc.', difficulty: 'advanced' },
    { front: 'What is container queries?', back: 'Modern CSS that allows styling based on container size rather than viewport, using @container rule.', difficulty: 'advanced' },
    { front: 'What is the difference between em and rem?', back: 'em is relative to parent font size. rem is relative to root (html) font size. rem avoids compounding issues.', difficulty: 'intermediate' },
    { front: 'What does will-change do?', back: 'Hints to the browser about upcoming property changes, enabling optimization like creating a new compositor layer.', difficulty: 'advanced' },
  ],
  javascript: [
    { front: 'What is hoisting?', back: 'JavaScripts behavior of moving declarations (not initializations) to the top of their scope before execution.', difficulty: 'intermediate' },
    { front: 'What is the difference between == and ===?', back: '== compares with type coercion (5 == "5" is true). === compares without coercion (strict equality).', difficulty: 'beginner' },
    { front: 'What is a closure?', back: 'A function that retains access to its outer scope even after the outer function has returned. Enables data privacy.', difficulty: 'intermediate' },
    { front: 'What is the event delegation pattern?', back: 'Attaching a single event listener to a parent to handle events from children via event bubbling, improving performance.', difficulty: 'intermediate' },
    { front: 'What is the difference between call, apply, and bind?', back: 'call(fn, arg1, arg2) and apply(fn, [args]) invoke immediately. bind(fn) returns a new function with bound this.', difficulty: 'intermediate' },
    { front: 'What is a Promise?', back: 'An object representing eventual completion of an async operation. States: pending, fulfilled, rejected.', difficulty: 'intermediate' },
    { front: 'What is the event loop?', back: 'Mechanism that coordinates the call stack, callback queue, and microtask queue for async execution in JS.', difficulty: 'advanced' },
    { front: 'What is debouncing vs throttling?', back: 'Debouncing delays execution until pauses. Throttling limits execution rate (e.g., once per N ms).', difficulty: 'advanced' },
    { front: 'What are Symbols?', back: 'Unique, immutable primitive values used as private object property keys, created via Symbol().', difficulty: 'advanced' },
    { front: 'What is the temporal dead zone?', back: 'The period between entering scope and variable declaration where let/const variables cannot be accessed (ReferenceError).', difficulty: 'advanced' },
  ],
  typescript: [
    { front: 'What is the difference between interface and type?', back: 'interface can be extended/merged, type creates aliases and can use unions/intersections. Both are similar for objects.', difficulty: 'beginner' },
    { front: 'What are union types?', back: 'A type that can be one of several types, defined with | (e.g., string | number).', difficulty: 'beginner' },
    { front: 'What are intersection types?', back: 'A type combining multiple types into one, defined with & (e.g., A & B has all properties of both).', difficulty: 'intermediate' },
    { front: 'What is the never type?', back: 'Represents values that never occur. Used for functions that always throw or have infinite loops.', difficulty: 'intermediate' },
    { front: 'What are mapped types?', back: 'Types created by transforming properties of an existing type using { [P in K]: T } syntax.', difficulty: 'advanced' },
    { front: 'What is the satisfies operator?', back: 'Validates that a type matches without widening it, preserving the exact inferred type for IDE support.', difficulty: 'advanced' },
    { front: 'What are template literal types?', back: 'Types created using template literal syntax with placeholders, enabling string pattern matching.', difficulty: 'advanced' },
    { front: 'What is module augmentation?', back: 'Adding new declarations to existing modules by declaring the same module name, extending third-party types.', difficulty: 'advanced' },
  ],
  react: [
    { front: 'What is the virtual DOM?', back: 'A lightweight JavaScript representation of the UI, allowing React to compute minimal DOM updates efficiently.', difficulty: 'beginner' },
    { front: 'What is the key prop used for?', back: 'Helps React identify which items changed in lists. Keys should be unique, stable, and predictable (not array index).', difficulty: 'beginner' },
    { front: 'What is the difference between state and props?', back: 'State is mutable internal data. Props are immutable external data passed from parent components.', difficulty: 'beginner' },
    { front: 'What is prop drilling?', back: 'Passing props through multiple component levels to reach deeply nested components. Solved with Context API or state management.', difficulty: 'intermediate' },
    { front: 'What is the useCallback hook?', back: 'Returns a memoized callback function that only changes when its dependencies change, preventing unnecessary re-renders.', difficulty: 'intermediate' },
    { front: 'What is a higher-order component?', back: 'A function that takes a component and returns a new component with enhanced functionality (e.g., withAuth, withLogger).', difficulty: 'intermediate' },
    { front: 'What is the reconciliation algorithm?', back: 'React algorithm that diffs the virtual DOM tree to determine minimal DOM updates, using type checks and keys.', difficulty: 'advanced' },
    { front: 'What are React portals?', back: 'Render children into a different DOM subtree outside the parent component, useful for modals and tooltips.', difficulty: 'advanced' },
    { front: 'What is Suspense?', back: 'A component that lets you specify a fallback (loading state) for components with async dependencies.', difficulty: 'advanced' },
    { front: 'What is the StrictMode component?', back: 'Development-only wrapper that detects potential problems by double-invoking (re-rendering) components.', difficulty: 'intermediate' },
  ],
  'rest-apis': [
    { front: 'What are REST constraints?', back: 'Client-server, stateless, cacheable, uniform interface, layered system, code on demand (optional).', difficulty: 'beginner' },
    { front: 'What is idempotence?', back: 'Multiple identical requests produce the same effect as one request. GET, PUT, DELETE are idempotent.', difficulty: 'beginner' },
    { front: 'What is the difference between PUT and PATCH?', back: 'PUT replaces the entire resource. PATCH applies partial modifications to a resource.', difficulty: 'intermediate' },
    { front: 'What is content negotiation?', back: 'Mechanism where client and server agree on response format using Accept and Content-Type headers.', difficulty: 'intermediate' },
    { front: 'What are idempotency keys?', back: 'Unique tokens clients send to prevent duplicate processing of POST requests on retry.', difficulty: 'advanced' },
    { front: 'What is the Richardson Maturity Model?', back: 'Levels of REST maturity: Level 0 (XML), Level 1 (Resources), Level 2 (HTTP Verbs), Level 3 (HATEOAS).', difficulty: 'advanced' },
  ],
  expressjs: [
    { front: 'What is middleware in Express?', back: 'Functions with access to req, res, and next that can execute code, modify req/res, end cycle, or call next middleware.', difficulty: 'beginner' },
    { front: 'What is the difference between app.use and app.get?', back: 'app.use matches any HTTP method and path prefix. app.get matches only GET to exact path.', difficulty: 'intermediate' },
    { front: 'What is error handling middleware?', back: 'A middleware with four parameters (err, req, res, next) that catches errors from other middleware.', difficulty: 'intermediate' },
  ],
  authentication: [
    { front: 'What is JWT?', back: 'JSON Web Token - a compact URL-safe token containing JSON claims, signed to verify authenticity.', difficulty: 'beginner' },
    { front: 'What is the difference between access and refresh tokens?', back: 'Access tokens are short-lived (minutes/hours) for API auth. Refresh tokens are long-lived for obtaining new access tokens.', difficulty: 'intermediate' },
    { front: 'What is OAuth 2.0?', back: 'An authorization framework with grant types: authorization code, implicit, client credentials, and resource owner password.', difficulty: 'intermediate' },
    { front: 'What is CSRF?', back: 'Cross-Site Request Forgery - an attack tricking users into executing unwanted actions. Prevented with CSRF tokens or SameSite cookies.', difficulty: 'advanced' },
  ],
  'system-design': [
    { front: 'What is CAP theorem?', back: 'A distributed system can only provide two of three: Consistency, Availability, Partition Tolerance.', difficulty: 'intermediate' },
    { front: 'What is horizontal vs vertical scaling?', back: 'Horizontal = adding more machines. Vertical = adding more power (CPU/RAM) to existing machine.', difficulty: 'beginner' },
    { front: 'What is a CDN?', back: 'Content Delivery Network - distributed servers that cache and serve content from locations closer to users.', difficulty: 'beginner' },
    { front: 'What is sharding?', back: 'Horizontal partitioning of data across multiple databases based on a shard key to distribute load.', difficulty: 'intermediate' },
    { front: 'What is eventual consistency?', back: 'A consistency model where updates propagate asynchronously, and all replicas eventually become consistent.', difficulty: 'intermediate' },
    { front: 'What is a load balancer?', back: 'Distributes incoming traffic across multiple servers using algorithms like round-robin, least connections, etc.', difficulty: 'beginner' },
    { front: 'What is CQRS?', back: 'Command Query Responsibility Segregation - separates read and write operations into different models for scalability.', difficulty: 'advanced' },
    { front: 'What is the difference between SQL and NoSQL?', back: 'SQL: structured schema, ACID, joins, vertical scaling. NoSQL: flexible schema, BASE, horizontal scaling, various data models.', difficulty: 'intermediate' },
    { front: 'What is a message queue?', back: 'Asynchronous communication between services using producers and consumers. Examples: RabbitMQ, Kafka, SQS.', difficulty: 'intermediate' },
    { front: 'What is a reverse proxy?', back: 'A server that sits in front of application servers, handling requests forwarding, caching, SSL termination, and load balancing.', difficulty: 'intermediate' },
  ],
  dsa: [
    { front: 'What is Big O notation?', back: 'Describes the asymptotic upper bound of algorithm runtime/space as input grows. O(1), O(n), O(n²), O(log n).', difficulty: 'beginner' },
    { front: 'What is the difference between BFS and DFS?', back: 'BFS explores level by level using a queue (finds shortest path). DFS explores depth first using a stack (uses less memory).', difficulty: 'intermediate' },
    { front: 'What is a hash table?', back: 'Data structure mapping keys to values via hash function. Average O(1) lookup. Handles collisions with chaining or open addressing.', difficulty: 'intermediate' },
    { front: 'What is dynamic programming?', back: 'Breaking problems into overlapping subproblems, solving each once, and storing results. Top-down (memoization) or bottom-up (tabulation).', difficulty: 'advanced' },
    { front: 'What is the two-pointer technique?', back: 'Using two pointers to iterate data structure from different positions. Common in sorted array problems (e.g., reversing, pair sum).', difficulty: 'intermediate' },
    { front: 'What is a balanced BST?', back: 'Binary Search Tree where height difference between left/right subtrees is at most 1 (AVL) or limited (Red-Black). Guarantees O(log n) operations.', difficulty: 'intermediate' },
    { front: 'What is the sliding window technique?', back: 'Maintaining a subset of elements that satisfy a condition, expanding/shrinking the window. Used for substring/array problems.', difficulty: 'intermediate' },
    { front: 'What is a trie?', back: 'A tree data structure for storing strings, where each node represents a character. Used for autocomplete and spell checking.', difficulty: 'advanced' },
    { front: 'What is topological sort?', back: 'Linear ordering of DAG vertices where every directed edge u→v comes before v. Used in dependency resolution.', difficulty: 'advanced' },
    { front: 'What is the Floyd Warshall algorithm?', back: 'Finds shortest paths between all pairs of vertices using dynamic programming. O(V³) time complexity.', difficulty: 'advanced' },
  ],
}

const otherTechCards: Record<string, FlashCardData[]> = {
  nextjs: [
    { front: 'What is the App Router in Next.js?', back: 'The new routing paradigm using the app/ directory with file-based routing, layouts, server components, and streaming.', difficulty: 'intermediate' },
    { front: 'What is SSR vs SSG vs ISR?', back: 'SSR renders on request. SSG pre-builds at build time. ISR revalidates static content at intervals after build.', difficulty: 'intermediate' },
    { front: 'What are React Server Components?', back: 'Server-only rendered components that reduce client JS. Cannot use hooks or browser APIs. Enabled by default in Next.js 13+.', difficulty: 'advanced' },
  ],
  nodejs: [
    { front: 'What is the libuv library?', back: 'A C library providing the event loop, async I/O, and thread pool for Node.js cross-platform support.', difficulty: 'advanced' },
    { front: 'What is the difference between CommonJS and ES Modules?', back: 'CJS uses require/module.exports (sync). ESM uses import/export (async, tree-shakeable). Node.js supports both.', difficulty: 'intermediate' },
    { front: 'What is the thread pool in Node.js?', back: 'libuv thread pool (default 4 threads) handles CPU-intensive or blocking I/O operations, preventing event loop blocking.', difficulty: 'advanced' },
  ],
  postgresql: [
    { front: 'What is a primary key?', back: 'A column or combination that uniquely identifies each row. Automatically indexed and enforces uniqueness and not-null.', difficulty: 'beginner' },
    { front: 'What are indexes used for?', back: 'Data structures that speed up query execution by enabling fast lookup, at the cost of slower writes and storage.', difficulty: 'intermediate' },
    { front: 'What is a foreign key?', back: 'A column referencing another tables primary key, enforcing referential integrity across related tables.', difficulty: 'beginner' },
    { front: 'What are window functions?', back: 'Functions performing calculations across related rows without collapsing them. Uses OVER(), PARTITION BY, ORDER BY.', difficulty: 'advanced' },
  ],
  mongodb: [
    { front: 'What is a document in MongoDB?', back: 'A record in MongoDB, stored as BSON (Binary JSON) with dynamic schema, allowing nested data and arrays.', difficulty: 'beginner' },
    { front: 'What is the aggregation pipeline?', back: 'A framework for data processing with stages like $match, $group, $sort, $project that transform documents sequentially.', difficulty: 'intermediate' },
    { front: 'What is the difference between embedding and referencing?', back: 'Embedding stores related data in the same document (fast reads). Referencing stores IDs (flexible, normalized).', difficulty: 'intermediate' },
  ],
  redis: [
    { front: 'What data types does Redis support?', back: 'String, List, Set, Sorted Set, Hash, Bitmap, HyperLogLog, Stream, Geospatial indexes.', difficulty: 'beginner' },
    { front: 'What is Redis persistence?', back: 'RDB (snapshots at intervals) and AOF (append-only log of operations). Can be used independently or together.', difficulty: 'intermediate' },
    { front: 'What is Redis Pub/Sub?', back: 'Messaging pattern where publishers send messages to channels and subscribers receive them. Fire-and-forget, no persistence.', difficulty: 'intermediate' },
  ],
  git: [
    { front: 'What is the difference between merge and rebase?', back: 'Merge creates a merge commit preserving history. Rebase rewrites history by applying commits on top of another branch.', difficulty: 'intermediate' },
    { front: 'What is git stash?', back: 'Temporarily saves uncommitted changes, allowing you to switch branches and apply them back later with pop or apply.', difficulty: 'beginner' },
    { front: 'What is git bisect?', back: 'Binary search through git history to find the commit that introduced a bug. Marks commits as good or bad.', difficulty: 'advanced' },
  ],
  docker: [
    { front: 'What is the difference between an image and a container?', back: 'An image is a read-only template. A container is a runnable instance of an image with a writable layer.', difficulty: 'beginner' },
    { front: 'What is a multi-stage build?', back: 'Using multiple FROM statements in a Dockerfile to separate build dependencies from the final runtime image, reducing size.', difficulty: 'intermediate' },
    { front: 'What is Docker Compose?', back: 'A tool for defining and running multi-container Docker applications using a YAML file for configuration.', difficulty: 'beginner' },
  ],
  cicd: [
    { front: 'What is CI vs CD?', back: 'CI (Continuous Integration) automates code integration and testing. CD (Continuous Delivery/Deployment) automates delivery to production.', difficulty: 'beginner' },
    { front: 'What is a GitHub Actions workflow?', back: 'An automated process defined in YAML with triggers, jobs, and steps. Runs on GitHub-hosted or self-hosted runners.', difficulty: 'intermediate' },
    { front: 'What is a blue-green deployment?', back: 'Two identical environments: one live (blue), one idle (green). Traffic switches to green for zero-downtime deployment.', difficulty: 'intermediate' },
  ],
  testing: [
    { front: 'What is the testing pyramid?', back: 'Unit tests (fast, many) at base, integration tests (medium) in middle, E2E tests (slow, few) at top.', difficulty: 'beginner' },
    { front: 'What is mocking?', back: 'Replacing real dependencies with controlled simulations for isolated testing. Avoids external service calls.', difficulty: 'intermediate' },
    { front: 'What is the difference between TDD and BDD?', back: 'TDD writes tests before code (red-green-refactor). BDD focuses on behavior with Given-When-Then scenarios.', difficulty: 'intermediate' },
  ],
  security: [
    { front: 'What is XSS?', back: 'Cross-Site Scripting - injecting malicious scripts into web pages. Prevented by output encoding and CSP headers.', difficulty: 'intermediate' },
    { front: 'What is SQL Injection?', back: 'Injecting SQL commands through user input. Prevented by parameterized queries/prepared statements.', difficulty: 'intermediate' },
    { front: 'What is CSRF protection?', back: 'CSRF tokens, SameSite cookies, and origin/referer headers prevent unauthorized cross-origin requests.', difficulty: 'intermediate' },
    { front: 'What is the principle of least privilege?', back: 'Users and processes should only have the minimum permissions needed to perform their function.', difficulty: 'beginner' },
  ],
  performance: [
    { front: 'What are Core Web Vitals?', back: 'LCP (Loading), FID/INP (Interactivity), CLS (Visual Stability). Google ranking factors measuring user experience.', difficulty: 'intermediate' },
    { front: 'What is lazy loading?', back: 'Deferring loading of non-critical resources until needed. Reduces initial load time.', difficulty: 'intermediate' },
    { front: 'What is tree shaking?', back: 'Dead code elimination during bundling that removes unused exports, reducing bundle size.', difficulty: 'advanced' },
  ],
  graphql: [
    { front: 'What is a GraphQL schema?', back: 'Defines types, queries, mutations, and subscriptions. Acts as a contract between client and server.', difficulty: 'beginner' },
    { front: 'What is a resolver?', back: 'A function that resolves a field value in GraphQL. Each field in the schema maps to a resolver function.', difficulty: 'intermediate' },
    { front: 'What are GraphQL subscriptions?', back: 'Real-time updates via WebSocket. Client subscribes to events and receives data when triggered.', difficulty: 'advanced' },
  ],
  'ci/cd': [], nginx: [], pm2: [],
}

function getTechSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

function generateTopicQuizData(topic: {
  title: string
  description: string
  difficulty: string
  technology: { name: string }
}): QuizData {
  const title = topic.title
  const tech = topic.technology.name

  const questions: QuestionData[] = [
    {
      text: `In simple words, what is "${title}" mainly about?`,
      options: [
        topic.description,
        `A tool used only to change the visual color of ${tech} code`,
        `A database backup strategy unrelated to ${tech}`,
        'A shortcut that removes the need to understand fundamentals',
      ],
      correctAnswer: 0,
      explanation: `${title} is best understood through its main purpose: ${topic.description}`,
    },
    {
      text: `Why should a developer learn ${title}?`,
      options: [
        `It helps solve practical ${tech} problems and explain decisions in interviews`,
        'It is only useful for memorizing definitions',
        'It replaces all testing and debugging',
        'It is only needed by designers, not developers',
      ],
      correctAnswer: 0,
      explanation: `${title} is useful because it appears in real implementation, debugging, and interview discussions.`,
    },
    {
      text: `When working with ${title}, what should you do first?`,
      options: [
        'Understand the goal and expected behavior',
        'Add the most complex abstraction immediately',
        'Ignore edge cases until production',
        'Copy code without reading it',
      ],
      correctAnswer: 0,
      explanation: 'Good engineering starts by understanding the requirement before choosing an implementation.',
    },
    {
      text: `Which habit is most helpful while learning ${title}?`,
      options: [
        'Build a small example and explain each line',
        'Only read the heading and skip practice',
        'Avoid debugging because it wastes time',
        'Memorize random syntax without context',
      ],
      correctAnswer: 0,
      explanation: 'Small examples make the concept concrete and easier to remember.',
    },
    {
      text: `What is a common beginner mistake with ${title}?`,
      options: [
        'Using it without understanding the problem it solves',
        'Reading official documentation',
        'Testing with simple inputs first',
        'Writing notes after practice',
      ],
      correctAnswer: 0,
      explanation: 'Using a concept blindly often creates bugs or over-complicated code.',
    },
    {
      text: `How can you check if your ${title} implementation is correct?`,
      options: [
        'Test normal cases, edge cases, and failure cases',
        'Only check that the page opens once',
        'Assume it works if there are no TypeScript errors',
        'Remove validation to avoid errors',
      ],
      correctAnswer: 0,
      explanation: 'Correctness needs multiple examples, including edge and failure cases.',
    },
    {
      text: `In an interview, what is the best way to answer a ${title} question?`,
      options: [
        'Explain the purpose, show an example, then mention trade-offs',
        'Give only a one-word definition',
        'Start coding before clarifying the problem',
        'Avoid talking about edge cases',
      ],
      correctAnswer: 0,
      explanation: 'Strong interview answers connect definition, implementation, and reasoning.',
    },
    {
      text: `Which statement best describes production-ready use of ${title}?`,
      options: [
        'It should be readable, tested, and handle realistic edge cases',
        'It only needs to work on your machine',
        'It should always be the shortest possible code',
        'It should hide errors from users and developers',
      ],
      correctAnswer: 0,
      explanation: 'Production code must be maintainable and reliable, not just clever.',
    },
    {
      text: `What should you document after implementing ${title}?`,
      options: [
        'Important decisions, assumptions, and known limitations',
        'Only the author name',
        'Nothing, because code is always self-explanatory',
        'Private secrets used by the app',
      ],
      correctAnswer: 0,
      explanation: 'Documentation helps future developers understand why the code exists.',
    },
    {
      text: `What makes ${title} different from simply memorizing ${tech} syntax?`,
      options: [
        'It requires understanding when, why, and how to apply the idea',
        'It only needs copy-paste skills',
        'It avoids real-world trade-offs',
        'It never appears in debugging',
      ],
      correctAnswer: 0,
      explanation: 'Real learning means applying the concept in context, not just knowing syntax.',
    },
    {
      text: `If your ${title} code works for one input but fails for another, what should you do?`,
      options: [
        'Compare the inputs, reproduce the failure, and inspect the assumptions',
        'Delete the failing test',
        'Increase the timeout without investigating',
        'Rewrite the whole project immediately',
      ],
      correctAnswer: 0,
      explanation: 'Debugging starts by reproducing the problem and finding the broken assumption.',
    },
    {
      text: `Which type of example is best for practicing ${title}?`,
      options: [
        `A small ${tech} example with one realistic edge case`,
        'A huge project copied from the internet',
        'An example with no explanation',
        'A screenshot without code',
      ],
      correctAnswer: 0,
      explanation: 'Focused examples help you understand the moving parts clearly.',
    },
    {
      text: `What should you consider before choosing ${title} in a project?`,
      options: [
        'The requirement, complexity, team readability, and long-term maintenance',
        'Only whether it sounds advanced',
        'Only whether it uses fewer lines',
        'Only whether it is popular on social media',
      ],
      correctAnswer: 0,
      explanation: 'Good choices balance technical fit with maintainability.',
    },
    {
      text: `What is the safest mindset when learning ${title}?`,
      options: [
        'Understand the concept, practice it, then explain it in your own words',
        'Skip fundamentals and jump to advanced tricks',
        'Avoid asking why the code works',
        'Assume every tutorial is production-ready',
      ],
      correctAnswer: 0,
      explanation: 'Explaining in your own words is a strong signal that you actually understand it.',
    },
    {
      text: `Which question should you ask yourself after studying ${title}?`,
      options: [
        `Can I build a working ${tech} example and explain the trade-offs?`,
        'Can I avoid writing any code?',
        'Can I memorize one sentence only?',
        'Can I ignore testing completely?',
      ],
      correctAnswer: 0,
      explanation: 'The goal is practical understanding: build, explain, test, and reason.',
    },
  ]

  return {
    title: `${title} Mastery Quiz`,
    description: `A 15-question quiz to check your real understanding of ${title}.`,
    difficulty: topic.difficulty as Difficulty,
    timeLimit: 900,
    passingScore: 70,
    questions,
  }
}

async function main() {
  console.log('Seeding quizzes and flashcards...')

  const allTopics = await prisma.topic.findMany({ include: { technology: true } })
  console.log(`Found ${allTopics.length} topics`)

  await prisma.quizAttempt.deleteMany()
  await prisma.question.deleteMany()
  await prisma.quiz.deleteMany()
  await prisma.flashCard.deleteMany()
  console.log('Cleared old quizzes, attempts, questions, and flashcards')

  // Seed quizzes
  let quizCount = 0
  let questionCount = 0

  for (const topic of allTopics) {
    const topicQuizzes = [generateTopicQuizData(topic)]

    for (const quizData of topicQuizzes) {
      await prisma.quiz.create({
        data: {
          title: quizData.title,
          description: quizData.description,
          difficulty: quizData.difficulty,
          timeLimit: quizData.timeLimit,
          passingScore: quizData.passingScore,
          isDaily: false,
          topicId: topic.id,
          questions: {
            create: quizData.questions.map((q, i) => ({
              text: q.text,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              order: i + 1,
            })),
          },
        },
      })
      quizCount++
      questionCount += quizData.questions.length
    }
  }

  console.log(`Created ${quizCount} quizzes with ${questionCount} questions`)

  // Seed daily quiz for each technology that has quizzes
  const techsWithQuizzes = Object.keys(quizTemplates)
  for (const techSlug of techsWithQuizzes) {
    const tech = await prisma.technology.findUnique({ where: { slug: techSlug } })
    if (!tech) continue

    const topic = await prisma.topic.findFirst({
      where: { technologyId: tech.id, isPublished: true },
      orderBy: { order: 'asc' },
    })
    if (!topic) continue

    const quizData = generateTopicQuizData({ ...topic, technology: tech })

    await prisma.quiz.create({
      data: {
        title: `Daily Quiz: ${topic.title}`,
        description: 'Your daily challenge - test your knowledge!',
        difficulty: quizData.difficulty,
        timeLimit: 900,
        passingScore: 60,
        isDaily: true,
        topicId: topic.id,
        questions: {
          create: quizData.questions.map((q, i) => ({
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            order: i + 1,
          })),
        },
      },
    })
  }

  console.log('Daily quizzes created')

  // Seed flashcards
  let flashCardCount = 0

  for (const topic of allTopics) {
    const techSlug = topic.technology.slug
    const techCards = flashCardTemplates[techSlug] || []
    const otherCards = otherTechCards[techSlug] || []
    const cards = [...techCards, ...otherCards]

    if (cards.length === 0) continue

    for (const cardData of cards) {
      const existingCard = await prisma.flashCard.findFirst({
        where: { topicId: topic.id, front: cardData.front },
      })
      if (existingCard) continue

      await prisma.flashCard.create({
        data: {
          front: cardData.front,
          back: cardData.back,
          difficulty: cardData.difficulty,
          topicId: topic.id,
          order: flashCardCount + 1,
        },
      })
      flashCardCount++
    }
  }

  console.log(`Created ${flashCardCount} flashcards`)
  console.log('Quiz and flashcard seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
