export const isPromise = <R>(p: unknown | Promise<R>): p is Promise<R> =>
  p && Object.prototype.toString.call(p) === "[object Promise]";

export const isFunction = <F>(f: unknown | (() => F)): f is () => F =>
  f && typeof f === "function";
