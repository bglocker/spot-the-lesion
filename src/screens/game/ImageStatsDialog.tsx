import React from "react";
import {
  Button,
  Card,
  createStyles,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
  useMediaQuery,
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
      position: "relative",
      width: "100%",
      height: "60vh",
    },
    statTitle: {
      textAlign: "left",
    },
    message: {
      fontWeight: "bold",
      margin: "inherit",
    },
    dialog: {
      width: "100%",
      height: "100%",
      alignSelf: "center",
    },
  })
);

type Direction = "row" | "column";

const ImageStatsDialog: React.FC<ImageStatsDialogProps> = ({
  open,
  data,
  onClose,
}: ImageStatsDialogProps) => {
  const classes = useStyles();

  const screenWidthMatches = useMediaQuery("(min-width:600px)");
  const screenHeightMatches = useMediaQuery("(min-height:750px");

  const getPieChartOptions = (): {
    itemsSpacing: number;
    translateY: number;
    direction: Direction;
  } => {
    const yPos = screenHeightMatches ? 56 : 75;
    return screenWidthMatches
      ? { itemsSpacing: 100, translateY: yPos, direction: "row" }
      : { itemsSpacing: 6, translateY: yPos, direction: "column" };
  };
  /**
   * Handler function for closing the dialog box
   * Delegates the call to the onClose param
   */
  const onCloseDialog = () => {
    onClose();
  };

  /**
   * Function for displaying a message on the Dialog Box when a particular stat is 0
   */
  const displayMessagesForZeroValuedStats = () => {
    let message;
    const components: JSX.Element[] = [];
    data.forEach((stat) => {
      if (stat.value === 0) {
        message = `\nThere are no ${stat.id} registered for this image!`;
        components.push(<Typography className={classes.message}>{message}</Typography>);
      }
    });
    return components;
  };

  /**
   * Main return from the ImageStatsDialog function component
   */
  return (
    <Dialog className={classes.dialog} open={open} onClose={onCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography className={[classes.message, classes.statTitle].join(" ")}>
          Image Statistics
        </Typography>
      </DialogTitle>

      <Card className={classes.imageStatsCard}>
        <ResponsivePie
          data={data}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          startAngle={-180}
          padAngle={0.7}
          cornerRadius={3}
          colors={["hsl(150, 100%, 40%)", "hsl(0, 100%, 50%)", "hsl(60, 100%, 40%)"]}
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
      {displayMessagesForZeroValuedStats()}
      <DialogActions>
        <Button color="primary" onClick={onCloseDialog}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageStatsDialog;
