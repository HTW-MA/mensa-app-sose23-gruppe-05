// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD2e-6EjpMrnj1FKUxBMLPs4wr2-EM3NQ8",
    authDomain: "mensa-d7a51.firebaseapp.com",
    projectId: "mensa-d7a51",
    storageBucket: "mensa-d7a51.appspot.com",
    messagingSenderId: "12239127205",
    appId: "1:12239127205:web:cc877cd1e9923a2fa6034c",
    measurementId: "G-H9JJ41W0PM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export default { app, analytics, messaging };
