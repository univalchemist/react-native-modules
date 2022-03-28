Object.defineProperty(window, "matchMedia", {
  value: () => {
    return {
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  },
});
