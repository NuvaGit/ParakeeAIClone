"use client";

import { useState } from "react";
import { useAuth } from "@/firebase/auth";

export default function InterviewPage() {
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  
  const startInterview = () => {
    setIsInterviewStarted(true);
    // In the future, this will initialize the interview overlay and AI
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
          Start Interview
        </h1>
        <p className="mt-2 text-indigo-200/65 text-lg">
          Begin your interview with AI assistance
        </p>
      </div>

      {!isInterviewStarted ? (
        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 max-w-3xl">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">Interview Setup</h2>
          
          <div className="mb-6">
            <label htmlFor="interview-type" className="block text-sm font-medium text-indigo-200/65 mb-2">
              Interview Type
            </label>
            <select 
              id="interview-type"
              className="w-full form-select bg-gray-800 border-gray-700 rounded-md text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>Technical Interview</option>
              <option>Behavioral Interview</option>
              <option>Case Interview</option>
              <option>General Interview</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-indigo-200/65 mb-2">
              AI Response Settings
            </label>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="auto-response" 
                className="form-checkbox h-4 w-4 text-indigo-600 rounded"
              />
              <label htmlFor="auto-response" className="ml-2 text-sm text-gray-300">
                Automatically suggest responses
              </label>
            </div>
          </div>

          <div className="mb-8">
            <div className="bg-indigo-900/20 rounded-md p-4 border border-indigo-800/50">
              <h3 className="text-sm font-semibold text-indigo-300 mb-2">How It Works</h3>
              <p className="text-xs text-indigo-200/75">
                During the interview, press <span className="bg-gray-700 text-gray-300 px-1 py-0.5 rounded">Space</span> to 
                activate AI assistance. Our system will analyze the conversation and provide optimal responses.
                Press <span className="bg-gray-700 text-gray-300 px-1 py-0.5 rounded">Esc</span> at any time to 
                hide the AI overlay.
              </p>
            </div>
          </div>

          <button 
            onClick={startInterview}
            className="btn w-full bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] py-3 rounded-md"
          >
            Start Interview
          </button>
        </div>
      ) : (
        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 max-w-3xl text-center">
          <div className="bg-indigo-500/10 p-8 rounded-lg mb-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-indigo-400 mx-auto mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-200 mb-2">Interview In Progress</h3>
            <p className="text-indigo-200/65 text-sm mb-4">
              The AI overlay is ready. Press <span className="bg-gray-700 text-gray-300 px-1 py-0.5 rounded">Space</span> to 
              activate assistance during your interview.
            </p>
          </div>
          
          <button 
            onClick={() => setIsInterviewStarted(false)}
            className="btn bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 py-2 px-4 rounded-md"
          >
            End Interview
          </button>
        </div>
      )}
    </div>
  );
}