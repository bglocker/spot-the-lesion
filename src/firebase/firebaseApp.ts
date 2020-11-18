import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import firebaseConfig from "./firebaseConfig";
import constants from "../res/constants";

/* TODO: test with firebase.auth() and firebase.firestore() later on */
/* TODO: fix mutable exports */
// eslint-disable-next-line import/no-mutable-exports
let db: firebase.firestore.Firestore;
// eslint-disable-next-line import/no-mutable-exports
let firebaseStorage: firebase.storage.Storage;

const setupFirebase = (): void => {
  if (process.env.REACT_APP_FIREBASE_API_KEY === undefined) {
    console.error("Firebase api key not set");
    return;
  }

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  db = firebaseApp.firestore();
  firebaseStorage = firebaseApp.storage();

  firebaseStorage.setMaxOperationRetryTime(constants.maxOperationRetryTime);
};

export { db, firebaseStorage, setupFirebase };
