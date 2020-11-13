import React from "react";
import { Button, Card, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import ColoredLinearProgress from "../../components/ColoredLinearProgress";

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      margin: 8,
      padding: 8,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      [theme.breakpoints.down("sm")]: {
        width: "80vw",
        maxWidth: "60vh",
      },
      [theme.breakpoints.up("md")]: {
        width: "70vh",
        maxWidth: "70vw",
      },
    },
    timer: {
      marginBottom: 8,
      fontSize: "1.5rem",
    },
  })
);

const GameTopBar: React.FC<GameTopBarProps> = ({
  gameMode,
  showHintDisabled,
  onShowHint,
  roundTime,
  timerColor,
}: GameTopBarProps) => {
  const classes = useStyles();

  const content = () => {
    if (gameMode === "casual") {
      return (
        <Button
          variant="contained"
          color="secondary"
          disabled={showHintDisabled}
          onClick={onShowHint}
        >
          Show hint
        </Button>
      );
    }

    const time = (roundTime / 1000).toFixed(1);

    return (
      <>
        <Typography className={classes.timer} style={{ color: timerColor }}>
          Time remaining: {time}s
        </Typography>

        <ColoredLinearProgress
          barColor={timerColor}
          variant="determinate"
          value={roundTime / 100}
        />
      </>
    );
  };

  return <Card className={classes.container}>{content()}</Card>;
};

export default GameTopBar;
