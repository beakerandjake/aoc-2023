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

const futureRange = (start, length, map) => {
  // find the map range that covers the future range.
  const rangeIndex = map.findRange(start);
  // found a map range that covers some or all of range.
  if (rangeIndex >= 0) {
    const range = map.ranges[rangeIndex];
    return {
      range,
      length: start + length < range.end ? length : range.end - start,
    };
  }
  // no map range found, get index of *next upcoming* map range (sorted by range start)
  const nextRangeIndex = Math.abs(rangeIndex) - 1;
  // no map ranges upcoming
  if (nextRangeIndex === map.ranges.length) {
    return { range: null, length };
  }
  // range does not cross upcoming map range.
  if (start + length < map.ranges[nextRangeIndex].start) {
    return { range: null, length };
  }
  // range crosses into upcoming map range.
  return {
    range: map.ranges[nextRangeIndex],
    length: map.ranges[nextRangeIndex].start - start,
  };
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

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ lines }) => {
  console.log();
  const { maps } = parseAlmanac(lines);
  // console.log(maps.map((x) => x.ranges));

  const newStart = (range, orig) => (range ? range.translate(orig) : orig);

  // const seed = [79, 79 + 14];
  // let srcStart = 79;
  // let srcEnd = 79 + 14;

  // const seedToSoil = findRangeOverlap(srcStart, srcEnd, maps[0]);
  // srcStart = newStart(seedToSoil.range, srcStart);
  // srcEnd = srcStart + seedToSoil.length;
  // console.log(seedToSoil);
  // console.log(srcStart, srcEnd);

  // const soilToFertilizer = findRangeOverlap(srcStart, srcEnd, maps[1]);
  // srcStart = newStart(soilToFertilizer.range, srcStart);
  // srcEnd = srcStart + soilToFertilizer.length;
  // console.log(soilToFertilizer);
  // console.log(srcStart, srcEnd);

  // const fertilizerToWater = findRangeOverlap(srcStart, srcEnd, maps[2]);
  // srcStart = newStart(fertilizerToWater.range, srcStart);
  // srcEnd = srcStart + fertilizerToWater.length;
  // console.log(fertilizerToWater);
  // console.log(srcStart, srcEnd);

  // const waterToLight = findRangeOverlap(srcStart, srcEnd, maps[3]);
  // srcStart = newStart(waterToLight.range, srcStart);
  // srcEnd = srcStart + waterToLight.length;
  // console.log(waterToLight);
  // console.log(srcStart, srcEnd);

  // const lightToTemperature = findRangeOverlap(srcStart, srcEnd, maps[4]);
  // srcStart = newStart(lightToTemperature.range, srcStart);
  // srcEnd = srcStart + lightToTemperature.length;
  // console.log(lightToTemperature);
  // console.log(srcStart, srcEnd);

  // const temperatureToHumidity = findRangeOverlap(srcStart, srcEnd, maps[4]);
  // srcStart = newStart(temperatureToHumidity.range, srcStart);
  // srcEnd = srcStart + temperatureToHumidity.length;
  // console.log(temperatureToHumidity);
  // console.log(srcStart, srcEnd);

  // const humidityToLocation = findRangeOverlap(srcStart, srcEnd, maps[4]);
  // srcStart = newStart(humidityToLocation.range, srcStart);
  // srcEnd = srcStart + humidityToLocation.length;
  // console.log(humidityToLocation);
  // console.log(srcStart, srcEnd);

  let min = Number.MAX_SAFE_INTEGER;
  const seedStart = 79;
  const seedEnd = seedStart + 14;
  let srcStart = seedStart;
  let srcEnd = seedEnd;

  let skipCount = seedEnd - seedStart;
  console.log("before", skipCount);
  for (const map of maps) {
    const { range, length } = findRangeOverlap(srcStart, srcEnd, map);
    srcStart = newStart(range, srcStart);
    srcEnd = srcStart + length;
    skipCount = Math.min(skipCount, length);
  }
  console.log("after", skipCount);

  // let minDest = Number.MAX_SAFE_INTEGER;
  // let minI = Number.MAX_SAFE_INTEGER;
  // const vals = [];
  // for (let i = 0; i < skipCount; i++) {
  //   const val = mapValue(i + seedStart, maps);
  //   if (val < minDest) {
  //     minDest = val;
  //     minI = i;
  //   }
  //   vals.push(val);
  // }
  // console.log(
  //   "minI",
  //   minI,
  //   "minDest",
  //   minDest,
  //   "plus1",
  //   mapValue(seedStart + skipCount + 1, maps)
  // );

  return 1234;
};
