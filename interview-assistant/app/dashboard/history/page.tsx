"use client";

import InterviewHistoryPage from "@/components/dashboard/InterviewHistoryPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function History() {
  return (
    <ProtectedRoute>
      <InterviewHistoryPage />
    </ProtectedRoute>
  );
}