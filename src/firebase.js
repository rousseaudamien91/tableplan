/* eslint-disable */
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ⚠️ Remplace chaque valeur par celles de ton projet Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAtDeOELj6om9-9mEdKVRbXMPG-i13szSo",
  authDomain: "tableplan-c4a6b.firebaseapp.com",
  projectId: "tableplan-c4a6b",
  storageBucket: "tableplan-c4a6b.appspot.com",
  messagingSenderId: "659977410619",
  appId: "1:659977410619:web:ae761fbf149f923990641e"
};

// Initialisation
const app = initializeApp(firebaseConfig);

// Services
export const db = getFirestore(app);
export const auth = getAuth(app);
