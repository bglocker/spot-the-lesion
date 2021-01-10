import { AxiosError } from "axios";
import { ReactNode } from "react";
import { OptionsObject } from "notistack";
import constants from "../res/constants";

/**
 * Logs an axios error
 *
 * @param error Axios error to log
 */
const logAxiosError = (error: AxiosError): void => {
  if (error.response) {
    /* Received response error (4xx, 5xx) */
    console.error(
      `Axios response error\n status: ${error.response.status}\n headers: ${error.response.headers}\n data: ${error.response.data}`
    );
  } else if (error.request) {
    /* No response received */
    console.error(`Axios no response error\n request: ${error.request}`);
  } else {
    /* Request could not be created */
    console.error(`Axios unknown error\n message: ${error.message}`);
  }
};

/**
 * Logs the given error, optionally displaying a snackbar
 *
 * @param error           Error to handle
 * @param enqueueSnackbar Function to display a snackbar
 */
const handleAxiosError = (
  error: AxiosError,
  enqueueSnackbar?: (message: ReactNode, options?: OptionsObject) => void
): void => {
  logAxiosError(error);

  /* Snackbar should be displayed */
  if (enqueueSnackbar) {
    let message = "Please try again.";

    /* Internet connection error */
    if (error.message.includes("timeout")) {
      message = "Please check your internet connection and try again.";
    }

    enqueueSnackbar(message, constants.errorSnackbarOptions);
  }
};

export { logAxiosError, handleAxiosError };
