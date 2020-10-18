import React from "react";
import { AppBar, Grid, Tab, Tabs } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import TabPanel from "./tabPanel/TabPanel";

const useStyles = makeStyles(() =>
  createStyles({
    appbar: {
      alignItems: "center",
      justifyContent: "center",
    },
  })
);

const Leaderboard: React.FC<LeaderboardProps> = ({ setBackButton }: LeaderboardProps) => {
  const styles = useStyles();

  const [currentTabIndex, setCurrentTabIndex] = React.useState(0);

  const handleChange = (_: React.ChangeEvent<unknown>, newIndex: number) => {
    setCurrentTabIndex(newIndex);
  };

  setBackButton(true);

  return (
    <Grid container justify="center">
      <AppBar className={styles.appbar} position="static">
        <Tabs value={currentTabIndex} onChange={handleChange} aria-label="Leaderboards">
          <Tab label="Daily" id="leaderboard-0" aria-controls="leaderboard-view-0" />
          <Tab label="Monthly" id="leaderboard-1" aria-controls="leaderboard-view-1" />
          <Tab label="All Time" id="leaderboard-2" aria-controls="leaderboard-view-2" />
        </Tabs>
      </AppBar>
      <TabPanel currentIndex={currentTabIndex} index={0} />
      <TabPanel currentIndex={currentTabIndex} index={1} />
      <TabPanel currentIndex={currentTabIndex} index={2} />
    </Grid>
  );
};

export default Leaderboard;
