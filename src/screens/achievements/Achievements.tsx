import React from "react";
import { AppBar, Grid, IconButton, Toolbar, Typography } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { KeyboardBackspace } from "@material-ui/icons";
import question from "../../res/images/achievements/block.png";
import firstCorrect from "../../res/images/achievements/check.png";
import firstCorrectWithoutHint from "../../res/images/achievements/noHint.png";
import firstWin from "../../res/images/achievements/trophy.png";

const useStyles = makeStyles((theme) =>
  createStyles({
    backButton: {
      marginRight: 8,
    },
    container: {
      height: "100%",
    },
    grid: {
      marginTop: 32,
      textAlign: "center",
    },
    image: {
      [theme.breakpoints.down("xs")]: {
        height: 200,
      },
      [theme.breakpoints.up("sm")]: {
        height: 300,
      },
    },
  })
);

const FirstFormRow = () => {
  const classes = useStyles();
  return (
    <>
      <Grid item xs={4}>
        <img
          className={classes.image}
          src={localStorage.getItem("firstCorrect") ? firstCorrect : question}
          alt="Not found yet"
        />
      </Grid>
      <Grid item xs={4}>
        <img
          className={classes.image}
          src={localStorage.getItem("firstCorrectWithoutHint") ? firstCorrectWithoutHint : question}
          alt="Not found yet"
        />
      </Grid>
      <Grid item xs={4}>
        <img
          className={classes.image}
          src={localStorage.getItem("firstWin") ? firstWin : question}
          alt="Not found yet"
        />
      </Grid>
    </>
  );
};

const SecondFormRow = () => {
  return (
    <>
      <Grid item xs={4}>
        asd
      </Grid>
      <Grid item xs={4}>
        asd
      </Grid>
      <Grid item xs={4}>
        ads
      </Grid>
    </>
  );
};

const ThirdFormRow = () => {
  return (
    <>
      <Grid item xs={4}>
        asd
      </Grid>
      <Grid item xs={4}>
        asd
      </Grid>
      <Grid item xs={4}>
        ads
      </Grid>
    </>
  );
};

const Achievements: React.FC<AchievementsProps> = ({ setRoute }: AchievementsProps) => {
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

          <Typography>Spot the Lesion</Typography>
        </Toolbar>
      </AppBar>

      <div className={classes.container}>
        <Grid container spacing={6} className={classes.grid}>
          <Grid container item xs={12} spacing={3}>
            <FirstFormRow />
          </Grid>
          <Grid container item xs={12} spacing={3}>
            <SecondFormRow />
          </Grid>
          <Grid container item xs={12} spacing={3}>
            <ThirdFormRow />
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Achievements;
