beforeEach(() => {
  jest.useRealTimers();
});

it(`handles modern fake timers`, () => {
  jest.useFakeTimers(`modern`);
  const timeout = new Promise((resolve) => setTimeout(resolve, 5000));
  jest.advanceTimersByTime(5000);
  return timeout;
});
it(`still handles legacy fake timers`, () => {
  jest.useFakeTimers();
  const timeout = new Promise((resolve) => setTimeout(resolve, 5000));
  jest.advanceTimersByTime(5000);
  return timeout;
});

it(`handles switching back to modern timers`, () => {
  jest.useFakeTimers(`modern`);
  const timeout = new Promise((resolve) => setTimeout(resolve, 5000));
  jest.advanceTimersByTime(5000);
  return timeout;
});
