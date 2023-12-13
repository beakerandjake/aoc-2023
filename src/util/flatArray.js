import { Vector2 } from "./vector2.js";

/**
 * A *flattened* two dimensional array. Items are mapped in C memory order.
 */
export class FlatArray extends Array {
  /**
   * Convert an array of strings into a flat 2d array.
   * Each string in the array is considered a row, and each character of that string is treated as a column.
   * @param {string[]} array - Array of equal length strings to convert to a flat 2d array.
   * @param {(char:string, y:number, x:number) => string} mapFn - Map function invoked on every char of the string
   * @returns {FlatArray}
   */

  /**
   * Creates a flat array from an array of string.
   * Each string in the array is considered a row, and each character of that string is treated as a column.
   * @param {string[]} items - Array of equal length strings to convert to a flat 2d array.
   */
  constructor(array) {
    if (!array?.length) {
      throw new Error("Cannot construct a FlatArray from an empty array");
    }
    super(...array.flatMap((str) => [...str]));
    this.height = array.length;
    this.width = array[0].length;
  }

  /**
   * Returns the element at the position.
   * @param {Vector2} position
   */
  elementAt({ y, x }) {
    return this[this.width * y + x];
  }

  /**
   * Updates the element at the position
   * @param {Vector2} position
   * @param {Any} value
   */
  updateAt({ y, x }, value) {
    this[this.width * y + x] = value;
  }

  /**
   * Is the position in the bounds of this 2d array?
   * @param {Vector2} position
   */
  inBounds({ y, x }) {
    return y >= 0 && y < this.height && x >= 0 && x < this.width;
  }

  /**
   * Returns an iterator which loops over the flat 2d array.
   * @param {FlatArray} arr
   * @returns {Iterator<[Any, Vector2]>} A new iterator that yields [element, position] pairs for each element of the 2d array.
   */
  /* eslint-disable func-style */
  elements2d = function* () {
    for (let i = 0; i < this.length; i++) {
      yield [this[i], this.indexToPosition(i)];
    }
  };

  /**
   * Returns a string representation of this flat array.
   * @param {(string, Vector2) => string} renderFn - optional function used to render elements.
   */
  toString(renderFn) {
    const rows = [...Array(this.height)].map(() => []);
    for (const [item, position] of this.elements2d()) {
      rows[position.y].push(renderFn ? renderFn(item, position) : item);
    }
    return rows.map((row) => row.join("")).join("\n");
  }

  /**
   * Converts the *flat* index into a 2d coordinate.
   */
  indexToPosition(index) {
    return new Vector2(Math.floor(index / this.width), index % this.width);
  }

  /**
   * Converts the 2d coordinate into a *flat* index.
   */
  positionToIndex({ x, y }) {
    return this.width * y + x;
  }
}
