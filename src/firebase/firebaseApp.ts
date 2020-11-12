import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import firebaseConfig from "./firebaseConfig";

/* TODO: test with firebase.auth() and firebase.firestore() later on */
/* TODO: fix mutable exports */
// eslint-disable-next-line import/no-mutable-exports
export let auth: firebase.auth.Auth;
// eslint-disable-next-line import/no-mutable-exports
export let db: firebase.firestore.Firestore;
// eslint-disable-next-line import/no-mutable-exports
export let firebaseStorage: firebase.storage.Storage;

export const setupFirebase = (): void => {
  if (process.env.REACT_APP_FIREBASE_API_KEY === undefined) {
    console.error("Firebase api key not set");
    return;
  }

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  auth = firebaseApp.auth();
  db = firebaseApp.firestore();
  firebaseStorage = firebaseApp.storage();
};
