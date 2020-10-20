import React, { useEffect, useState } from "react";
import {
  AppBar,
  Button,
  ButtonGroup,
  createStyles,
  Grid,
  IconButton,
  Slide,
  SlideProps,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ArrowBack, ArrowForward, KeyboardBackspace } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import TutorialCard from "./card/TutorialCard";
import doctor from "./images/doctor.png";
import start_screen from "./images/start screen.png";
import help from "./images/help.png";
import wrong_click from "./images/wrong click.png";
import right_click from "./images/right click.png";
import wrong_ai from "./images/wrong ai.png";
import right_ai from "./images/right ai.png";
import actual_lesion from "./images/actual lesion.png";

const slideImages = [
  doctor,
  start_screen,
  start_screen,
  help,
  right_click,
  wrong_click,
  wrong_ai,
  right_ai,
  actual_lesion,
  "",
];

const myStyle = makeStyles(() =>
  createStyles({
    screenSize: {
      marginTop: "2%",
      width: "inherit",
      height: "80vh",
    },
    container: {
      overflow: "hidden",
    },
    white: {
      backgroundColor: "white",
      borderRadius: 25,
      height: "inherit",
      borderColor: "black",
      borderWidth: "5px",
      borderStyle: "solid",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    groupButton: {
      marginTop: "2vh",
      background: "#07575B",
      color: "white",
      fontSize: "calc((2vw + 2vh)/2)",
      fontWeight: "bold",
    },
    centeredButton: {
      background: "#07575B",
      borderRadius: "calc((2vw + 2vh)/2)",
      color: "white",
      height: "10vh",
      width: "30vw",
      fontSize: "calc((2vw + 2vh)/2)",
      fontFamily: "segoe UI",
      marginTop: "15vh",
    },
    moveButtonGroup: {
      marginLeft: "20vw",
    },
    centerImages: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    navbar: {
      background: "#07575B",
    },
  })
);

const Tutorial: React.FC<TutorialProps> = ({ setRoute }: TutorialProps) => {
  const styles = myStyle();

  // The slide text
  const SLIDE_TEXT = [
    "Welcome to Spot-the-Lesion!",
    "You’ll receive a sample of a CT scan like this one below, and you’’ll have to find the lesion present in it.",
    " You have 10 seconds to click on the region of the scan where you think the lesion is located.",
    "After 5 seconds, a hint will appear - the red circle indicates the part of the image which you should look at.",
    "If your click was correct, then you’ll see a green cross (x) on the spot you selected...",
    "...otherwise a red cross (x) will appear.",
    "You’ll also see the AI’s prediction on the lesion, marked in red if the AI was wrong...",
    "...or in green if the AI was correct.",
    "Finally, you will see the correct answer marked in yellow.",
    "That's it! Now, can you spot more lesions than the AI?",
  ];

  const [buttonColor, setButtonColor] = useState("white");
  const [index, setIndex] = useState(0);
  const textContent = SLIDE_TEXT[index];
  const imageContent = slideImages[index];
  const numSlides = SLIDE_TEXT.length;

  const [slideIn, setSlideIn] = useState(true);
  const [slideDirection, setSlideDirection] = useState<SlideProps["direction"]>("down");

  const onArrowClick = (direction: SlideProps["direction"]) => {
    const increment = direction === "left" ? -1 : 1;
    const newIndex = (index + increment + numSlides) % numSlides;

    const oppDirection = direction === "left" ? "right" : "left";
    setSlideDirection(direction);
    setSlideIn(false);

    setTimeout(() => {
      setIndex(newIndex);
      setSlideDirection(oppDirection);
      setSlideIn(true);
    }, 500);
  };

  useEffect(() => {
    const handleKeyDown = (e: { keyCode: number }) => {
      if (e.keyCode === 39) {
        onArrowClick("right");
      }
      if (e.keyCode === 37) {
        onArrowClick("left");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div className={styles.container}>
      <AppBar position="static">
        <Toolbar className={styles.navbar} variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setRoute("home")}
          >
            <KeyboardBackspace />
          </IconButton>
          <Typography>Spot the Lesion</Typography>
        </Toolbar>
      </AppBar>
      <Grid container direction="column" alignItems="center" justify="center">
        <Slide in={slideIn} direction={slideDirection}>
          <div className={styles.screenSize}>
            <div className={styles.white}>
              <Grid container direction="column" justify="space-around" alignItems="center">
                <TutorialCard textContent={textContent} imageLink={imageContent} />
                {index === 9 ? (
                  <Button
                    className={`${styles.centeredButton}`}
                    style={{ color: buttonColor }}
                    onClick={() => setRoute("game")}
                    onMouseEnter={() => setButtonColor("#07575B")}
                    onMouseLeave={() => setButtonColor("white")}
                  >
                    Play
                  </Button>
                ) : (
                  ""
                )}
              </Grid>
            </div>
          </div>
        </Slide>
        <ButtonGroup size="large" className={styles.groupButton}>
          <Button onClick={() => onArrowClick("left")}>
            <ArrowBack>Prev</ArrowBack>
          </Button>
          <Button onClick={() => onArrowClick("right")}>
            <ArrowForward>Next</ArrowForward>
          </Button>
        </ButtonGroup>
      </Grid>
    </div>
  );
};

export default Tutorial;
