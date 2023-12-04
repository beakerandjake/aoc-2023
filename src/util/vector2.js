/**
 * Representation of 2d vectors and points.
 */
export class Vector2 {
  constructor(y, x) {
    this.y = y;
    this.x = x;
  }

  toString() {
    return ` ${this.y} ${this.x}`;
  }
}

/**
 * Combine the two vectors.
 * @param {Vector2} lhs
 * @param {Vector2} rhs
 */
export const add = (lhs, rhs) => new Vector2(lhs.x + rhs.x, lhs.y + rhs.y);
