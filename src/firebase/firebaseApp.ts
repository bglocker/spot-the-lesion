import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import axios from "axios";
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
 * Initialize the Firebase project
 *
 * Sign in with an anonymous account to enable Firestore security rules
 * Set the maximum operation retry time for Storage
 */
const initializeFirebase = (): void => {
  if (process.env.REACT_APP_FIREBASE_API_KEY === undefined) {
    console.error("Firebase api key not set");
    return;
  }

  firebase.initializeApp(firebaseConfig);

  /* Sign in with an anonymous account */
  const userKey = process.env.REACT_APP_SERVER_KEY || "N/A";

  // TODO: use signInAnonymously
  firebase
    .auth()
    .signInWithEmailAndPassword("user@gmail.com", userKey)
    .catch((error) => console.error(`Failed to connect to firebase: ${error}`));

  firebase.storage().setMaxOperationRetryTime(constants.maxOperationRetryTime);
};

/**
 * Get the global variables for the app
 *
 * Get game settings from Firestore
 * Get image numbers from Storage
 */
const getGlobalVariables = async (): Promise<void> => {
  /* Get game settings from Firestore */
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
};

export { getGlobalVariables, initializeFirebase };
