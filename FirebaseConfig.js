// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBjuiURBwH7UNo3je62AIcySHeywO8nZ8U",
    authDomain: "merchsystem-f2359.firebaseapp.com",
    databaseURL: "https://merchsystem-f2359-default-rtdb.firebaseio.com",
    projectId: "merchsystem-f2359",
    storageBucket: "merchsystem-f2359.appspot.com",
    messagingSenderId: "972940354993",
    appId: "1:972940354993:web:b672fdb622f8b04a784990"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
export const auth = getAuth(app);
export default app;
