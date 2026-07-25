<!--LANG:roman-->

# Testing Interview Questions

## 1. What is the difference between unit testing, integration testing, and end-to-end testing?

**Asaan Urdu mein:**  
Unit testing mein hum sab se chhote code ke tukray—functions ya methods—ko alag se test karte hain, dependencies ko mock kar ke. Integration testing do ya zyada modules ko milakar test karti hai, aksar real database ya API ke sath. End-to-end (E2E) testing poore system ko user ke nazariye se chalati hai, browser clicks se le kar backend responses tak. Testing pyramid ke mutabiq unit tests sab se zyada, phir integration, aur sab se kam E2E tests hoti hain.

```javascript
// Unit test — tests a single function in isolation
function sum(a, b) { return a + b; }
test('sum adds two numbers', () => {
  expect(sum(2, 3)).toBe(5);
});

// Integration test — tests module with database
test('saveUser stores user in database', async () => {
  const user = await saveUser({ name: 'Alice' });
  const found = await db.findUser(user.id);
  expect(found.name).toBe('Alice');
});

// E2E test (Cypress) — tests full user flow
cy.visit('/signup');
cy.get('[data-testid="name"]').type('Alice');
cy.get('[data-testid="submit"]').click();
cy.url().should('include', '/dashboard');
```

--- 



---

## 2. What is Test-Driven Development (TDD)?

**Asaan Urdu mein:**  
TDD ek aisa workflow hai jisme pehle **failing test** likhte hain (Red), phir usko pass karne ke liye minimum code likhte hain (Green), aur akhir mein code ko **refactor** karte hain jab tak tests green hi rehte hain. Is se har line ka code test hota hai, design clean hoti hai, aur turant feedback milta hai. Cycle ko Red‑Green‑Refactor kehte hain.

--- 



---

## 3. What is the difference between mocking, stubbing, and spying in tests?

**Asaan Urdu mein:**  
Mock ek fake function hota hai jo calls ko record karta hai aur pre‑defined values return karta hai. Stub sirf specific calls ke liye fixed answers deta hai, lekin usage ko track nahi karta. Spy asli function ko wrap karta hai, uske calls, arguments, aur results ko record karta hai, lekin asli implementation chalti rehti hai. Jest aur Sinon jaise libraries in teeno ko support karti hain.

```javascript
// Mock — replaces the entire function
const mockFn = jest.fn().mockReturnValue(42);
mockFn('hello');
expect(mockFn).toHaveBeenCalledWith('hello');

// Stub — provides fixed responses
jest.spyOn(api, 'getUser').mockResolvedValue({ id: 1 });

// Spy — wraps real function to observe calls
const spy = jest.spyOn(console, 'log');
myFunction();
expect(spy).toHaveBeenCalledWith('running');
spy.mockRestore();  // restore original
```

--- 



---

## 4. What is Jest and what are its core features?

**Asaan Urdu mein:**  
Jest Meta (pehle Facebook) ka JavaScript testing framework hai jo zero‑config setup, built‑in assertions, **mocking**, code coverage, aur snapshot testing provide karta hai. Core features mein `test`/`describe` blocks, `expect` matchers, automatic module mocking (`jest.mock()`), parallel execution, aur watch mode shamil hain.

--- 



---

## 5. What is React Testing Library and how does its philosophy differ from Enzyme?

**Asaan Urdu mein:**  
React Testing Library (RTL) components ko user ke tarike se test karta hai—accessible roles, labels, aur text se query karta hai, na ke internal state ya props. Enzyme shallow rendering aur state access ki ijazat deta tha, jo brittle tests ka sabab banta tha. RTL ka maksad hai “tests ko aise likho jaise user software use kar raha ho”.

```javascript
// React Testing Library — tests by user behavior
import { render, screen, fireEvent } from '@testing-library/react';

test('button click updates counter', () => {
  render(<Counter />);
  const btn = screen.getBy



---

## 6. What is the difference between shallow rendering and full DOM rendering in component testing?

**Asaan Urdu mein:**  
Shallow rendering sirf component ko ek level tak render karta hai, uske child components ko render nahi karta, is se hum ek single component ko isolated unit test kar sakte hain. Full DOM rendering component ko uske tamam children ke saath ek simulated browser environment (jsdom) mein mount karta hai, jo real browser ke qareeb hota hai. Shallow tests tez chalti hain lekin integration problems miss ho sakti hain; full rendering realistic hoti hai magar slower. React Testing Library aam tor par full rendering ki salah deti hai.

```javascript
// Shallow rendering (Enzyme style) — only renders one level
// import { shallow } from 'enzyme';
// const wrapper = shallow(<Parent><Child /></Parent>);
// console.log(wrapper.html());  // Child component NOT expanded

