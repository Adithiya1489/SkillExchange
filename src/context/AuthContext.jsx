import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Sign up function
    async function signup(email, password, name) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Create initial user doc
        await setDoc(doc(db, "users", userCredential.user.uid), {
            name: name,
            email: email,
            createdAt: new Date(),
            credits: 2, // Start with some free credits
            lvl: 1,
            skillsOffered: [],
            skillsWanted: [],
            rate: 5,
            role: 'student'
        });
        return userCredential;
    }

    // Login
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    // Google Login
    async function googleLogin() {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        // Check if user doc exists, if not create it
        const docRef = doc(db, "users", result.user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            await setDoc(docRef, {
                name: result.user.displayName,
                email: result.user.email,
                createdAt: new Date(),
                credits: 2,
                lvl: 1,
                skillsOffered: [],
                skillsWanted: [],
                rate: 5
            });
        }
        return result;
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                // Fetch user profile
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserProfile(docSnap.data());
                }
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    async function updateUserProfile(data) {
        if (!currentUser) return;
        const userRef = doc(db, "users", currentUser.uid);
        await setDoc(userRef, data, { merge: true });
        setUserProfile(prev => ({ ...prev, ...data }));
    }

    const value = {
        currentUser,
        userProfile,
        signup,
        login,
        googleLogin,
        logout,
        updateUserProfile,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : <div className="flex h-screen items-center justify-center">Loading...</div>}
        </AuthContext.Provider>
    );
}
