/**
 * Returns the keys value or the default value if the key is not present
 * @param {Map} map
 * @param {Any} key
 * @param {Any} defaultValue
 * @returns {Any} The value of the item with the key if exists, or default value if not present.
 */
export const valueOrDefault = (map, key, defaultValue) =>
  map.has(key) ? map.get(key) : defaultValue;
