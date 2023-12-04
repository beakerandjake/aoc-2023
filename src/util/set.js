/**
 * Invokes the callback once per item which is present in both sets.`
 */
const intersect = (a, b, intersectCallback) => {
  for (const item of a) {
    if (b.has(item)) {
      intersectCallback(item);
    }
  }
};

/**
 * Returns a new set containing elements present in both sets.
 * @param {Set} a
 * @param {Set} b
 */
export const intersection = (a, b) => {
  const toReturn = new Set();
  intersect(a, b, (x) => toReturn.add(x));
  return toReturn;
};

/**
 * Returns a new set containing elements present in both sets.
 * @param {Set} a
 * @param {Set} b
 */
export const intersectionCount = (a, b) => {
  let count = 0;
  intersect(a, b, () => count++);
  return count;
};
