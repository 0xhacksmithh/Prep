# 16. What is `closure`?

A closure is created when a function “remembers” and can access variables from its outer (lexical) scope, even after that outer function has finished executing.

### Simple Example

```c
function outer() {
  let count = 0;

  return function inner() {
    count++;
    console.log(count);
  };
}

const fn = outer();

fn(); // 1
fn(); // 2
fn(); // 3
```

💡 **What’s happening?**

- `outer()` executes and returns `inner`
- Normally, `count` should be gone
- But `inner` still remembers `count`

👉 That memory = **closure**

### 🧠 Key Idea (Important for Interview)

A closure consists of:

- Function
- Its lexical environment (captured variables)

### 🎯 Why Closures Exist

Because JavaScript uses:

- `Lexical scoping` (scope defined at write-time, not run-time)

### ⚙️ Real-World Use Cases

1. **Data Privacy / Encapsulation**

```c
function createCounter() {
  let count = 0;

  return {
    increment() {
      count++;
    },
    get() {
      return count;
    },
  };
}

const counter = createCounter();

counter.increment();
console.log(counter.get()); // 1
```

👉 `count` is private 2. **Function Factories**

```c
function multiply(x) {
  return function (y) {
    return x * y;
  };
}

const double = multiply(2);
console.log(double(5)); // 10
```

3. **setTimeout in loops (Classic Interview Trap)**

```c
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
// Output: 3 3 3
```

Fix using closure:

```c
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(() => console.log(j), 1000);
  })(i);
}
// Output: 0 1 2
```

### ⚠️ Common Pitfalls

**Memory leaks**

Closures keep references alive:

```c
function bigData() {
  let data = new Array(1000000).fill("🔥");

  return function () {
    console.log(data.length);
  };
}
```

👉 `data` never gets garbage collected

### 🔥 Interview-Level Explanation (Polished Answer)

A closure is formed when a function retains access to variables from its lexical scope even after the outer function has returned. This happens because functions in JavaScript capture their surrounding environment at the time of creation. Closures are commonly used for data encapsulation, function factories, and maintaining state in asynchronous code.

### 🧩 Bonus: Internal Mechanism (Advanced)

- Each function has:
  - [[Environment]] (hidden property)
- It points to:
  - Lexical Environment (scope chain)

👉 That’s how variables are preserved.

# 17. What is scope?

Scope defines where variables are accessible in your code — i.e., the region in which a variable can be used.

## 🧠 Types of Scope in JavaScript

### 1. Global Scope

Variables declared outside any function/block.

```c
let globalVar = "I am global";

function test() {
  console.log(globalVar);
}
```

👉 Accessible everywhere

### 2. Function Scope

Variables declared inside a function.

```c
function test() {
  let x = 10;
  console.log(x);
}

console.log(x); // ❌ ReferenceError
```

👉 Accessible only inside the function

### 3. Block Scope (ES6)

Variables declared using `let` and `const` inside `{}`

```c
{
  let a = 5;
  const b = 10;
}

console.log(a); // ❌
```

👉 Only available inside the block

### 4. Lexical Scope (VERY IMPORTANT)

Scope is determined by where code is written, not where it is called.

```c
function outer() {
  let x = 10;

  function inner() {
    console.log(x);
  }

  return inner;
}

const fn = outer();
fn(); // 10
```

👉 `inner` remembers `x` → this is also how closures work

### ⚠️ `var` vs `let` vs `const` (Interview Favorite)

```c
if (true) {
  var x = 10;
  let y = 20;
}

console.log(x); // ✅ 10
console.log(y); // ❌ ReferenceError
```

👉 var = function scoped
👉 let/const = block scoped

### 🔥 Scope Chain

When accessing a variable:

- JS looks in current scope
- Then parent scope
- Then global scope

```c
let a = 1;

function outer() {
  let b = 2;

  function inner() {
    let c = 3;
    console.log(a, b, c);
  }

  inner();
}
```

👉 This lookup = **scope chain**

### ⚠️ Shadowing

```c
let x = 10;

function test() {
  let x = 20;
  console.log(x);
}

test(); // 20
```

👉 Inner variable overrides outer one

### 💡 Interview-Ready Answer (Polished)

Scope in JavaScript defines the accessibility of variables. There are global, function, and block scopes, and JavaScript follows lexical scoping, meaning scope is determined at the time of code definition. When resolving variables, JavaScript uses the scope chain to look up from the current scope to outer scopes. Understanding scope is essential for concepts like closures and avoiding variable conflicts.

### 🧩 Quick Connection (Interview Bonus)

