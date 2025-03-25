import React, { useState, useEffect, useRef } from 'react';
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import useAIResponses from "../hooks/useAIResponses";   
import TranscriptionPanel from './TranscriptionPanel';
import ResponseGenerator from './ResponseGenerator';
import "/src/assets/css/interview.css";

const InterviewAssistant = () => {
  const {
    isListening,
    transcript,
    interimTranscript,
    transcriptionHistory,
    error: transcriptionError,
    startListening,
    stopListening,
    clearTranscript
  } = useSpeechRecognition();
  
  const {
    generateResponse,
    currentResponse,
    loading: responseLoading,
    error: responseError,
    setCurrentResponse
  } = useAIResponses();
  
  const [isFloating, setIsFloating] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const assistantRef = useRef(null);
  
  // Auto-generate response when a new question is detected
  useEffect(() => {
    const latestQuestion = transcriptionHistory.find(item => 
      item.type === 'question' && 
      !transcriptionHistory.some(response => response.questionId === item.id)
    );
    
    if (latestQuestion && !responseLoading) {
      generateResponse(latestQuestion.text, latestQuestion.id);
    }
  }, [transcriptionHistory, generateResponse, responseLoading]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt+S to toggle speech recognition
      if (e.altKey && e.key === 's') {
        if (isListening) {
          stopListening();
        } else {
          startListening();
        }
      }
      
      // Alt+F to toggle floating mode
      if (e.altKey && e.key === 'f') {
        setIsFloating(prev => !prev);
      }
      
      // Alt+C to clear transcript
      if (e.altKey && e.key === 'c') {
        clearTranscript();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isListening, startListening, stopListening, clearTranscript]);
  
  // Dragging functionality for floating mode
  const handleMouseDown = (e) => {
    if (isFloating && assistantRef.current) {
      setIsDragging(true);
      const rect = assistantRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };
  
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);
  
  return (
    <div 
      ref={assistantRef}
      className={`ia-assistant-container ${isFloating ? 'ia-floating' : 'mx-auto'}`}
      style={isFloating ? {left: `${position.x}px`, top: `${position.y}px`} : {}}
      onMouseDown={handleMouseDown}
    >
      <div className="ia-assistant-header">
        <h2 className="ia-assistant-title">Interview Assistant</h2>
        <div className="ia-assistant-controls">
          <button 
            onClick={() => setIsFloating(!isFloating)}
            className="ia-control-btn"
            title={isFloating ? "Dock" : "Float"}
          >
            <i className={`fas ${isFloating ? "fa-thumbtack" : "fa-external-link-alt"}`}></i>
          </button>
          <button
            onClick={isListening ? stopListening : startListening}
            className={`ia-control-btn ${isListening ? 'active' : ''}`}
            title={isListening ? "Stop Listening" : "Start Listening"}
          >
            <i className={`fas ${isListening ? "fa-stop" : "fa-microphone"}`}></i>
          </button>
        </div>
      </div>
      
      <div className="ia-assistant-body">
        {(transcriptionError || responseError) && (
          <div className="alert alert-danger mb-3">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {transcriptionError || responseError}
          </div>
        )}
        
        <div className="ia-transcription">
          <h3 className="ia-transcription-title">Transcription</h3>
          
          {transcriptionHistory.length > 0 && (
            <div className="mb-3">
              <h4 className="small fw-bold mb-2 text-muted">Conversation History:</h4>
              <div className="d-flex flex-column gap-2">
                {transcriptionHistory.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-3 rounded ${
                      item.type === 'question' 
                        ? 'bg-primary-50 border-start border-4 border-primary' 
                        : 'bg-secondary-50 border-start border-4 border-secondary'
                    }`}
                  >
                    <div className="small text-muted mb-1">
                      {item.type === 'question' ? 'Interviewer' : 'AI Assistant'} • {
                        new Date(item.timestamp).toLocaleTimeString()
                      }
                    </div>
                    <div>{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {(transcript || interimTranscript) && (
            <div className="mb-3">
              <h4 className="small fw-bold mb-2 text-muted">Live Transcription:</h4>
              <div className="ia-transcription-content">
                <span>{transcript}</span>
                {interimTranscript && (
                  <span className="text-muted">{interimTranscript}</span>
                )}
                {isListening && !interimTranscript && (
                  <span className="ia-listening-indicator"></span>
                )}
              </div>
            </div>
          )}
          
          {!isListening && !transcript && !interimTranscript && transcriptionHistory.length === 0 && (
            <div className="text-center py-4 text-muted">
              <i className="fas fa-microphone-slash mb-2 fa-2x"></i>
              <p>Press the microphone button or Alt+S to start listening.</p>
            </div>
          )}
        </div>
        
        <div className="ia-response">
          <div className="ia-response-title">
            <h3>AI Response</h3>
            <div className="ia-response-actions">
              {currentResponse && !responseLoading && (
                <>
                  <button
                    onClick={() => {
                      // Here you would implement the actual speech functionality
                      // This is just a placeholder for a real speech API
                      if ('speechSynthesis' in window) {
                        const utterance = new SpeechSynthesisUtterance(currentResponse);
                        speechSynthesis.speak(utterance);
                      }
                    }}
                    className="btn btn-sm btn-outline-secondary"
                    title="Speak response"
                  >
                    <i className="fas fa-volume-up me-1"></i>
                    Speak
                  </button>
                  <button
                    onClick={() => setCurrentResponse('')}
                    className="btn btn-sm btn-outline-secondary"
                    title="Edit response"
                  >
                    <i className="fas fa-edit me-1"></i>
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
          
          {responseLoading ? (
            <div className="ia-response-loading">
              <div className="spinner">
                <div></div>
                <div></div>
                <div></div>
              </div>
              <p>Generating response...</p>
            </div>
          ) : currentResponse ? (
            <div className="ia-response-content">
              {currentResponse}
            </div>
          ) : (
            <div className="ia-response-empty">
              <i className="fas fa-comment-dots mb-2"></i>
              <p>Waiting for interview questions...</p>
            </div>
          )}
          
          {currentResponse && (
            <div className="ia-response-footer">
              <p>
                <i className="fas fa-info-circle me-1"></i>
                This is an AI-generated response. You can edit it before speaking.
              </p>
            </div>
          )}
        </div>
        
        <div className="ia-keyboard-shortcuts">
          <div className="d-flex justify-content-between">
            <div className="ia-shortcut">
              <kbd>Alt</kbd> + <kbd>S</kbd>
              <span>Toggle Speech</span>
            </div>
            <div className="ia-shortcut">
              <kbd>Alt</kbd> + <kbd>F</kbd>
              <span>Toggle Float</span>
            </div>
            <div className="ia-shortcut">
              <kbd>Alt</kbd> + <kbd>C</kbd>
              <span>Clear</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewAssistant;