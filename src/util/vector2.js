/**
 * Representation of 2d vectors and points.
 */
export class Vector2 {
  constructor(y, x) {
    this.y = y;
    this.x = x;
  }

  hash() {
    return `${this.y} ${this.x}`;
  }

  toString() {
    return `<${this.y},${this.x}>`;
  }
}

/**
 * Combine the two vectors.
 * @param {Vector2} lhs
 * @param {Vector2} rhs
 */
export const add = (lhs, rhs) => new Vector2(lhs.y + rhs.y, lhs.x + rhs.x);

/**
 * Shorthand for writing Vector2(-1, 0).
 */
export const up = new Vector2(-1, 0);

/**
 * Shorthand for writing Vector2(1, 0).
 */
export const down = new Vector2(1, 0);

/**
 * Shorthand for writing Vector2(0, 1).
 */
export const right = new Vector2(0, 1);

/**
 * Shorthand for writing Vector2(0, -1).
 */
export const left = new Vector2(0, -1);
