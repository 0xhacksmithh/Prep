# 🟢 TASK 1: Type-Safe User Model

### 📌 Problem

Create a `User` type with:

- `id` (readonly)

- `email`

- `password`

- `role` (`"admin" | "user"`)

### ✅ Solution

```c
type Role = "admin" | "user";

interface User {
  readonly id: string;
  email: string;
  password: string;
  role: Role;
}
```

### 🧠 Interviewer Looks For

- Union types

- Readonly usage

- Clean modeling

# 🟢 TASK 2: Type an Express Request Body

### 📌 Problem

Create a login controller with typed request body.

### ✅ Solution

```c
import { Request, Response } from "express";

interface LoginBody {
  email: string;
  password: string;
}

const login = (req: Request<{}, {}, LoginBody>, res: Response) => {
  const { email, password } = req.body;
  res.json({ email });
};
```

### 🧠 Interviewer Looks For

- Express generics

- Strong API typing

- No any

# 🟡 TASK 3: Generic API Response Wrapper

### 📌 Problem

Create a reusable API response type.

### ✅ Solution

```c
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

**Usage**

```c
const response: ApiResponse<User> = {
  success: true,
  data: user,
};
```

### 🧠 Interviewer Looks For

- Generics

- Reusability

- Clean architecture

# 🟡 TASK 4: Safe Environment Variable Loader

### 📌 Problem

Type environment variables safely.

### ✅ Solution

```c
interface Env {
  PORT: number;
  DB_URL: string;
}

function loadEnv(): Env {
  return {
    PORT: Number(process.env.PORT),
    DB_URL: process.env.DB_URL!,
  };
}
```

### 🧠 Interviewer Looks For

- `!` non-null assertion

- Runtime + compile-time safety awareness

# 🟡 TASK 5: Role-Based Authorization Middleware

### 📌 Problem

Create a role-check middleware.

### ✅ Solution

```c
type Role = "admin" | "user";

interface AuthUser {
  id: string;
  role: Role;
}

function authorize(roles: Role[]) {
  return (user: AuthUser): boolean => {
    return roles.includes(user.role);
  };
}
```

### 🧠 Interviewer Looks For

- Union types

- Functional design

- Business logic clarity

# 🔴 TASK 6: Discriminated Union for API Errors

### 📌 Problem

Model API errors safely.

### ✅ Solution

```c
type ApiError =
  | { type: "VALIDATION_ERROR"; message: string }
  | { type: "AUTH_ERROR"; message: string }
  | { type: "SERVER_ERROR"; message: string };

function handleError(error: ApiError) {
  switch (error.type) {
    case "VALIDATION_ERROR":
      return 400;
    case "AUTH_ERROR":
      return 401;
    case "SERVER_ERROR":
      return 500;
  }
}
```

### 🧠 Interviewer Looks For

- Discriminated unions

- Exhaustive handling

- Clean error design

# 🔴 TASK 7: Generic Repository Pattern

### 📌 Problem

Create a reusable repository interface.

### ✅ Solution

```c
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  create(data: T): Promise<T>;
}
```

**Usage**

```c
class UserRepo implements Repository<User> {
  async findById(id: string) {
    return null;
  }
  async create(data: User) {
    return data;
  }
}
```

### 🧠 Interviewer Looks For

- Generics

- Clean architecture

- SOLID principles

# 🔴 TASK 8: Type-Safe JWT Payload

### 📌 Problem

Type JWT payload for authentication.

### ✅ Solution

```
interface JwtPayload {
  userId: string;
  role: Role;
}
```

### 🧠 Interviewer Looks For

- Security awareness

- Strong typing in auth flows

# 🔴 TASK 9: Safe JSON Parser (Advanced)

### 📌 Problem

Parse JSON safely with TypeScript.

### ✅ Solution

```c
function parseJSON<T>(json: string): T {
  return JSON.parse(json) as T;
}
```

📌 Bonus improvement: runtime validation (Zod).

# 🔴 TASK 10: Async Function with Proper Typing

### 📌 Problem

Fetch user asynchronously.

### ✅ Solution

```c
async function getUserById(id: string): Promise<User | null> {
  return null;
}
```

### 🧠 Interviewer Looks For

- Promise typing

- Async correctness

- Null handling
