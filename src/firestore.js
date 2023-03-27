// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDZZTL_qwtcA2FD5Y9HMP_LdK3-i4Gcv4M',
  authDomain: 'react-grid-dd2de.firebaseapp.com',
  projectId: 'react-grid-dd2de',
  storageBucket: 'react-grid-dd2de.appspot.com',
  messagingSenderId: '945002276161',
  appId: '1:945002276161:web:853a5dbbd6bce45fb96dc0',
  measurementId: 'G-M9P0SGBMHG',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
