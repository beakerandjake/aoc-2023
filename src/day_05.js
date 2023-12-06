/**
 * Contains solutions for Day 5
 * Puzzle Description: https://adventofcode.com/2023/day/5
 */

import { parseDelimited } from "./util/string.js";
import { pairs } from "./util/array.js";

/**
 * The dest start of the range.
 */
const dest = (range) => range[0];

/**
 * The source start of the range.
 */
const src = (range) => range[1];

/**
 * The length of a range.
 */
const len = (range) => range[2];

/**
 * Parse the lines of the input and returns an almanac.
 */
const parseAlmanac = (lines) => {
  // parse a x-to-y map and its entries.
  const parseMap = (start) => {
    const ranges = [];
    // skip start x-to-y line.
    let i = start + 1;
    // consume all range entries until an empty line is reached.
    while (i < lines.length && lines[i]) {
      ranges.push(parseDelimited(lines[i], " ", Number));
      i++;
    }
    return [ranges, i];
  };
  // parse each x-to-y map.
  const parseMaps = (start) => {
    const maps = [];
    let i = start;
    while (i < lines.length) {
      const [ranges, newIndex] = parseMap(i);
      // sort ranges for binary search
      maps.push(ranges.sort((a, b) => src(a) - src(b)));
      i = newIndex + 1;
    }
    return maps;
  };
  return {
    seeds: parseDelimited(lines[0].split(":")[1].trim(), " ", Number),
    maps: parseMaps(2),
  };
};

/**
 * Translate a source x to the ranges dest x.
 */
const translate = (x, range) => x - src(range) + dest(range);

/**
 * Returns the first range which covers value x.
 */
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

/**
 * Maps a source value to a destination value.
 */
const mapValue = (value, maps) => {
  let current = value;
  for (let i = 0; i < maps.length; i++) {
    const range = findRange(current, maps[i]);
    current = range ? translate(current, range) : current;
  }
  return current;
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const { seeds, maps } = parseAlmanac(lines);
  return Math.min(...seeds.map((x) => mapValue(x, maps)));
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ lines }) => {
  let lowest = Number.MAX_SAFE_INTEGER;
  const { seeds, maps } = parseAlmanac(lines);
  const seedRanges = pairs(seeds).map(([s, l]) => [s, s + l]);
  for (const [start, end] of seedRanges) {
    for (let seed = start; seed < end; seed++) {
      lowest = Math.min(mapValue(seed, maps), lowest);
    }
  }
  return lowest;
};
