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
    let guess;
    let maxConnections = 0;
    for (const [pipe, connections] of pipeConnections.entries()) {
      let count = 0;
      // count the number of neighbor tiles this pipe type connects to.
      for (const [pos, dir] of cardinalNeighbors(startPosition)) {
        const neighbor = world.inBounds(pos) ? world.elementAt(pos) : null;
        if (neighbor && connections[dir]?.has(neighbor)) {
          count++;
        }
      }
      // always take the pipe with the most neighboring connections.
      if (count > maxConnections) {
        guess = pipe;
        maxConnections = count;
      }
    }
    return guess;
  };

  const world = FlatArray.fromStringArray(lines);
  const startIndex = world.findIndex((x) => x === "S");
  const startPosition = world.indexToPosition(startIndex);
  // "fix" the input by replacing the state tile "S" with it's actual pipe character.
  world[startIndex] = guessStartTile(world, startPosition);
  return { world, startPosition };
};

/**
 * Returns an iterator which will explore the pipe loop.
 */
// eslint-disable-next-line func-style
function* bfs(world, start) {
  const visited = new Set([start.hash()]);
  const queue = [{ position: start, distance: 0 }];
  while (queue.length) {
    yield queue.at(0);
    const { position, distance } = queue.shift();
    const connections = pipeConnections.get(world.elementAt(position));
    for (const [neighbor, direction] of cardinalNeighbors(position)) {
      // only explore neighbors which connect to the current pipe.
      if (
        world.inBounds(neighbor) &&
        !visited.has(neighbor.hash()) &&
        connections[direction]?.has(world.elementAt(neighbor))
      ) {
        visited.add(neighbor.hash());
        queue.push({ position: neighbor, distance: distance + 1 });
      }
    }
  }
  return visited;
}

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const { world, startPosition } = parseWorld(lines);
  let maxDistance = 0;
  for (const { distance } of bfs(world, startPosition)) {
    maxDistance = Math.max(distance, maxDistance);
  }
  return maxDistance;
};

const renderMap = {
  "|": "│",
  "-": "─",
  L: "└",
  J: "┘",
  7: "┐",
  F: "┌",
};

const printWorld = (lines) => {
  const { world, startPosition } = parseWorld(lines);
  const render = FlatArray.fill(world.height, world.width, ".");
  for (const { position } of bfs(world, startPosition)) {
    render.updateAt(position, renderMap[world.elementAt(position)]);
  }
  console.log(render.toString());
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ lines }) => {
  printWorld(lines);
  // const { world, startPosition } = parseWorld(lines);
  // const fill = FlatArray.fill(world.height, world.width, ".");
  // const visited = exploreLoop(world, startPosition, () => {});
  // console.log(memo.toString());
  return 1234;
};
