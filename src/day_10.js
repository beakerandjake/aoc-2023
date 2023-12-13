/**
 * Contains solutions for Day 10
 * Puzzle Description: https://adventofcode.com/2023/day/10
 */

import { FlatArray } from "./util/flatArray.js";
import { cardinalNeighbors } from "./util/neighbors.js";

/**
 * Maps each pipe tile to neighbors which it can connect it.
 */
const pipeConnections = new Map([
  ["|", { north: new Set(["|", "7", "F"]), south: new Set(["|", "L", "J"]) }],
  ["-", { east: new Set(["-", "J", "7"]), west: new Set(["-", "L", "F"]) }],
  ["L", { north: new Set(["|", "7", "F"]), east: new Set(["-", "J", "7"]) }],
  ["J", { north: new Set(["|", "7", "F"]), west: new Set(["-", "L", "F"]) }],
  ["7", { south: new Set(["|", "L", "J"]), west: new Set(["-", "L", "F"]) }],
  ["F", { south: new Set(["|", "L", "J"]), east: new Set(["-", "J", "7"]) }],
]);

/**
 * Parse the input and return the world.
 */
const parseWorld = (lines) => {
  // guess the type of pipe the start tile based off of its neighbors.
  const guessStartTile = (world, startPosition) => {
    for (const [tile, connections] of pipeConnections.entries()) {
      let connectedCount = 0;
      for (const [pos, dir] of cardinalNeighbors(startPosition)) {
        const neighbor = world.inBounds(pos) ? world.elementAt(pos) : null;
        if (neighbor && connections[dir]?.has(neighbor)) {
          connectedCount++;
        }
      }
      if (connectedCount === 2) {
        return tile;
      }
    }
    throw new Error("Could not determine start tile type.");
  };

  const world = new FlatArray(lines);
  const startIndex = world.findIndex((x) => x === "S");
  const startPosition = world.indexToPosition(startIndex);
  // "fix" the input by replacing the state tile "S" with it's actual pipe character.
  world[startIndex] = guessStartTile(world, startPosition);
  return { world, startPosition };
};

/**
 * Explore the entire loop from the start location.
 */
const bfs = (world, startPosition, visitFn) => {
  const visited = new Set();
  const queue = [{ position: startPosition, distance: 0 }];
  while (queue.length) {
    const current = queue.shift();
    // skip node if visited.
    if (!visited.has(current.position.toString())) {
      const { position, distance } = current;
      
      // visit current.
      visited.add(position.toString());
      visitFn(current);

      // visit each neighbor
      const currentTile = world.elementAt(position);
      for (const [neighbor, direction] of cardinalNeighbors(position)) {
        if (world.inBounds(neighbor)) {
          const neighborTile = world.elementAt(neighbor);
          if (pipeConnections.get(currentTile)[direction]?.has(neighborTile)) {
            queue.push({ position: neighbor, distance: distance + 1 });
          }
        }
      }
    }
  }
  return visited;
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const { world, startPosition } = parseWorld(lines);
  let maxDistance = 0;
  bfs(world, startPosition, ({ distance }) => {
    maxDistance = Math.max(distance, maxDistance);
  });
  return maxDistance;
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
