import React, { useMemo } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { ResponsivePie } from "@nivo/pie";
import { partition } from "../../utils/arrayUtils";
import colors from "../../res/colors";

const useStyles = makeStyles(
  createStyles({
    pieContainer: {
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
  imageData,
}: ImageStatsDialogProps) => {
  const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));

  const classes = useStyles();

  const [nonZeroData, zeroData] = useMemo(() => {
    const data = [
      {
        id: "Correct Answers",
        label: "Correct Answers",
        value: imageData.correctClicks,
        color: colors.pieImageCorrectAnswers,
      },
      {
        id: "Wrong Answers",
        label: "Wrong Answers",
        value: imageData.wrongClicks,
        color: colors.pieImageWrongAnswers,
      },
      {
        id: "Hints",
        label: "Total Hints",
        value: imageData.hintCount,
        color: colors.pieImageHints,
      },
    ];

    return partition(data, (x) => x.value !== 0);
  }, [imageData]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Image Statistics</DialogTitle>

      <DialogContent>
        <div className={classes.pieContainer} hidden={nonZeroData.length === 0}>
          <ResponsivePie
            data={nonZeroData}
            startAngle={-180}
            cornerRadius={3}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            colors={{ datum: "data.color" }}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 1]] }}
            enableRadialLabels={false}
            sliceLabel="value"
            legends={[
              {
                anchor: "bottom",
                direction: smallScreen ? "column" : "row",
                justify: false,
                translateY: 70,
                itemWidth: 75,
                itemHeight: 18,
                itemsSpacing: smallScreen ? 5 : 75,
                itemTextColor: colors.legendText,
                symbolSize: 18,
                symbolShape: "circle",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: colors.legendTextHover,
                    },
                  },
                ],
              },
            ]}
          />
        </div>

        {zeroData.map(({ id, value }) => {
          if (value !== 0) {
            return null;
          }

          return (
            <Typography key={id} className={classes.zeroValueText}>
              {`There are no ${id} registered for this image!`}
            </Typography>
          );
        })}
      </DialogContent>

      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageStatsDialog;
