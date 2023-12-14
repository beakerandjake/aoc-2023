import { Vector2 } from "./vector2.js";

/**
 * A *flattened* two dimensional array. Items are mapped in C memory order.
 */
export class FlatArray extends Array {
  /**
   * Creates a new flat array.
   * @param {Any[]} items - The flattened items (in c memory order).
   * @param {number} height - The number of rows in the 2d array.
   * @param {number} width - The number of columns in the 2d array.
   */
  constructor(items, height, width) {
    super(...items);
    this.height = height;
    this.width = width;
  }

  /**
   * Creates a flat array from an array of string.
   * Each string in the array is considered a row, and each character of that string is treated as a column.
   * @param {string[]} items - Array of equal length strings to convert to a flat 2d array.
   */
  static fromStringArray(array) {
    if (!array?.length) {
      throw new Error("Cannot construct a FlatArray from an empty array");
    }
    return new FlatArray(
      array.flatMap((str) => [...str]),
      array.length,
      array[0].length
    );
  }

  /**
   * Returns a new flat 2d array filled with the value. Note all elements in the array will be this exact value: if value is an object, each slot in the array will reference that object.
   * @param {number} height
   * @param {number} width
   * @param {Any} value
   */
  static fill(height, width, value) {
    return new FlatArray(Array(width * height).fill(value), height, width);
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
  /**
   * Returns the element at the position.
   * @param {Vector2} position
   */
  elementAt(position) {
    return this[this.positionToIndex(position)];
  }

  /**
   * Updates the element at the position
   * @param {Vector2} position
   * @param {Any} value
   */
  updateAt(position, value) {
    this[this.positionToIndex(position)] = value;
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
  *elements2d() {
    for (let i = 0; i < this.length; i++) {
      yield [this[i], this.indexToPosition(i)];
    }
  }

  /**
   * Returns a string representation of this flat array.
   * @param {(string, Vector2) => string} renderFn - optional function used to render elements.
   */
  toString(renderFn = (elem) => elem) {
    const rows = [...Array(this.height)].map(() => []);
    for (const [item, position] of this.elements2d()) {
      rows[position.y].push(renderFn(item, position));
    }
    return rows.map((row) => row.join("")).join("\n");
  }
}
