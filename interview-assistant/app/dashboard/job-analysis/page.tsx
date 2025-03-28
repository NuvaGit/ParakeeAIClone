"use client";

import JobAnalysisPage from "@/components/dashboard/JobAnalysisPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function JobAnalysis() {
  return (
    <ProtectedRoute>
      <JobAnalysisPage />
    </ProtectedRoute>
  );
}