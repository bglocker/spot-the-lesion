import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, ButtonGroup, Grid } from "@material-ui/core";
import logo from "./logo.png";
import scan from "./ct-scan.png";
import brain from "./brain.png";

const useStyles = makeStyles((style) => ({
  logoStyle: {
    alignItems: "center",
    marginTop: "5vh",
    display: "flex",
    justifyContent: "center",
  },
  root: {
    background: "#0063b2",
    borderRadius: 50,
    color: "white",
    height: 100,
    width: 1000,
    fontSize: 36,
    fontFamily: "segoe UI",
    fontWeight: "bold",
    marginTop: "2vh",
    margin: style.spacing(1),
  },
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  containerLeftImage: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "left",
    marginRight: "45vw",
    position: "fixed",
    marginTop: "5vh",
    transform: "rotate(330deg)",
  },
  containerRightImage: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "45vw",
    position: "fixed",
    marginTop: "25vh",
    transform: "rotate(45deg)",
  },
}));

const Home: React.FC<HomeProps> = ({ setRoute }: HomeProps) => {
  const styles = useStyles();
  return (
    <div
      style={{
        backgroundColor: "#9CC3D5FF",
      }}
    >
      <div className={styles.logoStyle}>
        <img width="700" height="750" src={logo} alt="this is a logo" />
      </div>
      <Grid container direction="row" justify="space-evenly" alignItems="center">
        <div>
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
        <div>
          <img width="500" height="500" src={brain} alt="this is a logo" />
        </div>
      </Grid>
    </div>
  );
};

export default Home;
