import { useState } from "react";

/**
 * Custom hook for creating a generator from a given array
 * If the array is empty, it will always return -1
 *
 * @param array Array of numbers out of which to create a generator
 *
 * @return Array value generator function
 */
const useArrayGenerator = (array: number[]): (() => number) => {
  const [ix, setIx] = useState(0);

  return () => {
    if (array.length === 0) {
      return -1;
    }

    const number = array[ix];

    setIx((prevState) => (prevState === array.length - 1 ? 0 : prevState + 1));

    return number;
  };
};

export default useArrayGenerator;
