import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Button,
  ButtonGroup,
  Card,
  CircularProgress,
  Slide,
  Tab,
  Tabs,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { ArrowBack, ArrowForward } from "@material-ui/icons";
import firebase from "firebase/app";
import { ResponsivePie } from "@nivo/pie";
import { HideFragment, NavigationAppBar } from "../../components";
import { handleFirestoreError } from "../../utils/firebaseUtils";
import constants from "../../res/constants";

const useStyles = makeStyles(() =>
  createStyles({
    appBar: {
      backgroundColor: "#004445",
    },
    tabIndicator: {
      backgroundColor: "#C4DFE6",
    },
    tab: {
      fontSize: "1rem",
    },
    container: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "center",
      overflowX: "hidden",
    },
    card: {
      height: "80%",
      width: "80%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    title: {
      fontWeight: "bold",
    },
    pieContainer: {
      height: "60vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  })
);

const defaultStatsData: StatsData = {
  aiWins: 0,
  humanWins: 0,
  draws: 0,
  hints: 0,
  noHints: 0,
};

const numSlides = 2;

const Statistics: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const [slideIndex, setSlideIndex] = useState(0);
  const [slideIn, setSlideIn] = useState(true);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");

  const [statsData, setStatsData] = useState(defaultStatsData);
  const [loading, setLoading] = useState(true);

  const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));

  const classes = useStyles();

  useEffect(() => {
    const scores = tabIndex === 0 ? constants.scoresCasual : constants.scoresCompetitive;

    const unsubscribe = firebase
      .firestore()
      .collection(scores)
      .onSnapshot(
        (snapshot) => {
          let humanWins = 0;
          let aiWins = 0;
          let draws = 0;
          let hints = 0;

          snapshot.forEach((doc) => {
            const { score, ai_score: aiScore, usedHints } = doc.data() as FirestoreScoreData;

            if (score > aiScore) {
              humanWins += 1;
            } else if (aiScore > score) {
              aiWins += 1;
            } else {
              draws += 1;
            }

            hints += usedHints ? 1 : 0;
          });

          setStatsData({
            humanWins,
            aiWins,
            draws,
            hints,
            noHints: snapshot.size - hints,
          });

          setLoading(false);
        },
        (error) => handleFirestoreError(error)
      );

    return () => unsubscribe();
  }, [tabIndex]);

  const [title, data] = useMemo(() => {
    const { aiWins, humanWins, draws, hints, noHints } = statsData;

    if (slideIndex === 0) {
      return [
        "Human vs AI",
        [
          {
            id: "AI Wins",
            label: "AI Wins",
            value: aiWins,
            color: "#D9267A",
          },
          {
            id: "Human Wins",
            label: "Human Wins",
            value: humanWins,
            color: "#26AFD9",
          },
          {
            id: "Draws",
            label: "Draws",
            value: draws,
            color: "#BAE3BC",
          },
        ],
      ];
    }

    return [
      "How many players used hints",
      [
        {
          id: "Hints",
          label: "Hints",
          value: hints,
          color: "#26AFD9",
        },
        {
          id: "No hints",
          label: "No hints",
          value: noHints,
          color: "#D9267A",
        },
      ],
    ];
  }, [slideIndex, statsData]);

  const onTabChange = async (_event, newValue: number) => setTabIndex(newValue);

  const onArrowClick = (direction: "left" | "right") => {
    setSlideDirection(direction);
    setSlideIn(false);
  };

  const onSlideExited = () => {
    const increment = slideDirection === "left" ? -1 : 1;
    const newIndex = (slideIndex + increment + numSlides) % numSlides;

    setSlideIndex(newIndex);
    setSlideDirection((prevState) => (prevState === "left" ? "right" : "left"));
    setSlideIn(true);
  };

  return (
    <>
      <NavigationAppBar showBack />

      <AppBar className={classes.appBar} position="sticky">
        <Tabs
          classes={{ indicator: classes.tabIndicator }}
          variant={smallScreen ? "fullWidth" : "standard"}
          centered
          value={tabIndex}
          onChange={onTabChange}
        >
          <Tab className={classes.tab} label="Casual" />

          <Tab className={classes.tab} label="Competitive" />
        </Tabs>
      </AppBar>

      <div className={classes.container}>
        <Slide
          appear={false}
          in={slideIn}
          direction={slideDirection}
          timeout={{ enter: 400, exit: 400 }}
          onExited={onSlideExited}
        >
          <Card className={classes.card}>
            <Typography className={classes.title}>{title}</Typography>

            <div className={classes.pieContainer}>
              <HideFragment hide={!loading}>
                <CircularProgress color="secondary" size={64} />
              </HideFragment>

              <HideFragment hide={loading}>
                <ResponsivePie
                  data={data}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                  colors={{ scheme: "red_blue" }}
                  borderWidth={1}
                  borderColor={{ from: "color", modifiers: [["darker", 1]] }}
                  enableRadialLabels={false}
                  enableSliceLabels={false}
                  defs={[
                    {
                      id: "dots",
                      type: "patternDots",
                      background: "inherit",
                      color: "rgba(255,255,255,0.3)",
                      size: 4,
                      padding: 1,
                      stagger: true,
                    },
                    {
                      id: "lines",
                      type: "patternLines",
                      background: "inherit",
                      color: "rgba(255,255,255,0.3)",
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
                      direction: smallScreen ? "column" : "row",
                      justify: false,
                      translateY: 70,
                      itemWidth: 75,
                      itemHeight: 18,
                      itemsSpacing: smallScreen ? 5 : 75,
                      itemTextColor: "#000",
                      symbolSize: 18,
                      symbolShape: "circle",
                      effects: [
                        {
                          on: "hover",
                          style: {
                            itemTextColor: "#888",
                          },
                        },
                      ],
                    },
                  ]}
                />
              </HideFragment>
            </div>
          </Card>
        </Slide>

        <ButtonGroup size="large">
          <Button color="primary" variant="contained" onClick={() => onArrowClick("left")}>
            <ArrowBack />
          </Button>

          <Button color="primary" variant="contained" onClick={() => onArrowClick("right")}>
            <ArrowForward />
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
};

export default Statistics;
