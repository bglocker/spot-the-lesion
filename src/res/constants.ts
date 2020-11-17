import { OptionsObject } from "notistack";

const constants = {
  /* Game */
  aiScoreMultiplier: 75,
  animationCubes: 10,
  animationLineWidth: 3,
  animationTime: 3000,
  clickLineWidth: 3,
  clickSize: 5,
  hintLineWidth: 2,
  hintRadius: 100,
  hintRange: 50,
  hintTime: 5000,
  predictedLineWidth: 3,
  redTime: 2000,
  rounds: 10,
  roundTimeInitial: 10000,
  truthLineWidth: 3,

  /* canvasUtils */
  defaultImageSize: 512,

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
};

export default constants;
