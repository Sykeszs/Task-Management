// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";


const firebaseConfig = {
  apiKey: "AIzaSyAalLtqMULjp_6gwVAxJjEahAO2u0QExSc",  // Fixed typo
  authDomain: "task-management-fd668.firebaseapp.com",
  projectId: "task-management-fd668",
  storageBucket: "task-management-fd668.appspot.com", // Fixed storageBucket
  messagingSenderId: "153680304493",
  appId: "1:153680304493:web:35999e7fb2803cc9c3e264",
  measurementId: "G-0WKY3YSKSR"
};

export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
