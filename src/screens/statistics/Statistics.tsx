import React, { useState } from "react";
import { AppBar, Card, IconButton, Tab, Tabs, Toolbar, Typography } from "@material-ui/core";
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
  })
);

const Statistics: React.FC<StatisticsProps> = ({ setRoute }: StatisticsProps) => {
  const classes = useStyles();

  /**
   * Loading flag to enable waiting
   */
  // const [loading, setLoading] = useState(true);

  /**
   * Retrieves the data from the database to display into the pie-chart and graph
   */
  const [aiWins, setAiWins] = useState(0);
  const [humanWins, setHumanWins] = useState(0);

  const [currentLeaderboardIndex, setCurrentLeaderBoardIndex] = useState(0);
  const [firstTimeOpened, setFirstTimeOpened] = useState(true);

  const retrieveStatistics = async () => {
    const snapshot = await db.collection(DbUtils.LEADERBOARD).get();
    let noOfHumanWins = 0;
    let noOfAiWins = 0;

    snapshot.forEach((doc) => {
      if (doc.data().correct_player_answers > doc.data().correct_ai_answers) {
        noOfHumanWins += 1;
      } else {
        noOfAiWins += 1;
      }
    });

    setHumanWins(noOfHumanWins);
    setAiWins(noOfAiWins);

    // setLoading(false);
  };

  const onGameTabChange = async (newLeaderboardIndex: number) => {
    setCurrentLeaderBoardIndex(newLeaderboardIndex);
    setFirstTimeOpened(false);
    await retrieveStatistics();
  };

  const displayStats = () => {
    if (firstTimeOpened) {
      return null;
    }
    return (
      <div className={classes.container}>
        <Card className={classes.card}>
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

  // if (loading) {
  //   retrieveStatistics();
  //   return (
  //     <>
  //       <AppBar position="sticky">
  //         <Toolbar variant="dense">
  //           <IconButton
  //             className={classes.backButton}
  //             edge="start"
  //             color="inherit"
  //             aria-label="Back"
  //             onClick={() => setRoute("home")}
  //           >
  //             <KeyboardBackspace />
  //           </IconButton>
  //
  //           <Typography>Spot the Lesion</Typography>
  //         </Toolbar>
  //       </AppBar>
  //
  //       <CircularProgress />
  //     </>
  //   );
  // }

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
          value={currentLeaderboardIndex}
          onChange={(_, newLeaderboardIndex) => onGameTabChange(newLeaderboardIndex)}
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
