import React, { useState } from "react";
import { AppBar, Button, ButtonGroup, IconButton, Toolbar, Typography } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { KeyboardBackspace } from "@material-ui/icons";
import Game from "./Game";

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
    selectText: {
      fontSize: "3rem",
      fontWeight: "bold",
      textAlign: "center",
    },
    gameModeButton: {
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
  })
);

const GameModeSelect: React.FC<GameModeSelectProps> = ({ setRoute }: GameModeSelectProps) => {
  const classes = useStyles();

  const [selected, setSelected] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>("casual");

  const onCasualClick = () => {
    setSelected(true);
    setGameMode("casual");
  };

  const onCompetitiveClick = () => {
    setSelected(true);
    setGameMode("competitive");
  };

  if (selected) {
    return <Game setRoute={setRoute} gameMode={gameMode} />;
  }

  return (
    <>
      <AppBar position="sticky">
        <Toolbar variant="dense">
          <IconButton
            className={classes.backButton}
            edge="start"
            color="inherit"
            aria-label="Back"
            onClick={() => setRoute("home")}
          >
            <KeyboardBackspace />
          </IconButton>

          <Typography className={classes.title}>Spot the Lesion</Typography>
        </Toolbar>
      </AppBar>

      <div className={classes.container}>
        <Typography className={classes.selectText}>Choose a game mode</Typography>

        <ButtonGroup orientation="vertical">
          <Button
            className={classes.gameModeButton}
            variant="contained"
            color="primary"
            size="large"
            onClick={onCasualClick}
          >
            Casual
          </Button>

          <Button
            className={classes.gameModeButton}
            variant="contained"
            color="primary"
            size="large"
            onClick={onCompetitiveClick}
          >
            Competitive
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
};

export default GameModeSelect;
