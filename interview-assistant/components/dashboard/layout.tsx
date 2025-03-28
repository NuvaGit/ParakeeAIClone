"use client";

import { AuthProvider } from "@/firebase/auth";
import Header from "@/components/ui/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-950">
      {/* No Header here */}
      {children}
    </div>
  );
}