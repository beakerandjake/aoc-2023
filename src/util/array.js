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
