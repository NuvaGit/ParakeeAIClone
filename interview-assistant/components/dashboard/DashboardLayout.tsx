"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useDashboard } from "@/context/DashboardContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useDashboard();

  // Show loading screen if still loading dashboard data
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-950">
        <div className="w-64 bg-gray-900 border-r border-gray-800">
          {/* Sidebar skeleton */}
          <div className="h-16 border-b border-gray-800 flex items-center justify-center">
            <div className="w-40 h-6 bg-gray-800 rounded-md animate-pulse"></div>
          </div>
          <div className="p-4 space-y-4 mt-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-gray-800 rounded-md animate-pulse"></div>
                <div className="w-24 h-4 bg-gray-800 rounded-md animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-t-3 border-indigo-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-400">Loading your data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Once loaded, show the full dashboard
  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}