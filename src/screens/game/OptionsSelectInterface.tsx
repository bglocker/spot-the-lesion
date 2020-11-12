import React from "react";
import { AppBar, Button, ButtonGroup, IconButton, Toolbar, Typography } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { KeyboardBackspace } from "@material-ui/icons";

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

const OptionsSelectInterface: React.FC<OptionsSelectInterface> = ({
  setRoute,
  optionName,
  options,
}: OptionsSelectInterface) => {
  const classes = useStyles();

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
        <Typography className={classes.selectText}>Choose a {optionName}</Typography>

        <ButtonGroup orientation="vertical">
          {options.map(([optionDefinition, optionFunction]) => (
            <Button
              key={optionDefinition}
              className={classes.gameModeButton}
              variant="contained"
              color="primary"
              size="large"
              onClick={optionFunction}
            >
              {optionDefinition}
            </Button>
          ))}
        </ButtonGroup>
      </div>
    </>
  );
};

export default OptionsSelectInterface;