// Full DOM rendering (RTL style) — renders everything
import { render, screen } from '@testing-library/react';
render(<Parent><Child /></Parent>);
expect(screen.getByText('child content')).toBeInTheDocument();
```

---



---

## 7. What is code coverage and what are its limitations as a metric?

**Asaan Urdu mein:**  
Code coverage yeh batata hai ke aapke tests ne code ki kaun si lines, branches, functions aur statements ko actually chalaya hai. Aksar teams 80% ya us se zyada coverage ka target rakhti hain. Lekin high coverage ka matlab yeh nahi ke code sahi hai—100% coverage bhi meaningless tests ke saath ho sakti hai jo sirf code ko execute karte hain bina koi assertion ke. Coverage logic errors, edge cases, aur integration problems ko capture nahi karti jo unit level par nazar nahi aate.

```javascript
// High coverage but useless test
function calculateDiscount(price) {
  if (price > 100) return price * 0.9;
  if (price > 50) return price * 0.95;
  return price;
}

test('coverage trap', () => {
  calculateDiscount(200);  // 100% line coverage!
  calculateDiscount(75);   // But no assertions on correctness
  calculateDiscount(25);
});

// Always assert behavior, not just execute
```

---



---

## 8. What is snapshot testing and when is it useful?

**Asaan Urdu mein:**  
Snapshot testing component ke rendered output ko capture karke ek snapshot file mein store karta hai. Agli baar test chalane par naya output us stored snapshot se compare hota hai; agar farq hota hai to test fail ho jata hai (ya phir agar change intentional ho to snapshot update karte hain). Yeh UI ke unintended changes ko detect karne ke liye bohat useful hai jab component ka output stable ho. Rapidly changing ya bohat bade component trees ke liye yeh approach recommend nahi ki jati.

```javascript
// Snapshot test with React Testing Library
import { render } from '@testing-library/react';

test('Header matches snapshot', () => {
  const { container } = render(<Header title="Home" />);
  expect(container.firstChild).toMatchSnapshot();
});

// After intentional change:
// Update snapshot with: jest --updateSnapshot
// or pressing 'u' in watch mode
```

---



---

## 9. What is the difference between synchronous and asynchronous test assertions?

**Asaan Urdu mein:**  
Synchronous assertions turant run hoti hain aur test ko tab tak block kar deti hain jab tak assertion complete na ho jaye—ye pure functions ke liye theek hoti hain. Asynchronous assertions Promises, callbacks, ya timers ko handle karti hain `async/await` ya `done()` callbacks ke zariye. Agar async ko sahi tarah se handle na kiya jaye to test pehle finish ho jata hai aur false positive milta hai, yani test pass ho jata hai jab ke actual assertion abhi baaki hoti hai.

```javascript
// Synchronous assertion
test('sync test', () => {
  expect(1 + 1).toBe(2);
});

// Async assertion with async/await (recommended)
test('async test with async/await', async () => {
  const data = await fetchUser(1);
  expect(data.name).toBe('Alice');
});

// Async with done callback
test('async test with callback', (done) => {
  fetchUser(1, (data) => {
    expect(data.name).toBe('Alice');
    done();  // must call or test passes prematurely
  });
});
```

---



---

## 10. What is a test double, and what are the differences between fakes, mocks, and stubs?

**Asaan Urdu mein:**  
Test doubles wo objects hote hain jo real dependencies ki jagah test ke dauran use kiye jate hain. Fake ek lightweight, functional implementation hota hai (jaise in‑memory database). Mock pre‑programmed hota hai aur is par expectations set ki jati hain ke kaise call hona chahiye—ye behavior verify karta hai. Stub specific calls ke liye canned answers provide karta hai, sirf data return karta hai. Is tarah fake real implementation ka substitute hota hai, mock behavior ko verify karta hai, aur stub sirf data supply karta hai.

```javascript
// Fake — lightweight implementation
const fakeDb = {
  users: [],
  save(user) { this.users.push(user); return user; },
  find(id) { return this.users.find(u => u.id === id); },
};

// Mock — verifies interactions
const mockLogger = { log: jest.fn() };
processOrder(order, mockLogger);
expect(mockLogger.log).toHaveBeenCalledWith('Order processed');

