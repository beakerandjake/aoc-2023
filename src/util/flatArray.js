import { Vector2 } from "./vector2.js";

/**
 * @typedef {Object} Shape
 * @property {number} width - The width of the 2d array.
 * @property {number} height - The height of the 2d array.
 */

/**
 * A *flattened* two dimensional array. Items are mapped in C memory order.
 * @typedef {Array} FlatArray
 * @property {Shape} shape - An object containing the dimensions of the original 2d array.
 */

/**
 * Convert an array of strings into a flat 2d array.
 * Each string in the array is considered a row, and each character of that string is treated as a column.
 * @param {string[]} array - Array of equal length strings to convert to a flat 2d array.
 * @param {(char:string, y:number, x:number) => string} mapFn - Map function invoked on every char of the string
 * @returns {FlatArray}
 */
export const flat2d = (array, mapFn = (char) => char) => {
  if (!array.length) {
    const empty = [];
    empty.shape = { width: 0, height: 0 };
    return empty;
  }
  const height = array.length;
  const width = array[0].length;
  const toReturn = array.reduce((acc, row, y) => {
    if (row.length !== width) {
      throw new Error("each string must have consistent length!");
    }
    const mapped = [...row].map((char, x) => mapFn(char, y, x));
    acc.push(...mapped);
    return acc;
  }, []);
  toReturn.shape = { height, width };
  return toReturn;
};

/**
 * Converts the world (x,y) coordinate to a flat 2d index.
 * @param {FlatArray} arr
 * @param {Vector2} position
 * @returns {number}
 */
export const index2d = (arr, { x, y }) => arr.shape.width * y + x;

/**
 * Converts the flat 2d index to a world (x,y) coordinate.
 * @param {FlatArray} arr
 * @param {number} index
 */
export const world2d = (arr, index) =>
  new Vector2(Math.floor(index / arr.shape.width), index % arr.shape.width);

/**
 * Returns an iterator which loops over the flat 2d array.
 * @param {FlatArray} arr
 * @returns {Iterator<[Any, Vector2]>} A new iterator that yields [element, position] pairs for each element of the 2d array.
 */
/* eslint-disable func-style */
export function* elements2d(arr) {
  for (let y = 0; y < arr.shape.height; y++) {
    for (let x = 0; x < arr.shape.width; x++) {
      const position = new Vector2(y, x);
      yield [arr[index2d(position)], position];
    }
  }
}

/**
 * Returns a string visualizing the flattened 2d array.
 * @param {FlatArray} arr - A flat 2d array.
 * @param {(element:any,y:number,x:number) => string} renderFn - Function invoked on each element in the array, returns the string to use to render this element.
 */
export const arr2dToStr = (arr, renderFn = (item) => item) => {
  const rows = [...Array(arr.shape.height)].map(() => []);
  for (const [item, position] of elements2d(arr)) {
    rows[position.y].push(renderFn(item, position));
  }
  return rows.map((row) => row.join("")).join("\n");
};

/**
 * Returns a new flat 2d array filled with the value. Note all elements in the array will be this exact value: if value is an object, each slot in the array will reference that object.
 * @returns {FlatArray}
 * @param {number} y
 * @param {number} x
 */
export const fill2d = (height, width, value) => {
  const array = new Array(height * width).fill(value);
  array.shape = { height, width };
  return array;
};
