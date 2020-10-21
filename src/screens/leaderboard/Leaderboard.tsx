import React from "react";
import { AppBar, Grid, IconButton, Tab, Tabs, Typography, Toolbar } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { KeyboardBackspace } from "@material-ui/icons";
import TabPanel from "./tabPanel/TabPanel";
import { db } from "../../firebase/firebaseApp";

const useStyles = makeStyles(() =>
  createStyles({
    backButton: {
      marginRight: 8,
    },
    appBar: {
      alignItems: "center",
      backgroundColor: "#003B46",
    },
    tabIndicator: {
      backgroundColor: "#C4DFE6",
    },
    tab: {
      fontSize: "1.5rem",
    },
    container: {
      height: "100%",
    },
  })
);

const Leaderboard: React.FC<LeaderboardProps> = ({ setRoute }: LeaderboardProps) => {
  const classes = useStyles();

  const [currentTabIndex, setCurrentTabIndex] = React.useState(0);

  const onTabChange = (newIndex: number) => {
    setCurrentTabIndex(newIndex);
  };

  const dailyRef = db.collection("daily-scores");
  const monthlyRef = db.collection("monthly-scores");
  const allTimeRef = db.collection("all-time-scores");

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

      <AppBar className={classes.appBar} position="sticky">
        <Tabs
          value={currentTabIndex}
          onChange={(_, newValue) => onTabChange(newValue)}
          aria-label="Leaderboards"
          classes={{ indicator: classes.tabIndicator }}
        >
          <Tab
            className={classes.tab}
            label="Daily"
            id="leaderboard-0"
            aria-controls="leaderboard-view-0"
          />

          <Tab
            className={classes.tab}
            label="Monthly"
            id="leaderboard-1"
            aria-controls="leaderboard-view-1"
          />

          <Tab
            className={classes.tab}
            label="All Time"
            id="leaderboard-2"
            aria-controls="leaderboard-view-2"
          />
        </Tabs>
      </AppBar>

      <div className={classes.container}>
        <Grid container justify="center">
          <TabPanel currentIndex={currentTabIndex} index={0} dbRef={dailyRef} />

          <TabPanel currentIndex={currentTabIndex} index={1} dbRef={monthlyRef} />

          <TabPanel currentIndex={currentTabIndex} index={2} dbRef={allTimeRef} />
        </Grid>
      </div>
    </>
  );
};

export default Leaderboard;