**Scope** → defines access
**Closure** → remembers scope

# 18. What is event loop?

The event loop is a mechanism that allows JavaScript (which is single-threaded) to handle asynchronous operations by continuously checking the call stack and task queues, and executing callbacks when the stack is empty.

### 🧠 Why Do We Need Event Loop?

JavaScript is:

- Single-threaded → one call stack
- But needs to handle:
  - API calls
  - DB queries
  - Timers
  - File I/O

👉 Event loop enables non-blocking I/O

### 🔄 Core Components

1. **Call Stack**

- Executes synchronous code
- LIFO (Last In First Out)

2. **Web APIs / Node APIs**

- Handle async work (setTimeout, HTTP, FS, etc.)

3. **Callback Queues**

- Macrotask Queue
  - setTimeout
  - setInterval
  - I/O callbacks
- Microtask Queue (Higher Priority 🚨)
  - Promise.then
  - process.nextTick (Node.js)

4. **Event Loop**

👉 Keeps checking:

```c
while (true) {
  if (callStack is empty) {
    run all microtasks
    run one macrotask
  }
}
```

### 🔥 Execution Flow Example

```c
console.log("Start");

setTimeout(() => console.log("Timeout"), 0);

Promise.resolve().then(() => console.log("Promise"));

console.log("End");
```

### 🧾 Output:

```c
Start
End
Promise
Timeout
```

### 💡 Why?

- `Start` → sync → call stack
- `End` → sync
- Microtask queue → `Promise`
- Macrotask queue → `setTimeout`

👉 Microtasks always run before macrotasks

### ⚠️ Node.js Specific (VERY IMPORTANT)

In Node.js, event loop phases:

- Timers
- Pending callbacks
- Idle/prepare
- Poll (I/O)
- Check (setImmediate)
- Close callbacks

Special:

`process.nextTick()` runs before microtasks (highest priority ⚡)

### 🎯 Real-World Example

```c
app.get("/user", async (req, res) => {
  const user = await db.query(); // async
  res.send(user);
});
```

👉 While DB is processing:

- Event loop handles other requests

### ⚠️ Common Mistake

```c
while (true) {}
```

👉 Blocks event loop → server freezes ❌

### 🔥 Interview-Level Answer (Polished)

The event loop is responsible for handling asynchronous operations in JavaScript by managing the execution of tasks from different queues. Since JavaScript is single-threaded, the event loop ensures non-blocking behavior by executing synchronous code first, then processing microtasks like promises, and finally macrotasks like timers and I/O callbacks. In Node.js, it consists of multiple phases such as timers, poll, and check, enabling efficient handling of concurrent operations.

### 🧩 Bonus (High-Level Insight)

- Event loop is part of runtime (Node.js / browser)
- Not part of the JavaScript engine (like V8)

# 19. What is promise?

### 🧠 Why Promises?

Before promises:

- Used callbacks
- Led to callback hell (nested, unreadable code)

👉 Promises provide:

- Cleaner syntax
- Better error handling
- Chaining

### 🔄 Promise States

A promise has 3 states:

- `Pending` → initial state
- `Fulfilled` → operation successful
- `Rejected` → operation failed

### 🔍 Basic Example

```c
const promise = new Promise((resolve, reject) => {
  let success = true;

  if (success) {
    resolve("Done!");
  } else {
    reject("Error!");
  }
});

promise
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
```

### ⚙️ How It Works

- `resolve()` → moves to fulfilled
- `reject()` → moves to rejected
- `.then()` → handles success
- `.catch()` → handles error
- `.finally()` → runs always

### 🔗 Promise Chaining

```c
fetchData()
  .then((data) => process(data))
  .then((result) => save(result))
  .catch((err) => console.error(err));
```

👉 Each `.then()` returns a new promise

### ⚠️ Error Handling

```c
Promise.resolve()
  .then(() => {
    throw new Error("Oops");
  })
  .catch((err) => console.log(err.message));
```

👉 Errors automatically propagate to `.catch()`

### 🚀 Async/Await (Built on Promises)

```c
async function getData() {
  try {
    const res = await fetchData();
    console.log(res);
  } catch (err) {
    console.error(err);
  }
}
```

👉 Cleaner syntax over promises

### 🎯 Real-World Example (Node.js)

```c
const fs = require("fs/promises");

async function readFile() {
  const data = await fs.readFile("file.txt", "utf-8");
  console.log(data);
}
```

### ⚠️ Common Pitfalls

1. **Not returning promise**

```c
.then(() => {
  fetchData(); // ❌ not returned
})
```

2. **Multiple resolve calls**

