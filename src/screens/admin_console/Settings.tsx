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
    inline: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
  })
);

const Settings: React.FC = () => {
  const classes = useStyles();

  const [loadData, setLoadData] = useState<boolean>(true);

  const [animationTime, setAnimationTime] = useState<number>(0);
  const [hintTime, setHintTime] = useState<number>(0);
  const [roundTimeInitial, setRoundTimeInitial] = useState<number>(0);

  const optionsList: SettingType[] = [
    { name: "Animation Time", state: animationTime, changer: setAnimationTime },
    { name: "Hint Time", state: hintTime, changer: setHintTime },
    { name: "Initial Round Time", state: roundTimeInitial, changer: setRoundTimeInitial },
  ];

  const getData = useCallback(async () => {
    const settingsDoc = await db.collection("game_options").doc("current_options").get();

    const {
      animationTime: dbAnimTime,
      hintTime: dbHintTime,
      roundTimeInitial: dbRoundTimeInitial,
    } = (settingsDoc.exists ? settingsDoc.data() : {}) as SettingsData;

    setRoundTimeInitial(dbRoundTimeInitial);
    setHintTime(dbHintTime);
    setAnimationTime(dbAnimTime);
    setLoadData(false);
  }, []);

  if (loadData) {
    getData();
  }

  const pushChanges = () => {
    const newData: SettingsData = { animationTime, hintTime, roundTimeInitial };
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
          {optionsList.map((option) => {
            return (
              <div key={option.name} className={classes.inline}>
                <Typography>{option.name}</Typography>
                <input
                  type="number"
                  value={option.state}
                  onChange={(change) => {
                    option.changer(Number(change.target.value));
                  }}
                />
              </div>
            );
          })}

          <div className={classes.inline}>
            <input type="submit" value="Update" onClick={pushChanges} />
            <input type="submit" value="Reset Default" onClick={resetChanges} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
