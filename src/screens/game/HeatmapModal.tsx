import React from "react";
import { Modal } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import HeatmapDisplay from "../../components/HeatmapDisplay";

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },
    toolbarOffset: {
      minHeight: 48,
    },
    heatmapContainer: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  })
);

const HeatmapModal: React.FC<HeatmapModalProps> = ({
  open,
  fileId,
  imageUrl,
}: HeatmapModalProps) => {
  const classes = useStyles();

  return (
    <Modal open={open}>
      <div className={classes.container}>
        <div className={classes.toolbarOffset} />

        <div className={classes.heatmapContainer}>
          <HeatmapDisplay imageUrl={imageUrl} imageId={fileId} />
        </div>
      </div>
    </Modal>
  );
};

export default HeatmapModal;