```c
resolve(1);
resolve(2); // ignored
```

3. **Unhandled rejections**

👉 Can crash Node.js in production

### 🔥 Interview-Level Answer (Polished)

A Promise in JavaScript is an object that represents the eventual result of an asynchronous operation. It can be in pending, fulfilled, or rejected state. Promises help avoid callback hell by allowing chaining with `.then()` and centralized error handling using `.catch()`. Modern JavaScript builds on promises using async/await for cleaner asynchronous code.

### 🧩 Bonus (Advanced Insight)

- Promises are executed in:
  - Microtask queue (higher priority than timers)
- They are eager → execute immediately when created

# 20. Promise states?

`pending`, `fulfilled`, `rejected`

# 21. What is async/await?

`async/await` is syntactic sugar over Promises that allows writing asynchronous code in a synchronous, readable way.

### 🧠 Core Concepts

1. **async keyword**

- Makes a function always return a Promise

```c
async function test() {
  return "Hello";
}
```

👉 Equivalent to:

```c
Promise.resolve("Hello");
```

2. **`await` keyword**

- Pauses execution until a Promise resolves
- Can only be used inside `async` functions

```c
async function test() {
  const result = await Promise.resolve("Hello");
  console.log(result);
}
```

### 🔄 Example (Before vs After)

**Using Promises:**

```c
fetchData()
  .then((data) => process(data))
  .catch((err) => console.error(err));
```

**Using async/await:**

```c
async function run() {
  try {
    const data = await fetchData();
    process(data);
  } catch (err) {
    console.error(err);
  }
}
```

👉 Cleaner, easier to read, looks synchronous

### ⚠️ Important Behavior

1. `await` is non-blocking

- It pauses only the async function
- Does NOT block the event loop

2. Runs in Microtask Queue

- Same as Promises (high priority in event loop)

3. Sequential vs Parallel Execution
   ❌ **Sequential (slow)**

```c
const a = await fetchA();
const b = await fetchB();
```

✅ **Parallel (fast)**

```c
const [a, b] = await Promise.all([fetchA(), fetchB()]);
```

### ⚠️ Error Handling

```c
async function test() {
  try {
    const data = await fetchData();
  } catch (err) {
    console.error(err);
  }
}
```

### ⚠️ Common Mistakes

1. Using await outside async

```c
await fetchData(); // ❌ error
```

2. Forgetting await

```c
const data = fetchData(); // returns Promise, not actual data
```

3. Blocking sequential calls

👉 Not using `Promise.all`

### 🎯 Real-World Example (Node.js)

```c
app.get("/user", async (req, res) => {
  try {
    const user = await db.getUser();
    res.json(user);
  } catch (err) {
    res.status(500).send("Error");
  }
});
```

### 🔥 Interview-Level Answer (Polished)

`async/await` is a syntax built on top of Promises that allows writing asynchronous code in a synchronous style. An `async` function always returns a Promise, and `await` pauses execution until the Promise resolves. It improves readability, simplifies error handling using try/catch, and avoids complex promise chaining.

### 🧩 Bonus Insight (Advanced)

-`await` internally uses `.then()`

- Execution is paused and resumed via event loop + microtask queue

# 22. Difference between synchronous & asynchronous?

**Sync** → blocking

**Async** → non-blocking

# 23. What is this?

`this` refers to the object that is currently executing the function. Its value is determined by how a function is called, not where it is defined.

### 🧠 Key Rule (Very Important)

👉 “this depends on call-site, not declaration”

### 🔍 Different Scenarios

1. **Global Scope**

```c
console.log(this);
```

- In browser → `window`
- In Node.js → `{}` (module.exports)

2. **Inside a Function**

```c
function test() {
  console.log(this);
}

test();
```

- Non-strict mode → global object
- Strict mode → undefined

3. **Inside an Object (Method)**

```c
const obj = {
  name: "JS",
  show() {
    console.log(this.name);
  },
};

obj.show(); // "JS"
```

👉 `this` = object before the dot (`obj`)

4. **Arrow Functions 🚨 (Very Important)**

```c
const obj = {
  name: "JS",
  show: () => {
    console.log(this.name);
  },
};

obj.show(); // undefined
```

👉 Arrow functions:

- Do NOT have their own `this`
- They inherit `this` from outer scope

5. **Constructor Function / Class**

```c
function User(name) {
  this.name = name;
}

const u = new User("John");
console.log(u.name);
```

👉 `this` = newly created object

6. **Explicit Binding (call, apply, bind)**

```c
function greet() {
  console.log(this.name);
}

const user = { name: "Alice" };

greet.call(user); // Alice
```

