/**
 * Contains solutions for Day 1
 * Puzzle Description: https://adventofcode.com/2023/day/1
 */

/**
 * Returns an array containing the first and last matches of the regex.
 */
const firstAndLastMatches = (line, digitRegex) => {
  const matches = line.match(digitRegex);
  return [matches[0], matches.at(-1)];
};

/**
 * Concats digit characters together to form a number
 */
const toNumber = (digits) => Number(digits.join(""));

/**
 * Sums an array of numbers.
 */
const sum = (numbers) => numbers.reduce((acc, x) => acc + x, 0);

/**
 * Sanitizes the calibration document and returns the sum of the calibration values.
 */
const sumOfCalibrationValues = (lines, digitRegex, digitMapFn) =>
  sum(
    lines
      .map((line) => firstAndLastMatches(line, digitRegex)) // extract the first and last 'digit'
      .map((digits) => digits.map(digitMapFn)) // map each 'digit' to a 0-9 value
      .map(toNumber) // concat the digits into a number
  );

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) =>
  sumOfCalibrationValues(lines, /\d/g, (x) => x);

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ input, lines }) => {
  const regexp = /(one|two|three|four|five|six|seven|eight|nine|\d)/g;
  const wordToDigit = new Map([
    ["one", 1],
    ["two", 2],
    ["three", 3],
    ["four", 4],
    ["five", 5],
    ["six", 6],
    ["seven", 7],
    ["eight", 8],
    ["nine", 9],
  ]);
  const mapDigit = (str) => (wordToDigit.has(str) ? wordToDigit.get(str) : str);
  return sumOfCalibrationValues(lines, regexp, mapDigit);
};
