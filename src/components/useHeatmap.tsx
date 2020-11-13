import { RefObject, useEffect, useState } from "react";
import h337 from "heatmap.js";
import { db } from "../firebase/firebaseApp";
import DbUtils from "../utils/DbUtils";

interface ImageData {
  clicks: { clickCount: number; x: number; y: number }[];
  correctClicks: number;
  hintCount: number;
  wrongClicks: number;
}

/**
 * Custom hook for drawing a Heatmap over a canvas
 *
 * @param show      If true, the heatmap is shown
 * @param container Ref to the container element to draw the heatmap in
 * @param fileId    Id of the file for which to retrieve values from database
 * @param className Canvas className
 */
const useHeatmap = (
  show: boolean,
  container: RefObject<HTMLDivElement>,
  fileId: number,
  className: string
): void => {
  const [heatmapInstance, setHeatmapInstance] = useState<h337>(null!);

  useEffect(() => {
    const getClicks = async () => {
      const docName = `image_${fileId}`;

      /* TODO: error handling */
      const snapshot = await db.collection(DbUtils.IMAGES).doc(docName).get();
      const data = snapshot.data();

      if (data === undefined) {
        /* TODO: error handling */
        return [];
      }

      return (data as ImageData).clicks;
    };

    if (container.current === null) {
      return;
    }

    /* Remove heatmap when not showing */
    if (heatmapInstance !== null && !show) {
      // eslint-disable-next-line no-underscore-dangle
      const { canvas } = heatmapInstance._renderer;

      canvas.remove();
      setHeatmapInstance(null);
    }

    /* Draw heatmap when showing */
    if (heatmapInstance === null && show) {
      const instance = h337.create({
        container: container.current,
        valueField: "clickCount",
      });

      setHeatmapInstance(instance);

      // eslint-disable-next-line no-underscore-dangle
      const { canvas } = instance._renderer;

      /* Remove default canvas styles from heatmap library */
      canvas.removeAttribute("style");

      /* Set canvas style */
      canvas.className = className;

      getClicks().then((clicks) => {
        instance.setData({
          min: 0,
          max: 1,
          data: clicks.map(({ x, y, clickCount }) => ({
            x: Math.floor((x * canvas.width) / 100),
            y: Math.floor((y * canvas.height) / 100),
            clickCount,
          })),
        });
      });
    }
  }, [className, container, heatmapInstance, fileId, show]);
};

export default useHeatmap;
