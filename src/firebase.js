import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDtwiV5Gmtpf3zheh0c0iik2k8qUv8ThtA",
    authDomain: "media-backlog-tracker-d30a7.firebaseapp.com",
    projectId: "media-backlog-tracker-d30a7",
    storageBucket: "media-backlog-tracker-d30a7.firebasestorage.app",
    messagingSenderId: "563375663354",
    appId: "1:563375663354:web:183082312720f9353b8143"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
