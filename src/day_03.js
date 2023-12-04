/**
 * Contains solutions for Day 3
 * Puzzle Description: https://adventofcode.com/2023/day/3
 */

import { sum } from "./util/array.js";
import { mooreNeighborhood, neighborsForEach } from "./util/neighbors.js";
import { consume, isNumeric } from "./util/string.js";
import { Vector2 } from "./util/vector2.js";

/**
 * Contains information about a component of the schematic.
 */
class SchematicComponent {
  constructor(y, x, width) {
    this.origin = new Vector2(y, x);
    this.width = width;
  }
}

/**
 * The raw schematic.
 */
class Schematic {
  constructor(lines) {
    this.lines = lines;
    this.height = lines.length;
    this.width = lines[0].length;
  }

  /**
   * Returns the value of the component.
   */
  getComponent(component) {
    return this.lines[component.origin.y].slice(
      component.origin.x,
      component.origin.x + component.width
    );
  }

  /**
   * Is the position in the bounds of the schematic?
   */
  inBounds({ y, x }) {
    return y >= 0 && y < this.height && x >= 0 && x < this.width;
  }
}

/**
 * Parse the schematic and find the components.
 * Returns a 2d array of the components on each line of the schematic.
 */
const parseComponents = (schematic) => {
  const parseLine = (line, y) => {
    const symbols = [];
    const parts = [];
    let x = 0;
    while (x < line.length) {
      let consumed = 1;
      if (isNumeric(line[x])) {
        consumed = consume(line, x, isNumeric) - x;
        parts.push(new SchematicComponent(y, x, consumed));
      } else if (line[x] !== ".") {
        symbols.push(new SchematicComponent(y, x, 1));
      }
      x += consumed;
    }
    return { symbols, parts };
  };
  return schematic.lines.reduce((acc, line, y) => {
    acc.push(parseLine(line, y));
    return acc;
  }, []);
};

const findComponent = (position, components) => {
  let l = 0;
  let u = components.length - 1;
  while (l <= u) {
    const m = Math.floor(l + (u - l) / 2);
    const component = components[m];
    if (position.x < component.origin.x) {
      u = m - 1;
    } else if (position.x >= component.origin.x + component.width) {
      l = m + 1;
    } else {
      return component;
    }
  }
  return null;
};

/**
 * Returns an array containing all the moore neighbors of the position who are parts.
 */
const findAdjacentParts = (schematic, components, position) => {
  const parts = new Set();
  neighborsForEach(position, mooreNeighborhood, (neighbor) => {
    if (schematic.inBounds(neighbor)) {
      const part = findComponent(neighbor, components[neighbor.y].parts);
      if (part) {
        parts.add(part);
      }
    }
  });
  return [...parts];
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const adjacentParts = [];
  const schematic = new Schematic(lines);
  const components = parseComponents(schematic);
  for (const row of components) {
    for (const symbol of row.symbols) {
      adjacentParts.push(
        ...findAdjacentParts(schematic, components, symbol.origin)
      );
    }
  }
  return sum(adjacentParts.map((x) => Number(schematic.getComponent(x))));
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
