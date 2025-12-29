// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBECUAi9qcZhefjDSFCoLdG8fQG3prT4Ys",
  authDomain: "cocktail-bar-33d37.firebaseapp.com",
  projectId: "cocktail-bar-33d37",
  storageBucket: "cocktail-bar-33d37.firebasestorage.app",
  messagingSenderId: "798631206220",
  appId: "1:798631206220:web:1e24177eee7b6b388e03e9",
  measurementId: "G-B2N9YF1R8P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
