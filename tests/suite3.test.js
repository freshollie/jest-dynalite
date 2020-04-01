jest.useFakeTimers();

it("should not be affected by fake timers", done => {
  setTimeout(() => done(), 5000);
  jest.runTimersToTime(5000);
});

it("should not turn off fake timers between tests", done => {
  setTimeout(() => done(), 5000);
  jest.runTimersToTime(5000);
});
