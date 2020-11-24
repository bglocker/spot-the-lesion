import React, { useState } from "react";
import { AppBar, Button, IconButton, Theme, Toolbar, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { KeyboardBackspace } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import ToggleButton from "../../components/ToggleButton";
import ToggleButtonGroup from "../../components/ToggleButtonGroup";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backButton: {
      marginRight: 8,
    },
    title: {
      flexGrow: 1,
    },
    container: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    selectorsContainer: {
      width: "100%",
      display: "flex",
      justifyContent: "space-evenly",
      [theme.breakpoints.down("sm")]: {
        flex: 0.8,
        flexDirection: "column",
      },
      [theme.breakpoints.up("md")]: {
        flexDirection: "row",
      },
    },
    selectorContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    selectText: {
      fontSize: "3rem",
      fontWeight: "bold",
      [theme.breakpoints.only("xs")]: {
        fontSize: "150%",
      },
      [theme.breakpoints.only("sm")]: {
        fontSize: "1.5rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "3rem",
      },
    },
    toggleButton: {
      margin: 8,
      borderRadius: 20,
      [theme.breakpoints.only("xs")]: {
        width: 300,
        height: 50,
        fontSize: "1rem",
      },
      [theme.breakpoints.only("sm")]: {
        width: 350,
        height: 58,
        fontSize: "1rem",
      },
      [theme.breakpoints.up("md")]: {
        width: 370,
        height: 61,
        fontSize: "1.25rem",
      },
    },
    startButton: {
      borderRadius: 20,
      [theme.breakpoints.only("xs")]: {
        width: 300,
        height: 50,
        fontSize: "1rem",
      },
      [theme.breakpoints.only("sm")]: {
        width: 350,
        height: 58,
        fontSize: "1rem",
      },
      [theme.breakpoints.up("md")]: {
        width: 370,
        height: 61,
        fontSize: "1.25rem",
      },
    },
  })
);

const GameMenu: React.FC = () => {
  const classes = useStyles();

  const history = useHistory();

  const [gameModes, setGameModes] = useState<GameMode[]>([]);
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);

  const onToggleGameMode = (
    _unusedEvent: React.MouseEvent<HTMLButtonElement>,
    newGameModes: GameMode[]
  ) => setGameModes(newGameModes);

  const onToggleDifficulty = (
    _unusedEvent: React.MouseEvent<HTMLButtonElement>,
    newDifficulties: Difficulty[]
  ) => setDifficulties(newDifficulties);

  const onStartClick = () => {
    history.push(`/game?gameMode=${gameModes[0]}&difficulty=${difficulties[0]}`);
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar variant="dense">
          <IconButton
            className={classes.backButton}
            edge="start"
            color="inherit"
            aria-label="Back"
            onClick={() => history.goBack()}
          >
            <KeyboardBackspace />
          </IconButton>

          <Typography className={classes.title}>Spot the Lesion</Typography>
        </Toolbar>
      </AppBar>

      <div className={classes.container}>
        <div className={classes.selectorsContainer}>
          <div className={classes.selectorContainer}>
            <Typography className={classes.selectText}>Game mode</Typography>

            <ToggleButtonGroup
              orientation="vertical"
              exclusive
              value={gameModes}
              onToggle={onToggleGameMode}
            >
              <ToggleButton
                className={classes.toggleButton}
                variant="contained"
                color="primary"
                size="large"
                value="casual"
              >
                Casual
              </ToggleButton>

              <ToggleButton
                className={classes.toggleButton}
                variant="contained"
                color="primary"
                size="large"
                value="competitive"
              >
                Competitive
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          <div className={classes.selectorContainer}>
            <Typography className={classes.selectText}>Difficulty</Typography>

            <ToggleButtonGroup
              orientation="vertical"
              exclusive
              value={difficulties}
              onToggle={onToggleDifficulty}
            >
              <ToggleButton
                className={classes.toggleButton}
                variant="contained"
                color="primary"
                size="large"
                value="easy"
              >
                Easy
              </ToggleButton>

              <ToggleButton
                className={classes.toggleButton}
                variant="contained"
                color="primary"
                size="large"
                value="medium"
              >
                Medium
              </ToggleButton>

              <ToggleButton
                className={classes.toggleButton}
                variant="contained"
                color="primary"
                size="large"
                value="hard"
              >
                Hard
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>

        <Button
          className={classes.startButton}
          variant="contained"
          color="primary"
          size="large"
          disabled={gameModes.length === 0 || difficulties.length === 0}
          onClick={onStartClick}
        >
          Start
        </Button>
      </div>
    </>
  );
};

export default GameMenu;
