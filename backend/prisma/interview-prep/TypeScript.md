<!--LANG:roman-->

# TypeScript Interview Questions

## 1. What is TypeScript and how does it differ from JavaScript?

**Asaan Urdu mein:**  
TypeScript ek statically typed superset hai JavaScript ka jo plain JavaScript mein compile hota hai. Ye optional static types, interfaces, generics wagaira add karta hai jo JavaScript mein nahi hoti. JavaScript runtime pe errors dikhata, jabke TypeScript compile time pe type errors pakad leta hai.  

```typescript
function greet(name: string): string {
  return `Hello, ${name}`;
}

// TypeScript catches this error at compile time:
// greet(42); // Error: Argument of type 'number' is not assignable to parameter of type 'string'
```

---

## 2. What are the benefits of using TypeScript in a large codebase?

**Asaan Urdu mein:**  
Static type checking se code quality behtar hoti hai aur refactoring safe ho jata hai. IDE autocomplete, navigation aur refactor tools zyada powerful ho jate hain. Types documentation ki tarah kaam karte hain, is liye naye developers ko code samajhne mein asani hoti hai.  

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Refactoring is safe — changing User breaks at compile time
function getUserEmail(user: User): string {
  return user.email;
}
```

---

## 3. What is the difference between interface and type in TypeScript?

**Asaan Urdu mein:**  
Interface ko merge (declaration merging) kiya ja sakta hai aur `extends` se extend hoti hain. Type alias primitives, unions, tuples, mapped types wagaira represent kar sakta hai lekin merge nahi hota. Objects ke shapes ke liye aam tor pe interface pasand ki jati hai, jabke complex compositions ke liye type zyada flexible hota hai.  

```typescript
// Interface — supports declaration merging
interface Person {
  name: string;
}
interface Person {
  age: number;
}
const p: Person = { name: "Alice", age: 30 }; // OK

// Type — cannot merge but can represent unions
type Status = "active" | "inactive";
type Point = { x: number; y: number };
```

---

## 4. What are generics in TypeScript and why are they useful?

**Asaan Urdu mein:**  
Generics aapko reusable components banane ka mauka dete hain jo multiple types ke saath kaam karte hain, bina type safety lose kiye. Ye type variables ki tarah kaam karte hain jo actual type ko capture karte hain, is se functions, classes, interfaces har type ke liye likhe ja sakte hain.  

```typescript
function identity<T>(arg: T): T {
  return arg;
}

const num = identity(42);    // type: number
const str = identity("hi");  // type: string

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
}
```

---

## 5. What is the difference between any, unknown, and never types?

**Asaan Urdu mein:**  
`any` type checking ko poori tarah se ignore karta hai – aap iske saath kuch bhi kar sakte hain. `unknown` safe counterpart hai; use use karne se pehle aapko narrow karna padta hai. `never` aise values ko represent karta hai jo kabhi exist nahi karte, jaise functions jo hamesha throw karte hain ya exhaustive narrowing ke baad ka type.  

```typescript
let a: any = "hello";
a = 42; a.trim(); // No errors

let u: unknown = "hello";
// u.trim(); // Error: Object is of type 'unknown'
if (typeof u === "string") {
  u.trim(); // OK — narrowed
}

function throwError(): never {
  throw new Error("Always throws");
}
```

---

## 6. What are union and intersection types?

**Asaan Urdu mein:**  
Union types (`|`) ek value ko multiple possible types me se ek banane ki ijazat dete hain. Intersection types (`&`) multiple types ko ek saath combine karte hain, jisme value ko sabhi types ko satisfy karna hota hai. Union choice ko dikhata hai, intersection combination ko.  

```typescript
// Union — value can be string or number
type ID = string | number;
function printId(id: ID) {
  if (typeof id === "string") console.log(id.toUpperCase());
  else console.log(id.toFixed(2));
}

// Intersection — value must have both name and age
type HasName = { name: string };
type HasAge = { age: number };
type Person = HasName & HasAge;
const p: Person = { name: "Alice", age: 30 };
```

---

## 7. What is type inference in TypeScript?

**Asaan Urdu mein:**  
TypeScript automatically variables aur expressions ke types ko unke values aur context se samajh leta hai. Is se aapko har variable ko explicit annotate karne ki zaroorat nahi hoti. Return statements, array callbacks, aur assignments sab inference ka hissa hain.  

```typescript
let count = 42;          // inferred as number
let message = "hello";   // inferred as string
let isDone = false;      // inferred as boolean

// Return type inferred from return statement
function add(a: number, b: number) {
  return a + b; // inferred as number
}

// Contextual typing — inferred from array method callback
const numbers = [1, 2, 3].map(n => n * 2); // n inferred as number
```

---

## 8. What are enums in TypeScript and when should you use them?

**Asaan Urdu mein:**  
Enums aapko named constants ka set define karne dete hain, numeric ya string based. Ye code ko readable banate hain. String enums debugging aur serialization ke liye behtar hain; const enums runtime overhead ko hata dete hain. Simple cases me string literal unions ka istemal bhi kiya ja sakta hai.  

```typescript
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

function move(direction: Direction) {
  console.log(`Moving ${direction}`);
}

move(Direction.Up); // "Moving UP"

// Alternative without runtime cost:
type Status = "success" | "error" | "pending";
```

---

## 9. What is the difference between a type alias and an interface for extending?

**Asaan Urdu mein:**  
Interfaces `extends` keyword se inherit kar sakti hain aur declaration merging ko support karti hain (ek hi interface ko multiple times declare karna). Type aliases `&` (intersection) se combine hoti hain aur merge nahi hoti. Jab merging ki zaroorat ho to interface behtar hoti hai.  

```typescript
interface Animal {
  name: string;
}
interface Dog extends Animal {
  breed: string;
}

// Type alias variant
type AnimalType = { name: string };
type DogType = AnimalType & { breed: string };

// Interface merging — adds petCount to Animal
interface Animal {
  petCount?: number;
}
```

---

## 10. What are utility types like Partial, Pick, Omit, and Readonly?

**Asaan Urdu mein:**  
Utility types built‑in generic transformations hain. `Partial<T>` sab properties ko optional banata hai. `Pick<T, K>` sirf selected keys ko rakhta hai. `Omit<T, K>` specified keys ko hata deta hai. `Readonly<T>` sab properties ko read‑only banata hai. Ye boilerplate ko kam karte hain.  

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// All properties become optional
const partial: Partial<User> = { name: "Alice" };

// Pick only id and name
const picked: Pick<User, "id" | "name"> = { id: 1, name: "Alice" };

// Omit email
const omitted: Omit<User, "email"> = { id: 1, name: "Alice" };

// All properties become readonly
const readonly: Readonly<User> = { id: 1, name: "Alice", email: "a@b.com" };
// readonly.id = 2; // Error
```

---

## 11. What is the difference between public, private, and protected in TypeScript classes?

**Asaan Urdu mein:**  
`public` (default) members har jagah se accessible hote hain. `private` sirf us class ke andar hi accessible hota hai. `protected` class aur uske subclasses dono ke liye accessible hota hai. Ye sirf compile‑time checks hain; runtime me JavaScript ke normal fields use hote hain unless `#` syntax use ki jaye.  

```typescript
class Base {
  public a = 1;
  private b = 2;
  protected c = 3;
}

class Derived extends Base {
  method() {
    console.log(this.a); // OK
    // console.log(this.b); // Error: Property 'b' is private
    console.log(this.c); // OK — protected accessible in subclass
  }
}

const obj = new Base();
console.log(obj.a); // OK
// console.log(obj.b); // Error
// console.log(obj.c); // Error
```

---

## 12. What are decorators in TypeScript?

**Asaan Urdu mein:**  
Decorators special functions hain jo classes, methods, properties, ya parameters ko design time pe modify karte hain. Ye `@` se start hote hain aur class define hone par execute hote hain. Experimental feature hain (stage 2) aur `experimentalDecorators` flag ki zaroorat hoti hai. Angular aur class‑validator me commonly use hotay hain.  

```typescript
function log(target: any, key: string) {
  let value = target[key];

  const getter = () => {
    console.log(`Getting ${key}: ${value}`);
    return value;
  };
  const setter = (newVal: any) => {
    console.log(`Setting ${key} to ${newVal}`);
    value = newVal;
  };

  Object.defineProperty(target, key, {
    get: getter,
    set: setter,
  });
}

class Person {
  @log
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
```

---

## 13. What is structural typing (duck typing) in TypeScript?

