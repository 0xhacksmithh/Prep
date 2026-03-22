# 1. What is JavaScript?

JavaScript is a high-level, interpreted programming language used to create dynamic and interactive web applications. It runs in browsers and on servers (Node.js).

# 2. Difference between var, let, and const?

| Feature  | var      | let       | const     |
| -------- | -------- | --------- | --------- |
| Scope    | Function | Block     | Block     |
| Hoisting | Yes      | Yes (TDZ) | Yes (TDZ) |
| Reassign | Yes      | Yes       | ❌ No     |

# 3. What is hoisting?

Hoisting is JavaScript’s default behavior of moving declarations to the top of their scope during the compilation phase, before the code is executed.

**Important clarification:**

👉 JavaScript does NOT move your code physically.
👉 It registers declarations in memory before execution.

This happens during the creation phase of the Execution Context.

## 🔹 Two Phases of JavaScript Execution

When JS runs a file or function, it goes through:

### 1️⃣ Creation Phase

- Memory is allocated

- Variables & functions are registered

- `var` → initialized with `undefined`

- `let` & `const` → put in memory but NOT initialized

- Functions → fully stored in memory

### 2️⃣ Execution Phase

- Code runs line by line

- Values are assigned

- Functions execute

### 🔹 Hoisting with `var`

Example:

```c
console.log(a);
var a = 10;
```

**What you expect:**

❌ ReferenceError

**What happens:**

✔️ Prints undefined

**Why?**

JS internally treats it like:

```c
var a;        // hoisted (creation phase)
console.log(a);  // undefined
a = 10;       // execution phase
```

**Key Point:**

```c
var is hoisted and initialized with undefined.
```

🔹 Hoisting with let and const
Example:
console.log(b);
let b = 20;

**Output:**

❌ ReferenceError

**Why?**

Because `let` and `const` are hoisted BUT not initialized.

They stay in something called:

### 🔥 Temporal Dead Zone (TDZ)

**Temporal Dead Zone:**

The time between:

- entering the scope

- and the line where the variable is declared

Accessing variable in TDZ → ❌ ReferenceError

**Internally:**

```c
// memory allocated but NOT initialized
console.log(b); // ❌ Cannot access before initialization
let b = 20;
```

### 🔹 Hoisting with const

Same as `let`, but:

- Must be initialized during declaration

- Cannot be reassigned

```c
console.log(c);
const c = 30;
```

❌ ReferenceError (TDZ)

### 🔹 Function Hoisting

Functions are fully hoisted.

**Example:**

```c
greet();

function greet() {
  console.log("Hello");
}
```

✔️ Works fine.

Internally:

```c
function greet() {
  console.log("Hello");
}

greet();
```

Function declarations are completely stored in memory.

### 🔹 Function Expressions (Important Difference)

**Example:**

```c
sayHi();

var sayHi = function() {
  console.log("Hi");
};
```

**Output:**

❌ TypeError: sayHi is not a function

Why?

**Internally:**

```c
var sayHi;   // undefined
sayHi();     // undefined()
sayHi = function() { ... };
```

So you're calling `undefined()`.

### 🔹 Arrow Functions

Same as function expressions.

```c
hello();

let hello = () => {
  console.log("Hello");
};
```

❌ ReferenceError (TDZ)

Because `let` is in TDZ.

### 🔹 Visual Memory Diagram

**Example:**

```c
console.log(x);
var x = 5;

foo();

function foo() {
  console.log("Inside foo");
}
```

**Creation Phase Memory:**
| Identifier | Value |
| ---------- | ------------------ |
| x | undefined |
| foo | function reference |

**Execution Phase:**

- `console.log(x)` → undefined

- `x = 5`

- `foo()` → prints "Inside foo"

### 🔹 Hoisting Inside Functions

**Example:**

```c
function test() {
  console.log(a);
  var a = 100;
}

test();
```

**Output:**

```c
undefined
```

Because inside `test`, it becomes:

