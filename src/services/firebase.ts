import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCL58ihD5VCwKfDfi7LP9p-p3j5LJsqu60",
  authDomain: "sounddeal-8d55e.firebaseapp.com",
  projectId: "sounddeal-8d55e",
  storageBucket: "sounddeal-8d55e.appspot.com",
  messagingSenderId: "77218065215",
  appId: "1:77218065215:web:49f813bcab95d79efc018a",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
