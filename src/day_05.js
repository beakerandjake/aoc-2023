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

  toString() {
    return `{ start: ${this.start}, end: ${this.end} }`;
  }
}

class Map {
  constructor(ranges) {
    // sort ranges for binary search.
    this.ranges = ranges.sort((a, b) => a.start - b.start);
    this.cachedRange = null;
    this.coveredRanges = this.#compressRanges();
  }

  #compressRanges() {
    const compressed = [];
    let [{ start, end }] = this.ranges;
    for (let i = 1; i < this.ranges.length; i++) {
      if (end >= this.ranges[i].start) {
        end = this.ranges[i].end;
      } else {
        compressed.push([start, end]);
        start = this.ranges[i].start;
        end = this.ranges[i].end;
      }
    }
    compressed.push([start, end]);
    return compressed;
  }

  findRange(x) {
    return binarySearch(this.ranges, (r) => r.compare(x));
  }

  translate(x) {
    // assume that a recently used range will likely be used again.
    if (!this.cachedRange || !this.cachedRange.covers(x)) {
      const index = this.findRange(x);
      this.cachedRange = index >= 0 ? this.ranges[index] : null;
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
 * Does [x1,x2] overlap [y1,y2]
 */
const overlaps = (x1, x2, y1, y2) => x1 < y2 && y1 < x2;

/**
 * Finds an overlapping range in the map (if any).
 * Returns the range and the amount of overlap.
 */
const findRangeOverlap = (srcStart, srcEnd, map) => {
  // todo faster than linear search.
  const range = map.ranges.find((r) =>
    overlaps(srcStart, srcEnd, r.start, r.end)
  );

  /**
   * no overlapping range, return full src range
   *  x1-----x2                           x1-----x2
   *             y1----y2  or  y1----y2
   */
  if (!range) {
    return { range: null, length: srcEnd - srcStart };
  }
  /**
   * overlapping range starts after srcStart, truncate src range.
   *  x1-------------x2
   *        y1------------y2
   */
  if (srcStart < range.start) {
    return { range, length: range.start - srcStart };
  }

  /**
   * overlapping range starts before srcStart, truncate src range.
   *        x1-------------x2
   *  y1------------y2
   */
  if (srcStart >= range.start && srcEnd >= range.end) {
    return { range, length: range.end - srcStart };
  }

  /**
   * overlapping range contains src range, return full src range.
   *      x1-----x2
   *  y1------------------y2
   */
  return { range, length: srcEnd - srcStart };
};

const createPipe = (srcStart, srcEnd, maps) => {
  const pipes = [];
  let start = srcStart;
  let end = srcEnd;
  for (const map of maps) {
    const pipe = findRangeOverlap(start, end, map);
    start = pipe.range ? pipe.range.translate(start) : start;
    end = start + pipe.length;
    pipes.push(pipe);
  }
  return pipes;
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ lines }) => {
  let min = Number.MAX_SAFE_INTEGER;
  const { seeds, maps } = parseAlmanac(lines);
  const seedRanges = pairs(seeds);
  for (const [seedStart, seedLength] of seedRanges) {
    let start = seedStart;
    const end = seedStart + seedLength;
    let remaining = seedLength;
    while (remaining > 0) {
      const pipe = createPipe(start, end, maps);
      const skipCount = Math.max(
        1,
        Math.min(...pipe.map(({ length }) => length))
      );
      min = Math.min(min, mapValue(start, maps));
      remaining -= skipCount;
      start += skipCount;
    }
  }
  return min;
};
