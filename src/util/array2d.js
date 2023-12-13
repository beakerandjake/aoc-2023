/**
 * Returns the height of the 2d array.
 * @param {Any[][]} array
 */
export const getHeight = (array) => array.length;

/**
 * Returns the width of the 2d array.
 *  @param {Any[][]} array
 */
export const getWidth = (array) => array[0].length;

/**
 * Is the position in the bounds of the 2d array?
 * @param {Any[][]} array
 * @param {Vector2} position
 */
export const inBounds = (array, { y, x }) =>
  y >= 0 && y < getHeight(array) && x >= 0 && x < getWidth(array);

/**
 * Returns an iterator which loops over the 2d array.
 * @param {Any[][]} array
 * @returns {Iterator<[Any, Vector2]>} A new iterator that yields [element, position] pairs for each element of the 2d array.
 */
/* eslint-disable func-style */
export function* elements2d(array) {
  const height = getHeight(array);
  const width = getWidth(array);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      yield [array[y][x], y, x];
    }
  }
}
