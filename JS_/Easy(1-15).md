# 1. What is JavaScript?

JavaScript is a high-level, interpreted programming language used to create dynamic and interactive web applications. It runs in browsers and on servers (Node.js).

# 2. Difference between var, let, and const?

| Feature  | var      | let       | const     |
| -------- | -------- | --------- | --------- |
| Scope    | Function | Block     | Block     |
| Hoisting | Yes      | Yes (TDZ) | Yes (TDZ) |
| Reassign | Yes      | Yes       | ❌ No     |

# 3. What is hoisting?

JavaScript moves variable and function declarations to the top of their scope during compilation.

```
console.log(a); // undefined
var a = 10;
```

# 4. What are data types in JS?

**Primitive:** `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`
**Non-Primitive:** `object`, `array`, `function`

# 5. What is null vs undefined?

**undefined** → variable declared but not assigned

**null** → explicitly assigned empty value

# 6. What is == vs ===?

**==** → loose equality (type coercion)

**===** → strict equality (no coercion)

# 7. What is a function?

A block of reusable code designed to perform a task.

# 8. What is an `arrow function`?

Shorter function syntax without its own this.

```
const add = (a, b) => a + b;
```

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

Prevents common JS mistakes.

```
"use strict";
```
