/**
 * Contains solutions for Day 6
 * Puzzle Description: https://adventofcode.com/2023/day/6
 */

import { product, zip } from "./util/array.js";
import { parseDelimited } from "./util/string.js";

/**
 * Parse the input and return the races.
 */
const parseRaces = (lines) => {
  const values = (line) =>
    parseDelimited(line.split(":")[1].trim(), /\s+/, Number);
  return zip(values(lines[0]), values(lines[1]));
};

/**
 * Count the number of ways to beat the record time in the race.
 */
const waysToWin = ([raceTime, record]) => {
  let count = 0;
  for (let t = 1; t <= raceTime; t++) {
    if (t * (raceTime - t) > record) {
      count++;
    }
  }
  return count;
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) =>
  product(parseRaces(lines).map(waysToWin));

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