👉 You manually control `this`

7. **Event Handlers (Browser)**

```c
button.addEventListener("click", function () {
  console.log(this); // button
});
```

### ⚠️ Common Pitfalls

1. **Losing `this`**

```c
const obj = {
  name: "JS",
  show() {
    setTimeout(function () {
      console.log(this.name);
    }, 1000);
  },
};
```

👉 Fix with arrow function:

```c
setTimeout(() => console.log(this.name), 1000);
```

### 🔥 Interview-Level Answer (Polished)

In JavaScript, `this` refers to the execution context of a function and is determined by how the function is invoked. It can refer to the global object, the calling object, a newly created instance, or be explicitly set using call/apply/bind. Arrow functions differ because they don’t have their own `this` and instead inherit it from their lexical scope.

### 🧩 Quick Summary Table

| Case            | `this`             |
| --------------- | ------------------ |
| Global          | window / {}        |
| Function        | global / undefined |
| Object method   | object             |
| Arrow function  | inherited          |
| Constructor     | new object         |
| call/apply/bind | explicitly set     |

### 🧠 Pro Tip (Interview Gold)

There are 4 rules of `this` binding:

- Default binding
- Implicit binding
- Explicit binding
- `new` binding

# 24. What is `prototype`?

In JavaScript, a prototype is an object from which other objects inherit properties and methods.

### 🧠 Core Idea

JavaScript uses:
👉 **Prototype-based inheritance** (not classical class-based inheritance)

Every object in JS has a hidden link:

```c
[[Prototype]]
```

### 🔍 Basic Example

```c
function User(name) {
  this.name = name;
}

User.prototype.greet = function () {
  console.log("Hello " + this.name);
};

const u1 = new User("Alice");
u1.greet(); // Hello Alice
```

### 💡 What’s happening?

- `greet` is not inside the object
- It lives on `User.prototype`
- u1 accesses it via prototype chain

### 🔗 Prototype Chain

```c
u1 → User.prototype → Object.prototype → null
```

👉 If JS can't find a property:

- Looks in object
- Then prototype
- Then parent prototype
- Until `null`

### 🧪 Example

```c
const obj = { a: 1 };

console.log(obj.toString());
```

👉 `toString()` comes from `Object.prototype`

### ⚙️ Important Properties

1. **.prototype (on functions)**

```c
function A() {}
console.log(A.prototype);
```

👉 Used when creating objects with `new`

2. **`__proto__` (or `[[Prototype]]`)**

```c
const obj = {};
console.log(obj.__proto__);
```

👉 Points to parent object

### ⚠️ Difference (Interview Trap)

| Term        | Meaning                          |
| ----------- | -------------------------------- |
| `prototype` | Property of constructor function |
| `__proto__` | Actual link between objects      |

### 🚀 Why Prototypes?

1. **Memory Efficiency**

```c
function User(name) {
  this.name = name;
  this.sayHi = function () {}; // ❌ new copy per object
}
```

vs

```c
User.prototype.sayHi = function () {}; // ✅ shared
```

2. **Inheritance**

```c
function Animal() {}
Animal.prototype.eat = function () {};

function Dog() {}
Dog.prototype = Object.create(Animal.prototype);

const d = new Dog();
d.eat(); // inherited
```

### ⚠️ Common Pitfalls

1. **Overwriting prototype incorrectly**

```c
Dog.prototype = {
  bark() {}
};
```

👉 loses constructor reference

2. **Confusing class with prototype**

```c
class User {
  greet() {}
}
```

👉 Under the hood:

- Uses prototypes

### 🔥 Interview-Level Answer (Polished)

In JavaScript, a prototype is an object that enables inheritance. Every object has an internal reference to another object called its prototype, from which it can inherit properties and methods. When a property is accessed, JavaScript searches along the prototype chain until it finds the property or reaches null. This mechanism allows efficient memory usage and code reuse.

### 🧩 Bonus (Advanced Insight)

- Prototype chain lookup is dynamic
- Modifying prototype affects all instances

```c
User.prototype.sayBye = function () {};
```

👉 All existing objects get it instantly

### ⚡ Quick Summary

- JS uses `prototype-based inheritance`
- Functions have `.prototype`
- Objects have `[[Prototype]]`
- Lookup happens via `prototype chain`

# 25. What is prototype chain?

Answer:
Link between objects and their prototypes.

# 26. What is event bubbling, event capturing?

Event propagation in JavaScript happens in 3 phases:

- Capturing (trickling down)
- Target
- Bubbling (bubbling up)

