import { useEffect, useRef } from "react";

/**
 * Custom hook for intervals
 *
 * @param callback Function to be called in interval
 * @param delay    How often to call the function, or null to pause the interval
 */
const useInterval = (callback: () => void, delay: number | null): void => {
  const savedCallback = useRef<() => void>();

  /* Update callback to catch state changes */
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  /* Trigger or pause the interval */
  useEffect(() => {
    const tick = () => {
      if (savedCallback.current !== undefined) {
        savedCallback.current();
      }
    };

    if (delay !== null) {
      const id = window.setInterval(tick, delay);
      return () => clearInterval(id);
    }

    return () => {};
  }, [delay]);
};

export default useInterval;
