import React, { useState } from "react";
import {
  AppBar,
  Button,
  ButtonGroup,
  Container,
  Grid,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import logo from "./images/logo.gif";
import scan from "./images/ct-scan.png";
import brain from "./images/brain.png";

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      background: "#07575B",
      borderRadius: 20,
      borderColor: "black",
      borderWidth: 4,
      color: "white",
      fontFamily: "segoe UI",
      fontWeight: "bold",
      marginTop: "3vh",
      fontSize: 22,
      width: 290,
      margin: "1vh",
    },
    container: {
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    logo: {
      marginTop: "1vh",
      width: "auto",
      height: "350px",
    },
    visible: {
      width: "250px",
      height: "auto",
      display: "block",
    },
    invisible: {
      display: "none",
    },
    navbar: {
      background: "#07575B",
    },
  })
);

const Home: React.FC<HomeProps> = ({ setRoute }: HomeProps) => {
  const styles = useStyles();
  const minWidth = 1360;

  const IsFullWidth = () => {
    const [hasFullWidth, setHasFullWidth] = useState(window.innerWidth > minWidth);
    window.addEventListener("resize", () => {
      const newHasFullWidth: boolean = window.innerWidth > minWidth;
      setHasFullWidth(newHasFullWidth);
    });
    return hasFullWidth;
  };

  const fullWidth = IsFullWidth();

  return (
    <div>
      <AppBar position="static">
        <Toolbar className={styles.navbar} variant="dense">
          <Typography>Spot the Lesion</Typography>
        </Toolbar>
      </AppBar>
      <Container className={styles.container}>
        <img className={styles.logo} src={logo} alt="Spot the Lesion Logo" />
        <Grid container direction="row" justify="space-evenly" alignItems="center">
          <img
            className={fullWidth ? styles.visible : styles.invisible}
            src={scan}
            alt="Scanner.png"
          />
          <ButtonGroup orientation="vertical">
            <Button
              variant="contained"
              size="large"
              className={styles.button}
              onClick={() => setRoute("game")}
            >
              Play
            </Button>
            <Button
              variant="contained"
              size="large"
              className={styles.button}
              onClick={() => setRoute("tutorial1")}
            >
              How to Play
            </Button>
            <Button
              variant="contained"
              size="large"
              className={styles.button}
              onClick={() => setRoute("about")}
            >
              About CT Scans
            </Button>
            <Button
              variant="contained"
              size="large"
              className={styles.button}
              onClick={() => setRoute("credits")}
            >
              Credits
            </Button>
          </ButtonGroup>
          <img
            className={fullWidth ? styles.visible : styles.invisible}
            src={brain}
            alt="Brain.png"
          />
        </Grid>
      </Container>
    </div>
  );
};

export default Home;
