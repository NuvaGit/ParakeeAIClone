import React, { createContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            // Create a basic profile if it doesn't exist
            const newProfile = {
              displayName: user.displayName || '',
              email: user.email,
              photoURL: user.photoURL || '',
              createdAt: new Date().toISOString(),
              resumeData: {},
              jobHistory: [],
              interviewHistory: []
            };
            await setDoc(doc(db, 'users', user.uid), newProfile);
            setUserProfile(newProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Register with email & password
  const register = (email, password, displayName) => {
    return createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        
        // Create user profile in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          displayName,
          email,
          photoURL: '',
          createdAt: new Date().toISOString(),
          resumeData: {},
          jobHistory: [],
          interviewHistory: []
        });
        
        return user;
      });
  };

  // Login with email & password
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => userCredential.user);
  };

  // Login with Google
  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    
    return signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        
        // Check if user profile exists, create if not
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', user.uid), {
            displayName: user.displayName || '',
            email: user.email,
            photoURL: user.photoURL || '',
            createdAt: new Date().toISOString(),
            resumeData: {},
            jobHistory: [],
            interviewHistory: []
          });
        }
        
        return user;
      });
  };

  // Logout
  const logout = () => {
    return signOut(auth);
  };

  // Update user profile
  const updateProfile = (profileData) => {
    if (!currentUser) return Promise.reject(new Error('No user is logged in'));
    
    return setDoc(doc(db, 'users', currentUser.uid), profileData, { merge: true })
      .then(() => {
        setUserProfile({...userProfile, ...profileData});
        return userProfile;
      });
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};