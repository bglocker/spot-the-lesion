import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import { firebaseConfig } from "./firebaseConfig";

export let firebaseApp: firebase.app.App;
export let auth: firebase.auth.Auth;
export let db: firebase.firestore.Firestore;

export const setupFirebase = (): void => {
  firebaseApp = firebase.initializeApp(firebaseConfig);
  auth = firebaseApp.auth();
  db = firebaseApp.firestore();
};
