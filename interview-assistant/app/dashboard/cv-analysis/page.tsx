"use client";

import CVAnalysisPage from "@/components/dashboard/CVAnalysisPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CVAnalysis() {
  return (
    <ProtectedRoute>
      <CVAnalysisPage />
    </ProtectedRoute>
  );
}