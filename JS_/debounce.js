/**
 *
 * Debounce in JavaScript is a technique used to limit how often a function runs.
 * It ensures the function executes only after a certain amount of time has passed since the last call.
 */

/**
 * Here debounce() taking 1st parameter as Function,
 * 2nd parameter Time delay
 * return an function
 * which is a altered version of our entered search()
 * where debboce is enabled
 */
const debounce = (fn, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const search = (query) => {
  // Operation logic
  // response
  console.log(`Reasults for :: (${query})`);
};

const searchWithDebounce = debounce(search, 500);

// Without Debouce
console.log("=========== Without Debounce ============");
console.log("=========================================");
search("Be");
search("Best ");
search("Best W");
search("Best Way");
search("Best Way To");

// With Debounce
console.log("============ With Debounce ==============");
console.log("=========================================");
searchWithDebounce("Be");
// searchWithDebounce("Best ");
// searchWithDebounce("Best W");
// searchWithDebounce("Best Way");
// searchWithDebounce("Best Way To");

setTimeout(() => {
  searchWithDebounce("Best ");
}, 500);
setTimeout(() => {
  searchWithDebounce("Best W");
}, 500);
setTimeout(() => {
  searchWithDebounce("Best Way");
}, 500);
setTimeout(() => {
  searchWithDebounce("Best Way To");
}, 500);
setTimeout(() => {
  searchWithDebounce("Best Way To Find");
}, 2000);
