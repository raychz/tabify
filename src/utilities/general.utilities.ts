// Stateless helper functions

/**
 * Convenience function that sets a timeout for `t` milliseconds.
 * @param t 
 */
export const sleep = async (t: number) => new Promise(r => setTimeout(r, t));

/**
 * Abbreviates a user's name. Ex: `abbreviateName('Raymond Chavez')` => `'Raymond C.'`
 * @param name 
 */
export const abbreviateName = (name: string) => {
  // get rid of multiple spaces. Then split using single space
  const nameSplit: string[] = name
    .trim()
    .replace(/\s\s+/g, ' ')
    .split(' ');
  const firstName = nameSplit.shift();
  const rest = nameSplit.map(v => `${v[0].toUpperCase()}.`).join('');
  return `${firstName} ${rest}`;
};

/**
 * Returns an 's' if count !== 1
 * @param count
 */
export const plurality = (count: number) => {
  return count !== 1 ? 's' : '';
}

/**
 * Creates an object composed of keys generated from the results of running each element of the collection through iteratee. Example:
 * - `console.log(keyBy([{ id: 'a1', title: 'abc' }, { id: 'b2', title: 'def' }], 'id')`
 * - output: `{ a1: { id: 'a1', title: 'abc' }, b2: { id: 'b2', title: 'def' } }`
 */
export const keyBy = (array: any[], key: string) => (array || []).reduce((r, x) => ({ ...r, [key ? resolveByString(key, x) : x]: x }), {});

/**
 * Access nested objects with string key
 */
export const resolveByString = (path: string, obj: any, separator = '.') => {
  const properties = path.split(separator);
  return properties.reduce((prev, curr) => prev && prev[curr], obj);
}