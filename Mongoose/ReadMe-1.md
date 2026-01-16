# 1 Code Explanation

```c
/* 🔐 Hash password before saving */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

```

```
/* 🔍 Compare password method */
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
```

## Explaination

### 1️⃣ What does this mean here?

**Context: Mongoose document methods & middleware**

In Mongoose, when you use a regular function (not an arrow function):

```
function () { ... }
```

👉 **this** refers to the current document instance.

That means:

```
this === the user document being saved or operated on
```

Example user document:

```
{
  _id: ObjectId("..."),
  email: "test@gmail.com",
  password: "plainPassword123",
  role: "user"
}
```

### 2️⃣ this inside pre("save")

```
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

**What is this here?**

👉 **this** = the user document that is about to be saved

So:

```
this.password      // current user's password
this.email         // user's email
this.role          // user's role
```

### Why this.isModified("password")?

- Prevents re-hashing password when:

  - user updates email
  - user updates profile

- Only hashes when password actually changed

### Why NOT arrow function?

❌ Arrow functions do **NOT have their own this**

```
// ❌ WRONG
userSchema.pre("save", async (next) => {
  console.log(this); // undefined
});
```

### ✅ Always use function() in Mongoose hooks

### 3️⃣ How is comparePassword method created?

```
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};
```

What does **this** do?

You are adding a custom instance method to the schema.

```
Mongoose internally does:

User.prototype.comparePassword = function () {}
```

So every document created from this schema gets **this** method.

### 4️⃣ What is this inside comparePassword?

Again:

👉 **this** = the current user document

Example:

```
const user = await User.findOne({ email });
await user.comparePassword("123456");
```

Inside comparePassword:

```
this.password === user.password (hashed)
```

So this line:

```
bcrypt.compare(password, this.password);
```

Means:

- password → plain text from login request

- this.password → hashed password from DB

### 5️⃣ How does this method get used?

**Example: Login flow**

```
const user = await User.findOne({ email });

if (!user) throw new Error("User not found");

const isMatch = await user.comparePassword(password);

if (!isMatch) throw new Error("Invalid credentials");
```

✨ Clean, reusable, readable

### 6️⃣ Difference between methods vs statics

| Type             | Used on           | Example                  |
| ---------------- | ----------------- | ------------------------ |
| `schema.methods` | Document instance | `user.comparePassword()` |
| `schema.statics` | Model             | `User.findByEmail()`     |

**Static example:**

```
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};
```

Usage:

```
User.findByEmail("test@gmail.com");
```

### 7️⃣ Mental Model (VERY IMPORTANT)

Think like this:

```
Schema → Model → Document
         |
         |-- methods → available on document
```

- **this** in methods/hooks = document

- **this** in statics = model

### 8️⃣ Summary

- ✔ this refers to the current user document
- ✔ pre("save") runs before saving a document
- ✔ comparePassword is an instance method
- ✔ Mongoose attaches methods to User.prototype
- ✔ Never use arrow functions in Mongoose hooks

# 2. Code Explanation

```c
    type: {
      type: String,
      enum: ["reader", "author", "admin"],
      default: "reader",
      required: true,
    },
