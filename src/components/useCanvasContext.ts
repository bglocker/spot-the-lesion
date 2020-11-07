import { useCallback, useState } from "react";

/**
 * Custom hook for accessing a canvas's context
 *
 * @return Canvas rendering context and callback ref for setting it
 */
const useCanvasContext: () => readonly [
  CanvasRenderingContext2D,
  (canvas: HTMLCanvasElement) => void
] = () => {
  /* State won't ever be called while null, as it is set on render with the callback ref */
  const [context, setContext] = useState<CanvasRenderingContext2D>(null!);

  /* Callback ref for setting canvas context */
  const ref = useCallback((canvas) => {
    /* Called with null on component unmount */
    if (canvas !== null) {
      setContext(canvas.getContext("2d")!);
    }
  }, []);

  return [context, ref] as const;
};

export default useCanvasContext;
