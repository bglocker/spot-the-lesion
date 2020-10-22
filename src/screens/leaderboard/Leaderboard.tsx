import React, { useState } from "react";
import { AppBar, Grid, IconButton, Tab, Tabs, Typography, Toolbar } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { KeyboardBackspace } from "@material-ui/icons";
import TabPanel from "./tabPanel/TabPanel";
import { db } from "../../firebase/firebaseApp";
import BasicTable from "./Table";
import DbUtils from "../../utils/DbUtils";
import ScoreType from "../../utils/ScoreType";
import BasicGrid from "./BasicGrid";

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

  const [currentTabIndex, setCurrentTabIndex] = React.useState(-1);

  const [scores, setScores] = useState<ScoreType[]>([]);

  const dailyRef = db.collection(DbUtils.DAILY_LEADERBOARD);
  const monthlyRef = db.collection(DbUtils.MONTHLY_LEADERBOARD);
  const allTimeRef = db.collection(DbUtils.ALL_TIME_LEADERBOARD);

  async function createLeaderboard(tableIndex: number) {
    const table: string = DbUtils.tableNames[tableIndex];
    const date: Date = new Date();
    const results: ScoreType[] = [];
    let rankPosition = 1;

    const tableRef = db.collection(table);
    let snapshot;
    snapshot = tableRef;

    if (table !== DbUtils.ALL_TIME_LEADERBOARD) {
      snapshot = snapshot
        .where("year", "==", date.getFullYear())
        .where("month", "==", DbUtils.monthNames[date.getMonth()]);
      if (table === DbUtils.DAILY_LEADERBOARD) {
        snapshot = snapshot.where("day", "==", date.getDate());
      }
    }

    snapshot = await snapshot.orderBy("score", "desc").limit(10).get();
    snapshot.forEach((doc) => {
      const score: ScoreType = new ScoreType(rankPosition, doc.data().user, doc.data().score);
      results.push(score);
      rankPosition += 1;
    });
    setScores(results);
  }

  const onTabChange = (newIndex: number) => {
    setCurrentTabIndex(newIndex);
    createLeaderboard(newIndex);
  };

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

      <Grid container justify="center">
        <TabPanel currentIndex={currentTabIndex} index={0} dbRef={dailyRef} />

        <TabPanel currentIndex={currentTabIndex} index={1} dbRef={monthlyRef} />

        <TabPanel currentIndex={currentTabIndex} index={2} dbRef={allTimeRef} />
      </Grid>
      {BasicGrid(currentTabIndex)}
      {BasicTable(scores, currentTabIndex)}
    </>
  );
};

export default Leaderboard;
