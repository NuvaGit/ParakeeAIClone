"use client";

import { useAuth } from "@/firebase/auth";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getUserInterviews, getUserAverageScore, getCommonQuestions } from '@/firebase/interviews';
import { Interview } from '@/firebase/interviews';
import Sidebar from "@/components/dashboard/Sidebar";

export default function InterviewHistoryPage() {
  const { user } = useAuth();
  const [interviewHistory, setInterviewHistory] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [averageScore, setAverageScore] = useState(0);
  const [commonQuestions, setCommonQuestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Get interviews from Firestore
        const interviews = await getUserInterviews(user.uid);
        setInterviewHistory(interviews);
        
        // Get average score
        const avgScore = await getUserAverageScore(user.uid);
        setAverageScore(avgScore);
        
        // Get common questions
        const questions = await getCommonQuestions(user.uid);
        setCommonQuestions(questions);
      } catch (error) {
        console.error("Error fetching interview history:", error);
        // If there's an error, set empty data
        setInterviewHistory([]);
        setAverageScore(0);
        setCommonQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInterviews();
  }, [user]);

  const filteredInterviews = interviewHistory.filter(interview => {
    // Apply search filter
    if (searchTerm && !interview.company.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !interview.position.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply status filter
    if (filterStatus === "high" && interview.score < 90) return false;
    if (filterStatus === "medium" && (interview.score < 70 || interview.score >= 90)) return false;
    if (filterStatus === "low" && interview.score >= 70) return false;
    
    return true;
  });
  
  // Format date from Firestore timestamp
  const formatDate = (date: any) => {
    if (!date) return 'Unknown date';
    
    // Handle Firestore Timestamp objects
    if (date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString();
    }
    
    // Handle Date objects or date strings
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-950">
        <main className="flex-1 p-6 md:p-8">
          <div className="mb-8">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Interview History
            </h1>
            <p className="mt-2 text-indigo-200/65 text-lg">
              Review your past interviews and performance
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-2 border-indigo-500 border-t-transparent"></div>
            </div>
          ) : interviewHistory.length > 0 ? (
            <>
              {/* Filter Controls */}
              <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative md:w-64">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                  </div>
                  <input 
                    type="search" 
                    className="block w-full p-2 pl-10 text-sm text-gray-200 border border-gray-700 rounded-lg bg-gray-800/50 focus:border-indigo-500 focus:ring-0"
                    placeholder="Search company or position" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  className="bg-gray-800/50 border border-gray-700 text-gray-200 text-sm rounded-lg focus:border-indigo-500 p-2 focus:ring-0 md:w-48"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Interviews</option>
                  <option value="high">High Score (90%+)</option>
                  <option value="medium">Medium Score (70-89%)</option>
                  <option value="low">Low Score (&lt;70%)</option>
                </select>
              </div>

              {/* Interview Table */}
              <div className="bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden shadow-lg shadow-gray-950/50 backdrop-blur-sm">
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
                      {filteredInterviews.length > 0 ? (
                        filteredInterviews.map((interview) => (
                          <tr key={interview.id} className="hover:bg-gray-800/30 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {formatDate(interview.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className="bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded-full text-xs font-medium">
                                {interview.company}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {interview.position}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {interview.duration}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              <div className="inline-flex items-center bg-indigo-900/20 px-2 py-1 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>{interview.aiUsage} assists</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-2 w-20 bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                    className={`h-2 rounded-full ${
                                      interview.score >= 90 ? 'bg-green-500' : 
                                      interview.score >= 70 ? 'bg-blue-500' : 
                                      'bg-yellow-500'
                                    }`}
                                    style={{ width: `${interview.score}%` }}
                                  ></div>
                                </div>
                                <span className={`ml-3 text-sm font-medium ${
                                  interview.score >= 90 ? 'text-green-400' : 
                                  interview.score >= 70 ? 'text-blue-400' : 
                                  'text-yellow-500'
                                }`}>{interview.score}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Link 
                                href={`/dashboard/history/${interview.id}`}
                                className="inline-flex items-center justify-center px-3 py-1.5 bg-indigo-600/20 text-indigo-300 text-xs font-medium rounded-md hover:bg-indigo-600/30 transition-colors duration-150"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View Details
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                            No interviews match your search criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Performance Insights */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">Performance Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Overall Score Card */}
                  <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 shadow-lg shadow-gray-950/50 backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-300">
                    <h3 className="text-lg font-medium text-gray-300 mb-3">Overall Score</h3>
                    <div className="flex items-center">
                      <div className="relative h-32 w-32 mx-auto">
                        <svg className="h-32 w-32 transform -rotate-90" viewBox="0 0 36 36">
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
                            strokeDasharray={`${averageScore}, 100`}
                            className="drop-shadow-[0_0_4px_rgba(79,70,229,0.6)]"
                          />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                          <span className="text-3xl font-bold text-white">{averageScore}%</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 text-center mt-4">
                      Your average performance across all interviews
                    </p>
                  </div>
                  
                  {/* Most Recent Card */}
                  <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 shadow-lg shadow-gray-950/50 backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-300">
                    <h3 className="text-lg font-medium text-gray-300 mb-3">Most Recent</h3>
                    {interviewHistory.length > 0 ? (
                      <>
                        <div className="text-center mb-3">
                          <span className="text-2xl font-bold text-white bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
                            {interviewHistory[0]?.company}
                          </span>
                        </div>
                        <div className="bg-gray-800/70 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-400">Position:</span>
                            <span className="text-sm text-gray-300">{interviewHistory[0]?.position}</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-400">Date:</span>
                            <span className="text-sm text-gray-300">
                              {formatDate(interviewHistory[0]?.date)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Score:</span>
                            <span className={`text-sm font-medium ${
                              interviewHistory[0]?.score >= 90 ? 'text-green-400' : 
                              interviewHistory[0]?.score >= 70 ? 'text-blue-400' : 
                              'text-yellow-500'
                            }`}>
                              {interviewHistory[0]?.score}%
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 text-center">
                          <Link
                            href={`/dashboard/history/${interviewHistory[0]?.id}`}
                            className="text-sm text-indigo-400 hover:text-indigo-300 inline-flex items-center"
                          >
                            View full report
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-gray-400 py-6">
                        No interviews available
                      </div>
                    )}
                  </div>
                  
                  {/* Common Questions Card */}
                  <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 shadow-lg shadow-gray-950/50 backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-300">
                    <h3 className="text-lg font-medium text-gray-300 mb-3">Common Questions</h3>
                    {commonQuestions.length > 0 ? (
                      <ul className="space-y-2 text-sm text-gray-300">
                        {commonQuestions.map((question, index) => (
                          <li key={index} className="flex items-start p-2 rounded-md hover:bg-gray-800/50 transition-colors duration-150">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{question}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center text-gray-400 py-6">
                        <p>No common questions found</p>
                        <p className="text-xs mt-2">Complete more interviews to build a question bank</p>
                      </div>
                    )}
                    <div className="mt-4 text-center">
                      <Link
                        href="/dashboard/interview"
                        className="text-sm text-indigo-400 hover:text-indigo-300 inline-flex items-center"
                      >
                        Start new interview
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Empty state
            <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-800 text-center shadow-lg shadow-gray-950/50 backdrop-blur-sm">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-16 w-16 text-gray-500 mx-auto mb-4 opacity-70" 
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
              <h3 className="text-xl font-medium text-gray-300 mb-3">No interview history yet</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Your past interviews will appear here. Start your first interview to begin building your history and get personalized insights.
              </p>
              <Link 
                href="/dashboard/interview"
                className="btn bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-3 rounded-md hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Start Your First Interview
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}