// Stub — supplies data
jest.spyOn(api, 'getPrice').mockReturnValue(29.99);
```

---



---

## 11. How do you test asynchronous code (Promises, async/await) in Jest?

**Asaan Urdu mein:**  
Jest async code ko handle karne ke liye teen tareeqe deta hai: directly Promise return karna, `async/await` ka istemal, ya `done` callback. Zaroori hai ke Jest ko pata ho ke async work kab khatam ho gayi, warna test pehle hi finish ho jata hai aur assertion run nahi hoti. `return` ya `await` karna sab se safe hai; `done` use karte waqt hamesha usay call karna na bhoolen, warna false positive mil sakta hai.

```javascript
// Return promise directly
test('fetch user returns name', () => {
  return fetchUser(1).then(data => {
    expect(data.name).toBe('Alice');
  });
});

// Async/await (cleanest)
test('fetch user with async/await', async () => {
  const data = await fetchUser(1);
  expect(data.name).toBe('Alice');
});

// .resolves / .rejects matchers
test('resolves to Alice', async () => {
  await expect(fetchUser(1)).resolves.toHaveProperty('name', 'Alice');
});
```

---



---

## 12. What is Cypress and how does it differ from Selenium for E2E testing?

**Asaan Urdu mein:**  
Cypress ek modern E2E testing framework hai jo browser ke andar hi run hota hai, is liye usko DOM, network aur application state ka direct access hota hai. Selenium WebDriver protocol ke through alag browser driver process ko commands bhejta hai, is liye uska setup zyada complex hota hai. Cypress automatic waiting, time‑travel debugging, real‑time reloads aur network stubbing provide karta hai; Selenium zyada browsers aur programming languages support karta hai lekin configuration me mehnat zyada hoti hai.

```javascript
// Cypress test — automatic waiting, runs in-browser
describe('Login flow', () => {
  it('logs in successfully', () => {
    cy.visit('/login');
    cy.get('[data-cy="email"]').type('user@example.com');
    cy.get('[data-cy="password"]').type('password123');
    cy.get('[data-cy="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome back').should('be.visible');
  });
});
```

---



---

## 13. What is the AAA (Arrange-Act-Assert) pattern in testing?

**Asaan Urdu mein:**  
AAA pattern tests ko teen clearly defined sections mein divide karta hai: **Arrange** – test data, mocks, aur dependencies set up karna; **Act** – woh code execute karna jo test kiya ja raha hai; **Assert** – result ko verify karna. Is se tests readable, consistent aur self‑documenting bante hain. Har test mein ideally ek hi Act step hota hai aur ek ya do assertions hoti hain, taake focus clear rahe.

```javascript
// AAA pattern
test('discount applied for premium members', () => {
  // Arrange
  const user = { type: 'premium', email: 'alice@test.com' };
  const price = 100;

  // Act
  const finalPrice = applyDiscount(user, price);

  // Assert
  expect(finalPrice).toBe(80);  // 20% premium discount
});
```

---



---

## 14. What is continuous integration and how does automated testing fit into it?

**Asaan Urdu mein:**  
Continuous Integration (CI) ka matlab hai ke har code push ya pull request ke saath automatically build aur test chalaye jate hain shared repository par. Automated tests CI pipelines (GitHub Actions, Jenkins, CircleCI) mein run hote hain, taake koi bhi regression ya breakage turant pakda ja sake. Agar tests fail ho jayein to PR merge hone se roka jata hai, is se code quality barqarar rehti hai aur developers ko jaldi feedback milta hai.

```javascript
// GitHub Actions CI workflow (.github/workflows/test.yml)
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test          # unit + integration
      - run: npm run test:e2e  # E2E tests
      - run: npm run build     # verify build succeeds
```

---



---

## 15. How would you test a REST API (e.g., using Supertest or Postman)?

**Asaan Urdu mein:**  
Supertest ek Node.js library hai jo aapke Express/Fastify app ko directly Jest ke andar request bhej kar HTTP endpoints test karta hai. Aap request banate hain, status code, response body aur headers ko assert karte hain. Postman/Newman collections ko CLI se run karke CI pipelines mein integrate kiya ja sakta hai, lekin Supertest programmatic testing ke liye zyada flexible hota hai.

```javascript
// Supertest with Jest
const request = require('supertest');
const app = require('../app');

