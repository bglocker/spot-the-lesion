import React from "react";
import { AppBar, Grid, IconButton, Toolbar, Typography } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { KeyboardBackspace } from "@material-ui/icons";
import question from "../../res/images/achievements/block.png";
import firstCorrect from "../../res/images/achievements/check.png";
import firstCorrectWithoutHint from "../../res/images/achievements/investigation.png";
import firstCompetitiveWin from "../../res/images/achievements/trophy.png";
import firstCasualWin from "../../res/images/achievements/medal.png";

const useStyles = makeStyles((theme) =>
  createStyles({
    backButton: {
      marginRight: 8,
    },
    root: {
      flexGrow: 1,
    },
    grid: {
      marginTop: 32,
      textAlign: "center",
    },
    image: {
      [theme.breakpoints.down("xs")]: {
        height: 150,
      },
      [theme.breakpoints.up("sm")]: {
        height: 250,
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
          src={localStorage.getItem("firstCasualWin") ? firstCasualWin : question}
          alt="Not found yet"
        />
      </Grid>
    </>
  );
};

const SecondFormRow = () => {
  const classes = useStyles();
  return (
    <>
      <Grid item xs={4}>
        <img
          className={classes.image}
          src={localStorage.getItem("firstCompetitiveWin") ? firstCompetitiveWin : question}
          alt="Not found yet"
        />
      </Grid>
      <Grid item xs={4}>
        <img className={classes.image} src={question} alt="Not found yet" />
      </Grid>
      <Grid item xs={4}>
        <img className={classes.image} src={question} alt="Not found yet" />
      </Grid>
    </>
  );
};

const ThirdFormRow = () => {
  const classes = useStyles();
  return (
    <>
      <Grid item xs={4}>
        <img className={classes.image} src={question} alt="Not found yet" />
      </Grid>
      <Grid item xs={4}>
        <img className={classes.image} src={question} alt="Not found yet" />
      </Grid>
      <Grid item xs={4}>
        <img className={classes.image} src={question} alt="Not found yet" />
      </Grid>
    </>
  );
};

const Achievements: React.FC<AchievementsProps> = ({ setRoute }: AchievementsProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
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

      <>
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
      </>
    </div>
  );
};

export default Achievements;
