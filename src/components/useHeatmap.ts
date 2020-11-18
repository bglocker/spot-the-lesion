import { RefObject, useEffect, useState } from "react";
import h337 from "heatmap.js";
import { useSnackbar } from "notistack";
import { db } from "../firebase/firebaseApp";
import { toCanvasScale } from "../utils/canvasUtils";
import logUncaughtError from "../utils/errorUtils";
import { isFirestoreError, logFirestoreError } from "../utils/firebaseUtils";
import constants from "../res/constants";

/**
 * Custom hook for drawing a Heatmap over a canvas
 *
 * @param show       If true, the heatmap is shown
 * @param setLoading Function to update the loading state of the heatmap
 * @param container  Ref to the container element to draw the heatmap in
 * @param fileId     Id of the file for which to retrieve values from database
 * @param className  Canvas className
 */
const useHeatmap = (
  show: boolean,
  setLoading: (boolean) => void,
  container: RefObject<HTMLDivElement>,
  fileId: number,
  className: string
): void => {
  const [heatmapInstance, setHeatmapInstance] = useState<h337>(null!);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getClicks = async () => {
      const docName = `image_${fileId}`;

      const imageDoc = await db.collection(constants.images).doc(docName).get();

      const imageData = imageDoc.data();

      if (imageData === undefined) {
        return [];
      }

      return (imageData as FirestoreImageData).clicks;
    };

    if (container.current === null) {
      return;
    }

    /* Remove heatmap when not showing */
    if (heatmapInstance !== null && !show) {
      // eslint-disable-next-line no-underscore-dangle
      const { ctx } = heatmapInstance._renderer;

      ctx.canvas.remove();

      setHeatmapInstance(null);
    }

    /* Draw heatmap when showing */
    if (heatmapInstance === null && show) {
      const instance = h337.create({
        container: container.current,
        valueField: "clickCount",
      });

      // eslint-disable-next-line no-underscore-dangle
      const { ctx } = instance._renderer;

      /* Replace default style with Game canvas style */
      ctx.canvas.removeAttribute("style");
      ctx.canvas.className = className;

      setHeatmapInstance(instance);

      getClicks()
        .then((clicks) => {
          const heatmapData = {
            min: 0,
            max: 1,
            data: clicks.map(({ x, y, clickCount }) => ({
              x: toCanvasScale(ctx, x),
              y: toCanvasScale(ctx, y),
              clickCount,
            })),
          };

          instance.setData(heatmapData);
        })
        .catch((error) => {
          if (isFirestoreError(error)) {
            logFirestoreError(error);

            /* Check if error occurred because of the client's internet connection */
            if (error.code === "unavailable") {
              enqueueSnackbar(
                "Please check your internet connection and try again.",
                constants.errorSnackbarOptions
              );

              return;
            }
          } else {
            logUncaughtError("getClicks", error);
          }

          enqueueSnackbar("Please try again.", constants.errorSnackbarOptions);
        })
        .finally(() => setLoading(false));
    }
  }, [className, container, enqueueSnackbar, heatmapInstance, fileId, show, setLoading]);
};

export default useHeatmap;
