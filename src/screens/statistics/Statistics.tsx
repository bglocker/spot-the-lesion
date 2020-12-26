import React, { useState } from "react";
import {
  AppBar,
  Button,
  ButtonGroup,
  Card,
  Grid,
  Slide,
  SlideProps,
  Tab,
  Tabs,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { ArrowBack, ArrowForward } from "@material-ui/icons";
import firebase from "firebase/app";
import { Pie } from "@nivo/pie";
import { NavigationAppBar } from "../../components";
import DbUtils from "../../utils/DbUtils";
import useWindowDimensions from "../../components/useWindowDimensions";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    basicCard: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 24,
      padding: 8,
    },
    userStatsCard: {
      width: "90%",
      height: "80vh",
    },
    imageStatsCard: {
      width: "50%",
      height: "60vh",
    },
    imageStatsContainer: {
      marginTop: "5%",
    },
    container: {
      width: "65%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      alignSelf: "center",
      marginTop: 8,
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
      textAlign: "center",
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
    image: {
      gridColumnStart: 1,
      gridRowStart: 1,
    },
    imageContainer: {
      [theme.breakpoints.up("md")]: {
        height: "100%",
        flex: 1,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      },
    },
    imageCard: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      alignContent: "center",
      margin: 24,
      padding: 8,
      [theme.breakpoints.down("sm")]: {
        width: "80vw",
        maxWidth: "60vh",
      },
      [theme.breakpoints.up("md")]: {
        minWidth: "20vw",
      },
    },
  })
);

/**
 * New type representing the direction of Legends in the Pie Chart
 * To be used for the 'direction' prop of the Pie component
 */
type Direction = "row" | "column";

