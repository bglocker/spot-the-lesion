import React from "react";
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { ResponsivePie } from "@nivo/pie";
import { LegendDirection } from "@nivo/legends";

const useStyles = makeStyles(
  createStyles({
    container: {
      width: "100%",
      height: "60vh",
    },
    zeroValueText: {
      margin: 8,
      fontWeight: "bold",
    },
  })
);

const ImageStatsDialog: React.FC<ImageStatsDialogProps> = ({
  open,
  onClose,
  data,
}: ImageStatsDialogProps) => {
  const classes = useStyles();

  const mediumWidth = useMediaQuery("(min-width:600px)");
  const mediumHeight = useMediaQuery("(min-height:750px)");

  /**
   * Function for scaling the pie chart according to device window size
   */
  const getPieChartOptions = (): {
    itemsSpacing: number;
    translateY: number;
    direction: LegendDirection;
  } => {
    const yPos = mediumHeight ? 56 : 75;
    return mediumWidth
      ? { itemsSpacing: 100, translateY: yPos, direction: "row" }
      : { itemsSpacing: 6, translateY: yPos, direction: "column" };
  };

  const onCloseDialog = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={onCloseDialog} fullWidth maxWidth="sm">
      <DialogTitle>Image Statistics</DialogTitle>

      <Card className={classes.container}>
        <ResponsivePie
          data={data}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          startAngle={-180}
          padAngle={0.7}
          cornerRadius={3}
          colors={["hsl(150, 100%, 35%)", "hsl(0, 100%, 50%)", "hsl(48, 100%, 45%)"]}
          borderWidth={9}
          borderColor={{ from: "color", modifiers: [["darker", 2.5]] }}
          enableRadialLabels={false}
          sliceLabel="value"
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "rgba(255, 255, 255, 0.3)",
              size: 10,
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
          legends={[
            {
              anchor: "bottom",
              direction: getPieChartOptions().direction,
              justify: false,
              translateX: 0,
              translateY: getPieChartOptions().translateY,
              itemsSpacing: getPieChartOptions().itemsSpacing,
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

      {data.map((stat) => {
        if (stat.value === 0) {
          return (
            <Typography key={stat.id} className={classes.zeroValueText}>
              {`There are no ${stat.id} registered for this image!`}
            </Typography>
          );
        }

        return null;
      })}

      <DialogActions>
        <Button color="primary" onClick={onCloseDialog}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageStatsDialog;