describe('GET /api/users/:id', () => {
  it('returns user by ID', async () => {
    const res = await request(app)
      .get('/api/users/1')
      .set('Authorization', 'Bearer token123');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Alice');
  });

  it('returns 404 for missing user', async () => {
    const res = await request(app).get('/api/users/999');
    expect(res.status).toBe(404);
  });
});
```

---



---

## 16. What is the difference between black-box and white-box testing?

**Asaan Urdu mein:**  
Black‑box testing system ko ek closed box ki tarah treat karta hai—test cases specifications aur requirements par based hote hain, bina code ki internal knowledge ke. White‑box testing code ki internal structure (branches, paths, logic) ko samajh kar test design karta hai, is se hidden bugs pakde jate hain. Aksar dono approaches mil kar use hoti hain: black‑box functional gaps ko cover karta hai, white‑box implementation details ko verify karta hai.

```javascript
// Black-box test — only knows API contract
test('POST /signup returns 201 for valid data', async () => {
  const res = await request(app)
    .post('/api/signup')
    .send({ email: 'a@b.com', password: 'Pass123!' });
  expect(res.status).toBe(201);
});

// White-box test — knows internal logic branches
test('signup rejects weak passwords', () => {
  // Testing internal validation logic directly
  expect(validatePassword('short')).toBe(false);
  expect(validatePassword('12345678')).toBe(false); // no uppercase
  expect(validatePassword('ValidPass1')).toBe(true);
});
```

---



---

## 17. What is regression testing?

**Asaan Urdu mein:**  
Regression testing ka maqsad yeh ensure karna hota hai ke naye code changes existing functionality ko tod nahi rahe. Har bug fix ya feature addition ke baad pehle se maujood test suite chalaya jata hai taake pehle se sahi kaam kar rahe features phir se break na ho. Automated regression suites CI pipelines mein run hoti hain, is se continuous delivery ke dauran safety net milta hai.

```javascript
// Regression test — prevent reintroduction of past bugs

// Bug #42: Discount should not apply to gift cards
test('no discount on gift cards (regression)', () => {
  const giftCard = { type: 'gift', amount: 50 };
  const result = applyPromo(giftCard, 'SAVE20');
  expect(result.discount).toBe(0);  // Previous bug returned 10
});

// Run all existing tests on each PR
// "npm test" — entire test suite = regression safety net
```

---



---

## 18. How do you test components that depend on external APIs?

**Asaan Urdu mein:**  
External API calls ko test karne ke liye unko mock karna zaroori hai—Jest ka `jest.mock()` ya `jest.spyOn()` use karke network request ko replace karte hain, taake tests fast, deterministic aur CI‑friendly rahein. Integration level par `msw` (Mock Service Worker) ka istemal kiya jata hai jo actual fetch/axios calls ko intercept karke mock responses deta hai. Real APIs ko hit karna avoid karna chahiye, kyun ke woh slow, flaky aur cost‑incurring ho sakti hain.

```javascript
// Jest mock — replaces module
jest.mock('../api');
import { fetchUsers } from '../api';

test('UserList renders fetched users', async () => {
  fetchUsers.mockResolvedValue([
    { id: 1, name: 'Alice' }
  ]);
  render(<UserList />);
  expect(await screen.findByText('Alice')).toBeInTheDocument();
});

// MSW (Mock Service Worker) — intercepts real fetch calls
import { rest } from 'msw';
import { setupServer } from 'msw/node';
const server = setupServer(
  rest.get('/api/users', (req, res, ctx) =>
    res(ctx.json([{ id: 1, name: 'Alice' }]))
  )
);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---



---

## 19. What is the difference between testing pyramid and testing trophy approaches?

**Asaan Urdu mein:**  
Testing pyramid (Mike Cohn) ke mutabiq bottom par bohat saare unit tests, middle mein kam integration tests, aur top par sirf kuch E2E tests hone chahiye. Testing trophy (Kent C. Dodds) kehta hai ke integration tests ko sab se wide part banana chahiye—ye component level par real children ke saath kaam karte hain aur zyada confidence dete hain, jabke bohat isolated unit tests aur brittle E2E tests kam hone chahiye. Trophy approach overall effort‑per‑confidence ko behtar banata hai.

```javascript
// Testing trophy approach — focus on integration tests

// Integration test (sweet spot) — tests component with real children
test('CheckoutForm calculates total and submits', async () => {
  render(<CheckoutForm />);
  await userEvent.type(screen.getByLabelText(/quantity/i), '3');
  expect(screen.getByText('$29.97')).toBeInTheDocument(); // integration
});

// Unit test (bottom of pyramid/trophy)
test('calculateTotal multiplies price * qty', () => {
  expect(calculateTotal(9.99, 3)).toBe(29.97);
});
```

