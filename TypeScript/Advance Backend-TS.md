# 1️⃣ Type-Safe Route Params Extractor

### 🔥 Problem

Extract route params from an Express-style path string.

```c
type Params = ExtractParams<"/users/:id/posts/:postId">;
// expected: { id: string; postId: string }
```

### ✅ Solution

```c
type ExtractParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractParams<Rest>]: string }
    : T extends `${string}:${infer Param}`
      ? { [K in Param]: string }
      : {};
```

### 🧠 Interviewer Tests

- Template literal types

- Recursive conditional types

- String inference

# 2️⃣ API Response Based on Status Code

### 🔥 Problem

Return different response shapes based on HTTP status code.

```c
type ApiResponse<T, S extends number> =
  S extends 200 ? { success: true; data: T } :
  S extends 400 ? { success: false; error: string } :
  never;
```

### ✅ Usage

```c
type Success = ApiResponse<User, 200>;
type Error = ApiResponse<never, 400>;
```

### 🧠 Interviewer Tests

- Conditional types

- Business-logic modeling

- Compile-time guarantees

# 3️⃣ Enforce Required Keys Dynamically

### 🔥 Problem

Make selected keys required.

```c
type RequireKeys<T, K extends keyof T> =
  T & { [P in K]-?: T[P] };
```

### ✅ Example

```c
type User = {
  id?: string;
  email?: string;
};

type UserWithEmail = RequireKeys<User, "email">;
```

### 🧠 Interviewer Tests

- Mapped types

- `-?` modifier

- Partial → required transitions

# 4️⃣ Type-Safe Event Bus

### 🔥 Problem

Ensure correct payload for each event.

### ✅ Solution

```c
type Events = {
  USER_CREATED: { id: string };
  USER_DELETED: { id: string };
};

function emit<E extends keyof Events>(
  event: E,
  payload: Events[E]
) {}
```

### 🧠 Interviewer Tests

- Keyed generics

- Event-driven architecture modeling

- API safety

# 5️⃣ Extract Promise Result Type

### 🔥 Problem

Extract resolved type from a Promise.

### ✅ Solution

```c
type UnwrapPromise<T> =
  T extends Promise<infer R> ? R : T;
```

### 🧠 Interviewer Tests

- infer

- Async typing

- Utility-type internals

# 6️⃣ Strict MongoDB Update Type

### 🔥 Problem

Allow partial updates but forbid \_id.

### ✅ Solution

```c
type Update<T> = Partial<Omit<T, "_id">>;
```

# 🧠 Interviewer Tests

- Security-aware typing

- Omit + Partial

- Backend data safety

# 7️⃣ Enforce At Least One Property

### 🔥 Problem

Ensure at least one field is present.

### ✅ Solution

```c
type AtLeastOne<T> = {
  [K in keyof T]: Pick<T, K>
}[keyof T];
```

### 🧠 Interviewer Tests

- Indexed access types

- Union distribution

- Validation at compile time

# 8️⃣ Type-Safe Config Loader

### 🔥 Problem

Fail compile-time if env key is missing.

### ✅ Solution

```c
type EnvSchema = {
  PORT: string;
  DB_URL: string;
};

function getEnv<K extends keyof EnvSchema>(key: K): string {
  return process.env[key]!;
}
```

### 🧠 Interviewer Tests

- Key constraints

- Configuration safety

- Infra readiness

# 9️⃣ Validate DTO Keys Against Entity

### 🔥 Problem

Ensure DTO contains only entity keys.

### ✅ Solution

```c
type StrictDTO<T, U extends Partial<T>> =
  Exclude<keyof U, keyof T> extends never ? U : never;
```

### 🧠 Interviewer Tests

- Exclude

- Type validation patterns

- API correctness

# 🔟 Deep Readonly (Recursive)

### 🔥 Problem

Make an object deeply immutable.

### ✅ Solution

```c
type DeepReadonly<T> =
  T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;
```

### 🧠 Interviewer Tests

- Recursion

- Type-level immutability

- State safety
