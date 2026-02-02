import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import {
    GoogleAuthProvider,
    signInWithRedirect,
    signInWithPopup,
    getRedirectResult,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loginWithRedirect = () => {
        setError('');
        const provider = new GoogleAuthProvider();
        return signInWithRedirect(auth, provider);
    };

    const loginWithPopup = () => {
        setError('');
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        const handleRedirect = async () => {
            try {
                await getRedirectResult(auth);
            } catch (error) {
                console.error("Redirect login error:", error);
                setError(error.message);
            }
        };
        handleRedirect();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        }, (error) => {
            console.error("Auth state error:", error);
            setError(error.message);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loginWithRedirect,
        loginWithPopup,
        logout,
        error
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : (
                <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1014' }}>
                    <div className="spinner"></div>
                    <style>{`.spinner { width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.1); border-radius: 50%; border-top-color: #8b5cf6; animation: spin 0.8s ease-in-out infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            )}
        </AuthContext.Provider>
    );
};
