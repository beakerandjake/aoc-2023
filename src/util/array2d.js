/**
 * @typedef {Object} Shape
 * @property {number} width - The width of the 2d array.
 * @property {number} height - The height of the 2d array.
 */

/**
 * @typedef {Object} FlatArray
 * @property {Array} items - A one dimensional flattened array representing a 2d array in row-major order
 * @property {Shape} shape - An object containing the dimensions of the 2d array.
 */

/**
 * Convert an array of strings into a flat 2d array.
 * Each string in the array is considered a row, and each character of that string is treated as a column.
 * @param {string[]} array - Array of equal length strings to convert to a flat 2d array.
 * @param {(char:string, y:number, x:number) => string} mapFn - Map function invoked on every char of the string
 * @returns {FlatArray}
 */
export const arr2d = (array, mapFn = (char) => char) => {
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
 * @param {number} y - The y (row).
 * @param {number} x - The x (col).
 */
export const index2d = ({ width }, y, x) => width * y + x;

/**
 * Converts the flat 2d index to a world (x,y) coordinate.
 * @param {Shape} shape - The shape of the flat 2d array.
 * @param {number} index - The flat 2d index to convert.
 */
export const world2d = ({ width }, index) => ({
  y: Math.floor(index / width),
  x: index % width,
});

/**
 * Returns the element at the <y,x> coordinate of the flat 2d array.
 * @param {FlatArray} arr
 * @param {number} y
 * @param {number} x
 */
export const elementAt2d = (arr, y, x) => arr.items[index2d(arr.shape, y, x)];

/**
 * Executes the callback function once per array element.
 * @param {FlatArray} arr
 * @param {(element:any, y:number, x:number) => boolean} callbackFn - Function invoked for every element of the array. Can explicitly return false to stop evaluation.
 */
export const arr2dForEach = (arr, callbackFn) => {
  for (let index = 0; index < arr.items.length; index++) {
    const { y, x } = world2d(arr.shape, index);
    const result = callbackFn(arr.items[index], y, x);
    if (result === false) {
      break;
    }
  }
};

/**
 * Returns a string visualizing the flattened 2d array.
 * @param {FlatArray} arr - A flat 2d array.
 * @param {(element:any,y:number,x:number) => string} renderFn - Function invoked on each element in the array, returns the string to use to render this element.
 */
export const arr2dToStr = (arr, renderFn = (item) => item) => {
  const rows = [...Array(arr.shape.height)].map(() => []);
  arr2dForEach(arr, (element, y, x) => {
    rows[y].push(renderFn(element, y, x));
  });
  return rows.map((row) => row.join("")).join("\n");
};

/**
 * Returns a new flat 2d array filled with the value. Note all elements in the array will be this exact value: if value is an object, each slot in the array will reference that object.
 * @returns {FlatArray}
 * @param {number} y
 * @param {number} x
 */
export const fill2d = (height, width, value) => ({
  items: Array(height * width).fill(value),
  shape: { height, width },
});
