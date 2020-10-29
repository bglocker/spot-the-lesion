import React from "react";
import {
  AppBar,
  Button,
  ButtonGroup,
  Container,
  Toolbar,
  Typography,
  Theme,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import logo from "../../res/images/home/logo.gif";
import scan from "../../res/images/home/ct-scan.png";
import brain from "../../res/images/home/brain.png";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    logo: {
      marginTop: 16,
      marginBottom: 24,
      [theme.breakpoints.down("xs")]: {
        height: 200,
      },
      [theme.breakpoints.up("sm")]: {
        height: 300,
      },
    },
    iconsAndButtonsContainer: {
      width: "100%",
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    image: {
      width: 250,
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
      [theme.breakpoints.up("md")]: {
        display: "inline-block",
      },
    },
    button: {
      margin: 8,
      borderRadius: 20,
      [theme.breakpoints.only("xs")]: {
        width: 250,
        fontSize: "1rem",
      },
      [theme.breakpoints.only("sm")]: {
        width: 300,
        fontSize: "1rem",
      },
      [theme.breakpoints.up("md")]: {
        width: 320,
        fontSize: "1.25rem",
      },
    },
  })
);

const Home: React.FC<HomeProps> = ({ setRoute }: HomeProps) => {
  const classes = useStyles();

  return (
    <>
      <AppBar position="sticky">
        <Toolbar variant="dense">
          <Typography>Spot the Lesion</Typography>
        </Toolbar>
      </AppBar>

      <Container className={classes.container}>
        <img className={classes.logo} src={logo} alt="Spot the Lesion Logo" />

        <div className={classes.iconsAndButtonsContainer}>
          <img className={classes.image} src={scan} alt="Scanner" />

          <ButtonGroup orientation="vertical">
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              size="large"
              onClick={() => setRoute("game")}
            >
              Play
            </Button>

            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              size="large"
              onClick={() => setRoute("tutorial")}
            >
              How to Play
            </Button>

            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              size="large"
              onClick={() => setRoute("leaderboard")}
            >
              Leaderboard
            </Button>

            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              size="large"
              onClick={() => setRoute("statistics")}
            >
              Statistics
            </Button>

            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              size="large"
              onClick={() => setRoute("about")}
            >
              About CT Scans
            </Button>

            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              size="large"
              onClick={() => setRoute("credits")}
            >
              Credits
            </Button>
          </ButtonGroup>

          <img className={classes.image} src={brain} alt="Brain" />
        </div>
      </Container>
    </>
  );
};

export default Home;
