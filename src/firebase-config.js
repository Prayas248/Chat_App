// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import {getStorage} from "firebase/storage";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDQpGoXR_tGqdr3GSYog0ZdtucuvsEMdc",
  authDomain: "chatapper-ac53c.firebaseapp.com",
  projectId: "chatapper-ac53c",
  storageBucket: "chatapper-ac53c.appspot.com",
  messagingSenderId: "705019747964",
  appId: "1:705019747964:web:5a566ce3181882a3c7f3f9",
  measurementId: "G-FP6HBXRMFR"
};

// Initialize Firebase

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);


