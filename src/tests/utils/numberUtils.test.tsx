import { modulo, randomAround } from "../../utils/numberUtils";

test("modulo works for positive dividend and divider", () => {
  expect(modulo(1, 2)).toBe(1);
  expect(modulo(6, 3)).toBe(0);
  expect(modulo(5, 3)).toBe(2);
});

test("modulo works for positive dividend and negative divider", () => {
  expect(modulo(1, -2)).toBe(-1);
  expect(modulo(6, -3)).toBe(-0);
  expect(modulo(5, -3)).toBe(-1);
});

test("modulo works for negative dividend and positive divider", () => {
  expect(modulo(-1, 2)).toBe(1);
  expect(modulo(-6, 3)).toBe(0);
  expect(modulo(-5, 3)).toBe(1);
});

test("random around gives a number in a range given a start point", () => {
  expect(randomAround(1, 2)).toBeGreaterThanOrEqual(-1);
  expect(randomAround(1, 2)).toBeLessThanOrEqual(3);
});
