import { useState } from "react";
import { modulo } from "../utils/numberUtils";

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

  if (array.length === 0) {
    return () => -1;
  }

  return () => {
    const number = array[ix];

    setIx((prevState) => modulo(prevState + 1, array.length));

    return number;
  };
};

export default useArrayGenerator;
