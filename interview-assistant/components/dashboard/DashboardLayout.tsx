"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/firebase/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use the ProtectedRoute component to ensure user is authenticated
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-950">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}