/**
 * Contains solutions for Day 3
 * Puzzle Description: https://adventofcode.com/2023/day/3
 */

import { sum, product } from "./util/array.js";
import { mooreNeighborhood, neighbors } from "./util/neighbors.js";
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
  const parts = [...Array(schematic.height)].map(() => []);
  const symbols = [];
  // find all parts and symbols on this line of the schematic.
  const parseLine = (line, y) => {
    let x = 0;
    while (x < line.length) {
      let consumed = 1;
      if (isNumeric(line[x])) {
        consumed = consume(line, x, isNumeric) - x;
        parts[y].push(new SchematicComponent(y, x, consumed));
      } else if (line[x] !== ".") {
        symbols.push(new SchematicComponent(y, x, 1));
      }
      x += consumed;
    }
  };
  schematic.lines.forEach(parseLine);
  return { parts, symbols };
};

/**
 * Returns the first component which intersects with the position (if any)
 */
const findIntersectingPart = (position, parts) => {
  let l = 0;
  let u = parts.length - 1;
  while (l <= u) {
    const m = Math.floor(l + (u - l) / 2);
    const component = parts[m];
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
const findPartNumbers = (schematic, parts, position) => {
  const partNumbers = new Set();
  for (const neighbor of neighbors(position, mooreNeighborhood)) {
    if (schematic.inBounds(neighbor)) {
      const intersecting = findIntersectingPart(neighbor, parts[neighbor.y]);
      if (intersecting) {
        partNumbers.add(intersecting);
      }
    }
  }
  return [...partNumbers];
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const partNumbers = [];
  const schematic = new Schematic(lines);
  const { parts, symbols } = parseComponents(schematic);
  for (const { origin } of symbols) {
    partNumbers.push(...findPartNumbers(schematic, parts, origin));
  }
  return sum(partNumbers.map((x) => Number(schematic.getComponent(x))));
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ lines }) => {
  const gearRatios = [];
  const schematic = new Schematic(lines);
  const { parts, symbols } = parseComponents(schematic);
  for (const symbol of symbols) {
    if (schematic.getComponent(symbol) === "*") {
      const partNumbers = findPartNumbers(schematic, parts, symbol.origin);
      if (partNumbers.length === 2) {
        gearRatios.push(
          product(partNumbers.map((p) => Number(schematic.getComponent(p))))
        );
      }
    }
  }
  return sum(gearRatios);
};
