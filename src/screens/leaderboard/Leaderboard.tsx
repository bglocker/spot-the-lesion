import React from "react";
import { AppBar, Grid, Tab, Tabs } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import TabPanel from "./tabPanel/TabPanel";
import { db } from "../../firebase/firebaseApp";

const useStyles = makeStyles(() =>
  createStyles({
    appbar: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#003B46",
    },
    indicator: {
      backgroundColor: "#C4DFE6",
    },
    tab: {
      fontFamily: "segoe UI",
      fontSize: 24,
    },
  })
);

const Leaderboard: React.FC<LeaderboardProps> = ({ setBackButton }: LeaderboardProps) => {
  const styles = useStyles();

  const [currentTabIndex, setCurrentTabIndex] = React.useState(0);

  const handleChange = (_: React.ChangeEvent<unknown>, newIndex: number) => {
    setCurrentTabIndex(newIndex);
  };

  const dailyRef = db.collection("daily-scores");
  const monthlyRef = db.collection("monthly-scores");
  const allTimeRef = db.collection("all-time-scores");

  setBackButton(true);

  return (
    <Grid container justify="center">
      <AppBar className={styles.appbar} position="static">
        <Tabs
          value={currentTabIndex}
          onChange={handleChange}
          aria-label="Leaderboards"
          classes={{ indicator: styles.indicator }}
        >
          <Tab
            className={styles.tab}
            label="Daily"
            id="leaderboard-0"
            aria-controls="leaderboard-view-0"
          />
          <Tab
            className={styles.tab}
            label="Monthly"
            id="leaderboard-1"
            aria-controls="leaderboard-view-1"
          />
          <Tab
            className={styles.tab}
            label="All Time"
            id="leaderboard-2"
            aria-controls="leaderboard-view-2"
          />
        </Tabs>
      </AppBar>
      <TabPanel currentIndex={currentTabIndex} index={0} dbRef={dailyRef} />
      <TabPanel currentIndex={currentTabIndex} index={1} dbRef={monthlyRef} />
      <TabPanel currentIndex={currentTabIndex} index={2} dbRef={allTimeRef} />
    </Grid>
  );
};

export default Leaderboard;
