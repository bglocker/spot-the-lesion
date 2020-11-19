import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    backButton: {
      marginRight: 8,
    },
    container: {
      height: "100%",
    },
  })
);

const AdminAuth: React.FC = () => {
  const classes = useStyles();

  return (
    <>
      <AppBar position="sticky">
        <Toolbar variant="dense">
          <Typography>Spot the Lesion</Typography>
        </Toolbar>
      </AppBar>

      <div className={classes.container} />
    </>
  );
};

export default AdminAuth;
