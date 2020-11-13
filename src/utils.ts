export const isPromise = <R>(p: unknown | Promise<R>): p is Promise<R> =>
  p && Object.prototype.toString.call(p) === "[object Promise]";

export const isFunction = <F>(f: unknown | (() => F)): f is () => F =>
  f && typeof f === "function";

interface Omit {
  <T extends object, K extends [...(keyof T)[]]>(obj: T, ...keys: K): {
    [K2 in Exclude<keyof T, K[number]>]: T[K2];
  };
}

const convertToNumbers = (
  keys: Array<string | number | symbol>,
  value: string | number
): number | string => {
  if (!Number.isNaN(Number(value)) && keys.some(v => v === Number(value))) {
    return Number(value);
  }

  return value;
};

// credit: https://stackoverflow.com/a/62362002/1741602
export const omit = <T, K extends [...(keyof T)[]]>(
  obj: T,
  ...keys: K
): { [P in Exclude<keyof T, K[number]>]: T[P] } => {
  return (Object.getOwnPropertySymbols(obj) as Array<keyof T>)
    .concat(
      Object.keys(obj).map(key => convertToNumbers(keys, key)) as Array<keyof T>
    )
    .filter(key => !keys.includes(key))
    .reduce((agg, key) => ({ ...agg, [key]: obj[key] }), {}) as {
    [P in Exclude<keyof T, K[number]>]: T[P];
  };
};
