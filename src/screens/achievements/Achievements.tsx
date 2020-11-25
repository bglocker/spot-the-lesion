import React from "react";
import {
  AppBar,
  Grid,
  IconButton,
  Theme,
  Toolbar,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { KeyboardBackspace } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import question from "../../res/images/achievements/block.png";
import firstCorrect from "../../res/images/achievements/tick.png";
import firstCorrectWithoutHint from "../../res/images/achievements/investigation.png";
import firstCompetitiveWin from "../../res/images/achievements/trophy.png";
import firstCasualWin from "../../res/images/achievements/medal.png";
import fiveCorrectAnswers from "../../res/images/achievements/5.png";
import competitivePoints from "../../res/images/achievements/summit.png";
import allCorrectCompetitive from "../../res/images/achievements/brainstorm.png";
import fastAnswer from "../../res/images/achievements/flash.png";

const LightTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

const useStyles = makeStyles((theme) =>
  createStyles({
    backButton: {
      marginRight: 8,
    },
    root: {
      flexGrow: 1,
    },
    grid: {
      marginLeft: "auto",
      marginRight: "auto",
      width: "100%",
      marginTop: 32,
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
    },
    image: {
      [theme.breakpoints.down("xs")]: {
        width: "100%",
      },
      [theme.breakpoints.up("sm")]: {
        width: 190,
      },
    },
  })
);

const FirstFormRow = () => {
  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <LightTooltip
          title={localStorage.getItem("firstCorrect") ? "First correct answer" : "Not yet found"}
        >
          <img
            className={classes.image}
            src={localStorage.getItem("firstCorrect") ? firstCorrect : question}
            alt="Not found yet"
          />
        </LightTooltip>
      </Grid>
      <Grid item xs={4}>
        <LightTooltip
          title={
            localStorage.getItem("firstCorrectWithoutHint")
              ? "First correct answer without hint"
              : "Not found yet"
          }
        >
          <img
            className={classes.image}
            src={
              localStorage.getItem("firstCorrectWithoutHint") ? firstCorrectWithoutHint : question
            }
            alt="Not found yet"
          />
        </LightTooltip>
      </Grid>
      <Grid item xs={4}>
        <LightTooltip
          title={localStorage.getItem("firstCasualWin") ? "First casual win" : "Not yet found"}
        >
          <img
            className={classes.image}
            src={localStorage.getItem("firstCasualWin") ? firstCasualWin : question}
            alt="Not found yet"
          />
        </LightTooltip>
      </Grid>
    </Grid>
  );
};

const SecondFormRow = () => {
  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <LightTooltip
          title={
            localStorage.getItem("firstCompetitiveWin") ? "First competitive win" : "Not yet found"
          }
        >
          <img
            className={classes.image}
            src={localStorage.getItem("firstCompetitiveWin") ? firstCompetitiveWin : question}
            alt="Not found yet"
          />
        </LightTooltip>
      </Grid>
      <Grid item xs={4}>
        <LightTooltip
          title={
            localStorage.getItem("fiveCorrectSameRunCasual")
              ? "Five correct answers in one casual game"
              : "Not found yet"
          }
        >
          <img
            className={classes.image}
            src={localStorage.getItem("fiveCorrectSameRunCasual") ? fiveCorrectAnswers : question}
            alt="Not found yet"
          />
        </LightTooltip>
      </Grid>
      <Grid item xs={4}>
        <LightTooltip
          title={
            localStorage.getItem("fiveCorrectSameRunCompetitive")
              ? "Five correct answers in one competitive game"
              : "Not found yet"
          }
        >
          <img
            className={classes.image}
            src={
              localStorage.getItem("fiveCorrectSameRunCompetitive") ? fiveCorrectAnswers : question
            }
            alt="Not found yet"
          />
        </LightTooltip>
      </Grid>
    </Grid>
  );
};

const ThirdFormRow = () => {
  const classes = useStyles();
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <LightTooltip
          title={
            localStorage.getItem("competitivePointsRun")
              ? "1000 points in a competitive run"
              : "Not found yet"
          }
        >
          <img
            className={classes.image}
            src={localStorage.getItem("competitivePointsRun") ? competitivePoints : question}
            alt="Not found yet"
          />
        </LightTooltip>
      </Grid>
      <Grid item xs={4}>
        <LightTooltip
          title={
            localStorage.getItem("allCorrectCompetitive")
              ? "Ten correct answers in one competitive run"
              : "Not found yet"
          }
        >
          <img
            className={classes.image}
            src={localStorage.getItem("allCorrectCompetitive") ? allCorrectCompetitive : question}
            alt="Not found yet"
          />
        </LightTooltip>
      </Grid>
      <Grid item xs={4}>
        <LightTooltip
          title={
            localStorage.getItem("fastAnswer")
              ? "You answered correctly in less than 2 seconds...lightning fast!"
              : "Not found yet"
          }
        >
          <img
            className={classes.image}
            src={localStorage.getItem("fastAnswer") ? fastAnswer : question}
            alt="Not found yet"
          />
        </LightTooltip>
      </Grid>
    </Grid>
  );
};

const Achievements: React.FC = () => {
  const classes = useStyles();

  const history = useHistory();

  return (
    <div className={classes.root}>
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
