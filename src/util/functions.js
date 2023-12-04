/**
 * Invokes the callback function n number of times.
 * @param {number} times - The number of times to invoke the function.
 * @param {(number) => void} callbackFn - The function invoked each time. Invoked with the number (zero based) of the iteration
 */
export const repeat = (times, callbackFn) => {
  for (let i = 0; i < times; i++) {
    callbackFn(i);
  }
};
