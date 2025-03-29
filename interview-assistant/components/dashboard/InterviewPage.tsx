"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/firebase/auth";
import Sidebar from "@/components/dashboard/Sidebar";
import { createInterviewSession, completeInterviewSession, addInterviewQuestion } from '@/firebase/interviews';
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function InterviewPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [interviewType, setInterviewType] = useState("Technical Interview");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [autoResponse, setAutoResponse] = useState(true);
  const [currentInterviewId, setCurrentInterviewId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [aiUsageCount, setAiUsageCount] = useState(0);
  const [interviewStartTime, setInterviewStartTime] = useState<Date | null>(null);
  
  // Refs for speech recognition
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);

  // Memoize the speech recognition setup
  const setupSpeechRecognition = useCallback(() => {
    // Only run this in browser environment
    if (typeof window !== 'undefined') {
      // Define SpeechRecognition with proper type handling
      const SpeechRecognitionAPI = window.SpeechRecognition || 
                                    window.webkitSpeechRecognition || 
                                    null;
      
      if (SpeechRecognitionAPI) {
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = transcript;
          
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
              
              // Here we'd call the AI to generate responses
              if (autoResponse) {
                simulateAIResponse(event.results[i][0].transcript);
              }
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          
          setTranscript(finalTranscript);
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
        };

        return recognition;
      }
    }
    return null;
  }, [transcript, autoResponse]);

  useEffect(() => {
    // Setup speech recognition
    recognitionRef.current = setupSpeechRecognition();
    
    // Cleanup function 
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [setupSpeechRecognition]);
  
  const startRecording = () => {
    if (recognitionRef.current && !isListeningRef.current) {
      recognitionRef.current.start();
      isListeningRef.current = true;
      setIsRecording(true);
    }
  };
  
  const stopRecording = () => {
    if (recognitionRef.current && isListeningRef.current) {
      recognitionRef.current.stop();
      isListeningRef.current = false;
      setIsRecording(false);
    }
  };
  
  // Simulate AI response (placeholder for now)
  const simulateAIResponse = (question: string) => {
    // Just a simple placeholder for now
    // Later, this would call your AI service
    console.log("AI received question:", question);
    setAiUsageCount(prev => prev + 1);
    
    // Simulate storing the question and response in Firestore
    if (currentInterviewId) {
      addInterviewQuestion(currentInterviewId, {
        question,
        answer: "User's answer would go here",
        aiSuggestion: "AI suggested response would go here",
      })
      .catch(error => console.error("Error adding question:", error));
    }
  };
  
  const startInterview = async () => {
    if (!user) return;
    
    try {
      // Create a new interview session in Firestore
      const interviewId = await createInterviewSession(user.uid, {
        company: company || "Practice Interview",
        position: position || interviewType
      });
      
      setCurrentInterviewId(interviewId);
      setTranscript("");
      setAiUsageCount(0);
      setInterviewStartTime(new Date());
      setIsInterviewStarted(true);
      
      // Start recording
      startRecording();
    } catch (error) {
      console.error("Error starting interview:", error);
    }
  };
  
  const endInterview = async () => {
    // Stop recording
    stopRecording();
    
    if (!currentInterviewId || !interviewStartTime) return;
    
    try {
      // Calculate duration
      const endTime = new Date();
      const durationMs = endTime.getTime() - interviewStartTime.getTime();
      const durationMinutes = Math.round(durationMs / 60000);
      
      // Update the interview session with final details
      await completeInterviewSession(currentInterviewId, {
        duration: `${durationMinutes} minutes`,
        aiUsage: aiUsageCount,
        score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100 for demo
        feedback: "Interview completed successfully",
        transcript: transcript
      });
      
      setIsInterviewStarted(false);
      
      // Navigate to history page after a slight delay
      setTimeout(() => {
        router.push('/dashboard/history');
      }, 1000);
    } catch (error) {
      console.error("Error ending interview:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-gray-900/80 border-b border-gray-800 backdrop-blur-sm shadow-md">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="flex items-center text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 px-4 py-2 rounded-lg transition-all duration-300 shadow-lg shadow-indigo-600/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-medium">Dashboard</span>
              </Link>
              <h1 className="text-xl font-semibold text-white">Interview</h1>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6 bg-gradient-to-b from-gray-900 to-gray-950">
          <div className="max-w-4xl mx-auto">
            {/* Page Heading */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                Start Interview
              </h1>
              <p className="text-indigo-200/70 text-lg">
                Begin your interview with AI-powered assistance
              </p>
            </div>

            {/* Interview Setup Section */}
            {!isInterviewStarted ? (
              <div className="bg-gradient-to-b from-gray-900/80 to-gray-900/40 rounded-xl p-8 border border-gray-800/80 shadow-xl backdrop-blur-sm hover:border-indigo-500/20 transition-all duration-300 relative overflow-hidden">
                {/* Background blobs */}
                <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-indigo-600/5 rounded-full blur-3xl"></div>
                <div className="absolute top-20 -left-20 w-40 h-40 bg-indigo-600/5 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Interview Setup
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Company Input */}
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-indigo-200 mb-2">
                        Company (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <input
                          id="company"
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full pl-10 form-input bg-gray-800/70 border-gray-700/80 rounded-lg text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
                          placeholder="Company name"
                        />
                      </div>
                    </div>
                    
                    {/* Position Input */}
                    <div>
                      <label htmlFor="position" className="block text-sm font-medium text-indigo-200 mb-2">
                        Position (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          id="position"
                          type="text"
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                          className="w-full pl-10 form-input bg-gray-800/70 border-gray-700/80 rounded-lg text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
                          placeholder="Position title"
                        />
                      </div>
                    </div>
                    
                    {/* Interview Type Select */}
                    <div>
                      <label htmlFor="interview-type" className="block text-sm font-medium text-indigo-200 mb-2">
                        Interview Type
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M9 4h6a2 2 0 012 2v14a2 2 0 01-2 2H9a2 2 0 01-2-2V6a2 2 0 012-2z" />
                          </svg>
                        </div>
                        <select 
                          id="interview-type"
                          value={interviewType}
                          onChange={(e) => setInterviewType(e.target.value)}
                          className="w-full pl-10 form-select bg-gray-800/70 border-gray-700/80 rounded-lg text-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm appearance-none pr-10"
                        >
                          <option>Technical Interview</option>
                          <option>Behavioral Interview</option>
                          <option>Case Interview</option>
                          <option>General Interview</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* AI Response Settings */}
                    <div>
                      <label className="block text-sm font-medium text-indigo-200 mb-2">
                        AI Response Settings
                      </label>
                      <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 flex items-center">
                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input 
                              type="checkbox" 
                              id="auto-response" 
                              checked={autoResponse}
                              onChange={(e) => setAutoResponse(e.target.checked)}
                              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-800"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="auto-response" className="text-gray-300">
                              Automatically suggest responses
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* How It Works Section */}
                  <div className="mb-8">
                    <div className="bg-indigo-900/20 rounded-lg p-5 border border-indigo-800/30 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                      
                      <h3 className="text-lg font-semibold text-indigo-300 mb-3">How It Works</h3>
                      <div className="text-indigo-200/85 space-y-3">
                        <p>
                          When you start the interview, we'll use your microphone to listen to your conversation. Our AI will analyze the dialogue in real-time to provide optimal responses.
                        </p>
                        <div className="flex flex-wrap gap-4 mt-2">
                          <div className="flex items-center bg-gray-800/70 px-3 py-1.5 rounded-lg border border-gray-700/50">
                            <span className="bg-gray-700 text-gray-300 w-16 text-center text-xs py-1 px-2 rounded mr-2 font-mono font-bold">Space</span>
                            <span className="text-sm">Activate AI assistance</span>
                          </div>
                          <div className="flex items-center bg-gray-800/70 px-3 py-1.5 rounded-lg border border-gray-700/50">
                            <span className="bg-gray-700 text-gray-300 w-16 text-center text-xs py-1 px-2 rounded mr-2 font-mono font-bold">Esc</span>
                            <span className="text-sm">Hide AI overlay</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Start Button & Status Indicators */}
                  <div className="space-y-4">
                    <button 
                      onClick={startInterview}
                      className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-4 rounded-lg hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 text-lg font-medium flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Start Interview
                    </button>
                    
                    <div className="flex justify-center gap-6">
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-400">Microphone Required</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-400">AI Ready</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-indigo-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-400">Secure Session</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Interview in progress view
              <div className="bg-gradient-to-b from-gray-900/80 to-gray-900/40 rounded-xl p-8 border border-gray-800/80 shadow-xl backdrop-blur-sm relative overflow-hidden">
                {/* Background blobs */}
                <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl"></div>
                <div className="absolute top-20 -left-20 w-40 h-40 bg-indigo-600/5 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  {/* Interview Status Header */}
                  <div className="bg-indigo-900/30 p-6 rounded-xl mb-6 relative overflow-hidden border border-indigo-800/30">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-indigo-600 to-indigo-400"></div>
                    
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center">
                        <div className="bg-indigo-600/40 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-medium text-white">Interview In Progress</h3>
                          <p className="text-indigo-200/65 text-sm">
                            {company || "Practice Interview"} • {position || interviewType}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center bg-gray-800/70 rounded-lg px-3 py-1.5 border border-gray-700/50">
                          <div className={`h-2.5 w-2.5 ${isRecording ? 'bg-green-500 animate-pulse' : 'bg-red-500'} rounded-full mr-2`}></div>
                          <span className="text-sm text-gray-300">{isRecording ? 'Recording' : 'Paused'}</span>
                        </div>
                        <div className="flex items-center bg-gray-800/70 rounded-lg px-3 py-1.5 border border-gray-700/50">
                          <div className="h-2.5 w-2.5 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                          <span className="text-sm text-gray-300">AI Monitoring</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                      <p className="text-indigo-200/80 text-sm">
                        Press <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs font-mono">Space</span> to 
                        activate AI assistance during your interview. Press <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs font-mono">Esc</span> to hide the AI overlay.
                      </p>
                    </div>
                  </div>

                  {/* Transcript Display */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Live Transcript
                      </h3>
                      <div className="text-xs text-gray-400">
                        AI Usage: <span className="text-indigo-400 font-medium">{aiUsageCount}</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 h-64 overflow-y-auto">
                      {transcript ? (
                        <p className="text-gray-300 whitespace-pre-line">{transcript}</p>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                          <p className="text-gray-500">Your interview speech will appear here...</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Control Buttons */}
                  <div className="flex justify-center gap-4">
                    <button 
                      onClick={endInterview}
                      className="px-6 py-3 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border border-red-500/30 hover:from-red-500/30 hover:to-red-600/30 rounded-lg transition-all duration-300 font-medium flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                      End Interview
                    </button>
                    
                    <button 
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`px-6 py-3 ${
                        isRecording 
                          ? 'bg-gray-800/80 text-gray-200 border-gray-700 hover:bg-gray-700/80' 
                          : 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-300 border-green-500/30 hover:from-green-500/30 hover:to-green-600/30'
                      } border rounded-lg transition-all duration-300 font-medium flex items-center`}
                    >
                      {isRecording ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Pause Recording
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Resume Recording
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* AI Response Preview (mockup) */}
                  <div className="mt-6 border border-indigo-500/20 rounded-lg p-4 bg-indigo-950/20 backdrop-blur-sm overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-indigo-300 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        AI Response Preview
                      </h3>
                    </div>
                    <div className="text-gray-300 text-sm">
                      {transcript ? (
                        <p>Ready to provide assistance based on your conversation.</p>
                      ) : (
                        <p className="text-gray-500 italic">AI responses will appear here when the interview begins...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}