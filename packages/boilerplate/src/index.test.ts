import { sum } from ".";

describe("boilerplate", () => {
  it("should return 10 as a sum for numbers: 1, 2, 3, 4", () => {
    expect(sum(1, 2, 3, 4)).toBe(10);
  });
});
