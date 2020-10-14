import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, ButtonGroup, Grid } from "@material-ui/core";
import logo from "./doctor.png";
import scan from "./ct-scan.png";
import brain from "./brain.png";

const useStyles = makeStyles({
  logoStyle: {
    alignItems: "center",
    marginTop: "5vh",
    display: "flex",
    justifyContent: "center",
  },
  root: {
    background: "#07575B",
    borderRadius: 25,
    borderColor: "black",
    borderWidth: 10,
    color: "white",
    height: 100,
    width: 1000,
    fontSize: 36,
    fontFamily: "segoe UI",
    fontWeight: "bold",
    marginTop: "2vh",
  },
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  invisible: {
    display: "none",
  },
});

const Home: React.FC<HomeProps> = ({ setRoute }: HomeProps) => {
  const styles = useStyles();
  const windowMinWidth = 2017;
  const [windowFitsWidth, setIsWindowWideEnough] = useState(window.innerWidth > windowMinWidth);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => {
        const newWindowFitsWidth: boolean = window.innerWidth > windowMinWidth;
        if (newWindowFitsWidth !== windowFitsWidth) setIsWindowWideEnough(newWindowFitsWidth);
      },
      false
    );
  }, [windowFitsWidth]);

  return (
    <div
      style={{
        backgroundColor: "#66A5AD",
      }}
    >
      <div className={styles.logoStyle}>
        <img width="700" height="750" src={logo} alt="this is a logo" />
      </div>
      <Grid container direction="row" justify="space-evenly" alignItems="center">
        <div className={!windowFitsWidth ? styles.invisible : ""}>
          <img width="500" height="500" src={scan} alt="this is a logo" />
        </div>
        <ButtonGroup orientation="vertical">
          <Button className={styles.root} onClick={() => setRoute("game")}>
            Play
          </Button>
          <Button className={styles.root} onClick={() => setRoute("tutorial1")}>
            How to Play
          </Button>
          <Button className={styles.root} onClick={() => setRoute("about")}>
            About CT Scans
          </Button>
          <Button className={styles.root} onClick={() => setRoute("credits")}>
            Credits
          </Button>
        </ButtonGroup>
        <div className={!windowFitsWidth ? styles.invisible : ""}>
          <img width="500" height="500" src={brain} alt="this is a logo" />
        </div>
      </Grid>
    </div>
  );
};

export default Home;
