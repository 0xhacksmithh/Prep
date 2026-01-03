# 1. What is Node.js?

It is an open-source, cross-platform JavaScript runtime environment built on Chrome’s V8 engine.
It allows developers to run JavaScript on the server-side, outside of a web browser.

## cross-platform JavaScript runtime environment

A cross-platform JavaScript runtime environment is a software layer that allows you to run JavaScript code on different operating systems (like Windows, macOS, and Linux) outside of a web browser.

In the past, JavaScript was confined to browsers like Chrome or Firefox. A runtime environment takes the engine from the browser and gives it the tools to interact directly with a computer’s hardware, such as the file system, network, and memory.

### How It Works

The runtime acts as a bridge between your code and the operating system. It usually consists of three main components:

- **The Engine:** This parses and executes the code (e.g., Google’s V8 engine).
- **The APIs:** These are built-in libraries that allow JavaScript to do things it normally can't do in a browser, like opening a file or creating a web server.
- **The Event Loop:** A mechanism that manages how tasks are handled, allowing the runtime to perform many operations at once without getting "stuck."

### Popular Examples

Depending on what you are building, you might use different runtimes:

- Node.js: The industry standard. It’s used primarily for building scalable backend servers and command-line tools.
- Deno: Created by the original inventor of Node.js to address security and modern development needs (like built-in TypeScript support).
- Bun: A newer, high-performance runtime designed for speed, acting as an all-in-one tool (runtime, bundler, and package manager).
- Electron: A runtime used specifically for building desktop applications (like Discord, Slack, or VS Code) using web technologies

# 2. Why is Node.js single-threaded?

It was designed for high concurrency in I/O-bound applications. A single-threaded model using an Event Loop avoids the memory overhead and complexity of context-switching between thousands of threads.

## Explanation

This description refers to the core architecture of runtimes like Node.js. To understand why this is clever, we have to look at how traditional servers work versus how JavaScript runtimes handle tasks.

### A. The Traditional Way: Multi-Threaded

Imagine a restaurant where one waiter is assigned to exactly one table.

- If the table is looking at the menu (an I/O-bound task like waiting for a database), the waiter just stands there.
- If 1,000 tables arrive, you need 1,000 waiters.
- **The Problem:** Waiters (threads) take up a lot of space in the building (memory). Moving between them (context-switching) creates chaos and slows everything down.

### B. The JavaScript Way: Single-Threaded Event Loop

Now, imagine a restaurant with one very fast waiter and a kitchen staff.

- The waiter takes an order from Table A and gives it to the kitchen (the I/O task).
- Instead of waiting, the waiter immediately moves to Table B to take their order.
- When the kitchen is done with Table A's food, they ring a bell.
- The waiter hears the bell (the Event) and delivers the food.

### Breaking Down the Concepts

**I/O-Bound Applications**
These are apps that spend most of their time waiting for something else to happen, such as:

- Reading a file from a hard drive.
- Requesting data from a database.
- Waiting for an API response from another website. The **CPU isn't actually "working"** during this time; it's just waiting for the data to arrive.

**High Concurrency (The "Many Users" Problem)**
Because the "waiter" (the single thread) never stops to wait for the kitchen, one single thread can handle thousands of concurrent connections. It just keeps "taking orders" and "delivering results" as they become ready.

### Avoiding Context-Switching

In multi-threaded systems, the computer has to constantly swap which thread it is working on. This is called **context-switching**.

- **The Overhead:** Each switch requires the CPU to save exactly where it was and load the state of the next thread.
- **The Benefit:** A single-threaded model never switches "contexts." It just stays on one task until that task is handed off or finished, making it extremely memory-efficient.

### A Code Example

In a "Blocking" (Multi-threaded) environment, the code stops at line 1. In a "Non-blocking" (Event Loop) environment, it behaves like this:

```
// 1. Start a database request (I/O task)
database.query("SELECT * FROM users", (data) => {
    // 3. This runs much later when the data comes back
    console.log("Data received!");
});

// 2. This runs IMMEDIATELY after the request starts
console.log("I am doing other work while waiting!");
```

**Result:** The system doesn't "freeze" while waiting for the database. It keeps moving, allowing other users to interact with the app.

# 3. What is the role of the V8 engine?

Developed by Google, V8 compiles JavaScript directly into native machine code instead of interpreting it in real-time. This is why Node.js is exceptionally fast.

## Explanation

To understand this, we first need to distinguish between two ways a computer can "understand" a language: Interpreting and Compiling.

