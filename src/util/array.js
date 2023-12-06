/**
 * Returns the sum of each item in the array
 * @param {number[]} items
 * @returns {number}
 */
export const sum = (items) => items.reduce((acc, x) => acc + x, 0);

/**
 * Returns the product of each item in the array
 * @param {number[]} items
 * @returns {number}
 */
export const product = (items) => items.reduce((acc, x) => acc * x, 1);

/**
 * Maps each item in the the array to the number of times that item appears in the array.
 * @param {Array} items
 * @return {Map<Any,number>}
 */
export const frequencyMap = (items) =>
  items.reduce(
    (acc, item) => acc.set(item, (acc.get(item) || 0) + 1),
    new Map()
  );

/**
 * Creates an array of elements split into pairs. If the array cannot be split evenly the final pair will have one element
 * @param {Array}
 * @returns {Array}
 */
export const pairs = (array) =>
  array.reduce(
    (acc, _, i) => (i % 2 === 0 ? [...acc, array.slice(i, i + 2)] : acc),
    []
  );

/**
 * Searches the array for a value and returns if found.
 * @param {Array} arr
 * @param {(any) => number} compareFn - Function used to compare items.
 *    Expected to return:
 *      - Less than 1 if search value is less than current item
 *      - Greater than 1 if search value is greater than item
 *      - Zero if search value is equal to item.
 */
export const binarySearch = (arr, compareFn) => {
  let l = 0;
  let u = arr.length - 1;
  while (l <= u) {
    const m = (l + u) >> 1;
    const comp = compareFn(arr[m]);
    if (comp < 0) {
      u = m - 1;
    } else if (comp > 0) {
      l = m + 1;
    } else {
      return m;
    }
  }
  return -1;
};
