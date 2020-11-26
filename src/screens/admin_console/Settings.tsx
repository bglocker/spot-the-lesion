import React, { useCallback, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { NavigationAppBar } from "../../components";
import { db } from "../../firebase/firebaseApp";
import colors from "../../res/colors";

const useStyles = makeStyles(() =>
  createStyles({
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
  const [currentData, setCurrentData] = useState<SettingsData>(null!);

  // To add an option to the list:
  //  a) Create Firebase number field: in default_options and current_options
  //  b) Add the name of that field in firebaseTypes.d.ts in SettingsData
  //  b) Create a hook (const [<name1>, set<name1>] = useState(0);)
  //  c) Add a line in optionsList with the name of the option and the two values from the hook
  // WARNING! Make sure that SettingsData and optionsList are sorted lexicographically by the field name.
  // WARNING! Only number values are supported. To change this to string, replace all occurrences of "number" with "string".

  const [animationTime, setAnimationTime] = useState<number>(0);
  const [hintTime, setHintTime] = useState<number>(0);
  const [hintRadius, setHintRadius] = useState<number>(0);
  const [hintLineWidth, setHintLineWidth] = useState<number>(0);
  const [roundTimeInitial, setRoundTimeInitial] = useState<number>(0);
  const [rounds, setRounds] = useState<number>(0);

  const optionsList: SettingType[] = [
    { name: "Animation Time", state: animationTime, changer: setAnimationTime },
    { name: "Hint Line Width", state: hintLineWidth, changer: setHintLineWidth },
    { name: "Hint Radius", state: hintRadius, changer: setHintRadius },
    { name: "Hint Time", state: hintTime, changer: setHintTime },
    { name: "Initial Round Time", state: roundTimeInitial, changer: setRoundTimeInitial },
    { name: "Number of Rounds", state: rounds, changer: setRounds },
  ];

  const getData = async () => {
    setLoadData(false);
    const settingsDoc = await db.collection("game_options").doc("current_options").get();

    const data = (settingsDoc.exists ? settingsDoc.data() : {}) as SettingsData;

    setCurrentData(data);

    let i = 0;

    const keys = Object.keys(data as SettingsData);

    keys.sort();

    for (const key in keys) {
      if (data !== null) {
        optionsList[i].changer(data[keys[key]]);
        i += 1;
      }
    }
  };

  if (loadData) {
    getData();
  }

  const pushChanges = () => {
    let i = 0;

    const keys = Object.keys(currentData);
    const values = optionsList.map((index) => index.state);

    const newData: SettingsData = currentData;

    keys.sort();

    for (const key in keys) {
      if (currentData !== null) {
        newData[keys[key]] = values[i];
        i += 1;
      }
    }

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
      <NavigationAppBar />

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