**Asaan Urdu mein:**  
Structural typing ka matlab hai ke TypeScript types ko unke **shape** (properties) ke basis pe compare karta hai, na ke unke explicit names pe. Agar do types ka structure same ho, to wo compatible maane jate hain, chahe unke names alag ho. Ye nominal typing (Java, C#) se mukhtalif hai.  

```typescript
interface Point {
  x: number;
  y: number;
}

interface Coordinate {
  x: number;
  y: number;
}

const pt: Point = { x: 1, y: 2 };
const coord: Coordinate = pt; // OK — same structure

function printPoint(p: Point) {
  console.log(p.x, p.y);
}

printPoint({ x: 3, y: 4 }); // OK — structural compatibility
```

---

## 14. What is the difference between tsconfig 'strict' mode options?

**Asaan Urdu mein:**  
`strict: true` ek single flag hai jo sabhi strict type‑checking options ko enable karta hai. Isme `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictPropertyInitialization`, `noImplicitThis`, `alwaysStrict`, aur `useUnknownInCatchVariables` shamil hain. Har ek option alag‑alagh bhi enable ki ja sakti hai.  

```typescript
// With strict: true, these will all error:
function fn(a) { }          // noImplicitAny: Parameter 'a' implicitly has 'any' type
const x: string = null;     // strictNullChecks: Type 'null' is not assignable to type 'string'
function onClick(this: Window) { } // noImplicitThis: 'this' implicitly has type 'any'

// tsconfig.json
{
  "compilerOptions": {
    "strict": true
    // Equivalent to enabling all of the above individually
  }
}
```

---

## 15. What are mapped types in TypeScript?

**Asaan Urdu mein:**  
Mapped types aapko existing type ke properties ko transform karne ka tareeqa dete hain. Syntax `{ [P in K]: T }` hota hai, jahan `K` usually keys ka union hota hai. `Partial`, `Readonly`, `Pick`, `Record` sab mapped types ki implementations hain.  

```typescript
interface User {
  name: string;
  age: number;
  email: string;
}

// Make all properties readonly and optional
type ReadonlyPartial<T> = {
  readonly [K in keyof T]?: T[K];
};

type UserView = ReadonlyPartial<User>;
// Equivalent to: { readonly name?: string; readonly age?: number; readonly email?: string }

// Custom mapped type converting all values to boolean
type Features<T> = {
  [K in keyof T]: boolean;
};

type UserFeatures = Features<User>;
// { name: boolean; age: boolean; email: boolean }
```

---

## 16. What are conditional types in TypeScript?

**Asaan Urdu mein:**  
Conditional types `T extends U ? X : Y` syntax se type ko condition ke hisaab se select karte hain. Ye compile time evaluate hoti hain aur powerful type transformations allow karti hain. `infer` keyword ke saath combine karke advanced utilities banayi ja sakti hain.  

```typescript
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>; // "yes"
type B = IsString<number>; // "no"

// Extracting return type using infer
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Fn = (x: number) => string;
type R = ReturnType<Fn>; // string

// Filtering from a union
type ExtractString<T> = T extends string ? T : never;
type C = ExtractString<"a" | 1 | "b" | true>; // "a" | "b"
```

---

## 17. What is the 'as const' assertion used for?

**Asaan Urdu mein:**  
`as const` TypeScript ko batata hai ke value ko uske literal type ke saath treat karo, na ke widened type. Ye properties ko `readonly` banata hai, arrays ko readonly tuples banata hai, aur type widening ko rokta hai. Enum‑like objects aur exact literal types banane ke liye useful hai.  

```typescript
// Without as const — types widen
const colors = { red: "#FF0000", blue: "#0000FF" };
// typeof colors: { red: string; blue: string }

// With as const — types are literal
const colors = { red: "#FF0000", blue: "#0000FF" } as const;
// typeof colors: { readonly red: "#FF0000"; readonly blue: "#0000FF" }

// Array becomes a readonly tuple
const arr = [1, 2, 3] as const;
// typeof arr: readonly [1, 2, 3]

// Useful for discriminated unions
const Actions = {
  Increment: "INCREMENT",
  Decrement: "DECREMENT",
} as const;
type ActionType = (typeof Actions)[keyof typeof Actions]; // "INCREMENT" | "DECREMENT"
```

---

## 18. What is the difference between declare and export in TypeScript?

**Asaan Urdu mein:**  
`declare` sirf TypeScript ko batata hai ke koi variable, function, ya class runtime me exist karta hai, lekin implementation provide nahi karta – ye ambient declaration hoti hai. `export` koi declaration ko doosre modules ke liye available banata hai. Dono ko combine kar ke `export declare` likha ja sakta hai.  

```typescript
// declare — no implementation, just type info
declare const API_BASE_URL: string;
declare function $(selector: string): HTMLElement;

// export — makes module members available
export const API_KEY = "abc123";
export function helper() { return 42; }

// Combined: declare that an external module exports this
// In a .d.ts file:
// export declare function myExternalLib(): void;

// Global declaration (in .d.ts):
// declare global {
//   interface Window {
//     myGlobal: string;
//   }
// }
```

---

## 19. How do you type a function with optional and default parameters?

**Asaan Urdu mein:**  
Optional parameters `?` ke saath likhe jate hain aur `undefined` accept karte hain. Default parameters `=` ke saath define hote hain; unka type default value se infer hota hai. Optional parameters required ke baad aane chahiye.  

```typescript
// Optional parameter
function greet(name?: string): string {
  return `Hello, ${name ?? "world"}`;
}

// Default parameter — type inferred from default
function createUser(name: string, age: number = 18): { name: string; age: number } {
  return { name, age };
}

createUser("Alice");     // age = 18
createUser("Bob", 25);   // age = 25
createUser("Eve", undefined); // age = 18

// Multiple optional/default parameters
function makeRequest(url: string, method: string = "GET", headers?: Record<string, string>) {
  // ...
}
```

---

## 20. What is a discriminated union and how is it used?

**Asaan Urdu mein:**  
Discriminated union (tagged union) ek union hoti hai jisme sab types ek common literal property share karte hain – is property ko **discriminant** kehte hain. TypeScript us discriminant ki value ke basis pe type narrow karta hai, jo exhaustive `switch` statements ko possible banata hai.  

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "triangle"; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default:
      // Exhaustive check — if a new kind is added, this will error
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}
```

---

## 21. What is the difference between abstract classes and interfaces?

**Asaan Urdu mein:**  
Abstract classes implementation details, constructors, fields, aur access modifiers rakh sakti hain. Interfaces sirf structure define karti hain, koi runtime code nahi hota. Ek class sirf ek abstract class extend kar sakti hai lekin multiple interfaces implement kar sakti hai. Contracts ke liye interfaces, shared base logic ke liye abstract classes behtar hain.  

```typescript
interface Flyable {
  fly(): void;
}

interface Swimmable {
  swim(): void;
}

abstract class Animal {
  abstract makeSound(): void;

  move(): void {
    console.log("Moving...");
  }
}

class Duck extends Animal implements Flyable, Swimmable {
  makeSound() {
    console.log("Quack");
  }

  fly() {
    console.log("Flying");
  }

  swim() {
    console.log("Swimming");
  }
}
```

---

## 22. How does TypeScript handle null and undefined with strictNullChecks?

**Asaan Urdu mein:**  
`strictNullChecks: true` ke saath `null` aur `undefined` alag alag types ban jate hain, aur automatically kisi bhi type me assign nahi hote. Aapko nullable values ko explicitly handle karna padta hai – optional chaining (`?.`), nullish coalescing (`??`), ya type guards ke through.  

```typescript
// With strictNullChecks: true
let name: string = null; // Error: Type 'null' is not assignable to type 'string'

let middleName: string | null = null; // OK — explicitly nullable

function getUserName(user?: { name: string | null }): string {
  // Optional chaining ?. and nullish coalescing ??
  return user?.name ?? "Anonymous";
}

// Type narrowing eliminates null
function process(value: string | null): string {
  if (value === null) {
    return "default";
  }
  return value.toUpperCase(); // narrowed to string
}
```

---

## 23. What are ambient declarations (.d.ts files)?

**Asaan Urdu mein:**  
Ambient declaration files (`.d.ts`) sirf type information provide karte hain bina implementation ke. Ye external libraries, global variables, ya runtime constructs ke shapes ko TypeScript ko batate hain. Ye files compile nahi hoti, sirf type checking ke liye hoti hain.  

```typescript
// my-library.d.ts — declares types for a JS library
declare module "my-library" {
  export function doSomething(input: string): number;
  export const VERSION: string;
  export interface Config {
    timeout: number;
    retries: number;
  }
}

