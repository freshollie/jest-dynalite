jest.useFakeTimers();

it("should not be affected by fake timers", () => {
  const timeout = new Promise((resolve) => setTimeout(resolve, 5000));
  jest.advanceTimersByTime(5000);
  return timeout;
});

it("should not turn off fake timers between tests", () => {
  const timeout = new Promise((resolve) => setTimeout(resolve, 5000));
  jest.advanceTimersByTime(5000);
  return timeout;
});
