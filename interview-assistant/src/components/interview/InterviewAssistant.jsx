// src/components/interview/InterviewAssistant.jsx
import React, { useState, useEffect, useRef } from 'react';
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import useAIResponses from "../hooks/useAIResponses";   
import TranscriptionPanel from './TranscriptionPanel';
import ResponseGenerator from './ResponseGenerator';
import { GradientText, AnimatedButton } from '../ui/AnimatedComponents';
import LoadingSpinner from '../ui/LoadingSpinner';

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  
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
  
  const floatingStyles = isFloating ? {
    position: 'fixed',
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: 1000,
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
  } : {};
  
  return (
    <div 
      ref={assistantRef}
      className={`bg-white rounded-xl overflow-hidden ${isFloating ? 'w-96' : 'w-full'}`}
      style={floatingStyles}
    >
      <div 
        className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 flex justify-between items-center cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center">
          <GradientText className="text-xl font-semibold">
            <span className="text-white">Interview Assistant</span>
          </GradientText>
          {isListening && (
            <span className="flex ml-2">
              <span className="animate-ping absolute h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
              <span className="relative rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-primary-400/30 transition-colors"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={
                isCollapsed ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"
              } />
            </svg>
          </button>
          <button 
            onClick={() => setIsFloating(!isFloating)}
            className="p-1 rounded hover:bg-primary-400/30 transition-colors"
            title={isFloating ? "Dock" : "Float"}
          >
            {isFloating ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
          <button
            onClick={isListening ? stopListening : startListening}
            className={`p-1 rounded transition-colors ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'hover:bg-primary-400/30'
            }`}
            title={isListening ? "Stop Listening" : "Start Listening"}
          >
            {isListening ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {!isCollapsed && (
        <div className={`p-4 ${isFloating ? 'max-h-[70vh] overflow-y-auto' : ''}`}>
          {(transcriptionError || responseError) && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded animate-fade-in">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {transcriptionError || responseError}
              </div>
            </div>
          )}
          
          <TranscriptionPanel 
            transcript={transcript}
            interimTranscript={interimTranscript}
            isListening={isListening}
            history={transcriptionHistory}
            compact={isFloating}
          />
          
          <ResponseGenerator 
            currentResponse={currentResponse}
            setCurrentResponse={setCurrentResponse}
            loading={responseLoading}
            compact={isFloating}
          />
          
          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <div className="flex space-x-4">
              <div className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-primary-500 mr-1"></span>
                <span>Alt+S: Toggle Speech</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-primary-500 mr-1"></span>
                <span>Alt+F: Toggle Float</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-primary-500 mr-1"></span>
                <span>Alt+C: Clear</span>
              </div>
            </div>
            <div>
              <AnimatedButton
                variant="ghost"
                size="sm"
                className="py-1 px-2 text-xs text-red-500 hover:bg-red-50"
                onClick={clearTranscript}
              >
                Reset
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewAssistant;