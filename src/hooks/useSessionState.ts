import { Dispatch, SetStateAction, useEffect, useState } from "react";

/**
 * Custom hook for creating stateful variable saved in the browser's sessionStorage
 *
 * @param defaultValue Default value for the state variable
 * @param key          Key for saving/accessing the state variable in sessionStorage
 *
 * @return State variable value and setter
 */
const useSessionState = <T>(
  defaultValue: T,
  key: string
): readonly [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    const sessionValue = sessionStorage.getItem(key) || "";

    try {
      return JSON.parse(sessionValue);
    } catch (_error) {
      return defaultValue;
    }
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useSessionState;
