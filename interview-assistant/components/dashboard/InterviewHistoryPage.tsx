"use client";

import { useAuth } from "@/firebase/auth";
import Link from "next/link";

export default function InterviewHistoryPage() {
  // Placeholder data for interview history
  // In the future, this would be fetched from Firestore based on user ID
  const interviewHistory = [
    {
      id: "int-001",
      date: "2025-03-15",
      company: "Tech Innovations Inc.",
      position: "Senior Software Engineer",
      duration: "45 minutes",
      aiUsage: 12,
      score: 85,
    },
    {
      id: "int-002",
      date: "2025-03-10",
      company: "DataViz Solutions",
      position: "Frontend Developer",
      duration: "30 minutes",
      aiUsage: 8,
      score: 78,
    },
    {
      id: "int-003",
      date: "2025-03-05",
      company: "CloudScale Systems",
      position: "DevOps Engineer",
      duration: "60 minutes",
      aiUsage: 15,
      score: 92,
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
          Interview History
        </h1>
        <p className="mt-2 text-indigo-200/65 text-lg">
          Review your past interviews and performance
        </p>
      </div>

      {interviewHistory.length > 0 ? (
        <div className="bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800/70">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">AI Assists</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {interviewHistory.map((interview) => (
                  <tr key={interview.id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(interview.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {interview.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {interview.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {interview.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {interview.aiUsage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-2 w-20 bg-gray-700 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${
                              interview.score >= 90 ? 'bg-green-500' : 
                              interview.score >= 70 ? 'bg-blue-500' : 
                              'bg-yellow-500'
                            }`}
                            style={{ width: `${interview.score}%` }}
                          ></div>
                        </div>
                        <span className="ml-3 text-sm text-gray-300">{interview.score}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link 
                        href={`/dashboard/history/${interview.id}`}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-800 text-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 text-gray-500 mx-auto mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No interview history yet</h3>
          <p className="text-gray-400 mb-6">Start your first interview to begin building your history.</p>
          <Link 
            href="/dashboard/interview"
            className="btn bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] px-4 py-2 rounded-md"
          >
            Start Your First Interview
          </Link>
        </div>
      )}

      {interviewHistory.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">Performance Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-medium text-gray-300 mb-3">Overall Score</h3>
              <div className="flex items-center">
                <div className="relative h-32 w-32 mx-auto">
                  <svg className="h-32 w-32" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#374151"
                      strokeWidth="3"
                      strokeDasharray="100, 100"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4F46E5"
                      strokeWidth="3"
                      strokeDasharray="85, 100"
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className="text-3xl font-bold text-white">85%</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-400 text-center mt-4">
                Your average performance across all interviews
              </p>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-medium text-gray-300 mb-3">Most Recent</h3>
              <div className="text-center mb-3">
                <span className="text-2xl font-bold text-white">Tech Innovations Inc.</span>
              </div>
              <div className="bg-gray-800/70 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Position:</span>
                  <span className="text-sm text-gray-300">Senior Software Engineer</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Date:</span>
                  <span className="text-sm text-gray-300">March 15, 2025</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Score:</span>
                  <span className="text-sm text-green-400 font-medium">85%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-medium text-gray-300 mb-3">Common Questions</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Tell me about yourself</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Describe a challenging project</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Why do you want to work here?</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>What are your strengths and weaknesses?</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}