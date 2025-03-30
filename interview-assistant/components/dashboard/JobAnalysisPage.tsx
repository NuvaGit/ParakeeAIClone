"use client";

import { useState } from "react";
import { useAuth } from "@/firebase/auth";
import Sidebar from "@/components/dashboard/Sidebar";

export default function JobAnalysisPage() {
  const [jobUrl, setJobUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [error, setError] = useState("");

  const handleJobUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobUrl(e.target.value);
  };

  const startAnalysis = async () => {
    if (!jobUrl) {
      setError("Please enter a job posting URL to analyze");
      return;
    }

    setError("");
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analysejobmarket/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze job listing");
      }

      const data = await response.json();
      setAnalysisResults(data);
      setAnalysisComplete(true);
    } catch (err) {
      setError("Error analyzing job posting. Please try again.");
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setJobUrl("");
    setAnalysisComplete(false);
    setAnalysisResults(null);
    setError("");
  };

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mb-8">
          <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
            Job Analysis
          </h1>
          <p className="mt-2 text-indigo-200/65 text-lg">
            Understand job requirements and prepare for interviews
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/40 max-w-3xl shadow-xl">
          {error && (
            <div className="bg-red-500/10 p-4 rounded-lg mb-6 flex items-center border border-red-800/40">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-200">{error}</span>
            </div>
          )}
          
          {!analysisComplete ? (
            <>
              <h2 className="text-xl font-semibold text-gray-200 mb-4">Analyze a Job Posting</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-indigo-200/85 mb-2">
                  Job Posting URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    value={jobUrl}
                    onChange={handleJobUrlChange}
                    className="w-full pl-10 form-input bg-gray-800/70 border border-gray-700/70 rounded-lg text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500"
                    placeholder="https://example.com/job-posting"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Enter the URL of the job posting to analyze with AI
                </p>
              </div>
              
              <div className="mb-8">
                <div className="bg-indigo-900/20 rounded-lg p-4 border border-indigo-800/30">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-semibold text-indigo-300 mb-2">How It Works</h3>
                      <p className="text-xs text-indigo-200/75 leading-relaxed">
                        Our AI will scrape the job posting URL and analyze the description to identify key requirements, 
                        potential interview questions, and provide personalized preparation tips. This helps you prepare 
                        targeted answers and reduce interview anxiety.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={startAnalysis}
                disabled={!jobUrl || isAnalyzing}
                className={`w-full flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20 py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-indigo-500/30 hover:translate-y-[-2px] ${isAnalyzing ? 'cursor-not-allowed' : ''}`}
              >
                {isAnalyzing ? (
                  <>
                    <div className="h-5 w-5 mr-3 animate-spin rounded-full border-2 border-t-2 border-white border-t-transparent"></div>
                    Analyzing Job Posting...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Analyze Job
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <div className="bg-indigo-500/10 p-4 rounded-lg mb-6 flex items-center border border-indigo-800/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-indigo-200">Analysis complete! Here's what we found:</span>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-200 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Job Analysis Results
              </h2>
              
              {analysisResults && (
                <div className="space-y-6">
                  <div className="bg-gray-800/40 rounded-lg border border-gray-700/50 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-800/70 border-b border-gray-700/50">
                      <h3 className="text-md font-medium text-gray-200 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Job Overview
                      </h3>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-300 text-sm leading-relaxed">{analysisResults.overview}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/40 rounded-lg border border-gray-700/50 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-800/70 border-b border-gray-700/50">
                      <h3 className="text-md font-medium text-gray-200 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                        Key Requirements
                      </h3>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-2">
                        {analysisResults.requirements.map((req: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                            </svg>
                            <span className="text-gray-300 text-sm">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/40 rounded-lg border border-gray-700/50 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-800/70 border-b border-gray-700/50">
                      <h3 className="text-md font-medium text-gray-200 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Potential Interview Questions
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-4">
                        {Object.entries(analysisResults.interviewQuestions).map(([category, questions]: [string, any]) => (
                          <div key={category}>
                            <p className="text-indigo-300 font-medium text-sm mb-2">{category}</p>
                            <ul className="space-y-2 pl-2">
                              {(questions as string[]).map((question: string, index: number) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-indigo-400 mr-2 flex-shrink-0">•</span>
                                  <span className="text-gray-300 text-sm">{question}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/40 rounded-lg border border-gray-700/50 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-800/70 border-b border-gray-700/50">
                      <h3 className="text-md font-medium text-gray-200 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Skills to Emphasize
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {analysisResults.skills.map((skill: string, index: number) => (
                          <span key={index} className="bg-indigo-900/40 text-indigo-300 text-xs font-medium px-2.5 py-1 rounded-md border border-indigo-800/30">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/40 rounded-lg border border-gray-700/50 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-800/70 border-b border-gray-700/50">
                      <h3 className="text-md font-medium text-gray-200 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Interview Preparation Tips
                      </h3>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-2">
                        {analysisResults.preparationTips.map((tip: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-gray-300 text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex justify-between">
                <button
                  onClick={resetAnalysis}
                  className="flex items-center justify-center px-5 py-2.5 bg-gray-800/80 text-gray-200 border border-gray-700/50 rounded-lg hover:bg-gray-700/80 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Analyze Another Job
                </button>
                
                <button
                  className="flex items-center justify-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  onClick={() => {
                    if (window.print) {
                      window.print();
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Save Results
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}