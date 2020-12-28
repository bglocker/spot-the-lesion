import { OptionsObject } from "notistack";

const constants = {
  /* Achievements */
  numberOfAchievements: 12,

  /* axios */
  axiosTimeout: 3000,

  /* canvasUtils */
  defaultImageSize: 512,

  /* Dynamic Links */
  domainUriPrefix: "https://spotthelesion.page.link",

  /* Firebase Firestore */
  scoresCasual: "leaderboard_casual",
  scoresCompetitive: "leaderboard_competitive",
  images: (difficulty: Difficulty): string => `images_${difficulty}`,

  /* Firebase Storage */
  maxOperationRetryTime: 3000,

  /* Game */
  animationCubesNumber: 10,
  canvasSize: 750,

  /* Game drawings */
  animationLineWidth: 5,
  clickLineWidth: 5,
  clickSize: 10,
  hintRange: 50,
  predictedLineWidth: 5,
  truthLineWidth: 5,

  /* Game timings */
  drawPredictedTime: 100,
  drawTruthTime: 500,
  evaluationTime: 1000,
  redTime: 2000,

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
    autoHideDuration: 6000,
    variant: "success",
  } as OptionsObject,
  uploadFilesSnackbarOptions: {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    autoHideDuration: 4000,
    variant: "warning",
  } as OptionsObject,
};

export default constants;
