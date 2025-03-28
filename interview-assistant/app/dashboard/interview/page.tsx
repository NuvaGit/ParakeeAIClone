"use client";

import InterviewPage from "@/components/dashboard/InterviewPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Interview() {
  return (
    <ProtectedRoute>
      <InterviewPage />
    </ProtectedRoute>
  );
}