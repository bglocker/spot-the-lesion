import React from "react";
import { Button, Card, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { TwitterIcon, TwitterShareButton } from "react-share";
import ScoreWithIncrement from "../../components/ScoreWithIncrement";
import LoadingButton from "../../components/LoadingButton";
import colors from "../../res/colors";
import constants from "../../res/constants";

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      [theme.breakpoints.up("md")]: {
        flex: 1,
        height: "100%",
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
      width: "100%",
      display: "flex",
      [theme.breakpoints.down("sm")]: {
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

const GameSideBar: React.FC<GameSideBarProps> = ({
  gameMode,
  round,
  inRound,
  roundLoading,
  playerScore,
  playerRoundScore,
  aiScore,
  aiRoundScore,
  onStartRound,
  onSubmitClick,
}: GameSideBarProps) => {
  const classes = useStyles();

  const endingText = () => {
    if (gameMode === "casual" || round < constants.rounds || roundLoading || inRound) {
      return null;
    }

    const endPlayerScore = playerScore + playerRoundScore;
    const endAiScore = aiScore + aiRoundScore;

    let text: string;
    let color: string;

    if (endPlayerScore > endAiScore) {
      text = "You won!";
      color = colors.playerWon;
    } else if (endPlayerScore < endAiScore) {
      text = "AI won!";
      color = colors.playerLost;
    } else {
      text = "It was a draw!";
      color = colors.draw;
    }

    return (
      <Typography className={classes.cardText} style={{ color }}>
        {text}
      </Typography>
    );
  };

  const startRoundButton = () => {
    if (gameMode === "competitive" && round === constants.rounds) {
      return null;
    }

    return (
      <LoadingButton
        variant="contained"
        color="primary"
        size="large"
        loading={roundLoading}
        disabled={inRound}
        onClick={onStartRound}
      >
        {round === 0 ? "Start" : "Next"}
      </LoadingButton>
    );
  };

  const submitShareButtons = () => {
    if (
      (gameMode === "casual" && round === 0) ||
      (gameMode === "competitive" && round < constants.rounds) ||
      roundLoading ||
      inRound
    ) {
      return null;
    }

    return (
      <div className={classes.submitShareContainer}>
        <Button variant="contained" color="primary" size="large" onClick={onSubmitClick}>
          Submit
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
            showIncrement={round > 0 && !roundLoading && !inRound}
          />

          <Typography className={classes.cardText}>vs</Typography>

          <ScoreWithIncrement
            player="AI"
            score={aiScore}
            increment={aiRoundScore}
            showIncrement={round > 0 && !roundLoading && !inRound}
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
