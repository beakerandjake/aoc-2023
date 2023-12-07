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
 * Searches the array for an item.
 * @param {Array} arr
 * @param {Any} item - The item to search for.
 * @param {(any) => number} compareFn - Function used to compare items.
 *    Expected to return:
 *      - Less than zero if search value is less than current item
 *      - Greater than zero if search value is greater than item
 *      - Zero if search value is equal to item.
 * @returns {number} The index of the item (if found), otherwise (-(insertion point) -1)
 */
export const binarySearch = (arr, item, compareFn) => {
  let l = 0;
  let u = arr.length - 1;
  while (l <= u) {
    const m = (l + u) >> 1;
    const comp = compareFn(item, arr[m]);
    if (comp < 0) {
      u = m - 1;
    } else if (comp > 0) {
      l = m + 1;
    } else {
      return m;
    }
  }
  return ~l;
};
