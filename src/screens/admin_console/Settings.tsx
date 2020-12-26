import React, { useCallback, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Button, ButtonGroup, TextField, Typography, useMediaQuery } from "@material-ui/core";
import { useSnackbar } from "notistack";
import firebase from "firebase/app";
import colors from "../../res/colors";
import constants from "../../res/constants";

const useStyles = makeStyles((theme) =>
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
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      alignSelf: "center",
      align: "center",
    },
    desktopBox: {
      height: "80%",
      padding: 24,
    },
    mobileBox: {
      height: "95%",
      padding: 16,
    },
    desktopSettingsContainer: {
      height: "80%",
    },
    mobileSettingsContainer: {
      marginTop: "15%",
      marginBottom: "8%",
      height: "90%",
    },
    inline: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      margin: 10,
    },
    genericButtonGroup: {
      alignSelf: "center",
      align: "center",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonGroupDesktop: {
      width: "70%",
    },
    buttonGroupMobile: {
      width: "100%",
      marginBottom: "20%",
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
    gameOptionsTitle: {
      [theme.breakpoints.only("xs")]: {
        fontSize: "1rem",
      },
      [theme.breakpoints.only("sm")]: {
        fontSize: "1.5rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "2rem",
      },
      textAlign: "center",
      padding: 8,
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: "100%",
    },
  })
);

const Settings: React.FC = () => {
  const classes = useStyles();

  const [loadData, setLoadData] = useState<boolean>(true);
  const [currentData, setCurrentData] = useState<FirestoreOptionsData>(null!);

  const minScreenWidth = useMediaQuery("(min-width:600px)");
  const minScreenHeight = useMediaQuery("(min-height:750px)");

  // To add an option to the list:
  //  a) Create Firebase number field: in default_options and current_options
  //  b) Add the name of that field in firebaseTypes.d.ts in SettingsData
  //  b) Create a hook (const [<name1>, set<name1>] = useState(0);)
  //  c) Add a line in optionsList with the name of the option and the two values from the hook
  // WARNING! Make sure that SettingsData and optionsList are sorted lexicographically by the field name.
  // WARNING! Only number values are supported. To change this to string, replace all occurrences of "number" with "string".

  const [animationDuration, setAnimationDuration] = useState(0);
  const [hintTime, setHintTime] = useState(0);
  const [hintRadius, setHintRadius] = useState(0);
  const [hintLineWidth, setHintLineWidth] = useState(0);
  const [roundDuration, setRoundDuration] = useState(0);
  const [roundsNumber, setRoundsNumber] = useState(0);
  const [aiScoreMultiplier, setAiScoreMultiplier] = useState(0);

  const { enqueueSnackbar } = useSnackbar();

  const optionsList: SettingType[] = [
    { name: "AI Score Multiplier", state: aiScoreMultiplier, changer: setAiScoreMultiplier },
    { name: "Animation Duration", state: animationDuration, changer: setAnimationDuration },
    { name: "Hint Line Width", state: hintLineWidth, changer: setHintLineWidth },
    { name: "Hint Radius", state: hintRadius, changer: setHintRadius },
    { name: "Hint Time", state: hintTime, changer: setHintTime },
    { name: "Round duration", state: roundDuration, changer: setRoundDuration },
    { name: "Number of Rounds", state: roundsNumber, changer: setRoundsNumber },
  ];

  /**
   * Function for retrieving the current game options from Firebase
   */
  const getData = async () => {
    setLoadData(false);
    const settingsDoc = await firebase
      .firestore()
      .collection("game_options")
      .doc("current_options")
      .get();

    const data = (settingsDoc.exists ? settingsDoc.data() : {}) as FirestoreOptionsData;

    setCurrentData(data);

    let i = 0;

    const keys = Object.keys(data);

    keys.sort();

    for (const key in keys) {
      if (data !== null) {
        optionsList[i].changer(data[keys[key]]);
        i += 1;
      }
    }
  };

  if (loadData) {
    getData().then(() => {});
  }

  /**
   * Function for updating the current game options in Firebase
   */
  const pushChanges = () => {
    let i = 0;

    const keys = Object.keys(currentData);
    const values = optionsList.map((index) => index.state);

    const newData: FirestoreOptionsData = currentData;

    keys.sort();

    for (const key in keys) {
      if (currentData !== null) {
        newData[keys[key]] = values[i];
        i += 1;
      }
    }

    firebase
      .firestore()
      .collection("game_options")
      .doc("current_options")
      .set(newData)
      .then(() => {
        enqueueSnackbar(
          "The game options were updated successfully!",
          constants.successSnackbarOptions
        );
      })
      .catch(() => {
        enqueueSnackbar(
          "Error occurred while updating the game options. Please try again.",
          constants.errorSnackbarOptions
        );
      });
  };

  /**
   * Function for resetting the game options to default
   */
  const resetChanges = useCallback(async () => {
    const defaultSettingsSnapshot = await firebase
      .firestore()
      .collection("game_options")
      .doc("default_options")
      .get();

    await firebase
      .firestore()
      .collection("game_options")
      .doc("current_options")
      .set(defaultSettingsSnapshot.data() as FirestoreOptionsData)
      .then(() => {
        enqueueSnackbar(
          "The game options were reset to default!",
          constants.successSnackbarOptions
        );
      })
      .catch(() => {
        enqueueSnackbar(
          "Error occurred while resetting the game options. Please try again.",
          constants.errorSnackbarOptions
        );
      });

    setLoadData(true);
  }, [enqueueSnackbar]);

  return (
    <div
      className={[
        classes.box,
        minScreenHeight && minScreenWidth ? classes.desktopBox : classes.mobileBox,
      ].join(" ")}
    >
      <div
        className={
          minScreenHeight && minScreenWidth
            ? classes.desktopSettingsContainer
            : classes.mobileSettingsContainer
        }
      >
        <Typography className={classes.gameOptionsTitle}>Game options</Typography>
        {optionsList.map((option) => {
          return (
            <div key={option.name} className={classes.inline}>
              <TextField
                label={option.name}
                type="number"
                id="margin-none"
                value={option.state}
                defaultValue="Input a number"
                className={classes.textField}
                onChange={(change) => {
                  const newValue = Number(change.target.value);
                  const minValue = option.name === "Number of Rounds" ? 1 : 0;
                  const changeValue = newValue >= minValue ? newValue : minValue;
                  option.changer(changeValue);
                }}
              />
            </div>
          );
        })}
      </div>
      <ButtonGroup
        orientation={minScreenWidth ? "horizontal" : "vertical"}
        className={[
          classes.genericButtonGroup,
          minScreenWidth ? classes.buttonGroupDesktop : classes.buttonGroupMobile,
        ].join(" ")}
      >
        <Button
          onClick={pushChanges}
          className={classes.button}
          variant="contained"
          color="primary"
          size="large"
        >
          Update
        </Button>
        <Button
          onClick={resetChanges}
          className={classes.button}
          variant="contained"
          color="primary"
          size="large"
        >
          Reset Default
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default Settings;
