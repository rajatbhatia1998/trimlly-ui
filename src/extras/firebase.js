// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-CpfiLitEHOaoYm9NyT8kNp4fAo_1RZ8",
  authDomain: "trimlly.firebaseapp.com",
  projectId: "trimlly",
  storageBucket: "trimlly.appspot.com",
  messagingSenderId: "40864059515",
  appId: "1:40864059515:web:15aa4f579f7cf673a952de",
  measurementId: "G-XEWM2JR9DP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app