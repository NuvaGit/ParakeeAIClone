import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from "../layout/Navbar";
import '../../assets/css/interview-sessions-dark.css';



// Import any necessary icons
import { 
  FaMicrophone, FaPlus, FaSearch, FaTimes, FaFilter, 
  FaCalendarAlt, FaQuestionCircle, FaLanguage, FaSync, 
  FaEye, FaFileAlt, FaBuilding, FaTrashAlt, FaEllipsisV 
} from 'react-icons/fa';

const InterviewSessions = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [interviewToDelete, setInterviewToDelete] = useState(null);

  // Fetch user's interview sessions
  useEffect(() => {
    const fetchInterviews = async () => {
      if (!currentUser) return;

      try {
        const interviewsRef = collection(db, 'interviews');
        const q = query(interviewsRef, where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const interviewsData = [];
        querySnapshot.forEach((doc) => {
          interviewsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        // Sort by date (most recent first)
        interviewsData.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return new Date(b.createdAt.seconds * 1000) - new Date(a.createdAt.seconds * 1000);
        });
        
        setInterviews(interviewsData);
      } catch (err) {
        console.error("Error fetching interviews:", err);
        setError("Failed to load interviews. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [currentUser]);

  const openDeleteModal = (interview) => {
    setInterviewToDelete(interview);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setInterviewToDelete(null);
  };

  const handleDeleteInterview = async () => {
    if (!interviewToDelete) return;
    
    try {
      await deleteDoc(doc(db, 'interviews', interviewToDelete.id));
      setInterviews(interviews.filter(interview => interview.id !== interviewToDelete.id));
      closeDeleteModal();
    } catch (err) {
      console.error("Error deleting interview:", err);
      setError("Failed to delete interview. Please try again.");
    }
  };

  const filteredInterviews = interviews
    .filter(interview => {
      // Apply status filter
      if (filterStatus === 'all') return true;
      if (filterStatus === 'withQuestions' && interview.questions && interview.questions.length > 0) return true;
      if (filterStatus === 'noQuestions' && (!interview.questions || interview.questions.length === 0)) return true;
      return false;
    })
    .filter(interview => {
      // Apply search term
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        (interview.company && interview.company.toLowerCase().includes(searchLower)) ||
        (interview.position && interview.position.toLowerCase().includes(searchLower))
      );
    });

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Date not available';
    
    const date = timestamp.seconds 
      ? new Date(timestamp.seconds * 1000) 
      : new Date(timestamp);
    
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const retryLoading = () => {
    setLoading(true);
    setError(null);
    // Fetch interviews again
    const fetchInterviews = async () => {
      try {
        const interviewsRef = collection(db, 'interviews');
        const q = query(interviewsRef, where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const interviewsData = [];
        querySnapshot.forEach((doc) => {
          interviewsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setInterviews(interviewsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching interviews:", err);
        setError("Failed to load interviews. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Fixed navbar with proper spacing */}
      <div className="sticky top-0 z-50 bg-gray-900 bg-opacity-95 backdrop-blur-sm border-b border-gray-800 shadow-xl">
        <Navbar />
      </div>
      
      {/* Main content area - with proper padding to avoid navbar overlap */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
        {/* Page header section */}
        <div className="mb-10 mt-16">
          <h1 className="text-4xl font-bold text-white mb-3 flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Interview Sessions
            </span>
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl">
            Review your past interview sessions or create a new one to practice for your next job interview.
          </p>
          
          <div className="flex flex-wrap mt-6 gap-4">
            <div className="flex items-center bg-blue-900 bg-opacity-40 px-4 py-2 rounded-full text-blue-300 text-sm font-medium">
              <FaMicrophone className="mr-2" /> AI-powered assistance
            </div>
            <div className="flex items-center bg-purple-900 bg-opacity-40 px-4 py-2 rounded-full text-purple-300 text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Session history
            </div>
          </div>
        </div>
        
        {/* Error message with retry button */}
        {error && (
          <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-200 rounded-xl p-4 mb-6 flex items-center justify-between animate-fade-in">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm md:text-base">{error}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={retryLoading}
                className="px-3 py-1.5 bg-red-800 hover:bg-red-700 text-white text-sm rounded-md flex items-center transition-colors duration-200"
              >
                <FaSync className="mr-1.5" /> Retry
              </button>
              <button
                onClick={() => setError(null)}
                className="text-red-300 hover:text-red-100 transition-colors duration-200"
                aria-label="Dismiss"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}
        
        {/* Search and filter bar - Full width glassmorphism design */}
        <div className="bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl p-5 border border-gray-700 shadow-lg mb-8 transition-all duration-300 hover:bg-opacity-70">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center">
              <span className="text-white font-medium mr-3">Filter:</span>
              <div className="inline-flex shadow-sm rounded-md">
                <button
                  className={`px-4 py-2 text-sm first:rounded-l-md last:rounded-r-md focus:z-10 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-40 transition-all duration-200 
                    ${filterStatus === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  onClick={() => setFilterStatus('all')}
                >
                  All Sessions
                </button>
                <button
                  className={`px-4 py-2 text-sm border-l border-gray-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-40 transition-all duration-200
                    ${filterStatus === 'withQuestions' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  onClick={() => setFilterStatus('withQuestions')}
                >
                  With Responses
                </button>
                <button
                  className={`px-4 py-2 text-sm border-l border-gray-600 first:rounded-l-md last:rounded-r-md focus:z-10 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-40 transition-all duration-200
                    ${filterStatus === 'noQuestions' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  onClick={() => setFilterStatus('noQuestions')}
                >
                  No Responses
                </button>
              </div>
            </div>
            
            <div className="relative w-full md:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-600 transition-all duration-200"
                placeholder="Search by company or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Loading, empty state or interview cards */}
        {loading ? (
          <div className="bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl p-10 border border-gray-700 shadow-lg text-center animate-pulse">
            <div className="flex flex-col items-center justify-center">
              <div className="rounded-full h-16 w-16 bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading your interviews</h3>
              <p className="text-gray-400">Please wait while we fetch your session data...</p>
            </div>
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl p-10 border border-gray-700 shadow-lg text-center">
            {searchTerm || filterStatus !== 'all' ? (
              <div className="flex flex-col items-center justify-center">
                <div className="rounded-full h-16 w-16 bg-gray-700 flex items-center justify-center mb-6">
                  <FaFilter className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No matching interviews found</h3>
                <p className="text-gray-400 max-w-md mx-auto mb-6">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center transition-colors duration-200"
                >
                  <FaSync className="mr-2" />
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="rounded-full h-24 w-24 bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mb-6 animate-pulse">
                  <FaMicrophone className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Ready to practice?</h3>
                <p className="text-gray-300 max-w-lg mx-auto mb-8">
                  Start a new interview session to practice for your next job interview with AI-powered assistance.
                </p>
                <Link
                  to="/create-interview"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium flex items-center transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
                >
                  <FaPlus className="mr-2" />
                  Create Your First Interview
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInterviews.map((interview, index) => (
              <div 
                key={interview.id} 
                className="group bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-gray-700 hover:bg-opacity-70 hover:border-gray-600 transform hover:-translate-y-1"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-1">
                        <FaBuilding className="text-white opacity-80 mr-2" />
                        <h3 className="text-white text-xl font-semibold truncate">
                          {interview.company || "Unnamed Interview"}
                        </h3>
                      </div>
                      <p className="text-blue-100 text-opacity-90 italic truncate">
                        {interview.position || "No position specified"}
                      </p>
                    </div>
                    <div className="relative">
                      <button 
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-colors duration-200"
                        aria-label="Options"
                        onClick={(e) => {
                          e.stopPropagation();
                          const menu = e.currentTarget.nextElementSibling;
                          menu.classList.toggle('hidden');
                        }}
                      >
                        <FaEllipsisV />
                      </button>
                      <div className="hidden absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-10 overflow-hidden">
                        <button 
                          className="flex w-full items-center px-4 py-3 text-sm text-red-400 hover:bg-gray-700 transition-colors duration-200"
                          onClick={() => openDeleteModal(interview)}
                        >
                          <FaTrashAlt className="mr-2" />
                          Delete Interview
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="inline-flex items-center bg-gray-700 bg-opacity-60 px-3 py-1 rounded-full text-xs font-medium text-blue-300 border border-blue-800">
                      <FaCalendarAlt className="mr-1.5" />
                      {formatDate(interview.createdAt)}
                    </div>
                    
                    <div className="inline-flex items-center bg-gray-700 bg-opacity-60 px-3 py-1 rounded-full text-xs font-medium text-purple-300 border border-purple-800">
                      <FaQuestionCircle className="mr-1.5" />
                      {(interview.questions?.length || 0)} questions
                    </div>
                    
                    {interview.useSimpleLanguage && (
                      <div className="inline-flex items-center bg-gray-700 bg-opacity-60 px-3 py-1 rounded-full text-xs font-medium text-green-300 border border-green-800">
                        <FaLanguage className="mr-1.5" />
                        Simple Language
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-700 bg-opacity-50 p-3 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors duration-200">
                      <div className="text-xs text-gray-400 mb-1">Status</div>
                      <div className="font-medium flex items-center">
                        {interview.questions && interview.questions.length > 0 ? (
                          <>
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            <span className="text-green-400">Completed</span>
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                            <span className="text-yellow-400">In Progress</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-700 bg-opacity-50 p-3 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors duration-200">
                      <div className="text-xs text-gray-400 mb-1">Hotkey</div>
                      <div className="font-medium flex items-center">
                        <kbd className="px-2 py-0.5 bg-gray-800 rounded border border-gray-600 shadow-sm text-xs text-gray-300 mr-1">
                          {interview.hotkey || "Space"}
                        </kbd>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigate(`/interview-summary/${interview.id}`)}
                      className={`flex-1 px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center ${
                        !interview.questions?.length 
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50' 
                          : 'bg-gray-700 hover:bg-gray-600 text-white'
                      }`}
                      disabled={!interview.questions?.length}
                    >
                      <FaFileAlt className="mr-2" />
                      Summary
                    </button>
                    
                    <Link
                      to={`/interview-review/${interview.id}`}
                      className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                      <FaEye className="mr-2" />
                      Review
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Fixed action button - with cool hover effect */}
      <div className="fixed bottom-6 right-6 z-10 group">
        <Link
          to="/create-interview"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300 transform group-hover:scale-110"
          aria-label="Create new interview"
        >
          <FaPlus className="text-xl group-hover:rotate-90 transition-transform duration-300" />
        </Link>
        <div className="absolute opacity-0 group-hover:opacity-100 -top-10 right-0 transform -translate-y-full text-white bg-gray-800 px-3 py-1 rounded-lg whitespace-nowrap font-medium transition-all duration-200">
          New Interview
        </div>
      </div>
      
      {/* Improved delete confirmation modal with cool animation */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-80 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={closeDeleteModal}></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full bg-gray-800 border border-gray-700 animate-fade-in-up">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-white" id="modal-title">
                      Delete Interview Session
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-300">
                        Are you sure you want to delete the interview session for{' '}
                        <span className="font-semibold text-white">{interviewToDelete?.company}</span>?
                        This action cannot be undone and all questions and responses will be permanently removed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                  onClick={handleDeleteInterview}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add keyframe animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default InterviewSessions;