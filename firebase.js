import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyB6sl0e8D0t68JoexUOZgMn6ZXnJR7qnh4",
  authDomain: "docsclone-b5bf3.firebaseapp.com",
  projectId: "docsclone-b5bf3",
  storageBucket: "docsclone-b5bf3.appspot.com",
  messagingSenderId: "319862170005",
  appId: "1:319862170005:web:3a4c925aff271b0428d69c",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();

export { db };
