import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from "../layout/Navbar";

const InterviewReview = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch interview data
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const docRef = doc(db, 'interviews', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Check if interview belongs to current user
          if (data.userId !== currentUser?.uid) {
            setError("You don't have permission to access this interview.");
            return;
          }
          
          setInterview({
            id: docSnap.id,
            ...data
          });
        } else {
          setError("Interview not found.");
        }
      } catch (err) {
        console.error("Error fetching interview:", err);
        setError("Failed to load interview. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchInterview();
    }
  }, [id, currentUser]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this interview? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'interviews', id));
        navigate('/interviews');
      } catch (err) {
        console.error("Error deleting interview:", err);
        setError("Failed to delete interview. Please try again.");
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading interview data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/interviews')}
              className="btn btn-primary"
            >
              Back to Interviews
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Link to="/interviews" className="btn btn-sm btn-outline-secondary mb-3">
                <i className="fas fa-arrow-left me-2"></i>
                Back to Interviews
              </Link>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                {interview?.company} Interview
              </h2>
              <p className="text-gray-600">
                {interview?.position}
              </p>
            </div>
            <div className="btn-group">
              <Link
                to={`/interview-summary/${id}`}
                className="btn btn-outline-primary"
              >
                <i className="fas fa-file-alt me-2"></i>
                Generate Summary
              </Link>
              <button
                onClick={handleDelete}
                className="btn btn-outline-danger"
              >
                <i className="fas fa-trash-alt me-2"></i>
                Delete
              </button>
            </div>
          </div>
          
          <div className="d-flex flex-wrap gap-3 mt-4">
            <div className="badge bg-light text-dark border">
              <i className="fas fa-calendar-alt me-2 text-primary"></i>
              {interview?.createdAt ? formatDate(interview.createdAt) : 'Unknown date'}
            </div>
            <div className="badge bg-light text-dark border">
              <i className="fas fa-question-circle me-2 text-primary"></i>
              {interview?.questions?.length || 0} questions
            </div>
            {interview?.useSimpleLanguage && (
              <div className="badge bg-info text-white">
                <i className="fas fa-language me-2"></i>
                Simple Language
              </div>
            )}
            <div className="badge bg-light text-dark border">
              <i className="fas fa-keyboard me-2 text-primary"></i>
              Hotkey: {interview?.hotkey || 'Space'}
            </div>
          </div>
        </div>
        
        <div className="card shadow-lg">
          <div className="card-body p-6">
            <h3 className="text-xl font-semibold mb-4">Interview Questions & Responses</h3>
            
            {!interview?.questions?.length ? (
              <div className="text-center py-8">
                <i className="fas fa-comment-slash fa-3x text-gray-300 mb-3"></i>
                <h4 className="text-lg font-medium text-gray-600">No questions recorded</h4>
                <p className="text-gray-500 mb-4">
                  This interview session doesn't have any recorded questions and responses.
                </p>
              </div>
            ) : (
              <div className="interview-questions-list">
                {interview.questions.map((item, index) => (
                  <div key={index} className="interview-question-item">
                    <div className="question">
                      <div className="d-flex justify-content-between mb-2">
                        <div className="badge bg-primary">
                          <i className="fas fa-user me-1"></i>
                          Interviewer
                        </div>
                        {item.timestamp && (
                          <small className="text-muted">
                            {formatDate(item.timestamp)}
                          </small>
                        )}
                      </div>
                      <p className="mb-0">{item.question}</p>
                    </div>
                    
                    <div className="answer">
                      <div className="d-flex justify-content-between mb-2">
                        <div className="badge bg-success">
                          <i className="fas fa-robot me-1"></i>
                          AI Assistant
                        </div>
                      </div>
                      <p className="mb-0">{item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewReview;