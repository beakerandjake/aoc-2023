/**
 * Contains solutions for Day 2
 * Puzzle Description: https://adventofcode.com/2023/day/2
 */

import { sum, product } from "./util/array.js";

/**
 * Parses a single line of input and returns information about that game.
 */
const parseLine = (line) => {
  // maps a color key to the index of that color in a games color array.
  const indexes = { red: 0, green: 1, blue: 2 };

  // returns the id portion of the games input string.
  const parseId = (str) => str.match(/Game (\d+)/)[1];

  // parses the cubes portion of the input string, returns the max required cubes per color.
  const parseCubes = (str) =>
    str.split(";").reduce((acc, handful) => {
      for (const cube of handful.split(",")) {
        const [, count, color] = cube.match(/(\d+) (red|green|blue)/);
        acc[indexes[color]] = Math.max(acc[indexes[color]], count);
      }
      return acc;
    }, Array(3).fill(0));

  const [id, cubes] = line.split(":");
  return { id: parseId(id), cubes: parseCubes(cubes) };
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const bag = [12, 13, 14];
  return sum(
    lines
      .map(parseLine)
      .filter(({ cubes }) => bag.every((x, i) => cubes[i] <= x))
      .map(({ id }) => Number(id))
  );
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelTwo = ({ lines }) =>
  sum(lines.map(parseLine).map(({ cubes }) => product(cubes)));
