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
        interviewsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
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

  const handleDeleteInterview = async (id) => {
    if (window.confirm("Are you sure you want to delete this interview session?")) {
      try {
        await deleteDoc(doc(db, 'interviews', id));
        setInterviews(interviews.filter(interview => interview.id !== id));
      } catch (err) {
        console.error("Error deleting interview:", err);
        setError("Failed to delete interview. Please try again.");
      }
    }
  };

  const generateSummary = async (interview) => {
    try {
      // Generate a summary using the questions from the interview
      const questions = interview.questions || [];
      if (questions.length === 0) {
        alert("No questions found to summarize.");
        return;
      }

      // Navigate to summary page with the interview data
      navigate(`/interview-summary/${interview.id}`);
    } catch (err) {
      console.error("Error generating summary:", err);
      setError("Failed to generate summary. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">Your Interview Sessions</h2>
          <Link
            to="/create-interview"
            className="btn btn-primary"
          >
            <i className="fas fa-plus-circle me-2"></i>
            Create New Interview
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-gray-600">Loading your interviews...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : interviews.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <i className="fas fa-file-alt fa-3x text-gray-400 mb-3"></i>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No interviews yet</h3>
            <p className="text-gray-600 mb-6">
              Start a new interview session to practice for your next job interview.
            </p>
            <Link
              to="/create-interview"
              className="btn btn-primary"
            >
              Create Your First Interview
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviews.map((interview) => (
              <div key={interview.id} className="card bg-white shadow rounded-lg overflow-hidden">
                <div className="card-header bg-primary-50 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {interview.company || "Unnamed Interview"}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {interview.position || "No position specified"}
                      </p>
                    </div>
                    <div className="dropdown">
                      <button 
                        className="btn btn-sm btn-light rounded-circle" 
                        type="button"
                        aria-expanded="false"
                        onClick={() => {/* Toggle dropdown */}}
                      >
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end shadow">
                        <li>
                          <button 
                            className="dropdown-item" 
                            onClick={() => handleDeleteInterview(interview.id)}
                          >
                            <i className="fas fa-trash-alt text-danger me-2"></i>
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="card-body p-4">
                  <div className="mb-3">
                    <div className="flex items-center mb-1">
                      <i className="fas fa-calendar-alt text-primary me-2"></i>
                      <span className="text-gray-600 text-sm">
                        {new Date(interview.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <i className="fas fa-question-circle text-primary me-2"></i>
                      <span className="text-gray-600 text-sm">
                        {(interview.questions?.length || 0)} questions discussed
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => generateSummary(interview)}
                      className="btn btn-outline-primary btn-sm"
                      disabled={!interview.questions?.length}
                    >
                      <i className="fas fa-file-alt me-2"></i>
                      Summary
                    </button>
                    
                    <Link
                      to={`/interview-review/${interview.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      <i className="fas fa-eye me-2"></i>
                      Review
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="fixed bottom-0 left-0 w-full bg-white py-4 px-6 shadow-lg border-t text-center">
          <Link
            to="/create-interview"
            className="btn btn-primary btn-lg px-6"
          >
            <i className="fas fa-plus-circle me-2"></i>
            Create Interview Session
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterviewSessions;