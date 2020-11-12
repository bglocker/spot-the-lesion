import { useState } from "react";
import { range } from "../screens/game/GameUtils";

/**
 * Custom hook for creating a unique random generator
 *
 * When all unique values have been generated, restart with the same range
 *
 * @param min Minimum random value (inclusive)
 * @param max Maximum random value (exclusive)
 *
 * @return Unique random generator function
 */
const useUniqueRandomGenerator = (min = 0, max: number): (() => number) => {
  const [nums] = useState(() => range(min, max));
  const [ix, setIx] = useState(max - min - 1);

  return () => {
    const randomIx = Math.floor(Math.random() * (ix + 1));

    const randomNum = nums[randomIx];

    nums[randomIx] = nums[ix];

    nums[ix] = randomNum;

    setIx((prevState) => (prevState > 0 ? prevState - 1 : max - min - 1));

    return randomNum;
  };
};

export default useUniqueRandomGenerator;
