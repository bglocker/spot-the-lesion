import firebase from "firebase";
import { ReactNode } from "react";
import { OptionsObject } from "notistack";
import constants from "../res/constants";

type FirestoreError = firebase.firestore.FirestoreError;

type FirebaseStorageError = firebase.storage.FirebaseStorageError;

const months: Month[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Return a three letter month name for the given month number
 *
 * @param month Month number
 *
 * @return Three letter month name
 */
const getMonthName = (month: number): Month => months[month];

/**
 * Checks if an error is a Firestore error
 *
 * @param error Error to check
 *
 * @return FirestoreError type predicate
 */
const isFirestoreError = (error: Error): error is FirestoreError =>
  (error as FirestoreError).code !== undefined;

/**
 * Logs a Firestore error
 *
 * @param error Firestore error to log
 */
const logFirestoreError = (error: FirestoreError): void =>
  console.error(`Firebase firestore error\n code: ${error.code}\n message: ${error.message}`);

/**
 * Log the given error, optionally displaying a snackbar
 *
 * @param error           Error to handle
 * @param enqueueSnackbar Function to display a snackbar
 */
const handleFirestoreError = (
  error: FirestoreError,
  enqueueSnackbar?: (message: ReactNode, options?: OptionsObject) => void
): void => {
  logFirestoreError(error);

  /* Snackbar should be displayed */
  if (enqueueSnackbar) {
    let message = "Please try again";

    if (error.code === "unavailable") {
      message = "Please check your internet connection and try again.";
    }

    enqueueSnackbar(message, constants.errorSnackbarOptions);
  }
};

/**
 * Checks if an error is a Firebase storage error
 *
 * @param error Error to check
 *
 * @return FirebaseStorageError type predicate
 */
const isFirebaseStorageError = (error: Error): error is FirebaseStorageError =>
  (error as FirebaseStorageError).serverResponse !== undefined;

/**
 * Logs a Firebase storage error
 *
 * @param error Firebase storage error to log
 */
const logFirebaseStorageError = (error: FirebaseStorageError): void =>
  console.error(`Firebase storage error\n code: ${error.code}\n message: ${error.message}`);

/**
 * Log the given error, optionally displaying a snackbar
 *
 * @param error           Error to handle
 * @param enqueueSnackbar Function to display a snackbar
 */
const handleFirebaseStorageError = (
  error: FirebaseStorageError,
  enqueueSnackbar?: (message: ReactNode, options?: OptionsObject) => void
): void => {
  logFirebaseStorageError(error);

  /* Snackbar should be displayed */
  if (enqueueSnackbar) {
    let message = "Please try again";

    /* Internet connection error */
    if (error.code === "storage/retry-limit-exceeded") {
      message = "Please check your internet connection and try again.";
    }

    enqueueSnackbar(message, constants.errorSnackbarOptions);
  }
};

export {
  getMonthName,
  handleFirebaseStorageError,
  handleFirestoreError,
  isFirebaseStorageError,
  isFirestoreError,
};
