import React, { useState } from "react";
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
import { db, firebaseStorage } from "../../firebase/firebaseApp";
import DbUtils from "../../utils/DbUtils";
import { getImagePath } from "../../utils/GameUtils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backButton: {
      marginRight: 8,
    },
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

const Statistics: React.FC<StatisticsProps> = ({ setRoute }: StatisticsProps) => {
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
   * Hooks used for Per-Image Stats
   */
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [totalHints, setTotalHints] = useState(0);

  /**
   * Index for the current Statistics page
   * Casual Mode - index 0; Competitive Mode - index 1
   * Per-Image Stats - index 2
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
   * Hook for updating the URL of the image displayed as we go through the slideshow
   */
  const [imageUrl, setImageUrl] = useState("");

  let numSlides = 2;
  const MAX_IMAGE_SIZE = 500;
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

    const snapshot = await db.collection(leaderboard).get();

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
   * Function for retrieving image statistics from Firebase
   * @param imageIndex - index of the image for which we retrieve stats
   */
  const retrieveImageStats = async (imageIndex: number) => {
    const table = DbUtils.IMAGES;
    const docName = `image_${imageIndex}`;

    const imageDoc = await db.collection(table).doc(docName).get();
    if (imageDoc.exists) {
      setCorrectAnswers(imageDoc.data()!.correctClicks);
      setWrongAnswers(imageDoc.data()!.wrongClicks);
      setTotalHints(imageDoc.data()!.hintCount);
    }
  };

  /**
   * Function for triggering the re-render of the statistics according to the new stats index
   * @param newTabIndex - index of the Game mode for which to retrieve stats
   *                      - 0 for Casual, 1 for Competitive
   * @param newStatsIndex - index of the next Stats page to display
   */
  const onTabChange = async (newTabIndex: number, newStatsIndex: number) => {
    setCurrentTabIndex(newTabIndex);
    setTabSelected(true);
    if (newTabIndex === 2) {
      await retrieveImageStats(newStatsIndex);
      numSlides = 100;
    } else {
      await retrieveUserStats(newTabIndex, newStatsIndex);
      if (currentSlideIndex > 1) {
        numSlides = 2;
        setCurrentSlideIndex(currentSlideIndex % numSlides);
      }
    }
  };

  /**
   * Function for displaying the Player Statistics or Image Statistics
   * If game mode not selected yet, prompt the user to do so
   * Otherwise, show corresponding stats
   * @param tabIndex - index of the User/Image stats tab to display
   *                 - 0 for Casual Mode User Stats
   *                 - 1 for Competitive Mode User Stats
   *                 - 2 for Image Stats
   * @param statIndex - index of the specific stats page to display
   */
  const displayStats = (tabIndex: number, statIndex: number) => {
    if (!tabSelected) {
      return (
        <Grid container justify="center">
          <Typography className={classes.gameModeSelectionText}>SELECT A STATISTICS TAB</Typography>
        </Grid>
      );
    }
    return tabIndex !== 2 ? displayUserStats(statIndex) : displayPerImageStats(statIndex);
  };

  /**
   * Function for displaying Per-Image Stats
   * @param imageIndex - index of the image for which we display the stats
   */
  const displayPerImageStats = (imageIndex: number) => {
    numSlides = 100; // Total number of images in the DB
    loadImage(imageIndex).then(null);
    const data = [
      {
        id: "Correct Answers",
        label: "Correct Answers",
        value: correctAnswers,
        color: "hsl(332, 70%, 50%)",
      },
      {
        id: "Wrong Answers",
        label: "Wrong Answers",
        value: wrongAnswers,
        color: "hsl(194, 70%, 50%)",
      },
      {
        id: "Total Hints",
        label: "Total Hints",
        value: totalHints,
        color: "hsl(124, 43%, 81%)",
      },
    ];
    return (
      <div className={[classes.container, classes.imageStatsContainer].join(" ")}>
        {displayImage(imageIndex)}
        {displayImagePieChart(`Stats for Image: ${imageIndex}`, data)}
      </div>
    );
  };

  /**
   * Function for loading an image from the Firebase Storage
   * @param imageIndex - index of the image to be retrieved
   */
  const loadImage = async (imageIndex: number) => {
    const imageRef = firebaseStorage.ref(getImagePath(imageIndex));

    const url: string = await imageRef.getDownloadURL();

    setImageUrl(url);
  };

  /**
   * Function for displaying an image on an image container
   * @param imageIndex - index of the Image to be displayed
   */
  const displayImage = (imageIndex: number) => {
    return (
      <div className={classes.imageContainer}>
        <Card className={classes.imageCard}>
          <img
            src={imageUrl}
            className={classes.image}
            width={MAX_IMAGE_SIZE}
            height={MAX_IMAGE_SIZE}
            alt={`Lesion Number ${imageIndex}`}
          />
        </Card>
      </div>
    );
  };

  /**
   * Function for displaying a single User Stats page (slide)
   * @param statsIndex - index of the stats page (slide) to display
   */
  const displayUserStats = (statsIndex: number) => {
    numSlides = 2; // Total number of user statistics
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
              itemsSpacing: 100,
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
   * Function for displaying a pie chart designed for Image Stats
   * @param title - Pie Chart title for the image displayed
   * @param data - data parsed in to the pie chart
   */
  const displayImagePieChart = (
    title: string,
    data: { id: string; label: string; value: number; color: string }[]
  ) => {
    return (
      <Card className={[classes.basicCard, classes.imageStatsCard].join(" ")}>
        <Typography className={classes.statTitle}>{title}</Typography>
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
      currentTabIndex === 2
        ? await retrieveImageStats(newIndex)
        : await retrieveUserStats(currentTabIndex, newIndex);
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
          value={!tabSelected ? tabSelected : currentTabIndex}
          onChange={(_, newTabIndex) => onTabChange(newTabIndex, currentSlideIndex)}
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

          <Tab
            className={classes.tab}
            label="Per Image Stats"
            id="gametype-1"
            aria-controls="gametype-view-1"
          />
        </Tabs>
      </AppBar>
      <Slide in={slideIn} direction={slideDirection}>
        {displayStats(currentTabIndex, currentSlideIndex)}
      </Slide>
      {displaySlideShowButtons()}
    </>
  );
};

export default Statistics;
