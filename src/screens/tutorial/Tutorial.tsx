import React, { useEffect, useState } from "react";
import { Button, Slide, SlideProps, Grid, ButtonGroup } from "@material-ui/core";
import { ArrowBack, ArrowForward } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import TutorialCard from "./card/TutorialCard";

const slideImages = [
  ["", ""],
  ["https://drive.google.com/uc?export=view&id=109Icr7RZnYFO5WjkjeXWsy3bD1S3iE7x", ""],
  ["https://drive.google.com/uc?export=view&id=109Icr7RZnYFO5WjkjeXWsy3bD1S3iE7x", ""],
  ["https://drive.google.com/uc?export=view&id=1zUiZsLTjVAyPTrmppFVojLedWsZsRUjK", ""],
  [
    "https://drive.google.com/uc?export=view&id=1Z6mNsPSHeDxUeOfF1qgAhGHlsaM-X00_",
    "https://drive.google.com/uc?export=view&id=1brdT9MTCpdG9Pn-i5GQFZe7quld4gIBw",
  ],
  [
    "https://drive.google.com/uc?export=view&id=1j04ZbODp1vkfTjCHddkWlZjoI4rZsNsn",
    "https://drive.google.com/uc?export=view&id=15FtUQagj-e6sQsX22bFjrLkosfHCPCMm",
  ],
  ["https://drive.google.com/uc?export=view&id=126hJMQ-Q34rrEgsnzAQaGwTCsMAG6yAE", ""],
  ["", ""],
];

const myStyle = makeStyles({
  white: {
    marginTop: "2vh",
    backgroundColor: "white",
    height: "80vh",
    borderRadius: 25,
    borderColor: "black",
    borderWidth: "5px",
    borderStyle: "solid",
    marginLeft: "4.75vw",
    marginRight: "4.75vw",
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
});

const Tutorial: React.FC<TutorialProps> = ({ setRoute, setBackButton }: TutorialProps) => {
  const styles = myStyle();

  // The slide text
  const SLIDE_TEXT = [
    "Welcome to Spot-the-Lesion!",
    "You’ll receive a sample of a CT scan like this one below, and you’’ll have to find the lesion present in it.",
    " You have 10 seconds to click on the region of the scan where you think the lesion is located.",
    "After 5 seconds, a hint will appear - the red circle indicates the part of the image which you should look at.",
    "If your click was correct, then you’ll see a green cross (x) on the spot you selected, otherwise a red cross (x) will appear.",
    "You’ll also see the AI’s prediction on the lesion, marked in red if the AI was wrong, or in green if the AI was correct.",
    "Finally, you will see the correct answer marked in yellow.",
    "That's it! Now, can you spot more lesions than the AI?",
  ];

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

  setBackButton(true);

  return (
    <div>
      <Grid container direction="column" alignItems="center" justify="center">
        <Slide in={slideIn} direction={slideDirection}>
          <div className={styles.white}>
            <Grid container direction="column" justify="space-around" alignItems="center">
              <TutorialCard textContent={textContent} imageLink={imageContent} />
              {index === 7 ? (
                <Button className={`${styles.centeredButton}`} onClick={() => setRoute("game")}>
                  Play
                </Button>
              ) : (
                ""
              )}
            </Grid>
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
