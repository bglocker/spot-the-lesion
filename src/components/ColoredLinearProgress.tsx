import React from "react";
import { LinearProgress, LinearProgressProps, Theme } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";

interface ColoredLinearProgressProps extends LinearProgressProps {
  barColor?: string;
  barBackgroundColor?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: ({ barBackgroundColor }: ColoredLinearProgressProps) =>
        barBackgroundColor !== "" ? barBackgroundColor : "gray",
    },
    bar: {
      backgroundColor: ({ barColor }: ColoredLinearProgressProps) =>
        barColor !== "" ? barColor : theme.palette.primary.main,
    },
  })
);

const ColoredLinearProgress: React.FC<ColoredLinearProgressProps> = ({
  barColor,
  barBackgroundColor,
  ...props
}: ColoredLinearProgressProps) => {
  const classes = useStyles({ barColor });

  // Props are properly destructured and passed
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <LinearProgress classes={classes} {...props} />;
};

ColoredLinearProgress.defaultProps = {
  barColor: "",
  barBackgroundColor: "",
};

export default ColoredLinearProgress;
