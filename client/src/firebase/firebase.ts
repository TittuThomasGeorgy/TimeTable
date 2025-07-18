// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpPlqNhG6-6SQqPkPVQId1lPDvN_iAgOo",
  authDomain: "timetable-customizer.firebaseapp.com",
  projectId: "timetable-customizer",
  storageBucket: "timetable-customizer.firebasestorage.app",
  messagingSenderId: "1000478626420",
  appId: "1:1000478626420:web:c2a73e3a9f587416c9b721",
  measurementId: "G-J61FZ30TQL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);