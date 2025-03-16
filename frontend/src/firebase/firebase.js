import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

// Actual configuration details removed due to security reasons
const firebaseConfig = {
  apiKey: you_api_key,
  authDomain: your_authDomain,
  projectId: your_projectId,
  storageBucket: your_storageBucket,
  messagingSenderId: your_messagingSenderId,
  appId: your_appId,
  measurementId: your_measurementId,
};


export const app = initializeApp(firebaseConfig);
export const auth=getAuth();
export const db=getFirestore(app);
