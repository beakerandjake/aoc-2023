/**
 * Contains solutions for Day 2
 * Puzzle Description: https://adventofcode.com/2023/day/2
 */

const parseId = (str) => Number(str.match(/Game (\d+)/)[1]);

const parseSet = (str) =>
  str.split(",").reduce((acc, draw) => {
    const [, count, color] = draw.match(/(\d+) (red|green|blue)/);
    return acc.set(color, Number(count));
  }, new Map());

const parseLine = (line) => {
  const [idPart, setsPart] = line.split(":");
  return { id: parseId(idPart), sets: setsPart.split(";").map(parseSet) };
};

const valueOrDefault = (map, key, defaultValue) =>
  map.has(key) ? map.get(key) : defaultValue;

const isPossible = (set, requirements) =>
  Object.entries(requirements).every(
    ([color, requiredCount]) => valueOrDefault(set, color, 0) <= requiredCount
  );

const solve = (lines, requirements) =>
  lines
    .map(parseLine)
    .filter(({ sets }) => sets.every((set) => isPossible(set, requirements)))
    .map(({ id }) => id)
    .reduce((acc, id) => acc + id, 0);

export const levelOne = ({ lines }) =>
  solve(lines, {
    red: 12,
    green: 13,
    blue: 14,
  });

export const levelTwo = ({ input, lines }) => {};
