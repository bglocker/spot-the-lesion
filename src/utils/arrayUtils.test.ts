import { partition, range, shuffledRange } from "./arrayUtils";

describe("partition", () => {
  it("works for simple predicate functions", () => {
    expect(partition([1, 2, 3, 4], () => true)).toStrictEqual([[1, 2, 3, 4], []]);
    expect(partition([1, 2, 3, 4], () => false)).toStrictEqual([[], [1, 2, 3, 4]]);
  });

  it("works for more complex predicate functions", () => {
    expect(partition([1, 2, 3, 4], (x) => x % 2 === 0)).toStrictEqual([
      [2, 4],
      [1, 3],
    ]);
    expect(partition([1, 2, 3, 4], (x) => x <= 2)).toStrictEqual([
      [1, 2],
      [3, 4],
    ]);
    expect(partition([-1, -2, 3, 4], (x) => x <= 2)).toStrictEqual([
      [-1, -2],
      [3, 4],
    ]);
  });

  it("maintains the order of the elements", () => {
    expect(partition([3, 2, 1, 4], (x) => x % 2 === 0)).toStrictEqual([
      [2, 4],
      [3, 1],
    ]);
    expect(partition([4, -2, 3, -1], (x) => x <= 2)).toStrictEqual([
      [-2, -1],
      [4, 3],
    ]);
  });
});

describe("range", () => {
  it("works for positive start, stop and step", () => {
    expect(range(1, 2, 1)).toStrictEqual([1]);
    expect(range(1, 3, 1)).toStrictEqual([1, 2]);
    expect(range(0, 3, 1)).toStrictEqual([0, 1, 2]);
  });

  it("works for negative start, stop, but positive step", () => {
    expect(range(-2, -1, 1)).toStrictEqual([-2]);
    expect(range(-3, -1, 1)).toStrictEqual([-3, -2]);
  });

  it("works for negative start, positive stop and positive step", () => {
    expect(range(-2, 1, 1)).toStrictEqual([-2, -1, 0]);
    expect(range(-1, 2, 1)).toStrictEqual([-1, 0, 1]);
  });

  it("works for multiple step sizes", () => {
    expect(range(1, 6, 2)).toStrictEqual([1, 3, 5]);
    expect(range(1, 16, 5)).toStrictEqual([1, 6, 11]);
  });

  it("includes start, excludes stop value", () => {
    const arr = range(0, 10, 2);

    expect(arr).toContain(0);
    expect(arr).not.toContain(10);
  });

  it("throws error for stop lesser than or equal to start", () => {
    expect(() => range(0, 0, 5)).toThrow();
    expect(() => range(5, -2, 5)).toThrow();
  });

  it("throws error for non positive step", () => {
    expect(() => range(1, 6, 0)).toThrow();
    expect(() => range(1, 6, -2)).toThrow();
  });
});

describe("shuffledRange", () => {
  it("is a permutation of a range", () => {
    expect(shuffledRange(0, 10, 2).sort()).toStrictEqual([0, 2, 4, 6, 8]);
  });

  it("includes start, excludes stop value", () => {
    const arr = shuffledRange(0, 10, 2);

    expect(arr).toContain(0);
    expect(arr).not.toContain(10);
  });

  it("throws error for stop lesser than or equal to start", () => {
    expect(() => shuffledRange(0, 0, 5)).toThrow();
    expect(() => shuffledRange(5, -2, 5)).toThrow();
  });

  it("throws error for non positive step", () => {
    expect(() => shuffledRange(0, 5, 0)).toThrow();
    expect(() => shuffledRange(0, 5, -4)).toThrow();
  });
});
