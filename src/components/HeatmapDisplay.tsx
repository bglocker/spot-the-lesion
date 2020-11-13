import React, { useCallback, useEffect, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import h337 from "heatmap.js";
import { db } from "../firebase/firebaseApp";
import DbUtils from "../utils/DbUtils";

const useStyles = makeStyles(() =>
  createStyles({
    image: {
      height: "80vw",
      width: "80vw",
      maxWidth: "90vh",
      maxHeight: "90vh",
    },
  })
);

interface ImageData {
  clicks: { clickCount: number; x: number; y: number }[];
  correctClicks: number;
  hintCount: number;
  wrongClicks: number;
}

const HeatmapDisplay: React.FC<HeatmapProps> = ({ imageId, imageUrl }: HeatmapProps) => {
  const classes = useStyles();

  const [heatmapContainer, setHeatmapContainer] = useState<HTMLDivElement | null>(null);
  const [heatmapInstance, setHeatmapInstance] = useState<h337>(null!);
  const [resize, setResize] = useState(false);

  const heatmapContainerRef = useCallback((div) => {
    if (div !== null) {
      setHeatmapContainer(div);
    }
  }, []);

  /* Track window resizing */
  useEffect(() => {
    const onResize = () => setResize(true);

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const getClicks = async () => {
      const docName = `image_${imageId}`;

      /* TODO: error handling */
      const snapshot = await db.collection(DbUtils.IMAGES).doc(docName).get();
      const data = snapshot.data();

      if (data === undefined) {
        /* TODO: error handling */
        return [];
      }

      return (data as ImageData).clicks.map(({ x, y, clickCount }) => ({
        x,
        y,
        value: clickCount,
      }));
    };

    if (heatmapContainer === null) {
      return;
    }

    /* Clear previous heatmap before redrawing due to resize */
    if (heatmapInstance !== null && resize) {
      // eslint-disable-next-line no-underscore-dangle
      const { canvas } = heatmapInstance._renderer;

      canvas.remove();
      setHeatmapInstance(null);
      setResize(false);
    }

    /* Create heatmap instance and draw clicks */
    if (heatmapInstance === null) {
      const instance = h337.create({ container: heatmapContainer });

      setHeatmapInstance(instance);

      getClicks().then((clicks) => {
        instance.setData({
          max: 1,
          data: clicks.map(({ x, y, value }) => ({
            x: Math.floor((x * heatmapContainer.offsetWidth) / 100),
            y: Math.floor((y * heatmapContainer.offsetHeight) / 100),
            value,
          })),
        });
      });
    }
  }, [heatmapContainer, heatmapInstance, imageId, resize]);

  return (
    <div ref={heatmapContainerRef}>
      <img className={classes.image} src={imageUrl} alt="Heatmap" />
    </div>
  );
};

export default HeatmapDisplay;
