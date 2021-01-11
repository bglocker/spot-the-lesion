import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { NavigationAppBar } from "../../components";
import logo from "../../res/images/home/logo.gif";
import scan from "../../res/images/home/ct-scan.png";
import brain from "../../res/images/home/brain.png";

const useStyles = makeStyles((theme) =>
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

const Home: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const history = useHistory();

  const classes = useStyles();

  const onPlayClick = () => {
    if (localStorage.getItem("firstSession") === "true") {
      history.push("/game-menu");
    } else {
      localStorage.setItem("firstSession", "true");

      setDialogOpen(true);
    }
  };

  const onTutorialClick = () => history.push("/tutorial");

  const onLeaderboardsClick = () => history.push("/leaderboards");

  const onAchievementsClick = () => history.push("/achievements");

  const onStatisticsClick = () => history.push("/statistics");

  const onCreditsClick = () => history.push("/credits");

  return (
    <>
      <NavigationAppBar />

      <div className={classes.container}>
        <img className={classes.logo} src={logo} alt="Spot the Lesion Logo" />

        <div className={classes.iconsAndButtonsContainer}>
          <img className={classes.image} src={scan} alt="Scanner" />

          <ButtonGroup orientation="vertical">
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              size="large"
              onClick={onPlayClick}
            >
              Play
            </Button>

            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              size="large"
              onClick={onTutorialClick}
            >
              Tutorial
            </Button>

            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              size="large"
              onClick={onLeaderboardsClick}
            >
              Leaderboards
            </Button>

            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              size="large"
              onClick={onAchievementsClick}
            >
              Achievements
            </Button>

            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              size="large"
              onClick={onStatisticsClick}
            >
              Statistics
            </Button>

            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              size="large"
              onClick={onCreditsClick}
            >
              Credits
            </Button>
          </ButtonGroup>

          <img className={classes.image} src={brain} alt="Brain" />
        </div>

        <Dialog open={dialogOpen}>
          <DialogTitle>What about a short tutorial?</DialogTitle>

          <DialogContent>
            <DialogContentText>
              Hey. We have noticed that this is your first time playing on this browser. We want to
              make sure you get a feeling of what is going on before jumping in the game, so we
              suggest you take a look at the tutorial.
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button color="primary" onClick={onTutorialClick}>
              Show me the tutorial
            </Button>

            <Button color="primary" onClick={onPlayClick}>
              I just want to play
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Home;