### 1. The Traditional Interpreter (The "Slow" Way)

In a purely interpreted system, the engine reads your code line by line and executes it immediately.

- **Analogy:** Imagine a chef who has a recipe in a foreign language. Instead of translating the whole page, they look at one word, look up its meaning, perform that step, and then look at the next word.

- **The Problem:** If you have a loop that runs 1,000 times, the engine has to "re-translate" the same code 1,000 times. This makes the execution very slow.

### 2. V8’s Approach: Just-In-Time (JIT) Compilation

V8 doesn't just read and run; it transforms the code into something the computer hardware can run directly. This is called **Just-In-Time (JIT)** compilation.

Here is the step-by-step process V8 follows:

- **Parsing:** It takes your JavaScript code and turns it into an Abstract Syntax Tree (AST)—a map of how your code is structured.

- **Ignition (The Interpreter):** V8 first converts that AST into Bytecode. This is a fast, low-level version of your code that starts running almost instantly.

- **TurboFan (The Optimizing Compiler):** While the code is running, V8 watches for "Hot Functions"—pieces of code you run over and over again. It sends these "hot" parts to TurboFan, which converts them into Native Machine Code (binary code that your CPU understands natively).

- **Direct Execution:** Once code is turned into machine code, the CPU runs it directly at full hardware speed, completely bypassing the engine's interpretation overhead.

# 4. What is the Event Loop?

The Event Loop is what allows Node.js to perform non-blocking I/O operations. It offloads tasks (like file reading) to the system kernel whenever possible.

## A. What is the "System Kernel"?

- The Kernel is the core of your Operating System (Windows, Linux, macOS).
- It has direct access to the hardware.
- Most modern Kernels are multi-threaded, meaning they can handle many tasks in the background simultaneously.

## B. The "Offloading" Process

When you tell Node.js to read a file or make a network request, it doesn't do the "waiting" itself.
Here is the play-by-play:

- **The Request:** Your code says, "Hey Node, read this 5GB file."

- **The Offload:** Node.js doesn't sit there reading the file line-by-line. Instead, it tells the System Kernel: "Here is a file request. Let me know when you're done."

- **Non-Blocking:** Immediately after telling the Kernel, the Node.js thread moves to the next line of your code. It is not blocked.

- **The Notification:** The Kernel works in the background. When the file is ready, it "pings" Node.js.

- **The Callback:** The Event Loop sees this ping and places the file data into the Callback Queue to be processed by your code.

### C. Why the "Kernel" is the Secret Weapon

Not all tasks are handled the same way. The Event Loop uses two different strategies to offload work:

- **For Network Tasks:** Most modern Kernels provide high-efficiency interfaces (like epoll on Linux or IOCP on Windows). Node.js uses these to handle thousands of network connections at once without using much memory.

- **For File/Heavy Tasks:** If the Kernel doesn't have a specific way to handle a task asynchronously, Node.js uses a "Worker Pool" (a small group of background threads) to do the heavy lifting, so the main Event Loop stays free.

## D. Comparison: Blocking vs. Non-Blocking

### Blocking (Standard Programming)

```
const data = fs.readFileSync('/file.md'); // The thread STOPS here
console.log(data);                        // This waits for the file
console.log("I'm blocked!");              // This also waits
```

### Non-Blocking (Node.js with Event Loop)

```
fs.readFile('/file.md', (err, data) => {
    console.log(data);                    // Runs 3rd (when file is ready)
});

console.log("I'm NOT blocked!");          // Runs 1st
someOtherFunction();                      // Runs 2nd
```

### Summary: The "Manager" Analogy

Think of the Event Loop as a project manager at a construction site.

- If a delivery of bricks is needed, the manager doesn't drive the truck themselves.

- They offload that task to the driver (the Kernel).

- While the driver is on the road, the manager stays at the site to answer questions and keep the workers busy.

- The manager only deals with the bricks once the driver arrives and rings the bell.

# 5. What is NPM?

NPM (Node Package Manager) is the default package manager for Node.js. it hosts thousands of free reusable packages and manages project dependencies.

## Explanation

A Package Manager is a tool that automates the process of installing, updating, configuring, and removing software libraries (or "packages") for your project.

In modern development, we rarely write every single line of code from scratch. Instead, we use "packages"—pre-written blocks of code created by others (like a date-formatting library or a database connector). The package manager ensures these pieces fit together perfectly.

### Why do you need one? (The "Dependency" Problem)

Imagine you want to use Library A. However, Library A only works if Library B is also installed, and Library B requires a specific version of Library C.