```

## Explanation

```c
enum: ["reader", "author", "admin"]
```

**What it does**

👉 Restricts allowed values for this field

Only these are valid:

- "reader"

- "author"

- "admin"

❌ Anything else is rejected.

**Example**

```c
new User({ type: "hacker" })
```

❌ Validation error:

```c
`hacker` is not a valid enum value for path `type`
```

This is schema-level authorization control (very important).

### default: "reader"

```c
default: "reader"
```

**What it does**

If the field is not provided, Mongoose automatically sets:

```c
type = "reader"
```

Example:

```c
new User({ email, password })
```

Saved document:

```c
{
  "email": "x@y.com",
  "password": "...",
  "type": "reader"
}
```

- ✔ Prevents undefined roles
- ✔ Safe default (least privilege)

### How Mongoose enforces this

**At save time**

Mongoose runs:

- Type check

- Enum validation

- Required validation

- Default assignment

Before data reaches MongoDB.

### What happens at runtime (flow)

**Case 1: No type provided**

```
await User.create({ email, password });
```

Result:

```c
"type": "reader"
```

**Case 2: Invalid role**

```c
await User.create({ type: "superadmin" });
```

❌ Validation error

**Case 3: Valid role**

```c
await User.create({ type: "admin" });
```

✔ Saved

### Common mistakes 🚨

❌ **Mistake 1: Using array without enum**

```c
type: ["reader", "author", "admin"] // WRONG
```

❌ **Mistake 2: Trusting frontend role**

Never do:

```c
type: req.body.type
```

Always validate or override on backend.

# 3. Code Exaplanation

```c
const user = await User.findOne({ email }).select("+password");
```

## Explanation

### 1️⃣ User.findOne({ email })

**What it does**

👉 Queries MongoDB to find one user document where:

```c
email === email
```

Equivalent MongoDB query:

```c
db.users.findOne({ email: "test@gmail.com" })
```

**Return value**

- If found → Mongoose document

- If not found → null

### 2️⃣ Why .findOne() instead of .find()

| Method      | Returns                   |
| ----------- | ------------------------- |
| `findOne()` | Single document or `null` |
| `find()`    | Array of documents        |

For login:

```c
findOne() ✅
find() ❌
```

### 3️⃣ **.select("+password")** ← MOST IMPORTANT PART

This only makes sense if your schema has:

```c
password: {
  type: String,
  required: true,
  select: false
}
```

What `select: false` does

By default, password is excluded from queries:

```c
await User.findOne({ email });
// password ❌ NOT included
```

This prevents:

- Accidental password leaks

- Returning hashed passwords in APIs

### 4️⃣ What does +password mean?

```c
.select("+password")
```

👉 Explicitly override select: false
👉 Force Mongoose to include the password only for this query

**Think of it as:**

```c
"Even though password is hidden by default, include it this time"
```

### 5️⃣ Without .select("+password")

```c
const user = await User.findOne({ email });
console.log(user.password); // undefined
```

Then this fails:

```c
await user.comparePassword(password); // ❌
```

Because:

```c
bcrypt.compare(plain, undefined)
```

### 6️⃣ With .select("+password")

```c
const user = await User.findOne({ email }).select("+password");
```

Returned document:

```c
{
  _id: "...",
  email: "test@gmail.com",
  password: "$2b$10$abc...",
  role: "reader"
}
```

✔ Safe because:

- Password is still hashed

- Used only for authentication

- Not sent in API response

### 7️⃣ Why NOT always select password?

**Security reason** 🔐

If password is always included:

- Any accidental res.json(user) leaks hashes

- Logs may expose sensitive data

This pattern:

select: false + explicit +password

is a **best practice.**

### 8️⃣ What type of object is `user`?

```c
user instanceof mongoose.Document // true
```

So you can do:

```c
user.comparePassword(password);
user.isModified("password");
user.save();
```

### 9️⃣ What happens if user not found?

```c
const user = await User.findOne({ email }).select("+password");

if (!user) {
  // user === null
}
```

Always check before accessing:

```c
user.comparePassword ❌ // crash
```

### Mental Model

```c
Schema:
password → hidden by default

Query:
.findOne() → fetch user
.select("+password") → explicitly include password
```

# 4. Code Explanation

```c
trim: true

