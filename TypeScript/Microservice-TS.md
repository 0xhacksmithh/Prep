# 🟢 TASK 1: Type-Safe Service-to-Service Contract

### 🔥 Problem

Define a shared contract between User Service and Order Service.

### ✅ Solution

```c
// contracts/user.ts
export interface UserDTO {
  id: string;
  email: string;
  role: "admin" | "user";
}
```

```c
// order-service
import { UserDTO } from "@contracts/user";
```

### 🧠 Interviewer Evaluates

- Contract-first design

- No duplicated types

- Strong service boundaries

# 🟢 TASK 2: Typed REST Client Between Services

### 🔥 Problem

Call User Service from Order Service with full typing.

### ✅ Solution

```c
async function fetchUser(userId: string): Promise<UserDTO> {
  const res = await fetch(`http://user-service/users/${userId}`);
  return res.json() as Promise<UserDTO>;
}
```

### 🧠 Interviewer Evaluates

- API typing

- Async correctness

- Contract trust vs runtime validation

# 🟡 TASK 3: Typed Message Queue Events (Kafka / RabbitMQ)

### 🔥 Problem

Ensure correct payload per event.

### ✅ Solution

```c
type Events = {
  USER_CREATED: { id: string; email: string };
  ORDER_CREATED: { orderId: string; userId: string };
};

function publish<E extends keyof Events>(
  event: E,
  payload: Events[E]
) {}
```

### 🧠 Interviewer Evaluates

- Event-driven architecture

- Compile-time guarantees

- Messaging safety

# 🟡 TASK 4: Idempotent Event Consumer

### 🔥 Problem

Process events only once.

### ✅ Solution

```c
interface EventMeta {
  eventId: string;
}

function isProcessed(eventId: string): boolean {
  return false;
}

function handleEvent<T extends EventMeta>(event: T) {
  if (isProcessed(event.eventId)) return;
  // process event
}
```

### 🧠 Interviewer Evaluates

- Distributed systems thinking

- Idempotency

- Failure handling

# 🟡 TASK 5: Typed gRPC Service Definition (TS)

### 🔥 Problem

Define a gRPC-like service contract.

### ✅ Solution

```c
interface GetUserRequest {
  id: string;
}

interface GetUserResponse {
  id: string;
  email: string;
}

interface UserService {
  getUser(req: GetUserRequest): Promise<GetUserResponse>;
}
```

### 🧠 Interviewer Evaluates

- RPC thinking

- Strong contracts

- Sync vs async awareness

# 🔴 TASK 6: Distributed Error Model

### 🔥 Problem

Unify error handling across services.

### ✅ Solution

```c
type ServiceError =
  | { code: "NOT_FOUND"; message: string }
  | { code: "UNAUTHORIZED"; message: string }
  | { code: "INTERNAL_ERROR"; message: string };
```

### 🧠 Interviewer Evaluates

- Error taxonomy

- Cross-service consistency

- API reliability

# 🔴 TASK 7: Saga Pattern (Type-Level)

### 🔥 Problem

Model a saga with compensating actions.

### ✅ Solution

```c
type SagaStep<T> = {
  action: () => Promise<T>;
  compensate: () => Promise<void>;
};

type Saga = SagaStep<any>[];
```

### 🧠 Interviewer Evaluates

- Distributed transactions

- Failure recovery

- System design knowledge

# 🔴 TASK 8: Typed Config Per Service

### 🔥 Problem

Load config safely for each microservice.

### ✅ Solution

```c
interface UserServiceConfig {
  PORT: number;
  DB_URL: string;
}

function loadConfig(): UserServiceConfig {
  return {
    PORT: Number(process.env.PORT),
    DB_URL: process.env.DB_URL!,
  };
}
```

### 🧠 Interviewer Evaluates

- Infra readiness

- Environment isolation

- Runtime vs compile-time safety

# 🔴 TASK 9: API Versioning with Types

### 🔥 Problem

Support multiple API versions safely.

### ✅ Solution

```c
type UserV1 = { id: string; name: string };
type UserV2 = { id: string; fullName: string };

type UserResponse<V extends "v1" | "v2"> =
  V extends "v1" ? UserV1 : UserV2;
```

### 🧠 Interviewer Evaluates

- Backward compatibility

- Evolution-safe APIs

- Type-level modeling

# 🔴 TASK 10: Circuit Breaker Typing

### 🔥 Problem

Fail fast when downstream service is unhealthy.

### ✅ Solution

```c
type CircuitState = "OPEN" | "CLOSED" | "HALF_OPEN";

interface CircuitBreaker {
  state: CircuitState;
  failureCount: number;
}
```

### 🧠 Interviewer Evaluates

- Resilience patterns

- Distributed reliability

- Production mindset
