/**
 * Contains solutions for Day 10
 * Puzzle Description: https://adventofcode.com/2023/day/10
 */

import { cardinalNeighbors } from "./util/neighbors.js";
import { Vector2 } from "./util/vector2.js";

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
 * Parse the input and returns the world.
 */
const parseWorld = (lines) => ({
  items: lines,
  shape: { height: lines.length, width: lines[0].length },
});

const inBounds = ({ height, width }, { y, x }) =>
  y >= 0 && y < height && x >= 0 && x < width;

const findStart = ({ items, shape }) => {
  // return the position of the "S" tile.
  const findPosition = () => {
    for (let y = 0; y < shape.height; y++) {
      for (let x = 0; x < shape.width; x++) {
        if (items[y][x] === "S") {
          return new Vector2(y, x);
        }
      }
    }
    throw new Error("Could not find start location");
  };

  // return the type of pipe of the "S" tile.
  const findTile = (position) => {
    // test every tile type and return the first tile which is connected to two neighbors.
    for (const [tile, connections] of pipeConnections.entries()) {
      const connected = [...cardinalNeighbors(position)].filter(
        ([pos, dir]) => {
          const neighbor = inBounds(shape, pos) ? items[pos.y][pos.x] : null;
          return neighbor && connections[dir]?.has(neighbor);
        }
      );
      if (connected.length === 2) {
        return tile;
      }
    }
    throw new Error("Could not find start tile type");
  };
  const position = findPosition();
  return { position, tile: findTile(position) };
};

/**
 *
 */
const bfs = (world, visitFn) => {
  const visited = new Set();
  const queue = [{ ...findStart(world), distance: 0 }];
  while (queue.length) {
    const current = queue.shift();
    if (!visited.has(current.position.toString())) {
      const { position, tile, distance } = current;

      // mark current as visited.
      visited.add(position.toString());
      if (visitFn(current) === true) {
        break;
      }

      // visit each neighbor
      for (const [neighbor, direction] of cardinalNeighbors(position)) {
        if (inBounds(world.shape, neighbor)) {
          const neighborTile = world.items[neighbor.y][neighbor.x];
          if (pipeConnections.get(tile)[direction]?.has(neighborTile)) {
            queue.push({
              position: neighbor,
              tile: neighborTile,
              distance: distance + 1,
            });
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
  const world = parseWorld(lines);
  let maxDistance = 0;
  bfs(world, ({ distance }) => {
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
