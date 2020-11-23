import { OptionsObject } from "notistack";

const constants = {
  /* Game */
  aiScoreMultiplier: 75,
  animationCubesNumber: 10,
  canvasSize: 750,
  roundsNumber: 10,
  rangeEndEasy: 1252,
  rangeEndMedium: 3454,
  rangeEndHard: 4723,

  /* Game drawings */
  animationLineWidth: 5,
  clickLineWidth: 5,
  clickSize: 10,
  hintLineWidth: 2,
  hintRadius: 100,
  hintRange: 50,
  predictedLineWidth: 5,
  truthLineWidth: 5,

  /* Game timings */
  animationDuration: 3000,
  drawPredictedTime: 100,
  drawTruthTime: 500,
  evaluationTime: 1000,
  hintTime: 5000,
  redTime: 2000,
  roundDuration: 10000,

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