This chain is called a **Dependency**. Trying to manage this manually is nearly impossible because:

- You might download the wrong version.

- You might forget to update one part of the chain.

- The code might work on your computer but break on your teammate's.

A package manager solves this by reading a **Manifest File** (a list of everything your project needs) and handling the "heavy lifting" of fetching the right files.

### How it Works:

The 3 Main Parts

- **The Registry:** A giant online "warehouse" where developers upload their code (e.g., npmjs.com for JavaScript).

- **The Manifest File:** A file in your project (like package.json or requirements.txt) that lists the names and versions of the packages you are using.

- **The CLI (Command Line Interface):** The tool you type commands into to manage things (e.g., npm install).

### A Real-World Scenario

If you are starting a new JavaScript project and want to use a tool like Vite, you don't go to a website to download a .zip file. You just type:

```
npm install vite
```

**What the package manager does behind the scenes:**

- Looks up "Vite" in the online registry.

- Checks what other libraries Vite needs to run.

- Downloads everything into a folder in your project (node_modules).

- Creates a Lock File (package-lock.json) which records the exact versions downloaded so that if your friend runs the same command, they get the exact same files.

# 6. Explain package.json vs package-lock.json.

- **package.json:** Contains metadata and defined version ranges for dependencies (e.g., ^1.2.0).

- **package-lock.json:** Records the exact version of every installed package to ensure the same environment across different machines.

## Explanation for Metadata & Version ranges

In the context of a package manager, these two concepts are the "instruction manual" that ensures your project stays stable and predictable

### 1. Metadata: The "Identity Card"

Metadata is the descriptive data about your project and its dependencies. Instead of being the actual code (logic), it is the information that helps the package manager organize, find, and verify that code.
In a file like package.json, metadata includes:

- **Name and Version:** The identity of your project.
- **Author/License:** Who made it and how it's allowed to be used.
- **Scripts:** Shortcuts for tasks (like npm start).
- **The Dependency List:** A catalog of every external library the project needs.

### 2. Defined Version Ranges: The "Safety Rules"

When you add a dependency (like a library called express), you don't always want to lock it to one specific version forever. You might want to allow bug fixes but prevent major changes that could break your app.
To do this, package managers use **Semantic Versioning (SemVer)**, which follows the format: **Major . Minor . Patch (e.g., 1.4.2)**.
You use special symbols to define a range:

### Why "Ranges" are Essential

Imagine your project uses 50 different libraries.

- If you used **Exact Versions**, you would have to manually update every single one every time a security patch came out.
- If you used **No Ranges (Wildcards)**, your app might work today, but tomorrow a library could release a "Major" update that changes how it works, causing your app to crash instantly.
  **Version Ranges** allow the package manager to automatically download the "safest" newest version of a library without you having to lift a finger.

### The "Lock" File: The Final Piece

Because ranges (like ^1.4.2) are flexible, two developers running npm install on different days might get slightly different versions. To prevent this, the package manager creates a Lock File (like package-lock.json).

- **The Metadata/Range** (in package.json) says: "I need something like version 1.4.2."
- **The Lock File says:** "On this specific computer, we are using exactly version 1.4.7 with this specific security hash."

# 7. What are the different types of modules in Node?

- **Core Modules:** Built-in (e.g., fs, http, path).

- **Local Modules:** Created by the developer.

- **Third-Party Modules:** Installed via NPM (e.g., express).

In Node.js, a Module is a discrete, reusable block of code. Think of it as a "Lego brick" for your application. Instead of writing one massive file with 10,000 lines of code, you break your logic into small, manageable files (modules) that you can export and import where needed.

In Node.js, every file is treated as its **own module**.

# 8. What is the difference between require() and import?

- **require():** CommonJS (CJS) syntax, synchronous, used by default in Node.js.

- **import:** ES Module (ESM) syntax, asynchronous, part of the ES6 standard.

## Explanation

### A. require() — The CommonJS (CJS) Way

Before JavaScript had an official way to link files, Node.js created CommonJS.

- **Synchronous:** When you call require(), the execution of your code stops until the file is loaded and parsed.

- **Default:** Since Node.js was built on this, it is the legacy default.

- **Dynamic:** You can put require() inside an if statement or a function.

### 2. import — The ES Module (ESM) Way

This is the official ECMAScript standard (ES6) designed to work in both browsers and servers.

- **Asynchronous:** It allows the engine to "scan" the file for dependencies before running any code. This makes it more efficient for large web apps.

