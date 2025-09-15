import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYgTLT0TI0s56ofNwWtl-JkHo4iCbwiYU",
  authDomain: "findroom-2caa5.firebaseapp.com",
  projectId: "findroom-2caa5",
  storageBucket: "findroom-2caa5.firebasestorage.app",
  messagingSenderId: "130799977867",
  appId: "1:130799977867:web:486b5359e3aa2055af5b8e",
  measurementId: "G-TE4BPZGP7Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics
getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
