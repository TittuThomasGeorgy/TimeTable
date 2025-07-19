// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FRB_API_KEY,
  authDomain:import.meta.env.VITE_FRB_AUTH_DOMAIN,
  projectID: import.meta.env.VITE_FRB_PROJ_ID,
  storageBucket:import.meta.env.VITE_FRB_STOR_BKT,
  messagingSenderId:import.meta.env.VITE_FRB_SENDER_ID,
  appId:import.meta.env.VITE_FRB_APP_ID, 
  measurementId: import.meta.env.VITE_FRB_MEASUREMENT_ID,
};








// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app)