## 🧠 Core Idea

When you click an element, the event doesn’t just happen there—it travels through the DOM tree.

## 🌳 Example DOM

```c
<div id="parent">
  <button id="child">Click me</button>
</div>
```

### 🔽 1. Event Capturing (Top → Down)

Event starts from the root and travels down to the target element

`document → html → body → div → button`

### 🎯 2. Target Phase

👉 Event reaches the actual clicked element (`button`)

### 🔼 3. Event Bubbling (Bottom → Up)

Event bubbles back up from the target

`button → div → body → html → document`

### 🔥 Example Code

```c
document.getElementById("parent").addEventListener(
  "click",
  () => console.log("Parent"),
  false // bubbling
);

document.getElementById("child").addEventListener(
  "click",
  () => console.log("Child"),
  false
);
```

Output when clicking button:

```c
Child
Parent
```

👉 Because default is bubbling phase

### ⚙️ Capturing Example

```c
document.getElementById("parent").addEventListener(
  "click",
  () => console.log("Parent"),
  true // capturing
);
```

Output:

```c
Parent
Child
```

### ⚠️ Key Differences

| Feature   | Capturing  | Bubbling    |
| --------- | ---------- | ----------- |
| Direction | Top → Down | Bottom → Up |
| Default   | ❌ No      | ✅ Yes      |
| Use case  | Rare       | Common      |

### 🛑 Stopping Propagation

```c
button.addEventListener("click", (e) => {
  e.stopPropagation();
});
```

👉 Prevents event from moving further

### 🚀 Real-World Use Case

Event Delegation (VERY IMPORTANT)

```c
document.getElementById("parent").addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    console.log("Button clicked");
  }
});
```

👉 Uses bubbling to handle multiple child elements efficiently

### 🔥 Interview-Level Answer (Polished)

Event propagation in JavaScript consists of three phases: capturing, target, and bubbling. In the capturing phase, the event travels from the root down to the target element. After reaching the target, it enters the bubbling phase where it propagates back up the DOM tree. By default, event listeners work in the bubbling phase, but capturing can be enabled explicitly. This mechanism enables patterns like event delegation and efficient event handling.

### 🧩 Bonus Tips (Interview Gold)

- Default phase = bubbling
- `addEventListener(type, handler, true)` → capturing
- `stopPropagation()` → stops flow
- Event delegation improves performance

# 27. What is event capturing?

Event propagates from `parent → child`.

# 28. What is deep vs shallow copy?

A shallow copy copies only the top-level properties, while a deep copy copies all nested objects recursively, creating completely independent copies.

### 🧠 Core Idea

👉 The difference comes down to references vs values

- Primitive types → copied by value
- Objects/arrays → copied by reference

### 🔍 Shallow Copy

**Definition:**

Copies only the first level; nested objects still share the same reference.

**Example**

```c
const original = {
  name: "Alice",
  address: { city: "Delhi" },
};

const copy = { ...original };

copy.address.city = "Mumbai";

console.log(original.address.city); // Mumbai ❌
```

👉 Why?

address is still pointing to the same object
**Ways to Create Shallow Copy**

```c
Object.assign({}, obj);
{ ...obj };
arr.slice();
```

### 🔥 Deep Copy

**Definition:**

Copies everything recursively, so no shared references.

**Example**

```c
const original = {
  name: "Alice",
  address: { city: "Delhi" },
};

const copy = structuredClone(original);

copy.address.city = "Mumbai";

console.log(original.address.city); // Delhi ✅
```

**Ways to Create Deep Copy**

1. **Modern (Best)**

```c
structuredClone(obj);
```

2. **JSON method (⚠️ limitations)**

```c
JSON.parse(JSON.stringify(obj));
```

❌ **Loses:**

- functions
- undefined
- Date, Map, Set

3. **Libraries**
   Lodash (cloneDeep)

### ⚠️ Key Differences

| Feature        | Shallow Copy        | Deep Copy      |
| -------------- | ------------------- | -------------- |
| Nested objects | Shared reference ❌ | Independent ✅ |
| Performance    | Faster              | Slower         |
| Memory         | Less                | More           |

### ⚠️ Interview Edge Case

```c
const a = { x: 1 };
const b = a;

b.x = 2;

console.log(a.x); // 2
```

👉 This is not a copy at all, just reference assignment

### 🎯 Real-World Use Case

- React state updates
- Redux immutability
- Preventing unintended side effects

### 🔥 Interview-Level Answer (Polished)

