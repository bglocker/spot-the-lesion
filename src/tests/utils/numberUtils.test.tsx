import { modulo, randomAround } from "../../utils/numberUtils";

describe("Modulo", () => {
  it("calculates correctly for positive dividend and divider", () => {
    expect(modulo(1, 2)).toBe(1);
    expect(modulo(6, 3)).toBe(0);
    expect(modulo(5, 3)).toBe(2);
  });

  it("calculates correctly for positive dividend and negative divider", () => {
    expect(modulo(1, -2)).toBe(-1);
    expect(modulo(6, -3)).toBe(-0);
    expect(modulo(5, -3)).toBe(-1);
  });

  it("calculates correctly for negative dividend and positive divider", () => {
    expect(modulo(-1, 2)).toBe(1);
    expect(modulo(-6, 3)).toBe(0);
    expect(modulo(-5, 3)).toBe(1);
  });
});

describe("Random Around", () => {
  it("gives a number in a range given a start point", () => {
    expect(randomAround(1, 2)).toBeGreaterThanOrEqual(-1);
    expect(randomAround(1, 2)).toBeLessThanOrEqual(3);
  });
});
