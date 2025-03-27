import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { AuthContext } from '../contexts/AuthContext';
import InterviewAssistant from "../interview/InterviewAssistant";
import Navbar from "../layout/Navbar";
import { generateAIResponse } from '../utils/openai';


const InterviewSession = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [sessionActive, setSessionActive] = useState(false);
  
  // AI Response overlay state
  const [isQueryingAI, setIsQueryingAI] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayResponse, setOverlayResponse] = useState('');
  const [transcribedQuestion, setTranscribedQuestion] = useState('');
  
  const hotKeyRef = useRef(null);
  const overlayRef = useRef(null);

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

  // Handle timer countdown
  useEffect(() => {
    let interval;
    
    if (sessionActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      // Handle session timeout
      alert("Your session has ended. You are being redirected to the interview summary.");
      navigate(`/interview-review/${id}`);
    }
    
    return () => clearInterval(interval);
  }, [sessionActive, timeRemaining, navigate, id]);

  // Set up hotkey listener for AI responses
  useEffect(() => {
    if (!interview || !sessionActive) return;
    
    const hotkeyMap = {
      'Space': ' ',
      'Control': 'Control',
      'Alt': 'Alt'
    };
    
    const hotkey = hotkeyMap[interview.hotkey || 'Space'];
    hotKeyRef.current = hotkey;
    
    const handleKeyDown = async (e) => {
      if (e.key === hotkey || (hotkey === 'Control' && e.ctrlKey) || (hotkey === 'Alt' && e.altKey)) {
        e.preventDefault();
        
        // Only trigger if we have a transcribed question and not already querying
        if (transcribedQuestion && !isQueryingAI) {
          await queryAI(transcribedQuestion);
        } else if (!transcribedQuestion) {
          setOverlayResponse("No question detected. Please wait for the interviewer to ask a question.");
          setShowOverlay(true);
          setTimeout(() => setShowOverlay(false), 3000);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [interview, sessionActive, transcribedQuestion, isQueryingAI]);

  // Get the latest question from the transcript
  const updateTranscribedQuestion = (question) => {
    setTranscribedQuestion(question);
  };

  // Query the AI for a response
  const queryAI = async (question) => {
    setIsQueryingAI(true);
    setShowOverlay(true);
    setOverlayResponse("Generating response...");
    
    try {
      // Prepare context for AI
      const userContext = {
        name: currentUser?.displayName || '',
        jobTitle: interview?.position || '',
        company: interview?.company || '',
        instructions: interview?.instructions || '',
        useSimpleLanguage: interview?.useSimpleLanguage || false
      };
      
      // Get AI response
      const response = await generateAIResponse(question, userContext);
      
      // Update overlay
      setOverlayResponse(response.text);
      
      // Store question and response in Firestore
      await updateDoc(doc(db, 'interviews', id), {
        questions: arrayUnion({
          question,
          answer: response.text,
          timestamp: serverTimestamp()
        })
      });
      
    } catch (err) {
      console.error("Error generating AI response:", err);
      setOverlayResponse("Error generating response. Please try again.");
    } finally {
      setIsQueryingAI(false);
      
      // Hide overlay after some time
      setTimeout(() => {
        setShowOverlay(false);
        setOverlayResponse('');
      }, 15000); // Keep visible for 15 seconds
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  
  const handleConnect = () => {
    setSessionActive(true);
  };
  
  const exitSession = () => {
    if (window.confirm("Are you sure you want to end this session? You'll be redirected to the review page.")) {
      navigate(`/interview-review/${id}`);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading interview session...</p>
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
    <div className={`interview-room-container ${isFullScreen ? 'interview-room-fullscreen' : ''}`}>
      {!isFullScreen && <Navbar />}
      
      <div className="interview-room-content">
        {!isFullScreen && (
          <div className="interview-room-header animate-fade-in">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="interview-room-title">
                  Interview: {interview?.company}
                </h2>
                <p className="interview-room-subtitle">
                  Position: {interview?.position?.substring(0, 50)}
                  {interview?.position?.length > 50 && '...'}
                </p>
              </div>
              <div className="d-flex gap-3 align-items-center">
                <div className={`session-timer ${timeRemaining < 60 ? 'text-danger' : ''}`}>
                  <i className="fas fa-clock me-2"></i>
                  {formatTime(timeRemaining)}
                </div>
                <button
                  onClick={toggleFullScreen}
                  className="btn btn-primary"
                >
                  <i className="fas fa-expand-alt me-2"></i>
                  Enter Full Screen
                </button>
              </div>
            </div>
          </div>
        )}
        
        {!sessionActive ? (
          <div className="connection-setup-panel">
            <div className="card shadow-lg">
              <div className="card-body text-center p-5">
                <h3 className="mb-4">Ready to Start Your Interview</h3>
                
                <div className="connection-info mb-4">
                  <p className="text-muted">
                    This is an Interview Session for {interview?.company}
                  </p>
                  <p className="mb-4">
                    Click the Connect button and select the tab where the interview is taking place.
                  </p>
                  
                  <div className="alert alert-info d-flex align-items-center">
                    <i className="fas fa-volume-up me-3 fa-lg"></i>
                    <div>
                      Make sure to select the "Also share tab audio" option when sharing the screen.
                    </div>
                  </div>
                </div>
                
                <div className="connection-options mb-4">
                  <h5 className="mb-3">How to Connect:</h5>
                  <div className="connection-icons d-flex justify-content-center gap-3 mb-3">
                    <div className="connection-icon">
                      <img src="https://cdn.cdnlogo.com/logos/z/75/zoom.svg" alt="Zoom" width="40" />
                    </div>
                    <div className="connection-icon">
                      <img src="https://cdn.cdnlogo.com/logos/g/15/google-meet.svg" alt="Google Meet" width="40" />
                    </div>
                    <div className="connection-icon">
                      <img src="https://cdn.cdnlogo.com/logos/m/79/microsoft-teams.svg" alt="Teams" width="40" />
                    </div>
                    <div className="connection-icon">
                      <img src="https://cdn.cdnlogo.com/logos/w/95/webex.svg" alt="Webex" width="40" />
                    </div>
                  </div>
                  
                  <div className="alert alert-light">
                    <p className="mb-2">
                      <strong>Alternatively:</strong> You can use a mock interview video to test the system.
                    </p>
                    <a href="https://www.youtube.com/watch?v=example-mock-interview" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-secondary">
                      <i className="fas fa-video me-2"></i>
                      Open Mock Interview Video
                    </a>
                  </div>
                </div>
                
                <div className="hotkey-info alert alert-warning mb-4">
                  <i className="fas fa-keyboard me-2"></i>
                  <strong>Press {interview?.hotkey || 'Space'}</strong> during the interview to get AI-powered response suggestions
                </div>
                
                <div className="action-buttons">
                  <button 
                    onClick={exitSession} 
                    className="btn btn-outline-secondary me-3"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleConnect} 
                    className="btn btn-primary btn-lg"
                  >
                    <i className="fas fa-headset me-2"></i>
                    Connect to Interview
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="interview-assistant-wrapper">
            <InterviewAssistant 
              sessionContext={interview}
              timeRemaining={timeRemaining}
              onQuestionDetected={updateTranscribedQuestion}
            />
          </div>
        )}
        
        {isFullScreen && (
          <button
            onClick={toggleFullScreen}
            className="exit-fullscreen-btn"
          >
            <i className="fas fa-compress-alt me-2"></i>
            Exit Full Screen
          </button>
        )}
      </div>
      
      {/* AI Response Overlay */}
      {sessionActive && (
        <div 
          ref={overlayRef}
          className={`ai-response-overlay ${showOverlay ? 'visible' : ''}`}
        >
          <div className="overlay-content">
            <div className="overlay-header">
              <i className="fas fa-robot me-2"></i>
              AI Assistant
              {isQueryingAI && (
                <div className="spinner-border spinner-border-sm ms-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </div>
            <div className="overlay-body">
              {overlayResponse || "Press the hotkey to get AI assistance..."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSession;  