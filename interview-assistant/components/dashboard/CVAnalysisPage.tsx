"use client";

import { useState } from "react";
import { useAuth } from "@/firebase/auth";

export default function CVAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const startAnalysis = () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2000);
    
    // In the future, this will send the CV to an AI for analysis
  };

  const resetAnalysis = () => {
    setFile(null);
    setAnalysisComplete(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
          CV Analysis
        </h1>
        <p className="mt-2 text-indigo-200/65 text-lg">
          Get AI-powered feedback on your resume or CV
        </p>
      </div>

      <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 max-w-3xl">
        {!analysisComplete ? (
          <>
            <h2 className="text-xl font-semibold text-gray-200 mb-4">Upload Your CV</h2>
            
            <div className="mb-8">
              <label className="block text-sm font-medium text-indigo-200/65 mb-2">
                CV or Resume File
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-500"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none"
                    >
                      <span className="px-2 py-1">Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, or DOCX up to 5MB</p>
                </div>
              </div>
              {file && (
                <div className="mt-3 text-sm text-gray-300">
                  Selected file: <span className="font-medium">{file.name}</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-indigo-200/65 mb-2">
                Target Role (Optional)
              </label>
              <input
                type="text"
                className="w-full form-input bg-gray-800 border-gray-700 rounded-md text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Software Engineer, Product Manager, Data Scientist"
              />
              <p className="mt-1 text-xs text-gray-500">
                Specifying a target role helps our AI tailor the feedback to your career goals.
              </p>
            </div>

            <button
              onClick={startAnalysis}
              disabled={!file || isAnalyzing}
              className={`btn w-full bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] py-3 rounded-md disabled:opacity-50 ${isAnalyzing ? 'cursor-not-allowed' : ''}`}
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 mr-3 animate-spin rounded-full border-2 border-t-2 border-white border-t-transparent"></div>
                  Analyzing...
                </div>
              ) : (
                'Analyze CV'
              )}
            </button>
          </>
        ) : (
          <>
            <div className="bg-indigo-500/10 p-4 rounded-lg mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-indigo-200">Analysis of <strong>{file?.name}</strong> complete!</span>
            </div>

            <h2 className="text-xl font-semibold text-gray-200 mb-4">CV Analysis Results</h2>
            
            {/* This is a placeholder for the actual analysis results */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-200 mb-2">Overview</h3>
                <div className="bg-gray-800/50 rounded p-4 border border-gray-700">
                  <p className="text-gray-300">
                    Your CV effectively highlights your technical skills and experience, but could benefit from quantifying achievements and clarifying your career narrative.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-200 mb-2">Strengths</h3>
                <ul className="bg-gray-800/50 rounded p-4 border border-gray-700 space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">Strong technical skills section with relevant technologies</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">Clean, professional formatting</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">Relevant education and certifications</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-200 mb-2">Areas for Improvement</h3>
                <ul className="bg-gray-800/50 rounded p-4 border border-gray-700 space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">Job descriptions focus on responsibilities rather than achievements</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">Missing quantifiable results and metrics</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">Professional summary could be more tailored to target role</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-200 mb-2">ATS Compatibility</h3>
                <div className="bg-gray-800/50 rounded p-4 border border-gray-700">
                  <div className="flex items-center mb-2">
                    <div className="h-2 flex-1 bg-gray-700 rounded-full">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="ml-4 text-gray-300 font-medium">85%</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Your CV is mostly compatible with Applicant Tracking Systems. Consider incorporating more industry-specific keywords to improve matching.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={resetAnalysis}
                className="btn bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 py-2 px-4 rounded-md"
              >
                Analyze Another CV
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}