/**
 * Contains solutions for Day 5
 * Puzzle Description: https://adventofcode.com/2023/day/5
 */

import { parseDelimited } from "./util/string.js";
import { pairs, binarySearch } from "./util/array.js";

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
    // sort ranges for binary search
    return [ranges.sort((a, b) => a[1] - b[1]), i];
  };
  // parse each x-to-y map.
  const parseMaps = (start) => {
    const maps = [];
    let i = start;
    while (i < lines.length) {
      const [ranges, newIndex] = parseMap(i);
      maps.push(ranges);
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
 * Translate a source x to the ranges dest x.
 */
const translate = (x, range) => x - src(range) + dest(range);

/**
 * Maps a source value to a destination value.
 */
const mapValue = (value, maps) =>
  maps.reduce((current, ranges) => {
    const range = binarySearch(ranges, (r) => {
      if (current < src(r)) {
        return -1;
      } else if (current > src(r) + len(r)) {
        return 1;
      }
      return 0;
    });
    return range >= 0 ? translate(current, ranges[range]) : current;
  }, value);

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

// const hit = [
//   2165573804,
//   2147782144,
//   1921208416,
//   1913168713,
//   2138332329,
//   2118300166,
//   1895958020,
// ];

// const miss = [
//   42419004,
//   60210664,
//   286784392,
//   294824095,
//   69660479,
//   89692642,
//   312034788,
// ];