```c
function test() {
  var a;
  console.log(a);
  a = 100;
}
```

### 🔹 Trick Question (Interview Favorite)

```c
var a = 10;

function test() {
  console.log(a);
  var a = 20;
}

test();
```

**Output:**

```c
undefined
```

**Why?**

Inside function:

```c
function test() {
  var a;           // local a hoisted
  console.log(a);  // undefined
  a = 20;
}
```

Local `a` shadows global `a`.

### 🔹 Summary Table

| Declaration Type | Hoisted?           | Initialized?        | Access Before Declaration |
| ---------------- | ------------------ | ------------------- | ------------------------- |
| var              | Yes                | Yes (undefined)     | ✅ undefined              |
| let              | Yes                | No (TDZ)            | ❌ ReferenceError         |
| const            | Yes                | No (TDZ)            | ❌ ReferenceError         |
| function decl    | Yes                | Yes (full function) | ✅ Works                  |
| function expr    | Depends on var/let | Same rules apply    | ❌ Error                  |

### 🔹 Important Interview Insights

- Hoisting happens during compilation, not execution.

- `let` and `const` ARE hoisted — they just behave differently.

- Functions declarations are fully hoisted.

- `var` is function-scoped, `let` and `const` are block-scoped.

- TDZ prevents accidental bugs.

### 🔥 Final Definition (Precise)

Hoisting is JavaScript’s behavior of registering variable and function declarations in memory during the creation phase of execution before the code is executed.

# 4. What are data types in JS?

**Primitive:** `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`
**Non-Primitive:** `object`, `array`, `function`

# 5. What is null vs undefined?

**undefined** → variable declared but not assigned

**null** → explicitly assigned empty value

# 6. What is == vs ===?

### 🔍 Deep Explanation

1. **== (Loose Equality)**
   Converts operands to a common type before comparing
   This is called type coercion
   Examples:
   5 == "5" // true (string → number)
   false == 0 // true
   null == undefined // true
   "0" == false // true
   Why it’s risky:

Because JavaScript tries to be “helpful” → leads to unexpected bugs

2. **=== (Strict Equality)**
   No type conversion
   Checks:
   Type must match
   Value must match
   Examples:
   5 === "5" // false
   false === 0 // false
   null === undefined // false
   5 === 5 // true

### ⚠️ Important Edge Cases (Interview Gold)

1. **null vs undefined**

```c
null == undefined   // true
null === undefined  // false
```

2. **NaN (Tricky one!)**

```c
NaN == NaN   // false
NaN === NaN  // false
```

👉 Correct way:

```c
Number.isNaN(NaN) // true
```

3. **Object comparison**

```c
{} === {}   // false
```

👉 Because objects are compared by reference, not value.

### 🧠 When to Use What

Use `===` (Recommended ✅)

- Safer
- Predictable
- Industry standard
  **Rare case for ==**

```s
if (value == null)
```

👉 This checks both:

- `null`
- `undefined`

### 💡 Interview Tip Answer (Perfect Closing Line)

"== performs type coercion which can lead to unexpected results, while === ensures both type and value are equal. In production systems, we almost always use === for predictability and to avoid subtle bugs."

# 7. What is a function?

A block of reusable code designed to perform a task.

# 8. What is an `arrow function`?

An **arrow function** is a shorter and more concise way to write functions in JavaScript, introduced in ES6.

### 🔹 Basic Syntax

**Normal Function:**

```c
function add(a, b) {
  return a + b;
}
```

**Arrow Function:**

```c
const add = (a, b) => {
  return a + b;
};
```

### 🔹 Even Shorter (Implicit Return)

If there’s only one expression:

```c
const add = (a, b) => a + b;
```

👉 No `return` needed!

### 🔹 Key Features

**1. Shorter Syntax**

Cleaner and more readable:

```c
const greet = () => console.log("Hello!");
```

**2. No Own `this`**

Arrow functions do NOT have their own `this`.
They inherit `this` from their surrounding (lexical scope).

