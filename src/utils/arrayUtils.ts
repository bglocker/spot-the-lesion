/**
 * Given an array, partitions it into two complementary arrays based on a predicate function
 *
 * @param xs        Array of elements
 * @param predicate Predicate function to partition the array on
 *
 * @return A pair of two arrays, the first being the values for which the predicate returned true,
 *         and the latter the values for which it returned false
 */
const partition = <T>(xs: T[], predicate: (value: T) => boolean): [T[], T[]] =>
  xs.reduce(
    (acc, x) => {
      acc[predicate(x) ? 0 : 1].push(x);

      return acc;
    },
    [[], []] as [T[], T[]]
  );

/**
 * Create an array from a given range
 *
 * @param start First value of range (inclusive)
 * @param stop  Last value of range (exclusive)
 * @param step  Strictly positive step between consecutive range values
 *
 * @return Array range
 */
const range = (start = 1, stop: number, step = 1): number[] => {
  if (step <= 0) {
    throw new Error("Step size must be strictly positive (>= 0)");
  }
  const nums: number[] = [];

  for (let i = start; i < stop; i += step) {
    nums.push(i);
  }

  return nums;
};

/**
 * Create a (randomly) shuffled array from a given range
 *
 * @param start First value of range (inclusive)
 * @param stop  Last value of range (exclusive)
 * @param step  Step between consecutive range values
 *
 * @return Shuffled array range
 */
const shuffledRange = (start = 1, stop: number, step = 1): number[] => {
  const nums: number[] = [];

  for (let i = 0; i < (stop - start) / step; i++) {
    const j = Math.floor(Math.random() * (i + 1));

    if (j !== i) {
      nums.push(nums[j]);
    }

    nums[j] = start + i * step;
  }

  return nums;
};

export { partition, range, shuffledRange };
