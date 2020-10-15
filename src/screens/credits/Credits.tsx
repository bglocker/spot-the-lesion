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
        This demo is based on our MICCAI 2019 paper.
      </Typography>
      <Typography className={`${styles.textContent} ${styles.centerContent}`}>
        Developed by Martin Zlocha, Qi Dou and Ben Glocker.
      </Typography>
      <Typography className={`${styles.textContent} ${styles.centerContent}`}>
        (c) 2019 Data obtained from the NIH Clinical Center
      </Typography>
    </div>
  );
};

export default Credits;
