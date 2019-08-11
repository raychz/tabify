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
  const nameSplit: string[] = name.split(' ');
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