import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail, sendEmailVerification } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDscY6VIiHNhRL_Q1S-GhUJXSEqB2DIMHI",
  authDomain: "desarrollo-web-ii-5d0cb.firebaseapp.com",
  projectId: "desarrollo-web-ii-5d0cb",
  storageBucket: "desarrollo-web-ii-5d0cb.appspot.com",
  messagingSenderId: "211880810268",
  appId: "1:211880810268:web:d4304e2f959bd4f8728cd9",
  measurementId: "G-9N9V8FXV35"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail, sendEmailVerification };