import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import axios from "axios";
import { handleAxiosError, isAxiosError } from "../utils/axiosUtils";
import { handleUncaughtError } from "../utils/errorUtils";
import {
  handleAuthError,
  handleFirebaseStorageError,
  handleFirestoreError,
  isAuthError,
  isFirebaseStorageError,
  isFirestoreError,
} from "../utils/firebaseUtils";
import constants from "../res/constants";
import variables from "../res/variables";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  appId: "1:131387805123:web:9bdbabe358ffcf04ad4176",
  authDomain: "spot-the-lesion.firebaseapp.com",
  databaseURL: "https://spot-the-lesion.firebaseio.com",
  storageBucket: "spot-the-lesion.appspot.com",
  messagingSenderId: "131387805123",
  measurementId: "G-13PZY5QQPK",
  projectId: "spot-the-lesion",
};

/**
 * Initialize the Firebase app
 * Sign in with a default account to enable Firestore security rules
 * Set the maximum operation retry time for Storage
 *
 * @return True if successful, false otherwise
 */
const initializeFirebase = async (): Promise<boolean> => {
  if (process.env.REACT_APP_FIREBASE_API_KEY === undefined) {
    console.error("Firebase API key not set.");

    return false;
  }

  /* Check if app already initialized */
  if (firebase.apps.length === 1) {
    return true;
  }

  firebase.initializeApp(firebaseConfig);

  const defaultEmail = "user@gmail.com";
  const defaultPassword = process.env.REACT_APP_SERVER_KEY || "N/A";

  try {
    await firebase.auth().signInWithEmailAndPassword(defaultEmail, defaultPassword);

    firebase.storage().setMaxOperationRetryTime(constants.maxOperationRetryTime);

    return true;
  } catch (error) {
    if (isAuthError(error)) {
      console.error("Default user sign in failed.");

      handleAuthError(error);
    }

    return false;
  }
};

/**
 * Get the global variables for the app
 *
 * Get game settings from Firestore
 * Get image numbers from Storage
 *
 * @return True if successful, false otherwise
 */
const getGlobalVariables = async (): Promise<boolean> => {
  try {
    /* Get game settings form Firestore */
    const optionsSnapshot = await firebase
      .firestore()
      .collection("game_options")
      .doc("current_options")
      .get();

    const optionsData = optionsSnapshot.data() as FirestoreOptionsData | undefined;

    Object.assign(variables, optionsData);

    /* Get image numbers from Storage */
    const url = await firebase.storage().ref("image_numbers.json").getDownloadURL();

    const response = await axios.get<ImageNumbersData>(url, { timeout: constants.axiosTimeout });

    const { easy, medium, hard } = response.data;

    variables.easyFilesNumber = easy;
    variables.mediumFilesNumber = medium;
    variables.hardFilesNumber = hard;

    return true;
  } catch (error) {
    if (isFirestoreError(error)) {
      handleFirestoreError(error);
    } else if (isFirebaseStorageError(error)) {
      handleFirebaseStorageError(error);
    } else if (isAxiosError(error)) {
      handleAxiosError(error);
    } else {
      handleUncaughtError(error, "getGlobalVariables");
    }

    return false;
  }
};

export { getGlobalVariables, initializeFirebase };
