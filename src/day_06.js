/**
 * Contains solutions for Day 6
 * Puzzle Description: https://adventofcode.com/2023/day/6
 */

import { product, zip } from "./util/array.js";
import { parseDelimited } from "./util/string.js";

/**
 * Parse the input and return info about the races.
 */
const parseRaces = (lines, parseFn) =>
  zip(parseFn(lines[0]), parseFn(lines[1]));

/**
 * Count the number of ways to beat the record time in a race.
 */
const waysToWin = ([raceTime, record]) => {
  // count losing results until first encounter with record.
  let lessThanCount = 0;
  let pressTime = 1;
  while (pressTime * (raceTime - pressTime) < record) {
    lessThanCount++;
    pressTime++;
  }
  // race results are curve, remove two losing ends, this leaves us with number of ways to win.
  return raceTime - lessThanCount * 2 - 1;
};

/**
 * Returns the produce of the number of ways to win the races described by the input.
 */
const solve = (lines, lineParseFn) =>
  product(parseRaces(lines, lineParseFn).map(waysToWin));

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) =>
  solve(lines, (line) =>
    parseDelimited(line.split(":")[1].trim(), /\s+/, Number)
  );

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ lines }) =>
  solve(lines, (line) => [Number(line.split(":")[1].replaceAll(/\s+/g, ""))]);
