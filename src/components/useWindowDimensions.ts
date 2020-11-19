import { useState, useEffect } from "react";

const getWindowDimensions = () => {
  const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
  return {
    windowWidth,
    windowHeight,
  };
};

const useWindowDimensions = (): { windowWidth: number; windowHeight: number } => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};

export default useWindowDimensions;
