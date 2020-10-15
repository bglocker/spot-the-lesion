import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Typography } from "@material-ui/core";

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
});

const Credits: React.FC<CreditsProps> = ({ setBackButton }: CreditsProps) => {
  setBackButton(true);
  const styles = myStyles();
  return (
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
        Andrei-Matei Roman, Andrei-Ovidiu Badea, Calin-Andrei Alexandru, Calin Biberea, Cosmin-Ionut
        Baies, Tiberiu-Andrei Georgescu
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
  );
};

export default Credits;
