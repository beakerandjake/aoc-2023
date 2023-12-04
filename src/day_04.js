/**
 * Contains solutions for Day 4
 * Puzzle Description: https://adventofcode.com/2023/day/4
 */

import { sum } from "./util/array.js";
import { repeat } from "./util/functions.js";
import { intersectionCount } from "./util/set.js";
import { parseDelimited } from "./util/string.js";

/**
 * Parses the line of input and returns the number of winning numbers.
 */
const parseLine = (line) => {
  const [winners, mine] = line
    .split(":")[1]
    .split("|")
    .map((str) => new Set(parseDelimited(str.trim(), /\s+/, Number)));
  return intersectionCount(winners, mine);
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const points = (x) => (x >= 2 ? 2 ** (x - 1) : x);
  return sum(lines.map(parseLine).map(points));
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ lines }) => {
  const cards = lines.map(parseLine);
  const copies = Array(cards.length).fill(1);
  cards.forEach((matchCount, i) =>
    repeat(matchCount, (x) => {
      copies[x + i + 1] += copies[i];
    })
  );
  return sum(copies);
};
