import { modulo, randomAround } from "./numberUtils";

describe("modulo", () => {
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

  it("returns NaN for zero divider", () => {
    expect(modulo(5, 0)).toBeNaN();
  });
});

describe("randomAround", () => {
  it("bounds the random number in the given positive range", () => {
    const randomValue = randomAround(0, 5);

    expect(randomValue).toBeGreaterThanOrEqual(-5);
    expect(randomValue).toBeLessThanOrEqual(5);
  });

  it("bounds the random number in the given negative range", () => {
    const randomValue = randomAround(0, -5);

    expect(randomValue).toBeGreaterThanOrEqual(-5);
    expect(randomValue).toBeLessThanOrEqual(5);
  });

  it("returns the given number for range zero", () => {
    expect(randomAround(5, 0)).toBe(5);
  });
});