---



---

## 20. How would you write a test for a custom React hook?

**Asaan Urdu mein:**  
Custom hook ko test karne ke liye `@testing-library/react-hooks` ka `renderHook` use karte hain, jo hook ko bina koi extra component ke run karta hai. `renderHook` ek `result` object return karta hai jo hook ke return values ko hold karta hai; state updates ke liye `act` ya `waitFor` ka istemal hota hai, aur `rerender` se props change test kiye ja sakte hain. Is tarah hook ki logic ko isolate karke asani se verify kiya ja sakta hai.

```javascript
import { renderHook, act } from '@testing-library/react-hooks';
import useCounter from './useCounter';

test('useCounter increments and decrements', () => {
  const { result } = renderHook(() => useCounter(0));

  expect(result.current.count).toBe(0);

  act(() => result.current.increment());
  expect(result.current.count).toBe(1);

  act(() => result.current.increment());
  expect(result.current.count).toBe(2);

  act(() => result.current.decrement());
  expect(result.current.count).toBe(1);
});

test('useCounter resets to initial value', () => {
  const { result, rerender } = renderHook(
    (initial) => useCounter(initial),
    { initialProps: 0 }
  );
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);

  rerender(10);
  act(() => result.current.reset());
  expect(result.current.count).toBe(10);
});
```

<!--LANG:english-->



# Testing Interview Questions

## 1. What is the difference between unit testing, integration testing, and end-to-end testing?

Unit tests verify the smallest isolated pieces of code (functions, methods) in isolation, mocking dependencies. Integration tests verify that multiple modules work together correctly, often testing real database or API interactions. E2E tests simulate real user scenarios across the full system, from browser clicks to backend responses. The testing pyramid recommends many unit tests, fewer integration tests, and few E2E tests.

```javascript
// Unit test — tests a single function in isolation
function sum(a, b) { return a + b; }
test('sum adds two numbers', () => {
  expect(sum(2, 3)).toBe(5);
});

// Integration test — tests module with database
test('saveUser stores user in database', async () => {
  const user = await saveUser({ name: 'Alice' });
  const found = await db.findUser(user.id);
  expect(found.name).toBe('Alice');
});

// E2E test (Cypress) — tests full user flow
cy.visit('/signup');
cy.get('[data-testid="name"]').type('Alice');
cy.get('[data-testid="submit"]').click();
cy.url().should('include', '/dashboard');
```

---

## 2. What is Test-Driven Development (TDD)?

TDD is a development process where you write a failing test first (Red), then write the minimal code to make it pass (Green), then refactor the code while keeping tests green (Refactor). This ensures every line of code is tested, drives cleaner design, and provides immediate feedback. The cycle is commonly called Red-Green-Refactor.

```javascript
// RED: Write the failing test first
test('isEven returns true for even numbers', () => {
  expect(isEven(4)).toBe(true);  // isEven doesn't exist yet
});

// GREEN: Write minimal code to pass
function isEven(n) { return n % 2 === 0; }

// REFACTOR: Improve without changing behavior
// (nothing to refactor in this simple example)
```

---

## 3. What is the difference between mocking, stubbing, and spying in tests?

A mock replaces a function with a fake version that records how it was called and returns predetermined values. A stub provides preset answers to specific calls without tracking usage. A spy wraps a real function to record its calls, arguments, and results while still executing the real implementation. Libraries like Jest and Sinon provide all three.

```javascript
// Mock — replaces the entire function
const mockFn = jest.fn().mockReturnValue(42);
mockFn('hello');
expect(mockFn).toHaveBeenCalledWith('hello');

// Stub — provides fixed responses
jest.spyOn(api, 'getUser').mockResolvedValue({ id: 1 });

// Spy — wraps real function to observe calls
const spy = jest.spyOn(console, 'log');
myFunction();
expect(spy).toHaveBeenCalledWith('running');
spy.mockRestore();  // restore original
```

---

## 4. What is Jest and what are its core features?

Jest is a JavaScript testing framework developed by Meta, known for its zero-config setup, built-in assertions, mocking, code coverage, and snapshot testing. Core features include `test`/`describe` block structure, `expect` matchers (`toBe`, `toEqual`, `toContain`), automatic module mocking with `jest.mock()`, parallel test execution, and watch mode for development.

