import firebase from "firebase";

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
 * Check if the given error is a FirestoreError
 *
 * @param error Error to type check
 *
 * @return FirestoreError type predicate
 */
const isFirestoreError = (error: Error): error is FirestoreError =>
  (error as FirestoreError).code !== undefined;

/**
 * Logs the given FirestoreError
 *
 * @param error FirestoreError to log
 */
const logFirestoreError = (error: FirestoreError): void =>
  console.error(`Firebase firestore error\n code: ${error.code}\n message: ${error.message}`);

/**
 * Check if the given error is a FirebaseStorageError
 *
 * @param error Error to type check
 *
 * @return FirebaseStorageError type predicate
 */
const isFirebaseStorageError = (error: Error): error is FirebaseStorageError =>
  (error as FirebaseStorageError).serverResponse !== undefined;

/**
 * Logs the given FirebaseStorageError
 *
 * @param error FirebaseStorageError to log
 */
const logFirebaseStorageError = (error: FirebaseStorageError): void =>
  console.error(`Firebase storage error\n code: ${error.code}\n message: ${error.message}`);

export {
  getMonthName,
  isFirebaseStorageError,
  isFirestoreError,
  logFirebaseStorageError,
  logFirestoreError,
};
