import firebase from "firebase";

type FirebaseStorageError = firebase.storage.FirebaseStorageError;

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

export { isFirebaseStorageError, logFirebaseStorageError };
