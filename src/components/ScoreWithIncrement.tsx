import React from "react";
import { Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const VALID_COLOUR = "green";
const INVALID_COLOUR = "red";

interface StylesProps {
  increment: number;
  showIncrement: boolean;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    text: {
      [theme.breakpoints.down("sm")]: {
        fontSize: "1.5rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "2rem",
      },
    },
    incrementText: {
      color: (props: StylesProps) => (props.increment > 0 ? VALID_COLOUR : INVALID_COLOUR),
      display: (props: StylesProps) => (props.showIncrement ? "inline" : "none"),
    },
  })
);

const ScoreWithIncrement: React.FC<ScoreWithIncrementProps> = ({
  player,
  score,
  increment,
  showIncrement,
}: ScoreWithIncrementProps) => {
  const classes = useStyles({ increment, showIncrement });

  return (
    <Typography className={classes.text}>
      {player}: {score} <span className={classes.incrementText}>+{increment}</span>
    </Typography>
  );
};

export default ScoreWithIncrement;