- **Static:** You typically cannot put import inside an if statement at the top of a file. It must be at the very top (though "Dynamic Imports" exist for specific cases).

- **Standard:** This is the future of JavaScript. Browsers understand import natively, but they do not understand require().

### Why does "Synchronous vs. Asynchronous" matter?

- **In CommonJS (require):** If you require 100 files, Node.js loads them one after another. On a server with a fast hard drive, this is usually fine.

- **In ESM (import):** On the web, files are downloaded over the internet. If you loaded 100 files synchronously, the browser would "freeze" until the last file arrived. import allows the browser to see the full "tree" of files it needs and start downloading them all at once.

### Why "Used by Default"?

Historically, if you create a file ending in .js, Node.js assumes it is CommonJS. To use import, you usually have to:

- Change the file extension to .mjs.

- OR add "type": "module" to your package.json.

# 9. What is REPL?

Stands for **Read-Eval-Print-Loop**. It is an interactive shell (type node in your terminal) used to test simple JS code snippets.

## Explanation

A REPL is essentially a "conversation" with your programming language. Instead of writing a whole script, saving it, and running it, you get immediate feedback for every line you type.

Here is the breakdown of the four steps that happen every time you press Enter:

- **Read:** The environment reads the input you just typed.

- **Eval:** It "evaluates" (processes) the code to see what it does.

- **Print:** It shows the result of that evaluation on your screen.

- **Loop:** It goes back to the start and waits for your next command.

### How to use it

If you have Node.js installed, you can try this right now:

- Open your Terminal or Command Prompt.

- Type node and hit Enter.

- You will see a > prompt. Type 2 + 2 and hit Enter. It will immediately print 4.

### Why is REPL useful?

- **A. Instant Prototyping**
  If you forget how a specific JavaScript function works (like Array.slice() vs Array.splice()), you don't need to create a new file. You can test it in the REPL in 5 seconds.

- **B. Debugging Logic**
  You can copy-paste a complex logic statement into the REPL to see exactly what it evaluates to before putting it into your main codebase.

- **C. Exploring APIs**
  If you are using a library, you can use the REPL to see what methods are available on an object by typing the object name followed by a dot and hitting Tab.

### Pro-Tip: The "Underscore" Variable

In the Node.js REPL, the character \_ (underscore) is a special variable that stores the result of the last operation.

```
> 10 + 20
30
> _ + 5
35
```

# 10. What is a callback function?

A function passed as an argument to another function, intended to be executed after an asynchronous task completes.

## Explanation

### A. The Core Concept

- Think of a callback as a **"Call-Back Number"** you leave with a busy pharmacy.

- You don't stand at the counter staring at the pharmacist while they fill your prescription (that would be blocking).

- You give them your phone number (the callback) and go shop for other things.

- When the medicine is ready, they call you (execute the function).

### B. Why do we need them?

JavaScript is **single-threaded**. If you ask it to download a massive file, and it had to wait, your whole app would "freeze" (you couldn't click buttons or scroll). Callbacks allow the task to happen in the background.

### C. How it looks in Code

The Structure
A callback is just a regular function, but **it is passed as a variable into another function**.

```
// 1. Define the callback function
function sayFinished() {
    console.log("The task is finally done!");
}

// 2. Define a function that takes a callback as an argument
function startLongTask(callback) {
    console.log("Starting task...");

    // Simulating a delay (like a download)
    setTimeout(() => {
        // 3. Execute the callback after the delay
        callback();
    }, 3000);
}

// 4. Run it
startLongTask(sayFinished);
```

### D. Anatomy of the Process

The Argument: You pass **sayFinished into startLongTask**. Notice we don't use parentheses () yet, because we don't want it to run now; we want it to run later.

- **The Higher-Order Function:** startLongTask is the function that "receives" the callback.

- **The Execution:** Once the timer (asynchronous task) finishes, the higher-order function "calls back" the function you gave it.

### E. From Callbacks to "Callback Hell"

Callbacks were the **original way to handle async tasks** in JavaScript. However, if you had to do five things in a row (Download -> Unzip -> Read -> Save -> Email), your code would start looking like a sideways pyramid:

```
getData(function(a) {
    getMoreData(a, function(b) {
        getEvenMoreData(b, function(c) {
            // This is "Callback Hell"
        });
    });
});
```

To solve this **"pyramid"** problem, modern JavaScript now uses **Promises and Async/Await**, which make asynchronous code look and feel like normal, top-to-bottom code.
