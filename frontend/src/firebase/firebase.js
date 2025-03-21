import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhO14yl5dRdHLcwRNxXHWDWdLqCZ_Ubqw",
  authDomain: "edunexa-test.firebaseapp.com",
  projectId: "edunexa-test",
  storageBucket: "edunexa-test.firebasestorage.app",
  messagingSenderId: "466675539193",
  appId: "1:466675539193:web:af4db8877ff5492d535628",
  measurementId: "G-K4MKNN3VXT",
};


export const app = initializeApp(firebaseConfig);
export const auth=getAuth();
export const db=getFirestore(app)