**Example:**

```c
const obj = {
  name: "JS",
  normalFunc: function () {
    console.log(this.name); // JS
  },
  arrowFunc: () => {
    console.log(this.name); // undefined (or global)
  }
};

obj.normalFunc();
obj.arrowFunc();
```

👉 This is the most important difference.

**3. Cannot Be Used as Constructor**

```c
const Person = (name) => {
  this.name = name;
};

const p = new Person("John"); // ❌ Error
```

**4. No `arguments` Object**

```c
const test = () => {
  console.log(arguments); // ❌ Not available
};
```

### 🔹 When to Use Arrow Functions

✅ Best for:

- Short functions
- Callbacks
- Functional programming (map, filter, reduce)

```c
[1, 2, 3].map(n => n * 2);
```

### 🔹 When NOT to Use

❌ Avoid in:

- Object methods (because of `this`)
- Constructors
- Event handlers (sometimes)

### 🔹 Quick Comparison

| Feature     | Normal Function | Arrow Function |
| ----------- | --------------- | -------------- |
| Syntax      | Longer          | Shorter        |
| `this`      | Own             | Inherited      |
| Constructor | ✅ Yes          | ❌ No          |
| `arguments` | ✅ Yes          | ❌ No          |

### 🔹 One-Line Definition

An arrow function is a shorter way to write functions in JavaScript with lexical `this` binding.

# 9. What is an array?

A collection of elements stored in a single variable.

# 10. Difference between `map` and `forEach`?

**map** → returns new array

**forEach** → does not return anything

# 11. What is `NaN`?

Represents Not a Number, result of invalid math operation.

# 12. What is template literal?

Allows embedded expressions using backticks.

```
`Hello ${name}`
```

# 13. What is `typeof`?

Returns the type of a variable.

# 14. What is a `callback` function?

A function passed as an argument to another function.

# 15. What is strict mode?

**Strict mode** in JavaScript is a way to opt into a stricter set of rules that helps you write cleaner, safer, and more predictable code.

### 🔹 How to Enable Strict Mode

Add this at the top of your file or function:

```c
"use strict";
```

👉 It can be:

- **Global** (entire file)
- **Local** (inside a function)

### 🔹 Why Strict Mode Exists

JavaScript was originally very permissive, which led to:

- Silent errors
- Bad practices
- Hard-to-debug bugs

Strict mode fixes these by:

- Throwing errors instead of failing silently
- Preventing unsafe behavior

### 🔹 Key Changes in Strict Mode

**1. ❌ No Undeclared Variables**

```c
"use strict";

x = 10; // ❌ ReferenceError
```

👉 In normal mode, this would create a global variable.

**2. ❌ `this` is Undefined in Functions**

```c
"use strict";

function test() {
  console.log(this); // undefined
}
test();
```

👉 Without strict mode → `this` would be the global object

**3. ❌ No Duplicate Parameter Names**

```c
"use strict";

function sum(a, a) { // ❌ Error
  return a + a;
}
```

**4. ❌ Cannot Delete Variables/Functions**

```c
"use strict";

let x = 10;
delete x; // ❌ Error
```

**5. ❌ Reserved Keywords Restricted**

You can't use future keywords as variable names:

```c
"use strict";

let interface = "test"; // ❌ Error
```

**6. ❌ Silent Failures Become Errors**

```c
"use strict";

Object.defineProperty({}, "x", { value: 10, writable: false });
x = 20; // ❌ Error instead of silent fail
```

### 🔹 Where Strict Mode is Already Enabled

You don’t need `"use strict"` in:

- ES6 modules (`import/export`)
- Classes

### 🔹 Benefits

✅ Catches bugs early
✅ Prevents accidental globals
✅ Makes code more secure
✅ Improves optimization by JS engines (like V8)

### 🔹 One-Line Summary

Strict mode makes JavaScript behave more like a disciplined language by enforcing stricter rules and throwing errors for unsafe code.