// Global ambient declarations
declare global {
  interface Window {
    __APP_VERSION: string;
  }
  var myGlobal: number;
}

// Using it:
import { doSomething } from "my-library";
doSomething("test"); // TypeScript knows the types
```

---

## 24. What is the difference between readonly arrays/tuples and mutable ones?

**Asaan Urdu mein:**  
Readonly arrays (`readonly T[]` ya `ReadonlyArray<T>`) mutation methods (`push`, `pop`…) ko compile time pe block kar dete hain; sirf non‑mutating methods allowed hain. Readonly tuples (`readonly [T, U]`) tuple elements ko reassign karne se rokte hain. Mutable versions in sab ko allow karte hain.  

```typescript
// Mutable array
const mutable: number[] = [1, 2, 3];
mutable.push(4); // OK
mutable[0] = 10; // OK

// Readonly array
const readonly: readonly number[] = [1, 2, 3];
// readonly.push(4); // Error: Property 'push' does not exist
// readonly[0] = 10; // Error: Index signature in readonly array
readonly.map(x => x * 2); // OK — non-mutating

// Readonly tuple
const tuple: readonly [string, number] = ["hello", 42];
// tuple[0] = "world"; // Error: Cannot assign to '0' because it is a read-only property
```

---

## 25. How do you type React component props and state in TypeScript?

**Asaan Urdu mein:**  
Props aur state ke liye `interface` ya `type` define karte hain, phir `React.FC<Props>` ya direct function parameter annotation use karte hain. State ke liye `useState<StateType>()` generic parameter ke saath use hota hai, jo type safety ensure karta hai.  

```typescript
import { useState } from "react";

