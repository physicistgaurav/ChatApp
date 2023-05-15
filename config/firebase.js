// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import Constants from "expo-constants";

const firebaseConfig = {
  apiKey: Constants.manifest.extra.apiKey,

  authDomain: Constants.manifest.extra.authDomain,

  projectId: Constants.manifest.extra.projectId,

  storageBucket: Constants.manifest.extra.storageBucket,

  messagingSenderId: Constants.manifest.extra.messagingSenderId,

  appId: Constants.manifest.extra.appId,
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const authentication = getAuth(app);
const database = getFirestore();
export { firebase, authentication, database };
