"use client";

import { useEffect } from 'react';
import { app } from '@/firebase/config';
import { deleteApp } from 'firebase/app';

export default function FirebaseCleanup() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        // Use deleteApp function instead of app.delete()
        deleteApp(app).catch(() => {
          // Ignore any errors during cleanup
          console.log("Firebase app already deleted or unavailable");
        });
      } catch (error) {
        console.error("Error during Firebase cleanup:", error);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null;
}