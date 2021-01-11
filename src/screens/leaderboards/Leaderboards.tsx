import React, { useEffect, useState } from "react";
import {
  AppBar,
  CircularProgress,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Theme,
  useMediaQuery,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { FaMedal } from "react-icons/fa";
import clsx from "clsx";
import { HideFragment, NavigationAppBar } from "../../components";
import { handleFirestoreError } from "../../utils/firebaseUtils";
import { getColorByRank, getQueryOnTimeAndGameMode } from "../../utils/leaderboardsUtils";
import colors from "../../res/colors";

const useStyles = makeStyles((theme) =>
  createStyles({
    timeAppBar: {
      backgroundColor: colors.primaryTabBar,
    },
    gameModeAppBar: {
      backgroundColor: colors.secondaryTabBar,
    },
    tabIndicator: {
      backgroundColor: colors.tabIndicator,
    },
    tab: {
      fontSize: "1rem",
    },
    container: {
      flex: 1,
      height: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: 24,
    },
    tableContainer: {
      width: "81%",
    },
    tableCell: {
      borderBottom: `thin solid ${colors.rowBorder}`,
      [theme.breakpoints.down("xs")]: {
        fontSize: "1rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "1.5rem",
      },
    },
    tableCellHead: {
      color: colors.headerText,
      backgroundColor: colors.header,
    },
  })
);

const Leaderboards: React.FC = () => {
  const [timeTabIndex, setTimeTabIndex] = useState(0);
  const [gameModeTabIndex, setGameModeTabIndex] = useState(0);

  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));

  const classes = useStyles();

  useEffect(() => {
    const unsubscribe = getQueryOnTimeAndGameMode(timeTabIndex, gameModeTabIndex).onSnapshot(
      (snapshot) => {
        const seenUsers = new Set<string>();
        const newRows: LeaderboardRow[] = [];
        let prevRow: LeaderboardRow = { user: "", score: -1, rank: 0 };

        snapshot.forEach((doc) => {
          const { user, score } = doc.data() as FirestoreScoreData;

          if (seenUsers.has(user)) {
            return;
          }

          const { score: prevScore, rank: prevRank } = prevRow;

          const rank = score === prevScore ? prevRank : prevRank + 1;

          const row = { user, score, rank };

          seenUsers.add(user);
          newRows.push(row);
          prevRow = row;
        });

        setRows(newRows);

        setLoading(false);
      },
      (error) => handleFirestoreError(error)
    );

    return () => unsubscribe();
  }, [gameModeTabIndex, timeTabIndex]);

  const onTimeTabChange = (_event, newValue: number) => setTimeTabIndex(newValue);

  const onGameModeTabChange = (_event, newValue: number) => setGameModeTabIndex(newValue);

  return (
    <>
      <NavigationAppBar showBack />

      <AppBar className={classes.timeAppBar} position="sticky">
        <Tabs
          classes={{ indicator: classes.tabIndicator }}
          variant={smallScreen ? "fullWidth" : "standard"}
          centered
          value={timeTabIndex}
          onChange={onTimeTabChange}
        >
          <Tab className={classes.tab} label="Daily" />

          <Tab className={classes.tab} label="Monthly" />

          <Tab className={classes.tab} label="All Time" />
        </Tabs>
      </AppBar>

      <AppBar className={classes.gameModeAppBar} position="sticky">
        <Tabs
          classes={{ indicator: classes.tabIndicator }}
          variant={smallScreen ? "fullWidth" : "standard"}
          centered
          value={gameModeTabIndex}
          onChange={onGameModeTabChange}
        >
          <Tab className={classes.tab} label="Casual" />

          <Tab className={classes.tab} label="Competitive" />
        </Tabs>
      </AppBar>

      <div className={classes.container}>
        <HideFragment hide={!loading}>
          <CircularProgress color="primary" size={64} />
        </HideFragment>

        <HideFragment hide={loading}>
          <TableContainer className={classes.tableContainer} component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    className={clsx(classes.tableCell, classes.tableCellHead)}
                    align="center"
                  >
                    Rank
                  </TableCell>

                  <TableCell
                    className={clsx(classes.tableCell, classes.tableCellHead)}
                    align="center"
                  >
                    Player
                  </TableCell>

                  <TableCell
                    className={clsx(classes.tableCell, classes.tableCellHead)}
                    align="center"
                  >
                    Score
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map(({ user, score, rank }) => (
                  <TableRow key={user} style={{ backgroundColor: getColorByRank(rank) }}>
                    <TableCell className={classes.tableCell} align="center">
                      {rank <= 3 ? <FaMedal /> : null} {rank}
                    </TableCell>

                    <TableCell
                      className={classes.tableCell}
                      component="th"
                      scope="row"
                      align="center"
                    >
                      {user}
                    </TableCell>

                    <TableCell className={classes.tableCell} align="center">
                      {score}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </HideFragment>
      </div>
    </>
  );
};

export default Leaderboards;
