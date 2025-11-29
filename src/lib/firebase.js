// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCT5ZOdIDh5kIBeqnmqxXmdhBE7pRp4L0",
  authDomain: "jasmina-d098e.firebaseapp.com",
  projectId: "jasmina-d098e",
  storageBucket: "jasmina-d098e.firebasestorage.app",
  messagingSenderId: "165439583000",
  appId: "1:165439583000:web:c8c51a7d5b6f21a2b7e46d",
  measurementId: "G-P6NTH3PZJ1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Configure Google provider
const googleProvider = new GoogleAuthProvider();

// Add necessary scopes for Google provider
googleProvider.addScope("email");
googleProvider.addScope("profile");

// Set custom parameters for Google provider
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export { analytics, auth, googleProvider };
export default app;
