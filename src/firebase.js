import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyB_5ufWUm1o5hRJvPH9y6x9oRtkM6wtkHc",
    authDomain: "skillexchange-304f8.firebaseapp.com",
    projectId: "skillexchange-304f8",
    storageBucket: "skillexchange-304f8.firebasestorage.app",
    messagingSenderId: "89399448421",
    appId: "1:89399448421:web:82b99c243eef629ea4078c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
