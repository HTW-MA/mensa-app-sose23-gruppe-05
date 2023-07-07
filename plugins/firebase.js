// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyARpL1Z6-H-g1oC3gWHbRQLLRFLTjx-7qU",
    authDomain: "mensamania-511e4.firebaseapp.com",
    projectId: "mensamania-511e4",
    storageBucket: "mensamania-511e4.appspot.com",
    messagingSenderId: "532145483873",
    appId: "1:532145483873:web:c951dafd1bffa282ce3a20",
    measurementId: "G-LF14FHEVS7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export default { app, analytics, messaging };
