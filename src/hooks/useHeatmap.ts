import { RefObject, useEffect, useState } from "react";
import h337 from "heatmap.js";
import constants from "../res/constants";

/**
 * Custom hook for drawing a Heatmap over a canvas
 *
 * @param show       If true, the heatmap is shown
 * @param loadData   Function to load heatmap data
 * @param container  Ref to the container element to draw the heatmap in
 * @param className  Canvas className
 */
const useHeatmap = (
  show: boolean,
  loadData: (any) => void,
  container: RefObject<HTMLDivElement>,
  className: string
): void => {
  const [heatmapInstance, setHeatmapInstance] = useState<h337>(null!);

  /* Initialize a heatmap instance */
  useEffect(() => {
    if (container.current === null) {
      return;
    }

    /* Initialize heatmap instance */
    const instance = h337.create({
      container: container.current,
      valueField: "clickCount",
      width: constants.canvasSize,
      height: constants.canvasSize,
    });

    // eslint-disable-next-line no-underscore-dangle
    const { canvas }: { canvas: HTMLCanvasElement } = instance._renderer;

    /* Replace default style with Game canvas style */
    canvas.removeAttribute("style");
    canvas.className = className;

    setHeatmapInstance(instance);
  }, [className, container]);

  /* Load data on the heatmap instance */
  useEffect(() => {
    if (heatmapInstance === null) {
      return;
    }

    // eslint-disable-next-line no-underscore-dangle
    const { canvas }: { canvas: HTMLCanvasElement } = heatmapInstance._renderer;

    if (show) {
      /* Show heatmap and load data */
      canvas.style.display = "";

      loadData(heatmapInstance);
    } else {
      /* Hide heatmap */
      canvas.style.display = "none";

      heatmapInstance.setData({ min: 0, max: 1, data: [] });
    }
  }, [heatmapInstance, loadData, show]);
};

export default useHeatmap;
