import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBU6v_oMn0pzt3wqreDYY00pxNxO2OhmFs",
  authDomain: "quickconnectls.firebaseapp.com",
  databaseURL: "https://quickconnectls-default-rtdb.firebaseio.com",
  projectId: "quickconnectls",
  storageBucket: "quickconnectls.appspot.com",
  messagingSenderId: "364590501994",
  appId: "1:364590501994:web:064ec018f40b8041b2ba13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);