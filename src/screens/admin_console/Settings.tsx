import React, { useCallback, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import colors from "../../res/colors";
import { db } from "../../firebase/firebaseApp";

const useStyles = makeStyles(() =>
  createStyles({
    backButton: {
      marginRight: 8,
    },
    container: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.secondary,
    },
    box: {
      backgroundColor: "white",
      width: "60%",
      height: "60%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      boxSizing: "border-box",
    },
  })
);

const Settings: React.FC = () => {
  const classes = useStyles();

  const [loadData, setLoadData] = useState<boolean>(true);

  const [roundInitialTime, setRoundInitialTime] = useState<number>(0);

  const getData = useCallback(async () => {
    const settingsDoc = await db.collection("game_options").doc("current_options").get();

    const { roundTimeInitial } = (settingsDoc.exists ? settingsDoc.data() : {}) as SettingsData;

    setRoundInitialTime(roundTimeInitial);
    setLoadData(false);
  }, []);

  if (loadData) {
    getData();
  }

  const pushChanges = () => {
    const newData: SettingsData = { roundTimeInitial: roundInitialTime };
    db.collection("game_options").doc("current_options").set(newData);
  };

  const resetChanges = useCallback(async () => {
    const defaultSettingsSnapshot = await db
      .collection("game_options")
      .doc("default_options")
      .get();

    db.collection("game_options")
      .doc("current_options")
      .set(defaultSettingsSnapshot.data() as SettingsData);

    setLoadData(true);
  }, []);

  return (
    <>
      <AppBar position="absolute">
        <Toolbar variant="dense">
          <Typography>Spot the Lesion</Typography>
        </Toolbar>
      </AppBar>

      <div className={classes.container}>
        <div className={classes.box}>
          <Typography>Initial Time</Typography>
          <input
            type="number"
            value={roundInitialTime}
            onChange={(change) => {
              setRoundInitialTime(Number(change.target.value));
            }}
          />
        </div>
        <input type="submit" value="Update" onClick={pushChanges} />
        <input type="submit" value="Reset Default" onClick={resetChanges} />
      </div>
    </>
  );
};

export default Settings;
