
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCls_b9XO7ZVz8B4mKlhuivNxoK8vzB2SA",
  authDomain: "lista-de-compras-dc6a3.firebaseapp.com",
  projectId: "lista-de-compras-dc6a3",
  storageBucket: "lista-de-compras-dc6a3.appspot.com",
  messagingSenderId: "842799914165",
  appId: "1:842799914165:web:5ae7fc4896009d463a72fc"
};

const app = initializeApp(firebaseConfig);
 export const auth = getAuth(app)
 export const db = getFirestore(app)