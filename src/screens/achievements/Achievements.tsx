import React, { useState } from "react";
import {
  AppBar,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Theme,
  Toolbar,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { KeyboardBackspace } from "@material-ui/icons";
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
    fontSize: 14,
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
    container: {
      paddingLeft: "0px",
      paddingRight: "0px",
    },
    title: {
      fontWeight: "bold",
      textAlign: "center",
      fontSize: "26px",
    },
    text: {
      textAlign: "center",
      fontSize: "16px",
    },
  })
);

const Achievements: React.FC<AchievementsProps> = ({ setRoute }: AchievementsProps) => {
  const classes = useStyles();

  const [openFirst, setOpenFirst] = useState(false);
  const [openSecond, setOpenSecond] = useState(false);
  const [openThird, setOpenThird] = useState(false);
  const [openFourth, setOpenFourth] = useState(false);
  const [openFifth, setOpenFifth] = useState(false);
  const [openSixth, setOpenSixth] = useState(false);
  const [openSeventh, setOpenSeventh] = useState(false);
  const [openEighth, setOpenEighth] = useState(false);
  const [openNinth, setOpenNinth] = useState(false);
  const [openTenth, setOpenTenth] = useState(false);
  const [openEleventh, setOpenEleventh] = useState(false);
  const [openTwelfth, setOpenTwelfth] = useState(false);

  const handleClickOpenFirst = () => {
    setOpenFirst(true);
  };

  const handleCloseFirst = () => {
    setOpenFirst(false);
  };

  const handleClickOpenSecond = () => {
    setOpenSecond(true);
  };

  const handleCloseSecond = () => {
    setOpenSecond(false);
  };

  const handleClickOpenThird = () => {
    setOpenThird(true);
  };

  const handleCloseThird = () => {
    setOpenThird(false);
  };

  const handleClickOpenFourth = () => {
    setOpenFourth(true);
  };

  const handleCloseFourth = () => {
    setOpenFourth(false);
  };

  const handleClickOpenFifth = () => {
    setOpenFifth(true);
  };

  const handleCloseFifth = () => {
    setOpenFifth(false);
  };

  const handleClickOpenSixth = () => {
    setOpenSixth(true);
  };

  const handleCloseSixth = () => {
    setOpenSixth(false);
  };

  const handleClickOpenSeventh = () => {
    setOpenSeventh(true);
  };

  const handleCloseSeventh = () => {
    setOpenSeventh(false);
  };

  const handleClickOpenEighth = () => {
    setOpenEighth(true);
  };

  const handleCloseEighth = () => {
    setOpenEighth(false);
  };

  const handleClickOpenNinth = () => {
    setOpenNinth(true);
  };

  const handleCloseNinth = () => {
    setOpenNinth(false);
  };

  const handleClickOpenTenth = () => {
    setOpenTenth(true);
  };

  const handleCloseTenth = () => {
    setOpenTenth(false);
  };

  const handleClickOpenEleventh = () => {
    setOpenEleventh(true);
  };

  const handleCloseEleventh = () => {
    setOpenEleventh(false);
  };

  const handleClickOpenTwelfth = () => {
    setOpenTwelfth(true);
  };

  const handleCloseTwelfth = () => {
    setOpenTwelfth(false);
  };

  const FirstFormRow = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <LightTooltip
            title={localStorage.getItem("firstCorrect") ? "First Step" : "Not found yet"}
          >
            <Container className={classes.container} onClick={handleClickOpenFirst}>
              <img
                className={classes.image}
                src={localStorage.getItem("firstCorrect") ? firstCorrect : question}
                alt="Not found yet"
              />
              <Dialog open={openFirst} onClose={handleCloseFirst}>
                <DialogTitle>
                  <Typography className={classes.title}>
                    {localStorage.getItem("firstCorrect") ? "First Step" : "Not found yet"}
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <Typography className={classes.text}>
                    {localStorage.getItem("firstCorrect")
                      ? "Congratulations! You have spotted your first lesion. How many more can you spot?"
                      : "Play more in order to unlock this achievement"}
                  </Typography>
                </DialogContent>
              </Dialog>
            </Container>
          </LightTooltip>
        </Grid>
        <Grid item xs={4}>
          <LightTooltip
            title={
              localStorage.getItem("firstCorrectWithoutHint")
                ? "Independent Spotter"
                : "Not found yet"
            }
          >
            <Container className={classes.container} onClick={handleClickOpenSecond}>
              <img
                className={classes.image}
                src={
                  localStorage.getItem("firstCorrectWithoutHint")
                    ? firstCorrectWithoutHint
                    : question
                }
                alt="Not found yet"
              />
              <Dialog open={openSecond} onClose={handleCloseSecond}>
                <DialogTitle>
                  <Typography className={classes.title}>
                    {localStorage.getItem("firstCorrectWithoutHint")
                      ? "Independent Spotter"
                      : "Not found yet"}
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <Typography className={classes.text}>
                    {localStorage.getItem("firstCorrectWithoutHint")
                      ? "Getting better, eh? You have spotted your first lesion without the help of a hint."
                      : "Play more in order to unlock this achievement"}
                  </Typography>
                </DialogContent>
              </Dialog>
            </Container>
          </LightTooltip>
        </Grid>
        <Grid item xs={4}>
          <LightTooltip
            title={localStorage.getItem("firstCasualWin") ? "Casually Winning" : "Not found yet"}
          >
            <Container className={classes.container} onClick={handleClickOpenThird}>
              <img
                className={classes.image}
                src={localStorage.getItem("firstCasualWin") ? firstCasualWin : question}
                alt="Not found yet"
              />
              <Dialog open={openThird} onClose={handleCloseThird}>
                <DialogTitle>
                  <Typography className={classes.title}>
                    {localStorage.getItem("firstCasualWin") ? "Casually Winning" : "Not found yet"}
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <Typography className={classes.text}>
                    {localStorage.getItem("firstCasualWin")
                      ? "Congratulations! You have won your first casual game. How about a new challenge?"
                      : "Play more in order to unlock this achievement"}
                  </Typography>
                </DialogContent>
              </Dialog>
            </Container>
          </LightTooltip>
        </Grid>
      </Grid>
    );
  };

  const SecondFormRow = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <LightTooltip
            title={
              localStorage.getItem("firstCompetitiveWin") ? "Competitive Winner" : "Not found yet"
            }
          >
            <Container className={classes.container} onClick={handleClickOpenFourth}>
              <img
                className={classes.image}
                src={localStorage.getItem("firstCompetitiveWin") ? firstCompetitiveWin : question}
                alt="Not found yet"
              />
              <Dialog open={openFourth} onClose={handleCloseFourth}>
                <DialogTitle>
                  <Typography className={classes.title}>
                    {localStorage.getItem("firstCompetitiveWin")
                      ? "Competitive Winner"
                      : "Not found yet"}
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <Typography className={classes.text}>
                    {localStorage.getItem("firstCompetitiveWin")
                      ? "Who said machines have outsmarted humans? You have beaten the AI in a race against time!"
                      : "Play more in order to unlock this achievement"}
                  </Typography>
                </DialogContent>
              </Dialog>
            </Container>
          </LightTooltip>
        </Grid>
        <Grid item xs={4}>
          <LightTooltip
            title={
              localStorage.getItem("fiveCorrectSameRunCasual")
                ? "Going the distance"
                : "Not found yet"
            }
          >
            <Container className={classes.container} onClick={handleClickOpenFifth}>
              <img
                className={classes.image}
                src={
                  localStorage.getItem("fiveCorrectSameRunCasual") ? fiveCorrectAnswers : question
                }
                alt="Not found yet"
              />
              <Dialog open={openFifth} onClose={handleCloseFifth}>
                <DialogTitle>
                  <Typography className={classes.title}>
                    {localStorage.getItem("fiveCorrectSameRunCasual")
                      ? "Going the distance"
                      : "Not found yet"}
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <Typography className={classes.text}>
                    {localStorage.getItem("fiveCorrectSameRunCasual")
                      ? "You are getting the hang of it! You have spotted five lesions in the same casual run."
                      : "Play more in order to unlock this achievement"}
                  </Typography>
                </DialogContent>
              </Dialog>
            </Container>
          </LightTooltip>
        </Grid>
        <Grid item xs={4}>
          <LightTooltip
            title={
              localStorage.getItem("fiveCorrectSameRunCompetitive")
                ? "Master Spotter"
                : "Not found yet"
            }
          >
            <Container className={classes.container} onClick={handleClickOpenSixth}>
              <img
                className={classes.image}
                src={
                  localStorage.getItem("fiveCorrectSameRunCompetitive")
                    ? fiveCorrectAnswers
                    : question
                }
                alt="Not found yet"
              />
              <Dialog open={openSixth} onClose={handleCloseSixth}>
                <DialogTitle>
                  <Typography className={classes.title}>
                    {localStorage.getItem("fiveCorrectSameRunCompetitive")
                      ? "Master Spotter"
                      : "Not found yet"}
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <Typography className={classes.text}>
                    {localStorage.getItem("fiveCorrectSameRunCompetitive")
                      ? "An impressive run! You have spotted five lesions in the same competitive run"
                      : "Play more in order to unlock this achievement"}
                  </Typography>
                </DialogContent>
              </Dialog>
            </Container>
          </LightTooltip>
        </Grid>
      </Grid>
    );
  };

  const ThirdFormRow = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <LightTooltip
            title={
              localStorage.getItem("competitivePointsRun") ? "IT'S OVER 1000!!!" : "Not found yet"
            }
          >
            <Container className={classes.container} onClick={handleClickOpenSeventh}>
              <img
                className={classes.image}
                src={localStorage.getItem("competitivePointsRun") ? competitivePoints : question}
                alt="Not found yet"
              />
              <Dialog open={openSeventh} onClose={handleCloseSeventh}>
                <DialogTitle>
                  <Typography className={classes.title}>
                    {localStorage.getItem("competitivePointsRun")
                      ? "IT'S OVER 1000!!!"
                      : "Not found yet"}
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <Typography className={classes.text}>
                    {localStorage.getItem("competitivePointsRun")
                      ? "1000 ponts?! You really have an eye for spotting lesions!"
                      : "Play more in order to unlock this achievement"}
                  </Typography>
                </DialogContent>
              </Dialog>
            </Container>
          </LightTooltip>
        </Grid>
        <Grid item xs={4}>
          <LightTooltip
            title={
              localStorage.getItem("allCorrectCompetitive") ? "Perfectionist" : "Not found yet"
            }
          >
            <Container className={classes.container} onClick={handleClickOpenEighth}>
              <img
                className={classes.image}
                src={
                  localStorage.getItem("allCorrectCompetitive") ? allCorrectCompetitive : question
                }
                alt="Not found yet"
              />
              <Dialog open={openEighth} onClose={handleCloseEighth}>
                <DialogTitle>
                  <Typography className={classes.title}>
                    {localStorage.getItem("allCorrectCompetitive")
                      ? "Perfectionist"
                      : "Not found yet"}
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <Typography className={classes.text}>
                    {localStorage.getItem("allCorrectCompetitive")
                      ? "You got them all right! Have you considered a career in medicine?"
                      : "Play more in order to unlock this achievement"}
                  </Typography>
                </DialogContent>
              </Dialog>
            </Container>
          </LightTooltip>
        </Grid>
        <Grid item xs={4}>
          <LightTooltip title={localStorage.getItem("fastAnswer") ? "The flash!" : "Not found yet"}>
            <Container className={classes.container} onClick={handleClickOpenNinth}>
              <img
                className={classes.image}
                src={localStorage.getItem("fastAnswer") ? fastAnswer : question}
                alt="Not found yet"
              />
              <Dialog open={openNinth} onClose={handleCloseNinth}>
                <DialogTitle>
                  <Typography className={classes.title}>
                    {localStorage.getItem("fastAnswer") ? "The flash!" : "Not found yet"}
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <Typography className={classes.text}>
                    {localStorage.getItem("fastAnswer")
                      ? "You spotted a lesion in less than 2 seconds! Are you even human?"
                      : "Play more in order to unlock this achievement"}
                  </Typography>
                </DialogContent>
              </Dialog>
            </Container>
          </LightTooltip>
        </Grid>
      </Grid>
    );
  };

  const FourthFormRow = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <LightTooltip
            title={
              localStorage.getItem("competitivePointsRun") ? "IT'S OVER 1000!!!" : "Not found yet"
            }
          >
            <Container className={classes.container} onClick={handleClickOpenTenth}>
              <img
                className={classes.image}
                src={localStorage.getItem("competitivePointsRun") ? competitivePoints : question}
                alt="Not found yet"
              />
              <Dialog open={openTenth} onClose={handleCloseTenth}>
                <DialogTitle>
                  <Typography className={classes.title}>
                    {localStorage.getItem("competitivePointsRun")
                      ? "IT'S OVER 1000!!!"
                      : "Not found yet"}
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <Typography className={classes.text}>
                    {localStorage.getItem("competitivePointsRun")
                      ? "1000 ponts?! You really have an eye for spotting lesions!"
                      : "Play more in order to unlock this achievement"}
                  </Typography>
                </DialogContent>
              </Dialog>
            </Container>
          </LightTooltip>
        </Grid>
        <Grid item xs={4}>
          <LightTooltip
            title={
              localStorage.getItem("allCorrectCompetitive") ? "Perfectionist" : "Not found yet"
            }
          >
            <Container className={classes.container} onClick={handleClickOpenEleventh}>
              <img
                className={classes.image}
                src={
                  localStorage.getItem("allCorrectCompetitive") ? allCorrectCompetitive : question
                }
                alt="Not found yet"
              />
              <Dialog open={openEleventh} onClose={handleCloseEleventh}>
                <DialogTitle>
                  <Typography className={classes.title}>
                    {localStorage.getItem("allCorrectCompetitive")
                      ? "Perfectionist"
                      : "Not found yet"}
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <Typography className={classes.text}>
                    {localStorage.getItem("allCorrectCompetitive")
                      ? "You got them all right! Have you considered a career in medicine?"
                      : "Play more in order to unlock this achievement"}
                  </Typography>
                </DialogContent>
              </Dialog>
            </Container>
          </LightTooltip>
        </Grid>
        <Grid item xs={4}>
          <LightTooltip title={localStorage.getItem("fastAnswer") ? "The flash!" : "Not found yet"}>
            <Container className={classes.container} onClick={handleClickOpenTwelfth}>
              <img
                className={classes.image}
                src={localStorage.getItem("fastAnswer") ? fastAnswer : question}
                alt="Not found yet"
              />
              <Dialog open={openTwelfth} onClose={handleCloseTwelfth}>
                <DialogTitle>
                  <Typography className={classes.title}>
                    {localStorage.getItem("fastAnswer") ? "The flash!" : "Not found yet"}
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <Typography className={classes.text}>
                    {localStorage.getItem("fastAnswer")
                      ? "You spotted a lesion in less than 2 seconds! Are you even human?"
                      : "Play more in order to unlock this achievement"}
                  </Typography>
                </DialogContent>
              </Dialog>
            </Container>
          </LightTooltip>
        </Grid>
      </Grid>
    );
  };

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
          <Grid container item xs={12} spacing={3}>
            <FourthFormRow />
          </Grid>
        </Grid>
      </>
    </div>
  );
};

export default Achievements;
