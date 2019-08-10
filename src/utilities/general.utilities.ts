// Stateless helper functions

export const sleep = async (t: number) => new Promise(r => setTimeout(r, t));

export const abbreviateName = (name: string) => {
  const nameSplit: string[] = name.split(' ');
  const firstName = nameSplit.shift();
  const rest = nameSplit.map(v => `${v[0].toUpperCase()}.`).join('');
  return `${firstName} ${rest}`;
};