interface ButtonProps {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

function Button({ label, disabled = false, onClick, variant = "primary" }: ButtonProps) {
  const [count, setCount] = useState<number>(0);

  return (
    <button
      disabled={disabled}
      onClick={() => {
        setCount(c => c + 1);
        onClick();
      }}
      className={variant}
    >
      {label} (clicked {count} times)
    </button>
  );
}
```

---

## 26. What is type narrowing and how is it achieved?

**Asaan Urdu mein:**  
Type narrowing ka matlab hai ke ek broad type ko code block ke andar specific type tak reduce karna. Ye `typeof`, `instanceof`, `in` operator, equality checks, discriminated union property checks, ya custom type predicates ke through hota hai. Narrowed type sirf us scope me apply hoti hai.  

```typescript
function process(value: string | number | Date) {
  // typeof narrowing
  if (typeof value === "string") {
    return value.toUpperCase(); // narrowed to string
  }

  // instanceof narrowing
  if (value instanceof Date) {
    return value.getFullYear(); // narrowed to Date
  }

  // value is number here — narrowing via control flow
  return value.toFixed(2); // narrowed to number
}

// Custom type predicate
interface Cat { meow(): void }
interface Dog { bark(): void }
function isCat(pet: Cat | Dog): pet is Cat {
  return (pet as Cat).meow !== undefined;
}
```

---

## 27. What is the keyof operator used for?

**Asaan Urdu mein:**  
`keyof` ek object type se uske property names ka union banata hai, jo string literal types hote hain. Ye generics aur mapped types ke saath type‑safe property access ya modification functions banane ke liye use hota hai.  

```typescript
interface User {
  name: string;
  age: number;
  email: string;
}

type UserKeys = keyof User; // "name" | "age" | "email"

// Type-safe getter
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = { name: "Alice", age: 30, email: "alice@example.com" };
const name = getProperty(user, "name"); // type: string
const age = getProperty(user, "age");   // type: number
// getProperty(user, "invalid"); // Error: Argument of type '"invalid"' is not assignable
```

---

## 28. What is the difference between function overloading in TypeScript vs JavaScript?

**Asaan Urdu mein:**  
JavaScript me true function overloading nahi hoti – aapko runtime pe arguments manually check karne padte hain. TypeScript compile‑time overloading provide karta hai: multiple signature declarations (overload signatures) ek implementation ke upar likhi jati hain. Implementation signature directly callable nahi hoti; wo sab overloads ke compatible hona chahiye.  

```typescript
// Overload signatures
function len(str: string): number;
function len(arr: any[]): number;
function len(x: string | any[]): number {
  return x.length;
}

len("hello"); // OK — matches first overload
len([1, 2, 3]); // OK — matches second overload
// len(123); // Error — no overload matches

// JavaScript equivalent — manual type checking at runtime
function lenJS(x: string | any[]): number {
  return x.length; // No overload signatures, just union parameter
}
```

---

## 29. What is module augmentation in TypeScript?

**Asaan Urdu mein:**  
Module augmentation existing module me naye declarations add karne ka tareeqa hai bina uske source files ko modify kiye. Ye third‑party libraries ko extend karne, naye exports add karne, ya interfaces ko augment karne ke liye useful hota hai. Same module path use karke declarations merge hoti hain.  

```typescript
// Augmenting a third-party module
import "express";

declare module "express" {
  interface Request {
    user?: {
      id: number;
      name: string;
    };
  }
}

// Now in your code:
app.get("/profile", (req, res) => {
  const user = req.user; // type-safe, no error
  res.json(user);
});

// Augmenting a local module
// types.d.ts
declare module "./user" {
  interface User {
    permissions: string[];
  }
}
```

---

## 30. How do you handle third-party JS libraries without type definitions?

**Asaan Urdu mein:**  
Aap `@types/<library>` package install kar ke DefinitelyTyped se types le sakte hain. Agar koi types exist nahi karti, to aap khud ek `.d.ts` file bana kar module declare kar sakte hain. Quick fix ke liye `declare module "library-name"` ko `any` type ke saath use kar sakte hain, lekin better safety ke liye minimal type declarations likhna chahiye.  

```typescript
// Quick fix — any type:
declare module "untyped-library";

// Better — minimal type declarations:
declare module "old-library" {
  export function init(config: { key: string }): void;
  export const version: string;
}

// Using it:
import { init } from "old-library";
init({ key: "abc" }); // Type-safe

// Even better — use `@types/*` from npm:
// npm install --save-dev @types/lodash
import { debounce } from "lodash"; // Full type support
```

---

## 31. What is the difference between satisfies and type assertion?

**Asaan Urdu mein:**  
`satisfies` (TS 4.9) check karta hai ke value ka type given type ke saath match karta hai **without** inferred type ko widen kiye. Type assertion (`as`) inferred type ko forcefully change karta hai, jo kabhi kabhi unsafe ho sakta hai. `satisfies` narrowest literal type ko preserve karta hai aur missing properties ko error deta hai.  

```typescript
interface Palette {
  primary: string;
  secondary: string;
}

// Type assertion — widens to Palette
const palette1 = { primary: "#f00", secondary: "#0f0" } as Palette;

// satisfies — keeps narrowed literal types
const palette2 = {
  primary: "#f00",
  secondary: "#0f0",
} satisfies Palette;

// palette2.primary is type "#f00" (literal), not string
const colors = [palette2.primary, palette2.secondary]; // type: ("#f00" | "#0f0")[]

// satisfies also catches missing properties
// const palette3 = { primary: "#f00" } satisfies Palette;
// Error: Property 'secondary' is missing
```

---

## 32. What are index signatures in TypeScript?

**Asaan Urdu mein:**  
Index signatures dynamic property access ko type define karne ke liye use hoti hain. Syntax `[key: KeyType]: ValueType` hota hai, jisme `key` string ya number ho sakta hai. Explicit properties bhi define ki ja sakti hain, lekin unka type index signature ke type ke compatible hona chahiye.  

```typescript
interface StringMap {
  [key: string]: string; // Any string key maps to a string value
}

const translations: StringMap = {
  hello: "bonjour",
  goodbye: "au revoir",
};
translations["thank_you"] = "merci"; // OK

// Index signature with specific properties
interface UserMap {
  [id: number]: string;
  admin: string; // Must be assignable to index type (string)
}

// Readonly index signature
interface ReadonlyMap {
  readonly [key: string]: number;
}
```

---

## 33. How does TypeScript compile to JavaScript, and what role does the compiler (tsc) play?

**Asaan Urdu mein:**  
`tsc` TypeScript source ko parse karta hai, type checking karta hai, aur JavaScript emit karta hai. Type annotations, interfaces, aur other TS‑specific constructs compile ke dauran strip ho jate hain. `tsconfig.json` se target, module system, strictness, etc. configure hoti hain. Compilation se pehle errors pakde jate hain, runtime tak nahi.  

```typescript
// TypeScript input:
interface User {
  name: string;
}
function greet(user: User): string {
  return `Hello, ${user.name}`;
}

// JavaScript output (target ES2020):
function greet(user) {
  return `Hello, ${user.name}`;
}

// tsc command:
// tsc main.ts — compiles to main.js
// tsc --init — generates tsconfig.json
// tsc --noEmit — type-checks without emitting files
```

---

## 34. What is the difference between interface merging and type alias extension?

**Asaan Urdu mein:**  
Interface merging (declaration merging) se same interface ko multiple times declare kar ke automatically combine kiya ja sakta hai. Type alias duplicate declare karne par error deta hai; unko extend karne ke liye `&` (intersection) use hota hai. Merging useful hota hai jab aap existing global types ko alag files me extend karna chahte hain.  

```typescript
// Interface merging — automatic combination
interface Document {
  title: string;
}

// Elsewhere (another file or declaration):
interface Document {
  body: string;
}

const doc: Document = { title: "My Doc", body: "Content" }; // OK — merged

// Type alias — cannot merge
type Item = { id: number };
// type Item = { name: string }; // Error: Duplicate identifier 'Item'

// Type alias extension
type ItemExtended = Item & { name: string };
```

---

## 35. What is a generic constraint and how do you use 'extends' with generics?

**Asaan Urdu mein:**  
Generic constraint `extends` se aap generic parameter ke liye allowed types limit karte hain, taake usme kuch specific properties ya methods ho. Constraint ke baad aap safely us property ko generic function ke andar access kar sakte hain.  

```typescript
// Constrain T to types that have a .length property
function logLength<T extends { length: number }>(item: T): T {
  console.log(item.length);
  return item;
}

logLength("hello"); // OK — string has length
logLength([1, 2, 3]); // OK — array has length
// logLength(123); // Error: number doesn't have length

// Constraining to a specific shape
interface HasId {
  id: number;
}
function getDbId<T extends HasId>(entity: T): number {
  return entity.id;
}

getDbId({ id: 1, name: "Alice" }); // OK
// getDbId({ name: "Bob" }); // Error: Property 'id' is missing

// Multiple constraints via intersection
function persist<T extends HasId & { timestamp: number }>(item: T) {
  save(item.id, item);
}
```

---

## 36. What is the difference between interface merging and type alias extension?

**Asaan Urdu mein:**  
Interface merging (declaration merging) multiple interface declarations ko ek single interface me combine karta hai, jo automatically hota hai. Type alias ko dubara declare karna error deta hai; unko extend karne ke liye intersection (`&`) use hoti hai. Merging se aap global ya library types ko alag files me augment kar sakte hain.  

```typescript
// Interface merging — automatic combination
interface Document {
  title: string;
}
interface Document {
  body: string;
}
const doc: Document = { title: "My Doc", body: "Content" }; // OK

// Type alias — cannot merge
type Item = { id: number };
// type Item = { name: string }; // Error

// Type alias extension using intersection
type ItemExtended = Item & { name: string };
```

---

<!--LANG:english-->

# TypeScript Interview Questions  

---

## 1. What is TypeScript and how does it differ from JavaScript?  

| Feature | **TypeScript** | **JavaScript** |
|---------|----------------|----------------|
| **Type System** | Optional static typing, compile‑time checks | Dynamic typing, runtime checks |
| **Compilation** | Transpiles to plain JavaScript (tsc, Babel) | Interpreted directly by the engine |
| **Tooling** | Rich IDE support, autocomplete, refactoring | Basic tooling; depends on external linters |
| **Syntax Additions** | Interfaces, enums, generics, decorators, etc. | No extra syntax beyond ECMAScript |
| **Error Detection** | Compile‑time errors for type mismatches | Errors surface only at runtime |

💡 **Tip:** Use TypeScript when you need **maintainability**, **scalability**, and **early error detection** in large codebases.  

---  

## 2. What are the benefits of using TypeScript in a large codebase?  

- **Static type checking** catches bugs before runtime.  
- **Self‑documenting code** – types act as documentation.  
- **Improved IDE experience** (autocomplete, go‑to definition).  
- **Safer refactoring** with confidence that signatures remain compatible.  
- **Better collaboration** across teams due to explicit contracts.  

💡 **Tip:** Enable strict mode (`"strict": true`) to get the most out of TypeScript’s safety nets.  

---  

## 3. What is the difference between **interface** and **type** in TypeScript?  

| Aspect | **interface** | **type** |
|--------|---------------|----------|
| **Declaration** | `interface Foo { … }` | `type Foo = { … }` |
| **Extension** | `extends` (multiple) | Intersection `&` or `extends` (single) |
| **Merging** | Declaration merging allowed | No merging; later declarations overwrite |
| **Use Cases** | Ideal for object shapes, class contracts | Useful for unions, tuples, primitives, mapped types |
| **Implements** | Classes can `implements` an interface | Classes cannot `implements` a type alias directly |

💡 **Tip:** Prefer **interfaces** for public API contracts; use **type aliases** for complex compositions.  

---  

## 4. What are **generics** in TypeScript and why are they useful?  

- **Generics** let you write **reusable, type‑safe** components (functions, classes, interfaces).  
- They capture **type information** from the caller and propagate it throughout the implementation.  
- Prevents the need for `any` while keeping code flexible.  

💡 **Tip:** Use generic constraints (`<T extends SomeBase>`) to limit acceptable types.  

---  

## 5. What is the difference between **any**, **unknown**, and **never** types?  

| Type | Description | Typical Use |
|------|-------------|-------------|
| **any** | Opt‑out of type checking; any value is assignable to/from it. | Quick migration, legacy code (use sparingly). |
| **unknown** | Safer counterpart to `any`; you must narrow before use. | Accepting external data whose shape is not known. |
| **never** | Represents values that **never occur** (e.g., functions that throw or infinite loops). | Exhaustive checks, unreachable code paths. |

💡 **Tip:** Prefer `unknown` over `any` to retain type safety.  

---  

## 6. What are **union** and **intersection** types?  

- **Union (`A | B`)** – a value can be **either** type `A` **or** type `B`.  
- **Intersection (`A & B`)** – a value must satisfy **both** type `A` **and** type `B`.  

💡 **Tip:** Use unions for **variant** data (e.g., discriminated unions) and intersections for **mix‑in** style composition.  

---  

## 7. What is **type inference** in TypeScript?  

- The compiler **automatically deduces** a variable’s type from its initializer or usage.  
- Example: `let count = 5; // inferred as number`.  

💡 **Tip:** Rely on inference for simple values, but annotate complex APIs for clarity.  

---  

## 8. What are **enums** in TypeScript and when should you use them?  

- **Enums** provide a set of named constant values (numeric or string).  
- Use when you need a **closed set of related values** that are **human‑readable** and **type‑checked**.  

💡 **Tip:** Prefer **union of literal types** (`type Direction = 'N' | 'S' | 'E' | 'W'`) unless you need reverse mapping.  

---  

## 9. What is the difference between a **type alias** and an **interface** for extending?  

| Feature | **type alias (extends)** | **interface (extends)** |
|---------|--------------------------|--------------------------|
| **Syntax** | `type New = Existing & { … }` | `interface New extends Existing { … }` |
| **Multiple Inheritance** | Can intersect many types (`&`) | Can extend multiple interfaces (`extends A, B`) |
| **Declaration Merging** | Not supported | Supported (multiple `interface` declarations merge) |
| **Use Cases** | Complex compositions, unions, tuples | Object‑shape contracts, class implementation |  

💡 **Tip:** Choose **interface** when you need declaration merging; choose **type alias** for advanced type operations.  

---  

## 10. What are utility types like **Partial**, **Pick**, **Omit**, and **Readonly**?  

- **Partial<T>** – makes all properties of `T` optional.  
- **Pick<T, K>** – selects a subset `K` of keys from `T`.  
- **Omit<T, K>** – removes keys `K` from `T`.  
- **Readonly<T>** – marks all properties of `T` as immutable.  

💡 **Tip:** Combine them (`Partial<Pick<T, 'a' | 'b'>>`) for fine‑grained type transformations.  

---  

## 11. What is the difference between **public**, **private**, and **protected** in TypeScript classes?  

| Modifier | Visibility | Accessible From |
|----------|------------|-----------------|
| **public** | Anywhere (default) | Class, subclasses, and external code |
| **private** | Only within the declaring class | Not visible to subclasses or outside |
| **protected** | Declaring class **and** subclasses | Not accessible from external code |

💡 **Tip:** Use `private` for implementation details, `protected` for inheritance hooks, and keep most members `public`.  

---  

## 12. What are **decorators** in TypeScript?  

- **Decorators** are **experimental** functions that can annotate and modify classes, methods, properties, or parameters at design time.  
- Commonly used in frameworks like Angular for **metadata** and **dependency injection**.  

💡 **Tip:** Enable `"experimentalDecorators": true` in `tsconfig.json` before using them.  

---  

## 13. What is **structural typing** (duck typing) in TypeScript?  

- Types are compatible **based on shape**, not explicit declarations.  
- If two objects share the same required members, they are considered assignable.  

💡 **Tip:** Leverage structural typing to write flexible APIs, but be mindful of accidental compatibility.  

---  

## 14. What is the difference between **tsconfig** `'strict'` mode options?  

| Option | Purpose |
|--------|---------|
| **strictNullChecks** | Distinguishes `null`/`undefined` from other types. |
| **strictFunctionTypes** | Enforces bivariance on function parameters. |
| **strictPropertyInitialization** | Requires class properties to be initialized in the constructor or marked optional. |
| **noImplicitAny** | Disallows implicit `any` types. |
| **noImplicitThis** | Flags `this` expressions with an implicit `any`. |
| **alwaysStrict** | Emits `"use strict"` directive in output. |
| **strictBindCallApply** | Checks `bind`, `call`, `apply` arguments more rigorously. |
| **strictSaveFile** *(not a real option – placeholder)* | — |

💡 **Tip:** Turn on `"strict": true` to enable all of the above automatically.  

---  

## 15. What are **mapped types** in TypeScript?  

- Create new types by **transforming each property** of an existing type.  
- Example pattern: `{ [K in keyof T]: ... }`.  

💡 **Tip:** Use `readonly` or `?` modifiers inside the mapping to make properties immutable or optional.  

---  

## 16. What are **conditional types** in TypeScript?  

- Types that **branch** based on a condition: `T extends U ? X : Y`.  
- Enables **type inference** and **distribution** over unions.  

💡 **Tip:** Combine with `infer` to extract inner types (`T extends (...args: infer A) => any ? A : never`).  

---  

## 17. What is the `'as const'` assertion used for?  

- Narrows an expression to the **most specific literal types** and makes arrays/objects **readonly**.  
- Example: `const colors = ['red', 'green'] as const; // type readonly ['red', 'green']`.  

💡 **Tip:** Use `'as const'` when you need **exact literal types** for API contracts or discriminated unions.  

---  

## 18. What is the difference between **declare** and **export** in TypeScript?  

| Keyword | Purpose |
|---------|---------|
| **declare** | Tells the compiler that a variable/function/class exists **somewhere else** (ambient declaration). |
| **export** | Makes a declaration **available to other modules** that import it. |
| **declare export** | Combines both: declares an ambient export (e.g., in `.d.ts` files). |

💡 **Tip:** Use `declare` in `.d.ts` files for **ambient modules**; use `export` in regular source files.  

---  

## 19. How do you type a function with optional and default parameters?  

- Optional parameters are marked with `?`.  
- Default parameters are given a value in the signature; they become optional automatically.  

```ts
function greet(name: string, greeting?: string, times: number = 1): string {
  // implementation …
}
```

💡 **Tip:** Place **optional** parameters **after** required ones; default values can replace explicit `?`.  

---  

## 20. What is a **discriminated union** and how is it used?  

- A union of object types that share a **common literal property** (the *discriminant*).  
- Enables **exhaustive type checking** with `switch`/`if` statements.  

```ts
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number };
```

💡 **Tip:** Always include a **`kind`** (or similar) field for reliable narrowing.  

---  

## 21. What is the difference between **abstract classes** and **interfaces**?  

| Aspect | **Abstract Class** | **Interface** |
|--------|-------------------|---------------|
| **Implementation** | Can contain concrete methods & state | Only declares shape; no implementation |
| **Inheritance** | `extends` (single inheritance) | `implements` (multiple) |
| **Constructor** | Can define a constructor | Cannot have constructors |
| **Runtime Presence** | Exists at runtime (JS class) | Erased during compilation |
| **Use Case** | Shared base functionality + contract | Pure contract, multiple inheritance |  

💡 **Tip:** Choose **abstract class** when you need shared implementation; choose **interface** for pure type contracts.  

---  

## 22. How does TypeScript handle **null** and **undefined** with `strictNullChecks`?  

- With `strictNullChecks` **enabled**, `null` and `undefined` are **not assignable** to other types unless explicitly included (`type | null | undefined`).  
- Allows **precise control** over optional values and reduces accidental runtime errors.  

💡 **Tip:** Use the `?` operator or union types (`string | undefined`) to model optional values.  

---  

## 23. What are **ambient declarations** (`.d.ts` files)?  

- Files that contain **type information** for code that **does not have its own TypeScript source** (e.g., JS libraries).  
- Use `declare` to describe variables, functions, classes, modules, etc.  

💡 **Tip:** Install community typings via `@types/*` before writing your own ambient declarations.  

---  

## 24. What is the difference between **readonly arrays/tuples** and **mutable** ones?  

| Kind | Mutability | Example |
|------|------------|---------|
| **ReadonlyArray<T>** | Elements cannot be reassigned, nor can the array be mutated (push, pop, etc.) | `readonly number[]` |
| **Mutable Array** | Full read/write access | `number[]` |
| **Readonly Tuple** | Fixed length & each element immutable | `readonly [string, number]` |
| **Mutable Tuple** | Elements can be reassigned (but length fixed) | `[string, number]` |

💡 **Tip:** Prefer `readonly` collections for **API boundaries** to guarantee immutability.  

---  

## 25. How do you type **React** component props and state in TypeScript?  

- **Function components:** `FC<Props>` or explicit `(props: Props) => JSX.Element`.  
- **Class components:** `class MyComp extends React.Component<Props, State> { … }`.  

```tsx
interface Props {
  title: string;
  count?: number;
}
const MyComponent: React.FC<Props> = ({ title, count = 0 }) => { … };
```

💡 **Tip:** Use `React.ReactNode` for children and `Partial<Props>` for default props.  

---  

## 26. What is **type narrowing** and how is it achieved?  

- The process of refining a union type to a **more specific** type using **control flow** (e.g., `typeof`, `instanceof`, property checks, discriminants).  

```ts
function handle(value: string | number) {
  if (typeof value === 'string') {
    // value is string here
  } else {
    // value is number here
  }
}
```

💡 **Tip:** Leverage **user‑defined type guard functions** (`value is SpecificType`).  

---  

## 27. What is the **`keyof`** operator used for?  

- Produces a **union of string literal types** representing the keys of a given type.  

```ts
type Person = { name: string; age: number };
type PersonKeys = keyof Person; // "name" | "age"
```

💡 **Tip:** Combine with **indexed access** (`T[K]`) for generic property lookups.  

---  

## 28. What is the difference between **function overloading** in TypeScript vs JavaScript?  

| Aspect | **JavaScript** | **TypeScript** |
|--------|----------------|----------------|
| **Implementation** | Single function body; overloads not natively supported. | Multiple **signature declarations** + one implementation. |
| **Compile‑time** | No type checking for overloads. | Compiler validates each overload against calls. |
| **Runtime** | Same as normal function. | Same runtime code; overloads are erased. |
| **Usage** | Manual argument inspection (`arguments.length`). | Cleaner, typed overloads for different call signatures. |

💡 **Tip:** Keep overload signatures **ordered** from most specific to most general.  

---  

## 29. What is **module augmentation** in TypeScript?  

- Allows you to **add new members** to an existing module’s type declarations (e.g., adding properties to `express.Request`).  
- Done via `declare module "module-name" { … }` in a `.d.ts` file.  

💡 **Tip:** Use augmentation to extend third‑party libraries without modifying their source.  

---  

## 30. How do you handle third‑party JS libraries without type definitions?  

- **Declare an ambient module** with `declare module 'lib-name';` and type any needed exports as `any`.  
- Or write **custom `.d.ts`** files describing the library’s API.  
- Use the `--allowJs` flag to import the JS directly and rely on inference (less safe).  

💡 **Tip:** Prefer writing minimal typings for the parts you use; submit them to DefinitelyTyped if useful.  

---  

## 31. What is the difference between **satisfies** and **type assertion**?  

| Construct | Purpose | Effect |
|-----------|---------|--------|
| **`as` (type assertion)** | Tell the compiler to **treat** a value as a specific type, possibly unsafe. | No runtime check; may hide errors. |
| **`satisfies`** | Verify that a value **conforms** to a type **without widening** its inferred type. | Keeps the most specific type while ensuring compatibility. |

💡 **Tip:** Use `satisfies` for **constant objects** where you want exact literal types but still enforce a shape.  

---  

## 32. What are **index signatures** in TypeScript?  

- Define the **type of keys and values** for objects with dynamic property names.  

```ts
interface StringMap {
  [key: string]: number; // any string key maps to a number
}
```

💡 **Tip:** Combine with `Record<Keys, Type>` for reusable mapped types.  

---  

## 33. How does TypeScript compile to JavaScript, and what role does the compiler (**tsc**) play?  

- **`tsc`** parses `.ts`/`.tsx` files, performs **type checking**, and **emits** JavaScript according to the `target` and `module` settings.  
- It also **generates declaration files** (`.d.ts`) when `declaration: true`.  
- Errors are reported **before** any JavaScript is produced, ensuring type safety.  

💡 **Tip:** Use `tsc --watch` for incremental compilation during development.  

---  

## 34. What is the difference between **interface merging** and **type alias extension**?  

| Feature | **Interface Merging** | **Type Alias Extension** |
|---------|----------------------|--------------------------|
| **Mechanism** | Multiple `interface` declarations with the same name are **merged** into one. | Types are combined using **intersection** (`&`) or `extends`. |
| **Flexibility** | Can add new members later, even from different files. | No merging; you must create a new alias. |
| **Runtime** | No runtime impact (erased). | Same – only compile‑time. |
| **Use Cases** | Extending third‑party interfaces (e.g., `Window`). | Building complex composed types. |

💡 **Tip:** Use **interface merging** for **declaration augmentation**; use **type intersections** for compositional type building.  

---  

## 35. What is a **generic constraint** and how do you use `'extends'` with generics?  

- **Generic constraints** limit the set of types a generic can accept.  

```ts
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}
```

- The `extends` clause ensures `T` has at least the specified members.  

💡 **Tip:** Chain constraints (`T extends U & V`) for multiple requirements.  

---  

## 36. What is the difference between **interface merging** and **type alias extension**?  

*(Same comparison as question 34; see that table for details.)*  

---  

## 💻 Coding Challenges  

*(No coding‑implementation questions were identified in the list. Add implementations here if needed.)*
