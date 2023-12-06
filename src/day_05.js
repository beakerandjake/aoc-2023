/**
 * Contains solutions for Day 5
 * Puzzle Description: https://adventofcode.com/2023/day/5
 */

import { parseDelimited } from "./util/string.js";
import { pairs, binarySearch } from "./util/array.js";

class MapRange {
  constructor([dest, start, length]) {
    this.start = start;
    this.end = start + length;
    this.dest = dest;
  }

  covers(x) {
    return x >= this.start && x < this.end;
  }

  translate(x) {
    return x - this.start + this.dest;
  }

  compare(x) {
    if (x < this.start) {
      return -1;
    } else if (x >= this.end) {
      return 1;
    }
    return 0;
  }
}

class Map {
  constructor(ranges) {
    // sort ranges for binary search.
    this.ranges = ranges.sort((a, b) => a.start - b.start);
    this.cachedRange = null;
  }

  translate(x) {
    // assume that a recently used range will likely be used again.
    if (!this.cachedRange || !this.cachedRange.covers(x)) {
      const range = binarySearch(this.ranges, (r) => r.compare(x));
      this.cachedRange = range >= 0 ? this.ranges[range] : null;
    }
    return this.cachedRange ? this.cachedRange.translate(x) : x;
  }
}

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
      ranges.push(new MapRange(parseDelimited(lines[i], " ", Number)));
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
      maps.push(new Map(ranges));
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
 * Maps a source value to a destination value.
 */
const mapValue = (value, maps) =>
  maps.reduce((acc, map) => map.translate(acc), value);

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
