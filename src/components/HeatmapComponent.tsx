import React, { useEffect, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import h337 from "heatmap.js";
import { db } from "../firebase/firebaseApp";
import DbUtils from "../utils/DbUtils";

const useStyles = makeStyles(() =>
  createStyles({
    heatmapContainer: {
      height: "80vw",
      width: "80vw",
      maxWidth: "90vh",
      maxHeight: "90vh",
      margin: "auto",
    },
  })
);

interface HeatmapParams {
  currentImageId: number;
}

const Heatmap: React.FC<HeatmapParams> = ({ currentImageId }: HeatmapParams) => {
  const classes = useStyles();

  const [dataPoints, setDataPoints] = useState<{ x: number; y: number; value: number }[]>([]);

  const [getClicks, setGetClicks] = useState<boolean>(false);

  // TODO: Refactor duplicate function in Game.tsx and here
  const getImagePath = (fileNumber: number) =>
    `${process.env.PUBLIC_URL}/content/images/${fileNumber}.png`;

  const getClickedPoints = async (imageId: number) => {
    const docNameForImage = `image_${imageId}`;
    const snapshot = await db.collection(DbUtils.IMAGES).doc(docNameForImage).get();
    const data = snapshot.data();
    if (data === undefined) {
      return;
    }
    const clicks: { x: number; y: number; value: number }[] = [];
    for (let i = 0; i < data.clicks.length; i++) {
      clicks.push({ x: data.clicks[i].x, y: data.clicks[i].y, value: data.clicks[i].clickCount });
    }
    setDataPoints(clicks);
  };

  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);

  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  });

  const [heatmapInstance, setHeatmapInstance] = useState<h337>(null!);

  useEffect(() => {
    const div = document.getElementById("heatmapContainer");

    if (heatmapInstance === null) {
      setHeatmapInstance(
        h337.create({
          container: div,
        })
      );
      return;
    }

    if (!getClicks) {
      getClickedPoints(currentImageId);
      setGetClicks(true);
    }
    // heatmap data format
    const data = {
      max: 1,
      data: dataPoints.map((point) => {
        return {
          x: Math.floor((point.x * div!.offsetWidth) / 100),
          y: Math.floor((point.y * div!.offsetHeight) / 100),
          value: point.value,
        };
      }),
    };
    heatmapInstance.setData(data);
  }, [dataPoints, heatmapInstance, height, width]);

  return (
    <div className={classes.heatmapContainer} id="heatmapContainer">
      <img
        className={classes.heatmapContainer}
        src={getImagePath(currentImageId)}
        alt={getImagePath(currentImageId)}
      />
    </div>
  );
};

export default Heatmap;
