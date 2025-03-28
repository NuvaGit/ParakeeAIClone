"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase/auth';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (user) {
        setAuthorized(true);
      } else {
        router.push('/signin');
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking auth or redirecting
  if (loading || !authorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-2 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  // Only render children when authorized
  return <>{children}</>;
}