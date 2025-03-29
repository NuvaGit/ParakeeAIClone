"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/firebase/auth";
import Sidebar from "@/components/dashboard/Sidebar";

interface AnalysisResults {
  overview: string;
  strengths: string[];
  improvements: string[];
  atsScore: number;
  atsCompatibility: string;
  keywordSuggestions: string[];
  recommendedActions?: string[];
}

export default function CVAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [targetRole, setTargetRole] = useState("");
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Please upload a PDF, DOC, or DOCX file");
        return;
      }
      
      // Check file size (5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File too large. Maximum size is 5MB");
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleTargetRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetRole(e.target.value);
  };

  const startAnalysis = async () => {
    if (!file) {
      setError("Please upload a CV file first");
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Create form data to send the file
      const formData = new FormData();
      formData.append('cv', file);
      formData.append('targetRole', targetRole);
      
      // Send to your API endpoint
      const response = await fetch('/api/analyze-cv', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setAnalysisResults(data);
      setAnalysisComplete(true);
    } catch (err) {
      setError(`Analysis failed: ${err instanceof Error ? err.message : "Unknown error occurred"}`);
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setAnalysisComplete(false);
    setAnalysisResults(null);
    setTargetRole("");
    setError(null);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(droppedFile.type)) {
        setError("Please upload a PDF, DOC, or DOCX file");
        return;
      }
      
      // Check file size (5MB)
      if (droppedFile.size > 5 * 1024 * 1024) {
        setError("File too large. Maximum size is 5MB");
        return;
      }
      
      setFile(droppedFile);
      setError(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mb-8">
          <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
            CV Analysis
          </h1>
          <p className="mt-2 text-indigo-200/65 text-lg">
            Get AI-powered feedback on your resume or CV
          </p>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 max-w-3xl transition-all duration-300 hover:border-indigo-700/30 shadow-lg">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md">
              <p className="text-red-300">{error}</p>
            </div>
          )}
          
          {!analysisComplete ? (
            <>
              <h2 className="text-xl font-semibold text-gray-200 mb-4">Upload Your CV</h2>
              
              <div className="mb-8">
                <label className="block text-sm font-medium text-indigo-200/65 mb-2">
                  CV or Resume File
                </label>
                <div 
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md transition-all duration-200 hover:border-indigo-500/50 hover:bg-indigo-950/20"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                >
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
                        className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none transition-colors duration-200"
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
                  <div className="mt-3 text-sm flex items-center">
                    <div className="flex-1">
                      <span className="text-gray-400">Selected file: </span>
                      <span className="font-medium text-indigo-300">{file.name}</span>
                      <span className="ml-2 text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button 
                      onClick={() => setFile(null)} 
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-indigo-200/65 mb-2">
                  Target Role (Optional)
                </label>
                <input
                  type="text"
                  className="w-full form-input bg-gray-800 border-gray-700 rounded-md text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="e.g., Software Engineer, Product Manager, Data Scientist"
                  value={targetRole}
                  onChange={handleTargetRoleChange}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Specifying a target role helps our AI tailor the feedback to your career goals.
                </p>
              </div>

              <button
                onClick={startAnalysis}
                disabled={!file || isAnalyzing}
                className={`w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-3 px-4 rounded-md font-medium disabled:opacity-50 transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-lg ${isAnalyzing ? 'cursor-not-allowed' : 'hover:from-indigo-500 hover:to-indigo-400'}`}
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
              
              {/* Render analysis results */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-200 mb-2">Overview</h3>
                  <div className="bg-gray-800/50 rounded p-4 border border-gray-700 shadow-inner">
                    <p className="text-gray-300">
                      {analysisResults?.overview || 
                       "Your CV effectively highlights your technical skills and experience, but could benefit from quantifying achievements and clarifying your career narrative."}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-200 mb-2">Strengths</h3>
                  <ul className="bg-gray-800/50 rounded p-4 border border-gray-700 shadow-inner space-y-2">
                    {analysisResults?.strengths?.length ? (
                      analysisResults.strengths.map((strength: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-300">{strength}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400">No specific strengths identified</li>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-200 mb-2">Areas for Improvement</h3>
                  <ul className="bg-gray-800/50 rounded p-4 border border-gray-700 shadow-inner space-y-2">
                    {analysisResults?.improvements?.length ? (
                      analysisResults.improvements.map((improvement: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-300">{improvement}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400">No specific improvements suggested</li>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-200 mb-2">ATS Compatibility</h3>
                  <div className="bg-gray-800/50 rounded p-4 border border-gray-700 shadow-inner">
                    <div className="flex items-center mb-2">
                      <div className="h-2 flex-1 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-2 rounded-full ${analysisResults?.atsScore && analysisResults.atsScore >= 80 
                            ? 'bg-gradient-to-r from-green-600 to-green-400' 
                            : analysisResults?.atsScore && analysisResults.atsScore >= 50 
                            ? 'bg-gradient-to-r from-yellow-600 to-yellow-400'
                            : 'bg-gradient-to-r from-red-600 to-red-400'}`}
                          style={{ width: `${analysisResults?.atsScore || 0}%` }}
                        ></div>
                      </div>
                      <span className="ml-4 text-gray-300 font-medium">{analysisResults?.atsScore || 0}%</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {analysisResults?.atsCompatibility || 
                       "Your CV is mostly compatible with Applicant Tracking Systems. Consider incorporating more industry-specific keywords to improve matching."}
                    </p>
                  </div>
                </div>

                {analysisResults?.keywordSuggestions && analysisResults.keywordSuggestions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-200 mb-2">Keyword Suggestions</h3>
                    <div className="bg-gray-800/50 rounded p-4 border border-gray-700 shadow-inner">
                      <div className="flex flex-wrap gap-2">
                        {analysisResults.keywordSuggestions.map((keyword: string, index: number) => (
                          <span key={index} className="bg-indigo-900/50 text-indigo-200 px-2 py-1 rounded-md text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {analysisResults?.recommendedActions && analysisResults.recommendedActions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-200 mb-2">Recommended Actions</h3>
                    <ul className="bg-gray-800/50 rounded p-4 border border-gray-700 shadow-inner space-y-2">
                      {analysisResults.recommendedActions.map((action: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span className="text-gray-300">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={resetAnalysis}
                  className="flex-1 bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Analyze Another CV
                </button>
                
                <button
                  onClick={() => {
                    // Export functionality placeholder
                    alert("This will download a PDF report in the full implementation");
                  }}
                  className="flex-1 bg-indigo-800 text-white hover:bg-indigo-700 py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Export Results
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}