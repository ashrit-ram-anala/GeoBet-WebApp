import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA8S6qn_Kc-5antmzRUB7dmORXCBjrue0U",
  authDomain: "casin-glo.firebaseapp.com",
  projectId: "casin-glo",
  storageBucket: "casin-glo.appspot.com",
  messagingSenderId: "232818579124",
  appId: "1:232818579124:web:1d12884f51ac3c377da9e1",
  measurementId: "G-17ZS1C094W"
};

export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);