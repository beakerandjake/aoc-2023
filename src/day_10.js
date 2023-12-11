/**
 * Contains solutions for Day 10
 * Puzzle Description: https://adventofcode.com/2023/day/10
 */

import { cardinalNeighborMap } from "./util/neighbors.js";
import { Vector2, add } from "./util/vector2.js";

const pipeConnections = new Map([
  ["|", { north: new Set(["|", "7", "F"]), south: new Set(["|", "L", "J"]) }],
  ["-", { east: new Set(["-", "J", "7"]), west: new Set(["-", "L", "F"]) }],
  ["L", { north: new Set(["|", "7", "F"]), east: new Set(["-", "J", "7"]) }],
  ["J", { north: new Set(["|", "7", "F"]), west: new Set(["-", "L", "F"]) }],
  ["7", { south: new Set(["|", "L", "J"]), west: new Set(["-", "L", "F"]) }],
  ["F", { south: new Set(["|", "L", "J"]), east: new Set(["-", "J", "7"]) }],
]);

const parseWorld = (lines) => ({
  items: lines,
  shape: { height: lines.length, width: lines[0].length },
});

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
    // const neighbors = new Map();
    // for(const [direction, delta] of cardinalNeighborMap.entries()){
    //   const neighbor =
    // }
    return "J";
  };

  const position = findPosition();
  return { position, tile: findTile(position) };
};

/**
 * ||F
 * LS|
 * F-J
 */

const inBounds = ({ height, width }, { y, x }) =>
  y >= 0 && y < height && x >= 0 && x < width;

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const world = parseWorld(lines);
  let maxDistance = 0;
  const visited = new Set();
  const copy = world.items.map((x) => [...x]);
  const queue = [{ ...findStart(world), distance: 0 }];
  while (queue.length) {
    const { position, tile, distance } = queue.shift();
    if (!visited.has(position.toString())) {
      visited.add(position.toString());
      maxDistance = Math.max(distance, maxDistance);
      copy[position.y][position.x] = `${distance}`;
      for (const [direction, delta] of cardinalNeighborMap.entries()) {
        const neighborPosition = add(position, delta);
        if (inBounds(world.shape, neighborPosition)) {
          const neighborTile =
            world.items[neighborPosition.y][neighborPosition.x];
          if (pipeConnections.get(tile)[direction]?.has(neighborTile)) {
            queue.push({
              position: neighborPosition,
              tile: neighborTile,
              distance: distance + 1,
            });
          }
        }
      }
    }
  }
  return maxDistance;
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
