"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/firebase/auth";
import { 
  Interview 
} from "@/firebase/interviews";
import { 
  doc, 
  onSnapshot, 
  collection, 
  query, 
  orderBy, 
  DocumentSnapshot, 
  QuerySnapshot, 
  FirestoreError 
} from "firebase/firestore";
import { db } from "@/firebase/config";
import Sidebar from "@/components/dashboard/Sidebar";
import Link from "next/link";

export default function InterviewDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullTranscript, setShowFullTranscript] = useState(false);

  useEffect(() => {
    if (!user || !id) return;
    
    setIsLoading(true);
    
    // Setup real-time listeners instead of one-time fetch
    const interviewRef = doc(db, "interviews", id as string);
    const unsubscribeInterview = onSnapshot(
      interviewRef, 
      (docSnap: DocumentSnapshot) => {
        if (!docSnap.exists()) {
          console.log(`Interview ${id} not found`);
          router.push('/dashboard/history');
          return;
        }
        
        setInterview({
          id: docSnap.id,
          ...docSnap.data()
        } as Interview);
        setIsLoading(false);
      }, 
      (error: FirestoreError) => {
        console.error("Error fetching interview:", error);
        setIsLoading(false);
      }
    );
    
    // Set up listener for questions subcollection
    const questionsCollection = collection(db, "interviews", id as string, "questions");
    const questionsQuery = query(questionsCollection, orderBy("timestamp", "asc"));
    
    const unsubscribeQuestions = onSnapshot(
      questionsQuery, 
      (querySnap: QuerySnapshot) => {
        const questionsList = querySnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuestions(questionsList);
      }, 
      (error: FirestoreError) => {
        console.error("Error fetching questions:", error);
      }
    );
    
    // Return cleanup function to unsubscribe from both listeners
    return () => {
      unsubscribeInterview();
      unsubscribeQuestions();
      console.log(`Cleaned up listeners for interview ${id}`);
    };
  }, [id, user, router]);

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

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-950">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-2 border-indigo-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex h-screen bg-gray-950">
        <Sidebar />
        <div className="flex-1 p-6 md:p-8 flex flex-col items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-200 mb-4">Interview not found</h2>
            <p className="text-gray-400 mb-6">The interview you're looking for doesn't exist or you don't have permission to view it.</p>
            <Link
              href="/dashboard/history"
              className="btn bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] py-2 px-4 rounded-md"
            >
              Back to Interview History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Create a truncated version of the transcript
  const truncatedTranscript = interview.transcript 
    ? interview.transcript.slice(0, 300) + (interview.transcript.length > 300 ? '...' : '')
    : 'No transcript available';

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-950">
        <main className="flex-1 p-6 md:p-8">
          {/* Header with back button */}
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <Link 
                href="/dashboard/history" 
                className="mr-3 text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
                Interview Details
              </h1>
            </div>
            <p className="mt-2 text-indigo-200/65 text-lg">
              Review your interview with {interview.company} on {formatDate(interview.date)}
            </p>
          </div>

          {/* Interview overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 shadow-lg shadow-gray-950/50 backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-300">
              <h2 className="text-xl font-semibold text-gray-200 mb-4">Interview Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Company</p>
                  <p className="text-lg text-white font-medium">{interview.company}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Position</p>
                  <p className="text-lg text-white">{interview.position}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Date</p>
                  <p className="text-lg text-white">{formatDate(interview.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Duration</p>
                  <p className="text-lg text-white">{interview.duration}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 shadow-lg shadow-gray-950/50 backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-300">
              <h2 className="text-xl font-semibold text-gray-200 mb-4">Performance</h2>
              <div className="flex items-center justify-center mb-6">
                <div className="relative h-32 w-32">
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
                      strokeDasharray={`${interview.score}, 100`}
                      className="drop-shadow-[0_0_4px_rgba(79,70,229,0.6)]"
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className="text-3xl font-bold text-white">{interview.score}%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">AI Assists</p>
                  <p className="text-lg text-white">{interview.aiUsage}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Questions Answered</p>
                  <p className="text-lg text-white">{questions.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 shadow-lg shadow-gray-950/50 backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-300">
              <h2 className="text-xl font-semibold text-gray-200 mb-4">Feedback</h2>
              <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                <p className="text-gray-300">{interview.feedback || "No feedback available for this interview."}</p>
              </div>
              <div className="flex justify-center">
                <Link
                  href="/dashboard/interview"
                  className="btn bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] py-2 px-4 rounded-md"
                >
                  Start New Interview
                </Link>
              </div>
            </div>
          </div>

          {/* Questions and Answers */}
          {questions.length > 0 && (
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 shadow-lg shadow-gray-950/50 backdrop-blur-sm mb-8">
              <h2 className="text-xl font-semibold text-gray-200 mb-4">Questions & Answers</h2>
              <div className="space-y-6">
                {questions.map((q, index) => (
                  <div key={index} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                    <div className="mb-2">
                      <span className="inline-block bg-indigo-900/30 text-indigo-300 text-xs font-medium px-2 py-1 rounded-full mb-2">Question {index + 1}</span>
                      <p className="text-gray-200 font-medium">{q.question}</p>
                    </div>
                    
                    {q.answer && (
                      <div className="mb-3 pl-4 border-l-2 border-gray-700">
                        <p className="text-sm text-gray-400 mb-1">Your Answer:</p>
                        <p className="text-gray-300">{q.answer}</p>
                      </div>
                    )}
                    
                    {q.aiSuggestion && (
                      <div className="pl-4 border-l-2 border-indigo-600/50">
                        <p className="text-sm text-indigo-400 mb-1">AI Suggestion:</p>
                        <p className="text-gray-300">{q.aiSuggestion}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Full Transcript */}
          {interview.transcript && (
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 shadow-lg shadow-gray-950/50 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-200">Interview Transcript</h2>
                <button 
                  onClick={() => setShowFullTranscript(!showFullTranscript)} 
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  {showFullTranscript ? 'Show Less' : 'Show Full Transcript'}
                </button>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-300 whitespace-pre-line">
                  {showFullTranscript ? interview.transcript : truncatedTranscript}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}