A shallow copy duplicates only the top-level properties of an object, while nested objects are still referenced, leading to shared mutations. In contrast, a deep copy recursively copies all levels, creating completely independent objects. Shallow copies are faster but can cause unintended side effects, whereas deep copies ensure immutability at the cost of performance.

### 🧩 Bonus Insight

- Spread operator (`...`) = shallow copy only
- Deep copy is essential for **immutable systems**

# 29. What is spread operator, rest operator?

The `...` operator is used as:

- `Spread operator` → expands elements
- `Rest operator` → collects elements

👉 Same syntax, different purpose depending on usage.

### 🧠 Key Difference

| Operator       | Purpose        |
| -------------- | -------------- |
| Spread (`...`) | Expands values |
| Rest (`...`)   | Gathers values |

## 🔍 1. Spread Operator (Expand)

### 👉 Used to “spread out” elements

**Arrays**

```c
const arr = [1, 2, 3];
const newArr = [...arr, 4];

console.log(newArr); // [1, 2, 3, 4]
```

**Objects**

```c
const obj = { a: 1, b: 2 };
const newObj = { ...obj, c: 3 };
```

**Function Arguments**

```c
function sum(a, b, c) {
  return a + b + c;
}

const nums = [1, 2, 3];
sum(...nums); // 6
```

### 💡 Use Cases

- Copy arrays/objects (⚠️ shallow copy)
- Merge objects
- Pass dynamic arguments

## 🔄 2. Rest Operator (Collect)

### 👉 Used to “collect remaining values”

**Function Parameters**

```c
function sum(...numbers) {
  return numbers.reduce((acc, val) => acc + val, 0);
}

sum(1, 2, 3, 4); // 10
```

**Destructuring (Array)**

```c
const [a, b, ...rest] = [1, 2, 3, 4];

console.log(rest); // [3, 4]
```

**Destructuring (Object)**

```c
const { a, ...rest } = { a: 1, b: 2, c: 3 };

console.log(rest); // { b: 2, c: 3 }
```

### ⚠️ Key Rules

1. **Position matters (Rest)**

```c
function test(a, ...rest) {} // ✅
function test(...rest, a) {} // ❌
```

2. **Spread creates shallow copy**

```c
const obj = { a: { b: 1 } };
const copy = { ...obj };

copy.a.b = 2;

console.log(obj.a.b); // 2 ❌
```

### 🔥 Interview-Level Answer (Polished)

The spread and rest operators both use the `...` syntax but serve opposite purposes. The spread operator expands elements of arrays or objects into individual elements, commonly used for copying or merging. The rest operator collects multiple elements into a single array or object, typically used in function parameters or destructuring. The distinction depends on the context in which the operator is used.

### 🧩 Quick Memory Trick

**Spread** → “expand”
**Rest** → “collect the rest”

### ⚡ Common Interview Follow-up

👉 Q: Is spread deep copy?
👉 A: ❌ No, it’s a shallow copy

# 30. What is rest operator?

Collects arguments.

```
function sum(...nums) {}
```

# 31. What is destructuring?

Destructuring is a syntax in JavaScript that allows you to extract values from arrays or properties from objects into variables in a concise way.

### 🧠 Why Use Destructuring?

- Cleaner code
- Less repetition
- Easier to read

### 🔍 1. Array Destructuring

```c
const arr = [1, 2, 3];

const [a, b, c] = arr;

console.log(a, b, c); // 1 2 3
```

**Skip values**

```c
const [a, , c] = [1, 2, 3];
console.log(c); // 3
```

**Default values**

```c
const [a = 10, b = 20] = [1];
console.log(a, b); // 1 20
```

### 🔍 2. Object Destructuring

```c
const user = {
  name: "Alice",
  age: 25,
};

const { name, age } = user;

console.log(name, age);
```

**Rename variables**

```c
const { name: userName } = user;
console.log(userName);
```

**Default values**

```c
const { city = "Delhi" } = user;
```

### 🔄 Nested Destructuring

```c
const user = {
  name: "Alice",
  address: { city: "Delhi" },
};

const {
  address: { city },
} = user;

console.log(city);
```

### 🔁 With Rest Operator

```c
const { a, ...rest } = { a: 1, b: 2, c: 3 };

console.log(rest); // { b: 2, c: 3 }
```

### ⚙️ Function Parameters (Very Common)

```c
function greet({ name, age }) {
  console.log(name, age);
}

greet({ name: "Alice", age: 25 });
```

### ⚠️ Common Pitfalls

1. Undefined error

```c
const { a } = undefined; // ❌ error
```

2. Nested safety

```c
const user = {};
const { address: { city } = {} } = user;
```

