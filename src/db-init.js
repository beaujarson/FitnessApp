import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBpI1Bo1rPtHQqY14j-7l6NIBZ5WG2Y6Og",
    authDomain: "project1-2bd86.firebaseapp.com",
    databaseURL: "https://project1-2bd86.firebaseio.com",
    projectId: "project1-2bd86",
    storageBucket: "project1-2bd86.appspot.com",
    messagingSenderId: "1069605043106",
    appId: "1:1069605043106:web:4b6006ad6b46f6cad4d0fb",
    measurementId: "G-JYF3W7W3XB"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

const AppDB = firebase.database();
const AppAUTH = firebase.auth();
export { AppDB, AppAUTH }; // Make it available to other modules