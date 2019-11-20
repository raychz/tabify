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