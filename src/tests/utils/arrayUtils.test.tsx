import { partition, range, shuffledRange } from "../../utils/arrayUtils";

describe("Partition", () => {
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

describe("Range", () => {
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

  it("does not work for negative step size or 0", () => {
    expect(() => {
      range(1, 6, 0);
    }).toThrowError();
    expect(() => {
      range(1, 6, -2);
    }).toThrowError();
  });
});

/**
 * Checks a shuffled array, whether its elements belong to an array of the specified range
 *
 * @param array The shuffled array that needs to be checked
 * @param start First value of range (inclusive)
 * @param stop  Last value of range (exclusive)
 * @param step  Step between consecutive range values
 *
 * @return If the shuffled array is valid, by definition
 */
const checkShuffledRange = (array: number[], start: number, stop: number, step: number): boolean =>
  arraysEqual(
    range(start, stop, step),
    array.sort((a, b) => (a > b ? 1 : -1))
  );

/**
 * Compare two arrays to make sure they have the same elements in the same order
 *
 * @param a First array
 * @param b Second array
 *
 * @return If they are equal or not
 */
const arraysEqual = (a: number[], b: number[]): boolean => {
  if (a === b) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};

describe("ShuffleRange", () => {
  it("works for positive start, stop and step", () => {
    let start = 1;
    let stop = 2;
    let step = 1;
    expect(checkShuffledRange(shuffledRange(start, stop, step), start, stop, step)).toBe(true);
    start = 0;
    stop = 3;
    step = 1;
    expect(checkShuffledRange(shuffledRange(start, stop, step), start, stop, step)).toBe(true);
  });
});
