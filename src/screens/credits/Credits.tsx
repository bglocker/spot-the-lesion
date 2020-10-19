import React from "react";
import { makeStyles } from "@material-ui/styles";
import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import BackButtonIcon from "@material-ui/icons/KeyboardBackspace";

const myStyles = makeStyles({
  white: {
    marginTop: "2vh",
    backgroundColor: "white",
    height: "80vh",
    borderRadius: 25,
    borderColor: "black",
    borderWidth: "5px",
    borderStyle: "solid",
    justifyContent: "center",
    alignItems: "center",
  },
  textContent: {
    margin: "5%",
    fontSize: "calc((3vh + 3vw)/2)",
    textAlign: "center",
  },
  maxWidth: {
    width: "100%",
  },
  centerContent: {
    lineItems: "center",
  },
  navbar: {
    background: "#07575B",
  },
});

const Credits: React.FC<CreditsProps> = ({ setRoute }: CreditsProps) => {
  const styles = myStyles();

  return (
    <div>
      <AppBar position="static">
        <Toolbar className={styles.navbar} variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setRoute("home")}
          >
            <BackButtonIcon />
          </IconButton>
          <Typography>Spot the Lesion</Typography>
        </Toolbar>
      </AppBar>
      <div className={styles.white}>
        <Typography className={`${styles.textContent} ${styles.centerContent}`}>
          This demo is based on our{" "}
          <a target="blank" href="https://arxiv.org/abs/1906.02283">
            MICCAI 2019 paper
          </a>
          .
        </Typography>
        <Typography className={`${styles.textContent} ${styles.centerContent}`}>
          CT Scan AI developed by Martin Zlocha, Qi Dou and Ben Glocker.
        </Typography>
        <Typography className={`${styles.textContent} ${styles.centerContent}`}>
          This site was made with React for 3rd year Software Engineering Group Project by:
          Andrei-Matei Roman, Andrei-Ovidiu Badea, Calin-Andrei Alexandru, Calin Biberea,
          Cosmin-Ionut Baies, Tiberiu-Andrei Georgescu
        </Typography>
        <Typography className={`${styles.textContent} ${styles.centerContent}`}>
          (c) 2019 Data obtained from the{" "}
          <a
            target="blank"
            href="https://www.nih.gov/news-events/news-releases/nih-clinical-center-releases-dataset-32000-ct-images"
          >
            NIH Clinical Center
          </a>
        </Typography>
      </div>
    </div>
  );
};

export default Credits;
