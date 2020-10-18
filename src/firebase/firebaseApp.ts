import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import { firebaseConfig } from "./firebaseConfig";

export let firebaseApp: firebase.app.App;
export let auth: firebase.auth.Auth;
export let db: firebase.firestore.Firestore;
export let functions: firebase.functions.Functions;
export let findShops: firebase.functions.HttpsCallable;
export let updateStock: firebase.functions.HttpsCallable;
export let updateSafety: firebase.functions.HttpsCallable;
export let authProviders: {
  google: firebase.auth.AuthProvider;
  facebook: firebase.auth.AuthProvider;
};

export const setupFirebase = (): void => {
  firebaseApp = firebase.initializeApp(firebaseConfig);
  auth = firebaseApp.auth();
  db = firebaseApp.firestore();
  functions = firebaseApp.functions();
  findShops = functions.httpsCallable("findShops");
  updateStock = functions.httpsCallable("pushStockUpdate");
  updateSafety = functions.httpsCallable("pushSafetyUpdate");
  authProviders = {
    google: new firebase.auth.GoogleAuthProvider(),
    facebook: new firebase.auth.FacebookAuthProvider(),
  };
};
