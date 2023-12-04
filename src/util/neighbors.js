import { add, up, down, left, right } from "./vector2.js";

/**
 * Deltas for the Von Neumann neighborhood of a cell.
 */
export const vonNeumannNeighborhood = [up, down, left, right];

/**
 * Deltas for the Moore neighborhood of a cell.
 */
export const mooreNeighborhood = [
  add(up, left),
  up,
  add(up, right),
  right,
  add(right, down),
  down,
  add(down, left),
  left,
];

/**
 * Executes the callback function once per in bounds neighbor
 * @param {Vector2} position - The point whose neighbors to iterate.
 * @param {Vector2[]} neighborDeltas - The directions of each neighbor.
 * @param {(Vector2) => void} callbackFn - The function invoked on each in bounds neighbor.
 */
export const neighborsForEach = (position, neighborDeltas, callbackFn) => {
  for (const delta of neighborDeltas) {
    callbackFn(add(delta, position));
  }
};
