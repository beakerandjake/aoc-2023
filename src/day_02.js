/**
 * Contains solutions for Day 2
 * Puzzle Description: https://adventofcode.com/2023/day/2
 */

import { sum, product } from "./util/array.js";

/**
 * Maps a color to the index of that color in a cube array.
 */
const indexes = { red: 0, green: 1, blue: 2 };

/**
 * Parses a single line of input and returns information about that game.
 */
const parseLine = (line) => {
  const [id, cubes] = line.split(":");
  return {
    id: id.match(/Game (\d+)/)[1],
    cubes: cubes.split(";").reduce((acc, handful) => {
      // compress all of the draws into one taking the largest count of each color.
      for (const cube of handful.split(",")) {
        const [, count, color] = cube.match(/(\d+) (red|green|blue)/);
        acc[indexes[color]] = Math.max(acc[indexes[color]], count);
      }
      return acc;
    }, Array(3).fill(0)),
  };
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
