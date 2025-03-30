"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore'; // Removed getDoc as it's not used
import { db } from '@/firebase/config';

// Define user data type
export type UserData = {
  hasActiveSubscription: boolean;
  name: string;
  secondName?: string;
  email: string;
  credits?: number;
};

// Define the context type
type DashboardContextType = {
  userData: UserData | null;
  isLoading: boolean;
  error: string | null;
};

// Create the context with default values
const DashboardContext = createContext<DashboardContextType>({
  userData: null,
  isLoading: true,
  error: null
});

// Hook to use the dashboard context
export const useDashboard = () => useContext(DashboardContext);

// Provider component
export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // No async function needed, directly setup listener
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    let unsubscribe = () => {}; // Default no-op function
    
    try {
      // Set up Firestore listener
      const userDocRef = doc(db, "users", user.uid);
      unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setUserData(doc.data() as UserData);
        } else {
          setError("User profile not found");
        }
        setIsLoading(false);
      }, (error) => {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data");
        setIsLoading(false);
      });
    } catch (err) {
      console.error("Error setting up user data listener:", err);
      setError("Failed to load user data");
      setIsLoading(false);
    }
    
    // Cleanup function
    return () => {
      unsubscribe();
    };
  }, [user]);

  const value = {
    userData,
    isLoading,
    error
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};