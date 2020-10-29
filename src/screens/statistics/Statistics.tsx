import React, { useState } from "react";
import { AppBar, CircularProgress, IconButton, Toolbar, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { KeyboardBackspace } from "@material-ui/icons";
import { db } from "../../firebase/firebaseApp";

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

const Statistics: React.FC<StatisticsProps> = ({ setRoute }: StatisticsProps) => {
  const classes = useStyles();

  /**
   * Loading flag to enable waiting
   */
  const [loading, setLoading] = useState(true);

  /**
   * Retrieves the data from the databse to display into the pie-chart and graph
   */
  const retrieveStatistics = async () => {
    const snapshot = await db.collection("alltime-scores").get();
    console.log(snapshot);
    setLoading(false);
  };

  if (loading) {
    retrieveStatistics();
    return (
      <>
        <AppBar position="sticky">
          <Toolbar variant="dense">
            <IconButton
              className={classes.backButton}
              edge="start"
              color="inherit"
              aria-label="Back"
              onClick={() => setRoute("home")}
            >
              <KeyboardBackspace />
            </IconButton>

            <Typography>Spot the Lesion</Typography>
          </Toolbar>
        </AppBar>

        <CircularProgress />
      </>
    );
  }
  return (
    <>
      <AppBar position="sticky">
        <Toolbar variant="dense">
          <IconButton
            className={classes.backButton}
            edge="start"
            color="inherit"
            aria-label="Back"
            onClick={() => setRoute("home")}
          >
            <KeyboardBackspace />
          </IconButton>

          <Typography>Spot the Lesion</Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Statistics;
