import React, { useState } from "react";
import { AppBar, Tab, Tabs } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import firebase from "firebase/app";
import BasicTable from "./scoreTabel/BasicTable";
import DbUtils from "../../utils/DbUtils";
import ScoreType from "../../utils/ScoreType";
import BasicGrid from "./scoreTabel/tableGrid/TableGrid";
import { NavigationAppBar } from "../../components";

const useStyles = makeStyles(() =>
  createStyles({
    appBar: {
      alignItems: "center",
      backgroundColor: "#004445",
    },
    gameTypeAppBar: {
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

const Leaderboard: React.FC = () => {
  const classes = useStyles();

  const [currentTableIndex, setCurrentTableIndex] = React.useState(0);
  const [currentLeaderboardIndex, setCurrentLeaderboardIndex] = React.useState(0);
  const [firstTimeOpened, setFirstTimeOpened] = React.useState(true);

  const [scores, setScores] = useState<ScoreType[]>([]);

  /**
   * Function for coloring the top 3 in Leaderboard with Gold, Silver and Bronze
   * @param rowIndex - if rank is 1, 2 or 3 color accordingly, otherwise leave default
   */
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

  /**
   * Function for creating the Leaderboard
   * and fetching the Leaderboard data from Firebase in real time
   * @param tableIndex - index of the table in DB to display
   * tableIndex = 0 for Daily, 1 for Monthly, 2 for All Time
   * @param leaderboardIndex - index of the game table in DB to display
   * gameIndex = 0 for casual, 1 for competitive
   */
  async function createLeaderboard(tableIndex: number, leaderboardIndex: number) {
    const table: string = DbUtils.tableNames[tableIndex];
    const date: Date = new Date();
    const results: ScoreType[] = [];
    let rankPosition = 0;
    let rowColour = "black";
    let medal = true;
    let prevScore = -1;
    let currentScore;
    // Map for avoiding displaying duplicate entries in Leaderboard
    const uniqueUsersMap: Map<string, boolean> = new Map<string, boolean>();

    const leaderboard =
      leaderboardIndex === 0 ? DbUtils.LEADERBOARD_CASUAL : DbUtils.LEADERBOARD_COMPETITIVE;
    const leaderboardRef = firebase.firestore().collection(leaderboard);

    let snapshot;
    snapshot = leaderboardRef;

    switch (table) {
      case "daily-scores":
        snapshot = snapshot
          .where("day", "==", date.getDate())
          .where("year", "==", date.getFullYear())
          .where("month", "==", DbUtils.monthNames[date.getMonth()]);
        break;
      case "monthly-scores":
        snapshot = snapshot
          .where("year", "==", date.getFullYear())
          .where("month", "==", DbUtils.monthNames[date.getMonth()]);
        break;
      default:
        break;
    }

    snapshot = await snapshot.orderBy("score", "desc").get();
    snapshot.forEach((doc) => {
      if (!uniqueUsersMap.has(doc.data().user)) {
        // Current user's highest score - add to result set
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
        uniqueUsersMap.set(doc.data().user, true);
      }
    });
    setScores(results);
  }

  /**
   * Function for triggering the creation of the next Table for the current leaderboard,
   * when user changes tabs from Daily to Monthly or All Time
   * (or any other combination between the three)
   * @param newTableIndex - index of the new table to display (0 - Daily, 1 - Monthly, 2 - All Time)
   */
  const onTabChange = async (newTableIndex: number) => {
    setCurrentTableIndex(newTableIndex);
    setFirstTimeOpened(false);
    await createLeaderboard(newTableIndex, currentLeaderboardIndex);
  };

  /**
   * Function for triggering the creation of the next Leaderboard, when user changes game modes tabs
   * @param newLeaderboardIndex - index of the new leaderboard to display (0 - Casual or 1 - Competitive)
   */
  const onGameTabChange = async (newLeaderboardIndex: number) => {
    setCurrentLeaderboardIndex(newLeaderboardIndex);
    setFirstTimeOpened(false);
    await createLeaderboard(currentTableIndex, newLeaderboardIndex);
  };

  return (
    <>
      <NavigationAppBar showBack />

      <AppBar className={classes.appBar} position="sticky">
        <Tabs
          value={firstTimeOpened ? false : currentTableIndex}
          onChange={(_, newTableIndex) => onTabChange(newTableIndex)}
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

      <AppBar className={classes.gameTypeAppBar} position="sticky">
        <Tabs
          value={firstTimeOpened ? false : currentLeaderboardIndex}
          onChange={(_, newLeaderboardIndex) => onGameTabChange(newLeaderboardIndex)}
          aria-label="Gametypes"
          classes={{ indicator: classes.tabIndicator }}
        >
          <Tab
            className={classes.tab}
            label="Casual"
            id="gametype-0"
            aria-controls="gametype-view-0"
          />

          <Tab
            className={classes.tab}
            label="Competitive"
            id="gametype-1"
            aria-controls="gametype-view-1"
          />
        </Tabs>
      </AppBar>

      <BasicGrid firstTimeOpened={firstTimeOpened} />

      <BasicTable firstTimeOpened={firstTimeOpened} scores={scores} />
    </>
  );
};

export default Leaderboard;
