"use client";

import { useParams } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InterviewPage from "@/components/dashboard/InterviewPage";
import InterviewHistoryPage from "@/components/dashboard/InterviewHistoryPage";
import CVAnalysisPage from "@/components/dashboard/CVAnalysisPage";
import JobAnalysisPage from "@/components/dashboard/JobAnalysisPage";
import SettingsPage from "@/components/dashboard/SettingsPage";

export default function DynamicDashboardPage() {
  const params = useParams();
  const section = params.section as string;

  const renderSection = () => {
    switch(section) {
      case 'interview':
        return <InterviewPage />;
      case 'history':
        return <InterviewHistoryPage />;
      case 'cv-analysis':
        return <CVAnalysisPage />;
      case 'job-analysis':
        return <JobAnalysisPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <DashboardLayout>
      {renderSection()}
    </DashboardLayout>
  );
}