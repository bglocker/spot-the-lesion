import { OptionsObject } from "notistack";

const constants = {
  /* Game */
  aiScoreMultiplier: 75,
  animationCubes: 10,
  animationLineWidth: 5,
  animationTime: 3000,
  clickLineWidth: 5,
  clickSize: 10,
  hintLineWidth: 2,
  hintRadius: 100,
  hintRange: 50,
  hintTime: 5000,
  predictedLineWidth: 5,
  redTime: 2000,
  rounds: 10,
  roundTimeInitial: 10000,
  truthLineWidth: 5,

  /* canvasUtils */
  defaultImageSize: 512,

  /* axios */
  getTimeout: 3000,

  /* Firestore */
  scoresCasual: "leaderboard_casual",
  scoresCompetitive: "leaderboard_competitive",
  images: "images",

  /* Storage */
  maxOperationRetryTime: 3000,

  /* Snackbar */
  achievementSnackbarOptions: {
    anchorOrigin: {
      vertical: "top",
      horizontal: "right",
    },
    autoHideDuration: 3000,
    variant: "success",
  } as OptionsObject,
  errorSnackbarOptions: {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "right",
    },
    autoHideDuration: 3000,
    variant: "error",
  } as OptionsObject,
  informationSnackbarOptions: {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    autoHideDuration: 3000,
    variant: "info",
  } as OptionsObject,
  successSnackbarOptions: {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    autoHideDuration: 3000,
    variant: "success",
  } as OptionsObject,
};

export default constants;