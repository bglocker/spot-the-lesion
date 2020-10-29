import React, { useState } from "react";
import { AppBar, CircularProgress, IconButton, Toolbar, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { KeyboardBackspace } from "@material-ui/icons";
import { ResponsivePie } from "@nivo/pie";
import { db } from "../../firebase/firebaseApp";

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

const Statistics: React.FC<StatisticsProps> = ({ setRoute }: StatisticsProps) => {
  const classes = useStyles();

  /**
   * Loading flag to enable waiting
   */
  const [loading, setLoading] = useState(true);

  /**
   * Retrieves the data from the databse to display into the pie-chart and graph
   */
  const retrieveStatistics = async () => {
    const snapshot = await db.collection("alltime-scores").get();
    console.log(snapshot);
    setLoading(false);
  };

  if (loading) {
    retrieveStatistics();
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

        <CircularProgress />
      </>
    );
  }

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
      <ResponsivePie
        data={[
          {
            id: "javascript",
            label: "javascript",
            value: 123,
            color: "hsl(332, 70%, 50%)",
          },
          {
            id: "haskell",
            label: "haskell",
            value: 123,
            color: "hsl(194, 70%, 50%)",
          },
          {
            id: "php",
            label: "php",
            value: 123,
            color: "hsl(184, 70%, 50%)",
          },
          {
            id: "sass",
            label: "sass",
            value: 123,
            color: "hsl(325, 70%, 50%)",
          },
          {
            id: "stylus",
            label: "stylus",
            value: 197,
            color: "hsl(14, 70%, 50%)",
          },
        ]}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ scheme: "red_blue" }}
        borderWidth={5}
        borderColor={{ theme: "background" }}
        radialLabelsSkipAngle={5}
        radialLabelsTextXOffset={12}
        radialLabelsTextColor="#333333"
        radialLabelsLinkOffset={0}
        radialLabelsLinkDiagonalLength={23}
        radialLabelsLinkHorizontalLength={32}
        radialLabelsLinkStrokeWidth={3}
        radialLabelsLinkColor={{ from: "color" }}
        enableSlicesLabels={false}
        slicesLabelsSkipAngle={10}
        slicesLabelsTextColor="#333333"
        motionStiffness={90}
        motionDamping={15}
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
            translateY: 56,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
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
      <ResponsivePie
        data={[
          {
            id: "javascript",
            label: "javascript",
            value: 123,
            color: "hsl(332, 70%, 50%)",
          },
          {
            id: "haskell",
            label: "haskell",
            value: 123,
            color: "hsl(194, 70%, 50%)",
          },
          {
            id: "php",
            label: "php",
            value: 123,
            color: "hsl(184, 70%, 50%)",
          },
          {
            id: "sass",
            label: "sass",
            value: 123,
            color: "hsl(325, 70%, 50%)",
          },
          {
            id: "stylus",
            label: "stylus",
            value: 197,
            color: "hsl(14, 70%, 50%)",
          },
        ]}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ scheme: "red_blue" }}
        borderWidth={5}
        borderColor={{ theme: "background" }}
        radialLabelsSkipAngle={5}
        radialLabelsTextXOffset={12}
        radialLabelsTextColor="#333333"
        radialLabelsLinkOffset={0}
        radialLabelsLinkDiagonalLength={23}
        radialLabelsLinkHorizontalLength={32}
        radialLabelsLinkStrokeWidth={3}
        radialLabelsLinkColor={{ from: "color" }}
        enableSlicesLabels={false}
        slicesLabelsSkipAngle={10}
        slicesLabelsTextColor="#333333"
        motionStiffness={90}
        motionDamping={15}
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
            translateY: 56,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
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
    </>
  );
};

export default Statistics;
