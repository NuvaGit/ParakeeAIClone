"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/firebase/auth";
import Sidebar from "@/components/dashboard/Sidebar";
import { createInterviewSession, completeInterviewSession, addInterviewQuestion } from '@/firebase/interviews';
import { useRouter } from 'next/navigation';

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
      <div className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-950">
        <main className="flex-1 p-6 md:p-8">
          <div className="mb-8">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Start Interview
            </h1>
            <p className="mt-2 text-indigo-200/65 text-lg">
              Begin your interview with AI assistance
            </p>
          </div>

          {!isInterviewStarted ? (
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 max-w-3xl shadow-lg shadow-gray-950/50 backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-300">
              <h2 className="text-xl font-semibold text-gray-200 mb-4">Interview Setup</h2>
              
              <div className="mb-6">
                <label htmlFor="company" className="block text-sm font-medium text-indigo-200/65 mb-2">
                  Company (Optional)
                </label>
                <input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full form-input bg-gray-800 border-gray-700 rounded-md text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Company name"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="position" className="block text-sm font-medium text-indigo-200/65 mb-2">
                  Position (Optional)
                </label>
                <input
                  id="position"
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full form-input bg-gray-800 border-gray-700 rounded-md text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Position title"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="interview-type" className="block text-sm font-medium text-indigo-200/65 mb-2">
                  Interview Type
                </label>
                <select 
                  id="interview-type"
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
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
                    checked={autoResponse}
                    onChange={(e) => setAutoResponse(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                  />
                  <label htmlFor="auto-response" className="ml-2 text-sm text-gray-300">
                    Automatically suggest responses
                  </label>
                </div>
              </div>

              <div className="mb-8">
                <div className="bg-indigo-900/20 rounded-md p-4 border border-indigo-800/50 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                  <h3 className="text-sm font-semibold text-indigo-300 mb-2">How It Works</h3>
                  <p className="text-xs text-indigo-200/75">
                    When you start the interview, we'll use your microphone to listen to your conversation.
                    Press <span className="bg-gray-700 text-gray-300 px-1 py-0.5 rounded">Space</span> to 
                    activate AI assistance. Our system will analyze the conversation and provide optimal responses.
                    Press <span className="bg-gray-700 text-gray-300 px-1 py-0.5 rounded">Esc</span> at any time to 
                    hide the AI overlay.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={startInterview}
                  className="btn w-full bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] py-3 rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20"
                >
                  Start Interview
                </button>
                
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-400">Microphone Required</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-400">AI Ready</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-indigo-500 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-400">Secure Session</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 max-w-3xl shadow-lg shadow-gray-950/50 backdrop-blur-sm">
              <div className="bg-indigo-500/10 p-8 rounded-lg mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-indigo-600 to-indigo-400"></div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-16 w-16 text-indigo-400 mx-auto mb-4 animate-pulse" 
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
                
                <div className="flex justify-center space-x-4 mb-2">
                  <div className="flex items-center bg-gray-800/50 rounded-full px-3 py-1">
                    <div className={`h-2 w-2 ${isRecording ? 'bg-green-500 animate-pulse' : 'bg-red-500'} rounded-full mr-2`}></div>
                    <span className="textxs text-gray-300">{isRecording ? 'Recording' : 'Paused'}</span>
                  </div>
                  <div className="flex items-center bg-gray-800/50 rounded-full px-3 py-1">
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-xs text-gray-300">AI Monitoring</span>
                  </div>
                </div>
              </div>

              {/* Transcript Display */}
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700 mb-6 max-h-64 overflow-y-auto">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Live Transcript</h3>
                <p className="text-sm text-gray-400 whitespace-pre-line">
                  {transcript || "Your interview speech will appear here..."}
                </p>
              </div>
              
              <div className="flex space-x-4 justify-center">
                <button 
                  onClick={endInterview}
                  className="btn bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 py-2 px-4 rounded-md transition-all duration-300"
                >
                  End Interview
                </button>
                
                <button 
                  onClick={isRecording ? stopRecording : startRecording}
                  className="btn bg-gray-800/80 text-gray-200 border border-gray-700 hover:bg-gray-700 py-2 px-4 rounded-md transition-all duration-300"
                >
                  {isRecording ? 'Pause' : 'Resume'}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}