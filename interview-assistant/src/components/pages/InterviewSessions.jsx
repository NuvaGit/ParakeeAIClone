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
              background: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"%23ffffff\" fill-opacity=\"0.1\" fill-rule=\"evenodd\"%3E%3C/path%3E%3C/svg%3E') center center",
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
        
        {/* Improved error message component */}
        {error && (
          <div className="error-message animate-fadeIn">
            <i className="fas fa-exclamation-circle"></i>
            <div className="error-message-text">{error}</div>
            <button 
              onClick={() => setError(null)}
              aria-label="Dismiss error"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
        
        {/* Improved Filters and search section */}
        <div className="filter-container animate-slideUp">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="filter-label">Filter by:</span>
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  className={`filter-button ${filterStatus === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('all')}
                >
                  All Sessions
                </button>
                <button
                  className={`filter-button ${filterStatus === 'withQuestions' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('withQuestions')}
                >
                  With Responses
                </button>
                <button
                  className={`filter-button ${filterStatus === 'noQuestions' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('noQuestions')}
                >
                  No Responses
                </button>
              </div>
            </div>
            
            <div className="search-container">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search by company or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading your interviews...</p>
            <p className="loading-subtext">Please wait while we gather your session data</p>
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="empty-state">
            {searchTerm || filterStatus !== 'all' ? (
              <>
                <i className="fas fa-filter empty-state-icon"></i>
                <h3 className="empty-state-title">No matching interviews found</h3>
                <p className="empty-state-message">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                  className="empty-state-button"
                >
                  <i className="fas fa-sync-alt mr-2"></i>
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <div className="empty-state-icon-container">
                  <i className="fas fa-microphone-alt empty-state-icon"></i>
                </div>
                <h3 className="empty-state-title">Ready to practice?</h3>
                <p className="empty-state-message">
                  Start a new interview session to practice for your next job interview with AI-powered assistance.
                </p>
                <Link
                  to="/create-interview"
                  className="empty-state-button"
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
                className="interview-card"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="interview-card-header">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-1">
                        <i className="fas fa-building text-white mr-2"></i>
                        <h3 className="interview-card-title">
                          {interview.company || "Unnamed Interview"}
                        </h3>
                      </div>
                      <p className="interview-card-subtitle">
                        {interview.position || "No position specified"}
                      </p>
                    </div>
                    <div className="dropdown relative">
                      <button 
                        className="dropdown-button"
                        aria-label="Menu"
                        onClick={(e) => {
                          e.currentTarget.nextElementSibling.classList.toggle('hidden');
                        }}
                      >
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                      <div className="dropdown-menu hidden">
                        <button 
                          className="dropdown-item dropdown-item-delete"
                          onClick={() => openDeleteModal(interview)}
                        >
                          <i className="fas fa-trash-alt mr-2"></i>
                          Delete Interview
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="interview-card-body">
                  <div className="interview-card-tags">
                    <div className="interview-card-tag interview-card-tag-date">
                      <i className="fas fa-calendar-alt mr-1.5"></i>
                      {formatDate(interview.createdAt)}
                    </div>
                    
                    <div className="interview-card-tag interview-card-tag-questions">
                      <i className="fas fa-question-circle mr-1.5"></i>
                      {(interview.questions?.length || 0)} questions
                    </div>
                    
                    {interview.useSimpleLanguage && (
                      <div className="interview-card-tag interview-card-tag-language">
                        <i className="fas fa-language mr-1.5"></i>
                        Simple Language
                      </div>
                    )}
                  </div>
                  
                  <div className="interview-card-stats">
                    <div className="interview-card-stat">
                      <div className="interview-card-stat-label">Status</div>
                      <div className="interview-card-stat-value">
                        {interview.questions && interview.questions.length > 0 ? (
                          <>
                            <span className="interview-card-stat-dot interview-card-stat-dot-completed"></span>
                            <span className="interview-card-stat-text-completed">Completed</span>
                          </>
                        ) : (
                          <>
                            <span className="interview-card-stat-dot interview-card-stat-dot-progress"></span>
                            <span className="interview-card-stat-text-progress">In Progress</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="interview-card-stat">
                      <div className="interview-card-stat-label">Hotkey</div>
                      <div className="interview-card-stat-value">
                        <kbd className="interview-card-kbd">
                          {interview.hotkey || "Space"}
                        </kbd>
                      </div>
                    </div>
                  </div>
                  
                  <div className="interview-card-actions">
                    <button
                      onClick={() => navigate(`/interview-summary/${interview.id}`)}
                      className={`interview-card-action-summary ${
                        !interview.questions?.length 
                          ? 'interview-card-action-disabled' 
                          : ''
                      }`}
                      disabled={!interview.questions?.length}
                    >
                      <i className="fas fa-file-alt mr-2"></i>
                      Summary
                    </button>
                    
                    <Link
                      to={`/interview-review/${interview.id}`}
                      className="interview-card-action-review"
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
      <div className="fixed-action-button">
        <Link
          to="/create-interview"
          className="fixed-action-button-link"
          aria-label="Create new interview"
        >
          <i className="fas fa-plus"></i>
        </Link>
      </div>
      
      {/* Improved delete confirmation modal */}
      {isDeleteModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-container">
            <div className="modal-overlay" aria-hidden="true" onClick={closeDeleteModal}></div>
            
            <div className="modal-content">
              <div className="modal-body">
                <div className="modal-icon-container">
                  <i className="fas fa-exclamation-triangle modal-icon"></i>
                </div>
                <div className="modal-text-container">
                  <h3 className="modal-title" id="modal-title">
                    Delete Interview Session
                  </h3>
                  <div className="modal-description">
                    <p>
                      Are you sure you want to delete the interview session for{' '}
                      <span className="modal-company-name">{interviewToDelete?.company}</span>?
                      This action cannot be undone and all questions and responses will be permanently removed.
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="modal-button-delete"
                  onClick={handleDeleteInterview}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="modal-button-cancel"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Import the custom styles */}
      <link rel="stylesheet" href="/src/assets/css/interview-sessions.css" />
    </div>
  );
};

export default InterviewSessions;