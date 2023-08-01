export function debounce(fn, ms) {
  let timeoutId;

  return function (...args) {
    return new Promise((resolve, reject) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        try {
          resolve(fn.apply(this, args));
        } catch (e) {
          reject(error);
        }
      }, ms);
    });
  };
}
