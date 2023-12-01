/**
 * Contains solutions for Day 1
 * Puzzle Description: https://adventofcode.com/2023/day/1
 */

/**
 * Returns the sum of the sanitized calibration values.
 */
const sumOfCalibrationValues = (lines, filterDigitCharsFn, mapDigitFn) =>
  lines
    .map((line) => filterDigitCharsFn(line))
    .map((digitChars) => [digitChars[0], digitChars.at(-1)])
    .map((firstAndLast) => firstAndLast.map(mapDigitFn))
    .map((digits) => Number(digits.join("")))
    .reduce((sum, value) => sum + value, 0);

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) =>
  sumOfCalibrationValues(
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
  return sumOfCalibrationValues(
    lines,
    (line) => [...line.matchAll(digitRegex)].map((match) => match[1]),
    (str) => wordToDigit.get(str) || str
  );
};
