/* eslint-disable func-style */

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
 * Returns an iterator which loops over the neighbors of the position, yielding each neighbors position.
 * @param {Vector2} position - The point whose neighbors to iterate.
 * @param {Vector2[]} neighborDeltas - The deltas which lead to each neighbor.
 */
export function* neighbors(position, neighborDeltas) {
  for (const delta of neighborDeltas) {
    yield add(delta, position);
  }
}

/**
 * Returns an iterator which loops over the cardinal neighbors of the position, yielding each neighbor and its direction.
 * @param {Vector2} position
 */
export function* cardinalNeighbors(position) {
  yield [add(position, up), "north"];
  yield [add(position, down), "south"];
  yield [add(position, right), "east"];
  yield [add(position, left), "west"];
}
