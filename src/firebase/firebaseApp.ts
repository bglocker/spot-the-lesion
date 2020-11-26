import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import axios from "axios";
import firebaseConfig from "./firebaseConfig";
import constants from "../res/constants";
import variables from "../res/variables";

/* TODO: test with firebase.auth() and firebase.firestore() later on */
/* TODO: fix mutable exports */
// eslint-disable-next-line import/no-mutable-exports
let db: firebase.firestore.Firestore;
// eslint-disable-next-line import/no-mutable-exports
let firebaseStorage: firebase.storage.Storage;
// eslint-disable-next-line import/no-mutable-exports
let firebaseAuth: firebase.auth.Auth;

const setupFirebase = (): void => {
  if (process.env.REACT_APP_FIREBASE_API_KEY === undefined) {
    console.error("Firebase api key not set");
    return;
  }

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  db = firebaseApp.firestore();
  firebaseStorage = firebaseApp.storage();
  firebaseAuth = firebaseApp.auth();

  firebaseStorage.setMaxOperationRetryTime(constants.maxOperationRetryTime);
};

/* TODO: move inside app, create loading screen, wait for variable retrieval */
const getGlobalVariables = async (): Promise<void> => {
  /* Get game settings from firestore */
  const optionsSnapshot = await firebase
    .firestore()
    .collection("game_options")
    .doc("current_options")
    .get();

  const optionsData = optionsSnapshot.data() as FirestoreOptionsData | undefined;

  Object.assign(variables, optionsData);

  /* Get image numbers from firebase storage */
  const url = await firebase.storage().ref("image_numbers.json").getDownloadURL();

  const response = await axios.get<ImageNumbersData>(url, { timeout: constants.axiosTimeout });

  const { easy, medium, hard } = response.data;

  variables.easyFilesNumber = easy;
  variables.mediumFilesNumber = medium;
  variables.hardFilesNumber = hard;
};

export { db, firebaseStorage, firebaseAuth, getGlobalVariables, setupFirebase };
