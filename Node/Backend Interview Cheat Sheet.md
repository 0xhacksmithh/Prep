## 🔹 Node.js Core

### Event Loop Phases

- Timers → setTimeout, setInterval

- I/O callbacks

- Idle / prepare

- Poll → I/O operations

- Check → setImmediate

- Close callbacks

📌 `process.nextTick()` runs before all phases

### Blocking vs Non-Blocking

- Blocking → CPU-heavy / sync code

- Non-Blocking → async I/O

⚠️ Never block the event loop

## 🔹 Async Patterns

### Callback → Promise → Async/Await

```
await fs.promises.readFile("file.txt");
```

### Common Mistake

```
array.forEach(async () => {}) // ❌
```

#### Correct:

```
for (const item of array) await task(item);
```

## 🔹 Express.js

### Middleware Order Matters

```
app.use(auth);
app.use(routes);
app.use(errorHandler);
```

### Error Middleware

```
app.use((err, req, res, next) => {
res.status(500).json({ error: err.message });
});
```

## 🔹 Authentication

### JWT Flow

```
Login → JWT issued → Client stores → API verifies
```

**JWT contains:**

- Header

- Payload

- Signature

⚠️ Never store secrets in JWT

## 🔹 Authorization

- RBAC (Role Based)

- ABAC (Attribute Based)

```
if (user.role !== "admin") throw Error("Forbidden");
```

## 🔹 Security

### Must-Know Attacks

- SQL / NoSQL Injection

- XSS

- CSRF

- Brute force

### Protection

- Helmet

- Rate limiting

- Input validation

- HTTPS

- bcrypt for passwords

## 🔹 Databases

### Indexing

- Speeds up reads

- Slows writes

```
db.users.createIndex({ email: 1 });
```

### Transactions

- Atomic

- Consistent

- Isolated

- Durable (ACID)

## 🔹 MongoDB

### populate vs lookup

- `populate()` → simple joins

- `$lookup` → aggregation joins

### Schema Best Practice

- Embed for read-heavy

- Reference for write-heavy

## 🔹 Caching

### Redis Use Cases

- Sessions

- Rate limiting

- API caching

- Distributed locks

```
SET key value EX 60
```

## 🔹 Scalability

### Horizontal Scaling

- Stateless services

- Load balancer

- Shared cache

### Vertical Scaling

- Increase CPU/RAM (limited)

## 🔹 Microservices

### Communication

- REST

- gRPC

- Message queues (Kafka / RabbitMQ)

### Pros

- Independent scaling

- Fault isolation

### Cons

- Distributed complexity

## 🔹 Message Queues

### When to Use

- Email sending

- Image processing

- Payments

- Notifications

```
API → Queue → Worker
```

## 🔹 Performance Optimization

- Avoid sync code

- Use clustering

- Cache aggressively

- Paginate DB queries

- Compress responses

## 🔹 Logging & Monitoring

### Tools

- Winston / Pino

- Prometheus

- Grafana

- ELK stack

📌 Logs should be structured

## 🔹 DevOps Basics

### CI/CD

- Lint

- Test

- Build

- Deploy

### Containers

- Docker

- Kubernetes

## 🔹 System Design One-Liners (Interview Gold)

- “Node.js is great for I/O-bound workloads, not CPU-bound.”

- “Start monolith, evolve into microservices.”

- “Cache is cheaper than DB.”

- “Make services stateless to scale horizontally.”
