import { useState, useEffect } from "react";

/**
 * Function for wrapping up the Window Dimensions into a dictionary
 */
const getWindowDimensions = () => {
  return {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  };
};

/**
 * Custom Hook for getting the dimensions of the Device Window
 */
const useWindowDimensions = (): { windowWidth: number; windowHeight: number } => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    const resize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return windowDimensions;
};

export default useWindowDimensions;
