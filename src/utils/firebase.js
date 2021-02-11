import firebase from "firebase/app";
import "firebase/storage";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDP4qDjxwMCAyuwY-6ZvKP3lf58qBxBydM",
  authDomain: "klout-kast-development.firebaseapp.com",
  projectId: "klout-kast-development",
  storageBucket: "klout-kast-development.appspot.com",
  messagingSenderId: "943789863268",
  appId: "1:943789863268:web:9961ac852f48b55a8d8a71",
  measurementId: "G-CJCMH0YB2M",
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const storage = firebase.storage();

export { storage, firebase as default };
