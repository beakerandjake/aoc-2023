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
