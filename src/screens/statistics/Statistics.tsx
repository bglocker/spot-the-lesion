import React from "react";
import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { KeyboardBackspace } from "@material-ui/icons";
import { CanvasJSChart } from "canvasjs-react-charts";

const useStyles = makeStyles(() =>
  createStyles({
    backButton: {
      marginRight: 8,
    },
    container: {
      height: "100%",
    },
  })
);

const getOptions = (title: string, aiLabel: string, humanLabel: string) => {
  return {
    animationEnabled: true,
    exportEnabled: true,
    backgroundColor: "#66A5AD",
    title: {
      text: title,
      fontColor: "white",
    },
    data: [
      {
        type: "pie",
        indexLabel: "{label}: {y}%",
        startAngle: -90,
        dataPoints: [
          {
            y: 80,
            label: aiLabel,
          },
          {
            y: 20,
            label: humanLabel,
          },
        ],
      },
    ],
  };
};

const Statistics: React.FC<StatisticsProps> = ({ setRoute }: StatisticsProps) => {
  const classes = useStyles();
  const options = getOptions("Human vs AI", "AI Victories", "Human Victories");

  return (
    <>
      <AppBar position="sticky">
        <Toolbar variant="dense">
          <IconButton
            className={classes.backButton}
            edge="start"
            color="inherit"
            aria-label="Back"
            onClick={() => setRoute("home")}
          >
            <KeyboardBackspace />
          </IconButton>

          <Typography>Spot the Lesion</Typography>
        </Toolbar>
      </AppBar>

      <div className={classes.container}>
        <CanvasJSChart options={options} />{" "}
      </div>
    </>
  );
};

export default Statistics;