index: true
```

```c
blogPostSchema.index({ authorId: 1, createdAt: -1 });
blogPostSchema.index({ title: "text", description: "text", content: "text" });
```

## Exaplanation

### 1️⃣ trim: true in schema

Example

```c
title: {
  type: String,
  trim: true
}
```

**What it does**

👉 Automatically removes leading and trailing whitespace from strings before saving.

Example

```
new Post({ title: "   Hello World   " })
```

Saved as:

```c
{
  "title": "Hello World"
}
```

**What it does NOT do**

- ❌ Does NOT remove spaces in the middle
  `"Hello World"` stays the same

- ❌ Does NOT affect updates done via raw MongoDB (updateOne without validators)

**Why it matters**

✔ Prevents messy data
✔ Avoids duplicate values caused by spaces
✔ Improves search & indexing consistency

### 2️⃣ index: true in schema

Example

```c
email: {
  type: String,
  unique: true,
  index: true
}
```

**What it does**

👉 Tells Mongoose to create a MongoDB index on this field.

Equivalent MongoDB command:

```c
db.users.createIndex({ email: 1 })
```

**Why indexes matter**

Without index:

```c
MongoDB scans every document (COLLSCAN)
```

With index:

```c
MongoDB jumps directly to matching values (IXSCAN)
```

- ✔ Faster queries
- ✔ Essential for login, filtering, sorting

### 3️⃣ Important note about index: true

- Mongoose creates indexes on app startup

- In production:

  - Use autoIndex: false

  - Create indexes manually (migration)

```c
mongoose.connect(uri, {
  autoIndex: false
});
```

### 4️⃣ Compound index explained

```c
blogPostSchema.index({ authorId: 1, createdAt: -1 });
```

**What is this?**

👉 A compound index (multiple fields in one index)

Meaning

- `authorId: 1` → ascending

- `createdAt: -1` → descending (newest first)

### How MongoDB uses this index

**Optimized query**

```c
Post.find({ authorId })
    .sort({ createdAt: -1 });
```

- ✔ Uses index
- ✔ No in-memory sort
- ✔ Very fast

### Index order matters (VERY IMPORTANT)

This index works for:

```c
{ authorId }
{ authorId, createdAt }
```

But ❌ not optimal for:

```c
{ createdAt }
```

Because **left-most prefix rule**.

### 5️⃣ Text index explained

```c
blogPostSchema.index({
  title: "text",
  description: "text",
  content: "text"
});
```

**What this creates**

👉 A MongoDB text index for full-text search.

**What it enables**

```c
Post.find({
  $text: { $search: "blockchain security" }
});
```

**MongoDB** searches:

- title

- description

- content

### How text search works internally

- Tokenizes words

- Removes stop words (`the`, `is`, `and`)

- Stems words `(running → run)`

- Scores relevance

**Sorting by relevance**

```c
Post.find(
  { $text: { $search: "security" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } });
```

### 6️⃣ Limitations of text indexes ⚠️

🚨 MongoDB allows **only ONE text index per collection.**

So this is invalid:

```c
schema.index({ title: "text" });
schema.index({ content: "text" }); // ❌
```

Must be combined.

### 7️⃣ When to use which index

| Use case       | Index                            |
| -------------- | -------------------------------- |
| Login by email | `{ email: 1 }`                   |
| Author’s posts | `{ authorId: 1, createdAt: -1 }` |
| Search bar     | Text index                       |
| Pagination     | Compound index                   |
| Sorting        | Index matching sort              |

### 8️⃣ Common mistakes 🚨

❌ Index on low-cardinality field (isPublished)
❌ Too many indexes (slow writes)
❌ Wrong index order
❌ Using regex instead of text index

### 9️⃣ Production-grade blog indexing strategy

```c
blogPostSchema.index({ authorId: 1, createdAt: -1 });
blogPostSchema.index({ slug: 1 }, { unique: true });
blogPostSchema.index({
  title: "text",
  description: "text",
  content: "text"
});
```

### 🔟 Summary (TL;DR)

**`trim: true`**

✔ Cleans string input automatically

**`index: true`**

✔ Creates DB index for faster queries

**Compound index**

✔ Optimizes filtered + sorted queries

**Text index**

✔ Enables full-text search

# 5. Explain Code

```c
BlogPost.find(
  { $text: { $search: "microservices" } },
  { score: { $meta: "textScore" } }
)
.sort({ score: { $meta: "textScore" } })
.limit(10);

