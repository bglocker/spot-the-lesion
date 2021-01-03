import React, { useEffect, useState } from "react";
import {
  AppBar,
  Button,
  ButtonGroup,
  Slide,
  Tab,
  Tabs,
  Theme,
  useMediaQuery,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { ArrowBack, ArrowForward } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import { HideFragment, NavigationAppBar, TabPanel } from "../../components";
import TutorialCard from "./TutorialCard";
import { tutorialHowToPlayItems, tutorialLesionsItems } from "./tutorialHowToPlayItems";

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
    tutorialCard: {
      width: "80%",
      height: "80%",
    },
    playButtonContainer: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    playButton: {
      borderRadius: 20,
      fontSize: "3rem",
    },
  })
);

const numSlides = tutorialHowToPlayItems.length;

const Tutorial: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const [slideIndex, setSlideIndex] = useState(0);
  const [slideIn, setSlideIn] = useState(true);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");

  const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));

  const history = useHistory();

  const classes = useStyles();

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

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        onArrowClick("left");
      }

      if (event.key === "ArrowRight") {
        onArrowClick("right");
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const onPlayClick = () => history.replace("/game-menu");

  return (
    <>
      <NavigationAppBar showBack />

      <AppBar className={classes.appBar} position="sticky">
        <Tabs
          classes={{ indicator: classes.tabIndicator }}
          variant={smallScreen ? "fullWidth" : "standard"}
          centered
          aria-label="Tutorial pages"
          value={tabIndex}
          onChange={onTabChange}
        >
          <Tab className={classes.tab} label="How to Play" />

          <Tab className={classes.tab} label="Lesions" />
        </Tabs>
      </AppBar>

      <div className={classes.container}>
        <TabPanel value={tabIndex} index={0}>
          <Slide
            appear={false}
            in={slideIn}
            direction={slideDirection}
            timeout={{ enter: 400, exit: 400 }}
            onExited={onSlideExited}
          >
            <TutorialCard
              className={classes.tutorialCard}
              tutorialItem={tutorialHowToPlayItems[slideIndex]}
            >
              <HideFragment hide={slideIndex !== 14}>
                <div className={classes.playButtonContainer}>
                  <Button
                    className={classes.playButton}
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={onPlayClick}
                  >
                    Play
                  </Button>
                </div>
              </HideFragment>
            </TutorialCard>
          </Slide>

          <ButtonGroup size="large">
            <Button color="primary" variant="contained" onClick={() => onArrowClick("left")}>
              <ArrowBack />
            </Button>

            <Button color="primary" variant="contained" onClick={() => onArrowClick("right")}>
              <ArrowForward />
            </Button>
          </ButtonGroup>
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          <TutorialCard className={classes.tutorialCard} tutorialItem={tutorialLesionsItems[0]} />
        </TabPanel>
      </div>
    </>
  );
};

export default Tutorial;
