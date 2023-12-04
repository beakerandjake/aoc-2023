/**
 * Contains solutions for Day 4
 * Puzzle Description: https://adventofcode.com/2023/day/4
 */

import { intersection } from "./util/set.js";
import { parseDelimited } from "./util/string.js";
import { sum } from "./util/array.js";

const parseLine = (line) =>
  line
    .split(":")[1]
    .split("|")
    .map((str) => new Set(parseDelimited(str.trim(), /\s+/, Number)));

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) =>
  sum(
    lines
      .map(parseLine)
      .map(([a, b]) => intersection(a, b).size)
      .map((winning) => (winning >= 2 ? 2 ** (winning - 1) : winning))
  );

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
