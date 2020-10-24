import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  style: {
    fontSize: "150%",
    fontWeight: "bold",
    fontFamily: "segoe UI",
  },
});

const TableGrid: React.FC<TableGridProps> = ({ firstTimeOpened }: TableGridProps) => {
  const classes = useStyles();

  if (firstTimeOpened) {
    return (
      <Grid container justify="center">
        <Typography className={classes.style}>SELECT A CATEGORY</Typography>
      </Grid>
    );
  }
  return null;
};

export default TableGrid;
