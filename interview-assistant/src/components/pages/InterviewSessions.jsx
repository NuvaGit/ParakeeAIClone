import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from "../layout/Navbar";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header section with animated gradient background */}
        <div className="relative rounded-xl overflow-hidden mb-8 bg-gradient-to-br from-primary-color via-secondary-color to-accent-color p-8 shadow-xl transform transition-all hover:scale-[1.01] duration-300">
          <div className="absolute inset-0 bg-opacity-80">
            <div className="h-full w-full" style={{
              background: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"%23ffffff\" fill-opacity=\"0.1\" fill-rule=\"evenodd\"%3E%3C/path%3E%3C/svg%3E") center center",
              backgroundSize: "cover",
              animation: "gradientBackground 15s ease infinite"
            }}></div>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-4xl font-bold text-white mb-3 animate-fadeIn">Interview Sessions</h2>
              <p className="text-white text-opacity-90 max-w-lg text-lg animate-fadeIn" style={{animationDelay: "0.2s"}}>
                Review your past interview sessions or create a new one to practice for your next job interview.
              </p>
              <div className="flex mt-4 gap-2 animate-fadeIn" style={{animationDelay: "0.4s"}}>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white bg-opacity-20 text-white text-sm">
                  <i className="fas fa-microphone-alt mr-2"></i> AI-powered assistance
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white bg-opacity-20 text-white text-sm">
                  <i className="fas fa-history mr-2"></i> Session history
                </div>
              </div>
            </div>
            <Link
              to="/create-interview"
              className="btn bg-white text-primary-color hover:scale-105 transition transform duration-300 px-6 py-3 rounded-full shadow-lg hover:shadow-xl flex items-center gap-2 self-start animate-bounceIn"
              style={{animationDelay: "0.6s"}}
            >
              <i className="fas fa-plus-circle text-lg"></i>
              <span className="font-semibold">New Interview</span>
            </Link>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md animate-fadeIn">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-exclamation-circle text-red-500"></i>
              </div>
              <div className="ml-3">
                <p className="text-red-700">{error}</p>
              </div>
              <button 
                className="ml-auto text-red-500 hover:text-red-700 transition-colors duration-200"
                onClick={() => setError(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}
        
        {/* Enhanced Filters and search section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 transform transition-all hover:shadow-lg duration-300 animate-slideUp">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-gray-700 font-medium">Filter by:</span>
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                    filterStatus === 'all' 
                      ? 'bg-primary-color text-white border-primary-color' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                  } transition-colors duration-200`}
                  onClick={() => setFilterStatus('all')}
                >
                  All Sessions
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium border-t border-b ${
                    filterStatus === 'withQuestions' 
                      ? 'bg-primary-color text-white border-primary-color' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                  } transition-colors duration-200`}
                  onClick={() => setFilterStatus('withQuestions')}
                >
                  With Responses
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                    filterStatus === 'noQuestions' 
                      ? 'bg-primary-color text-white border-primary-color' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                  } transition-colors duration-200`}
                  onClick={() => setFilterStatus('noQuestions')}
                >
                  No Responses
                </button>
              </div>
            </div>
            
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-color focus:bg-white transition-all duration-200"
                placeholder="Search by company or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm('')}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-20 animate-pulse">
            <div className="inline-block rounded-full h-16 w-16 border-4 border-primary-color border-t-transparent animate-spin"></div>
            <p className="mt-6 text-xl text-gray-600 font-medium">Loading your interviews...</p>
            <p className="text-gray-500">Please wait while we gather your session data</p>
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md animate-fadeIn">
            {searchTerm || filterStatus !== 'all' ? (
              <>
                <i className="fas fa-filter fa-4x text-gray-300 mb-4"></i>
                <h3 className="text-2xl font-medium text-gray-800 mb-3">No matching interviews found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                  className="btn bg-primary-color text-white px-6 py-2.5 rounded-full hover:bg-primary-dark transition-colors duration-300 shadow-md hover:shadow-lg"
                >
                  <i className="fas fa-sync-alt mr-2"></i>
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 rounded-full bg-primary-color bg-opacity-10 animate-ping"></div>
                  <i className="fas fa-microphone-alt fa-4x text-primary-color relative"></i>
                </div>
                <h3 className="text-2xl font-medium text-gray-800 mb-3">Ready to practice?</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start a new interview session to practice for your next job interview with AI-powered assistance.
                </p>
                <Link
                  to="/create-interview"
                  className="btn bg-primary-color text-white px-8 py-3 rounded-full hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg inline-flex items-center"
                >
                  <i className="fas fa-plus-circle mr-2"></i>
                  Create Your First Interview
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInterviews.map((interview, index) => (
              <div 
                key={interview.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 animate-slideUp"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-color to-secondary-color opacity-80"></div>
                  <div className="p-6 relative z-10">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-1">
                          <i className="fas fa-building text-white mr-2"></i>
                          <h3 className="text-xl font-semibold text-white">
                            {interview.company || "Unnamed Interview"}
                          </h3>
                        </div>
                        <p className="text-white text-opacity-90 italic">
                          {interview.position || "No position specified"}
                        </p>
                      </div>
                      <div className="dropdown relative">
                        <button 
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-colors duration-200"
                          aria-label="Menu"
                          onClick={(e) => {
                            e.currentTarget.nextElementSibling.classList.toggle('hidden');
                          }}
                        >
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                        <div className="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10 py-1 border border-gray-100">
                          <button 
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                            onClick={() => openDeleteModal(interview)}
                          >
                            <i className="fas fa-trash-alt mr-2"></i>
                            Delete Interview
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="inline-flex items-center bg-blue-50 px-3 py-1 rounded-full text-xs font-medium text-blue-700 border border-blue-100">
                      <i className="fas fa-calendar-alt mr-1.5"></i>
                      {formatDate(interview.createdAt)}
                    </div>
                    
                    <div className="inline-flex items-center bg-purple-50 px-3 py-1 rounded-full text-xs font-medium text-purple-700 border border-purple-100">
                      <i className="fas fa-question-circle mr-1.5"></i>
                      {(interview.questions?.length || 0)} questions
                    </div>
                    
                    {interview.useSimpleLanguage && (
                      <div className="inline-flex items-center bg-green-50 px-3 py-1 rounded-full text-xs font-medium text-green-700 border border-green-100">
                        <i className="fas fa-language mr-1.5"></i>
                        Simple Language
                      </div>
                    )}
                  </div>
                  
                  {/* Interview stats cards */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors duration-200">
                      <div className="text-xs text-gray-500 mb-1">Status</div>
                      <div className="font-medium flex items-center">
                        {interview.questions && interview.questions.length > 0 ? (
                          <>
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            <span className="text-green-600">Completed</span>
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                            <span className="text-yellow-600">In Progress</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors duration-200">
                      <div className="text-xs text-gray-500 mb-1">Hotkey</div>
                      <div className="font-medium flex items-center">
                        <kbd className="px-2 py-0.5 bg-white rounded border border-gray-300 shadow-sm text-xs mr-1">
                          {interview.hotkey || "Space"}
                        </kbd>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigate(`/interview-summary/${interview.id}`)}
                      className={`flex-1 btn flex items-center justify-center px-4 py-2.5 rounded-lg transition-all duration-200 ${
                        !interview.questions?.length 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                      disabled={!interview.questions?.length}
                    >
                      <i className="fas fa-file-alt mr-2"></i>
                      Summary
                    </button>
                    
                    <Link
                      to={`/interview-review/${interview.id}`}
                      className="flex-1 btn flex items-center justify-center bg-primary-color hover:bg-primary-dark text-white px-4 py-2.5 rounded-lg transition-colors duration-200"
                    >
                      <i className="fas fa-eye mr-2"></i>
                      Review
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Fixed action button */}
      <div className="fixed bottom-6 right-6 z-10">
        <Link
          to="/create-interview"
          className="btn flex items-center justify-center bg-primary-color hover:bg-primary-dark text-white w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          aria-label="Create new interview"
        >
          <i className="fas fa-plus text-xl"></i>
        </Link>
      </div>
      
      {/* Improved delete confirmation modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={closeDeleteModal}></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-zoomIn">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full bg-red-100 sm:mx-0 sm:h-12 sm:w-12">
                    <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Delete Interview Session
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the interview session for{' '}
                        <span className="font-semibold text-gray-700">{interviewToDelete?.company}</span>?
                        This action cannot be undone and all questions and responses will be permanently removed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                  onClick={handleDeleteInterview}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes gradientBackground {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease forwards;
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.6s ease forwards;
        }
        
        .animate-zoomIn {
          animation: zoomIn 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default InterviewSessions;