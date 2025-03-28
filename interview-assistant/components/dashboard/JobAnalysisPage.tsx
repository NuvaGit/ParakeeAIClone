"use client";

import { useState } from "react";
import { useAuth } from "@/firebase/auth";
import Sidebar from "@/components/dashboard/Sidebar";


export default function JobAnalysisPage() {
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  
  const handleJobUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobUrl(e.target.value);
  };
  
  const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
  };

  const startAnalysis = () => {
    if (!jobUrl && !jobDescription) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2000);
    
    // In the future, this will send the job description to an AI for analysis
    // and/or scrape the job posting URL
  };

  const resetAnalysis = () => {
    setJobUrl("");
    setJobDescription("");
    setAnalysisComplete(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
          Job Analysis
        </h1>
        <p className="mt-2 text-indigo-200/65 text-lg">
          Understand job requirements and prepare for interviews
        </p>
      </div>

      <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 max-w-3xl">
        {!analysisComplete ? (
          <>
            <h2 className="text-xl font-semibold text-gray-200 mb-4">Analyze a Job Posting</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-indigo-200/65 mb-2">
                Job Posting URL (Optional)
              </label>
              <input
                type="url"
                value={jobUrl}
                onChange={handleJobUrlChange}
                className="w-full form-input bg-gray-800 border-gray-700 rounded-md text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://example.com/job-posting"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the URL of the job posting to automatically analyze it.
              </p>
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-medium text-indigo-200/65 mb-2">
                Or Paste Job Description
              </label>
              <textarea
                rows={8}
                value={jobDescription}
                onChange={handleJobDescriptionChange}
                className="w-full form-textarea bg-gray-800 border-gray-700 rounded-md text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Paste the full job description here..."
              ></textarea>
            </div>

            <div className="mb-6">
              <div className="bg-indigo-900/20 rounded-md p-4 border border-indigo-800/50">
                <h3 className="text-sm font-semibold text-indigo-300 mb-2">How It Works</h3>
                <p className="text-xs text-indigo-200/75">
                  Our AI will analyze the job description to identify key skills, experience requirements, and potential interview questions. 
                  This helps you prepare targeted answers and highlight relevant experience during your interview.
                </p>
              </div>
            </div>

            <button
              onClick={startAnalysis}
              disabled={(!jobUrl && !jobDescription) || isAnalyzing}
              className={`btn w-full bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] py-3 rounded-md disabled:opacity-50 ${isAnalyzing ? 'cursor-not-allowed' : ''}`}
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 mr-3 animate-spin rounded-full border-2 border-t-2 border-white border-t-transparent"></div>
                  Analyzing...
                </div>
              ) : (
                'Analyze Job'
              )}
            </button>
          </>
        ) : (
          <>
            <div className="bg-indigo-500/10 p-4 rounded-lg mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-indigo-200">Job analysis complete!</span>
            </div>

            <h2 className="text-xl font-semibold text-gray-200 mb-4">Job Analysis Results</h2>
            
            {/* This is a placeholder for the actual analysis results */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-200 mb-2">Job Overview</h3>
                <div className="bg-gray-800/50 rounded p-4 border border-gray-700">
                  <p className="text-gray-300">
                    Senior Software Engineer position at a mid-size tech company focusing on cloud infrastructure. 
                    This role emphasizes both technical expertise and team leadership experience.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-200 mb-2">Key Requirements</h3>
                <ul className="bg-gray-800/50 rounded p-4 border border-gray-700 space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                    <span className="text-gray-300">5+ years of software development experience</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                    <span className="text-gray-300">Proficiency in Python and JavaScript</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                    <span className="text-gray-300">Experience with AWS services</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                    <span className="text-gray-300">Team leadership or mentoring experience</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-200 mb-2">Potential Interview Questions</h3>
                <div className="bg-gray-800/50 rounded p-4 border border-gray-700 space-y-3">
                  <div>
                    <p className="text-indigo-300 font-medium">Technical Questions</p>
                    <ul className="mt-2 space-y-1 text-gray-300 text-sm">
                      <li>• Describe a complex technical challenge you faced and how you solved it.</li>
                      <li>• How would you design a scalable microservice architecture?</li>
                      <li>• Explain your experience with continuous integration/deployment pipelines.</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-indigo-300 font-medium">Leadership Questions</p>
                    <ul className="mt-2 space-y-1 text-gray-300 text-sm">
                      <li>• How do you mentor junior team members?</li>
                      <li>• Describe a situation where you had to lead a project through a difficult challenge.</li>
                      <li>• How do you handle disagreements within your team?</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-200 mb-2">Skills to Emphasize</h3>
                <div className="bg-gray-800/50 rounded p-4 border border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-indigo-900/50 text-indigo-300 text-xs font-medium px-2.5 py-1 rounded border border-indigo-800/50">Python</span>
                    <span className="bg-indigo-900/50 text-indigo-300 text-xs font-medium px-2.5 py-1 rounded border border-indigo-800/50">JavaScript</span>
                    <span className="bg-indigo-900/50 text-indigo-300 text-xs font-medium px-2.5 py-1 rounded border border-indigo-800/50">AWS</span>
                    <span className="bg-indigo-900/50 text-indigo-300 text-xs font-medium px-2.5 py-1 rounded border border-indigo-800/50">CI/CD</span>
                    <span className="bg-indigo-900/50 text-indigo-300 text-xs font-medium px-2.5 py-1 rounded border border-indigo-800/50">System Design</span>
                    <span className="bg-indigo-900/50 text-indigo-300 text-xs font-medium px-2.5 py-1 rounded border border-indigo-800/50">Team Leadership</span>
                    <span className="bg-indigo-900/50 text-indigo-300 text-xs font-medium px-2.5 py-1 rounded border border-indigo-800/50">Microservices</span>
                    <span className="bg-indigo-900/50 text-indigo-300 text-xs font-medium px-2.5 py-1 rounded border border-indigo-800/50">API Design</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={resetAnalysis}
                className="btn bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 py-2 px-4 rounded-md"
              >
                Analyze Another Job
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}