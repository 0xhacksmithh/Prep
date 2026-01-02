const throttle = (fn, delay) => {
  let lastUpdated = 0;
  return function (...args) {
    let now = Date.now();
    if (now - lastUpdated < delay) {
      return;
    }
    lastUpdated = now;
    return fn(...args);
  };
};

const chat = (query) => {
  // Operation
  console.log(`Your msg :: ${query}`);
};

const chatWithThrottel = throttle(chat, 1000);

console.log("============= Chat =============");
chat("hi");
chat("hello");
chat("how r u");
chat("hey");
chat("kya boluu");

console.log();
console.log();
console.log("============= Chat With Throttle ===========");
chatWithThrottel("hi");
chatWithThrottel("hello");
chatWithThrottel("how r u");
chatWithThrottel("hey");
chatWithThrottel("kya boluu");

// console.log("=============================================");

setTimeout(() => {
  chatWithThrottel("hi");
}, 2000);
setTimeout(() => {
  chatWithThrottel("hello");
}, 500);
setTimeout(() => {
  chatWithThrottel("how r u");
}, 1000);
setTimeout(() => {
  chatWithThrottel("kya boluu");
}, 2000);

// const chat = (query) => {
//   // Operation
//   console.log(`Your msg :: ${query}`);
// };

// setTimeout(() => {
//   chat("hi");
// }, 2000);
// setTimeout(() => {
//   chat("hello");
// }, 500);
// setTimeout(() => {
//   chat("how r u");
// }, 1000);
// setTimeout(() => {
//   chat("kya boluu");
// }, 2000);
