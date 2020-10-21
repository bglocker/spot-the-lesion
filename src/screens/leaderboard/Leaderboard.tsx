import React, { useState } from "react";
import { AppBar, Grid, Tab, Tabs } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import TabPanel from "./tabPanel/TabPanel";
import { db } from "../../firebase/firebaseApp";
import BasicTable from "./Table";

interface ScoreType {
  user: string;
  score: number;
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const tableNames = ["daily-scores", "monthly-scores", "alltime-scores"];

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

const Leaderboard: React.FC<LeaderboardProps> = () => {
  const dailyRef = db.collection("daily-scores");
  const monthlyRef = db.collection("monthly-scores");
  const allTimeRef = db.collection("all-time-scores");

  const styles = useStyles();

  const [currentTabIndex, setCurrentTabIndex] = React.useState(-1);

  const [scores, setScores] = useState<ScoreType[]>([]);

  async function createLeaderboard(tableIndex: number) {
    const table: string = tableNames[tableIndex];
    const date: Date = new Date();
    const results: ScoreType[] = [];

    const tableRef = db.collection(table);
    let snapshot;
    snapshot = tableRef;

    if (table !== "alltime-scores") {
      snapshot = snapshot
        .where("year", "==", date.getFullYear())
        .where("month", "==", monthNames[date.getMonth()]);
      if (table === "daily-scores") {
        snapshot = snapshot.where("day", "==", date.getDate());
      }
    }

    snapshot = await snapshot.orderBy("score", "desc").limit(10).get();
    snapshot.forEach((doc) => {
      const score: ScoreType = { user: doc.data().user, score: doc.data().score };
      results.push(score);
    });
    setScores(results);
  }

  const handleChange = (_: React.ChangeEvent<unknown>, newIndex: number) => {
    setCurrentTabIndex(newIndex);
    createLeaderboard(newIndex);
  };

  return (
    <div>
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
      {BasicTable(scores)}
    </div>
  );
};

export default Leaderboard;