```

## Explanation

This means:

“Search blog posts for the word microservices, rank them by relevance, and return the top 10 most relevant posts.”

### 2️⃣ $text + $search

```c
{ $text: { $search: "microservices" } }
```

**What this does**

👉 Uses MongoDB’s text index to perform full-text search.

MongoDB searches across all fields included in the text index, for example:

```c
blogPostSchema.index({
  title: "text",
  description: "text",
  content: "text"
});
```

So MongoDB searches:

- title

- description

- content

**How matching works internally**

MongoDB:

- Tokenizes text

- Removes stop words (`the`, `is`, `and`)

- Stems words (`services → service`)

- Matches `"microservices" intelligently`

✔ Much better than regex
✔ Uses index (fast)

### 3️⃣ Second argument: Projection with textScore

```c
{ score: { $meta: "textScore" } }
```

**What is this?**

👉 Adds a **computed field** called score to each document.

That score represents:

- How relevant this document is to the search term

Example result:

```c
{
  "_id": "...",
  "title": "Microservices Architecture",
  "score": 4.72
}
```

⚠️ This field:

- Is not stored in DB

Exists only in query result

### 4️⃣ Why `$meta: "textScore"` is needed

MongoDB does NOT automatically return relevance scores.

You must explicitly ask for it using:

```c
{ $meta: "textScore" }
```

Otherwise:

- You cannot sort by relevance

- You don’t know why one result is higher than another

### 5️⃣ Sorting by relevance

```c
.sort({ score: { $meta: "textScore" } })
```

**What this does**

👉 Sorts results by `relevance score (descending)`

Highest score = best match → appears first.

This is what makes search results feel “Google-like”.

### 6️⃣ .limit(10)

```c
.limit(10)
```

**What it does**

👉 Returns only the top 10 most relevant documents

✔ Faster
✔ Ideal for search results
✔ Prevents huge payloads

### 7️⃣ End-to-end execution flow

```c
1. Use text index
2. Find documents containing "microservices"
3. Compute relevance score for each match
4. Attach score to result
5. Sort by score DESC
6. Return first 10 docs
```

### 8️⃣ Example returned documents

```c
[
  {
    "_id": "1",
    "title": "Microservices Best Practices",
    "score": 5.21
  },
  {
    "_id": "2",
    "title": "Scaling Microservices with Kubernetes",
    "score": 4.87
  }
]
```

### 9️⃣ Important rules & constraints ⚠️

🚨 **Requires a text index**

If no text index exists:

```c
Error: text index required for $text query
```

🚨 **Only one text index per collection**

All searchable fields must be combined.

### 🔟 Common variations

**Multiple keywords**

```c
$search: "microservices docker kubernetes"
```

**Phrase search**

```c
$search: "\"microservices architecture\""
```

**Exclude words**

```c
$search: "microservices -monolith"
```

### 1️⃣1️⃣ When NOT to use text search

❌ Partial matching (micro vs microservices)
❌ Typo tolerance
❌ Advanced ranking logic

For those → use **ElasticSearch** / **OpenSearch** / **Meilisearch**

### 🧠 Mental model

```c
$text        → find matches
textScore    → rank relevance
sort + limit → return best results
```

### ✅ Summary

✔ $text uses MongoDB text index
✔ $meta: "textScore" computes relevance
✔ Sorting by score gives ranked results
✔ .limit(10) returns top matches

### How Relevance Score Is calculated

The relevance score in MongoDB text search is super interesting—it determines why some documents appear higher than others. Let’s break it down carefully.

### 1️⃣ Where the score comes from

When you do:

```c
BlogPost.find(
  { $text: { $search: "microservices" } },
  { score: { $meta: "textScore" } }
)
.sort({ score: { $meta: "textScore" } });
```

MongoDB internally computes a score for each document based on text search algorithm.

- It’s not random

- It depends on term frequency, field weights, and collection statistics

### 2️⃣ Factors affecting the score

MongoDB uses a variant of TF-IDF (Term Frequency–Inverse Document Frequency) to rank documents.

**(a) Term Frequency (TF)**

- How many times the search term appears in the document

- More occurrences → higher score

Example:

```c
Document 1: "Microservices is the core of microservices architecture." → TF high
Document 2: "Microservices are popular." → TF lower
```

Document 1 gets a higher score.

**(b) Inverse Document Frequency (IDF)**

- Terms that appear in fewer documents overall are more important

- Rare words boost the score

Example:

```c
Collection: 1000 documents
- "microservices" in 500 docs → common → lower weight
- "kubernetes" in 10 docs → rare → higher weight
```

Score formula (simplified):

```c
score ∝ TF * IDF
```

**(c) Field Weights**

If you define weights on fields in the text index:

```c
blogPostSchema.index(
  { title: "text", description: "text", content: "text" },
  { weights: { title: 5, description: 2, content: 1 } }
);
```

- Terms in title count 5× more than terms in content

- Documents with keyword in title rank higher

**(d) Language & Stemming**

- MongoDB supports language-specific text search:

- Stems words: running → run, microservices → microservice

Ignores stop words: the, is, and

This affects scoring too.

### 3️⃣ How the score is actually used

- MongoDB calculates a floating-point score for each matching document.

- `$meta: "textScore"` attaches this score to the document.

- `.sort({ score: { $meta: "textScore" } })` orders documents from most relevant to least.

Example:
| Document | Score |
| ---------------------------------- | ----- |
| Doc 1: Keyword in title + repeated | 7.2 |
| Doc 2: Keyword in content once | 3.8 |
| Doc 3: Keyword in description | 2.1 |

### 4️⃣ Important notes about the score

- Score is relative: only meaningful compared to other results in the same query

- Score is not normalized (not between 0-1)

- Cannot be used alone as absolute “importance”

### 5️⃣ How to tweak scores

**(a) Field weights**

```c
blogPostSchema.index(
  { title: "text", content: "text" },
  { weights: { title: 10, content: 1 } }
);
```

**(b) Filter + text search**

```c
BlogPost.find({
  $text: { $search: "microservices" },
  authorId: "123"
}, { score: { $meta: "textScore" } })
.sort({ score: { $meta: "textScore" } });
```

- Only author’s posts

- Still ranked by text relevance

**(c) Boost rare terms with query design**

- Use multiple words

- Combine $search with filters

### 6️⃣ TL;DR (Mental Model)

```c
Relevance score = (term frequency in doc) * (rarity of term in collection) * (field weight)
Higher score → more important → appears first
```

# 6. Explanation

```c
await BlogPost.findByIdAndUpdate(postId, {
  $push: {
    comments: {
      readerId: req.user.userId,
      readerName: req.user.name,
      text,
    },
  },
});
```

### 2️⃣ BlogPost.findByIdAndUpdate(postId, ...)

**What it does**

👉 Finds a blog post by its \_id and updates it in one operation.

Equivalent MongoDB command:

```c
db.blogposts.updateOne(
  { _id: ObjectId(postId) },
  { ... }
);
```

Why use this

- ✔ No need to fetch document first
- ✔ Single DB round trip
- ✔ Atomic (safe under concurrency)

### 3️⃣ $push operator

```
$push: {
  comments: { ... }
}
```

**What `$push` does**

👉 Adds a new element to an array field.

Example existing document:

```c
{
  "_id": "...",
  "comments": [
    { "text": "Nice post!" }
  ]
}
```

After $push:

```c
{
  "comments": [
    { "text": "Nice post!" },
    { "text": "Great explanation" }
  ]
}
```

- ✔ Does NOT overwrite the array
- ✔ Appends to the end

### 6️⃣ Why not post.comments.push() + save()?

❌ **Bad approach**

```c
const post = await BlogPost.findById(postId);
post.comments.push(comment);
await post.save();
```

Problems:

- Two DB operations

- Race conditions under load

- Higher latency

✅ **`$push` approach**

- ✔ Single atomic update
- ✔ Scales well
- ✔ Safe for concurrent comments

### 7️⃣ What this does NOT do (important)

❌ **No validation by default**

- pre("save") hooks do NOT run

- Custom validators do NOT run

To enable validators:

```c
await BlogPost.findByIdAndUpdate(
  postId,
  { $push: { comments: {...} } },
  { runValidators: true }
);
```

### 8️⃣ What does this return?

By default:

```c
findByIdAndUpdate() → returns OLD document
```

To return updated document:

```c
await BlogPost.findByIdAndUpdate(
  postId,
  update,
  { new: true }
);
```

### 9️⃣ Common enhancements

**Add timestamp automatically**

Schema:

```c
comments: [{
  readerId: ObjectId,
  readerName: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
}]
```

**Limit number of comments (prevent abuse)**

```
$push: {
  comments: {
    $each: [comment],
    $slice: -100
  }
}
```

### 🔟 Security & scaling considerations

⚠️ Unbounded array growth = document size limit (16MB)
⚠️ For high-traffic systems:

- Move comments to separate collection

- Reference postId

### 🧠 Mental model

```
findByIdAndUpdate
   ↓
