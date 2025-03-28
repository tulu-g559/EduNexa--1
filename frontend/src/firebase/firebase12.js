// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//Instruction: Create a file named firebase.js in path "/frontend/src/firebase/firebase.js"
//This is just an example
const firebaseConfig = {
    apiKey: "AIzaSyANtUjEQZHwwnp-tFijQK4S7cnwaiXHCGY",
    authDomain: "edunexa-27a49.firebaseapp.com",
    projectId: "edunexa-27a49",
    storageBucket: "edunexa-27a49.firebasestorage.app",
    messagingSenderId: "272901258354",
    appId: "1:272901258354:web:5be2bf99b3558e737796eb",
    measurementId: "G-Y89H1W3S3S"
};

export default firebaseConfig;


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
