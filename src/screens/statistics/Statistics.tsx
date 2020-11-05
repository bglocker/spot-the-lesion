import React, { useEffect, useState } from "react";
import {
  AppBar,
  Button,
  ButtonGroup,
  Card,
  Grid,
  IconButton,
  Slide,
  SlideProps,
  Tab,
  Tabs,
  Theme,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { ArrowBack, ArrowForward, KeyboardBackspace } from "@material-ui/icons";
import { ResponsivePie } from "@nivo/pie";
import { db } from "../../firebase/firebaseApp";
import DbUtils from "../../utils/DbUtils";

const useStyles = makeStyles((theme: Theme) =>
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
      padding: 8,
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
    buttonGroup: {
      marginTop: 16,
      alignSelf: "center",
      padding: 8,
    },
    emptyDiv: {
      [theme.breakpoints.down("sm")]: {
        flex: 0,
      },
      [theme.breakpoints.up("md")]: {
        flex: 1,
      },
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

  const [totalHints, setTotalHints] = useState(0);
  const [totalWithoutHints, setTotalWithoutHints] = useState(0);

  /**
   * Index for the current Statistics page
   * Casual Mode - index 0; Competitive Mode - index 1
   */
  const [currentGameModeIndex, setCurrentGameModeIndex] = useState(0);

  /**
   * Hook used for prompting the user to select the game mode
   */
  const [gameModeSelected, setGameModeSelected] = useState(false);

  /**
   * Hooks used for slide show transitions between game stats
   */
  const [slideIn, setSlideIn] = useState(true);
  const [slideDirection, setSlideDirection] = useState<SlideProps["direction"]>("down");
  const [slideIndex, setSlideIndex] = useState(0);

  // Total number of Slides with User Statistics
  const numSlides = 2;

  /**
   * Function used for retrieving the statistics for the current game mode
   * @param gameModeIndex - the index of the game mode for which the stats are retrieved
   *                      - 0 for Casual, 1 for Competitive
   * @param statsIndex - the index of the specific Stats page to display
   */
  const retrieveStatistics = async (gameModeIndex: number, statsIndex: number) => {
    const leaderboard =
      gameModeIndex === 0 ? DbUtils.LEADERBOARD_CASUAL : DbUtils.LEADERBOARD_COMPETITIVE;
    const snapshot = await db.collection(leaderboard).get();

    if (statsIndex === 0) {
      let noOfHumanWins = 0;
      let noOfAiWins = 0;
      let noOfDraws = 0;

      snapshot.forEach((doc) => {
        const playerScore = doc.data().score;
        const aiScore = gameModeIndex === 0 ? doc.data().correct_ai_answers : doc.data().ai_score;
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
    } else if (statsIndex === 1) {
      let withHints = 0;
      snapshot.forEach((doc) => {
        withHints += doc.data().usedHints ? 1 : 0;
      });
      setTotalHints(withHints);
      setTotalWithoutHints(snapshot.size - withHints);
    }
  };

  /**
   * Function for triggering the re-render of the statistics according to the new stats index
   * @param gameModeIndex - index of the Game mode for which to retrieve stats
   *                      - 0 for Casual, 1 for Competitive
   * @param statsIndex - index of the next Stats page to display
   */
  const onGameTabChange = async (gameModeIndex: number, statsIndex: number) => {
    setCurrentGameModeIndex(gameModeIndex);
    setGameModeSelected(true);
    await retrieveStatistics(gameModeIndex, statsIndex);
  };

  /**
   * Function for displaying the Statistics for Casual or Competitive Game Mode
   * If game mode not selected yet, prompt the user to do so
   * Otherwise, show corresponding stats
   */
  const displayStats = (statsIndex: number) => {
    if (!gameModeSelected) {
      return (
        <Grid container justify="center">
          <Typography className={classes.gameModeSelectionText}>SELECT A GAME MODE</Typography>
        </Grid>
      );
    }
    return displayStatsPage(statsIndex);
  };

  const displayStatsPage = (statsIndex: number) => {
    if (statsIndex === 0) {
      const data = [
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
      ];
      return <div className={classes.container}>{displayPieChart("Human vs AI", data)}</div>;
    }
    if (statsIndex === 1) {
      const data = [
        {
          id: "Hints",
          label: "Hints",
          value: totalHints,
          color: "hsl(194, 70%, 50%)",
        },
        {
          id: "No hints",
          label: "No hints",
          value: totalWithoutHints,
          color: "hsl(332, 70%, 50%)",
        },
      ];
      return (
        <div className={classes.container}>
          {displayPieChart("How many players used hints", data)}
        </div>
      );
    }
    return <div className={classes.emptyDiv} />;
  };

  const displayPieChart = (
    title: string,
    data: { id: string; label: string; value: number; color: string }[]
  ) => {
    return (
      <Card className={classes.card}>
        <Typography className={classes.statTitle}>{title}</Typography>
        <ResponsivePie
          data={data}
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
    );
  };

  /**
   * Function for rendering the next slide with statistics
   */
  const onArrowClick = (direction: SlideProps["direction"]) => {
    const increment = direction === "left" ? -1 : 1;
    const newIndex = (slideIndex + increment + numSlides) % numSlides;
    const oppDirection = direction === "left" ? "right" : "left";

    setSlideDirection(direction);
    setSlideIn(false);

    window.setTimeout(() => {
      setSlideIndex(newIndex);
      setSlideDirection(oppDirection);
      setSlideIn(true);
    }, 500);
  };

  /**
   * useEffect hook for changing stats tabs with the arrow keys
   */
  useEffect(() => {
    const onKeyDown = (e: { keyCode: number }) => {
      if (e.keyCode === 37) {
        onArrowClick("left");
      }

      if (e.keyCode === 39) {
        onArrowClick("right");
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  });

  /**
   * Function for displaying the slideshow buttons after the game mode was selected
   */
  const displaySlideShowButtons = () => {
    if (!gameModeSelected) {
      return null;
    }
    return (
      <ButtonGroup size="large" className={classes.buttonGroup}>
        <Button color="primary" variant="contained" onClick={() => onArrowClick("left")}>
          <ArrowBack>Prev</ArrowBack>
        </Button>

        <Button color="primary" variant="contained" onClick={() => onArrowClick("right")}>
          <ArrowForward>Next</ArrowForward>
        </Button>
      </ButtonGroup>
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
          value={!gameModeSelected ? gameModeSelected : currentGameModeIndex}
          onChange={(_, newGameModeIndex) => onGameTabChange(newGameModeIndex, slideIndex)}
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
      <Slide in={slideIn} direction={slideDirection}>
        {displayStats(slideIndex)}
      </Slide>
      {displaySlideShowButtons()}
    </>
  );
};

export default Statistics;
