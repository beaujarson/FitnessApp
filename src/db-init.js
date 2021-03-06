import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAWA_ThPsCdTdtQ9I97jAIRQ4yDvKD4P3A",
  authDomain: "fitnessapp-7784e.firebaseapp.com",
  databaseURL: "https://fitnessapp-7784e.firebaseio.com",
  projectId: "fitnessapp-7784e",
  storageBucket: "fitnessapp-7784e.appspot.com",
  messagingSenderId: "1058218214265",
  appId: "1:1058218214265:web:2c764a6d42f49e18d925a8",
  measurementId: "G-MZVXNS44BD"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

const AppDB = firebase.database();
const AppAUTH = firebase.auth();

export { AppDB, AppAUTH }; // Make it available to other modules