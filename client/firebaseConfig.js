// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8S6qn_Kc-5antmzRUB7dmORXCBjrue0U",
  authDomain: "casin-glo.firebaseapp.com",
  projectId: "casin-glo",
  storageBucket: "casin-glo.appspot.com",
  messagingSenderId: "232818579124",
  appId: "1:232818579124:web:1d12884f51ac3c377da9e1",
  measurementId: "G-17ZS1C094W"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);