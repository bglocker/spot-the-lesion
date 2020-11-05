import React, { useState } from "react";
import { AppBar, Card, Grid, IconButton, Tab, Tabs, Toolbar, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { KeyboardBackspace } from "@material-ui/icons";
import { ResponsivePie } from "@nivo/pie";
import { db } from "../../firebase/firebaseApp";
import DbUtils from "../../utils/DbUtils";

const useStyles = makeStyles(() =>
  createStyles({
    backButton: {
      marginRight: 8,
    },
    card: {
      width: "90%",
      height: "80vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 24,
    },
    container: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    gameTypeAppBar: {
      alignItems: "center",
      backgroundColor: "#003B46",
    },
    tab: {
      fontSize: "1.5rem",
    },
    tabIndicator: {
      backgroundColor: "#C4DFE6",
    },
    gameModeSelectionText: {
      fontSize: "150%",
      fontWeight: "bold",
    },
    statTitle: {
      fontWeight: "bold",
      margin: "inherit",
    },
  })
);

const Statistics: React.FC<StatisticsProps> = ({ setRoute }: StatisticsProps) => {
  const classes = useStyles();

  /**
   * Retrieves the data from the database to display into the pie-chart and graph
   */
  const [aiWins, setAiWins] = useState(0);
  const [humanWins, setHumanWins] = useState(0);
  const [draws, setDraws] = useState(0);

  /**
   * Index for the current Statistics page
   * Casual Mode - index 0; Competitive Mode - index 1
   */
  const [currentStatsIndex, setCurrentStatsIndex] = useState(0);

  /**
   * Hook used for prompting the user to select the game mode
   */
  const [gameModeSelected, setGameModeSelected] = useState(false);

  /**
   * Function used for retrieving the statistics for the current game mode
   * @param statsIndex - the index of the game mode for which the stats are retrieved
   *                   - 0 for Casual, 1 for Competitive
   */
  const retrieveStatistics = async (statsIndex: number) => {
    const leaderboard =
      statsIndex === 0 ? DbUtils.LEADERBOARD_CASUAL : DbUtils.LEADERBOARD_COMPETITIVE;
    const snapshot = await db.collection(leaderboard).get();
    let noOfHumanWins = 0;
    let noOfAiWins = 0;
    let noOfDraws = 0;

    snapshot.forEach((doc) => {
      const playerScore = doc.data().score;
      const aiScore = statsIndex === 0 ? doc.data().correct_ai_answers : doc.data().ai_score;
      if (playerScore > aiScore) {
        noOfHumanWins += 1;
      } else if (aiScore > playerScore) {
        noOfAiWins += 1;
      } else {
        noOfDraws += 1;
      }
    });

    setHumanWins(noOfHumanWins);
    setAiWins(noOfAiWins);
    setDraws(noOfDraws);
  };

  /**
   * Function for triggering the re-render of the statistics according to the new stats index
   * @param newStatisticsIndex
   */
  const onGameTabChange = async (newStatisticsIndex: number) => {
    setCurrentStatsIndex(newStatisticsIndex);
    setGameModeSelected(true);
    await retrieveStatistics(newStatisticsIndex);
  };

  /**
   * Function for displaying the Statistics for Casual or Competitive Game Mode
   * If game mode not selected yet, prompt the user to do so
   * Otherwise, show corresponding stats
   */
  const displayStats = () => {
    if (!gameModeSelected) {
      return (
        <Grid container justify="center">
          <Typography className={classes.gameModeSelectionText}>SELECT A GAME MODE</Typography>
        </Grid>
      );
    }
    return (
      <div className={classes.container}>
        <Card className={classes.card}>
          <Typography className={classes.statTitle}>Human vs AI</Typography>
          <ResponsivePie
            data={[
              {
                id: "AI Wins",
                label: "AI Wins",
                value: aiWins,
                color: "hsl(332, 70%, 50%)",
              },
              {
                id: "Human Wins",
                label: "Human Wins",
                value: humanWins,
                color: "hsl(194, 70%, 50%)",
              },
              {
                id: "Draws",
                label: "Draws",
                value: draws,
                color: "hsl(124, 43%, 81%)",
              },
            ]}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            colors={{ scheme: "red_blue" }}
            borderWidth={5}
            borderColor={{ theme: "background" }}
            enableRadialLabels={false}
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
                  id: "Human Wins",
                },
                id: "dots",
              },
              {
                match: {
                  id: "AI Wins",
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
        </Card>
      </div>
    );
  };

  /**
   * Main return from the Statistics Functional Component
   */
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

      <AppBar className={classes.gameTypeAppBar} position="sticky">
        <Tabs
          value={!gameModeSelected ? gameModeSelected : currentStatsIndex}
          onChange={(_, newStatisticsIndex) => onGameTabChange(newStatisticsIndex)}
          aria-label="Gametypes"
          classes={{ indicator: classes.tabIndicator }}
        >
          <Tab
            className={classes.tab}
            label="Casual"
            id="gametype-0"
            aria-controls="gametype-view-0"
          />

          <Tab
            className={classes.tab}
            label="Competitive"
            id="gametype-1"
            aria-controls="gametype-view-1"
          />
        </Tabs>
      </AppBar>
      {displayStats()}
    </>
  );
};

export default Statistics;
