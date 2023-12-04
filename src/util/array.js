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
