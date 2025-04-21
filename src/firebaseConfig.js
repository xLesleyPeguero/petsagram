// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDkfFWbvjitzfGwuhsNSLNa6noQTnjc768",
  authDomain: "petsgram-f22ba.firebaseapp.com",
  projectId: "petsgram-f22ba",
  storageBucket: "petsgram-f22ba.appspot.com",
  messagingSenderId: "120144570553",
  appId: "1:120144570553:web:482fe81643726de0e5d368"
};

let app;
let db;
let storage;

try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");

  db = getFirestore(app);
  console.log("Firestore initialized successfully");

  storage = getStorage(app);
  console.log("Storage initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error;
}

export { db, storage };
export default app;