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
      <div className="mb-8">
        <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
          Welcome, {userData?.name || 'there'}!
        </h1>
        <p className="mt-2 text-indigo-200/65 text-lg">
          Your interview assistant is ready to help you succeed.
        </p>
      </div>

      {/* Subscription Status */}
      <div className="bg-gray-900/50 rounded-lg p-6 mb-8 border border-gray-800">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">Account Status</h2>
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full mr-2 ${userData?.hasActiveSubscription ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <p className="text-gray-300">
            {userData?.hasActiveSubscription ? 'Premium Account' : 'Free Account'}
          </p>
        </div>
        {!userData?.hasActiveSubscription && (
          <div className="mt-4">
            <Link 
              href="/dashboard/settings" 
              className="btn bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] px-4 py-2 rounded-md"
            >
              Upgrade to Premium
            </Link>
          </div>
        )}
        {userData?.hasActiveSubscription && (
          <div className="mt-4">
            <p className="text-green-400 text-sm font-medium">
              Enjoy unlimited access to all InterviewAce AI features.
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-semibold text-gray-200 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Start Interview */}
        <div className="bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden hover:border-indigo-500/50 transition-colors">
          <Link href="/dashboard/interview" className="block p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-600/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-200 mb-1">Start Interview</h3>
            <p className="text-indigo-200/65 text-sm">Begin a new interview session with AI assistance.</p>
          </Link>
        </div>

        {/* CV Analysis */}
        <div className="bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden hover:border-indigo-500/50 transition-colors">
          <Link href="/dashboard/cv-analysis" className="block p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-600/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-200 mb-1">CV Analysis</h3>
            <p className="text-indigo-200/65 text-sm">Get AI feedback on your resume or CV.</p>
          </Link>
        </div>

        {/* Job Analysis */}
        <div className="bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden hover:border-indigo-500/50 transition-colors">
          <Link href="/dashboard/job-analysis" className="block p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-600/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-200 mb-1">Job Analysis</h3>
            <p className="text-indigo-200/65 text-sm">Analyze job descriptions for better interview prep.</p>
          </Link>
        </div>
      </div>

      {/* Usage Stats for Premium Users */}
      {userData?.hasActiveSubscription && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">Your Usage</h2>
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-lg text-gray-400">Interviews</p>
                <p className="text-3xl font-bold text-white mt-2">0</p>
              </div>
              <div className="text-center">
                <p className="text-lg text-gray-400">CV Analysis</p>
                <p className="text-3xl font-bold text-white mt-2">0</p>
              </div>
              <div className="text-center">
                <p className="text-lg text-gray-400">Job Analysis</p>
                <p className="text-3xl font-bold text-white mt-2">0</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Free User Credits */}
      {!userData?.hasActiveSubscription && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">Your Credits</h2>
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Available Credits</p>
                <p className="text-3xl font-bold text-white mt-1">{userData?.credits || 0}</p>
              </div>
              <div>
                <Link 
                  href="/dashboard/settings" 
                  className="btn bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] px-4 py-2 rounded-md"
                >
                  Get More Credits
                </Link>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-indigo-200/65">
                Credits are used for interview sessions, CV analysis, and job analysis.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}