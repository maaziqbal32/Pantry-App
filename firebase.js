// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxk5uAzHG4p6DvYwu7RRj4Ksx1bk8QS3A",
  authDomain: "hspantryapp-cf256.firebaseapp.com",
  projectId: "hspantryapp-cf256",
  storageBucket: "hspantryapp-cf256.appspot.com",
  messagingSenderId: "151887323250",
  appId: "1:151887323250:web:8c4cec67f8f89b1666a2eb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { app ,firebaseConfig,firestore };