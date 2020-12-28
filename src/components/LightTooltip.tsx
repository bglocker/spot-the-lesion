import React from "react";
import { Tooltip, TooltipProps } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    arrow: {
      color: theme.palette.common.white,
    },
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 14,
    },
  })
);

const LightTooltip: React.FC<TooltipProps> = ({ children, ...other }: TooltipProps) => {
  const classes = useStyles();

  return (
    // Props are properly destructured and passed
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Tooltip classes={classes} {...other}>
      {children}
    </Tooltip>
  );
};

export default LightTooltip;
