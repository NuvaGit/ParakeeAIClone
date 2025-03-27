import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from "../layout/Navbar";
import '../../assets/css/interview-sessions-dark.css';

// Import any necessary icons
import {
  FaMicrophone, FaPlus, FaSearch, FaTimes, FaFilter,
  FaCalendarAlt, FaQuestionCircle, FaLanguage, FaSync,
  FaEye, FaFileAlt, FaBuilding, FaTrashAlt, FaEllipsisV,
  FaExclamationTriangle
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  // Add state to track open dropdown menus
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Fetch user's interview sessions - improved with memoization using useCallback
  const fetchInterviews = useCallback(async (isInitialLoad = false) => {
    if (!currentUser) return;

    try {
      setLoading(isInitialLoad);
      if (!isInitialLoad) setLoadingMore(true);

      const interviewsRef = collection(db, 'interviews');
      
      // Create a more efficient query with pagination
      const q = query(
        interviewsRef, 
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc"),
        limit(isInitialLoad ? 10 : 50) // Limit initial load, allow more on refresh
      );

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty && isInitialLoad) {
        setInterviews([]);
        setHasMore(false);
        return;
      }
      
      const interviewsData = [];
      querySnapshot.forEach((doc) => {
        // Make sure to handle potential missing fields safely
        const data = doc.data();
        interviewsData.push({
          id: doc.id,
          company: data.company || 'Unnamed Interview',
          position: data.position || 'No position specified',
          createdAt: data.createdAt || null,
          questions: data.questions || [],
          useSimpleLanguage: data.useSimpleLanguage || false,
          hotkey: data.hotkey || 'Space',
          ...data
        });
      });

      // Handle initial load vs additional loads
      if (isInitialLoad) {
        setInterviews(interviewsData);
      } else {
        // Merge new interviews with existing ones, avoiding duplicates
        const existingIds = new Set(interviews.map(interview => interview.id));
        const newInterviews = interviewsData.filter(interview => !existingIds.has(interview.id));
        setInterviews(prevInterviews => [...prevInterviews, ...newInterviews]);
      }

      // Update whether there are more interviews to load
      setHasMore(interviewsData.length === (isInitialLoad ? 10 : 50));
      setError(null);
    } catch (err) {
      console.error("Error fetching interviews:", err);
      setError("Failed to load interviews. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      if (isInitialLoad) setInitialLoad(false);
    }
  }, [currentUser, interviews]);

  // Initial data fetching
  useEffect(() => {
    if (currentUser && initialLoad) {
      fetchInterviews(true);
    }
  }, [currentUser, fetchInterviews, initialLoad]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdownId && !event.target.closest('.dropdown')) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdownId]);

  const openDeleteModal = (interview) => {
    setInterviewToDelete(interview);
    setIsDeleteModalOpen(true);
    // Close any open dropdown
    setOpenDropdownId(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setInterviewToDelete(null);
  };

  const handleDeleteInterview = async () => {
    if (!interviewToDelete) return;
    
    try {
      await deleteDoc(doc(db, 'interviews', interviewToDelete.id));
      
      // Update state to remove the deleted interview
      setInterviews(prevInterviews => 
        prevInterviews.filter(interview => interview.id !== interviewToDelete.id)
      );
      
      closeDeleteModal();
    } catch (err) {
      console.error("Error deleting interview:", err);
      setError("Failed to delete interview. Please try again.");
    }
  };

  const toggleDropdown = (interviewId) => {
    setOpenDropdownId(openDropdownId === interviewId ? null : interviewId);
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
    
    try {
      // Handle different timestamp formats
      const date = timestamp.seconds
        ? new Date(timestamp.seconds * 1000) // Firestore timestamp
        : timestamp instanceof Date 
          ? timestamp // Already a Date object
          : new Date(timestamp); // ISO string or timestamp in milliseconds
      
      return date.toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid date';
    }
  };

  const retryLoading = () => {
    setLoading(true);
    setError(null);
    fetchInterviews(true);
  };

  return (
    <div className="min-h-screen bg-gradient-page">
      {/* Fixed navbar with proper spacing */}
      <div className="navbar-fix">
        <Navbar />
      </div>
      
      {/* Main content area */}
      <div className="container">
        {/* Page header section */}
        <div className="page-header">
          <h1 className="page-title">
            <span className="text-gradient">Interview Sessions</span>
          </h1>
          <p className="page-subtitle">
            Review your past interview sessions or create a new one to practice for your next job interview.
          </p>
          
          <div className="feature-tags">
            <div className="feature-tag feature-tag-primary">
              <FaMicrophone className="feature-tag-icon" /> AI-powered assistance
            </div>
            <div className="feature-tag feature-tag-secondary">
              <svg className="feature-tag-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Session history
            </div>
          </div>
        </div>
        
        {/* Error message with retry button */}
        {error && (
          <div className="error-message animate-fade-in">
            <div className="error-icon">
              <FaExclamationTriangle />
            </div>
            <div className="error-content">{error}</div>
            <div className="error-actions">
              <button 
                onClick={retryLoading}
                className="btn btn-error"
              >
                <FaSync className="btn-icon" /> Retry
              </button>
              <button
                onClick={() => setError(null)}
                className="error-dismiss"
                aria-label="Dismiss"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}
        
        {/* Search and filter bar */}
        <div className="filter-section glass">
          <div className="filter-container">
            <div className="filter-group">
              <span className="filter-label">Filter:</span>
              <div className="filter-buttons">
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
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by company or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="search-clear"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Loading, empty state or interview cards */}
        {loading ? (
          <div className="loading-indicator glass">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading your interviews</div>
            <div className="loading-subtext">Please wait while we fetch your session data...</div>
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="empty-state glass">
            {searchTerm || filterStatus !== 'all' ? (
              <div className="empty-state-content">
                <div className="empty-icon-container">
                  <FaFilter className="empty-icon" />
                </div>
                <h3 className="empty-title">No matching interviews found</h3>
                <p className="empty-description">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                  className="btn btn-primary"
                >
                  <FaSync className="btn-icon" />
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="empty-state-content">
                <div className="empty-icon-container animate-pulse">
                  <FaMicrophone className="empty-icon" />
                </div>
                <h3 className="empty-title">Ready to practice?</h3>
                <p className="empty-description">
                  Start a new interview session to practice for your next job interview with AI-powered assistance.
                </p>
                <Link
                  to="/create-interview"
                  className="btn btn-primary"
                >
                  <FaPlus className="btn-icon" />
                  Create Your First Interview
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="interview-grid">
              {filteredInterviews.map((interview, index) => (
                <div 
                  key={interview.id} 
                  className="interview-card animate-slide-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="interview-card-header bg-gradient-header">
                    <div className="interview-card-header-content">
                      <div>
                        <div className="interview-card-title-container">
                          <FaBuilding className="interview-card-title-icon" />
                          <h3 className="interview-card-title">
                            {interview.company || "Unnamed Interview"}
                          </h3>
                        </div>
                        <p className="interview-card-subtitle">
                          {interview.position || "No position specified"}
                        </p>
                      </div>
                      <div className="dropdown">
                        <button 
                          className="dropdown-button"
                          aria-label="Options"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(interview.id);
                          }}
                        >
                          <FaEllipsisV />
                        </button>
                        <div className={`dropdown-menu ${openDropdownId !== interview.id ? 'hidden' : ''}`}>
                          <button 
                            className="dropdown-item dropdown-item-delete"
                            onClick={() => openDeleteModal(interview)}
                          >
                            <FaTrashAlt className="dropdown-item-icon" />
                            Delete Interview
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="interview-card-body">
                    <div className="interview-card-tags">
                      <div className="interview-card-tag tag-date">
                        <FaCalendarAlt className="interview-card-tag-icon" />
                        {formatDate(interview.createdAt)}
                      </div>
                      
                      <div className="interview-card-tag tag-questions">
                        <FaQuestionCircle className="interview-card-tag-icon" />
                        {(interview.questions?.length || 0)} questions
                      </div>
                      
                      {interview.useSimpleLanguage && (
                        <div className="interview-card-tag tag-language">
                          <FaLanguage className="interview-card-tag-icon" />
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
                              <span className="status-indicator status-completed"></span>
                              <span className="status-text-completed">Completed</span>
                            </>
                          ) : (
                            <>
                              <span className="status-indicator status-progress"></span>
                              <span className="status-text-progress">In Progress</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="interview-card-stat">
                        <div className="interview-card-stat-label">Hotkey</div>
                        <div className="interview-card-stat-value">
                          <kbd className="hotkey-badge">
                            {interview.hotkey || "Space"}
                          </kbd>
                        </div>
                      </div>
                    </div>
                    
                    <div className="interview-card-actions">
                      <button
                        onClick={() => navigate(`/interview-summary/${interview.id}`)}
                        className={`btn btn-secondary ${!interview.questions?.length ? 'btn-disabled' : ''}`}
                        disabled={!interview.questions?.length}
                      >
                        <FaFileAlt className="btn-icon" />
                        Summary
                      </button>
                      
                      <Link
                        to={`/interview-review/${interview.id}`}
                        className="btn btn-primary"
                      >
                        <FaEye className="btn-icon" />
                        Review
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load more button */}
            {hasMore && (
              <div className="text-center mt-6 mb-8">
                <button 
                  className="btn btn-secondary btn-lg"
                  onClick={() => fetchInterviews(false)}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full"></div>
                      Loading More...
                    </>
                  ) : (
                    <>
                      <FaSync className="btn-icon" />
                      Load More Sessions
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Fixed action button */}
      <div className="fixed-action-button">
        <Link
          to="/create-interview"
          className="action-button"
          aria-label="Create new interview"
        >
          <FaPlus />
        </Link>
        <span className="action-button-tooltip">New Interview</span>
      </div>
      
      {/* Delete confirmation modal */}
      {isDeleteModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Delete Interview Session</h3>
            </div>
            <div className="modal-body">
              <div className="modal-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="modal-message">
                Are you sure you want to delete the interview session for{' '}
                <span className="modal-highlight">{interviewToDelete?.company}</span>?
                This action cannot be undone and all questions and responses will be permanently removed.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteInterview}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSessions;