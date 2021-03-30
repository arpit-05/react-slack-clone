import firebase from "firebase/app"
import "firebase/database"
import "firebase/auth"
import "firebase/storage"


var firebaseConfig = {
    apiKey: "AIzaSyD19ArUxMZGzdVHmiLaoO_skLYIzoOus9M",
    authDomain: "react-slack-clone-97865.firebaseapp.com",
    projectId: "react-slack-clone-97865",
    storageBucket: "react-slack-clone-97865.appspot.com",
    messagingSenderId: "637575222992",
    appId: "1:637575222992:web:05dc8af174d6787486b0d5",
    measurementId: "G-EK68Z2QS4Q"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics();
  export default firebase;