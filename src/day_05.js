/**
 * Contains solutions for Day 5
 * Puzzle Description: https://adventofcode.com/2023/day/5
 */

import { parseDelimited } from "./util/string.js";
import { pairs, binarySearch } from "./util/array.js";

const rDest = (range) => range[0];
const rStart = (range) => range[1];
const rEnd = (range) => range[2];
const rTranslate = (x, r) => x - rStart(r) + rDest(r);
const rCompare = (x, r) => {
  if (x < rStart(r)) {
    return -1;
  } else if (x >= rEnd(r)) {
    return 1;
  }
  return 0;
};

class MapRange {
  constructor(dest, start, end) {
    this.start = start;
    this.end = end;
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
  }

  translate(x) {
    // assume that a recently used range will likely be used again.
    const index = binarySearch(this.ranges, (r) => r.compare(x));
    return index >= 0 ? this.ranges[index].translate(x) : x;
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
      const range = parseDelimited(lines[i], " ", Number);
      ranges.push(new MapRange(range[0], range[1], range[1] + range[2]));
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
 * Finds an overlapping range in the map (if any).
 * Returns the range and the amount of overlap.
 */
const findRangeOverlap = (start, end, ranges) => {
  const rangeIndex = binarySearch(ranges, (r) => r.compare(start));

  /**
   * no overlapping range, return full src range
   *  x1-----x2                           x1-----x2
   *             y1----y2  or  y1----y2
   */
  if (rangeIndex < 0) {
    return { range: null, width: end - start };
  }

  const range = ranges[rangeIndex];

  /**
   * overlapping range starts after srcStart, truncate src range to [x1,y1].
   *  x1-------------x2
   *        y1------------y2
   */
  if (start < range.start) {
    return { range, width: range.start - start };
  }

  /**
   * overlapping range starts before srcStart, truncate src range to [x1,y2].
   *        x1-------------x2
   *  y1------------y2
   */
  if (start >= range.start && end >= range.end) {
    return { range, width: range.end - start };
  }

  /**
   * overlapping range contains src range, return full src range.
   *      x1-----x2
   *  y1------------------y2
   */
  return { range, width: end - start };
};

/**
 * Creates a "pipe" which is a vertical slice of ranges which can
 * translate the srcStart value to X where X is the width of the smallest pipe for this range.
 */
const createPipe = (seedStart, seedEnd, maps) => {
  const pipes = [];
  let start = seedStart;
  let end = seedEnd;
  for (const map of maps) {
    const pipe = findRangeOverlap(start, end, map.ranges);
    start = pipe.range ? pipe.range.translate(start) : start;
    end = start + pipe.width;
    pipes.push(pipe);
  }
  return pipes;
};

/**
 * Pass the seed through the pipe and return the position.
 */
const executePipe = (seed, pipe) =>
  pipe.reduce(
    (acc, { range }) => (range?.covers(acc) ? range.translate(acc) : acc),
    seed
  );

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
      const skipCount = Math.min(...pipe.map(({ width }) => width));
      min = Math.min(min, executePipe(start, pipe));
      remaining -= skipCount;
      start += skipCount;
    }
  }
  return min;
};
