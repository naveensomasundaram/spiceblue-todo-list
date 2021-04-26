import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDVXdGgAxjzdi7PQXrEoBaJDyGWxf1KwiU",
  authDomain: "clones-8cfe7.firebaseapp.com",
  projectId: "clones-8cfe7",
  storageBucket: "clones-8cfe7.appspot.com",
  messagingSenderId: "999705845735",
  appId: "1:999705845735:web:ac1c7f3afb59c643fbe742",
  measurementId: "G-S3M6S25F9T",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };
