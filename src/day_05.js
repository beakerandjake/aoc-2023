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
      maps.set(src, { dest, ranges: ranges.sort((a, b) => a[1] - b[1]) });
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
const findRange = (x, ranges) => {
  let l = 0;
  let u = ranges.length - 1;
  while (l <= u) {
    const m = (l + u) >> 1;
    const r = ranges[m];
    if (x < src(r)) {
      u = m - 1;
    } else if (x >= src(r) + len(r)) {
      l = m + 1;
    } else {
      return r;
    }
  }
  return null;
};

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
export const levelTwo = ({ lines }) => {
  const { maps } = parseAlmanac(lines);
  for (const { dest: d, ranges } of maps.values()) {
    const logs = [`dest:${d}`];
    for (const range of ranges) {
      logs.push(range);
    }
    console.log(logs.join("\n"));
  }
  return 124;
};