### 🎯 Real-World Use Cases

- API response handling
- Function arguments
- React props
- Config objects

### 🔥 Interview-Level Answer (Polished)

Destructuring is a JavaScript feature that allows extracting values from arrays or properties from objects into variables using a concise syntax. It improves code readability and reduces repetition. It supports default values, renaming, nested extraction, and can be combined with the rest operator for flexible data handling.

### 🧩 Bonus Insight

- Works with:
  - Arrays
  - Objects
  - Function parameters
- Often used with spread/rest

# 32. What is `IIFE`?

An IIFE (Immediately Invoked Function Expression) is a function that is defined and executed immediately after its creation.

### 🔍 Basic Syntax

```c
(function () {
  console.log("IIFE executed");
})();
```

👉 **Breakdown:**

```c
function () {} → function expression
( ... ) → wraps it
() → invokes it immediately
```

### 🧠 Why Use IIFE?

1. **Avoid Global Scope Pollution**

```c
(function () {
  let secret = "hidden";
})();

console.log(secret); // ❌ ReferenceError
```

👉 Variables stay private

2. **Create Private Scope (Before ES6)**

Before let/const, IIFE was used to simulate block scope.

3. **Execute Code Immediately**

```c
const result = (function () {
  return 2 + 3;
})();

console.log(result); // 5
```

### ⚙️ Variations

**Arrow Function IIFE**

```c
(() => {
  console.log("Arrow IIFE");
})();
```

**With Parameters**

```c
(function (name) {
  console.log("Hello " + name);
})("Alice");
```

### ⚠️ Important Detail

👉 Must wrap function in parentheses
Otherwise JS treats it as a declaration

```c
function () {}(); // ❌ error
```

### 🎯 Real-World Use Cases

- Encapsulation in older JS codebases
- Module pattern (before ES Modules)
- Initialization logic

### 🔥 Interview-Level Answer (Polished)

An IIFE, or Immediately Invoked Function Expression, is a function that is defined and executed immediately. It is used to create a private scope and avoid polluting the global namespace. Before ES6 introduced block scoping with let and const, IIFEs were commonly used to achieve data encapsulation.

### 🧩 Bonus Insight

- Still used in:
  - Bundlers
  - Library wrappers
- Less common now due to:
  - ES Modules
  - Block scope (let, const)

# 33. What is `debounce`?

Debouncing is a technique that ensures a function is only executed after a certain delay has passed since the last time it was called.

### 🧠 Core Idea

👉 “Wait until the user stops doing something, then run the function.”

### 🔍 Example Scenario

**Search Input (Classic)**

- User types: `a → ab → abc → abcd`
- Without debounce → 4 API calls ❌
- With debounce → 1 API call after typing stops ✅

### ⚙️ Implementation

```c
function debounce(fn, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

### 🚀 Usage

```c
const handleSearch = debounce((query) => {
  console.log("API call with:", query);
}, 500);

// simulate typing
handleSearch("a");
handleSearch("ab");
handleSearch("abc");
```

👉 Only last call runs after 500ms

### 🔄 How It Works

- Function is called
- Previous timer is cleared
- New timer is set
- Only the last call executes

### ⚠️ Key Characteristics

- Delays execution
- Resets timer on each call
- Executes only once after inactivity

### 🎯 Real-World Use Cases

- Search input (API calls)
- Window resize events
- Scroll handlers
- Button spam prevention

### 🔥 Debounce vs Throttle (Interview Follow-up)

| Feature   | Debounce    | Throttle     |
| --------- | ----------- | ------------ |
| Execution | After delay | At intervals |
| Use case  | Typing      | Scrolling    |

### ⚠️ Common Pitfall

👉 Losing `this` context (fixed using `.apply(this, args)`)

### 🔥 Interview-Level Answer (Polished)

Debouncing is a technique used to limit the execution of a function by delaying it until after a specified period of inactivity. It is commonly used in scenarios like search inputs or resize events to prevent excessive function calls and improve performance.

### 🧩 Bonus (Advanced)

**Immediate Debounce (Leading Edge)**

```c
function debounce(fn, delay, immediate = false) {
  let timer;

  return function (...args) {
    const callNow = immediate && !timer;

    clearTimeout(timer);

    timer = setTimeout(() => {
      timer = null;
    }, delay);

    if (callNow) fn.apply(this, args);
  };
}
```

# 34. What is `throttle`?

**Throttling** is a technique that ensures a function is executed at most once in a specified time interval, no matter how many times it is triggered.

### 🧠 Core Idea

👉 “Run the function at a fixed rate, even if events fire continuously.”

### 🔍 Example Scenario

**Scroll Event**

- User scrolls continuously
- Without throttle → 100+ calls/sec ❌
- With throttle → 1 call every 200ms ✅

### ⚙️ Implementation (Basic)

```c
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

