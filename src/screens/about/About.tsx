import React from "react";
import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/styles";
import BackButtonIcon from "@material-ui/icons/KeyboardBackspace";

const useStyles = makeStyles(() =>
  createStyles({
    backButton: {
      marginRight: 8,
    },
    container: {
      height: "100%",
    },
  })
);

const About: React.FC<AboutProps> = ({ setRoute }: AboutProps) => {
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
            <BackButtonIcon />
          </IconButton>

          <Typography>Spot the Lesion</Typography>
        </Toolbar>
      </AppBar>

      <div className={classes.container} />
    </>
  );
};

export default About;
