import React, { useState } from "react";
import { AppBar, IconButton, Tab, Tabs, Typography, Toolbar } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { KeyboardBackspace } from "@material-ui/icons";
import { db } from "../../firebase/firebaseApp";
import BasicTable from "./scoreTabel/BasicTable";
import DbUtils from "../../utils/DbUtils";
import ScoreType from "../../utils/ScoreType";
import BasicGrid from "./scoreTabel/tableGrid/TableGrid";

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
  const [firstTimeOpened, setFirstTimeOpened] = React.useState(true);

  const [scores, setScores] = useState<ScoreType[]>([]);

  function selectRowColour(rowIndex: number) {
    switch (rowIndex) {
      case 1:
        return DbUtils.GOLD;
      case 2:
        return DbUtils.SILVER;
      case 3:
        return DbUtils.BRONZE;
      default:
        return DbUtils.DEFAULT_ROW_COLOUR;
    }
  }

  async function createLeaderboard(tableIndex: number) {
    const table: string = DbUtils.tableNames[tableIndex];
    const date: Date = new Date();
    const results: ScoreType[] = [];
    let rankPosition = 0;
    let rowColour = "black";
    let medal = true;
    let prevScore = -1;
    let currentScore;

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

    snapshot = await snapshot.orderBy("score", "desc").limit(100).get();
    snapshot.forEach((doc) => {
      currentScore = doc.data().score;
      if (currentScore !== prevScore) {
        rankPosition += 1;
      }
      if (rankPosition > 3) {
        medal = false;
      }
      rowColour = selectRowColour(rankPosition);
      const score: ScoreType = new ScoreType(
        rankPosition,
        doc.data().user,
        currentScore,
        rowColour,
        medal
      );
      results.push(score);
      prevScore = currentScore;
    });
    setScores(results);
  }

  const onTabChange = async (newIndex: number) => {
    setCurrentTabIndex(newIndex);
    setFirstTimeOpened(false);
    await createLeaderboard(newIndex);
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
      <BasicGrid firstTimeOpened={firstTimeOpened} />
      <BasicTable firstTimeOpened={firstTimeOpened} scores={scores} />
    </>
  );
};

export default Leaderboard;
