import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Container, Grid } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import logo from "./logo.gif";
import scan from "./ct-scan.png";
import brain from "./brain.png";

const useStyles = makeStyles((theme) =>
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
      width: 300,
      margin: theme.spacing(2),
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
      height: "360px",
    },
    visible: {
      width: "250px",
      height: "auto",
      display: "block",
    },
    invisible: {
      display: "none",
    },
  })
);

const Home: React.FC<HomeProps> = ({ setRoute }: HomeProps) => {
  const styles = useStyles();
  const minWidth = 1360;
  const [fullWidth, setFullWidth] = useState(window.innerWidth > minWidth);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => {
        const newFullWidth: boolean = window.innerWidth > minWidth;
        setFullWidth(newFullWidth);
      },
      false
    );
  }, [fullWidth]);

  return (
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
  );
};

export default Home;
