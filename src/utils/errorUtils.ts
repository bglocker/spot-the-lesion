import { ReactNode } from "react";
import { OptionsObject } from "notistack";
import constants from "../res/constants";

/**
 * Asserts a part of the code that should not be reached (e.g. default case of exhaustive switch)
 *
 * @param val Unreachable value
 */
const assertUnreachable = (val: never): never => {
  throw new Error(`Unreachable value ${val} reached.`);
};

/**
 * Logs the given image loading error
 *
 * @param error Image load error to log
 */
const logImageLoadError = (error: Error): void =>
  console.error(`Image loading error\n message: ${error.message}`);

/**
 * Logs the given error, optionally displaying a snackbar
 *
 * @param error           Error to handle
 * @param enqueueSnackbar Function to display a snackbar
 */
const handleImageLoadError = (
  error: Error,
  enqueueSnackbar?: (message: ReactNode, options?: OptionsObject) => void
): void => {
  logImageLoadError(error);

  if (enqueueSnackbar) {
    const message = "Please try again.";

    enqueueSnackbar(message, constants.errorSnackbarOptions);
  }
};

/**
 * Logs an uncaught error in a function
 *
 * @param error  Uncaught error to log
 * @param fnName Function name where error occurred
 */
const logUncaughtError = (error: Error, fnName: string): void =>
  console.error(`Uncaught error in ${fnName}\n ${error.message}`);

/**
 * Logs the given error, optionally displaying a snackbar
 *
 * @param error           Error to handle
 * @param fnName          Function name where error occurred
 * @param enqueueSnackbar Function to display a snackbar
 */
const handleUncaughtError = (
  error: Error,
  fnName: string,
  enqueueSnackbar?: (message: ReactNode, options?: OptionsObject) => void
): void => {
  logUncaughtError(error, fnName);

  /* Snackbar should be displayed */
  if (enqueueSnackbar) {
    const message = "Please try again.";

    enqueueSnackbar(message, constants.errorSnackbarOptions);
  }
};

export { assertUnreachable, handleImageLoadError, handleUncaughtError };
