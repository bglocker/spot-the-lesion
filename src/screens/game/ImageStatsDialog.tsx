import React from "react";
import {
  Button,
  Card,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import { ResponsivePie } from "@nivo/pie";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(
  createStyles({
    imageStatsCard: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 24,
      padding: 8,
      width: "50%",
      height: "60vh",
    },
    statTitle: {
      fontWeight: "bold",
      margin: "inherit",
    },
  })
);

const ImageStatsDialog: React.FC<ImageStatsDialogProps> = ({
  open,
  data,
  onClose,
}: ImageStatsDialogProps) => {
  const classes = useStyles();

  const onCloseDialog = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={onCloseDialog}>
      <DialogTitle>Image Statistics</DialogTitle>

      <DialogContent>
        <DialogContentText>
          To submit your score, please enter your username here.
        </DialogContentText>
        <Card className={classes.imageStatsCard}>
          <Typography className={classes.statTitle}>Statistics for this Image</Typography>
          <ResponsivePie
            data={data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            startAngle={-180}
            padAngle={0.7}
            cornerRadius={3}
            colors={{ scheme: "nivo" }}
            borderWidth={9}
            borderColor={{ from: "color", modifiers: [["darker", 0.3]] }}
            radialLabelsSkipAngle={10}
            radialLabelsTextColor="#333333"
            radialLabelsLinkHorizontalLength={36}
            radialLabelsLinkColor={{ from: "color" }}
            defs={[
              {
                id: "dots",
                type: "patternDots",
                background: "inherit",
                color: "rgba(255, 255, 255, 0.3)",
                size: 4,
                padding: 1,
                stagger: true,
              },
              {
                id: "lines",
                type: "patternLines",
                background: "inherit",
                color: "rgba(255, 255, 255, 0.3)",
                rotation: -45,
                lineWidth: 6,
                spacing: 10,
              },
            ]}
            fill={[
              {
                match: {
                  id: "ruby",
                },
                id: "dots",
              },
              {
                match: {
                  id: "c",
                },
                id: "dots",
              },
              {
                match: {
                  id: "go",
                },
                id: "dots",
              },
              {
                match: {
                  id: "python",
                },
                id: "dots",
              },
              {
                match: {
                  id: "scala",
                },
                id: "lines",
              },
              {
                match: {
                  id: "lisp",
                },
                id: "lines",
              },
              {
                match: {
                  id: "elixir",
                },
                id: "lines",
              },
              {
                match: {
                  id: "javascript",
                },
                id: "lines",
              },
            ]}
            legends={[
              {
                anchor: "bottom",
                direction: "row",
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 100,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: "#999",
                itemDirection: "left-to-right",
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: "circle",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#000",
                    },
                  },
                ],
              },
            ]}
          />
        </Card>
      </DialogContent>

      <DialogActions>
        <Button color="primary" onClick={onCloseDialog}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageStatsDialog;
