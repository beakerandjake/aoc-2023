/**
 * Returns the greatest common denominator of the two values.
 * @param {number} a
 * @param {number} b
 */
export const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

/**
 * Computes the least common multiple between the two numbers
 * @param {number} a
 * @param {number} b
 */
const doLcm = (a, b) => (a * b) / gcd(a, b);

/**
 * Computes the least common multiple between the numbers.
 * @param {...number} numbers
 */
export const lcm = (...numbers) => {
  if (numbers.length < 2) {
    throw new RangeError("need at least two numbers");
  }
  return numbers.reduce((acc, x) => doLcm(acc, x), 1);
};