```javascript
// Jest test structure with core matchers
describe('MathUtils', () => {
  test('adds numbers correctly', () => {
    expect(1 + 2).toBe(3);
    expect({ a: 1 }).toEqual({ a: 1 });
    expect([1, 2, 3]).toContain(2);
    expect(() => JSON.parse('invalid')).toThrow();
  });

  // Coverage: jest --coverage reports % of code covered
});
```

---

## 5. What is React Testing Library and how does its philosophy differ from Enzyme?

React Testing Library (RTL) encourages testing components as users interact with them, querying by accessible roles, labels, and text — not by internal implementation details like component state or props. Enzyme allowed shallow rendering and direct state access, which led to brittle tests. RTL's philosophy is "the more your tests resemble the way your software is used, the more confidence they can give you."

```javascript
// React Testing Library — tests by user behavior
import { render, screen, fireEvent } from '@testing-library/react';

test('button click updates counter', () => {
  render(<Counter />);
  const btn = screen.getByRole('button', { name: /increment/i });
  fireEvent.click(btn);
  expect(screen.getByText('1')).toBeInTheDocument();
});

// Enzyme (old) — tests by internal state
// wrapper.find('button').simulate('click');
// expect(wrapper.state('count')).toBe(1);
```

---

## 6. What is the difference between shallow rendering and full DOM rendering in component testing?

Shallow rendering renders a component one level deep without rendering its children, enabling isolated unit tests of a single component. Full DOM rendering mounts the component with all its children in a simulated browser environment (like jsdom). Shallow tests are faster but can miss integration issues; full rendering is more realistic but slower. React Testing Library recommends full rendering.

```javascript
// Shallow rendering (Enzyme style) — only renders one level
// import { shallow } from 'enzyme';
// const wrapper = shallow(<Parent><Child /></Parent>);
// console.log(wrapper.html());  // Child component NOT expanded

// Full DOM rendering (RTL style) — renders everything
import { render, screen } from '@testing-library/react';
render(<Parent><Child /></Parent>);
expect(screen.getByText('child content')).toBeInTheDocument();
```

---

## 7. What is code coverage and what are its limitations as a metric?

Code coverage measures which lines, branches, functions, and statements in your code are executed by tests. Common thresholds aim for 80%+ coverage. However, high coverage doesn't guarantee quality — you can have 100% coverage with meaningless tests that don't assert behavior correctly. Coverage also misses logic errors, untested edge cases, and integration issues not visible at the unit level.

```javascript
// High coverage but useless test
function calculateDiscount(price) {
  if (price > 100) return price * 0.9;
  if (price > 50) return price * 0.95;
  return price;
}

test('coverage trap', () => {
  calculateDiscount(200);  // 100% line coverage!
  calculateDiscount(75);   // But no assertions on correctness
  calculateDiscount(25);
});

// Always assert behavior, not just execute
```

---

## 8. What is snapshot testing and when is it useful?

Snapshot testing captures the rendered output of a component and saves it to a snapshot file. On subsequent runs, the new output is compared to the stored snapshot. If they differ, the test fails (or you update the snapshot if the change was intentional). Useful for detecting unintended UI changes in components with stable output. Not recommended for rapidly changing or large component trees.

```javascript
// Snapshot test with React Testing Library
import { render } from '@testing-library/react';

test('Header matches snapshot', () => {
  const { container } = render(<Header title="Home" />);
  expect(container.firstChild).toMatchSnapshot();
});

// After intentional change:
// Update snapshot with: jest --updateSnapshot
// or pressing 'u' in watch mode
```

---

## 9. What is the difference between synchronous and asynchronous test assertions?

