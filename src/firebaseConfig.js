import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    GithubAuthProvider
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyClXLmQCjjHYmUNSo7GzTxky8x7k6QO8OI',
    authDomain: 'apivideocall.firebaseapp.com',
    projectId: 'apivideocall',
    storageBucket: 'apivideocall.firebasestorage.app',
    messagingSenderId: '774152494582',
    appId: '1:774152494582:web:7d2d9a3a74f890ee5e7bd7'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginWithProvider = async (provider) => {
    try {
        const result = await signInWithPopup(auth, provider);
        return await result.user.getIdToken();
    } catch (error) {
        console.error(error);
    }
};

export {
    auth,
    loginWithProvider,
    GoogleAuthProvider,
    FacebookAuthProvider,
    GithubAuthProvider
};
