// app/dashboard/page.tsx
"use client";

import { useAuth } from "@/firebase/auth";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import Link from "next/link";

type UserData = {
  hasActiveSubscription: boolean;
  name: string;
  email: string;
  credits?: number;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-2 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome, {userData?.name || 'User'}!</p>
      <p>This is a simple dashboard page.</p>
    </div>
  );
}