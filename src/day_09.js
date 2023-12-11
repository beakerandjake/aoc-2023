/**
 * Contains solutions for Day 9
 * Puzzle Description: https://adventofcode.com/2023/day/9
 */

import { parseDelimited } from "./util/string.js";
import { sum } from "./util/array.js";

/**
 * Parses a line of input and returns the history.
 */
const parseHistory = (line) => parseDelimited(line, " ", Number);

/**
 * Returns the prediction of the next value.
 */
const nextValue = (history) => {
  const sequences = [history];
  while (sequences.at(-1).some((x) => x !== 0)) {
    const previous = sequences.at(-1);
    sequences.push(previous.slice(1).map((x, i) => x - previous[i]));
  }
  return sum(sequences.map((x) => x.at(-1)));
};

/**
 * Returns the sum of the next value of each history.
 */
const solve = (histories) => sum(histories.map(nextValue));

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => solve(lines.map(parseHistory));

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ lines }) =>
  solve(lines.map((line) => parseHistory(line).reverse()));
