import { initializeApp } from "firebase/app";

// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAExUYT1yY3IaY0Y2AY5oVNht0IptxADFg",
    authDomain: "votehere-1.firebaseapp.com",
    databaseURL: "https://votehere-1-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "votehere-1",
    storageBucket: "votehere-1.appspot.com",
    messagingSenderId: "378115989840",
    appId: "1:378115989840:web:b1fcbf1c204b22f9ca0c55"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const auth = getAuth();
export const db = getFirestore(app);

// A function to create Auth UI Config
export const uiConfig = () => {
    return {
        signInFlow: 'popup',
        signInSuccessUrl: '/admin',
        tosUrl: '/terms-of-service',
        privacyPolicyUrl: '/privacy-policy',
        signInOptions: [
            GoogleAuthProvider.PROVIDER_ID
        ]
    }
}

