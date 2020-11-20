beforeEach(() => {
  jest.useRealTimers();
});

it(`uses dynalite and modern timers`, () => {
  jest.useFakeTimers(`modern`);
  const timeout = new Promise((resolve) => setTimeout(resolve, 5000));
  jest.advanceTimersByTime(5000);
  return timeout;
});
it(`uses dynalite and legacy timers`, () => {
  jest.useFakeTimers();
  const timeout = new Promise((resolve) => setTimeout(resolve, 5000));
  jest.advanceTimersByTime(5000);
  return timeout;
});

it(`doesnt use dynalite`, () => {
  jest.useFakeTimers(`modern`);
  const timeout = new Promise((resolve) => setTimeout(resolve, 5000));
  jest.advanceTimersByTime(5000);
  return timeout;
});
