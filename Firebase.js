import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBEmZLKHIqHJzf372PepZBeteL040XYYuQ",
    authDomain: "aihackathonbackend.firebaseapp.com",
    projectId: "aihackathonbackend",
    storageBucket: "aihackathonbackend.firebasestorage.app",
    messagingSenderId: "349508302748",
    appId: "1:349508302748:web:6493c298ec3ffc6a51ba59",
    measurementId: "G-BFMVYNVHJH"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
