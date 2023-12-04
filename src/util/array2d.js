/**
 * @typedef {Object} Shape
 * @property {Number} width - The width of the 2d array.
 * @property {Number} height - The height of the 2d array.
 */

/**
 * @typedef {Object} FlatArray
 * @property {Array} items - A one dimensional flattened array representing a 2d array in row-major order
 * @property {Shape} shape - An object containing the dimensions of the 2d array.
 */

/**
 * Convert an array of strings into a flat 2d array.
 * Each string in the array is considered a row, and each character of that string is treated as a column.
 * @param {String[]} array - Array of equal length strings to convert to a flat 2d array.
 * @param {(char:String, y:Number, x:Number) => String} characterMapFn - Map function invoked on every char of the string
 * @returns {FlatArray}
 */
export const arr2d = (array, mapFn = (char, y, x) => char) => {
  if (!array.length) {
    return { items: [], shape: { width: 0, height: 0 } };
  }
  const height = array.length;
  const width = array[0].length;
  const items = array.reduce((acc, row, y) => {
    if (row.length !== width) {
      throw new Error("each string must have consistent length!");
    }
    const mapped = [...row].map((char, x) => mapFn(char, y, x));
    acc.push(...mapped);
    return acc;
  }, []);
  return { items, shape: { width, height } };
};

/**
 * Converts the world (x,y) coordinate to a flat 2d index.
 * @param {Shape} shape - The shape of the flat 2d array.
 * @param {Number} y - The y (row).
 * @param {Number} x - The x (col).
 */
export const index2d = ({ width }, y, x) => width * y + x;

/**
 * Converts the flat 2d index to a world (x,y) coordinate.
 * @param {Shape} shape - The shape of the flat 2d array.
 * @param {Number} index - The flat 2d index to convert.
 */
export const world2d = ({ width }, index) => ({
  y: Math.floor(index / width),
  x: index % width,
});

/**
 * Returns the element at the <y,x> coordinate of the flat 2d array.
 * @param {FlatArray} arr2d
 * @param {Number} y
 * @param {Number} x
 */
export const elementAt2d = (arr2d, y, x) =>
  arr2d.items[index2d(arr2d.shape, y, x)];

/**
 * Executes the callback function once per array element.
 * @param {FlatArray} arr2d
 * @param {(element:any, y:Number, x:Number) => boolean} callbackFn - Function invoked for every element of the array. Can explicitly return false to stop evaluation.
 */
export const arr2dForEach = (arr2d, callbackFn) => {
  for (let index = 0; index < arr2d.items.length; index++) {
    const { y, x } = world2d(arr2d.shape, index);
    const result = callbackFn(arr2d.items[index], y, x);
    if (result === false) {
      break;
    }
  }
};

/**
 * Returns true if the <x,y> point is in bounds of the flat array.
 * @param {Shape} shape
 * @param {Number} y
 * @param {Number} x
 *  */
export const inBounds = ({ width, height }, y, x) =>
  x >= 0 && x < width && y >= 0 && y < height;

/**
 * Invokes the callback function on each neighboring cell (in bounds).
 */
const neighborsForEach = (arr2d, y, x, directions, callbackFn) => {
  for (const [dy, dx] of directions) {
    const ny = dy + y;
    const nx = dx + x;
    if (inBounds(arr2d.shape, ny, nx)) {
      callbackFn(elementAt2d(arr2d, ny, nx), ny, nx);
    }
  }
};

/**
 * Returns an array containing all neighbor cells (in bounds)
 */
const neighbors2d = (arr2d, y, x, directions) => {
  const toReturn = [];
  neighborsForEach(arr2d, y, x, directions, (neighbor) => {
    toReturn.push(neighbor);
  });
  return toReturn;
};

/**
 * Deltas for the Von Neumann neighborhood of a cell.
 */
const vonNeumannDeltas = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

/**
 * Returns an array containing the Von Neumann neighborhood of the cell.
 * @param {FlatArray} arr2d
 * @param {Number} y
 * @param {Number} x
 */
export const vonNeumannNeighbors = (arr2d, y, x) =>
  neighbors2d(arr2d, y, x, vonNeumannDeltas);

/**
 * Invokes the callback function on each in bounds neighbor of the Von Neumann neighborhood of the cell.
 * @param {FlatArray} arr2d
 * @param {Number} y
 * @param {Number} x
 * @param {(element:any, y:Number, x:Number) => void} callbackFn
 */
export const vonNeumannNeighborsForEach = (arr2d, y, x, callbackFn) =>
  neighborsForEach(arr2d, y, x, vonNeumannDeltas, callbackFn);

/**
 * Deltas for the Moore neighborhood of a cell.
 */
const mooreDeltas = [
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
];

/**
 * Returns an array containing the Moore neighborhood of the cell.
 * @param {FlatArray} arr2d
 * @param {Number} y
 * @param {Number} x
 */
export const mooreNeighbors = (arr2d, y, x) =>
  neighbors2d(arr2d, y, x, mooreDeltas);

/**
 * Invokes the callback function on each in bounds neighbor of the Moore neighborhood of the cell.
 * @param {FlatArray} arr2d
 * @param {Number} y
 * @param {Number} x
 * @param {(element:any, y:Number, x:Number) => void} callbackFn
 */
export const mooreNeighborsForEach = (arr2d, y, x, callbackFn) =>
  neighborsForEach(arr2d, y, x, mooreDeltas, callbackFn);

/**
 * Returns a string visualizing the flattened 2d array.
 * @param {FlatArray} arr2d - A flat 2d array.
 * @param {(element:any,y:number,x:number) => string} renderFn - Function invoked on each element in the array, returns the string to use to render this element.
 */
export const arr2dToStr = (arr2d, renderFn = (item, y, x) => item) => {
  const rows = [...Array(arr2d.shape.height)].map(() => []);
  arr2dForEach(arr2d, (element, y, x) => {
    rows[y].push(renderFn(element, y, x));
  });
  return rows.map((row) => row.join("")).join("\n");
};
