import React from "react";
import { LinearProgress, LinearProgressProps } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";

interface StylesProps {
  barColor?: string;
  barBackgroundColor?: string;
}

interface ColoredLinearProgressProps extends LinearProgressProps {
  barColor?: string;
  barBackgroundColor?: string;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: (props: StylesProps) => props.barBackgroundColor || "gray",
    },
    bar: {
      backgroundColor: (props: StylesProps) => props.barColor || theme.palette.primary.main,
    },
  })
);

const ColoredLinearProgress: React.FC<ColoredLinearProgressProps> = ({
  barColor,
  barBackgroundColor,
  ...other
}: ColoredLinearProgressProps) => {
  const classes = useStyles({ barColor, barBackgroundColor });

  // Props are properly destructured and passed
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <LinearProgress classes={classes} {...other} />;
};

export default ColoredLinearProgress;
