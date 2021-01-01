import React, { useState } from "react";
import { Button, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { NavigationAppBar, ToggleButton, ToggleButtonGroup } from "../../components";

const useStyles = makeStyles((theme) =>
  createStyles({
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
  const [gameModes, setGameModes] = useState<GameMode[]>([]);
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);

  const history = useHistory();

  const classes = useStyles();

  const onToggleGameMode = (
    _event: React.MouseEvent<HTMLButtonElement>,
    newGameModes: GameMode[]
  ) => setGameModes(newGameModes);

  const onToggleDifficulty = (
    _event: React.MouseEvent<HTMLButtonElement>,
    newDifficulties: Difficulty[]
  ) => setDifficulties(newDifficulties);

  const onStartClick = () =>
    history.push(`/game?gameMode=${gameModes[0]}&difficulty=${difficulties[0]}`);

  return (
    <>
      <NavigationAppBar showBack />

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
