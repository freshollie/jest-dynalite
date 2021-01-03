export const isPromise = <R>(p: unknown | Promise<R>): p is Promise<R> =>
  !!p && Object.prototype.toString.call(p) === "[object Promise]";

export const isFunction = <F>(f: unknown | (() => F)): f is () => F =>
  !!f && typeof f === "function";

const convertToNumbers = (
  keys: Array<string | number | symbol>,
  value: string | number
): number | string => {
  if (!Number.isNaN(Number(value)) && keys.some((v) => v === Number(value))) {
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
      Object.keys(obj).map((key) => convertToNumbers(keys, key)) as Array<
        keyof T
      >
    )
    .filter((key) => !keys.includes(key))
    .reduce((agg, key) => ({ ...agg, [key]: obj[key] }), {}) as {
    [P in Exclude<keyof T, K[number]>]: T[P];
  };
};

const globalObj = (typeof window === "undefined" ? global : window) as {
  setTimeout: {
    _isMockFunction?: boolean;
    clock?: boolean;
  };
};

const detectTimers = (): { legacy: boolean; modern: boolean } => {
  const usingJestAndTimers =
    typeof jest !== "undefined" && typeof globalObj.setTimeout !== "undefined";
  const usingLegacyJestFakeTimers =
    usingJestAndTimers &&
    // eslint-disable-next-line no-underscore-dangle
    typeof globalObj.setTimeout._isMockFunction !== "undefined" &&
    // eslint-disable-next-line no-underscore-dangle
    globalObj.setTimeout._isMockFunction;

  let usingModernJestFakeTimers = false;
  if (
    usingJestAndTimers &&
    typeof globalObj.setTimeout.clock !== "undefined" &&
    typeof jest.getRealSystemTime !== "undefined"
  ) {
    try {
      // jest.getRealSystemTime is only supported for Jest's `modern` fake timers and otherwise throws
      jest.getRealSystemTime();
      usingModernJestFakeTimers = true;
    } catch {
      // not using Jest's modern fake timers
    }
  }

  return {
    legacy: usingLegacyJestFakeTimers,
    modern: usingModernJestFakeTimers,
  };
};

// stolen from https://github.com/testing-library/dom-testing-library/blob/master/src/helpers.js
export const runWithRealTimers = <T, R>(
  callback: () => T | Promise<R>
): T | Promise<R> => {
  const { modern, legacy } = detectTimers();

  const usingJestFakeTimers = modern || legacy;

  if (usingJestFakeTimers) {
    jest.useRealTimers();
  }

  const callbackReturnValue = callback();

  if (isPromise(callbackReturnValue)) {
    return callbackReturnValue.then((value) => {
      if (usingJestFakeTimers) {
        jest.useFakeTimers(modern ? "modern" : "legacy");
      }

      return value;
    });
  }

  if (usingJestFakeTimers) {
    jest.useFakeTimers(modern ? "modern" : "legacy");
  }

  return callbackReturnValue;
};

export const hasV3 = (): boolean => {
  try {
    // eslint-disable-next-line global-require
    require("@aws-sdk/client-dynamodb");
    return true;
  } catch (_) {
    return false;
  }
};

export const sleep = (time: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, time));
