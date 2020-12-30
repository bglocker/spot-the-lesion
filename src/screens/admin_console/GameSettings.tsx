import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  TextField,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import firebase from "firebase/app";
import { handleFirestoreError, isFirestoreError } from "../../utils/firebaseUtils";
import { NavigationAppBar } from "../../components";
import constants from "../../res/constants";

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      padding: 24,
      [theme.breakpoints.down("xs")]: {
        width: "80%",
        height: "95%",
      },
      [theme.breakpoints.up("sm")]: {
        width: "60%",
        height: "80%",
      },
    },
    text: {
      padding: 8,
      textAlign: "center",
      [theme.breakpoints.only("xs")]: {
        fontSize: "1rem",
      },
      [theme.breakpoints.only("sm")]: {
        fontSize: "1.5rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "2rem",
      },
    },
    settingsList: {
      flex: 1,
      overflow: "auto",
    },
    settingItem: {
      margin: 16,
    },
    buttonGroup: {
      alignItems: "center",
      [theme.breakpoints.down("xs")]: {
        width: "70%",
      },
      [theme.breakpoints.up("sm")]: {
        width: "100%",
      },
    },
    button: {
      margin: 8,
      borderRadius: 20,
      [theme.breakpoints.only("xs")]: {
        width: "80%",
        fontSize: "0.6rem",
      },
      [theme.breakpoints.only("sm")]: {
        width: "80%",
        fontSize: "0.6rem",
      },
      [theme.breakpoints.up("md")]: {
        width: "100%",
        fontSize: "1rem",
      },
    },
  })
);

/**
 * Given a setting name, returns its minimum valid value
 *
 * @param name Setting name
 *
 * @return Minimum valid value
 */
const getMinValue = (name: string): number => {
  switch (name) {
    case "Number of Rounds":
      return 1;
    default:
      return 0;
  }
};

const GameSettings: React.FC = () => {
  const classes = useStyles();

  const [loadData, setLoadData] = useState(true);
  const [currentData, setCurrentData] = useState<FirestoreOptionsData>(null!);

  const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));

  const { enqueueSnackbar } = useSnackbar();

  // To add an option to the list:
  //  a) Create Firebase number field: in default_options and current_options
  //  b) Add the name of that field in firebaseTypes.d.ts in SettingsData
  //  b) Create a hook (const [<name1>, set<name1>] = useState(0);)
  //  c) Add a line in settingsList with the name of the option and the two values from the hook
  // WARNING! Make sure that SettingsData and settingsList are sorted lexicographically by the field name.
  // WARNING! Only number values are supported. To change this to string, replace all occurrences of "number" with "string".

  const [animationDuration, setAnimationDuration] = useState(0);
  const [hintTime, setHintTime] = useState(0);
  const [hintRadius, setHintRadius] = useState(0);
  const [hintLineWidth, setHintLineWidth] = useState(0);
  const [roundDuration, setRoundDuration] = useState(0);
  const [roundsNumber, setRoundsNumber] = useState(0);
  const [aiScoreMultiplier, setAiScoreMultiplier] = useState(0);

  const settingsList: GameSetting[] = [
    { name: "AI Score Multiplier", value: aiScoreMultiplier, setter: setAiScoreMultiplier },
    { name: "Animation Duration", value: animationDuration, setter: setAnimationDuration },
    { name: "Hint Line Width", value: hintLineWidth, setter: setHintLineWidth },
    { name: "Hint Radius", value: hintRadius, setter: setHintRadius },
    { name: "Hint Time", value: hintTime, setter: setHintTime },
    { name: "Round duration", value: roundDuration, setter: setRoundDuration },
    { name: "Number of Rounds", value: roundsNumber, setter: setRoundsNumber },
  ];

  /**
   * Function for retrieving the current game options from Firebase
   */
  const getData = async () => {
    setLoadData(false);

    try {
      const settingsSnapshot = await firebase
        .firestore()
        .collection("game_options")
        .doc("current_options")
        .get();

      if (!settingsSnapshot.exists) {
        return;
      }

      const settingsData = settingsSnapshot.data() as FirestoreOptionsData;

      setCurrentData(settingsData);

      const keys = Object.keys(settingsData);

      keys.sort();

      let i = 0;
      for (const key in keys) {
        if (Object.prototype.hasOwnProperty.call(keys, key)) {
          settingsList[i].setter(settingsData[keys[key]]);
          i += 1;
        }
      }
    } catch (error) {
      if (isFirestoreError(error)) {
        handleFirestoreError(error);
      }
    }
  };

  if (loadData) {
    getData().then(() => {});
  }

  const onUpdateClick = async () => {
    const values = settingsList.map((setting) => setting.value);

    const newData: FirestoreOptionsData = currentData;

    const keys = Object.keys(currentData);

    keys.sort();

    let i = 0;
    for (const key in keys) {
      if (Object.prototype.hasOwnProperty.call(keys, key)) {
        newData[keys[key]] = values[i];
        i += 1;
      }
    }

    try {
      await firebase.firestore().collection("game_options").doc("current_options").set(newData);

      enqueueSnackbar(
        "The game options were updated successfully!",
        constants.successSnackbarOptions
      );
    } catch (error) {
      if (isFirestoreError(error)) {
        handleFirestoreError(error, enqueueSnackbar);
      }
    }
  };

  const onResetDefault = async () => {
    try {
      const defaultSettingsSnapshot = await firebase
        .firestore()
        .collection("game_options")
        .doc("default_options")
        .get();

      const defaultSettingsData = defaultSettingsSnapshot.data() as FirestoreOptionsData;

      await firebase
        .firestore()
        .collection("game_options")
        .doc("current_options")
        .set(defaultSettingsData);

      enqueueSnackbar("The game options were reset to default!", constants.successSnackbarOptions);

      setLoadData(true);
    } catch (error) {
      if (isFirestoreError(error)) {
        handleFirestoreError(error, enqueueSnackbar);
      }
    }
  };

  return (
    <>
      <NavigationAppBar />

      <div className={classes.container}>
        <Card className={classes.card}>
          <Typography className={classes.text}>Game Settings</Typography>

          <div className={classes.settingsList}>
            {settingsList.map(({ name, value, setter }) => {
              const onSettingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = Number(event.target.value);
                const changeValue = Math.max(newValue, getMinValue(name));

                setter(changeValue);
              };

              return (
                <div key={name} className={classes.settingItem}>
                  <TextField
                    variant="outlined"
                    label={name}
                    type="number"
                    value={value}
                    onChange={onSettingChange}
                  />
                </div>
              );
            })}
          </div>

          <ButtonGroup
            orientation={smallScreen ? "vertical" : "horizontal"}
            className={classes.buttonGroup}
          >
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              size="large"
              onClick={onUpdateClick}
            >
              Update
            </Button>

            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              size="large"
              onClick={onResetDefault}
            >
              Reset Default
            </Button>
          </ButtonGroup>
        </Card>
      </div>
    </>
  );
};

export default GameSettings;
