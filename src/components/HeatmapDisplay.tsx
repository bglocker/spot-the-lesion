import React, { useCallback, useEffect, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import h337 from "heatmap.js";
import { getImagePath } from "../screens/game/GameUitls";
import { db } from "../firebase/firebaseApp";
import DbUtils from "../utils/DbUtils";

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      margin: "auto",
    },
    image: {
      height: "80vw",
      width: "80vw",
      maxWidth: "90vh",
      maxHeight: "90vh",
    },
  })
);

const HeatmapDisplay: React.FC<HeatmapProps> = ({ imageId }: HeatmapProps) => {
  const classes = useStyles();

  const [heatmapContainer, setHeatmapContainer] = useState<HTMLDivElement | null>(null);
  const heatmapContainerRef = useCallback((div) => {
    if (div !== null) {
      setHeatmapContainer(div);
    }
  }, []);

  const getClickedPoints = useCallback(async () => {
    const docName = `image_${imageId}`;
    const snapshot = await db.collection(DbUtils.IMAGES).doc(docName).get();
    const data = snapshot.data();

    if (data === undefined) {
      return [];
    }

    const clicks: { x: number; y: number; value: number }[] = [];

    for (let i = 0; i < data.clicks.length; i++) {
      clicks.push({ x: data.clicks[i].x, y: data.clicks[i].y, value: data.clicks[i].clickCount });
    }

    return clicks;
  }, [imageId]);

  const [heatmapInstance, setHeatmapInstance] = useState<h337>(null!);
  const [resize, setResize] = useState(false);

  const resizeHandler = useCallback(() => {
    window.removeEventListener("resize", resizeHandler);
    setResize(true);
  }, []);

  useEffect(() => {
    if (heatmapContainer === null) {
      return;
    }

    if (resize) {
      // eslint-disable-next-line no-underscore-dangle
      const { canvas } = heatmapInstance._renderer;
      canvas.remove();
      setHeatmapInstance(null);

      setResize(false);
    }

    if (heatmapInstance === null) {
      setHeatmapInstance(
        h337.create({
          container: heatmapContainer,
        })
      );
      return;
    }

    getClickedPoints().then((clicks) => {
      const heatmapData = {
        max: 1,
        data: clicks.map((click) => {
          return {
            x: Math.floor((click.x * heatmapContainer!.offsetWidth) / 100),
            y: Math.floor((click.y * heatmapContainer!.offsetHeight) / 100),
            value: click.value,
          };
        }),
      };

      heatmapInstance.setData(heatmapData);
      window.addEventListener("resize", resizeHandler);
    });
  }, [getClickedPoints, heatmapContainer, heatmapInstance, resize, resizeHandler]);

  return (
    <div className={classes.container} ref={heatmapContainerRef}>
      <img className={classes.image} src={getImagePath(imageId)} alt="Heatmap" />
    </div>
  );
};

export default HeatmapDisplay;