const Statistics: React.FC = () => {
  const classes = useStyles();

  /**
   * Retrieves the data from the database to display into the pie-chart and graph
   */
  const [aiWins, setAiWins] = useState(0);
  const [humanWins, setHumanWins] = useState(0);
  const [draws, setDraws] = useState(0);

  /**
   * Hooks used for Player Stats
   */
  const [playersWithHints, setPlayerWithHints] = useState(0);
  const [playersWithoutHints, setPlayersWithoutHints] = useState(0);

  /**
   * Index for the current Statistics page
   * Casual Mode - index 0; Competitive Mode - index 1
   */
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  /**
   * Hook used for prompting the user to select the game mode
   */
  const [tabSelected, setTabSelected] = useState(false);

  /**
   * Hooks used for slide show transitions between game stats
   */
  const [slideIn, setSlideIn] = useState(true);
  const [slideDirection, setSlideDirection] = useState<SlideProps["direction"]>("down");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  /**
   * Media Queries for Window width and height
   */
  const screenWidthMatches = useMediaQuery("(min-width:600px)");
  const screenHeightMatches = useMediaQuery("(min-height:750px)");

  /**
   * Hook for obtaining the Device Window Dimensions
   */
  const { windowWidth, windowHeight } = useWindowDimensions();

  const numSlides = 2;
  /**
   * Function used for retrieving the statistics for the current game mode
   * @param gameModeIndex - the index of the game mode for which the stats are retrieved
   *                      - 0 for Casual, 1 for Competitive
   * @param statsIndex - the index of the specific Stats page to display
   *                   - 0 for 'Human vs AI wins'
   *                   - 1 for 'How many players used hints'
   */
  const retrieveUserStats = async (gameModeIndex: number, statsIndex: number) => {
    const leaderboard =
      gameModeIndex === 0 ? DbUtils.LEADERBOARD_CASUAL : DbUtils.LEADERBOARD_COMPETITIVE;

    const snapshot = await firebase.firestore().collection(leaderboard).get();

    if (statsIndex === 0) {
      // Statistics: Human vs AI wins
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
      // Statistics: How many players used hints
      let withHints = 0;
      snapshot.forEach((doc) => {
        withHints += doc.data().usedHints ? 1 : 0;
      });
      setPlayerWithHints(withHints);
      setPlayersWithoutHints(snapshot.size - withHints);
    }
  };

  /**
   * Function for triggering the re-render of the statistics according to the new stats index
   * @param newTabIndex - index of the Game mode for which to retrieve stats
   *                      - 0 for Casual, 1 for Competitive
   */
  const onTabChange = async (newTabIndex: number) => {
    setCurrentTabIndex(newTabIndex);
    setTabSelected(true);

    await retrieveUserStats(newTabIndex, currentSlideIndex);
  };

  /**
   * Function for displaying the Player Statistics or Image Statistics
   * If game mode not selected yet, prompt the user to do so
   * Otherwise, show corresponding stats
   * @param statIndex - index of the specific stats page to display
   */
  const displayStats = (statIndex: number) => {
    if (!tabSelected) {
      return (
        <Grid container justify="center">
          <Typography className={classes.gameModeSelectionText}>SELECT A STATISTICS TAB</Typography>
        </Grid>
      );
    }
    return displayUserStats(statIndex);
  };

  /**
   * Function for displaying a single User Stats page (slide)
   * @param statsIndex - index of the stats page (slide) to display
   */
  const displayUserStats = (statsIndex: number) => {
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
      return <div className={classes.container}>{displayUserPieChart("Human vs AI", data)}</div>;
    }
    if (statsIndex === 1) {
      const data = [
        {
          id: "Hints",
          label: "Hints",
          value: playersWithHints,
          color: "hsl(194, 70%, 50%)",
        },
        {
          id: "No hints",
          label: "No hints",
          value: playersWithoutHints,
          color: "hsl(332, 70%, 50%)",
        },
      ];
      return (
        <div className={classes.container}>
          {displayUserPieChart("How many players used hints", data)}
        </div>
      );
    }
    return <div className={classes.emptyDiv} />;
  };

  /**
   * Function for scaling the pie chart according to device window size
   */
  const getPieChartOptions = (): {
    itemsSpacing: number;
    translateY: number;
    width: number;
    height: number;
    direction: Direction;
  } => {
    let translateY;
    let height;
    let width;
    let itemsSpacing;
    let direction;

    if (screenHeightMatches) {
      translateY = windowHeight * 0.03;
      height = windowHeight * 0.8;
    } else {
      translateY = windowHeight * 0.04;
      height = windowHeight * 0.7;
    }

    if (screenWidthMatches) {
      width = windowWidth * 0.7;
      itemsSpacing = 50;
      direction = "row";
    } else {
      width = windowWidth * 0.9;
      itemsSpacing = 6;
      direction = "column";
    }
    return { itemsSpacing, translateY, width, height, direction };
  };

  /**
   * Function for displaying a Pie Chart with statistics
   * @param title - Title of the stats page to be displayed
   * @param data - the user statistics to be displayed
   */
  const displayUserPieChart = (
    title: string,
    data: { id: string; label: string; value: number; color: string }[]
  ) => {
    return (
      <Card className={[classes.basicCard, classes.userStatsCard].join(" ")}>
        <Typography className={classes.statTitle}>{title}</Typography>
        <Pie
          data={data}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.4}
          padAngle={0.7}
          cornerRadius={3}
          colors={{ scheme: "red_blue" }}
          borderWidth={9}
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
          enableSliceLabels={false}
          height={getPieChartOptions().height}
          width={getPieChartOptions().width}
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
              direction: getPieChartOptions().direction,
              translateY: getPieChartOptions().translateY,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: "#999",
              symbolSize: 18,
              itemsSpacing: getPieChartOptions().itemsSpacing,
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
   * @param direction - "left" for prev slide, "right" for next
   */
  const onArrowClick = (direction: SlideProps["direction"]) => {
    const increment = direction === "left" ? -1 : 1;
    const newIndex = (currentSlideIndex + increment + numSlides) % numSlides;
    const oppDirection = direction === "left" ? "right" : "left";

    setSlideDirection(direction);
    setSlideIn(false);

    window.setTimeout(async () => {
      setCurrentSlideIndex(newIndex);
      setSlideDirection(oppDirection);
      setSlideIn(true);
      await retrieveUserStats(currentTabIndex, newIndex);
    }, 500);
  };

  /**
   * Function for displaying the slideshow buttons after the game mode was selected
   */
  const displaySlideShowButtons = () => {
    if (!tabSelected) {
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
      <NavigationAppBar showBack />

      <AppBar className={classes.gameTypeAppBar} position="sticky">
        <Tabs
          value={!tabSelected ? tabSelected : currentTabIndex}
          onChange={(_, newTabIndex) => onTabChange(newTabIndex)}
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
        {displayStats(currentSlideIndex)}
      </Slide>

      {displaySlideShowButtons()}
    </>
  );
};

export default Statistics;
