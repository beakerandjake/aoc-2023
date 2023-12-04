/**
 * Returns a new set containing elements present in both sets.
 * @param {Set} lhs
 * @param {Set} rhs
 */
export const intersection = (lhs, rhs) => {
  const toReturn = new Set();
  for (const item of lhs) {
    if (rhs.has(item)) {
      toReturn.add(item);
    }
  }
  return toReturn;
};
