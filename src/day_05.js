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
      const range = parseDelimited(lines[i], " ", Number);
      // convert length to end (src + length)
      range[2] += range[1];
      // sort ranges by start ascending.
      ranges.push(range);
      i++;
    }
    // ensure ranges are sorted by start ascending (for binary search)
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
 * Returns the destination of the map range.
 */
const rDest = (range) => range[0];

/**
 * Returns the (source) start of the map range.
 */
const rStart = (range) => range[1];

/**
 * Returns the (source) end of the map range
 */
const rEnd = (range) => range[2];

/**
 * Does the map range cover the value?
 */
const rCovers = (x, r) => x >= rStart(r) && x < rEnd(r);

/**
 * Apply the map range translation to the value
 */
const rTranslate = (x, r) => x - rStart(r) + rDest(r);

/**
 * Apply the map range translation to the value only if the range covers the value.
 */
const rTryTranslate = (x, r) => (r && rCovers(x, r) ? rTranslate(x, r) : x);

/**
 * Compares the value to the map range and returns an integer indicating the sort order.
 */
const rCompare = (x, r) => {
  if (x < rStart(r)) {
    return -1;
  } else if (x >= rEnd(r)) {
    return 1;
  }
  return 0;
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const { seeds, maps } = parseAlmanac(lines);

  // translate the seed position by running it through the almanacs maps.
  const seedPosition = (x) =>
    maps.reduce((current, ranges) => {
      const index = binarySearch(ranges, current, rCompare);
      return index >= 0 ? rTranslate(current, ranges[index]) : current;
    }, x);

  return Math.min(...seeds.map(seedPosition));
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ lines }) => {
  const { seeds, maps } = parseAlmanac(lines);

  // find an overlapping map range (if any) and the amount of overlap.
  const findRangeOverlap = (start, end, ranges) => {
    const rangeIndex = binarySearch(ranges, start, rCompare);

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
    if (start < rStart(range)) {
      return { range, width: rStart(range) - start };
    }

    /**
     * overlapping range starts before srcStart, truncate src range to [x1,y2].
     *        x1-------------x2
     *  y1------------y2
     */
    if (start >= rStart(range) && end >= rEnd(range)) {
      return { range, width: rEnd(range) - start };
    }

    /**
     * overlapping range contains src range, return full src range.
     *      x1-----x2
     *  y1------------------y2
     */
    return { range, width: end - start };
  };

  // create a vertical slice of map ranges which can process a range of seed values.
  const createPipe = (seedStart, seedEnd) => {
    let start = seedStart;
    let end = seedEnd;
    return maps.map((ranges) => {
      const pipe = findRangeOverlap(start, end, ranges);
      start = rTryTranslate(start, pipe.range);
      end = start + pipe.width;
      return pipe;
    });
  };

  // return the position of the seed.
  const executePipe = (seed, pipe) =>
    pipe.reduce((acc, { range }) => rTryTranslate(acc, range), seed);

  let answer = Number.MAX_SAFE_INTEGER;
  const seedRanges = pairs(seeds);
  for (const [from, length] of seedRanges) {
    let seedStart = from;
    const seedEnd = from + length;
    let remaining = length;
    while (remaining) {
      const pipe = createPipe(seedStart, seedEnd, maps);
      answer = Math.min(answer, executePipe(seedStart, pipe));
      // all seed values that fit in this pipe will be increasing
      // so if we know the value of the start we can skip the rest.
      const skipCount = Math.min(...pipe.map(({ width }) => width));
      remaining -= skipCount;
      seedStart += skipCount;
    }
  }
  return answer;
};
