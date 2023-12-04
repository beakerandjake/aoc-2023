/**
 * Deltas for the Von Neumann neighborhood of a cell.
 */
export const vonNeumannNeighborhood = Object.freeze([
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
]);

/**
 * Deltas for the Moore neighborhood of a cell.
 */
export const mooreNeighborhood = Object.freeze([
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
]);

/**
 * Executes the callback function once per in bounds neighbor
 * @param {Object} bounds - Defines the width and height of the world.
 * @param {Vector2} position - The point whose neighbors to iterate.
 * @param {Vector2[]} neighborDirections - The directions of each neighbor.
 * @param {(Vector2) => void} callbackFn - The function invoked on each in bounds neighbor.
 */
export const neighborsForEach = (
  { width, height },
  { y, x },
  neighborDirections,
  callbackFn
) =>
  neighborDirections.forEach(({ y: dy, x: dx }) => {
    const ny = dy + y;
    const nx = dx + x;
    if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
      callbackFn(ny, nx);
    }
  });
