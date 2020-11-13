import React from "react";
import { Button, Card, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { TwitterIcon, TwitterShareButton } from "react-share";
import { useSnackbar } from "notistack";
import ScoreWithIncrement from "../../components/ScoreWithIncrement";
import LoadingButton from "../../components/LoadingButton";

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      [theme.breakpoints.up("md")]: {
        height: "100%",
        flex: 1,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      },
    },
    card: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      alignContent: "center",
      margin: 8,
      padding: 8,
      [theme.breakpoints.down("sm")]: {
        width: "80vw",
        maxWidth: "60vh",
      },
      [theme.breakpoints.up("md")]: {
        minWidth: "20vw",
      },
    },
    scoresContainer: {
      display: "flex",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly",
      },
      [theme.breakpoints.up("md")]: {
        flexDirection: "column",
        alignItems: "center",
      },
    },
    cardText: {
      [theme.breakpoints.down("sm")]: {
        fontSize: "1.5rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "2rem",
      },
    },
    submitShareContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
  })
);

const NUM_ROUNDS = 2;

const DEFAULT_COLOUR = "#gray";
const INVALID_COLOUR = "red";
const VALID_COLOUR = "green";

const GameSideBar: React.FC<GameSideBarProps> = ({
  gameMode,
  round,
  inRound,
  loading,
  playerScore,
  playerRoundScore,
  aiScore,
  aiRoundScore,
  onStartRound,
  onShowSubmit,
}: GameSideBarProps) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const competitiveWinAchievement = () => {
    if (!localStorage.getItem("firstCompetitiveWin")) {
      enqueueSnackbar("Achievement! First competitive win!", {
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
        variant: "success",
        autoHideDuration: 3000,
      });

      localStorage.setItem("firstCompetitiveWin", "true");
    }
  };

  const endingText = () => {
    if (gameMode === "casual" || round < NUM_ROUNDS || inRound) {
      return null;
    }

    const endPlayerScore = playerScore + playerRoundScore;
    const endAiScore = aiScore + aiRoundScore;

    let text: string;
    let color: string;

    if (endPlayerScore > endAiScore) {
      competitiveWinAchievement();

      text = "You won!";
      color = VALID_COLOUR;
    } else if (endPlayerScore < endAiScore) {
      text = "AI won!";
      color = INVALID_COLOUR;
    } else {
      text = "It was a draw!";
      color = DEFAULT_COLOUR;
    }

    return (
      <Typography className={classes.cardText} style={{ color }}>
        {text}
      </Typography>
    );
  };

  const startRoundButton = () => {
    if (gameMode === "competitive" && !(round < NUM_ROUNDS)) {
      return null;
    }

    return (
      <LoadingButton
        loading={loading}
        buttonDisabled={inRound}
        onButtonClick={onStartRound}
        buttonText={round === 0 ? "Start" : "Next"}
      />
    );
  };

  const submitShareButtons = () => {
    if (
      (gameMode === "casual" && round === 0) ||
      (gameMode === "competitive" && round < NUM_ROUNDS) ||
      inRound
    ) {
      return null;
    }

    return (
      <div className={classes.submitShareContainer}>
        <Button variant="contained" color="primary" size="large" onClick={onShowSubmit}>
          Submit Score
        </Button>

        <TwitterShareButton
          url="http://cb3618.pages.doc.ic.ac.uk/spot-the-lesion"
          title={`I got ${playerScore} points in Spot-the-Lesion! Can you beat my score?`}
        >
          <TwitterIcon size="50px" round />
        </TwitterShareButton>
      </div>
    );
  };

  return (
    <div className={classes.container}>
      <Card className={classes.card}>
        <div className={classes.scoresContainer}>
          <ScoreWithIncrement
            player="You"
            score={playerScore}
            increment={playerRoundScore}
            showIncrement={round > 0 && !inRound}
          />

          <Typography className={classes.cardText}>vs</Typography>

          <ScoreWithIncrement
            player="AI"
            score={aiScore}
            increment={aiRoundScore}
            showIncrement={round > 0 && !inRound}
          />
        </div>

        {endingText()}

        {startRoundButton()}

        {submitShareButtons()}
      </Card>
    </div>
  );
};

export default GameSideBar;
