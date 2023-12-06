/**
 * Contains solutions for Day 5
 * Puzzle Description: https://adventofcode.com/2023/day/5
 */

import { parseDelimited } from "./util/string.js";

const parseAlmanac = (lines) => {
  // parse a x-to-y map and its entries.
  const parseMap = (start) => {
    const [, src, dest] = lines[start].match(/(\w+)-to-(\w+)/);
    const ranges = [];
    let i = start + 1;
    // consume all range entries until an empty line is reached.
    while (i < lines.length && lines[i]) {
      ranges.push(parseDelimited(lines[i], " ", Number));
      i++;
    }
    return [src, dest, ranges, i];
  };
  // parse each x-to-y map.
  const parseMaps = (start) => {
    const maps = new Map();
    let i = start;
    while (i < lines.length) {
      const [src, dest, ranges, newIndex] = parseMap(i);
      maps.set(src, { dest, ranges });
      i = newIndex + 1;
    }
    return maps;
  };
  return {
    seeds: parseDelimited(lines[0].split(":")[1].trim(), " "),
    maps: parseMaps(2),
  };
};

const dest = (range) => range[0];
const src = (range) => range[1];
const len = (range) => range[2];
const translate = (x, range) => x - src(range) + dest(range);
const inRange = (x, range) => x >= src(range) && x <= src(range) + len(range);
const findRange = (x, ranges) => ranges.find((r) => inRange(x, r));

const mapValue = (srcKey, srcValue, destKey, maps) => {
  let currentKey = srcKey;
  let currentValue = srcValue;
  while (currentKey !== destKey) {
    const { dest: newDest, ranges } = maps.get(currentKey);
    const range = findRange(currentValue, ranges);
    currentValue = range ? translate(currentValue, range) : currentValue;
    currentKey = newDest;
  }
  return currentValue;
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const { seeds, maps } = parseAlmanac(lines);
  return Math.min(...seeds.map((x) => mapValue("seed", x, "location", maps)));
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {};
