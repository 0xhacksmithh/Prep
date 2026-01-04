# Q1

```
console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => console.log("C"));

console.log("D");
```

### Output:

```
A
D
C
B
```

### Why?

- Sync → A, D

- Microtask queue → Promise (C)

- Macrotask queue → setTimeout (B)

# Q2

```
setTimeout(() => console.log(1));

setImmediate(() => console.log(2));

process.nextTick(() => console.log(3));
```

### Output:

```
3
1
2
```

### Explanation:

- `process.nextTick` → highest priority

- `setTimeout` → timers phase

- `setImmediate` → check phase

# Q3

```
async function test() {
  return "hello";
}

console.log(test());
```

### Output:

```
Promise { 'hello' }
```

### Why?

async always returns a Promise.

# Q4

```
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

### Output:

```
3
3
3
```

### Fix:

```
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

# Q5

```
Promise.resolve()
  .then(() => {
    throw new Error("err");
  })
  .catch(() => {
    console.log("caught");
  })
  .then(() => {
    console.log("after catch");
  });
```

### Output:

```
caught
after catch
```
