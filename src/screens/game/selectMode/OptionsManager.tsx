import React, { useState } from "react";
import { AppBar, Button, IconButton, Theme, Toolbar, Typography } from "@material-ui/core";
import { KeyboardBackspace } from "@material-ui/icons";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Game from "../Game";
import GameModeSelect from "./GameModeSelect";
import DifficultySelect from "./DifficultySelect";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backButton: {
      marginRight: 8,
    },
    title: {
      flexGrow: 1,
    },
    buttonDesign: {
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
    rows: {
      height: "100%",
      justifyContent: "space-evenly",
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
    },
    columns: {
      justifyContent: "space-evenly",
      alignItems: "center",
      [theme.breakpoints.down("sm")]: {
        display: "flex",
        flexDirection: "column",
      },
      [theme.breakpoints.up("md")]: {
        display: "flex",
        flexDirection: "row",
      },
    },
  })
);

const OptionsManager: React.FC<OptionsProps> = ({ setRoute }: OptionsProps) => {
  const classes = useStyles();

  const [start, setStart] = useState(false);

  const [gameMode, setGameMode] = useState<GameMode>("casual");

  const [minId, setMinId] = useState(0);
  const [maxId, setMaxId] = useState(0);

  const [gameModeSelected, setGameModeSelected] = useState(false);
  const [difficultySelected, setDifficultySelected] = useState(false);

  if (start) {
    return <Game setRoute={setRoute} gameMode={gameMode} minFileId={minId} maxFileId={maxId} />;
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
      <div className={classes.rows}>
        <div className={classes.columns}>
          <GameModeSelect setGameMode={setGameMode} setGameModeSelected={setGameModeSelected} />
          <DifficultySelect
            setMin={setMinId}
            setMax={setMaxId}
            setDifficultySelected={setDifficultySelected}
          />
        </div>
        <Button
          className={classes.buttonDesign}
          variant="contained"
          color="primary"
          size="large"
          disabled={!(gameModeSelected && difficultySelected)}
          onClick={() => {
            setStart(true);
          }}
        >
          Start
        </Button>
      </div>
    </>
  );
};

export default OptionsManager;
