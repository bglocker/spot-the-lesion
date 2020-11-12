import React from "react";
import { Modal } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import HeatmapDisplay from "../../components/HeatmapDisplay";

const useStyles = makeStyles(() =>
  createStyles({
    /* Offset by toolbar height */
    offset: {
      minHeight: 48,
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
      <div>
        <div className={classes.offset} />

        <HeatmapDisplay imageUrl={imageUrl} imageId={fileId} />
      </div>
    </Modal>
  );
};

export default HeatmapModal;
