"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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
    const fetchUserData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        } else {
          setError("User profile not found");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
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