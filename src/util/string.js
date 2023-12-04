/**
 * Returns true if the string is composed only of [0-9] digit characters.
 * @param {string} str
 * @returns {boolean}
 */
export const isNumeric = (str) => /^\d+$/.test(str);

/**
 * Advances the index while each character of the string matches the match predicate.
 * Returns the index of the last match + 1.
 * @param {string} str
 * @param {number} start
 * @param {(string) => boolean} matchFn
 * @returns {number}
 */
export const consume = (str, start, matchFn) => {
  let i = start + 1;
  while (i < str.length && matchFn(str[i])) {
    i++;
  }
  return i;
};

/**
 * Splits the string on the delimiter and invokes the map function for each delimited substring.
 * @param {string} str
 * @param {string|Regexp} delimiter
 * @param {(string) => any} mapFn
 * @returns {array}
 */
export const parseDelimited = (str, delimiter, mapFn) =>
  str.split(delimiter).map(mapFn);
