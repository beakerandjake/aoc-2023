/**
 * Contains solutions for Day 1
 * Puzzle Description: https://adventofcode.com/2023/day/1
 */

/**
 * Sums an array of numbers.
 */
const sum = (numbers) => numbers.reduce((acc, x) => acc + x, 0);

/**
 * Returns the sanitized calibration values.
 */
const calibrationValues = (lines, filterDigitCharsFn, mapDigitFn) =>
  lines
    .map((line) => filterDigitCharsFn(line))
    .map((digitChars) => [digitChars[0], digitChars.at(-1)])
    .map((firstAndLast) => firstAndLast.map(mapDigitFn))
    .map((digits) => Number(digits.join("")));

/**
 * Returns the sum of the sanitized calibration values.
 */
const solve = (lines, filterDigitCharsFn, mapDigitFn) =>
  sum(calibrationValues(lines, filterDigitCharsFn, mapDigitFn));

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) =>
  solve(
    lines,
    (line) => line.match(/\d/g),
    (x) => x
  );

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ lines }) => {
  const digitRegex = /(?=(one|two|three|four|five|six|seven|eight|nine|\d))/g;
  const wordToDigit = new Map([
    ["one", "1"],
    ["two", "2"],
    ["three", "3"],
    ["four", "4"],
    ["five", "5"],
    ["six", "6"],
    ["seven", "7"],
    ["eight", "8"],
    ["nine", "9"],
  ]);
  return solve(
    lines,
    (line) => [...line.matchAll(digitRegex)].map((match) => match[1]),
    (str) => wordToDigit.get(str) || str
  );
};