### 🚀 Usage

```c
const handleScroll = throttle(() => {
  console.log("Scroll event");
}, 200);

window.addEventListener("scroll", handleScroll);
```

👉 Executes at most once every 200ms

### 🔄 How It Works

- First call executes immediately
- Further calls within the time window are ignored
- Executes again after the interval

### ⚠️ Key Characteristics

- Limits execution frequency
- Ensures consistent intervals
- Does not wait for inactivity

### 🔥 Throttle vs Debounce

| Feature   | Throttle       | Debounce     |
| --------- | -------------- | ------------ |
| Execution | Every interval | After delay  |
| Behavior  | Continuous     | After stop   |
| Use case  | Scroll, resize | Search input |

### ⚠️ Advanced Version (Trailing Execution)

```c
function throttle(fn, limit) {
  let lastCall = 0;
  let timer;

  return function (...args) {
    const now = Date.now();

    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        lastCall = Date.now();
        fn.apply(this, args);
      }, limit - (now - lastCall));
    }
  };
}
```

👉 Ensures last call is not lost

### 🎯 Real-World Use Cases

- Scroll tracking
- Window resize
- Button click rate limiting
- API polling

### ⚠️ Common Pitfalls

- Missing last event (fixed with trailing execution)
- Incorrect `this` binding (use `.apply`)

### 🔥 Interview-Level Answer (Polished)

Throttling is a technique used to limit the frequency of function execution by ensuring it runs at most once within a specified time interval. It is useful in handling high-frequency events like scrolling or resizing, where continuous execution would impact performance. Unlike debouncing, throttling ensures regular execution rather than waiting for inactivity.

### 🧩 Bonus Insight

- Throttle = rate limiting on frontend
- Very similar concept used in backend APIs (rate limiter)

# 35. What is `memoization`?

Memoization is an optimization technique where you cache the result of a function call and return the cached result when the same inputs occur again, instead of recomputing.

### 🧠 Core Idea

👉 “Don’t recompute if you already know the answer.”

### 🔍 Basic Example

```c
function slowSquare(n) {
  console.log("Computing...");
  return n * n;
}

console.log(slowSquare(5)); // Computing... 25
console.log(slowSquare(5)); // Computing... 25 ❌ (recomputed)
```

### 🚀 Memoized Version

```c
function memoize(fn) {
  const cache = {};

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache[key]) {
      return cache[key]; // return cached result
    }

    const result = fn.apply(this, args);
    cache[key] = result;

    return result;
  };
}

const fastSquare = memoize((n) => {
  console.log("Computing...");
  return n * n;
});

fastSquare(5); // Computing...
fastSquare(5); // ✅ cached (no log)
```

### ⚙️ How It Works

- Store results in a cache (object/map)
- Use input as key
- If key exists → return cached value
- Else → compute + store

### 🎯 Real-World Use Cases

- Expensive computations (Fibonacci, DP problems)
- API response caching
- Database query caching
- React optimization (useMemo)

### ⚠️ Important Considerations

1. **Cache Key**

- Must uniquely represent inputs
- Complex objects → tricky (use hashing or stable stringify)

2. **Memory Usage**

- Cache grows over time → risk of memory leak
- Use:
  - LRU cache
  - TTL (expiry)

3. **Pure Functions Only** 🚨

👉 Works best when:

- Same input → same output
- No side effects

### 🔥 Example (Classic Fibonacci)

```c
function memoFib(n, cache = {}) {
  if (n <= 1) return n;

  if (cache[n]) return cache[n];

  cache[n] = memoFib(n - 1, cache) + memoFib(n - 2, cache);
  return cache[n];
}
```

### ⚠️ Memoization vs Caching

| Feature | Memoization    | Caching      |
| ------- | -------------- | ------------ |
| Scope   | Function-level | System-wide  |
| Use     | Computation    | Data/storage |
| Example | Fibonacci      | Redis cache  |

### 🔥 Interview-Level Answer (Polished)

Memoization is an optimization technique where the results of function calls are cached based on their inputs, so repeated calls with the same arguments return the cached result instead of recomputing. It is especially useful for expensive or recursive computations and works best with pure functions.

### 🧩 Bonus Insight

- Memoization is a form of:
  - Dynamic Programming
- Widely used in:
  - React (`useMemo`, `useCallback`)
  - Backend caching layers (like Redis)
