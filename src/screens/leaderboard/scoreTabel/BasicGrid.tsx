import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  style: {
    fontSize: "2.5rem",
    fontWeight: "bold",
  },
});

export default function BasicGrid(usedOnce: number) {
  const classes = useStyles();
  if (usedOnce === 0) {
    return (
      <Grid container justify="center">
        <Typography className={classes.style}>SELECT A CATEGORY</Typography>
      </Grid>
    );
  }
  return null;
}