$push
   ↓
append comment atomically
```

### ✅ Summary

- ✔ findByIdAndUpdate → atomic update
- ✔ $push → append to array
- ✔ Uses authenticated user info
- ✔ Scales better than fetch + save

### 7. explanation

### Optional chaining: `authHeader?`

```c
authHeader?.startsWith("Bearer ")
```

**Why `?.` is used**

Optional chaining prevents runtime errors.

Without it:

```c
authHeader.startsWith("Bearer "); // ❌ crash if authHeader is undefined
```

With it:

```c
authHeader?.startsWith("Bearer "); // undefined instead of error
```

Safe + clean.

### `startsWith("Bearer ")`

```c
.startsWith("Bearer ")
```

**What it enforces**

The header must follow the Bearer token standard:

```c
Authorization: Bearer <token>
```

**Why the space matters:**

```c
"Bearer " ≠ "Bearer"
```

Token comes after the space

### The full condition

```c
if (!authHeader?.startsWith("Bearer ")) {
```

This condition is `true` when:

- Header is missing

- Header exists but is malformed

- Header is something else (e.g., `Basic abc123`)

# 8 Explanation

### 2️⃣ The update lines (core logic)

```c
post.title = title ?? post.title;
post.description = description ?? post.description;
post.content = content ?? post.content;
```

Each line follows the same pattern:

```c
newValue ?? oldValue
```

### 3️⃣ What does `??` (nullish coalescing) mean?

```c
a ?? b
```

👉 Use `a` only if it is NOT `null` or `undefined`
👉 Otherwise, fall back to `b`

**Values that trigger fallback:**

- `null`

- `undefined`

**Values that DO NOT trigger fallback:**

- `"" (empty string)`

- `0`

- `false`

This is why `??` is preferred over `||` for updates.

### 4️⃣ Example scenarios

**Case 1: Client sends only title**

```c
title = "New Title"
description = undefined
content = undefined
```

Result:

```c
post.title = "New Title"
post.description = old description
post.content = old content
```

✔ Only title updated

**Case 2: Client sends empty string intentionally**

```c
description = ""
```

With **??:**

```c
post.description = ""
```

✔ Allowed

With || (WRONG):

```c
post.description = post.description // empty string ignored
```

❌ Bug

**Case 3: Client sends nothing**

All values undefined

Result:

```c
post remains unchanged
```

### 5️⃣ Why this pattern is used

- ✔ Supports PATCH-style updates
- ✔ Prevents accidental data loss
- ✔ Simple & readable
- ✔ Safe for optional fields

This mimics HTTP `PATCH` semantics (partial update), not `PUT` (full replace).

# 9. Explanation

## 🟢 likePost explained

### 2️⃣ Atomic update with condition

```c
const post = await BlogPost.findOneAndUpdate(
  { _id: postId, likedBy: { $ne: userId } },
```

**This filter is CRITICAL**

It means:

```c
Find the post
WHERE:
- _id matches postId
- likedBy does NOT already contain userId
```

If the user already liked the post → **no match** → update doesn’t happen.

This is how you prevent double likes.

### 3️⃣ Update operations

```c
{
  $addToSet: { likedBy: userId },
  $inc: { likes: 1 },
}
```

```c
$addToSet
```

👉 Adds `userId` to `likedBy` array only if it’s not already there.

Similar to a `Set`:

```c
No duplicates allowed
```

`$inc`

👉 Atomically increments `likes` count by `1`.

- ✔ Safe under concurrency
- ✔ No race conditions

### 4️⃣ { new: true }

```c
{ new: true }
```

Returns the updated document, not the old one.

## unlikePost explained

### 1️⃣ Extract inputs

```c
const { postId } = req.params;
const userId = req.user.userId;
```

Same as before.

### 2️⃣ Conditional update

```c
const post = await BlogPost.findOneAndUpdate(
  { _id: postId, likedBy: userId },
```

This ensures:

```
Only update if user HAS liked the post
```

If user never liked → no match → no update.

### 3️⃣ Update logic

```c
{
  $pull: { likedBy: userId },
  $inc: { likes: -1 },
}
```

`$pull`

👉 Removes userId from likedBy array.

`$inc: -1`

👉 Decrements like count safely.

### 🧠 Why this design is EXCELLENT

✅ **Atomic & race-safe**

- No `find → modify → save`

- Single DB operation

✅ **Prevents duplicate likes**

- Filter + $addToSet

✅ **Prevents negative likes**

- Filter ensures correctness

✅ **Scales under high traffic**

- Works even with 1000 concurrent likes

### 🚨 What this avoids (VERY IMPORTANT)

❌ **Bad approach**

```c
post.likes++;
post.likedBy.push(userId);
await post.save();
```

Problems:

- Race conditions

- Duplicate likes

- Inconsistent counts

### 📦 Required schema structure

```c
likes: {
  type: Number,
  default: 0
},
likedBy: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
}]
```

### 🔒 Security note

Never trust:

```c
req.body.userId
```

Always use:

```c
req.user.userId
```

### 🧪 Edge cases handled

| Scenario              | Result     |
| --------------------- | ---------- |
| Like twice            | ❌ Blocked |
| Unlike without liking | ❌ Blocked |
| Concurrent likes      | ✔ Safe     |
| Concurrent unlikes    | ✔ Safe     |

### ✅ Summary

- ✔ findOneAndUpdate → atomic
- ✔ $ne / $addToSet → no duplicates
- ✔ $pull → clean removal
- ✔ $inc → consistent counts

# 10. Explanation

This function implements paginated fetching of comments from a blog post using MongoDB’s $slice projection.
Let’s break it down line by line, then explain why this approach is used, how $slice works, and its trade-offs.

### 1️⃣ Function signature

```c
export const getComments = async (req, res) => {
```

Controller for fetching comments of a single blog post.

### 2️⃣ Extracting postId

```c
const { postId } = req.params;
```

postId comes from the URL
Example:

```c
GET /posts/123/comments
```

### 3️⃣ Pagination parameters

```c
const page = Number(req.query.page) || 1;
const limit = Number(req.query.limit) || 10;
```

**What this does**

- Reads query parameters:

```c
/comments?page=2&limit=10
```

- Converts them to numbers

Applies defaults:

```
page → 1

limit → 10
```

**Why Number(...)**

Query params are strings by default:

```
req.query.page === "2"
```

### 4️⃣ The database query (important part)

```c
const post = await BlogPost.findById(postId, {
  comments: { $slice: [(page - 1) * limit, limit] },
});
```

This uses projection with `$slice`.

### 5️⃣ What $slice does

```c
comments: { $slice: [skip, limit] }
```

👉 Returns only a portion of the comments array, not the whole thing.

Here:

```c
skip = (page - 1) * limit
limit = limit
```

### 6️⃣ Example: how pagination works

Assume:

```
page = 2
limit = 3
```

Then:

```c
$slice: [3, 3]
```

MongoDB returns:

```c
comments[3], comments[4], comments[5]
```

So:

```
Page 1 → comments 0–2

Page 2 → comments 3–5

Page 3 → comments 6–8
```

### 7️⃣ Why use $slice instead of fetching all comments?

❌ **Bad approach**

```c
const post = await BlogPost.findById(postId);
return post.comments.slice(...);
```

**Problems:**

- Fetches entire comments array

- Slow for large posts

- High memory usage

### ✅ $slice approach

- ✔ MongoDB returns only what you need
- ✔ Less network payload
- ✔ Better performance

### 8️⃣ What does the query return?

```c
post = {
  _id: "...",
  comments: [
    { text: "Nice post" },
    { text: "Great explanation" }
  ]
}
```

⚠️ Only \_id and sliced comments are returned (other fields excluded).

### 9️⃣ Missing but recommended checks

Handle post not found

```c
if (!post) {
  return res.status(404).json({ message: "Post not found" });
}
```

### 🔟 Limitations of this design ⚠️

🚨 **Embedded array growth**

- MongoDB document size limit = 16MB

- Too many comments → document bloats

🚨 **Pagination inefficiency at high pages**

- `$slice` still scans array internally

- Deep pagination becomes slower

### 🧠 Mental model

```c
Find post
↓
Return only requested slice of comments array
↓
Avoid loading entire document
```

### ✅ Summary

- ✔ Uses $slice for efficient pagination
- ✔ Avoids loading all comments
- ✔ Query params control pagination
- ✔ Best for small-to-medium comment volume

# 🚀 Why the embedded-comments approach breaks at scale

### Embedded (current approach)

```c
BlogPost {
  _id,
  title,
  comments: [ { ... }, { ... }, ... ]
}
```

### Problems at scale

- **16MB document limit**

  - Thousands of comments → post becomes unsavable

- **Write amplification**

  - Every comment rewrites the entire post document

- **Hot document problem**

  - Viral posts → constant writes → lock contention

- **Slow pagination**

  - $slice still scans the array

- **Hard moderation**

  - Deleting/editing one comment rewrites the whole post

👉 **This design does not scale beyond small apps.**

### ✅ Better design: Separate comments collection

```c
Comment {
  _id,
  postId,
  userId,
  text,
  createdAt
}
```

**Why this works**

✔ Unlimited comments
✔ Each comment is an independent document
✔ Writes are cheap and parallel
✔ Easy pagination, moderation, analytics

### 📦 Comment Schema (Mongoose)

```c
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogPost",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
```

### 🧱 Indexes (VERY IMPORTANT)

```c
commentSchema.index({ postId: 1, createdAt: -1 });
```

This index supports:

```c
find({ postId }).sort({ createdAt: -1 })
```

✔ Fast pagination
✔ No in-memory sorting

### ➕ Create a comment

```c
export const addComment = async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;
  const userId = req.user.userId;

  const comment = await Comment.create({
    postId,
    userId,
    text,
  });

  res.status(201).json(comment);
};
```

### 📄 Paginate comments (OFFSET pagination)

```c
export const getComments = async (req, res) => {
  const { postId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const comments = await Comment.find({ postId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("userId", "name");

  res.json({
    page,
    limit,
    count: comments.length,
    comments,
  });
};
```

### ⚠️ Why OFFSET pagination still breaks

For:

```c
page = 10000
```

MongoDB must:

- Scan and skip 99,990 documents

👉 This becomes slow at scale.

### 🏆 PRODUCTION-GRADE: Cursor-based pagination

**Client sends:**

```c
GET /comments?cursor=2025-01-10T10:12:30.000Z
```

**Backend (cursor pagination)**

```c
export const getComments = async (req, res) => {
  const { postId } = req.params;
  const { cursor } = req.query;
  const limit = Number(req.query.limit) || 10;

  const query = { postId };

  if (cursor) {
    query.createdAt = { $lt: new Date(cursor) };
  }

  const comments = await Comment.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("userId", "name");

  const nextCursor =
    comments.length > 0
      ? comments[comments.length - 1].createdAt
      : null;

  res.json({
    comments,
    nextCursor,
  });
};
```

**Why cursor pagination is superior**

✔ Constant performance
✔ No skipping
✔ Stable ordering
✔ Scales to millions of comments

### 🧠 Mental model

```
Embedded → array slicing → OK for small apps
Separate collection → indexed queries → scalable
Cursor pagination → production-grade
```

### 🔒 Security & moderation wins

With separate collection:

- Delete a comment instantly

- Ban user → delete comments by userId

- Audit logs

- Rate limit per user

### 🏁 When to choose which design

| App size             | Design                       |
| -------------------- | ---------------------------- |
| MVP / small app      | Embedded comments            |
| Medium traffic       | Separate collection          |
| High traffic / viral | Separate + cursor pagination |

### ✅ Summary

✔ Separate `comments` collection scales
✔ Indexed queries are fast
✔ Cursor pagination is production-grade
✔ Avoids document size & hot-spot issues