Synchronous assertions run immediately and block until complete, suitable for pure functions. Asynchronous assertions handle Promises, callbacks, or timers using `async/await` or `done()` callbacks. Failing to handle async properly can produce false positives (tests passing when they shouldn't) because the test completes before the async assertion runs.

```javascript
// Synchronous assertion
test('sync test', () => {
  expect(1 + 1).toBe(2);
});

// Async assertion with async/await (recommended)
test('async test with async/await', async () => {
  const data = await fetchUser(1);
  expect(data.name).toBe('Alice');
});

// Async with done callback
test('async test with callback', (done) => {
  fetchUser(1, (data) => {
    expect(data.name).toBe('Alice');
    done();  // must call or test passes prematurely
  });
});
```

---

## 10. What is a test double, and what are the differences between fakes, mocks, and stubs?

Test doubles are generic terms for any object that stands in for a real dependency during testing. Fakes are lightweight working implementations (like an in-memory database). Mocks are pre-programmed objects with expectations on how they should be called. Stubs provide canned answers to specific calls. A fake is a real implementation substitute; mocks verify behavior; stubs provide data.

```javascript
// Fake — lightweight implementation
const fakeDb = {
  users: [],
  save(user) { this.users.push(user); return user; },
  find(id) { return this.users.find(u => u.id === id); },
};

// Mock — verifies interactions
const mockLogger = { log: jest.fn() };
processOrder(order, mockLogger);
expect(mockLogger.log).toHaveBeenCalledWith('Order processed');

// Stub — supplies data
jest.spyOn(api, 'getPrice').mockReturnValue(29.99);
```

---

## 11. How do you test asynchronous code (Promises, async/await) in Jest?

Jest handles async code via returning a Promise, using `async/await`, or using the `done` callback. The key is that Jest must know when the async work completes. Always `return` or `await` the promise — otherwise the test will complete before the assertion runs, giving a false positive. For `done`, ensure it's always called (use Jest timeout to catch failures).

```javascript
// Return promise directly
test('fetch user returns name', () => {
  return fetchUser(1).then(data => {
    expect(data.name).toBe('Alice');
  });
});

// Async/await (cleanest)
test('fetch user with async/await', async () => {
  const data = await fetchUser(1);
  expect(data.name).toBe('Alice');
});

// .resolves / .rejects matchers
test('resolves to Alice', async () => {
  await expect(fetchUser(1)).resolves.toHaveProperty('name', 'Alice');
});
```

---

## 12. What is Cypress and how does it differ from Selenium for E2E testing?

Cypress is a modern E2E testing framework that runs inside the browser alongside the application, giving it direct access to DOM, network, and application state. Selenium operates via WebDriver protocol, sending commands to a separate browser driver process. Cypress offers time-travel debugging, automatic waiting, real-time reloads, and network stubbing. Selenium supports more browsers and languages but requires more setup.

```javascript
// Cypress test — automatic waiting, runs in-browser
describe('Login flow', () => {
  it('logs in successfully', () => {
    cy.visit('/login');
    cy.get('[data-cy="email"]').type('user@example.com');
    cy.get('[data-cy="password"]').type('password123');
    cy.get('[data-cy="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome back').should('be.visible');
  });
});
```

---

## 13. What is the AAA (Arrange-Act-Assert) pattern in testing?

AAA structures tests into three sections: Arrange sets up the test data and dependencies, Act executes the code under test, and Assert verifies the outcome. This pattern makes tests readable, consistent, and self-documenting. Each test should ideally have one clear Act step and one or a few Assertions.

```javascript
// AAA pattern
test('discount applied for premium members', () => {
  // Arrange
  const user = { type: 'premium', email: 'alice@test.com' };
  const price = 100;

  // Act
  const finalPrice = applyDiscount(user, price);

  // Assert
  expect(finalPrice).toBe(80);  // 20% premium discount
});
```

---

## 14. What is continuous integration and how does automated testing fit into it?

Continuous Integration (CI) is the practice of automatically building and testing every code push to a shared repository. Automated tests run in CI pipelines (GitHub Actions, Jenkins, CircleCI) on each PR to catch regressions early. If tests fail, the PR is blocked from merging. This ensures code quality, catches integration issues, and gives developers rapid feedback.

```javascript
// GitHub Actions CI workflow (.github/workflows/test.yml)
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test          # unit + integration
      - run: npm run test:e2e  # E2E tests
      - run: npm run build     # verify build succeeds
```

---

## 15. How would you test a REST API (e.g., using Supertest or Postman)?

Supertest is a Node.js library for testing HTTP endpoints programmatically within Jest. You pass your Express/Fastify app to a supertest instance and make requests, then assert on status codes, response bodies, and headers. Postman/Newman runs collection-based API tests as a CLI for CI pipelines.

```javascript
// Supertest with Jest
const request = require('supertest');
const app = require('../app');

describe('GET /api/users/:id', () => {
  it('returns user by ID', async () => {
    const res = await request(app)
      .get('/api/users/1')
      .set('Authorization', 'Bearer token123');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Alice');
  });

  it('returns 404 for missing user', async () => {
    const res = await request(app).get('/api/users/999');
    expect(res.status).toBe(404);
  });
});
```

---

## 16. What is the difference between black-box and white-box testing?

Black-box testing treats the system as a closed box — tests are written based on specifications and requirements without knowledge of internal code. White-box testing uses knowledge of the internal implementation (code paths, logic, branches) to design tests. Black-box finds missing features, white-box finds hidden bugs. Most practical testing combines both approaches.

```javascript
// Black-box test — only knows API contract
test('POST /signup returns 201 for valid data', async () => {
  const res = await request(app)
    .post('/api/signup')
    .send({ email: 'a@b.com', password: 'Pass123!' });
  expect(res.status).toBe(201);
});

// White-box test — knows internal logic branches
test('signup rejects weak passwords', () => {
  // Testing internal validation logic directly
  expect(validatePassword('short')).toBe(false);
  expect(validatePassword('12345678')).toBe(false); // no uppercase
  expect(validatePassword('ValidPass1')).toBe(true);
});
```

---

## 17. What is regression testing?

Regression testing ensures that new code changes do not break existing functionality. Every time a bug is fixed or a feature is added, you run a broad set of pre-existing tests to catch regressions. Automated regression suites are essential for continuous delivery. CI pipelines typically run the full regression suite on every PR before allowing a merge.

```javascript
// Regression test — prevent reintroduction of past bugs

// Bug #42: Discount should not apply to gift cards
test('no discount on gift cards (regression)', () => {
  const giftCard = { type: 'gift', amount: 50 };
  const result = applyPromo(giftCard, 'SAVE20');
  expect(result.discount).toBe(0);  // Previous bug returned 10
});

// Run all existing tests on each PR
// "npm test" — entire test suite = regression safety net
```

---

## 18. How do you test components that depend on external APIs?

Mock the external API calls using Jest's `jest.mock()` or `jest.spyOn()` so tests run fast, deterministically, and without network dependency. For integration tests, use libraries like `msw` (Mock Service Worker) that intercept actual HTTP requests at the network level. Avoid hitting real APIs — they're slow, unreliable in CI, and may cost money per call.

```javascript
// Jest mock — replaces module
jest.mock('../api');
import { fetchUsers } from '../api';

test('UserList renders fetched users', async () => {
  fetchUsers.mockResolvedValue([
    { id: 1, name: 'Alice' }
  ]);
  render(<UserList />);
  expect(await screen.findByText('Alice')).toBeInTheDocument();
});

// MSW (Mock Service Worker) — intercepts real fetch calls
import { rest } from 'msw';
import { setupServer } from 'msw/node';
const server = setupServer(
  rest.get('/api/users', (req, res, ctx) =>
    res(ctx.json([{ id: 1, name: 'Alice' }]))
  )
);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## 19. What is the difference between testing pyramid and testing trophy approaches?

The testing pyramid (Mike Cohn) recommends many unit tests at the base, fewer integration tests in the middle, and few E2E tests at the top. The testing trophy (Kent C. Dodds) advocates for more integration tests as the "sweet spot" — they test how units work together, the trophy's widest part. It reduces over-isolated unit tests and brittle E2E tests in favor of component-level integration tests that give the best confidence-per-effort ratio.

```javascript
// Testing trophy approach — focus on integration tests

// Integration test (sweet spot) — tests component with real children
test('CheckoutForm calculates total and submits', async () => {
  render(<CheckoutForm />);
  await userEvent.type(screen.getByLabelText(/quantity/i), '3');
  expect(screen.getByText('$29.97')).toBeInTheDocument(); // integration
});

// Unit test (bottom of pyramid/trophy)
test('calculateTotal multiplies price * qty', () => {
  expect(calculateTotal(9.99, 3)).toBe(29.97);
});
```

---

## 20. How would you write a test for a custom React hook?

Use `renderHook` from `@testing-library/react-hooks` to test hooks in isolation without a component. `renderHook` returns a `result` object that updates with the hook's return value. Use `act` or `waitFor` for state updates and `rerender` to test prop changes. This avoids the boilerplate of creating wrapper components just for testing hooks.

```javascript
import { renderHook, act } from '@testing-library/react-hooks';
import useCounter from './useCounter';

test('useCounter increments and decrements', () => {
  const { result } = renderHook(() => useCounter(0));

  expect(result.current.count).toBe(0);

  act(() => result.current.increment());
  expect(result.current.count).toBe(1);

  act(() => result.current.increment());
  expect(result.current.count).toBe(2);

  act(() => result.current.decrement());
  expect(result.current.count).toBe(1);
});

test('useCounter resets to initial value', () => {
  const { result, rerender } = renderHook(
    (initial) => useCounter(initial),
    { initialProps: 0 }
  );
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);

  rerender(10);
  act(() => result.current.reset());
  expect(result.current.count).toBe(10);
});
```

---
