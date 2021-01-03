import React, { useMemo, useState } from "react";
import { Button, Card, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { ScoreWithIncrement, LoadingButton, HideFragment } from "../../components";
import colors from "../../res/colors";

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
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    button: {
      margin: "5px",
    },
  })
);

const GameSideBar: React.FC<GameSideBarProps> = ({
  gameMode,
  gameStarted,
  gameEnded,
  roundEnded,
  roundLoading,
  showIncrement,
  onStartRound,
  onSubmitClick,
  onShareClick,
  onChallenge,
  playerScore,
  aiScore,
}: GameSideBarProps) => {
  const [challengeLoading, setChallengeLoading] = useState(false);

  const classes = useStyles();

  const [gameEndText, gameEndColor] = useMemo(() => {
    const playerScoreFull = playerScore.total + playerScore.round;
    const aiScoreFull = aiScore.total + aiScore.round;

    if (playerScoreFull > aiScoreFull) {
      return ["You won!", colors.playerWon];
    }

    if (playerScoreFull < aiScoreFull) {
      return ["AI won!", colors.playerLost];
    }

    return ["It was a draw!", colors.draw];
  }, [playerScore, aiScore]);

  const onChallengeClick = async () => {
    try {
      setChallengeLoading(true);

      await onChallenge();
    } finally {
      setChallengeLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      <Card className={classes.card}>
        <div className={classes.scoresContainer}>
          <ScoreWithIncrement
            player="You"
            score={playerScore.total}
            increment={playerScore.round}
            showIncrement={showIncrement}
          />

          <Typography className={classes.cardText}>vs</Typography>

          <ScoreWithIncrement
            player="AI"
            score={aiScore.total}
            increment={aiScore.round}
            showIncrement={showIncrement}
          />
        </div>

        <HideFragment hide={!gameEnded}>
          <Typography className={classes.cardText} style={{ color: gameEndColor }}>
            {gameEndText}
          </Typography>
        </HideFragment>

        <HideFragment hide={gameEnded}>
          <LoadingButton
            className={classes.button}
            variant="contained"
            color="primary"
            size="large"
            loading={roundLoading}
            disabled={gameStarted && !roundEnded}
            onClick={onStartRound}
          >
            {gameStarted ? "Next" : "Start"}
          </LoadingButton>
        </HideFragment>

        <HideFragment
          hide={(gameMode === "competitive" && !gameEnded) || !roundEnded || roundLoading}
        >
          <div className={classes.submitShareContainer}>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              size="large"
              onClick={onSubmitClick}
            >
              Submit
            </Button>

            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              size="large"
              onClick={onShareClick}
            >
              Share
            </Button>
          </div>
        </HideFragment>

        <HideFragment hide={!gameEnded}>
          <LoadingButton
            className={classes.button}
            variant="contained"
            color="primary"
            size="large"
            loading={challengeLoading}
            onClick={onChallengeClick}
          >
            Challenge friend
          </LoadingButton>
        </HideFragment>
      </Card>
    </div>
  );
};

export default GameSideBar;
