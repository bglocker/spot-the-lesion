import { useState } from "react";
import { range } from "../screens/game/GameUitls";

/**
 * Custom hook for creating a unique random generator
 *
 * @param max Maximum random value (exclusive)
 *
 * @return Unique random generator function
 */
const useUniqueRandomGenerator = (max: number): (() => number) => {
  const [nums] = useState(() => range(0, max));
  const [ix, setIx] = useState(max - 1);

  return () => {
    if (ix === 0) {
      /* TODO: handle case when all values have been visited  */
      setIx(max - 1);
    }

    const randomIx = Math.floor(Math.random() * (ix + 1));

    const randomNum = nums[randomIx];

    nums[randomIx] = nums[ix];

    nums[ix] = randomNum;

    setIx((prevState) => prevState - 1);

    return randomNum;
  };
};

export default useUniqueRandomGenerator;
